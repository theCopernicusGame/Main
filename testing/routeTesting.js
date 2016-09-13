'use strict'
var chai = require('chai'); 
var chaiHttp = require('chai-http');
// var utils = require('./utils');
var should = chai.should(); 
var request = require('supertest'); 
// var exportObj = require('./../Server/Nurse/nurseMdl');
// var beds = require('./../Server/Bed/BedMdl');
// var Nurses = exportObj.nurse;
// utils();
// var config = require('./config.js')
// var nurseCtrl = require('./../Server/Nurse/nurseCtrl');




chai.use(chaiHttp); 

describe('ROUTE TESTING', function() {
    var url = 'localhost:3001';

    describe('Welcome Page', function(){
        it('should return 200 status on request to welcome page', function(done){
            chai.request(url)
            .get('/')
            .end(function(err,res){
                if (err) throw err; 
                res.should.have.status(200); 
                done();
                }); 
            }); 
    }); 
    
    describe('Choose Game Page', function(){
        it('should return 200 status on request to choose game page', function(done){
            chai.request(url)
            .get('/game')
            .end(function(err,res){
                if (err) throw err; 
                res.should.have.status(200); 
                done();
                }); 
            });
        it('should send player to room when player enters room name on choose game page', function(done){
            var n = 'testGame'; 
            chai.request(url)
                .post('/game')
                .type('form')
                .send(n)
                .end(function(err, res) {
                res.should.have.status(200)
                done(); 
            }); 
        });   
    });
      describe('Game Page', function(){
        it('should return 200 status on request to 1-player game page', function(done){
            chai.request(url)
            .get('/game/singleplayer')
            .end(function(err,res){
                if (err) throw err; 
                res.should.have.status(200); 
                done();
                }); 
            });   
         it('should return 200 status on request to multi-player game page', function(done){
            chai.request(url)
            .get('/game/test')
            .end(function(err,res){
                if (err) throw err; 
                res.should.have.status(200); 
                done();
                }); 
            });  
    });  
      // it('should return 400 status on request to non-existant page', function(done){
      //       chai.request(url)
      //       .get('/testing')
      //       .end(function(err,res){
      //           res.should.have.status(404); 
      //           done();
      //           })
      //       })
}); 