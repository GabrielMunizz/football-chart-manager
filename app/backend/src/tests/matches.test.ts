import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Example from '../database/models/ExampleModel';

import { Response } from 'superagent';
import MatchesService from '../database/services/MatchesService';
import MatchesModel from '../database/models/MatchesModel';


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

  it('Deve alterar uma partida em progresso para finalizada com sucesso', async () => {
    const matchId = 45;
    const mockToken = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDY5NzEwNTd9.0ViYgu0fjFcrrZVdbqDselu3exp6H_wE2UaETUsGrqE'
    
    
    const updateStub = sinon.stub(MatchesModel, 'update').resolves([1])

    const finishMatchSpy = sinon.spy(MatchesService, 'finishMatch');
       
    const res = await chai.request(app)
      .patch(`/matches/${matchId}/finish`).set('Authorization', mockToken);
   
    
    expect(res).to.have.status(200);
    expect(res.body).to.be.deep.equal({ message: 'Finished' });
    sinon.assert.calledOnceWithExactly(finishMatchSpy, matchId);  
    
    updateStub.restore();
    finishMatchSpy.restore();
  });

  it('Deve retornar status 404 quando uma partida não for encontrada ou já estiver finalizada', async () => {
    const matchId = 1;
    const mockToken = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDY5NzEwNTd9.0ViYgu0fjFcrrZVdbqDselu3exp6H_wE2UaETUsGrqE'
    
    
    const updateStub = sinon.stub(MatchesModel, 'update').resolves([0])

    const finishMatchSpy = sinon.spy(MatchesService, 'finishMatch');
       
    const res = await chai.request(app)
      .patch(`/matches/${matchId}/finish`).set('Authorization', mockToken);
   
    
    expect(res).to.have.status(404);
    expect(res.body).to.be.deep.equal({ message: 'Match not found' });
    sinon.assert.calledOnceWithExactly(finishMatchSpy, matchId);  
    
    updateStub.restore();
    finishMatchSpy.restore();
  });
  
  it('Deve alterar o placar de uma partida em andamento com sucesso', async () => {
    const matchId = 45;
    const mockToken = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDY5NzEwNTd9.0ViYgu0fjFcrrZVdbqDselu3exp6H_wE2UaETUsGrqE'
    
    
    const updateStub = sinon.stub(MatchesModel, 'update').resolves([1])

    const finishMatchSpy = sinon.spy(MatchesService, 'updateMatchScore');
       
    const res = await chai.request(app)
      .patch(`/matches/${matchId}`).set('Authorization', mockToken);
   
    
    expect(res).to.have.status(200);
    expect(res.body).to.be.deep.equal({ message: `Match id: ${matchId} score updated!` });
    sinon.assert.calledOnceWithExactly(finishMatchSpy, matchId, sinon.match.any);  
    
    updateStub.restore();
    finishMatchSpy.restore();
  });

  it('Deve retornar status 404 ao tentar alterar placar de partida não encontrada ou já estiver finalizada', async () => {
    const matchId = 1;
    const mockToken = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDY5NzEwNTd9.0ViYgu0fjFcrrZVdbqDselu3exp6H_wE2UaETUsGrqE'
    
    
    const updateStub = sinon.stub(MatchesModel, 'update').resolves([0])

    const finishMatchSpy = sinon.spy(MatchesService, 'updateMatchScore');
       
    const res = await chai.request(app)
      .patch(`/matches/${matchId}`).set('Authorization', mockToken);
   
    
    expect(res).to.have.status(404);
    expect(res.body).to.be.deep.equal({ message: 'Match not found' });
    sinon.assert.calledOnceWithExactly(finishMatchSpy, matchId, sinon.match.any);  
    
    updateStub.restore();
    finishMatchSpy.restore();
  });

  it('Deve inserir uma partida em andamento com sucesso', async () => {
    
    const mockToken = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDY5NzEwNTd9.0ViYgu0fjFcrrZVdbqDselu3exp6H_wE2UaETUsGrqE'
    const mockMatch = {
      id: 49,
      homeTeamId: 16, 
      awayTeamId: 8, 
      homeTeamGoals: 1,
      awayTeamGoals: 2,
      inProgress: true,
    }

    const mockBuild = MatchesModel.build(mockMatch)
    
    const createStub = sinon.stub(MatchesModel, 'create').resolves(mockBuild)

    const insertMatchSpy = sinon.spy(MatchesService.prototype, 'insertMatch');
       
    const res = await chai.request(app)
      .post(`/matches`).send(
        {
        homeTeamId: 16, 
        awayTeamId: 8, 
        homeTeamGoals: 1,
        awayTeamGoals: 2,
      }).set('Authorization', mockToken);
       
    sinon.assert.calledOnceWithExactly(createStub, sinon.match.any)

    sinon.assert.calledOnceWithExactly(insertMatchSpy, sinon.match.any);
    
    expect(res).to.have.status(201);
    expect(res.body).to.be.deep.equal(mockBuild.dataValues);      
    
    createStub.restore();
    insertMatchSpy.restore();
  });

  it('Deve retornar status 422 e um mensagem ao tentar criar partida com times iguais', async () => {
    
    const mockToken = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDY5NzEwNTd9.0ViYgu0fjFcrrZVdbqDselu3exp6H_wE2UaETUsGrqE'
    
    const insertMatchSpy = sinon.spy(MatchesService.prototype, 'insertMatch');
       
    const res = await chai.request(app)
      .post(`/matches`).send(
        {
        homeTeamId: 8, 
        awayTeamId: 8, 
        homeTeamGoals: 1,
        awayTeamGoals: 2,
      }).set('Authorization', mockToken);  

    sinon.assert.calledOnceWithExactly(insertMatchSpy, sinon.match.any);
    
    expect(res).to.have.status(422);
    expect(res.body).to.be.deep.equal(
      {
        message: 'It is not possible to create a match with two equal teams',
      }); 
    
    insertMatchSpy.restore();
  });

  it('Deve retornar status 404 e um mensagem ao tentar criar partida com times que possuam id não encontrados', async () => {
    
    const mockToken = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDY5NzEwNTd9.0ViYgu0fjFcrrZVdbqDselu3exp6H_wE2UaETUsGrqE'
    
    const insertMatchSpy = sinon.spy(MatchesService.prototype, 'insertMatch');
       
    const res = await chai.request(app)
      .post(`/matches`).send(
        {
        homeTeamId: 50, 
        awayTeamId: 99, 
        homeTeamGoals: 1,
        awayTeamGoals: 2,
      }).set('Authorization', mockToken);  

    sinon.assert.calledOnceWithExactly(insertMatchSpy, sinon.match.any);
    
    expect(res).to.have.status(404);
    expect(res.body).to.be.deep.equal(
      {
        message: 'There is no team with such id!',
      }); 
    
    insertMatchSpy.restore();
  });
});
