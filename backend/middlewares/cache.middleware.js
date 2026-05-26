import mcache from 'memory-cache';

export const cache = (durationInSeconds) => {
    return (req, res, next) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        // Cache key is the full URL (including query strings)
        const key = '__express__' + req.originalUrl || req.url;
        const cachedBody = mcache.get(key);

        if (cachedBody) {
            // Serve from cache
            res.setHeader('X-Cache', 'HIT');
            res.send(cachedBody);
            return;
        } else {
            // Hijack the send function to store the response body in cache
            res.sendResponse = res.send;
            res.send = (body) => {
                // Store only 200 OK responses
                if (res.statusCode === 200) {
                    mcache.put(key, body, durationInSeconds * 1000);
                }
                res.setHeader('X-Cache', 'MISS');
                res.sendResponse(body);
            };
            next();
        }
    };
};

export const clearCache = (req, res, next) => {
    // A utility to clear cache manually if needed (e.g., after an update)
    mcache.clear();
    next();
};
