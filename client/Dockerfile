FROM node:20
WORKDIR /app
COPY package.json ./
RUN npm install
# Copy all the application files
COPY . .
# Build the app
RUN npm run build

# Use Nginx to serve the built app
FROM nginx:alpine

# Copy the built app from the previous stage
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 80
# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]
