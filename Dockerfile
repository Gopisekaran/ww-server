# Multi-stage Dockerfile for ww-server (NestJS)

# --- Build stage ---
FROM node:20-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Enable pnpm via corepack and install dependencies
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source files
COPY tsconfig*.json ./
COPY src ./src

# Build the app
RUN pnpm run build

# --- Runtime stage ---
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Enable pnpm via corepack
RUN corepack enable

# Copy only necessary artifacts from builder
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /usr/src/app/dist ./dist

# Environment
ENV NODE_ENV=production
# Railway will inject PORT; default to 8080 to match Railway
ENV PORT=8080

# Expose the NestJS port
EXPOSE 8080

# Start the app
CMD ["node", "dist/main"]
