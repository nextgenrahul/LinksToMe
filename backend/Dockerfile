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

# 4. Generate Prisma Client
# You must point to the specific schema location using the --schema flag
# because your WORKDIR is /app, not /app/backend
RUN DATABASE_URL="postgresql://postgres:admin@7685@postgres:5432/linkstome" \
    npx prisma generate --schema=./backend/prisma/schema.prisma
# 5. Expose the API Port
WORKDIR /app/backend
EXPOSE 5000

# 6. Execute from the root
CMD ["npm", "run", "dev", "--workspace=backend"]