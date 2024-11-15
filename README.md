# Vaultify

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Knex.js](https://img.shields.io/badge/Knex.js-4D64A4?style=for-the-badge&logo=javascript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

**Vaultify** is a password manager, created by Nuggz, designed to securely store and manage your passwords in one convenient location. This application provides functionalities for users to create, share, and manage vaults of passwords.

## Current State

- Version: 1.0.0
- Status: **Active Development**
- Main features:
  - User Registration and Login
  - Vault Management: Create, delete, and share vaults with other users.
  - Password Management: Store, update, and delete passwords within a vault.
  - Export vault contents into an `.env` file for secure usage.

## Technologies Used

- **Node.js**: Core platform for building the application.
- **Express.js**: Web framework used to structure the APIs and routes.
- **PostgreSQL**: Database to store all application data.
- **Knex.js**: SQL query builder for interacting with the PostgreSQL database.
- **bcryptjs**: Library for hashing passwords.
- **jsonwebtoken**: For creating and verifying JWTs.
- **crypto**: Node.js built-in library for encryption and decryption.
- **dotenv**: Manage environment variables using a `.env` file.

## App Architecture

- **Backend**: Express-based API with separate layers for routes, controllers, services, and repositories.
- **Security**: JWT-based authentication, CSRF protection, and rate-limiting.
- **API Endpoints**: Modularized for user authentication, vault management, password operations, and application health checks.
- **Middlewares**:
  - `csurf` for protection against CSRF attacks.
  - `helmet` for setting various HTTP headers for security.
  - `express-rate-limit` for preventing API abuse.

## Installation and Setup

### Prerequisites

- **Node.js** and **npm** should be installed.
- **PostgreSQL Database** set up and running with connection details available.

### Getting Started

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/username/vaultify.git
   ```

2. **Install Dependencies**:
   ```bash
   cd vaultify
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and specify the necessary environment variables:
   ```dotenv
   PG_HOST=your_db_host
   PG_PORT=5432
   PG_USER=your_db_user
   PG_PASSWORD=your_db_password
   PG_DATABASE=your_database_name
   AUTH_KEY=your_auth_secret
   SESSION_KEY=your_session_key
   ENCRYPTION_KEY=your_encryption_key
   ```

4. **Run Migrations and Seeds**:
   Make sure to set up the database schema and seed some initial data.
   ```bash
   npx knex migrate:latest
   npx knex seed:run
   ```

5. **Start the Server**:
   - For development:
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```

## API Documentation

### Authentication

- **POST /auth/register**: Register a new user.
- **POST /auth/login**: Login and receive a JWT.

### Vault Management

- **GET /vaults/**: Retrieve all vaults.
- **POST /vaults/**: Create a new vault.
- **DELETE /vaults/:vaultId**: Delete an existing vault.
- **GET /vaults/:vaultId/env**: Export vault passwords to a `.env` file.

### Password Management

- **GET /passwords/:vaultId**: Retrieve passwords for a specific vault.
- **POST /passwords/:vaultId**: Add a password to a vault.
- **PUT /passwords/:vaultId/:passwordId**: Update an existing password.
- **DELETE /passwords/:vaultId/:passwordId**: Remove a password from a vault.

### Health Check

- **GET /health/**: Verify if the application is running correctly.

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests with clear commit messages.

## License

This project is licensed under the ISC License.
