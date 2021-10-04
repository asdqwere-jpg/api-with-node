FROM node:14

# app directory
WORKDIR /usr/src/app

# install dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# port whatsapp services
EXPOSE 3100

RUN npm run build

CMD ["node", "build/src/app.js"]