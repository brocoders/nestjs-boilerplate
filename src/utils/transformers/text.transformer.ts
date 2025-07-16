export const capitalizeFirst = (text: string): string => {
  if (!text) return '';
  return text[0].toUpperCase() + text.slice(1);
};
