### BUILDER STAGE ###
FROM node:12.18.4-alpine AS builder

# Create app directory
WORKDIR /usr/src/builder

ENV NODE_ENV=production

# Install dependencies
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/releases/yarn-berry.js .yarn/releases/yarn-berry.js

# Copy your local cache to speed up builds, Yarn will download any updates that are required, so this has no negative side effects
COPY .yarn ./.yarn

RUN yarn install

# Copy build configurations
COPY tsconfig.json ./
COPY tsconfig.build.json ./

# Copy source
COPY src ./src

# Build the project
RUN yarn run build

### HUB STAGE ###
FROM node:12.18.4-alpine AS hub

LABEL maintainer 'Jonah Snider <jonah@jonah.pw> (jonah.pw)'

WORKDIR /usr/src/hub

ENV NODE_ENV=production

EXPOSE 3000

# Install dependencies
COPY --from=builder /usr/src/builder/.yarn ./.yarn
COPY --from=builder /usr/src/builder/yarn.lock ./yarn.lock

# Copy other required files
COPY package.json .yarnrc.yml ./

# Copy compiled TypeScript
COPY --from=builder /usr/src/builder/dist ./dist

ENTRYPOINT ["yarn", "run", "start:prod"]
