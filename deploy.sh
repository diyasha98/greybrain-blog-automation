#!/bin/bash

# Function to check if the last command was successful
check_success() {
  if [ $? -ne 0 ]; then
    echo "Error: $1 failed."
    exit 1
  fi
}

# echo "Step 1: Pulling the latest changes from the 'main' branch..."
git pull origin main
check_success "git pull origin main"

echo "Step 2: Installing dependencies..."
npm i
check_success "npm install"

echo "Step 3: Generating Prisma files..."
npx prisma generate
check_success "Prisma generate"

echo "Step 4: Running Prisma migrations..."
npx prisma migrate deploy
check_success "Prisma migrate deploy"

echo "Step 5: Building the project..."
npm run build
check_success "npm build"

echo "Step 6: Starting the app with PM2..."
pm2 start ecosystem.config.cjs
check_success "PM2 start"

echo "All steps completed successfully."
