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
ARG BUILD_TIME=""
ENV COMMIT_SHA=$COMMIT_SHA
# Static health payload, baked with the bundle it describes. `service` matches the
# estate registry name so the console's probe and its telemetry row name one thing.
# USER root for this layer only: the base image runs as uid 101, which cannot write
# into the root-owned web root. Dropped back immediately so nothing else runs as root.
USER root
RUN printf '{"success":true,"data":{"status":"ok","service":"agentage-ds","commit":"%s","buildTime":"%s"}}' \
      "$COMMIT_SHA" "$BUILD_TIME" > /usr/share/nginx/html/health.json \
  && chown 101:101 /usr/share/nginx/html/health.json
USER 101
# 127.0.0.1, not localhost: nginx binds IPv4 only; busybox wget picks ::1 and gets refused.
# Probes /health, not /: with the SPA fallback removed from that path, this now
# fails if the bundle is missing rather than passing on index.html.
HEALTHCHECK --interval=15s --timeout=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8080/health || exit 1
