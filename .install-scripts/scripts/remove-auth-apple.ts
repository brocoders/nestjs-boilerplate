import replace from '../helpers/replace';
import path from 'path';
import fs from 'fs';

const removeAppleAuth = async () => {
  replace({
    path: path.join(process.cwd(), 'src', 'app.module.ts'),
    actions: [
      {
        find: /\s*AuthAppleModule\,.*/g,
        replace: '',
      },
      {
        find: /\s*appleConfig\,.*/g,
        replace: '',
      },
      {
        find: /\s*import \{ AuthAppleModule \} from \'\.\/auth\-apple\/auth\-apple\.module\'\;.*/g,
        replace: '',
      },
      {
        find: /\s*import appleConfig from \'\.\/auth\-apple\/config\/apple\.config\'\;.*/g,
        replace: '',
      },
    ],
  });
  replace({
    path: path.join(process.cwd(), 'src', 'config', 'config.type.ts'),
    actions: [
      {
        find: /\s*apple\: AppleConfig.*/g,
        replace: '',
      },
      {
        find: /\s*import \{ AppleConfig \}.*/g,
        replace: '',
      },
    ],
  });
  replace({
    path: path.join(process.cwd(), 'package.json'),
    actions: [
      {
        find: /\s*\"apple-signin-auth\":.*/g,
        replace: '',
      },
    ],
  });
  fs.rmSync(path.join(process.cwd(), 'src', 'auth-apple'), {
    recursive: true,
    force: true,
  });
};

export default removeAppleAuth;
