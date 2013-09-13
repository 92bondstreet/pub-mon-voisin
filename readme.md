PUB-MON-VOISIN
=========

pub-mon-voisin is a node.js module to receive French free (paper) catalog.
This module is used by the french website <a href="http://pubmonvois.in">pubmonvois.in</a>

Keynote
-------

From one or more letterbox defined in JSON by:

* 	Title (Mr...)
*   Firstname
*   Lastname
*   Adress (number and street name)
*   Zipcode
*   Town	 (France only)

Receive free paper catalog from one or more brands. 
List of them is defined in JSON.


Installation
------------

You can install pub-mon-voisin and its dependencies with npm: 

`npm install pub-mon-voisin`.


Usage
-----

	// Recipient definition 
	var recipient = { 	
						"full_title" : "MR",
            			"title" : "2",
            			"firstname" : "Joseph",
            			"lastname" : "SOUCY",
            			"complete_address" : "64 boulevard Aristide Briand",
						"number_address" : "64",
            			"address" : "boulevard Aristide Briand",
            			"zipcode" : "76120",
            			"town" : "LE GRAND-QUEVILLY"
          			};

	var PubMonVoisin = require('PubMonVoisin');	

	var postman = new PubMonVoisin();
	postman.letterBox(recipient,function(err){
		if (err) console.log(err);
	});


Methods
-------

	PubMonVoisin.letterBox(who, [what], callback);

With 

* `who`, the recipient definition
* `what`, optional, array containing list of catalogs brand
* `callback` with error return or succes message
 
Callback receives `(error, response)`.

Catalogs list JSON object
-------------------------

You could update `catalogs.json` with your own catalogs list. For example, if you need to define list for US, UK or other coutries catalogs brand.

The module use this list to perform POST request with `needle`.

The JSON object identified by a catalog name is defined by 3 attributes:

* `url`: contains the field post-url setting the calling POST url 
* `who`: setting the bridge between the recipient attributes and the POST parameters
* `specific`: setting others POST parameters.

		{
			"name-to-define-catalog":
			{
			"url": {
				"name":"Catalog name",
				"posturl": "http://www.brand-example.com/receive.php"  
			},
			"who": {
				"email" : "email_address",
				"title": "gender",
				"firstname": "firstname",
				"lastname": "lastname",
				"completeaddress": "street_address",
				"zipcode" :"postcode",
				"town" : "city"
			},
			"specific": {
				"field_param_example_1":"",
				"field_param_example_2":"",
				"field_param_example_3":"",
				"field_param_example_n":""				
			}	
		}    
	



Recipient JSON object
---------------------

Recipient JSON object defines who has to receive catalogs.

	var who = { 	
					"full_title" : "MR",
            		"title" : "2",
            		"firstname" : "Joseph",
            		"lastname" : "SOUCY",
            		"complete_address" : "64 boulevard Aristide Briand",
					"number_address" : "64",
            		"address" : "boulevard Aristide Briand",
            		"zipcode" : "76120",
            		"town" : "LE GRAND-QUEVILLY"
          	  };

Email is build with <a href="http://www.yopmail.com">yopmail.com</a> (Disposable, Anonymous and Free email address): `firname.lastname@yopmail.com` 

So after registration, you could check yopmail maibox.


Running tests
-------------

To run the tests under node you will need `mocha` and `should` installed (it's listed as a
`devDependencies` so `npm install` from the checkout should be enough), then do

    $ npm test

Project status
--------------
pub-mon-voisin is currently maintained by Yassine Azzout.


Authors and contributors
------------------------
### Current
* [Yassine Azzout][] (Creator, Building keeper)

[Yassine Azzout]: http://www.92bondstreet.com


License
-------
[MIT license](http://www.opensource.org/licenses/Mit)
