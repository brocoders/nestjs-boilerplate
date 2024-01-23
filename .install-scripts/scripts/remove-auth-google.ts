import replace from '../helpers/replace';
import path from 'path';
import fs from 'fs';

const removeGoogleAuth = async () => {
  replace({
    path: path.join(process.cwd(), 'src', 'app.module.ts'),
    actions: [
      {
        find: /\s*AuthGoogleModule\,.*/g,
        replace: '',
      },
      {
        find: /\s*googleConfig\,.*/g,
        replace: '',
      },
      {
        find: /\s*import \{ AuthGoogleModule \} from \'\.\/auth\-google\/auth\-google\.module\'\;.*/g,
        replace: '',
      },
      {
        find: /\s*import googleConfig from \'\.\/auth\-google\/config\/google\.config\'\;.*/g,
        replace: '',
      },
    ],
  });
  replace({
    path: path.join(process.cwd(), 'src', 'config', 'config.type.ts'),
    actions: [
      {
        find: /\s*google\: GoogleConfig.*/g,
        replace: '',
      },
      {
        find: /\s*import \{ GoogleConfig \}.*/g,
        replace: '',
      },
    ],
  });
  replace({
    path: path.join(process.cwd(), 'package.json'),
    actions: [
      {
        find: /\s*\"google-auth-library\":.*/g,
        replace: '',
      },
    ],
  });
  fs.rmSync(path.join(process.cwd(), 'src', 'auth-google'), {
    recursive: true,
    force: true,
  });
};

export default removeGoogleAuth;
