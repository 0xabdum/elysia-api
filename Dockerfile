# Production Dockerfile (Dockerfile)
FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lockb* prisma ./ 

RUN bun install --frozen-lockfile

RUN bun prisma generate

COPY . . 

RUN bun run build

FROM oven/bun:1-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN apt-get update && apt-get install -y postgresql-client && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN groupadd -g 1001 bunuser && \
    useradd -u 1001 -g bunuser -s /bin/sh -m bunuser
USER bunuser

COPY --from=builder --chown=bunuser:bunuser /app/package.json ./ 
COPY --from=builder --chown=bunuser:bunuser /app/node_modules ./node_modules
COPY --from=builder --chown=bunuser:bunuser /app/prisma ./prisma 
COPY --from=builder --chown=bunuser:bunuser /app/dist ./dist

EXPOSE 3000

CMD ["sh", "-c", "bun prisma migrate deploy && bun run start"]