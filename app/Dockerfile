FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
# RUN npm install  (Descomentar cuando haya package.json)

COPY . .

EXPOSE 8080

CMD ["npm", "run", "serve"]
