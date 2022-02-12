export const pushToArr = (arr: string[], str: string) => {
  if (!arr.includes(str)) {
    arr.push(str);
  }
};
export const deleteFromArr = (arr: string[], str: string) => {
  if (arr.includes(str)) {
    arr = arr.splice(arr.indexOf(str), 1);
  }
};
