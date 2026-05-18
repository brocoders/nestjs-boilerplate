import replace from '../helpers/replace';
import path from 'path';
import fs from 'fs';

const removeInstallScripts = () => {
  replace({
    path: path.join(process.cwd(), 'package.json'),
    actions: [
      {
        find: /\s*\"app:config\".*/g,
        replace: '',
      },
      {
        find: /\s*\"@types\/prompts\"\:.*/g,
        replace: '',
      },
      {
        find: /\s*\"test:generators:relational\".*/g,
        replace: '',
      },
      {
        find: /\s*\"test:generators:document\".*/g,
        replace: '',
      },
      {
        find: /\s*\"test:e2e:generators:relational:docker\".*/g,
        replace: '',
      },
      {
        find: /\s*\"test:e2e:generators:document:docker\".*/g,
        replace: '',
      },
    ],
  });
  fs.rmSync(path.join(process.cwd(), '.install-scripts'), {
    recursive: true,
    force: true,
  });
  fs.rmSync(path.join(process.cwd(), '.github', 'workflows', 'cli.yml'), {
    force: true,
  });
  fs.rmSync(path.join(process.cwd(), 'test', 'generators'), {
    recursive: true,
    force: true,
  });
  fs.rmSync(
    path.join(process.cwd(), 'docker-compose.generators-relational.test.yaml'),
    {
      force: true,
    },
  );
};

export default removeInstallScripts;
