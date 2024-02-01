import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Example from '../database/models/ExampleModel';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes da rota /matches', () => {


  it('Deve retornar todas as partidas ao executar o método GET em "/matches"', async () => {
    const res = await chai.request(app).get('/matches');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
  });

  it('Deve retornar todas as partidas em progresso', async () => {
    const res = await chai.request(app).get('/matches?inProgress=true');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0].inProgress).to.be.true;
    expect(res.body[1].inProgress).to.be.true;
    expect(res.body[5].inProgress).to.be.true;
  });

  it('Deve retornar todas as partidas finalizadas', async () => {
    const res = await chai.request(app).get('/matches?inProgress=false');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0].inProgress).to.be.false;
    expect(res.body[1].inProgress).to.be.false;
    expect(res.body[5].inProgress).to.be.false;
  });
  
});
