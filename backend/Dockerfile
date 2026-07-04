FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src
RUN mkdir -p uploads

EXPOSE 5000

CMD ["npm", "run", "start"]
