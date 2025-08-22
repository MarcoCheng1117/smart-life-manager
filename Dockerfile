# Multi-stage build for production
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm ci --only=production --workspaces
RUN cd client && npm ci --only=production
RUN cd server && npm ci --only=production

# Build the application
FROM base AS builder
WORKDIR /app

# Copy source code
COPY . .

# Install all dependencies (including dev dependencies)
RUN npm ci --workspaces
RUN cd client && npm ci
RUN cd server && npm ci

# Build frontend
RUN cd client && npm run build

# Production image
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/client/build ./client/build
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=deps --chown=nextjs:nodejs /app/client/node_modules ./client/node_modules
COPY --from=deps --chown=nextjs:nodejs /app/server/node_modules ./server/node_modules

# Copy source code for server
COPY --from=builder --chown=nextjs:nodejs /app/server/src ./server/src
COPY --from=builder --chown=nextjs:nodejs /app/server/package.json ./server/package.json

# Copy configuration files
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/vercel.json ./vercel.json

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Switch to non-root user
USER nextjs

# Start the application
CMD ["node", "server/src/server.js"] 