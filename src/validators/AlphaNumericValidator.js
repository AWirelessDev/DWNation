export const AlphaNumericValidator = (value) => {
  const alphaNumericRegex = /^[a-zA-Z0-9 ]+$/;

  // starting key/letter spacebar then return false;
  if (value.length && !value.trim()) {
    return false;
  } else if (!value || alphaNumericRegex.test(value)) {
    return true;
  }
  return false;
};

export const AlphaNumericValidatorWithOutSpace = (value) => {
  const alphaNumericRegex = /^[a-zA-Z0-9]+$/;

  // starting key/letter spacebar then return false;
  if (value?.length && !value.trim()) {
    return false;
  } else if (!value || alphaNumericRegex.test(value)) {
    return true;
  }
  return false;
};
