FROM node:18.18-alpine3.18

WORKDIR /usr/src/app

COPY package.json .

RUN npm install --omit=dev

COPY ./dist ./dist

EXPOSE 8080

CMD ["node", "dist/src/app.js" ]