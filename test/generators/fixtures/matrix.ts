export type PrimitiveType = 'string' | 'number' | 'boolean' | 'Date';
export type ReferenceType =
  | 'oneToOne'
  | 'oneToMany'
  | 'manyToOne'
  | 'manyToMany';

export interface PrimitiveProperty {
  property: string;
  kind: 'primitive';
  type: PrimitiveType;
  isAddToDto: boolean;
  isOptional: boolean;
  isNullable: boolean;
}

export interface ReferenceProperty {
  property: string;
  kind: 'reference' | 'denormalized';
  type: string;
  referenceType: ReferenceType;
  propertyInReference?: string;
  isAddToDto: boolean;
  isOptional: boolean;
  isNullable: boolean;
  shouldAutoLoad?: boolean;
}

export type GeneratedProperty = PrimitiveProperty | ReferenceProperty;

export interface GeneratedEntity {
  name: string;
  properties: GeneratedProperty[];
}

export interface InverseEntity {
  name: string;
  property: string;
  fromEntity: string;
  fromProperty: string;
}

export interface Matrix {
  entities: GeneratedEntity[];
  inverses: InverseEntity[];
}

const articleProperties: GeneratedProperty[] = [
  {
    property: 'title',
    kind: 'primitive',
    type: 'string',
    isAddToDto: true,
    isOptional: false,
    isNullable: false,
  },
  {
    property: 'subtitle',
    kind: 'primitive',
    type: 'string',
    isAddToDto: true,
    isOptional: true,
    isNullable: false,
  },
  {
    property: 'summary',
    kind: 'primitive',
    type: 'string',
    isAddToDto: true,
    isOptional: true,
    isNullable: true,
  },
  {
    property: 'views',
    kind: 'primitive',
    type: 'number',
    isAddToDto: true,
    isOptional: false,
    isNullable: false,
  },
  {
    property: 'isPublished',
    kind: 'primitive',
    type: 'boolean',
    isAddToDto: true,
    isOptional: false,
    isNullable: false,
  },
  {
    property: 'publishedAt',
    kind: 'primitive',
    type: 'Date',
    isAddToDto: true,
    isOptional: true,
    isNullable: true,
  },
  {
    property: 'hireDate',
    kind: 'primitive',
    type: 'Date',
    isAddToDto: true,
    isOptional: false,
    isNullable: false,
  },
  {
    property: 'coverImage',
    kind: 'reference',
    type: 'File',
    referenceType: 'oneToOne',
    isAddToDto: true,
    isOptional: true,
    isNullable: true,
  },
  {
    property: 'author',
    kind: 'reference',
    type: 'User',
    referenceType: 'manyToOne',
    isAddToDto: true,
    isOptional: false,
    isNullable: false,
  },
  {
    property: 'tags',
    kind: 'reference',
    type: 'Tag',
    referenceType: 'manyToMany',
    isAddToDto: true,
    isOptional: true,
    isNullable: false,
  },
  {
    property: 'comments',
    kind: 'reference',
    type: 'Comment',
    referenceType: 'oneToMany',
    propertyInReference: 'article',
    isAddToDto: false,
    isOptional: true,
    isNullable: false,
  },
  {
    property: 'denormalizedAuthor',
    kind: 'denormalized',
    type: 'User',
    referenceType: 'manyToOne',
    isAddToDto: true,
    isOptional: false,
    isNullable: false,
  },
  {
    property: 'editor',
    kind: 'reference',
    type: 'User',
    referenceType: 'manyToOne',
    isAddToDto: true,
    isOptional: true,
    isNullable: false,
    shouldAutoLoad: false,
  },
  {
    property: 'internalNote',
    kind: 'primitive',
    type: 'string',
    isAddToDto: false,
    isOptional: true,
    isNullable: true,
  },
];

export const matrix: Matrix = {
  entities: [
    {
      name: 'Tag',
      properties: [
        {
          property: 'name',
          kind: 'primitive',
          type: 'string',
          isAddToDto: true,
          isOptional: false,
          isNullable: false,
        },
      ],
    },
    {
      name: 'Comment',
      properties: [
        {
          property: 'text',
          kind: 'primitive',
          type: 'string',
          isAddToDto: true,
          isOptional: false,
          isNullable: false,
        },
      ],
    },
    {
      name: 'Article',
      properties: articleProperties,
    },
  ],
  inverses: [
    {
      name: 'Comment',
      property: 'article',
      fromEntity: 'Article',
      fromProperty: 'comments',
    },
  ],
};

export interface EntityPaths {
  domain: string;
  domainDto: string;
  createDto: string;
  updateDto: string;
  findAllDto: string;
  module: string;
  controller: string;
  service: string;
  relationalEntity: string;
  documentSchema: string;
}

export function pluralKebab(name: string): string {
  const lower = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  if (lower.endsWith('y')) return lower.slice(0, -1) + 'ies';
  if (lower.endsWith('s') || lower.endsWith('x') || lower.endsWith('z'))
    return lower + 'es';
  return lower + 's';
}

export function singularKebab(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

export function entityPaths(name: string, srcRoot: string): EntityPaths {
  const dir = pluralKebab(name);
  const file = singularKebab(name);
  const base = `${srcRoot}/${dir}`;
  return {
    domain: `${base}/domain/${file}.ts`,
    domainDto: `${base}/dto/${file}.dto.ts`,
    createDto: `${base}/dto/create-${file}.dto.ts`,
    updateDto: `${base}/dto/update-${file}.dto.ts`,
    findAllDto: `${base}/dto/find-all-${dir}.dto.ts`,
    module: `${base}/${dir}.module.ts`,
    controller: `${base}/${dir}.controller.ts`,
    service: `${base}/${dir}.service.ts`,
    relationalEntity: `${base}/infrastructure/persistence/relational/entities/${file}.entity.ts`,
    documentSchema: `${base}/infrastructure/persistence/document/entities/${file}.schema.ts`,
  };
}
