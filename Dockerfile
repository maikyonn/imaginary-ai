FROM oven/bun:1
WORKDIR /app
COPY package.json bun.lock ./
COPY server/package.json server/
COPY shared/package.json shared/
RUN bun install --production
COPY shared/ shared/
COPY server/ server/
EXPOSE 3000
CMD ["bun", "server/src/index.ts"]
