# Digital Ledger Backend API

A RESTful financial ledger and account management backend service built with **Node.js**, **Express**, **MongoDB (Mongoose)**, **JWT Authentication**, and **Nodemailer**.

---

## 🚀 Features

- **🔐 User Authentication**: Register, Login, and Logout with token blacklisting and cookie/bearer header support.
- **🏦 Account Management**: Create user accounts, fetch all user-owned accounts, and check real-time account balances.
- **💸 Financial Transactions & Ledger**: Process peer-to-peer money transfers, record ledger entries, and execute system initial funds transfers.
- **📧 Email Notifications**: Automatic email updates for registration welcome, successful transactions, and failed transactions via Nodemailer (Google OAuth2).

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB via Mongoose ORM
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **Email Service**: Nodemailer (OAuth2)
- **Environment Config**: dotenv

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the root of the project and add the following variables:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/digital-ledger
JWT_SECRET=your_jwt_secret_key

# Email Config (Nodemailer OAuth2)
EMAIL_USER=your-email@gmail.com
CLIENT_ID=your-google-client-id
CLIENT_SECRET=your-google-client-secret
REFRESH_TOKEN=your-google-refresh-token
