import { IValidationConfig, ValidationTypes, ValidatorFunctionsMap } from "./types";

export const validator = (
  validations: Array<IValidationConfig> = [],
  value: any,
  options?: { validators: ValidatorFunctionsMap }
) =>
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
      case ValidationTypes.REGEX:
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
      case ValidationTypes.LENGTH:
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
      case ValidationTypes.RANGE:
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
      case ValidationTypes.JSON:
        {
          try {
            JSON.parse(value);
            errors[ValidationTypes.JSON] = "";
          } catch (err) {
            errors[ValidationTypes.JSON] = `Invalid JSON supplied`;
          }
        }
        break;

      case ValidationTypes.CUSTOM:
        {
          const {
            meta: { name }
          } = validation;
          if (options && options.validators && options.validators[name]) {
            const isInvalid = options.validators[name](value);
            errors[ValidationTypes.CUSTOM] = isInvalid ? isInvalid : "";
          } else {
            console.error("No custom validator function specified");
          }
        }
        break;
    }
    return errors;
  }, {});
