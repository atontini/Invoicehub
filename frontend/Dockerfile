# Step 1: Use a Node.js image with the correct version
FROM node:20 as build

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./
COPY yarn.lock ./

# Step 4: Install dependencies using Yarn
RUN yarn install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the React app
RUN yarn build

# Step 7: Use an Nginx image to serve the static files
FROM nginx:alpine

# Step 8: Copy the build output to Nginx's default html directory
COPY --from=build /app/build /usr/share/nginx/html

# Step 9: Expose port 80
EXPOSE 80

# Step 10: Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
