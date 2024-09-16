FROM node:18-alpine3.20

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

EXPOSE 3000

RUN npx prisma generate

RUN npm run build

CMD ["npm", "run", "start"]
