FROM node:20.18.0-alpine

RUN npm i -g maildev@2.0.5

CMD maildev
