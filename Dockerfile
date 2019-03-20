FROM 192.168.1.202/common/baseeternal


RUN echo "Asia/Shanghai" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata


# Create app directory
WORKDIR /home/cloud-chat-base

RUN npm install winston
RUN npm install winston-daily-rotate-file

# Bundle app source
COPY . /home/cloud-chat-base

COPY ./lib/component/push/push-2016-08-01.json /home/cloud-chat-base/node_modules/aliyun-sdk/apis/push-2016-08-01.json

EXPOSE 6666
#EXPOSE 7042
EXPOSE 7044
EXPOSE 7043


CMD [ "npm", "start" ]