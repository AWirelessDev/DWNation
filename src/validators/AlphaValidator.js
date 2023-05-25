export const AlphaValidator = (value) => {
    const alphaRegex = /^[a-zA-Z ]+$/;
    if(value.length && !value.trim()) {
       return false;
   } else if(!value || alphaRegex.test(value)) {
         return true;
       }
     return false;
  }