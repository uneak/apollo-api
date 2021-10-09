FROM node:16-alpine AS dev_deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:16-alpine AS prod_deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

# Rebuild the source code only when needed
FROM node:16-alpine AS build
WORKDIR /app
COPY . .
COPY --from=dev_deps /app/node_modules ./node_modules
RUN yarn build

# Production image, copy all the files and start
FROM node:16-alpine AS runner
WORKDIR /app
COPY --from=build /app/build .
COPY --from=prod_deps /app/node_modules ./node_modules
EXPOSE 4000

#CMD ["node", "index.js"]