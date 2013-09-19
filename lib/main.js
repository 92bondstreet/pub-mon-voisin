(
	function()
	{
		// Load package
		var fs = require('fs');
		var needle = require('needle');
		var async = require('async');
		var random_ua = require('random-ua');

		/**
		 * Catalogue Manager definition
		 */
		var PubMonVoisin = function(){
			this.init();
		};

		PubMonVoisin.prototype = {

			/**
			* Catalog manager
			*
			* @method init 
			*/

			init: function(){
				// Load JSON catalogs definition
				this.list_catalogs = [];
				try{
					this.freecatalogs = JSON.parse(fs.readFileSync(__dirname + '/catalogs.json'));						
					for(var key in this.freecatalogs)
	    				this.list_catalogs.push(key);
				} 
				catch(e){
					this.freecatalogs = {};
				}
			},

		  /**
			* Receive paper catalogs in letterbox
			*
			* @method letterBox 
			* @param {Object} 		who				Recipient JSON Object 	 
			* @param {Array} 		[what]			Catalogs name	 
			* @param {Function} 	callback		function	 
			*/
			letterBox: function(who, what, callback)
			{	
				var hasCallback = false;

    			// 1. Exception handler
    			// 
    			if(arguments.length!==3 && arguments.length!==2 )
    				throw new Error('No valid args for letterBox(who, what, callback)');  
    			else{    				

    				// init parameters 
    				var callback = this.checkCallback(what) ? what : callback;
    				var what  = this.checkCallback(what) ? [] : what;

    				//1.1 Check paramaters one by one
    				if(!this.checkRecipient(who))
    					throw new Error('No valid args for who parameters | letterBox(who, what, callback)');  	    				
    				if(!this.checkCallback(callback))
    					throw new Error('No valid args for callback parameters | letterBox(who, what, callback)');  	
    			}

    			// 2. Success on args
    			// Recipient WHO, Catalogs name WHAT are well formated and callback is done
    			this.who = who;
    			this.what = what;
    			this.callback = callback;
    			
    			// 3. Parse catalogs
  				this.parseCatalogs();
    			
    			return true;

			},
			/**
			* Check if Recipient object is well formatted
			* who has contain all basic information
			*
			* @method 				checkRecipient
			* @param {Object} 		who				Recipient JSON Object 	 
			*/
			checkRecipient:function (who){
				if(who !== undefined){
					if(	who.hasOwnProperty('firstname') &&
						who.hasOwnProperty('lastname') &&
						who.hasOwnProperty('address') &&
						who.hasOwnProperty('number_address') &&
						who.hasOwnProperty('zipcode') &&
						who.hasOwnProperty('town') )
					{
						return true;
					}
				}
				
				return false;
			},
			/**
			* Check if Catalogs name object is well formatted
			* what is an array contains catalogs name
			*
			* @method 				checkCatalogsName
			* @param {Array} 		what				Catalogs name
			*/
			checkCatalogsName:function (what){
				if(what !== undefined){
					if(what.length>0)
						return true;
				}

				return false;
			},
			/**
			* Test callback function
			*
			* @method 				checkCallback
			* @param {Function} 	callback				function
			*/
			checkCallback:function (callback){
				
				if (callback && typeof(callback) === "function")  
					return true;
				else
					return false;	
			},
			/**
			* Build recipient with all mandatory information to get catalogs
			*
			* @method 				buildRecipient
			* @param {Object} 		who				Recipient JSON Object 
			*/
			buildRecipient:function(who){
				// clean address
				who.address = who.address.replace(/[^a-zA-Z0-9]\s/g,' ');
				who.complete_address = who.number_address + ' ' + who.address;
				who.email = who.firstname + '.' + who.lastname + '@yopmail.com';
				who.email_confirmation = who.email;
				who.birthday = bnum(1,29) + '/' + bnum(1,12) + '/' + bnum(1960,1980);				
				return who;
			},
			/**
			* Parse catalogs list to get URL catalog
			*
			* @method 				parseCatalogs
			*/
			parseCatalogs: function(){

				var noname = '';
				// 2 cases :
				// * Parse json catalogs
				// * Parse WHAT list catalog if defined
				
				
				var catalogs = [];   				
   				if(this.what.length===0){
   					// Parse all catalogs defined in json file and receive it in letterbox
   					catalogs = this.list_catalogs;
   				}
   				else{
   					// Parse Catalogs name and receive it in letterbox
   					catalogs = this.what;
   				}

   				async.map(catalogs,this.asyncPubLeVoisin.bind(this),this.asyncResults.bind(this));
			},
			/**
			* POST data to catalog url with WHO infotmation
			*
			* @method 				asyncPubLeVoisin
			* @param {String} 		catalog_name				catalog name
			* @param {Function} 	callback					function
			*/
			asyncPubLeVoisin: function(catalog_name,callback)
			{
				var catalog = {};
				if (this.freecatalogs.hasOwnProperty(catalog_name)){
					catalog = this.freecatalogs[catalog_name];
				 
					// 0. Update recipient information
					var recipient = this.buildRecipient(this.who);

					// 1. Build POST parameters
					var url = catalog['url'].posturl;
					// 1.1 Default specific param 
					var dataPost = catalog['specific'];

					// 1.2 Recipient
					var whoPost = catalog['who'];
					for (var key in whoPost)
						dataPost[whoPost[key]] = this.who[key];	    	
				
					// 2. Call POST url
					var self = this;
					needle.post(url, dataPost, {user_agent:random_ua.generate()}, function(error, response, body){  

						/*fs.writeFile("test/body.html", body, function(err) {
						    if(error)
    							console.log(error);
						    else
						        console.log("The file was saved!");
						    
						});*/	

						if(error)
	    					callback(null,error);
						else
	    					callback(null,'Got status code for ' + catalog_name + ' : ' + response.statusCode);
					});				
				}
				else
					callback(null,new Error('No URL defined to receive catalogs : ' + catalog_name));
			},
			/**
			* Merge results from different async post calling
			*
			* @method 				asyncResults
			* @param {Error} 		error
			* @param {Array} 		results	
			*/
			asyncResults:function(error,results){
				if(error){ return this.callback(error);}
				return this.callback(null,results);
			},

		};
	
		/**
		* Generates Birthday Day/Month/Year
		* There's no check for the day/month relationship,
		* so the birthday can't be 29,39,31 
		* to prevent nonsense like 31.02 (February 31th)        
		*/

		function bnum (min, max) {
    		return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		// Export PubMonVoisin manager
		module.exports = new PubMonVoisin();
	}
)();