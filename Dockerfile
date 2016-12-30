FROM node:7.2.0

RUN npm install -g gulp

WORKDIR /app

COPY . /app

CMD "NODE_ENV=test"
CMD "PORT=$PORT"
CMD ["npm", "install"]
CMD ["npm", "start"]