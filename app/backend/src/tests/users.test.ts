import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Example from '../database/models/ExampleModel';

import { Response } from 'superagent';
import ValidateToken from '../middlewares/validateToken';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes da rota /login', () => {

  it('Deve retornar um token ao fazer uma requisição valida a POST /login', async () => {
    const userMock = {     
      email: 'admin@admin.com',
      password: 'secret_admin'        
    }
    
    const res = await chai.request(app).post('/login').send(userMock);
    
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
  });

  it('Deve retornar status 401 ao fazer uma requisição com senha inválida a POST /login', async () => {
    const userMock = {     
      email: 'admin@admin.com',
      password: 'senha_invalida'        
    }
    
    const res = await chai.request(app).post('/login').send(userMock);
    
    expect(res).to.have.status(401);
    expect(res.body).to.be.an('object');
    expect(res.body).to.be.deep.equal(
      {
        message: "Invalid email or password"
      }
    )    
  });

  it('Deve retornar status 401 ao fazer uma requisição com email não encontrado a POST /login', async () => {
    const userMock = {     
      email: 'admin@xablau.com',
      password: 'secret_admin'        
    }
    
    const res = await chai.request(app).post('/login').send(userMock);   
    
    expect(res).to.have.status(401);
    expect(res.body).to.be.an('object');
    expect(res.body).to.be.deep.equal(
      {
        message: "Invalid email or password"
      }
    )    
  });

  it('Deve retornar status 401 ao fazer uma requisição com email inválido a POST /login', async () => {
    const userMock = {     
      email: 'inválido',
      password: 'secret_admin'        
    }
    
    const res = await chai.request(app).post('/login').send(userMock);    
    
    expect(res).to.have.status(401);
    expect(res.body).to.be.an('object');
    expect(res.body).to.be.deep.equal(
      {
        message: "Invalid email or password"
      }
    )    
  });

  it('Deve retornar status 400 ao fazer uma requisição sem email a POST /login', async () => {
    const userMock = {      
      password: 'secret_admin'        
    }
    
    const res = await chai.request(app).post('/login').send(userMock);
    
    expect(res).to.have.status(400);
    expect(res.body).to.be.an('object');
    expect(res.body).to.be.deep.equal(
      {
        message: "All fields must be filled"
      }
    )    
  });

  it('Deve retornar status 400 ao fazer uma requisição sem senha a POST /login', async () => {
    const userMock = {  
      email: 'admin@admin.com'               
    }
    
    const res = await chai.request(app).post('/login').send(userMock);
    
    expect(res).to.have.status(400);
    expect(res.body).to.be.an('object');
    expect(res.body).to.be.deep.equal(
      {
        message: "All fields must be filled"
      }
    )    
  });

  it('Deve retornar status 401 ao fazer uma requisição com senha abaixo de 6 caracteres a POST /login', async () => {
    const userMock = {  
      email: 'admin@admin.com',
      password: '123'                
    }
    
    const res = await chai.request(app).post('/login').send(userMock);
    
    expect(res).to.have.status(401);
    expect(res.body).to.be.an('object');
    expect(res.body).to.be.deep.equal(
      {
        message: 'Invalid email or password'
      }
    )    
  });

  it('Deve retornar status 200 ao fazer uma requisição com token válido a POST /login/role', async () => {
    const mockToken = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDY3Nzg2NzV9.Z1g-hDEiApcnLezMXUc5y4ZaeZd4bvD1x7Nhmyif554'    
    const res = await chai.request(app)
      .get('/login/role')
      .set('Authorization', mockToken);
   
    
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.be.deep.equal(
      { role: "admin" }
    )    
  });

  it('Deve retornar status 401 ao fazer uma requisição sem token a POST /login/role', async () => {
    const mockToken = ''    
    const res = await chai.request(app)
      .get('/login/role')
      .set('Authorization', mockToken);
   
    
    expect(res).to.have.status(401);
    expect(res.body).to.be.an('object');
    expect(res.body).to.be.deep.equal(
      { message: 'Token not found' }
    )    
  })

  it('Deve retornar status 401 ao fazer uma requisição com token inválido a POST /login/role', async () => {
    const mockToken = 'bearer invalido'    
    const res = await chai.request(app)
      .get('/login/role')
      .set('Authorization', mockToken);
   
    
    expect(res).to.have.status(401);
    expect(res.body).to.be.an('object');
    expect(res.body).to.be.deep.equal(
      { message: 'Token must be a valid token' }
    )    
  })

  it('Deve retornar status 401 ao fazer uma requisição com token sem "bearer" a POST /login/role', async () => {
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDY3Nzg2NzV9.Z1g-hDEiApcnLezMXUc5y4ZaeZd4bvD1x7Nhmyif554'    
    const res = await chai.request(app)
      .get('/login/role')
      .set('Authorization', mockToken);
   
    
    expect(res).to.have.status(401);
    expect(res.body).to.be.an('object');
    expect(res.body).to.be.deep.equal(
      { message: 'Token must be a valid token' }
    )    
  })

  // it('Deve retornar status 401 ao fazer uma requisição com token em formato inválido a POST /login/role', async () => {
  //   sinon.stub(ValidateToken, 'validate').resolves('invalid_token')
    
  //   const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDY3Nzg2NzV9.Z1g-hDEiApcnLezMXUc5y4ZaeZd4bvD1x7Nhmyif554'    
  //   const res = await chai.request(app)
  //     .get('/login/role')
  //     .set('Authorization', mockToken);
   
    
  //   expect(res).to.have.status(401);
  //   expect(res.body).to.be.an('object');
  //   expect(res.body).to.be.deep.equal(
  //     { message: 'Token must be a valid token' }
  //   )    
  // })
});