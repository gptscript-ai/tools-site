# when editing and using docker compose, make sure 
# to run `docker compose build --no-cache` to rebuild
# the image and not use the cache.
#
# This Dockerfile is a bit hacky since the expose and migration
# happen in the dev layer. I'll come back and make it better later.

FROM node:20 as dev
WORKDIR /app
COPY . .
RUN yarn install
EXPOSE 3000
CMD [ "yarn", "dev:migrate" ]

FROM node:20 as prod
WORKDIR /app
COPY --from=dev /app .
RUN yarn build
CMD [ "yarn", "start:migrate" ]
