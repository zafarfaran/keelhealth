# Build the static export, then serve `out/` with Caddy.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Baked into the static JS at build time; set it as a Railway variable.
ARG NEXT_PUBLIC_WAITLIST_ENDPOINT
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_WAITLIST_ENDPOINT=$NEXT_PUBLIC_WAITLIST_ENDPOINT \
    NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
RUN npm run build

FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/out /srv
# Railway sets PORT; default for local `docker run`.
ENV PORT=8080
EXPOSE 8080
