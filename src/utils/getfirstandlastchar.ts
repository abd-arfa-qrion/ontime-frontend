export const getFirstAndLastChar = (str: string): string => {
  if (str.length === 0) return ""; // Handle jika string kosong
  return str[0] + str[str.length - 1];
};
