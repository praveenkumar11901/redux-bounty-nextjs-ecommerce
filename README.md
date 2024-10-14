# E-Commerce Application

This is a full-stack e-commerce application built with Next.js, Prisma, and SQLite. It features user authentication, role-based access control, and functionality for shoppers, sellers, and administrators.

## Features

- User authentication (register, login, logout)
- Role-based access control (Shopper, Seller, Admin)
- Product management for sellers
- Shopping cart and checkout for shoppers
- Admin dashboard for user management

## Environment Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following content:
   ```
   NEXTAUTH_SECRET="your_nextauth_secret_here"
   NEXTAUTH_URL="http://localhost:3000"
   ```
   Replace `your_nextauth_secret_here` with a secure random string.

4. Create the `dev.db` file:
   ```
   touch prisma/dev.db
   ```

5. Set up the database:
   ```
   npx prisma generate
   npx prisma db push
   ```

6. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Changing User Role to Admin

To manually change a user's role to admin:

1. Install the "SQLite" extension in VS Code.

2. Open the `prisma/dev.db` file in the project root with the SQLite extension.

3. In the SQLite Explorer, expand the "dev.db" database and click on the "User" table.

4. Find the user you want to change to admin in the table view.

5. Double-click on the "role" cell for that user and change the value to "ADMIN".

6. Save the changes (Ctrl+S or Cmd+S).

Note: Be cautious when manually editing the database, as it can lead to data inconsistencies if not done correctly.
