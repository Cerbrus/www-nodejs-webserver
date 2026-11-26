FROM node:26-slim AS base
RUN npm install --global yarn@1.22.22 && npm cache clean --force


FROM base AS build
WORKDIR /repo

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build


FROM base
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3010

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production && yarn cache clean

COPY --from=build /repo/dist ./dist

EXPOSE 3010
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:' + process.env.PORT + '/404').then(r => process.exit(r.status === 404 ? 0 : 1)).catch(() => process.exit(1))"

USER node
CMD ["node", "dist/server/app.js"]
