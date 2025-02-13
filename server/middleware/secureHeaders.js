const secureHeaders = (req, res, next) => {
    res.removeHeader('X-Powered-By');
    next();    
};

export default secureHeaders;