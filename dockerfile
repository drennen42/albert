FROM node:7.2.0

RUN npm install -g gulp

WORKDIR /app

COPY . /app

RUN npm install

CMD ["gulp", "develop"]