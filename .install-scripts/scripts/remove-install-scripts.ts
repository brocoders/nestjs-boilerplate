import replace from '../helpers/replace';
import path from 'path';
import fs from 'fs';

const removeInstallScripts = async () => {
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
    ],
  });
  fs.rmSync(path.join(process.cwd(), '.install-scripts'), {
    recursive: true,
    force: true,
  });
};

export default removeInstallScripts;
