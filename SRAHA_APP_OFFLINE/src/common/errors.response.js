export const GlobalError = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal server error";
  res.status(status).json({
    message,
    status,
    extra: err.extra || null,
  });
};

export const ConflictError = (message, extra) => {
  const err = new Error(message);
  err.status = 409;
  err.extra = extra;
  return err;
};

export const NotFoundError = (message, extra) => {
  const err = new Error(message);
  err.status = 404;
  err.extra = extra;
  return err;
};

export const UnauthorizedError = (message, extra) => {
  const err = new Error(message);
  err.status = 401;
  err.extra = extra;
  return err;
};