FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

# Rebuild native modules
RUN npm rebuild bcrypt --build-from-source

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
