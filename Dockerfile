# Section executed when docker image is built
FROM node:14-alpine as build
ARG PORT01
ARG PORT02
ARG MONGOURL
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# The command to start the JS Express API and process.argv arguments supplied at image build time, that are to be passed when starting the API are saved to a file run.sh 
RUN echo "npm run start $PORT01 $PORT02 $MONGOURL" > run.sh
# End of Section

# Section executed when docker image is deployed
EXPOSE 3000
CMD ["sh", "run.sh"]
# CMD ["npm", "run", "start"]
# End of Section