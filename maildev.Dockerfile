FROM node:22.22.1-alpine

RUN npm i -g maildev@2.0.5

CMD maildev
