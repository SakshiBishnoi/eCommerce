# Modern eCommerce Platform

[![React](https://img.shields.io/badge/React-^18.0.0-blue?logo=react)](https://reactjs.org/) [![Node.js](https://img.shields.io/badge/Node.js-^20.0.0-green?logo=nodedotjs)](https://nodejs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-^5.0.0-blue?logo=typescript)](https://www.typescriptlang.org/) [![Express](https://img.shields.io/badge/Express-^4.17.0-lightgrey?logo=express)](https://expressjs.com/) [![MongoDB](https://img.shields.io/badge/MongoDB-^6.0.0-green?logo=mongodb)](https://www.mongodb.com/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repo-blue?logo=github)](https://github.com/SakshiBishnoi/eCommerce)

Welcome to the future of online shopping! This is a comprehensive eCommerce platform built with a modern tech stack, focusing on a seamless user experience, performance, and scalability.

## ✨ Core Features

*   **Modern UI/UX:** Sleek, responsive design built with React and TypeScript. *(Further details on specific UI libraries can be found in `frontend/src`)*.
*   **Robust Backend:** Powered by Node.js, Express, and TypeScript for type safety, maintainability, and efficient API development.
*   **Flexible Database:** Utilizes MongoDB (likely with Mongoose ODM - *check `backend/src/models`*) for scalable and adaptable data storage.
*   **Product Management:** Browse, search, and filter a wide range of products.
*   **User Authentication:** Secure user registration and login functionality.
*   **Shopping Cart:** Intuitive cart management allowing users to add, remove, and update items.
*   **Order History:** Implemented user order tracking with purchase history visualization
*   **Admin Dashboard:** Complete management interface for product/category CRUD operations
*   **Automated Testing:** Configured Jest for unit/integration testing (backend/src/__tests__)
*   **Data Seeding:** Added generateFakeData.js script for database population

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Data Seeding
After starting both servers:
```bash
node generateFakeData.js
```

### Prerequisites

Ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (v20.x or later recommended)
*   [npm](https://www.npmjs.com/) (Included with Node.js)
*   [MongoDB](https://www.mongodb.com/try/download/community) (Ensure the MongoDB service is running)
*   [Git](https://git-scm.com/)

### Installation & Setup

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/SakshiBishnoi/eCommerce.git
    cd eCommerce
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    ```
    *   **Configuration:** Check for a `.env.example` file in the `backend` directory. If it exists, create a `.env` file and populate it with your specific environment variables (Database connection string, JWT secrets, etc.). Refer to `backend/src/server.ts` or configuration files for required variables.

3.  **Install Frontend Dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```
    *   **Configuration:** Verify the API endpoint configuration within the frontend source (`frontend/src`). Ensure it points to your running backend server (e.g., `http://localhost:5000/api` - the exact port might vary based on backend setup).

## 🏃 Running the Application

1.  **Start the Backend Server:**
    *   Navigate to the `backend` directory:
        ```bash
        cd backend
        ```
    *   Execute the development script (confirm the exact script name in `backend/package.json`, commonly `npm run dev` or `npm start`):
        ```bash
        npm run dev # Or your specific start script
        ```
    *   The backend server will typically start on a port like `5000` or `3001`. Check the console output for the exact address.

2.  **Start the Frontend Development Server:**
    *   Open a **new terminal window/tab**.
    *   Navigate to the `frontend` directory:
        ```bash
        cd frontend
        ```
    *   Execute the start script (confirm in `frontend/package.json`, often `npm start` for Create React App or `npm run dev` for Vite):
        ```bash
        npm start # Or your specific start script
        ```
    *   This usually opens the application automatically in your default web browser (e.g., `http://localhost:3000`).

## 📂 Project Structure Overview

```
eCommerce/
├── .git/             # Git repository data
├── backend/          # Node.js / Express / TypeScript API
│   ├── src/          # Source code (controllers, models, routes, services)
│   ├── seed/         # Data seeding scripts/files
│   ├── eslint.config.mjs # ESLint configuration
│   ├── jest.config.ts  # Jest test configuration
│   ├── package.json    # Backend dependencies and scripts
│   ├── tsconfig.json   # TypeScript configuration
│   └── ...           # Other config files (.env.example, etc.)
├── frontend/         # React / TypeScript Client
│   ├── public/       # Static assets
│   ├── src/          # Source code (components, pages, services, styles)
│   ├── .gitignore      # Files ignored by Git for frontend
│   ├── package.json    # Frontend dependencies and scripts
│   ├── README.md       # Frontend specific README
│   ├── tsconfig.json   # TypeScript configuration
│   └── ...           # Other config files (vite.config.ts, etc.)
├── .gitignore        # Root files ignored by Git
├── generateFakeData.js # Script for generating fake data (if applicable)
├── package.json      # Root package file (if using workspaces/monorepo)
└── README.md         # This file!
```

## 🛠️ Technology Stack

*   **Frontend:** React 18, TypeScript 5, Material-UI (MUI) v5
*   **Backend:** Node.js 20, Express 4.17, TypeScript 5, Jest 29
*   **Database:** MongoDB 6 with Mongoose 7
*   **Testing:** Jest, Supertest, React Testing Library
*   **Tooling:** Vite 4, ESLint 8, Prettier 3

## 🤝 Contributing

Contributions are welcome! Please adhere to standard Git practices: Fork the repository, create a feature branch (`git checkout -b feature/AmazingFeature`), commit your changes (`git commit -m 'Add some AmazingFeature'`), push to the branch (`git push origin feature/AmazingFeature`), and open a Pull Request.