# Stage 1: Build the React application
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# REALITY CHECK: If your build is failing on unused variables (TS6133), 
# you can bypass strictness here OR fix your code. 
RUN npm run build

# Stage 2: Serve with Nginx for industrial performance
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]