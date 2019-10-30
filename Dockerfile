FROM node:10-alpine

ARG BUILD_ARGUMENT_REGISTRY=https://registry.npmjs.org
ENV npm_config_registry=$BUILD_ARGUMENT_REGISTRY

COPY --chown=node:node package.json package-lock.json /app/
COPY --chown=node:node scripts/ /app/scripts/

WORKDIR /app
USER node

RUN npm install --no-optional --silent && \
    npm cache clear --force

COPY --chown=node:node . /app
RUN npm run build

CMD npm run migrate && npm start
