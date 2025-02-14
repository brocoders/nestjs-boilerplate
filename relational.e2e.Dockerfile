FROM node:22.14.0-alpine

RUN apk add --no-cache bash
RUN npm i -g @nestjs/cli typescript ts-node

COPY package*.json /tmp/app/
RUN cd /tmp/app && npm install

COPY . /usr/src/app
RUN cp -a /tmp/app/node_modules /usr/src/app
COPY ./wait-for-it.sh /opt/wait-for-it.sh
RUN chmod +x /opt/wait-for-it.sh
COPY ./startup.relational.ci.sh /opt/startup.relational.ci.sh
RUN chmod +x /opt/startup.relational.ci.sh
RUN sed -i 's/\r//g' /opt/wait-for-it.sh
RUN sed -i 's/\r//g' /opt/startup.relational.ci.sh

WORKDIR /usr/src/app
RUN echo "" > .env
RUN npm run build

CMD ["/opt/startup.relational.ci.sh"]
