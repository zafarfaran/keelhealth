# Build the static export, then serve `out/` with Caddy.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/out /srv
# Railway sets PORT; default for local `docker run`.
ENV PORT=8080
EXPOSE 8080
