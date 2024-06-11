FROM node:20.14.0-alpine

RUN apk add --no-cache bash
RUN npm i -g @nestjs/cli typescript ts-node

COPY package*.json /tmp/app/
RUN cd /tmp/app && npm install

COPY . /usr/src/app
RUN cp -a /tmp/app/node_modules /usr/src/app
COPY ./wait-for-it.sh /opt/wait-for-it.sh
RUN chmod +x /opt/wait-for-it.sh
COPY ./startup.document.ci.sh /opt/startup.document.ci.sh
RUN chmod +x /opt/startup.document.ci.sh
RUN sed -i 's/\r//g' /opt/wait-for-it.sh
RUN sed -i 's/\r//g' /opt/startup.document.ci.sh

WORKDIR /usr/src/app
RUN echo "" > .env
RUN npm run build

CMD ["/opt/startup.document.ci.sh"]
