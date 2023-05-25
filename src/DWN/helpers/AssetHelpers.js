const { VITE_REACT_PUBLIC_URL } = import.meta.env;

export const toAbsoluteUrl = (pathname) =>
  VITE_REACT_PUBLIC_URL + "assets/" + pathname;
