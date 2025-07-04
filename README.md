# Warehouse Management System

## Project Description

This project involves the development of a backend system to support warehouse operations. The system primarily focuses on:

- Managing goods within the warehouse.
- Handling the dispatching (Outgoing) of goods from the warehouse.
- User management and permissioning.

---

## Database Structure

The database is structured to support:

- **Role-Based Access Control (RBAC)**: Secure access control through roles and permissions.
- **Product Management with Variants**: Products can have multiple SKUs based on different option-value combinations.
- **Export Management System**: Tracking and managing stock leaving the warehouse.

---

## Tech Stack

- **TypeScript**: Primary programming language.
- **NestJS**: Framework for building scalable Node.js server-side applications.
- **TypeORM**: Manages database schema with migration support.
- **PostgreSQL**: Relational database.
- **BullMQ Queue**: Handles asynchronous/background tasks and prevents race conditions.
- **Redis**: Used with BullMQ for efficient queue management.
- **Nodemailer**: For sending email notifications using HTML templates.
- **JWT**: Authentication with access and refresh tokens.
  
---

## API Endpoints

### User Module
- `POST /sign-in` – Authenticate user and return tokens.
- `GET /users` – List all users (Pagination + Search).
- `GET /users/:id` – Get user details.
- `POST /users` – Create user with default role.
- `PUT /users/:id` – Update user.
- `DELETE /users/:id` – Soft delete user.
- `POST /users-roles/:roleId/:userId` – Assign role to user.
- `DELETE /users-roles/:roleId/:userId` – Remove role from user.

### Role Module
- `GET /roles` – List all roles with their permissions and users.
- `POST /roles` – Create role.
- `PUT /roles/:id` – Update role.
- `DELETE /roles/:id` – Delete role.
- `POST /roles/:roleId/permissions/:permissionId` – Add permission to role.
- `DELETE /roles/:roleId/permissions/:permissionId` – Remove permission from role.

### Permission Module
- `GET /permissions` – List all permissions.

### Product Module
- `GET /products` – List all products (Pagination + Search).
- `GET /products/:id` – Get product details (Includes SKUs).
- `POST /products` – Create new product with options/values.
- `PUT /products/:id` – Update product.
- `DELETE /products/:id` – Soft delete product.
- `GET /products/skus` – List all SKUs (Pagination + Search).
- `GET /products/skus/:id` – Get SKU details (Options + Values).
- `POST /products/:id/skus` – Create SKUs for product.
- `PUT /products/skus/:id` – Update SKU.
- `DELETE /products/skus/:id` – Soft delete SKU.
- `GET /products/:id/options` – Get product options (For SKU configuration).
- `GET /products/:productId/options/:optionId/values` – Get values for specific option.
- `POST /products/:productId/options/:optionId/values` – Add new option value.

### Export Module
- `GET /exports` – List all exports (Pagination + Search).
- `GET /exports/:id` – Get detailed export info with SKUs.
- `POST /exports` – Create new export and update stock levels.

---

## License
MIT License

Copyright (c) 2025 BaoDo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
