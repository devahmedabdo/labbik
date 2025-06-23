const xss = require('xss-clean');

function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  for (let key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = xss(obj[key]);
    } else if (typeof obj[key] === 'object') {
      sanitizeObject(obj[key]);
    }
  }
  return obj;
}

function sanitizeInput(req, res, next) {
  try {
    if (req.body) sanitizeObject(req.body);
    if (req.params) sanitizeObject(req.params);

    // ⚠️ Use try-catch for req.query since it's possibly read-only
    try {
      if (req.query && typeof req.query === 'object') {
        sanitizeObject(req.query);
      }
    } catch (e) {
      console.warn("Skipping req.query sanitization:", e.message);
    }

    next();
  } catch (err) {
    console.error("Sanitization failed:", err.message);
    next(err);
  }
}

module.exports = sanitizeInput;
