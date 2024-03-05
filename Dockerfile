# when editing and using docker compose, make sure 
# to run `docker compose build --no-cache` to rebuild
# the image and not use the cache.

FROM node:20 as dev
WORKDIR /app
COPY . .
RUN yarn install
EXPOSE 3000
CMD [ "yarn", "dev" ]

FROM node:20 as prod
WORKDIR /app
COPY --from=dev /app .
RUN yarn build
CMD [ "yarn", "start" ]