FROM node:22-slim

ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=384

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

USER node

EXPOSE 3000

CMD ["node", "app.js"]
