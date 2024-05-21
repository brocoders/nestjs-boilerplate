import replace from '../helpers/replace';
import path from 'path';
import fs from 'fs';

const removeMongoDb = async () => {
  const filesToRemove = [
    path.join(
      process.cwd(),
      'src',
      'files',
      'infrastructure',
      'persistence',
      'document',
    ),
    path.join(
      process.cwd(),
      'src',
      'session',
      'infrastructure',
      'persistence',
      'document',
    ),
    path.join(
      process.cwd(),
      'src',
      'users',
      'infrastructure',
      'persistence',
      'document',
    ),
    path.join(process.cwd(), 'src', 'database', 'mongoose-config.service.ts'),
    path.join(process.cwd(), 'src', 'database', 'seeds', 'document'),
    path.join(
      process.cwd(),
      'src',
      'roles',
      'infrastructure',
      'persistence',
      'document',
    ),
    path.join(
      process.cwd(),
      'src',
      'statuses',
      'infrastructure',
      'persistence',
      'document',
    ),
    path.join(process.cwd(), 'env-example-document'),
    path.join(process.cwd(), 'docker-compose.document.ci.yaml'),
    path.join(process.cwd(), 'docker-compose.document.test.yaml'),
    path.join(process.cwd(), 'docker-compose.document.yaml'),
    path.join(process.cwd(), 'startup.document.ci.sh'),
    path.join(process.cwd(), 'startup.document.dev.sh'),
    path.join(process.cwd(), 'startup.document.test.sh'),
    path.join(process.cwd(), 'document.Dockerfile'),
    path.join(process.cwd(), 'document.e2e.Dockerfile'),
    path.join(process.cwd(), 'document.test.Dockerfile'),
    path.join(process.cwd(), '.hygen', 'seeds', 'create-document'),
    path.join(process.cwd(), 'src', 'utils', 'document-entity-helper.ts'),
  ];

  replace({
    path: path.join(process.cwd(), '.github', 'workflows', 'docker-e2e.yml'),
    actions: [
      {
        find: /\# <database-document-block>.*\# <\/database-document-block>/gs,
        replace: '',
      },
    ],
  });
  replace({
    path: path.join(process.cwd(), 'src', 'app.module.ts'),
    actions: [
      {
        find: /\/\/ <database-block>.*\/\/ <\/database-block>/gs,
        replace: `const infrastructureDatabaseModule = TypeOrmModule.forRootAsync({
  useClass: TypeOrmConfigService,
  dataSourceFactory: async (options: DataSourceOptions) => {
    return new DataSource(options).initialize();
  },
});`,
      },
      {
        find: /\s*import \{ MongooseModule \} from .*/g,
        replace: '',
      },
      {
        find: /\s*import \{ MongooseConfigService \} from .*/g,
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
        replace: `const infrastructurePersistenceModule = RelationalFilePersistenceModule;`,
      },
      {
        find: /\s*import \{ DocumentFilePersistenceModule \} from .*/g,
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
        replace: `const infrastructurePersistenceModule = RelationalFilePersistenceModule;`,
      },
      {
        find: /\s*import \{ DocumentFilePersistenceModule \} from .*/g,
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
        replace: `const infrastructurePersistenceModule = RelationalFilePersistenceModule;`,
      },
      {
        find: /\s*import \{ DocumentFilePersistenceModule \} from .*/g,
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
        replace: `const infrastructurePersistenceModule = RelationalFilePersistenceModule;`,
      },
      {
        find: /\s*import \{ DocumentFilePersistenceModule \} from .*/g,
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
        replace: `const infrastructurePersistenceModule = RelationalSessionPersistenceModule;`,
      },
      {
        find: /\s*import \{ DocumentSessionPersistenceModule \} from .*/g,
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
        replace: `const infrastructurePersistenceModule = RelationalUserPersistenceModule;`,
      },
      {
        find: /\s*import \{ DocumentUserPersistenceModule \} from .*/g,
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
        replace: `const idType = Number;`,
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
        replace: `const idType = Number;`,
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
        replace: `const idType = Number;`,
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
        find: /\s*\"@nestjs\/mongoose\":.*/g,
        replace: '',
      },
      {
        find: /\s*\"mongoose\":.*/g,
        replace: '',
      },
      {
        find: /\s*\"seed:run:document\":.*/g,
        replace: '',
      },
      {
        find: /\s*\"seed:create:document\":.*/g,
        replace: '',
      },
      {
        find: /\s*\"test:e2e:document:docker\":.*/g,
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

export default removeMongoDb;
