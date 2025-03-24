import * as path from 'path';

export const getUploadsPath = () => {
  return path.resolve(__dirname, '..', 'uploads');
};
