function errorHandler(err, _req, res, _next) {
  if (res.headersSent) {
    return;
  }

  if (err?.name === 'MulterError') {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'Uploaded file exceeds the 10 MB limit'
        : err.message;
    return res.status(400).json({ message });
  }

  if (err?.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  if (err?.name === 'CastError') {
    return res.status(400).json({ message: `Invalid ${err.path}` });
  }

  if (err?.code === 11000) {
    return res.status(409).json({ message: 'A record with those unique fields already exists' });
  }

  const status = err?.statusCode || 500;
  return res.status(status).json({
    message: err?.message || 'Internal server error',
  });
}

module.exports = errorHandler;
