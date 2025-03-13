export default function logger(req, res, next) {
    const timestamp = new Date().toISOString();
    console.info(`[${timestamp}] ${req.method} ${req.url}`);
    next();
  }
  