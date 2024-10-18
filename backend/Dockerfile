FROM node:18-alpine

# Install dependencies required for native module compilation (like bcrypt)
# RUN apk add --no-cache make gcc g++ python3

WORKDIR /app

COPY package*.json ./

# Remove node_modules to ensure fresh native builds
# RUN rm -rf node_modules

# RUN npm ci
RUN npm install

# Clear npm cache and install dependencies
# RUN npm cache clean --force && \
#    npm install

# Rebuild bcrypt from source for the current platform (Linux)
# RUN npm rebuild bcrypt --build-from-source

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]