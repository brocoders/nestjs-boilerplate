import replace from '../helpers/replace';
import path from 'path';
import fs from 'fs';

const removeEslintPrettier = () => {
  replace({
    path: path.join(process.cwd(), 'package.json'),
    actions: [
      {
        find: /\s*\"@eslint\/eslintrc\":.*/g,
        replace: '',
      },
      {
        find: /\s*\"@eslint\/js\":.*/g,
        replace: '',
      },
      {
        find: /\s*\"@typescript-eslint\/eslint-plugin\":.*/g,
        replace: '',
      },
      {
        find: /\s*\"@typescript-eslint\/parser\":.*/g,
        replace: '',
      },
      {
        find: /\s*\"eslint\":.*/g,
        replace: '',
      },
      {
        find: /\s*\"eslint-config-prettier\":.*/g,
        replace: '',
      },
      {
        find: /\s*\"eslint-plugin-prettier\":.*/g,
        replace: '',
      },
      {
        find: /\s*\"globals\":.*/g,
        replace: '',
      },
      {
        find: /\s*\"prettier\":.*/g,
        replace: '',
      },
      {
        find: /\"format\": \"prettier --write \\\"src\/\*\*\/\*\.ts\\\" \\\"test\/\*\*\/\*\.ts\\\"\"/g,
        replace:
          '"format": "biome format --write src/ test/ .install-scripts/"',
      },
      {
        find: /\"lint\": \"eslint \\\"\{src,apps,libs,test\}\/\*\*\/\*\.ts\\\"\"/g,
        replace: '"lint": "biome check --write src/ test/ .install-scripts/"',
      },
      {
        find: /npm run lint -- --fix/g,
        replace: 'npm run lint',
      },
    ],
  });

  replace({
    path: path.join(process.cwd(), 'package.json'),
    actions: [
      {
        find: /(\s*\"@biomejs\/biome\":.*)/g,
        replace: '',
      },
    ],
  });

  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  packageJson.devDependencies['@biomejs/biome'] = '1.9.4';
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + '\n',
    'utf-8',
  );

  const biomeConfig = {
    $schema: 'https://biomejs.dev/schemas/1.9.4/schema.json',
    organizeImports: {
      enabled: true,
    },
    formatter: {
      enabled: true,
      indentStyle: 'space',
      indentWidth: 2,
      lineWidth: 100,
      formatWithErrors: false,
    },
    linter: {
      enabled: true,
      rules: {
        recommended: true,
        correctness: {
          noUnusedVariables: 'error',
        },
        style: {
          noNonNullAssertion: 'off',
          useSingleVarDeclarator: 'off',
          useImportType: 'off',
        },
        suspicious: {
          noExplicitAny: 'off',
          noConfusingVoidType: 'off',
        },
      },
    },
    javascript: {
      formatter: {
        quoteStyle: 'single',
        trailingCommas: 'all',
      },
    },
    files: {
      ignore: ['dist', 'coverage', 'node_modules'],
    },
  };

  fs.writeFileSync(
    path.join(process.cwd(), 'biome.json'),
    JSON.stringify(biomeConfig, null, 2) + '\n',
    'utf-8',
  );

  const eslintConfigPath = path.join(process.cwd(), 'eslint.config.mjs');
  if (fs.existsSync(eslintConfigPath)) {
    fs.rmSync(eslintConfigPath, { force: true });
  }

  const prettierRcPath = path.join(process.cwd(), '.prettierrc');
  if (fs.existsSync(prettierRcPath)) {
    fs.rmSync(prettierRcPath, { force: true });
  }

  replace({
    path: path.join(process.cwd(), '.husky', 'pre-commit'),
    actions: [
      {
        find: /npm run lint/g,
        replace: 'npx biome check src/ test/ .install-scripts/',
      },
    ],
  });
};

export default removeEslintPrettier;
