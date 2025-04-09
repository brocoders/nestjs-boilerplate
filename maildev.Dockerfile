FROM node:22.14.0-alpine

RUN npm i -g pnpm
RUN pnpm i -g maildev@2.0.5

CMD maildev
