import helmet from 'helmet';
import xss from 'xss-clean';

const configureHelmet = (app) => {
  app.use(helmet());

  // Custom Content Security Policy
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", process.env.CLIENT_URL1],
        styleSrc: ["'self'", "'unsafe-inline'", process.env.CLIENT_URL1],
        imgSrc: ["'self'", "data:", process.env.CLIENT_URL1],
        connectSrc: ["'self'", process.env.CLIENT_URL1, process.env.CLIENT_URL3],
        fontSrc: ["'self'", process.env.CLIENT_URL1],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    })
  );

  // Enable XSS filter
  app.use(helmet.xssFilter());

  // Use xss-clean to sanitize input
  app.use(xss());

  // Set strict transport security for 1 year
  app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true }));

  // Prevent clickjacking
  app.use(helmet.frameguard({ action: 'deny' }));

  // Hide X-Powered-By header
  app.use(helmet.hidePoweredBy());

  // Disable MIME type sniffing
  app.use(helmet.noSniff());

  // Set referrer policy
  app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }));
};

export default configureHelmet;