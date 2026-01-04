# Multi-stage Dockerfile for Next.js web app
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* turbo.json ./
COPY packages ./packages
COPY apps/web/package.json ./apps/web/package.json
RUN npm ci --ignore-scripts

FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app /app
COPY . .
RUN npm run build --workspace=@idc/web

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /app/node_modules ./node_modules
CMD ["npm", "run", "start", "--workspace=@idc/web"]
