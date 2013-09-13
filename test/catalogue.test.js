var should = require('should');
var PubMonVoisin = require('../lib/main');



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

var who = { "full_title" : "MR",
            "title" : "2",
            "firstname" : "Joseph",
            "lastname" : "SOUCY",
            "complete_address" : "64 boulevard Aristide Briand",
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
            var postman = new PubMonVoisin();
            postman.letterBox();
          }).should.throw();  
        });
    });

    describe('with number argument different to 2 or 3', function() {
        it('throw ERROR', function() {
          (function () {
            var postman = new PubMonVoisin();
            postman.letterBox("");
          }).should.throw();
        });

         it('throw ERROR', function() {
          (function () {
            var postman = new PubMonVoisin();
            postman.letterBox("","", "", "");
          }).should.throw();
        });
    });

    describe('With 3 invalids arguments', function() {
        it('throw ERROR', function() {
          (function () {
            var postman = new PubMonVoisin();
            postman.letterBox("","","");
          }).should.throw();
        });
    });

    describe('With 3 correct arguments', function() {
        it('callback if JSON Object for recipient is not correct', function() {   
          (function () {
            var postman = new PubMonVoisin();
            postman.letterBox("",what, traceError);
          }).should.throw();     
        });
        it('return OK if args are correct', function() {        
          var postman = new PubMonVoisin();
          postman.letterBox(who, what,traceError).should.be.true;
        });
        it('build complete WHO information', function() {        
          var postman = new PubMonVoisin();
          var recipient = postman.buildRecipient(who);
          recipient.should.have.property('email');
          recipient.should.have.property('birthday');
        });
        it('callback if recipient is register to catalogs provided', function(done) {        
          var postman = new PubMonVoisin();
          postman.letterBox(who,function(err){
            if (err) console.log(err);
            done();
          });
        });
        it('callback if recipient is register', function(done) {        
          this.timeout(50000);
          var postman = new PubMonVoisin();
          postman.letterBox(who,['ullapopken'/*'madeleine','damart','camif','bonprixservice','afibel','bleu-bonheur'*/],function(err){
            if (err) console.log(err);
            done();
          });
        });
    });
});
