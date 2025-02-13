# Email-Based Authentication System

This project implements a secure user authentication system with email verification for both registration and login.

## Features:
- **Email Verification:** Users receive a verification email upon registration.
- **Adaptive Authentication:** If a login attempt is detected from an unrecognized device or a location over 100KM from trusted locations, a one-time 6-digit verification code is sent via email.
- **Device & Location Security:**
  - Device detection using **UA-Parser**.
  - Location verification using **IP Geolocation**(IPINFO).
- **Trusted Device Management:**
  - Users can view and manage their trusted devices.
  - Ability to terminate access for specific devices, requiring re-authentication on the next login.
- **Tech Stack:**
  - Backend: Node.js, Express, MySQL
  - Frontend: React
  - Security: JWT, Bcrypt,  Express Validator
  - Email Service: Nodemailer
  
