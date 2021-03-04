FROM node:10-alpine

RUN apk add --no-cache --virtual .gyp \
    python \
    make \
    g++


RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY client /usr/src/app/
COPY proto /usr/src/app/
COPY proto/account.proto /usr/src/app/proto/
COPY proto/auth.proto /usr/src/app/proto/
COPY proto/loc.proto /usr/src/app/proto/
COPY . /usr/src/app/

RUN cd /usr/src/app/
RUN npm install --unsafe-perm
RUN npm i --save grpc

RUN apk del .gyp

EXPOSE 50052
EXPOSE 2001

CMD node index.js


# COPY ./package.json /usr/src/app/
# COPY . /usr/src/app/

# RUN cd /usr/src/app/
# RUN npm install
# RUN apk del .gyp

# CMD node index.js

# EXPOSE 3000
# EXPOSE 465

