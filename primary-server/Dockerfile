# Builder image
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate --schema=src/db/prisma/schema.prisma
RUN npm run build

# Production image
FROM node:20-alpine AS prod
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/db/prisma ./src/db/prisma
ENV REDIS_URL=redis://redis:6379
EXPOSE 4000
CMD ["node", "dist/server.js"]

# Development image
FROM node:20-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g nodemon ts-node
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/db/prisma ./src/db/prisma
COPY ./src ./src
ENV REDIS_URL=redis://redis:6379
EXPOSE 4000
CMD ["sh", "-c", "npx prisma generate --schema=src/db/prisma/schema.prisma && nodemon --watch src --ext ts,js,json --exec 'ts-node' src/server.ts"]
