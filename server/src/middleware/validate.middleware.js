const validate = (schema, source = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[source], {
    abortEarly: true,
    stripUnknown: false,
    convert: true,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  if (source === 'query') req.validatedQuery = value;
  else req[source] = value;
  return next();
};

module.exports = validate;
