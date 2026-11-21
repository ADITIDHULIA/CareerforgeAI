# Backend Dockerfile for CareerForge AI
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definitions and prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies and generate prisma client
RUN npm ci
RUN npx prisma generate

# Copy source code and build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Production runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

# Copy built artifacts and prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma

# Create uploads directory
RUN mkdir -p uploads && chown -R node:node /app

USER node

EXPOSE 5000

CMD ["node", "dist/server.js"]
