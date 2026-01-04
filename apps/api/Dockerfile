# Multi-stage Dockerfile for Fastify API
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* turbo.json ./
COPY packages ./packages
COPY apps/api/package.json ./apps/api/package.json
RUN npm ci --ignore-scripts

FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app /app
COPY . .
RUN npm run build --workspace=@idc/api

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "apps/api/dist/index.js"]
