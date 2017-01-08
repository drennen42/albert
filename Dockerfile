FROM node:7.2.0

WORKDIR /app

COPY . /app

RUN npm install
CMD ["node", "./app.js"]