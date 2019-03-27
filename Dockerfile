FROM docker.io/node:10


# Create app directory
RUN mkdir -p /home/happy-game
WORKDIR /home/happy-game

COPY . /home/happy-game


RUN npm install --registry=https://registry.npm.taobao.org

# Bundle app source



EXPOSE 7041


CMD [ "npm", "start" ]
