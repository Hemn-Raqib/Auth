# 📧 Email-Based Authentication System

A secure full-stack authentication system that uses **email-based verification** and intelligent **adaptive security mechanisms** to enhance user account protection.

## 🚀 Features

- **🔐 Registration Verification**
  - On sign-up, a **6-digit one-time code** is sent via email to verify the user.

- **🧠 Adaptive Login Authentication**
  - If a login attempt comes from an **unrecognized device** or a location **100+ KM away** from trusted ones, the system sends a 6-digit code for verification.

- **🧭 Device & Location Tracking**
  - Device recognition via [`UA-Parser`](https://www.npmjs.com/package/ua-parser-js)
  - Location checking via **IP Geolocation** (using [ipinfo.io](https://ipinfo.io))

- **👥 Trusted Device Management**
  - Users can view trusted devices.
  - Revoke access to individual devices (forces re-authentication).

---

## 🧱 Tech Stack

### 🔧 Backend (Node.js)
- **Express**, **MySQL**, **JWT**, **Nodemailer**
- **Security**: `helmet`, `xss-clean`, `bcrypt`, `rate-limit`, `express-validator`
- **Other tools**: `ua-parser-js`, `express-fingerprint`

### 🖥️ Frontend (React + Vite)
- **React Router**, **Framer Motion**
- **Socket.io Client**, **JWT Decode**, **Crypto-JS**
- **FingerprintJS2** for device fingerprinting


## 🛠️ Setup & Run

### Server
cd server
npm install
npm start

### Client
cd client
npm install
npm run dev

### ✅ Security Measures
JWT-based access control

Encrypted passwords with bcrypt

Fingerprint and location verification for logins

Device & session tracking

### 📬 Email Delivery
Emails are sent using Nodemailer with support for secure email providers like Gmail, Outlook, etc.

All verification codes expire after a short period for security.

### 👤 Author
Developed by Hemn Raqib
