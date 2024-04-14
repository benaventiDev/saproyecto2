FROM node:18.16.0
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_OPTIONS=--openssl-legacy-provider
EXPOSE 3000
ENV CI=true
CMD ["npm", "start"]





