import replace from '../helpers/replace';
import path from 'path';
import fs from 'fs';

const removePostgreSql = async () => {
  const filesToRemove = [
    path.join(
      process.cwd(),
      'src',
      'files',
      'infrastructure',
      'persistence',
      'relational',
    ),
    path.join(
      process.cwd(),
      'src',
      'session',
      'infrastructure',
      'persistence',
      'relational',
    ),
    path.join(
      process.cwd(),
      'src',
      'users',
      'infrastructure',
      'persistence',
      'relational',
    ),
    path.join(process.cwd(), 'src', 'database', 'migrations'),
    path.join(process.cwd(), 'src', 'database', 'data-source.ts'),
    path.join(process.cwd(), 'src', 'database', 'typeorm-config.service.ts'),
    path.join(process.cwd(), 'src', 'database', 'seeds', 'relational'),
    path.join(
      process.cwd(),
      'src',
      'roles',
      'infrastructure',
      'persistence',
      'relational',
    ),
    path.join(
      process.cwd(),
      'src',
      'statuses',
      'infrastructure',
      'persistence',
      'relational',
    ),
    path.join(process.cwd(), 'env-example-relational'),
    path.join(process.cwd(), 'docker-compose.relational.ci.yaml'),
    path.join(process.cwd(), 'docker-compose.relational.test.yaml'),
    path.join(process.cwd(), 'docker-compose.yaml'),
    path.join(process.cwd(), 'startup.relational.ci.sh'),
    path.join(process.cwd(), 'startup.relational.test.sh'),
    path.join(process.cwd(), 'startup.relational.dev.sh'),
    path.join(process.cwd(), 'Dockerfile'),
    path.join(process.cwd(), 'relational.e2e.Dockerfile'),
    path.join(process.cwd(), 'relational.test.Dockerfile'),
    path.join(process.cwd(), '.hygen', 'seeds', 'create-relational'),
    path.join(process.cwd(), 'src', 'utils', 'relational-entity-helper.ts'),
  ];

  replace({
    path: path.join(process.cwd(), '.github', 'workflows', 'docker-e2e.yml'),
    actions: [
      {
        find: /\# <database-relational-block>.*\# <\/database-relational-block>/gs,
        replace: '',
      },
    ],
  });
  replace({
    path: path.join(process.cwd(), 'src', 'app.module.ts'),
    actions: [
      {
        find: /\/\/ <database-block>.*\/\/ <\/database-block>/gs,
        replace: `const infrastructureDatabaseModule = MongooseModule.forRootAsync({
  useClass: MongooseConfigService,
});`,
      },
      {
        find: /\s*import \{ TypeOrmModule \} from .*/g,
        replace: '',
      },
      {
        find: /\s*import \{ TypeOrmConfigService \} from .*/g,
        replace: '',
      },
      {
        find: /\s*import \{ DataSource, DataSourceOptions \} from .*/g,
        replace: '',
      },
      {
        find: /\s*import \{ DatabaseConfig \} from .*/g,
        replace: '',
      },
    ],
  });
  replace({
    path: path.join(process.cwd(), 'src', 'files', 'files.module.ts'),
    actions: [
      {
        find: /\/\/ <database-block>.*\/\/ <\/database-block>/gs,
        replace: `const infrastructurePersistenceModule = DocumentFilePersistenceModule;`,
      },
      {
        find: /\s*import \{ RelationalFilePersistenceModule \} from .*/g,
        replace: '',
      },
      {
        find: /\s*import \{ DatabaseConfig \} from .*/g,
        replace: '',
      },
      {
        find: /\s*import databaseConfig from .*/g,
        replace: '',
      },
    ],
  });
  replace({
    path: path.join(
      process.cwd(),
      'src',
      'files',
      'infrastructure',
      'uploader',
      'local',
      'files.module.ts',
    ),
    actions: [
      {
        find: /\/\/ <database-block>.*\/\/ <\/database-block>/gs,
        replace: `const infrastructurePersistenceModule = DocumentFilePersistenceModule;`,
      },
      {
        find: /\s*import \{ RelationalFilePersistenceModule \} from .*/g,
        replace: '',
      },
      {
        find: /\s*import \{ DatabaseConfig \} from .*/g,
        replace: '',
      },
      {
        find: /\s*import databaseConfig from .*/g,
        replace: '',
      },
    ],
  });
  replace({
    path: path.join(
      process.cwd(),
      'src',
      'files',
      'infrastructure',
      'uploader',
      's3',
      'files.module.ts',
    ),
    actions: [
      {
        find: /\/\/ <database-block>.*\/\/ <\/database-block>/gs,
        replace: `const infrastructurePersistenceModule = DocumentFilePersistenceModule;`,
      },
      {
        find: /\s*import \{ RelationalFilePersistenceModule \} from .*/g,
        replace: '',
      },
      {
        find: /\s*import \{ DatabaseConfig \} from .*/g,
        replace: '',
      },
      {
        find: /\s*import databaseConfig from .*/g,
        replace: '',
      },
    ],
  });
  replace({
    path: path.join(
      process.cwd(),
      'src',
      'files',
      'infrastructure',
      'uploader',
      's3-presigned',
      'files.module.ts',
    ),
    actions: [
      {
        find: /\/\/ <database-block>.*\/\/ <\/database-block>/gs,
        replace: `const infrastructurePersistenceModule = DocumentFilePersistenceModule;`,
      },
      {
        find: /\s*import \{ RelationalFilePersistenceModule \} from .*/g,
        replace: '',
      },
      {
        find: /\s*import \{ DatabaseConfig \} from .*/g,
        replace: '',
      },
      {
        find: /\s*import databaseConfig from .*/g,
        replace: '',
      },
    ],
  });
  replace({
    path: path.join(process.cwd(), 'src', 'session', 'session.module.ts'),
    actions: [
      {
        find: /\/\/ <database-block>.*\/\/ <\/database-block>/gs,
        replace: `const infrastructurePersistenceModule = DocumentSessionPersistenceModule;`,
      },
      {
        find: /\s*import \{ RelationalSessionPersistenceModule \} from .*/g,
        replace: '',
      },
      {
        find: /\s*import \{ DatabaseConfig \} from .*/g,
        replace: '',
      },
      {
        find: /\s*import databaseConfig from .*/g,
        replace: '',
      },
    ],
  });
  replace({
    path: path.join(process.cwd(), 'src', 'users', 'users.module.ts'),
    actions: [
      {
        find: /\/\/ <database-block>.*\/\/ <\/database-block>/gs,
        replace: `const infrastructurePersistenceModule = DocumentUserPersistenceModule;`,
      },
      {
        find: /\s*import \{ RelationalUserPersistenceModule \} from .*/g,
        replace: '',
      },
      {
        find: /\s*import \{ DatabaseConfig \} from .*/g,
        replace: '',
      },
      {
        find: /\s*import databaseConfig from .*/g,
        replace: '',
      },
    ],
  });
  replace({
    path: path.join(process.cwd(), 'src', 'users', 'domain', 'user.ts'),
    actions: [
      {
        find: /\/\/ <database-block>.*\/\/ <\/database-block>/gs,
        replace: `const idType = String;`,
      },
      {
        find: /\s*import \{ DatabaseConfig \} from .*/g,
        replace: '',
      },
      {
        find: /\s*import databaseConfig from .*/g,
        replace: '',
      },
    ],
  });
  replace({
    path: path.join(process.cwd(), 'src', 'statuses', 'domain', 'status.ts'),
    actions: [
      {
        find: /\/\/ <database-block>.*\/\/ <\/database-block>/gs,
        replace: `const idType = String;`,
      },
      {
        find: /\s*import \{ DatabaseConfig \} from .*/g,
        replace: '',
      },
      {
        find: /\s*import databaseConfig from .*/g,
        replace: '',
      },
    ],
  });
  replace({
    path: path.join(process.cwd(), 'src', 'roles', 'domain', 'role.ts'),
    actions: [
      {
        find: /\/\/ <database-block>.*\/\/ <\/database-block>/gs,
        replace: `const idType = String;`,
      },
      {
        find: /\s*import \{ DatabaseConfig \} from .*/g,
        replace: '',
      },
      {
        find: /\s*import databaseConfig from .*/g,
        replace: '',
      },
    ],
  });
  replace({
    path: path.join(process.cwd(), 'package.json'),
    actions: [
      {
        find: /\s*\"@nestjs\/typeorm\":.*/g,
        replace: '',
      },
      {
        find: /,\s*\"typeorm\":.*\"/g,
        replace: '',
      },
      {
        find: /\s*\"typeorm\":.*\,/g,
        replace: '',
      },
      {
        find: /\s*\"migration:generate\":.*/g,
        replace: '',
      },
      {
        find: /\s*\"migration:create\":.*/g,
        replace: '',
      },
      {
        find: /\s*\"migration:run\":.*/g,
        replace: '',
      },
      {
        find: /\s*\"migration:revert\":.*/g,
        replace: '',
      },
      {
        find: /\s*\"seed:create:relational\":.*/g,
        replace: '',
      },
      {
        find: /\s*\"seed:run:relational\":.*/g,
        replace: '',
      },
      {
        find: /\s*\"schema:drop\":.*/g,
        replace: '',
      },
      {
        find: /\s*\"test:e2e:relational:docker\":.*/g,
        replace: '',
      },
      {
        find: /\s*\"pg\":.*/g,
        replace: '',
      },
    ],
  });

  filesToRemove.map((file) => {
    fs.rmSync(file, {
      recursive: true,
      force: true,
    });
  });
};

export default removePostgreSql;
