FROM node:24-alpine
WORKDIR /app
COPY --chown=node:node . .
RUN mkdir -p data && chown node:node data
USER node
ENV PORT=3000
EXPOSE 3000
CMD ["node","server.js"]
