# Email-Based Authentication System

This project implements a secure user authentication system with email verification for both registration and login. 

## Features:
- **Email Verification:** Users receive a verification email upon registration.
- **Adaptive Authentication:** If a login attempt is detected from an unrecognized device or a location over 100KM from trusted locations, a one-time 6-digit verification code is sent via email.
- **Device & Location Security:**
  - Device detection using **UA-Parser**.
  - Location verification using **IP Geolocation**.
- **Tech Stack:**
  - Backend: Node.js, Express, MySQL
  - Frontend: React
  - Security: JWT, Bcrypt, CSURF, Express Validator
  - Email Service: Nodemailer
  - Real-Time Communication: Socket.io
