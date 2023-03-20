FROM node:18-alpine as builder

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

ADD package.json /tmp/package.json
ADD yarn.lock /tmp/yarn.lock
RUN cd /tmp && yarn --prod=false
RUN mkdir -p /app && mv /tmp/node_modules /app

WORKDIR /app

COPY . .

RUN yarn build:$NODE_ENV



FROM nginx:1.23.1-alpine

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

COPY nginx/$NODE_ENV.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
