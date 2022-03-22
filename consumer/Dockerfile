FROM node:16
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . /usr/src/app/
RUN npm run build
CMD ["npm", "start"]
EXPOSE 3001:3001