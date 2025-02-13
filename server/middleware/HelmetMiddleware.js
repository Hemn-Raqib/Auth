import helmet from 'helmet';
import xss from 'xss-clean';

const configureHelmet = (app) => {
  app.use(helmet());

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

  app.use(helmet.xssFilter());

  app.use(xss());

  app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true }));

  app.use(helmet.frameguard({ action: 'deny' }));

  app.use(helmet.hidePoweredBy());

  app.use(helmet.noSniff());

  app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }));
};

export default configureHelmet;
