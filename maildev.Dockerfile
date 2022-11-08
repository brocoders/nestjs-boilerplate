FROM node:16.18.1

RUN npm i -g maildev@2.0.5

CMD maildev
