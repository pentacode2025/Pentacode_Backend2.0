function errorHandler(err, req, res, next) {
  // Handle JSON parse errors (body-parser)
  if (err && (err.type === 'entity.parse.failed' || (err instanceof SyntaxError && err.status === 400))) {
    // err.body often contains the raw body that failed to parse
    const raw = err.body || '';
    console.error('Body parse error:', raw || err.message);

    if (typeof raw === 'string' && raw.includes('Authorization:')) {
      return res.status(400).json({
        error: true,
        message: 'Invalid JSON body. It looks like you placed the Authorization token in the request body. Send the token as an HTTP header: `Authorization: Bearer <token>` (e.g., use Postman Auth -> Bearer Token or add the header manually).'
      });
    }

    return res.status(400).json({ error: true, message: 'Invalid JSON in request body' });
  }

  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: true, message });
}

module.exports = { errorHandler };
