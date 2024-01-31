import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Example from '../database/models/ExampleModel';

import { Response } from 'superagent';

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
});