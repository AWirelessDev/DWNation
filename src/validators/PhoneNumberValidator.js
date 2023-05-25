export const PhoneNumberValidator = (value) => {
    if(value) {
        const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        return re.test(value);
    }
    return true;
}