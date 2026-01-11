FROM node:24.12.0-alpine AS base

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs && \
    chown -R nodejs:nodejs /app

# Dependencies Stage
FROM base AS deps

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci --omit=dev && \
    npx prisma generate && \
    npm cache clean --force

RUN chown -R nodejs:nodejs /app

# Build Dependencies Stage
FROM base AS build-deps
COPY package*.json ./
COPY prisma ./prisma

RUN npm ci --no-audit --no-fund && \
    npx prisma generate && \
    npm cache clean --force

RUN mkdir -p /app/node_modules/.vite && \
    chown -R nodejs:nodejs /app

# Build Stage
FROM build-deps AS build
COPY --chown=nodejs:nodejs . .

RUN npm run build

RUN chown -R nodejs:nodejs /app

# Development Stage
FROM build-deps AS development

ENV NODE_ENV=development \
    NPM_CONFIG_LOGLEVEL=warn

COPY . .

RUN mkdir -p /app/node_modules/.vite && \
    chown -R nodejs:nodejs /app && \
    chmod -R 755 /app

USER nodejs

EXPOSE 3000 5173 9229

CMD ["npm", "run", "dev"]

# Production Stage
FROM node:24.12.0-alpine AS production

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs && \
    chown -R nodejs:nodejs /app

ENV NODE_ENV=production \
    NODE_OPTIONS="--max-old-space-size=256 --no-warnings" \
    NPM_CONFIG_LOGLEVEL=silent


COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=deps --chown=nodejs:nodejs /app/package*.json ./
COPY --from=build --chown=nodejs:nodejs /app/dist ./dist
COPY --from=build --chown=nodejs:nodejs /app/prisma ./prisma
COPY --from=build --chown=nodejs:nodejs /app/prisma.config.ts ./prisma.config.ts
COPY --from=build --chown=nodejs:nodejs /app/generated ./generated

USER nodejs
EXPOSE 3000
CMD ["sh", "-c", "npm run db:deploy && npm run start"]
