export const arrayItemsInStr = (arr: string[], str: string): boolean => {
  return arr.find((i) => str.includes(i)) !== undefined;
};

export default arrayItemsInStr;
