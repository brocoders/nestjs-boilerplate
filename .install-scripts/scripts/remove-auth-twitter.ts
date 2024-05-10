import replace from '../helpers/replace';
import path from 'path';
import fs from 'fs';

const removeTwitterAuth = async () => {
  replace({
    path: path.join(process.cwd(), 'src', 'app.module.ts'),
    actions: [
      {
        find: /\s*AuthTwitterModule\,.*/g,
        replace: '',
      },
      {
        find: /\s*twitterConfig\,.*/g,
        replace: '',
      },
      {
        find: /\s*import \{ AuthTwitterModule \} from \'\.\/auth-twitter\/auth-twitter\.module\'\;.*/g,
        replace: '',
      },
      {
        find: /\s*import twitterConfig from \'\.\/auth-twitter\/config\/twitter\.config\'\;.*/g,
        replace: '',
      },
    ],
  });
  replace({
    path: path.join(process.cwd(), 'src', 'config', 'config.type.ts'),
    actions: [
      {
        find: /\s*twitter\: TwitterConfig.*/g,
        replace: '',
      },
      {
        find: /\s*import \{ TwitterConfig \}.*/g,
        replace: '',
      },
    ],
  });
  replace({
    path: path.join(process.cwd(), 'package.json'),
    actions: [
      {
        find: /,\s*\"twitter\":.*\"/g,
        replace: '',
      },
      {
        find: /\s*\"twitter\":.*\,/g,
        replace: '',
      },
      {
        find: /\s*\"@types\/twitter\":.*/g,
        replace: '',
      },
    ],
  });
  fs.rmSync(path.join(process.cwd(), 'src', 'auth-twitter'), {
    recursive: true,
    force: true,
  });
};

export default removeTwitterAuth;
