let chai = require("chai");
// let mongoose = require("mongoose");
let chaiHttp = require("chai-http");
// let server = require("../bin/www");
let app = require("../app");
// var user = require('../models/user.js');
var faker = require('faker');
const { before, beforeEach } = require("mocha");
const should = chai.should();
chai.use(chaiHttp);

describe('Endpoints', () => {
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

    describe('/api/users/createUser endpoint', () => {
        it("should return user successfully created for successful register POST request", (done) => {
            let user = {
                firstName: randomFirstName,
                lastName: randomLastName,
                mobile: randomMobile,
                email: randomEmail,
                password: randomPassword,
            };
            chai.request(app).post('/api/users/createUser').send(user).end((err, response) => {
                console.log("should return user successfully created for successful register POST request");
                console.log(response.body);
                console.log(response.status);
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
            chai.request(app).post('/api/users/createUser').send(user).end((err, response) => {
                console.log("should return error for register POST request for an already registered email");
                console.log(response.body);
                console.log(response.status);
                response.should.have.status(500);
                done();
            });
        });
    });

    describe('/api/users/login endpoint', () => {
        it("should return error status for unsuccessful login POST request using invalid email", (done) => {
            let userLoginDetails = {
                email: 'fakeEmail@live.com',
                password: 'fakePassword',
            };
            chai.request(app).post('/api/users/login').send(userLoginDetails).end((err, response) => {
                console.log("should return error status for unsuccessful login POST request using invalid email");
                console.log(response.body);
                console.log(response.status);
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
            chai.request(app).post('/api/users/login').send(userLoginDetails).end((err, response) => {
                console.log("should return error status for unsuccessful login POST request using invalid password");
                console.log(response.body);
                console.log(response.status);
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
            chai.request(app).post('/api/users/login').send(userLoginDetails).end((err, response) => {
                console.log("should return user success status for successful login POST request");
                console.log(response.body);
                console.log(response.status);
                response.should.have.status(200);
                response.body.should.have.property("token");
                response.body.should.have.property("expiresIn");
                done();
            });
        });
    });


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

            chai.request(app).post('/api/users/login').send(userLoginDetails).end((err, response) => {
                token = response.body.token;
                chai.request(app).post('/api/vaccinationDetails/addVaccinationDetails').set("Authorization", 'Bearer '+token).send(details).end((err, response) => {
                    console.log("should return vaccination details successfully added for successful POST request");
                    console.log(response.body);
                    console.log(response.status);
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

            chai.request(app).post('/api/users/login').send(userLoginDetails).end((err, response) => {
                token = response.body.token;
                chai.request(app).post('/api/vaccinationDetails/addVaccinationDetails').set("Authorization", 'Bearer '+token).send(details).end((err, response) => {
                    console.log("should return error status for unsuccessful POST request using a null ppsn as all values are required");
                    console.log(response.body);
                    console.log(response.status);
                    response.should.have.status(500);
                    response.body.message.should.equal("Added Vaccination Details Could Not Be Saved!");
                    done();
                });
            });
        });

    });

    describe('/api/vaccinationDetails/getVaccinationDetails endpoint', ()=> {
        it("should return vaccination details successfully retrieved for successful GET request", (done) => {
            let userLoginDetails = {
                email: randomEmail,
                password: randomPassword,
            };

            chai.request(app).post('/api/users/login').send(userLoginDetails).end((err, response) => {
                token = response.body.token;
                chai.request(app).get('/api/vaccinationDetails/getVaccinationDetails').set("Authorization", 'Bearer '+token).end((err, response) => {
                    console.log("should return vaccination details successfully retrieved for successful GET request");
                    console.log(response.body);
                    console.log(response.status);
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
            chai.request(app).post('/api/users/createUser').send(user).end((err, response) => {
                let userLoginDetails = {
                    email: randomEmail2,
                    password: randomPassword2,
                };
                chai.request(app).post('/api/users/login').send(userLoginDetails).end((err, response) => {
                    token = response.body.token;
                    chai.request(app).get('/api/vaccinationDetails/getVaccinationDetails').set("Authorization", 'Bearer '+token).end((err, response) => {
                        console.log("should return error status for unsuccessful GET request where registered user has not yet added vaccination details");
                        console.log(response.body);
                        console.log(response.status);
                        response.should.have.status(404);
                        response.body.message.should.equal("Vaccination Details Not Yet Added!");
                        done();
                    });
                });

            });
        });
    });

    describe('/api/vaccinationDetails/updateVaccinationDetails endpoint', ()=> {

        it("should return vaccination details successfully updated for successful PUT request", (done) => {
            let userLoginDetails = {
                email: randomEmail,
                password: randomPassword,
            };
    
            chai.request(app).post('/api/users/login').send(userLoginDetails).end((err, response) => {
                token = response.body.token;
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
    
                    chai.request(app).put('/api/vaccinationDetails/updateVaccinationDetails').set("Authorization", 'Bearer '+token).send(details).end((err, response) => {
                        console.log("should return vaccination details successfully updated for successful PUT request");
                        console.log(response.body);
                        console.log(response.status);
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
    
            chai.request(app).post('/api/users/login').send(userLoginDetails).end((err, response) => {
                token = response.body.token;
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
    
                    chai.request(app).put('/api/vaccinationDetails/updateVaccinationDetails').set("Authorization", 'Bearer '+token).send(details).end((err, response) => {
                        console.log("should return an error status updated for PUT request where vaccination details are unchanged");
                        console.log(response.body);
                        console.log(response.status);
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
    
            chai.request(app).post('/api/users/login').send(userLoginDetails).end((err, response) => {
                token = response.body.token;
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
    
                    chai.request(app).put('/api/vaccinationDetails/updateVaccinationDetails').set("Authorization", 'Bearer '+token).send(details).end((err, response) => {
                        console.log("should return an error status updated for PUT request using invalid vaccination details Id");
                        console.log(response.body);
                        console.log(response.status);
                        response.should.have.status(500);
                        response.body.message.should.equal("Updated Vaccination Details Could Not Be Saved!");
                        done();
                    });
                });
            });
        });
    });

    describe('app.js error handler', ()=> {

        it("should return an error for request made to invalid API endpoint", (done) => {
            let userLoginDetails = {
                email: randomEmail,
                password: randomPassword,
            };
            chai.request(app).post('/api/userFail/login').send(userLoginDetails).end((err, response) => {
                console.log("should return an error for request made to invalid API endpoint");
                // console.log(response.locals);
                console.log(response.status);
                response.should.have.status(404);
                done();
            });
        });
    });

    describe('check-auth.js error handler', ()=> {

        it("should return an error for request made to protected API endpoint with an invalid token", (done) => {
            let userLoginDetails = {
                email: randomEmail,
                password: randomPassword,
            };

            chai.request(app).post('/api/userFail/login').send(userLoginDetails).end((err, response) => {
                token = 'Invalid Token';
                chai.request(app).get('/api/vaccinationDetails/getVaccinationDetails').set("Authorization", 'Bearer '+token).end((err, response) => {
                    console.log("should return an error for request made to protected API endpoint with an invalid token");
                    console.log(response.body);
                    console.log(response.status);
                    response.should.have.status(401);
                    response.body.message.should.equal("Authentication Failed");
                    done();
                });
            });
        });
    });

});