function errorHandler(error, req, res, next) {
  console.error(error);

  if (error?.name === "ZodError") {
    return res.status(400).json({ message: "Validation error", issues: error.issues });
  }

  return res.status(500).json({ message: "Internal server error" });
}

module.exports = errorHandler;
