FROM docker.io/node:10


# Create app directory
WORKDIR /home/happy-game

RUN npm install --registry=https://registry.npm.taobao.org

# Bundle app source
COPY . /home/happy-game


EXPOSE 7041


CMD [ "npm", "start" ]