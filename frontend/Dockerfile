FROM node:18.20.2

WORKDIR app

COPY ./package.json .
COPY ./yarn.lock .

RUN yarn

COPY . .

RUN yarn build

CMD yarn start
