# =============================================================================
# DEVELOPMENT STAGE
# =============================================================================
FROM node:lts-alpine AS development

RUN apk add --no-cache libc6-compat

WORKDIR /front

# Change ownership to node user
RUN chown -R node:node /front

USER node

ARG API_URL
ARG API_PORT
ENV NEXT_PUBLIC_API_URL=${API_URL}
ENV NEXT_PUBLIC_API_PORT=${API_PORT}

COPY --chown=node:node package*.json ./
RUN npm install

COPY --chown=node:node . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

# =============================================================================
# BUILDER STAGE
# =============================================================================
FROM node:lts-alpine AS builder

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build static export
ARG API_URL
ENV NEXT_PUBLIC_API_URL=${API_URL}
ENV NODE_ENV=production

RUN echo "=== BUILD ENV ===" && \
    echo "API_URL: ${API_URL}" && \
    echo "NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}"

RUN npm run build


# =============================================================================
# PRODUCTION STAGE
# =============================================================================
FROM alpine:latest AS production

WORKDIR /output

# Copy built static files
COPY --from=builder /app/out /output

# Garder le conteneur actif pour la copie
CMD ["sh", "-c", "echo 'Static files ready' && sleep infinity"]