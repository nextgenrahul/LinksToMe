FROM node:22-alpine
WORKDIR /app

# 1. Install dependencies first (for faster caching)
COPY package*.json ./
RUN npm install

# 2. CRITICAL: Copy the prisma directory before generating the client
COPY prisma ./prisma/

# 3. Generate the Prisma Client
RUN npx prisma generate

# 4. Copy the rest of the application
COPY . .

EXPOSE 5000
CMD ["npm", "run", "dev"]