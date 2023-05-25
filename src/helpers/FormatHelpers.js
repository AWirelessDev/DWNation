export const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    switch (
      value // Switch statement if the condition is True
    ) {
      case phoneNumberLength < 4: // Check the inputs value in range 0 - 10
        return phoneNumber;
      case !(phoneNumberLength < 7): // Check the inputs value if it's not a in range between 0 - 10 ( !(myAge >= 0 && myAge <= 10) )
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
      default:
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
          3,
          6
        )}-${phoneNumber.slice(6, 10)}`;
    }
  }