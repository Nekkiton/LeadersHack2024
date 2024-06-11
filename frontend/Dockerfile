FROM node:18-alpine

WORKDIR app

COPY ./package.json .
COPY ./yarn.lock .

RUN yarn

COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN yarn build

EXPOSE 80

CMD ["yarn", "start"]
