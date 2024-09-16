FROM node:18-alpine

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

EXPOSE 4173

RUN npm run build

CMD ["npm", "run", "preview"]
