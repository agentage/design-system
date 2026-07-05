# Component showcase (the dev/ Vite app) built to a static SPA and served by
# nginx-unprivileged. Env-agnostic - one digest serves dev + prod (Traefik routes
# by host); the showcase has no runtime config.
FROM node:26-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:showcase

FROM nginxinc/nginx-unprivileged:1-alpine AS runner
COPY --from=build /app/dist-showcase /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
# Build provenance, baked late so a changing SHA only busts this layer.
ARG COMMIT_SHA=""
ENV COMMIT_SHA=$COMMIT_SHA
HEALTHCHECK --interval=15s --timeout=5s --retries=3 \
  CMD wget -q --spider http://localhost:8080/ || exit 1
