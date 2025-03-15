# Aarogya - Claims Management System

Aarogya is a web-based claims management system designed for patients and insurers. Patients can submit claims, track their status, and insurers can review, approve, or reject claims.

## Deployed Links
- **Frontend** "https://aarogya-lemon.vercel.app/"
- **backend** "https://aarogya-qmzf.onrender.com"

## Prerequisites
Before running the application, ensure you have the following installed:
- **Node.js** (v16 or later)
- **MongoDB** (local or cloud instance like MongoDB Atlas)
- **Git**
- **npm** 

---

## Running the Application
The application consists of two main parts:
1. **Backend (Express.js & MongoDB)**
2. **Frontend (React.js & Auth0 Authentication)**

### 1. Setting Up the Backend

#### Clone the Repository
```sh
git clone https://github.com/your-repository/aarogya.git
cd aarogya/backend
```

#### Install Dependencies
```sh
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `backend` directory and add the following details:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string

```

#### Start the Backend Server
```sh
npm start
```
The server will run on `http://localhost:5000`

---

### 2. Setting Up the Frontend

#### Navigate to the Frontend Directory
```sh
cd ../frontend
```

#### Install Dependencies
```sh
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `frontend` directory and add:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

#### Start the Frontend Server
```sh
npm start
```
The application will run on `http://localhost:5000`

---

## Deployment
### Deploy Backend (Render, Vercel, or Heroku)
1. Push the code to GitHub
2. Link your repository to the deployment service
3. Set environment variables as mentioned above
4. Deploy and get the hosted URL

### Deploy Frontend (Vercel or Netlify)
1. Push the frontend code to GitHub
2. Link the repository to Vercel or Netlify
3. Set the environment variables in the hosting platform
4. Deploy and get the frontend URL

---

## API Endpoints
### Patient Routes
- **POST** `/api/patient/claims` - Submit a claim
- **GET** `/api/patient/claims/:userID` - Get claims of a specific user

### Insurer Routes
- **GET** `/api/insurer/claims` - Get all claims
- **PUT** `/api/insurer/claims/:claimID` - Update claim status

---

## Authentication
Authentication is managed using **Auth0**. Users need to log in to submit or review claims.

---




