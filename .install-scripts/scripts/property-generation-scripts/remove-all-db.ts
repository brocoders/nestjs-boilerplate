import replace from '../../helpers/replace';
import path from 'path';
import fs from 'fs';

const removeAllDbPropertyGeneration = async () => {
  const filesToRemove = [
    path.join(process.cwd(), '.hygen', 'property', 'add-to-all-db'),
  ];

  replace({
    path: path.join(process.cwd(), 'package.json'),
    actions: [
      {
        find: /\s*\"add:property:to-all-db\":.*/g,
        replace: '',
      },
      {
        find: /\s*\"postadd:property:to-all-db\":.*/g,
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

export default removeAllDbPropertyGeneration;
