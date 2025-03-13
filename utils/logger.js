const logger = (req, res, next) => {
    const { method, url } = req;
    const time = new Date().toISOString();
    console.log(`[${time}] ${method} to ${url}`);
    next();
    };

export default logger;
