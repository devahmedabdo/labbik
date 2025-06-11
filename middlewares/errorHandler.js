module.exports = (err, req, res, next) => {
  console.error(err);
if (err.name === "ValidationError") {
    if (err.errors) {
      const validationErrors = {};
      for (const field in err.errors) {
        if (err.errors.hasOwnProperty(field)) {
          validationErrors[field] = err.errors[field].message;
        }
      }
      return res.status(422).send({ errors: validationErrors });
    } else {
      return res.status(422).send({ errors: { general: err.message } });
    }
  } else if (err.code === 11000) {
    // Duplicate key error
    const field = Object.keys(err.keyValue)[0];
    const duplicateError = {
      [field]: `القيمة ' ${err.keyValue[
        field
      ].toUpperCase()} ' موجودة بالفعل`,
    };
    return res.status(422).send({ errors: duplicateError });
  } else {
    // console.log(error);
    return res.status(400).send({ err });
  }
};