# Section executed when docker image is built
FROM node:14-alpine as build
# Argurments supplied when running docker build for the ports to whitelist for CORS and the URL for the MongoDB that the API must communicate with
ARG PORT01
ARG PORT02
ARG PORT03
ARG MONGOURL
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# The command to start the JS Express API and process.argv arguments supplied at image build time, that are to be passed when starting the API are saved to a file run.sh 
RUN echo "npm run start $PORT01 $PORT02 $PORT03 $MONGOURL" > run.sh
# End of Section

# Section executed when docker image is deployed
# When the image is deployed, port 3000 is exposed and the run.sh file is executed to start the API
EXPOSE 3000
CMD ["sh", "run.sh"]
# End of Section