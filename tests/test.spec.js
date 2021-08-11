let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../app");
var faker = require('faker');
const { before, beforeEach } = require("mocha");
const should = chai.should();
chai.use(chaiHttp);

describe('Endpoints', () => {
    // variables used in API unit testing
    var randomFirstName;
    var randomFirstName2;
    var randomLastName;    
    var randomLastName2;
    var randomMobile;
    var randomEmail;
    var randomEmail2;
    var randomPassword;
    var randomPassword2;
    var randomPpsn;
    var randomDateOfBirth;                
    var selectedGender;
    var randomNationality;
    var randomAddressOne;
    var randomAddressTwo;
    var randomCity;
    var randomPostCode;
    var selectedVaccinePreference;
    var token;
    var vaccinationDetailsId;

    before((done) => {
        // variable setup before running test cases
        // some variables generated using faker.js package methods to simulate expected data
        randomFirstName = faker.name.firstName();
        randomFirstName2 = faker.name.firstName();
        randomLastName = faker.name.lastName();
        randomLastName2 = faker.name.lastName();
        randomMobile = faker.phone.phoneNumber();
        randomEmail = faker.internet.email(randomFirstName, randomLastName);
        randomEmail2 = faker.internet.email();
        randomPassword = faker.internet.password();
        randomPassword2 = faker.internet.password();
        randomPpsn = faker.datatype.string();
        randomDateOfBirth = faker.date.between('1940-01-01', '2002-01-01');
        selectedGender = 'Male';
        randomNationality = faker.address.country();
        randomAddressOne = faker.address.streetAddress();
        randomAddressTwo = faker.address.secondaryAddress();
        randomCity = faker.address.city();
        randomPostCode = faker.address.zipCode();
        selectedVaccinePreference = 'Pfizer';
        done();
    });

    // tests for /api/users/createUser endpoint
    describe('/api/users/createUser endpoint', () => {
        it("should return user successfully created for successful register POST request", (done) => {
            let user = {
                firstName: randomFirstName,
                lastName: randomLastName,
                mobile: randomMobile,
                email: randomEmail,
                password: randomPassword,
            };
            // post request made to /api/users/createUser endpoint using user json data above
            chai.request(app).post('/api/users/createUser').send(user).end((err, response) => {
                console.log("should return user successfully created for successful register POST request");
                console.log(response.body);
                console.log(response.status);
                // success status and following message and result property expected in response to a successful POST request
                response.should.have.status(201);
                response.body.message.should.equal("User Created Successfully");
                response.body.should.have.property("result");
                done();
            });
        });

        it("should return error for register POST request for an already registered email", (done) => {
            let user = {
                firstName: randomFirstName,
                lastName: randomLastName,
                mobile: randomMobile,
                email: randomEmail,
                password: randomPassword,
            };
            
            // post request made to /api/users/createUser endpoint using user json data above.
            // This request uses the same randomEmail that was used for the original successful request to create a user and as per our User schema, email must be unique if to be saved in the MongoDB user collection.
            chai.request(app).post('/api/users/createUser').send(user).end((err, response) => {
                console.log("should return error for register POST request for an already registered email");
                console.log(response.body);
                console.log(response.status);
                // error status expected in response to an unsuccessful POST request using an already registered user's email
                response.should.have.status(500);
                done();
            });
        });
    });

    // tests for /api/users/login endpoint
    describe('/api/users/login endpoint', () => {
        it("should return error status for unsuccessful login POST request using invalid email", (done) => {
            let userLoginDetails = {
                email: 'fakeEmail@live.com',
                password: 'fakePassword',
            };

            // post request made to /api/users/login endpoint using user json data above.
            // This request uses an invalid email and password for which there is no registered user.
            chai.request(app).post('/api/users/login').send(userLoginDetails).end((err, response) => {
                console.log("should return error status for unsuccessful login POST request using invalid email");
                console.log(response.body);
                console.log(response.status);
                // error status and following message expected in response to an unsuccessful POST request using invalid user credentials
                response.should.have.status(401);
                response.body.message.should.equal("Invalid User Credentials!");
                done();
            });
        });

        it("should return error status for unsuccessful login POST request using invalid password", (done) => {
            let userLoginDetails = {
                email: randomEmail,
                password: 'fakePassword',
            };
            
            // post request made to /api/users/login endpoint using user json data above.
            // This request uses an invalid password for registered user.
            chai.request(app).post('/api/users/login').send(userLoginDetails).end((err, response) => {
                console.log("should return error status for unsuccessful login POST request using invalid password");
                console.log(response.body);
                console.log(response.status);
                // error status and following message expected in response to an unsuccessful POST request using invalid user credentials
                response.should.have.status(401);
                response.body.message.should.equal("Invalid User Credentials!");
                done();
            });
        });

        it("should return user success status for successful login POST request", (done) => {
            let userLoginDetails = {
                email: randomEmail,
                password: randomPassword,
            };

            // post request made to /api/users/login endpoint using user json data above.
            // This request uses the valid email and password that were used in creating a new registered user in an above test case.
            chai.request(app).post('/api/users/login').send(userLoginDetails).end((err, response) => {
                console.log("should return user success status for successful login POST request");
                console.log(response.body);
                console.log(response.status);
                // success status and following result properties expected in response to a successful POST request
                response.should.have.status(200);
                response.body.should.have.property("token");
                response.body.should.have.property("expiresIn");
                done();
            });
        });
    });

    // tests for /api/vaccinationDetails/addVaccinationDetails endpoint
    describe('/api/vaccinationDetails/addVaccinationDetails endpoint', ()=> {
        it("should return vaccination details successfully added for successful POST request", (done) => {
            let details = {
                ppsn: randomPpsn,
                dateOfBirth: randomDateOfBirth,
                selectedGender: selectedGender,
                nationality: randomNationality,
                addressOne: randomAddressOne,
                addressTwo: randomAddressTwo,
                city: randomCity,
                postCode: randomPostCode,
                selectedVaccinePreference: selectedVaccinePreference
            }

            let userLoginDetails = {
                email: randomEmail,
                password: randomPassword,
            };

            // Initially, post request made to /api/users/login endpoint using user login details json data above.
            // This request uses the valid email and password that were used in creating a new registered user in an above test case.
            chai.request(app).post('/api/users/login').send(userLoginDetails).end((err, response) => {
                token = response.body.token;
                // Secondly, post request made to /api/vaccinationDetails/addVaccinationDetails endpoint using vaccination details json data above.
                // This request also appended the token for the logged in user to the Authorization header of the request.
                chai.request(app).post('/api/vaccinationDetails/addVaccinationDetails').set("Authorization", 'Bearer '+token).send(details).end((err, response) => {
                    console.log("should return vaccination details successfully added for successful POST request");
                    console.log(response.body);
                    console.log(response.status);
                    // success status and following message and result property expected in response to a successful POST request
                    response.should.have.status(201);
                    response.body.message.should.equal("Vaccination Details Added Successfully");
                    response.body.should.have.property("userVaccinationDetails");
                    done();
                });
            });
        });

        it("should return error status for unsuccessful POST request using a null ppsn as all values are required", (done) => {
            let details = {
                ppsn: null,
                dateOfBirth: randomDateOfBirth,
                selectedGender: selectedGender,
                nationality: randomNationality,
                addressOne: randomAddressOne,
                addressTwo: randomAddressTwo,
                city: randomCity,
                postCode: randomPostCode,
                selectedVaccinePreference: selectedVaccinePreference
            }

            let userLoginDetails = {
                email: randomEmail,
                password: randomPassword,
            };

            // Initially, post request made to /api/users/login endpoint using user login details json data above.
            // This request uses the valid email and password that were used in creating a new registered user in an above test case.
            chai.request(app).post('/api/users/login').send(userLoginDetails).end((err, response) => {
                token = response.body.token;
                // Secondly, post request made to /api/vaccinationDetails/addVaccinationDetails endpoint using vaccination details json data above.
                // The above vaccination details suppy ppsn as null but it is actually required as per the vaccination details schema and so cannot be saved to Vaccination Details MongoDB collection.
                // This request also appended the token for the logged in user to the Authorization header of the request.
                chai.request(app).post('/api/vaccinationDetails/addVaccinationDetails').set("Authorization", 'Bearer '+token).send(details).end((err, response) => {
                    console.log("should return error status for unsuccessful POST request using a null ppsn as all values are required");
                    console.log(response.body);
                    console.log(response.status);
                    // error status and following message expected in response to an unsuccessful POST request using invalid user credentials
                    response.should.have.status(500);
                    response.body.message.should.equal("Added Vaccination Details Could Not Be Saved!");
                    done();
                });
            });
        });

    });

    // tests for /api/vaccinationDetails/getVaccinationDetails endpoint
    describe('/api/vaccinationDetails/getVaccinationDetails endpoint', ()=> {
        it("should return vaccination details successfully retrieved for successful GET request", (done) => {
            let userLoginDetails = {
                email: randomEmail,
                password: randomPassword,
            };

            // Initially, post request made to /api/users/login endpoint using user login details json data above.
            // This request uses the valid email and password that were used in creating a new registered user in an above test case.
            chai.request(app).post('/api/users/login').send(userLoginDetails).end((err, response) => {
                token = response.body.token;
                // Secondly, GET request made to /api/vaccinationDetails/getVaccinationDetails endpoint.
                // This request also appended the token for the logged in user to the Authorization header of the request.
                chai.request(app).get('/api/vaccinationDetails/getVaccinationDetails').set("Authorization", 'Bearer '+token).end((err, response) => {
                    console.log("should return vaccination details successfully retrieved for successful GET request");
                    console.log(response.body);
                    console.log(response.status);
                    // success status and following message expected in response to a successful GET request
                    response.should.have.status(200);
                    response.body.message.should.equal("Vaccination Details Retrieved Successfully");
                    done();
                });
            });
        });

        it("should return error status for unsuccessful GET request where registered user has not yet added vaccination details", (done) => {
            let user = {
                firstName: randomFirstName2,
                lastName: randomLastName2,
                mobile: randomMobile,
                email: randomEmail2,
                password: randomPassword2,
            };

            // Initially, post request made to /api/users/createUser endpoint using user details json data above.
            // This request uses a new first and last name, email and password; to that which were used in creating a new registered user in an above test case.
            chai.request(app).post('/api/users/createUser').send(user).end((err, response) => {
                let userLoginDetails = {
                    email: randomEmail2,
                    password: randomPassword2,
                };
                // Secondly, post request made to /api/users/login endpoint using user login details json data above.
                // This request uses the valid email and password that were used in creating the new registered user in the lines above.
                chai.request(app).post('/api/users/login').send(userLoginDetails).end((err, response) => {
                    token = response.body.token;
                    // Finally, GET request made to /api/vaccinationDetails/getVaccinationDetail.
                    // This request also appended the token for the logged in user to the Authorization header of the request.
                    chai.request(app).get('/api/vaccinationDetails/getVaccinationDetails').set("Authorization", 'Bearer '+token).end((err, response) => {
                        console.log("should return error status for unsuccessful GET request where registered user has not yet added vaccination details");
                        console.log(response.body);
                        console.log(response.status);
                        // error status and following message expected in response to an unsuccessful POST request using invalid user credentials
                        response.should.have.status(404);
                        response.body.message.should.equal("Vaccination Details Not Yet Added!");
                        done();
                    });
                });

            });
        });
    });

    // tests for /api/vaccinationDetails/updateVaccinationDetails endpoint
    describe('/api/vaccinationDetails/updateVaccinationDetails endpoint', ()=> {

        it("should return vaccination details successfully updated for successful PUT request", (done) => {
            let userLoginDetails = {
                email: randomEmail,
                password: randomPassword,
            };
            
            // Initially, post request made to /api/users/login endpoint using user login details json data above.
            // This request uses the valid email and password that were used in creating a new registered user in an above test case.
            chai.request(app).post('/api/users/login').send(userLoginDetails).end((err, response) => {
                token = response.body.token;
                // Secondly, GET request made to /api/vaccinationDetails/getVaccinationDetail.
                // This request also appended the token for the logged in user to the Authorization header of the request.
                chai.request(app).get('/api/vaccinationDetails/getVaccinationDetails').set("Authorization", 'Bearer '+token).end((err, response) => {
                    vaccinationDetailsId = response.body.userVaccinationDetails._id;
    
                    let details = {
                        _id: vaccinationDetailsId,
                        ppsn: randomPpsn,
                        dateOfBirth: randomDateOfBirth,
                        selectedGender: selectedGender,
                        nationality: randomNationality,
                        addressOne: randomAddressOne,
                        addressTwo: randomAddressTwo,
                        city: randomCity,
                        postCode: randomPostCode,
                        selectedVaccinePreference: 'Astrazenaca'
                    }
                    
                    // Finally, PUT request made to /api/vaccinationDetails/updateVaccinationDetails using updated vaccination details for the user in the json data above.
                    // The GET Request retrieves the original vaccination details Id for the user which can be passed when updating the vaccination details. 
                    // This request also appended the token for the logged in user to the Authorization header of the request.
                    chai.request(app).put('/api/vaccinationDetails/updateVaccinationDetails').set("Authorization", 'Bearer '+token).send(details).end((err, response) => {
                        console.log("should return vaccination details successfully updated for successful PUT request");
                        console.log(response.body);
                        console.log(response.status);
                        // success status and following message expected in response to a successful PUT request
                        response.should.have.status(200);
                        response.body.message.should.equal("Vaccination Details Updated Successfully");
                        done();
                    });
                });
            });
        });

        it("should return an error status updated for PUT request where vaccination details are unchanged", (done) => {
            let userLoginDetails = {
                email: randomEmail,
                password: randomPassword,
            };
    
            // Initially, post request made to /api/users/login endpoint using user login details json data above.
            // This request uses the valid email and password that were used in creating a new registered user in an above test case.
            chai.request(app).post('/api/users/login').send(userLoginDetails).end((err, response) => {
                token = response.body.token;
                // Secondly, GET request made to /api/vaccinationDetails/getVaccinationDetail.
                // This request also appended the token for the logged in user to the Authorization header of the request.
                chai.request(app).get('/api/vaccinationDetails/getVaccinationDetails').set("Authorization", 'Bearer '+token).end((err, response) => {
                    vaccinationDetailsId = response.body.userVaccinationDetails._id;
    
                    let details = {
                        _id: vaccinationDetailsId,
                        ppsn: randomPpsn,
                        dateOfBirth: randomDateOfBirth,
                        selectedGender: selectedGender,
                        nationality: randomNationality,
                        addressOne: randomAddressOne,
                        addressTwo: randomAddressTwo,
                        city: randomCity,
                        postCode: randomPostCode,
                        selectedVaccinePreference: 'Astrazenaca'
                    }
                    
                    // Finally, PUT request made to /api/vaccinationDetails/updateVaccinationDetails using updated vaccination details for the user in the json data above.
                    // The GET Request retrieves the original vaccination details Id for the user which can be passed when updating the vaccination details.
                    // There is no change to the vaccination details here compared to that updated in the previous test case.
                    // This request also appended the token for the logged in user to the Authorization header of the request.
                    chai.request(app).put('/api/vaccinationDetails/updateVaccinationDetails').set("Authorization", 'Bearer '+token).send(details).end((err, response) => {
                        console.log("should return an error status updated for PUT request where vaccination details are unchanged");
                        console.log(response.body);
                        console.log(response.status);
                        // error status and following message expected in response to an unsuccessful PUT request using unchanged vaccination details
                        response.should.have.status(401);
                        response.body.message.should.equal("No Change to Vaccination Details!");
                        done();
                    });
                });
            });
        });

        it("should return an error status updated for PUT request using invalid vaccination details Id", (done) => {
            let userLoginDetails = {
                email: randomEmail,
                password: randomPassword,
            };
    
            // Initially, post request made to /api/users/login endpoint using user login details json data above.
            // This request uses the valid email and password that were used in creating a new registered user in an above test case.
            chai.request(app).post('/api/users/login').send(userLoginDetails).end((err, response) => {
                token = response.body.token;
                // Secondly, GET request made to /api/vaccinationDetails/getVaccinationDetail.
                // This request also appended the token for the logged in user to the Authorization header of the request.
                chai.request(app).get('/api/vaccinationDetails/getVaccinationDetails').set("Authorization", 'Bearer '+token).end((err, response) => {
                    vaccinationDetailsId = 'invalidId';
    
                    let details = {
                        _id: vaccinationDetailsId,
                        ppsn: randomPpsn,
                        dateOfBirth: randomDateOfBirth,
                        selectedGender: selectedGender,
                        nationality: randomNationality,
                        addressOne: randomAddressOne,
                        addressTwo: randomAddressTwo,
                        city: randomCity,
                        postCode: randomPostCode,
                        selectedVaccinePreference: 'Astrazenaca'
                    }
                    
                    // Finally, PUT request made to /api/vaccinationDetails/updateVaccinationDetails using vaccination details for the user in the json data above.
                    // An invalid vaccination details Id is used.
                    // There is no change to the vaccination details here compared to that updated in the previous test case.
                    // This request also appended the token for the logged in user to the Authorization header of the request.
                    chai.request(app).put('/api/vaccinationDetails/updateVaccinationDetails').set("Authorization", 'Bearer '+token).send(details).end((err, response) => {
                        console.log("should return an error status updated for PUT request using invalid vaccination details Id");
                        console.log(response.body);
                        console.log(response.status);
                        // error status and following message expected in response to an unsuccessful PUT request using invalid vaccination details for update
                        response.should.have.status(500);
                        response.body.message.should.equal("Updated Vaccination Details Could Not Be Saved!");
                        done();
                    });
                });
            });
        });
    });

    // test for app.js error handling
    describe('app.js error handler', ()=> {

        it("should return an error for request made to invalid API endpoint", (done) => {
            let userLoginDetails = {
                email: randomEmail,
                password: randomPassword,
            };

            // POST request made to login user using user json data above.
            // This request uses the valid email and password that were used in creating a new registered user in an above test case.
            // However the request is made to the wrong API path.
            chai.request(app).post('/api/userFail/login').send(userLoginDetails).end((err, response) => {
                console.log("should return an error for request made to invalid API endpoint");
                console.log(response.status);
                // error status expected in response to an unsuccessful POST request sent to invalid API Path endpoint
                response.should.have.status(404);
                done();
            });
        });
    });

    // test for check-auth.js error handling
    describe('check-auth.js error handler', ()=> {

        it("should return an error for request made to protected API endpoint with an invalid token", (done) => {
            let userLoginDetails = {
                email: randomEmail,
                password: randomPassword,
            };

            // Initially, post request made to /api/users/login endpoint using user login details json data above.
            // This request uses the valid email and password that were used in creating a new registered user in an above test case.
            chai.request(app).post('/api/users/login').send(userLoginDetails).end((err, response) => {
                token = 'Invalid Token';
                // Secondly, GET request made to /api/vaccinationDetails/getVaccinationDetail.
                // This request also appended an invalid token to the Authorization header of the request.
                chai.request(app).get('/api/vaccinationDetails/getVaccinationDetails').set("Authorization", 'Bearer '+token).end((err, response) => {
                    console.log("should return an error for request made to protected API endpoint with an invalid token");
                    console.log(response.body);
                    console.log(response.status);
                    // error status and following message expected in response to an unsuccessful GET request sent with an invalid token
                    response.should.have.status(401);
                    response.body.message.should.equal("Authentication Failed");
                    done();
                });
            });
        });
    });

});