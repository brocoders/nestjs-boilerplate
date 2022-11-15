FROM node:19.1.0

RUN npm i -g maildev@2.0.5

CMD maildev
