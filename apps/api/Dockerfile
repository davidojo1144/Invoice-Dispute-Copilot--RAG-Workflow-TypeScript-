FROM node:20-alpine AS base
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps ./apps
COPY packages ./packages

RUN npm ci

RUN npm run build -w @idc/api

EXPOSE 4000
ENV NODE_ENV=production
CMD ["npm","run","start","-w","@idc/api"]
