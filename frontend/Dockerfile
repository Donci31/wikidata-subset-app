# Step 1: Use an official Node.js image as a base
FROM node:21-alpine AS builder

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the entire app to the container
COPY . .

# Step 6: Build the Next.js app
RUN npm run build

# Step 7: Prepare the runtime image
FROM node:21-alpine

# Step 8: Set the working directory in the container
WORKDIR /app

# Step 9: Copy only the build output and necessary files from the builder
COPY --from=builder /app ./

# Step 10: Expose the app on port 3000
EXPOSE 3000

# Step 11: Start the app in production mode
CMD ["npm", "start"]
