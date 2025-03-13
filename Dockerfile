# Production Dockerfile (Dockerfile.prod)
# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Build the app
RUN bun run build

# Production stage
FROM oven/bun:1-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install PostgreSQL client for database connectivity
RUN apt-get update && apt-get install -y postgresql-client && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN groupadd -g 1001 bunuser && \
    useradd -u 1001 -g bunuser -s /bin/sh -m bunuser
USER bunuser

# Copy only necessary files from build stage
COPY --from=builder --chown=bunuser:bunuser /app/package.json ./
COPY --from=builder --chown=bunuser:bunuser /app/node_modules ./node_modules
COPY --from=builder --chown=bunuser:bunuser /app/dist ./dist

# Expose port
EXPOSE 3000

# Start production server
CMD ["bun", "dist/index.js"]