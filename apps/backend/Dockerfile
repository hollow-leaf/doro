FROM node:18.18-alpine3.18

WORKDIR /usr/src/app

RUN apk add git

COPY package.json .

RUN npm install 

COPY . .

EXPOSE 8080

CMD ["npx", "ts-node", "--esm" ,"src/app.ts" ]