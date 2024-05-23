FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3000

ENV MODEL_URL=https://storage.googleapis.com/mlgc-bucket-22/submissions-model/model.json

EXPOSE 3000

CMD ["npm", "start"]