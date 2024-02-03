import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Example from '../database/models/ExampleModel';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes da rota /leaderboard', () => {

  it('Deve retornar todas as partidas ao executar o método GET em "/leaderboard/away"', async () => {
    const res = await chai.request(app).get('/leaderboard');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
  });

  it('Deve retornar todas as partidas ao executar o método GET em "/leaderboard/home"', async () => {
    const res = await chai.request(app).get('/leaderboard/home');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
  });

  it('Deve retornar todas as partidas ao executar o método GET em "/leaderboard/away"', async () => {
    const res = await chai.request(app).get('/leaderboard/away');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
  });
  
  
});
