# https://stackoverflow.com/questions/70360976/how-to-deploy-react-remix-framework-for-production-on-nginx
# https://github.com/iterate/iterate-web-remix/blob/main/Dockerfile
# https://github.com/garand/remix-azure-docker/blob/master/Dockerfile
# https://github.com/kentcdodds/remix-tutorial-walkthrough/blob/main/Dockerfile



from node:16.13-bullseye-slim as base

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

WORKDIR /app

# COPY remix-oslokokeboka/ .

# Install all deps
FROM base as deps

WORKDIR /app

COPY remix-oslokokeboka/package.json remix-oslokokeboka/yarn.lock ./
RUN yarn install --production=false

# Setup production node_modules
FROM base as production-deps

WORKDIR /app
COPY --from=deps /app/node_modules node_modules
ENV NODE_ENV production
RUN yarn install --pure-lockfile

# Build the app
FROM base as builder

WORKDIR /app
COPY --from=production-deps /app/node_modules node_modules

COPY remix-oslokokeboka/ .
RUN npx prisma generate

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start:prod"]