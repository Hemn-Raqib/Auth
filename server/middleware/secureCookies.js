const secureCookies = (req, res, next) => {
    const originalCookie = res.cookie;
    res.cookie = function (name, value, options) {
        options = options || {};
        options.httpOnly = true;
        options.secure = process.env.NODE_ENV;
        options.sameSite = process.env.SECURITY_SAMESITE;
        return originalCookie.call(this, name, value, options);
    };
    next();
};

export default secureCookies;