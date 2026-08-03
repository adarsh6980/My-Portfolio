# syntax=docker/dockerfile:1
FROM node:22-alpine AS build

WORKDIR /src

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./

# Browsers cannot resolve the Compose service name, so the default is the API
# port published by docker-compose. Production replaces this at build time.
ARG PORTFOLIO_API_URL=http://localhost:5050
RUN PORTFOLIO_API_URL="$PORTFOLIO_API_URL" node -e "const fs = require('node:fs'); const value = process.env.PORTFOLIO_API_URL; fs.writeFileSync('public/assets/config.js', 'globalThis.__PORTFOLIO_CONFIG__ = Object.freeze({ apiUrl: ' + JSON.stringify(value) + ' });\\n');"
RUN npm run build -- --configuration production

FROM nginx:1.30.4-alpine3.24 AS runtime

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
# Angular 22's application builder emits browser assets under this directory.
COPY --from=build /src/dist/frontend/browser /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:8080/ || exit 1
