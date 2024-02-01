import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Example from '../database/models/ExampleModel';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes da rota /teams', () => {


  it('Deve retornar o resultado esperado ao executar o método GET em "/teams"', async () => {
    const res = await chai.request(app).get('/teams');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
  });

  it('Deve retornar um time ao executar o método GET em "/teams/id"', async () => {
    const res = await chai.request(app).get('/teams/1');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.be.deep.equal(
      {
        id: 1,
        teamName: "Avaí/Kindermann"
      }
    )
  });
});
