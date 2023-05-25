export const RequiredValidator = (value) => {
  if (value && typeof value !== "object" && typeof value !== "undefined") {
    return false;
  } else if (value?.length && typeof value === "object") {
    return false;
  } else if (value && typeof value !== "object") {
    return false;
  } else if (typeof value === "object" && Date.parse(value) > 0) {
    return false;
  } else if (value === "0") {
    return false;
  }
  return true;
};
