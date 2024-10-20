#!/bin/bash

# Update package lists
apt-get update

# Install MySQL
apt-get install -y mysql-server

# Start MySQL service
service mysql start

# Create database and user
mysql -e "CREATE DATABASE appointment_system;"
mysql -e "CREATE USER 'appuser'@'localhost' IDENTIFIED BY 'password';"
mysql -e "GRANT ALL PRIVILEGES ON appointment_system.* TO 'appuser'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

# Install Node.js 18.19.1 and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
npm install -g npm@latest

# Verify Node.js and npm versions
node -v
npm -v

# Install project dependencies
npm install

# Set up environment variables
echo "DATABASE_URL=\"mysql://appuser:password@localhost:3306/appointment_system\"" > .env
echo "NEXTAUTH_SECRET=\"your-secret-key\"" >> .env
echo "NEXTAUTH_URL=\"http://localhost:3000\"" >> .env

# Run Prisma migrations
npx prisma migrate dev

# Build the Next.js application
npm run build

echo "Setup complete! You can now start the application with 'npm start'"