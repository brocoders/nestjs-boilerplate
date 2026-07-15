import { describe, expect, it } from '@jest/globals';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

import type {
  GeneratedEntity,
  GeneratedProperty,
  ReferenceProperty,
} from './fixtures/matrix';
import { entityPaths, matrix } from './fixtures/matrix';

const REPO_ROOT = resolve(__dirname, '..', '..');
const SRC = resolve(REPO_ROOT, 'src');

function readFile(absPath: string): string {
  return readFileSync(absPath, 'utf8');
}

function findPropertyLineIndex(content: string, property: string): number {
  const lines = content.split('\n');
  const re = new RegExp(`(^|[\\s,(])${property}[?!]?\\s*:\\s*`);
  return lines.findIndex((line) => re.test(line));
}

function precedingApiProperty(content: string, property: string): boolean {
  const lines = content.split('\n');
  const idx = findPropertyLineIndex(content, property);
  if (idx < 0) return false;
  let start = 0;
  for (let i = idx - 1; i >= 0; i--) {
    if (lines[i].trimEnd().endsWith(';')) {
      start = i + 1;
      break;
    }
  }
  const window = lines.slice(start, idx).join('\n');
  return window.includes('@ApiProperty(');
}

function assertContainsProperty(
  filePath: string,
  property: GeneratedProperty,
): void {
  const content = readFile(filePath);
  expect(
    findPropertyLineIndex(content, property.property),
  ).toBeGreaterThanOrEqual(0);
  if (property.isNullable) {
    const re = new RegExp(
      `${property.property}[?!]?\\s*:[^;]*\\|\\s*null`,
      'm',
    );
    expect(content).toMatch(re);
  }
  if (property.isOptional || !property.isAddToDto) {
    const re = new RegExp(`${property.property}\\?\\s*:`);
    expect(content).toMatch(re);
  }
}

describe('Generators — file-level assertions', () => {
  describe.each(matrix.entities)('entity $name', (entity: GeneratedEntity) => {
    const paths = entityPaths(entity.name, SRC);

    it('should scaffold all expected files', () => {
      expect(existsSync(paths.domain)).toBe(true);
      expect(existsSync(paths.domainDto)).toBe(true);
      expect(existsSync(paths.createDto)).toBe(true);
      expect(existsSync(paths.updateDto)).toBe(true);
      expect(existsSync(paths.findAllDto)).toBe(true);
      expect(existsSync(paths.module)).toBe(true);
      expect(existsSync(paths.controller)).toBe(true);
      expect(existsSync(paths.service)).toBe(true);
    });

    it.each(entity.properties)(
      'should declare $property on the domain class',
      (property: GeneratedProperty) => {
        assertContainsProperty(paths.domain, property);
      },
    );

    it.each(entity.properties)(
      'should include $property in the create DTO file',
      (property: GeneratedProperty) => {
        assertContainsProperty(paths.createDto, property);
      },
    );

    const withDto = entity.properties.filter((p) => p.isAddToDto);
    if (withDto.length > 0) {
      it.each(withDto)(
        'should decorate $property with @ApiProperty in the create DTO (isAddToDto=true)',
        (property: GeneratedProperty) => {
          const content = readFile(paths.createDto);
          expect(precedingApiProperty(content, property.property)).toBe(true);
        },
      );
    }

    const withoutDto = entity.properties.filter((p) => !p.isAddToDto);
    if (withoutDto.length > 0) {
      it.each(withoutDto)(
        'should NOT decorate $property with @ApiProperty in the create DTO (isAddToDto=false)',
        (property: GeneratedProperty) => {
          const content = readFile(paths.createDto);
          expect(precedingApiProperty(content, property.property)).toBe(false);
        },
      );
    }
  });

  if (matrix.inverses.length > 0) {
    describe('oneToMany inverse generation', () => {
      it.each(matrix.inverses)(
        'should auto-create $name.$property manyToOne for $fromEntity.$fromProperty oneToMany',
        (inv) => {
          const paths = entityPaths(inv.name, SRC);
          const content = readFile(paths.domain);
          expect(
            findPropertyLineIndex(content, inv.property),
          ).toBeGreaterThanOrEqual(0);
        },
      );
    });
  }

  describe('app.module.ts wiring', () => {
    const appModule = readFile(resolve(SRC, 'app.module.ts'));
    it.each(matrix.entities.map((e) => e.name))(
      'should import the module for %s',
      (name) => {
        const plural = name.endsWith('y')
          ? name.slice(0, -1) + 'ies'
          : name.endsWith('s')
            ? name + 'es'
            : name + 's';
        expect(appModule).toContain(`${plural}Module`);
      },
    );
  });

  describe('reference auto-load flag', () => {
    const referenceCases: Array<{
      entity: string;
      property: ReferenceProperty;
    }> = matrix.entities.flatMap((entity) =>
      entity.properties
        .filter(
          (p): p is ReferenceProperty =>
            p.kind === 'reference' && !p.propertyInReference,
        )
        .map((property) => ({ entity: entity.name, property })),
    );

    function decoratorBlockAbove(
      content: string,
      property: string,
    ): string | null {
      const lines = content.split('\n');
      const idx = findPropertyLineIndex(content, property);
      if (idx < 0) return null;
      let start = idx;
      for (let i = idx - 1; i >= 0; i--) {
        const trimmed = lines[i].trim();
        if (trimmed === '' || trimmed.endsWith(';')) break;
        start = i;
      }
      return lines.slice(start, idx + 1).join('\n');
    }

    if (referenceCases.length > 0) {
      it.each(referenceCases)(
        'relational entity for $entity.$property.property reflects shouldAutoLoad',
        ({ entity, property }) => {
          const paths = entityPaths(entity, SRC);
          if (!existsSync(paths.relationalEntity)) return;
          const block = decoratorBlockAbove(
            readFile(paths.relationalEntity),
            property.property,
          );
          expect(block).not.toBeNull();
          const expected = property.shouldAutoLoad === false ? 'false' : 'true';
          expect(block).toContain(`eager: ${expected}`);
        },
      );

      it.each(referenceCases)(
        'document schema for $entity.$property.property reflects shouldAutoLoad',
        ({ entity, property }) => {
          const paths = entityPaths(entity, SRC);
          if (!existsSync(paths.documentSchema)) return;
          const block = decoratorBlockAbove(
            readFile(paths.documentSchema),
            property.property,
          );
          expect(block).not.toBeNull();
          if (property.shouldAutoLoad === false) {
            expect(block).not.toContain('autopopulate: true');
          } else {
            expect(block).toContain('autopopulate: true');
          }
        },
      );
    }
  });
});
