
FROM node:22-alpine

RUN apk update && apk upgrade

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev \
    && npm cache clean --force \
    && rm -rf /usr/local/lib/node_modules/npm \
              /usr/local/bin/npm \
              /usr/local/bin/npx

COPY . .

EXPOSE 5050

CMD ["node", "server.js"]