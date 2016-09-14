var chai = require('chai'); 
var expect = require('chai').expect; 
var deepEqual = require('chai').deepEqual; 



describe('REFERENCE: Mocha Functionality/Syntax', function(){
    var word = 'hello';
    it('testing pending in Mocha'); 
    it('testing .to.equal', function(){
        expect(word).to.equal('hello'); 
    });
    it('testing .to.not.equal', function(){
        expect(word).to.not.equal('goodbye'); 
    }); 
    it('testing .to.be.a', function(){
        expect(word).to.be.a('string'); 
    }); 
    it('testing .to.not.be.a', function(){
        expect(word).to.not.be.a('number'); 
    }); 
    it('testing .to.contain', function(){
        expect(word).to.contain('hell'); 
    }); 
    it('testing .to.not.contain', function(){
        expect(word).to.not.contain('ucj'); 
    });    
    it('testing deepEqual on identical objects', function(){
        expect({'name':'scott'}).to.deep.equal({'name':'scott'}); 
    });
     
}); 