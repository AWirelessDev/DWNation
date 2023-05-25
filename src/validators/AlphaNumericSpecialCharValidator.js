export const AlphaNumericSpecialCharValidator = (value) => {
  const alphaNumericCharRegex = /^([\w\s\(\)\!\[\]\{\}\;\:\"\'\/\\\,\.\?\-]*)$/;
  if (value.length && !value.trim()) {
    return false;
  } else if (!value || alphaNumericCharRegex.test(value)) {
    return true;
  }
  return false;
};
