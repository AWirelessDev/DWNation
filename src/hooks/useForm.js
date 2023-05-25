import { useMemo, useState } from "react";
import { RequiredValidator, PhoneNumberValidator } from "../validators";
export const useForm = (initialForm = {}) => {
  const [formState, setFormState] = useState(initialForm);
  const [formValidation, setFormValidation] = useState([]);
  const [errors, setErrors] = useState([]);

  const isFormValid = useMemo(() => {
    const fieldErrors = [];
    formValidation?.forEach((field) => {
      if (
        field.isRequired === true &&
        RequiredValidator(formState[field.key])
      ) {
        fieldErrors.push({
          key: field.key,
          message: `${field.name} is required`,
        });
      }

      if (
        field.isValidPhoneNumber &&
        !PhoneNumberValidator(formState[field.key])
      ) {
        fieldErrors.push({
          key: field.key,
          message: `Please enter a valid ${field.name}`,
        });
      }
    });
    setErrors(fieldErrors);
  }, [formValidation, formState]);

  const onInputChange = ({ target }) => {
    const { name, value } = target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const onParentChange = (
    parentName,
    parentValue,
    childName,
    childValue = ""
  ) => {
    setFormState({
      ...formState,
      [parentName]: parentValue,
      [childName]: childValue,
    });
  };

  const onResetForm = () => {
    setFormState(initialForm);
  };

  return {
    ...formState,
    formState,
    onInputChange,
    onParentChange,
    onResetForm,

    ...formValidation,
    errors,
    setFormValidation,
  };
};
