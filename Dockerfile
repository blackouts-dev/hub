### INSTALLER STAGE ###

FROM node:12.18.0-alpine AS installer

# Create app directory
WORKDIR /usr/src/installer

ENV NODE_ENV=production

COPY package.json yarn.lock ./

RUN yarn install --production=true

### BUILDER STAGE ###
FROM node:12.18.0-alpine AS builder

# Create app directory
WORKDIR /usr/src/builder

ENV NODE_ENV=production

COPY package.json yarn.lock ./

# Copy dependencies that were installed before
COPY --from=installer /usr/src/installer/node_modules node_modules

# Install the other devdependencies
RUN yarn install --production=false

# Copy build configurations
COPY tsconfig.json ./
COPY tsconfig.build.json ./

# Copy source
COPY src ./src

# Build the project
RUN yarn run build

### HUB STAGE ###
FROM node:12.18.0-alpine AS hub

LABEL maintainer 'Jonah Snider <jonah@jonah.pw> (jonah.pw)'

WORKDIR /usr/src/hub

ENV NODE_ENV=production

EXPOSE 3000

# Install dependencies
COPY --from=installer /usr/src/installer/node_modules ./node_modules
COPY --from=installer /usr/src/installer/yarn.lock ./yarn.lock

# Copy other required files
COPY package.json package.json

# Copy compiled TypeScript
COPY --from=builder /usr/src/builder/dist ./dist

ENTRYPOINT ["yarn", "run", "start:prod"]
