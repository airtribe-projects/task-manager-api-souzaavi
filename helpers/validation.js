/**
 * Validates a field to ensure it is a non-empty string.
 *
 * @param {*} field - The field to validate.
 * @param {string} fieldName - The name of the field being validated.
 * @throws {Error} If the field is invalid.
 */
const validateField = (field, fieldName) => {
  if (!field) {
    throw Error(`Invalid Input, Missing required field: ${fieldName}`);
  }
  if (typeof field !== 'string') {
    throw Error(`Invalid Input, Field ${fieldName} must be a string value`);
  }
  if (field.trim() === "") {
    throw Error(`Invalid Input, Field ${fieldName} can not be an empty string`);
  }
}

module.exports = validateField;
