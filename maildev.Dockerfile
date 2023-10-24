FROM node:18.18.2-alpine

RUN npm i -g maildev@2.0.5

CMD maildev
