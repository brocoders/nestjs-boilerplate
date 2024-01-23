import fs from 'fs';

const replace = (params: {
  path: string;
  actions: Array<{
    find: string | RegExp;
    replace: string;
  }>;
}) => {
  const { path, actions } = params;

  try {
    let content = fs.readFileSync(path, 'utf-8');

    actions.forEach((action) => {
      content = content.replace(action.find, action.replace);
    });

    fs.writeFileSync(path, content, 'utf-8');
  } catch (error) {
    console.error(`Error replacing text in ${path}:`, error.message);
  }
};

export default replace;
