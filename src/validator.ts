import { IValidationConfig, ValidationTypes } from "./types";

export const validator = (validations: Array<IValidationConfig> = [], value: any) =>
  validations.reduce((errors: { [k in ValidationTypes]?: string }, validation: IValidationConfig) => {
    switch (validation.type) {
      case ValidationTypes.REQUIRED:
        {
          if (value === "" || value === null || value === undefined) {
            errors[ValidationTypes.REQUIRED] = `This field is required`;
          } else {
            errors[ValidationTypes.REQUIRED] = "";
          }
        }
        break;
      case "REGEX":
        {
          const {
            meta: { pattern }
          } = validation;
          if (!new RegExp(pattern).test(value)) {
            errors[ValidationTypes.REGEX] = `Field value doesn't match the pattern`;
          } else {
            errors[ValidationTypes.REGEX] = "";
          }
        }
        break;
      case "LENGTH":
        {
          const {
            meta: { min, max }
          } = validation;
          if (value.length < min) {
            errors[ValidationTypes.LENGTH] = `Minimum length of ${min} is needed`;
          } else if (value.length > max) {
            errors[ValidationTypes.LENGTH] = `Maximum length of ${max} is allowed`;
          } else {
            errors[ValidationTypes.LENGTH] = "";
          }
        }
        break;
      case "RANGE":
        {
          const {
            meta: { min, max }
          } = validation;
          if (!(value > min && value < max)) {
            errors[ValidationTypes.RANGE] = `The value should be in the range of ${min} and ${max}`;
          } else {
            errors[ValidationTypes.RANGE] = "";
          }
        }
        break;
    }
    return errors;
  }, {});
