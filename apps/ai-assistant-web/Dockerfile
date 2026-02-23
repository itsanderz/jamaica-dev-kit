FROM node:22-alpine AS base

FROM base AS deps
WORKDIR /app
COPY apps/ai-assistant-web/package.json ./
RUN npm install

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY apps/ai-assistant-web/ ./
COPY packages/tsconfig/ ./node_modules/@jamaica-digital/tsconfig/
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
