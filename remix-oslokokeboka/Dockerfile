# syntax = docker/dockerfile:1.2

# https://stackoverflow.com/questions/70360976/how-to-deploy-react-remix-framework-for-production-on-nginx
# https://github.com/iterate/iterate-web-remix/blob/main/Dockerfile
# https://github.com/garand/remix-azure-docker/blob/master/Dockerfile
# https://github.com/kentcdodds/remix-tutorial-walkthrough/blob/main/Dockerfile

from alpine as entrypoint
COPY remix-oslokokeboka/entrypoint.sh /docker-entrypoint.sh
RUN chmod uga+x /docker-entrypoint.sh

from node:18.14-slim as builder

# /usr/local/share/.cache/yarn/v6

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

WORKDIR /app

COPY remix-oslokokeboka/ .

RUN --mount=type=cache,target=/usr/local/share/.cache/yarn/v6 \ 
    yarn install --frozen-lockfile

RUN npx prisma generate

RUN yarn build

RUN --mount=type=cache,target=/usr/local/share/.cache/yarn/v6 \ 
    yarn install --prod --frozen-lockfile

FROM node:18.14-slim as runner
RUN apt-get update && apt-get install -y openssl

COPY --from=entrypoint /docker-entrypoint.sh /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

COPY --from=builder /app /app
WORKDIR /app
EXPOSE 3000

CMD ["yarn", "start:prod"]