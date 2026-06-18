# Redirect build to the worker folder
FROM node:20

WORKDIR /app

COPY gatekeeper-worker/package*.json ./
RUN npm install

COPY gatekeeper-worker/. .

RUN npm run build

CMD ["npm", "run", "start"]
