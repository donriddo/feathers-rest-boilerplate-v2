const Barrels = require('barrels');
const barrels = new Barrels();
const users = barrels.data.user;
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHTTP = require('chai-http');
const expect = chai.expect;
const assert = chai.assert;
const app = require('../server');
chai.use(chaiHTTP);
let token;
let id;

// let User = app.service('user');

describe('User service', function () {
  after(function (done) {
    if (mongoose.connection.db.databaseName === 'feathers_api_test')
      mongoose.connection.db.dropDatabase(done);
  });

  describe('#Setup', () => {
    it('registered the users service successfully', () => {
      assert.ok(app.service('user'));
    });

    it('Setup should be initialized', (done) => {
      let Setup = require('../../src/models/setup.model');
      Setup.findOne({ initialized: true })
        .then(setup => {
          expect(setup).to.have.property('initialized');
          expect(setup.initialized).to.equal(true);
          done();
        });
    });

    // it('SAAS User should be initialized', (done) => {
    //     User.find({ email: 'saas@sellingpoint.co' })
    //         .then(user => {
    //             console.log(user);
    //             expect(user).to.have.property('data');
    //             expect(user.data[0].email).to.equal('saas@sellingpoint.co');
    //             done();
    //         })
    //         .catch(done);
    // });
  });

  describe('#Create', () => {
    it('should return 400: Email and Password are required', (done) => {
      chai.request(app)
        .post('/user')
        .set('Accept', 'application/json')
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('name');
          expect(res.body.name).to.equal('BadRequest');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('user validation failed');
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors).to.have.all.keys('email', 'password');
          expect(res.body.errors.email).to.be.an('object');
          expect(res.body.errors.email).to.have.all.keys(
            'message', 'name', 'properties', 'kind', 'path'
          );
          expect(res.body.errors.password).to.be.an('object');
          expect(res.body.errors.password).to.have.all.keys(
            'message', 'name', 'properties', 'kind', 'path'
          );
          done();
        });
    });

    it('should return 400: Email is required', (done) => {
      chai.request(app)
        .post('/user')
        .set('Accept', 'application/json')
        .send(users[0])
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('name');
          expect(res.body.name).to.equal('BadRequest');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('user validation failed');
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors).to.have.all.keys('email');
          expect(res.body.errors.email).to.be.an('object');
          expect(res.body.errors.email).to.include.keys(
            'message', 'name', 'properties', 'kind', 'path'
          );
          done();
        });
    });

    it('should return 400: Password is required', (done) => {
      chai.request(app)
        .post('/user')
        .set('Accept', 'application/json')
        .send(users[1])
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('name');
          expect(res.body.name).to.equal('BadRequest');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('user validation failed');
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors).to.have.all.keys('password');
          expect(res.body.errors.password).to.be.an('object');
          expect(res.body.errors.password).to.include.keys(
            'message', 'name', 'properties', 'kind', 'path'
          );
          done();
        });
    });

    it('should return 201: User created and defaulted to role customer', (done) => {
      chai.request(app)
        .post('/user')
        .set('Accept', 'application/json')
        .send(users[2])
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('email');
          expect(res.body.email).to.equal('testUser');
          expect(res.body).to.have.property('role');
          expect(res.body.role).to.equal('customer');
          done();
        });
    });

    it('should return 400: Role is invalid', (done) => {
      chai.request(app)
        .post('/user')
        .set('Accept', 'application/json')
        .send(users[3])
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('name');
          expect(res.body.name).to.equal('BadRequest');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('user validation failed');
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors).to.have.all.keys('role');
          expect(res.body.errors.role).to.be.an('object');
          expect(res.body.errors.role).to.include.keys(
            'message', 'name', 'properties', 'kind', 'path'
          );
          done();
        });
    });

    it('should return 409: Email already exists', (done) => {
      chai.request(app)
        .post('/user')
        .set('Accept', 'application/json')
        .send(users[4])
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body).to.have.property('name');
          expect(res.body.name).to.equal('Conflict');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.have.string('already exists');
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('object');
          done();
        });
    });

    it('should return 201: User admin created', (done) => {
      chai.request(app)
        .post('/user')
        .set('Accept', 'application/json')
        .send(users[5])
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('email');
          expect(res.body.email).to.equal('testedUser');
          expect(res.body).to.have.property('role');
          expect(res.body.role).to.equal('admin');
          done();
        });
    });

  });

  describe('Login', () => {
    it('should return 401, Unauthorized', (done) => {
      chai.request(app)
        .get('/user')
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('name');
          expect(res.body.name).to.equal('NotAuthenticated');
          done();
        });
    });

    it('should return 200, Login successfully', (done) => {
      chai.request(app)
        .post('/login')
        .send(Object.assign({}, users[5], { strategy: 'local' }))
        .set('Accept', 'application/json')
        .end((err, res) => {
          token = res.body.accessToken;
          id = res.body.user._id;
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('accessToken');
          expect(res.body.accessToken).to.be.a('string');
          done();
        });
    });
  });

  describe('#Read', () => {
    it('should return 200, Users retrieved successfully', (done) => {
      chai.request(app)
        .get('/user')
        .set('Authorization', 'Bearer '.concat(token))
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('array');
          done();
        });
    });
  });

  describe('#Update', () => {
    it('should return 404: User not found', done => {
      chai.request(app)
        .put('/user/58a58b41ccd50a3f0ec99ee2')
        .set('Authorization', 'Bearer '.concat(token))
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('name');
          expect(res.body.name).to.equal('NotFound');
          done();
        });
    });

    it('should return 200: User updated successfully', done => {
      chai.request(app)
        .patch(`/user/${id}`)
        .send(users[5])
        .set('Authorization', 'Bearer '.concat(token))
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.include.keys('_id', 'email');
          done();
        });
    });
  });

  describe('#Delete', () => {
    it('should return 404: User not found', done => {
      chai.request(app)
        .delete('/user/58a58b41ccd50a3f0ec99ee2')
        .set('Authorization', 'Bearer '.concat(token))
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('name');
          expect(res.body.name).to.equal('NotFound');
          done();
        });
    });

    it('should return 200: User Soft-Deleted successfully', done => {
      chai.request(app)
        .delete(`/user/${id}`)
        .set('Authorization', 'Bearer '.concat(token))
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.include.keys('email', 'isDeleted');
          expect(res.body.isDeleted).to.equal(true);
          done();
        });
    });

    it('should return 404: User already Soft-Deleted', done => {
      chai.request(app)
        .get(`/user/${id}`)
        .set('Authorization', 'Bearer '.concat(token))
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('User not found');
          done();
        });
    });

    it('should return 200: Should also return if Deleted', done => {
      chai.request(app)
        .get(`/user/${id}?returnDeleted=true`)
        .set('Authorization', 'Bearer '.concat(token))
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.include.keys('_id', 'email', 'isDeleted');
          expect(res.body.isDeleted).to.equal(true);
          done();
        });
    });

    it('should return 404: Cannot update deleted user', done => {
      chai.request(app)
        .patch(`/user/${id}`)
        .set('Authorization', 'Bearer '.concat(token))
        .send(users[5])
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('User not found');
          done();
        });
    });

    it('should return 200: Should update Deleted', done => {
      chai.request(app)
        .patch(`/user/${id}?updateDeleted=true`)
        .set('Authorization', 'Bearer '.concat(token))
        .send({ isDeleted: false })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.include.keys('_id', 'email', 'isDeleted');
          expect(res.body.isDeleted).to.equal(false);
          done();
        });
    });

  });

});
