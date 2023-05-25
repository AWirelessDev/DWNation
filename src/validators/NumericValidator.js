export const NumericValidator = (value) => {
  const numericRegex = /^[0-9]+$/;
  if (!value || numericRegex.test(value)) {
    return true;
  }
  return false;
};
