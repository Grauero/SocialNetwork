const Validator = require('validator');

const isEmpty = require('./isEmpty');

function validateEducationInput(data) {
  const errors = {};

  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.company : '';
  data.fieldOfStudy = !isEmpty(data.fieldOfStudy) ? data.fieldOfStudy : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  if (Validator.isEmpty(data.school)) {
    errors.school = 'School field is required';
  }

  if (Validator.isEmpty(data.degree)) {
    errors.degree = 'Degree field is required';
  }

  if (Validator.isEmpty(data.fieldOfStudy)) {
    errors.fieldOfStudy = 'Field of study field is required';
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = 'From date field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}

module.exports = validateEducationInput;
