FROM node:18

# with alpine some errors with bcrypt :(
# RUN apk add --no-cache make gcc g++ python3
# RUN npm rebuild bcrypt --build-from-source

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]