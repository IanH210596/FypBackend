This API Project was generated using JS Express 4.16.1. Mongoose v5.12.15 was also used within this project for the MongoDB server and database connection and defining the database schema.

# Pre-requisites to run on localhost
Run `npm install` in command line with this project set to the current working directory in order to install the required node packages/modules as per the `package*.json` files. 

Ensure MongoDB is installed and running on port 27017 of your localhost.

# Run API on localhost
Run the following: `npm run start http://localhost:4200 http://localhost:9876 http://localhost mongodb://localhost:27017/fyp-db` in command line with this project set to the current working directory. The first three arguments whitelist the ports on localhost used to serve and test (Karma) the frontend project that need to make requests to the API. The final argument specifies the MongoDB connection string.

# Unit Test API on localhost
Run the following: `npm run test` to execute the API unit tests.

# Build Docker Image
To build the Docker image for this API project, the following command must be run:
`docker build --build-arg PORT01=??? --build-arg PORT02=??? --build-arg PORT03=??? --build-arg MONGOURL=???`. These arguments are required where the `???` are to be replaced by the Domains and Ports that need to be allowed for CORS and set equal to PORT01, PORT02 and PORT03. Finally the MONGOURL requires the MongoDB connection string.

# Kubernetes Manifest Yaml Files
Three manifest files, one each for localhost, staging and production, exist for this project. Both deploy containers for MongoDB and the API, along with Loadbalancers for each. The deployments can be made by running the command `kubectl apply -f [YAML-Filename].yml`, where `[YAML-Filename]` is the filename. 




