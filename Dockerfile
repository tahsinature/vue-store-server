FROM node:11.6.0-alpine
WORKDIR /app
COPY package*.json /app/
RUN [ "npm", "i" ]
COPY . .
CMD [ "npm", "start" ]