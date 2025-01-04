FROM node:23-alpine AS core

RUN apk add tini

ENV PNPM_HOME="/.pnpm"
RUN corepack enable
ENV PATH="$PNPM_HOME:$PATH"

FROM core AS base

WORKDIR /k8ute/app

ENV K8UTE_HOME="/k8ute/app"

COPY package.json pnpm-lock.yaml ${K8UTE_HOME}/

# ---
FROM base AS base-prod

RUN --mount=type=cache,id=pnpm,target=/.pnpm/store pnpm i --prod --frozen-lockfile

# ---
FROM base AS base-dev

RUN --mount=type=cache,id=pnpm,target=/.pnpm/store pnpm i --frozen-lockfile

# ---
FROM base-dev AS build

COPY tsconfig.json tsconfig.build.json .swcrc ${K8UTE_HOME}/

COPY src/ ${K8UTE_HOME}/src/

RUN pnpm build

# ---
FROM base-prod AS prod

COPY --from=build ${K8UTE_HOME}/dist ${K8UTE_HOME}/dist

ENV NODE_ENV=production

# ENTRYPOINT [ "/bin/ash" ]
ENTRYPOINT [ "/sbin/tini", "--" ]
CMD ["node", "dist/main.js"]
