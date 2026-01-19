# Use Node 22-alpine for a lightweight, modern environment
FROM node:22-alpine

# Set WORKDIR to the root of the project
WORKDIR /app

# 1. Copy root and workspace manifests (Crucial for Layer Caching)
COPY package*.json ./
COPY tsconfig*.json ./
COPY shared/package*.json ./shared/
COPY backend/package*.json ./backend/

# 2. Install dependencies for the entire monorepo
# This ensures shared libraries are linked correctly
RUN npm install

# 3. Copy the Shared library and Backend source
COPY shared/ ./shared/
COPY backend/ ./backend/


WORKDIR /app/backend
EXPOSE 4000

# 6. Execute from the root
CMD ["npm", "run", "dev", "--workspace=backend"]