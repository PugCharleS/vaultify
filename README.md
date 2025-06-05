# Vaultify

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=prisma&logoColor=white)
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
- **Prisma ORM**: Type-safe ORM for interacting with the PostgreSQL database.
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
   git clone https://github.com/PugCharleS/vaultify.git
   ```

2. **Install Dependencies**:
   ```bash
   cd vaultify
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and specify the necessary environment variables:
   ```dotenv
   DATABASE_URL="postgresql://user:password@host:5432/database"
   AUTH_KEY=your_auth_secret
   SESSION_KEY=your_session_key
   ENCRYPTION_KEY=your_encryption_key
   ```

4. **Run Migrations**:
   Initialize the database schema using Prisma.
   ```bash
   npx prisma migrate deploy
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

Swagger-based documentation is available once the server is running. Visit
`http://localhost:3000/api-docs` to view and interact with the API specification.
The OpenAPI spec is generated from inline comments in the controller files
using **swagger-jsdoc**.

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
