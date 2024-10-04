import replace from '../../helpers/replace';
import path from 'path';
import fs from 'fs';

const removeRelationalPropertyGeneration = async () => {
  const filesToRemove = [
    path.join(process.cwd(), '.hygen', 'property', 'add-to-relational'),
  ];

  replace({
    path: path.join(process.cwd(), 'package.json'),
    actions: [
      {
        find: /\s*\"add:property:to-relational\":.*/g,
        replace: '',
      },
      {
        find: /\s*\"postadd:property:to-relational\":.*/g,
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

export default removeRelationalPropertyGeneration;
