var should = require('should');
var postman = require('../lib/main');



var traceError = function (error, retval) {
  if (error) {
    console.log(error);
    return;
  }
  console.log(retval);
}


/**
 *    DEFINITION OF OBJECT PARAMETER
 */

var who = { "firstname" : "Joseph",
            "lastname" : "SOUCY",            
            "number_address" : "64",
            "address" : "boulevard Aristide Briand",
            "zipcode" : "76120",
            "town" : "LE GRAND-QUEVILLY"
          };

var what = ["mcsapparel","les-3-suisses","la-redoute",'maisonsdumonde'];

describe('letterBox', function() {
    describe('with no arguments', function() {
        it('throw ERROR', function() {
          (function () {
            postman.letterBox();
          }).should.throw();  
        });
    });

    describe('with number argument different to 2 or 3', function() {
        it('throw ERROR', function() {
          (function () {          
            postman.letterBox("");
          }).should.throw();
        });

         it('throw ERROR', function() {
          (function () {
            postman.letterBox("","", "", "");
          }).should.throw();
        });
    });

    describe('With 3 invalids arguments', function() {
        it('throw ERROR', function() {
          (function () {
            postman.letterBox("","","");
          }).should.throw();
        });
    });

    describe('With 3 correct arguments', function() {
        it('callback if JSON Object for recipient is not correct', function() {   
          (function () {
            postman.letterBox("",what, traceError);
          }).should.throw();     
        });
        it('return OK if args are correct', function() {        
          postman.letterBox(who, what,traceError).should.be.true;
        });
        it('build complete WHO information', function() {        
          var recipient = postman.buildRecipient(who);
          recipient.should.have.property('complete_address');
          recipient.should.have.property('email');          
          recipient.should.have.property('birthday');
        });
        it('callback if recipient is register to catalogs provided', function(done) {        
          postman.letterBox(who,function(err){
            if (err) console.log(err);
            done();
          });
        });
        it('callback if recipient is register', function(done) {        
          //this.timeout(50000);
          postman.letterBox(who,['ullapopken'/*'madeleine','damart','camif','bonprixservice','afibel','bleu-bonheur'*/],function(err){
            if (err) console.log(err);
            done();
          });
        });
    });
});
