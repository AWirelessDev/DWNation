export const alphaNumericRegex = /^[a-zA-Z0-9 ]+$/;
export const alphaNumericRegexWithoutSpace = /^[a-zA-Z0-9]+$/;
export const numericRegex = /^[0-9]+$/;

export const onlyAlphabets = (value) => {
  const regex = /^[a-zA-Z]+$/;
  return regex.test(value);
};
