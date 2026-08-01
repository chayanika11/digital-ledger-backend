# Digital Ledger Backend API

A RESTful financial ledger and account management backend service built with **Node.js**, **Express**, **MongoDB (Mongoose)**, **JWT Authentication**, and **Nodemailer**.

---

## 🚀 Features

- **🔐 User Authentication**: Register, Login, and Logout with token blacklisting and cookie/bearer header support.
- **⚡ Rate Limiting**: Built-in IP rate limiting via `express-rate-limit` to guard auth endpoints against brute-force attacks and prevent transaction spamming.
- **🔍 Request Validation**: Strict payload validation and sanitization using `express-validator` for inputs, amounts, emails, and MongoDB ObjectIDs.
- **🏦 Account Management**: Create user accounts, fetch all user-owned accounts, and check real-time account balances.
- **💸 Financial Transactions & Ledger**: Process peer-to-peer money transfers, record double-entry ledger entries, and execute system initial funds transfers.
- **📧 Email Notifications**: Automatic email updates for registration welcome, successful transactions, and failed transactions via Nodemailer (Google OAuth2).

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB via Mongoose ORM
- **Security & Validation**: `express-rate-limit`, `express-validator`, `bcryptjs`, `jsonwebtoken`
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
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Development Mode
```bash
npm run dev
```

### 3. Run in Production Mode
```bash
npm start
```
The server will start at `http://localhost:3000`.

---

## 📍 API Endpoints

### Auth Routes (`/api/auth`)
| Method | Endpoint | Description | Rate Limit | Auth Required |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | 15 req / 15 min | No |
| `POST` | `/api/auth/login` | Login user and set JWT cookie/token | 15 req / 15 min | No |
| `POST` | `/api/auth/logout` | Logout user & blacklist current token | None | Yes |

### Account Routes (`/api/accounts`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/accounts` | Create a new user account | Yes |
| `GET` | `/api/accounts` | Get all accounts for logged-in user | Yes |
| `GET` | `/api/accounts/balance/:accountId` | Get specific account balance | Yes |

### Transaction Routes (`/api/transactions`)
| Method | Endpoint | Description | Rate Limit | Auth Required |
|---|---|---|---|---|
| `POST` | `/api/transactions` | Initiate a money transfer transaction | 20 req / 1 min | Yes |
| `POST` | `/api/transactions/system/initial-funds` | Deposit initial funds from system user | 20 req / 1 min | System User |

---

## 📁 Project Structure

```text
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route logic handlers
│   ├── middleware/      # Auth, rate limiting, and validator middleware
│   ├── models/          # Mongoose database schemas
│   ├── routes/          # Express route definitions
│   └── services/        # Nodemailer and background services
├── .gitignore           # Ignored files (.env, node_modules)
├── package.json         # Dependencies & scripts
├── server.js            # Main application entry point
└── README.md            # Project documentation
```

---

## 👤 Author

- **GitHub**: [@chayanika11](https://github.com/chayanika11)
