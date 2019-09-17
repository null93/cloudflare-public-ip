FROM node:8-alpine
ENV NODE_ENV=production
WORKDIR /usr/app
COPY package.json yarn.lock /usr/app/
RUN yarn install
COPY src /usr/app/src
USER node
CMD yarn start
