FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV BACKEND_PORT=3000
ENV PUPPETEER_MODE=local
ENV LOG_LEVEL=info

RUN corepack enable
RUN apt-get update && apt-get install -y openssl ibglib2.0-0 \
    ca-certificates\
    fonts-liberation\
    libasound2\
    libatk-bridge2.0-0\
    libatk1.0-0\
    libc6\
    libcairo2\
    libcups2\
    libdbus-1-3\
    libexpat1\
    libfontconfig1\
    libgbm1\
    libgcc1\
    libglib2.0-0\
    libgtk-3-0\
    libnspr4\
    libnss3\
    libpango-1.0-0\
    libpangocairo-1.0-0\
    libstdc++6\
    libx11-6\
    libx11-xcb1\
    libxcb1\
    libxcomposite1\
    libxcursor1\
    libxdamage1\
    libxext6\
    libxfixes3\
    libxi6\
    libxrandr2\
    libxrender1\
    libxss1\
    libxtst6\
    lsb-release\
    wget\
    xdg-utils\
    && rm -rf /var/lib/apt/lists/* && pnpx puppeteer browsers install chrome
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY ts* ./

FROM base AS build
COPY . ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run db:generate && pnpm build

FROM base
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD [ "pnpm", "start" ]