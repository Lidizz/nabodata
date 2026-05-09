FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
COPY services/api/package*.json ./services/api/
COPY packages/types/package*.json ./packages/types/
RUN npm ci --workspace=@nabodata/api --workspace=@nabodata/types

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build --workspace=@nabodata/types
RUN npm run build --workspace=@nabodata/api

FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /app/packages/types/dist ./packages/types/dist
COPY --from=build /app/services/api/dist ./services/api/dist
COPY --from=deps /app/node_modules ./node_modules
WORKDIR /app/services/api
CMD ["node", "dist/index.js"]
