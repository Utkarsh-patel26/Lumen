const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({ body: req.body, query: req.query, params: req.params });
  if (!result.success) {
    return res.status(400).json({
      success: false,
      data: result.error.issues,
      message: result.error.issues[0]?.message || "Invalid request"
    });
  }
  return next();
};

export { validate };
