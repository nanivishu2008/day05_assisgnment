export default function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  if (err.type === "entity.parse.failed") {
  err.statusCode = 400;
  err.message = "Invalid JSON body";
  err.errors = {
    body: "Request body contains malformed JSON"
  };
}
  const statusCode = Number.isInteger(err.statusCode)
    ? err.statusCode
    : 500;

  const message =
    statusCode === 500 && process.env.NODE_ENV !== "development"
      ? "Internal server error"
      : err.message || "Internal server error";

  const response = {
    success: false,
    message,
    errors: err.errors ?? {}
  };

  // Include stack traces only during development.
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}