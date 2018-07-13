FROM node:8.5.0

# install dependencies
RUN mkdir -p /scheduler
ADD package.json /scheduler/package.json
WORKDIR /scheduler
RUN npm install

# Add source code of `scheduler`
ADD . /scheduler

EXPOSE 3000
