import express from 'express';
import dotenv from'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import cookieParser from 'cookie-parser';
import configureHelmet from './middleware/HelmetMiddleware.js'; 
import Login from './Register/Login.js';
import verify from './Register/verify.js';
import Signup from './Register/Signup.js';
import secureCookies from './middleware/secureCookies.js';
import credentials from './middleware/credentials.js';
import refresh from './Token/refreshToken.js';
import Activity from './Register/ActivityRoute.js'
import Terminate from './Register/Terminate.js'
import logoutRouter from './Register/Logout.js'
const app = express();


 

dotenv.config();
const PORT = process.env.PORT;
const server = createServer(app);
configureHelmet(app);







const corsOptions = {
  origin: [
      process.env.CLIENT_URL1, 
      process.env.CLIENT_URL2, 
      process.env.CLIENT_URL4, 
      process.env.CLIENT_URL5
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
  sameSite: process.env.SEREVR_FILE_SAMESITE
};

app.use(credentials);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(secureCookies);

app.use('/signup', Signup);
app.use('/login', Login);
app.use('/verify', verify);
app.use('/refresh', refresh);
app.use('/activity', Activity);
app.use('/terminate', Terminate);
app.use('/logout', logoutRouter);
app.all('/*', (req, res) => {res.status(400).send({ message: "not Found" });});


server.listen(PORT, () => {
    console.log(`Server Running on port 3000...`);
});