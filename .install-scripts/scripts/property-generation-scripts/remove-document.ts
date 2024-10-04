import replace from '../../helpers/replace';
import path from 'path';
import fs from 'fs';

const removeDocumentPropertyGeneration = async () => {
  const filesToRemove = [
    path.join(process.cwd(), '.hygen', 'property', 'add-to-document'),
  ];

  replace({
    path: path.join(process.cwd(), 'package.json'),
    actions: [
      {
        find: /\s*\"add:property:to-document\":.*/g,
        replace: '',
      },
      {
        find: /\s*\"postadd:property:to-document\":.*/g,
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

export default removeDocumentPropertyGeneration;
