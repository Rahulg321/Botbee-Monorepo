# Use the official Bun image
FROM oven/bun:1.1.13

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .

EXPOSE 8080

# Start the server using Bun
CMD ["bun", "index.ts"]