var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/Resources';
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var isSession = false;
var username = null;

app.use(cookieParser());
app.use(session({
  secret: 'first app',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}));
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json 
app.use(bodyParser.json())

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/isLoggedIn', function(req, res){
	if(isSession){
		res.send({status:true, username: username})
	}else{
		res.send({status:false})
	}
});

app.post('/login', function(req, res){

	var getCandidate = function(db, callback){
		var msg = {
			type: 'error',
			message : ''
		};

		if(!req.body.username.length || !req.body.password.length){
			msg.message ='Please provide correct username and password';
			callback(msg);
		}else{
			var resultFound = 0,
				candidatesList = db.collection('usersdb').find({"username":req.body.username});
			
			candidatesList.each(function(err, doc) {
				assert.equal(err, null);
				if(doc !== null && (doc.username && doc.username === req.body.username) && (doc.password && doc.password === req.body.password)) {
					resultFound = resultFound + 1;
				} else if(doc === null) {
					sendResponse(resultFound, callback);
				}
			});
		}

		var sendResponse = function(result, callback){
			if(result > 0){
				isSession = true;
				username = req.body.username;
				msg.type = 'success';
				msg.message = 'You are successfully logged in.';
				msg.username =username;
			}else{
				msg.message = 'We are not able to identify you. Please login with correct credentials.';
			}
			callback(msg);
		}
		
	}

	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		getCandidate(db, function(msg) {
			db.close();
			res.send(msg);
		});
	});

});

app.get('/logout', function(req, res){
	isSession = false;
	res.send({type:'success', message:'You are logged out successfully.'});
});

app.post('/addCandidates', function (req, res) {
	var data = {};
	for(var i in req.body){
		var isObj = i.indexOf('[');
		if(isObj !== -1){
			var parentObj = i.substring(0, isObj),
				childObj = i.substring(isObj+1, i.indexOf(']'));
			if(data[parentObj]){
				data[parentObj][childObj] = req.body[i].trim();
			}else{
				data[parentObj] = {};
				data[parentObj][childObj] = req.body[i].trim().trim();
			}
		}else{
			data[i] = req.body[i].trim();
		}
	}

	var insertDocument = function(db, callback) {
		
		db.collection('candidates').insertOne(data, function(err, result) {
			assert.equal(err, null);
			
			if(!err){
				res.send({type:'success', message:'Candidate added successfully.'});
			}
			
			callback();
		});

	};

	if(isSession){
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);

			var whetherToInsert = true;

			var candidatesList = db.collection('candidates').find();
			candidatesList.each(function(err, doc) {
				assert.equal(err, null);
				if (doc && (doc.mobile && doc.mobile === data.mobile) && (doc.email && doc.email === data.email)) {
					whetherToInsert = false;
				}
				if(doc === null){
					checkToInsert();
				}
			});

			var checkToInsert = function(){
				if(whetherToInsert){
					insertDocument(db, function() {
						db.close();
						res.end();
					});
				}else{
					res.send({type:'error', message:'Candidate already exist.'});
				}
			}
		});
	}else{
		res.send({type:'notLoggedIn', message:'Please login with valid credentials.'});
	}

});

app.get('/getAllCandidates', function(req, res){

	var candidateList = [];
	var getAllCandidatesList = function(db, callback){
		var candidatesList = db.collection('candidates').find();
		candidatesList.each(function(err, doc) {
			assert.equal(err, null);
			if (doc != null) {
				candidateList.push(doc);
			} else {
				callback();
			}
		});
	}


	if(isSession){
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			getAllCandidatesList(db, function() {
				db.close();
				res.send(candidateList);
			});
		});
	}else{
		res.send({type:'notLoggedIn', message:'Please login with valid credentials.'});
	}

});

app.get('/getCandidateDetails/:email', function(req, res){

	var candidate = [];
	var getCandidate = function(db, callback){
		var candidatesList = db.collection('candidates').find({"email":req.params.email});
		candidatesList.each(function(err, doc) {
			assert.equal(err, null);
			if (doc !== null) {
				res.send(doc);
			} else {
				callback();
			}
		});
	}
	if(isSession){
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			getCandidate(db, function() {
				db.close();
				res.end();
			});
		});
	}else{
		res.send({type:'notLoggedIn', message:'Please login with valid credentials.'});
	}

});

app.post('/updateCandidateFeedback/:email', function (req, res) {
	var nodeToUpdate = req.body.nodeToUpdate;
	var data = {};

	for(var i in req.body){
		var isObj = i.indexOf('[');
		if(isObj !== -1){
			var parentObj = i.substring(0, isObj),
				childObj = i.substring(isObj+1, i.indexOf(']'));
			if(data[parentObj]){
				data[parentObj][childObj] = req.body[i];
			}else{
				data[parentObj] = {};
				data[parentObj][childObj] = req.body[i];
			}
		}
	}

	var $set = { $set: {} };
	$set.$set[nodeToUpdate] = data.dataToUpdate;
	var updateFeedback = function(db, callback) {
		db.collection('candidates').updateOne(
			{ "email" : req.params.email },
			$set , function(err, results) {
				var msg ='';
				if(err){
					msg = {type:'error', message:'Some error occured'}
					console.log('error happend while updating feedback', err);
				}else{
					msg = {type:'success', message:nodeToUpdate.charAt(0).toUpperCase() + nodeToUpdate.slice(1) + " round's feedback updated successfully"}
				}
				callback(msg);
			}
		);
	};

	if(isSession){
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			updateFeedback(db, function(msg) {
				db.close();
				res.send(msg);
			});
		});	
	}else{
		res.send({type:'notLoggedIn', message:'Please login with valid credentials.'});
	}
});

app.post('/addRecruiter', function (req, res) {
	
	var insertRecruiter = function(db, callback) {
		
		db.collection('recruiter').insertOne({recruiterName:req.body.recruiterName}, function(err, result) {
			assert.equal(err, null);
			
			if(!err){
				res.send({type:'success', message:'Recruiter added successfully.'});
			}
			
			callback();
		});

	};

	if(isSession){
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);

			var whetherToInsert = true;

			var recruiterList = db.collection('recruiter').find({recruiterName:req.body.recruiterName});
			recruiterList.each(function(err, doc) {
				assert.equal(err, null);
				if (req.body.recruiterName.length < 1 || doc) {
					whetherToInsert = false;
				}
				if(doc === null){
					checkToInsert();
				}
			});

			var checkToInsert = function(){
				if(whetherToInsert){
					insertRecruiter(db, function() {
						db.close();
						res.end();
					});
				}else{
					res.send({type:'error', message:'Recruiter already exist.'});
				}
			}
		});
	}else{
		res.send({type:'notLoggedIn', message:'Please login with valid credentials.'});
	}

});

app.post('/searchCandidate', function (req, res) {

	var searchObj = {};
	for(var i in req.body){
		if(req.body[i].length > 0){
			searchObj[i] = new RegExp('^' + req.body[i]);
		}
	}

	var listCandidate = []
	var findCandidate = function(db, callback) {
		var cursor = db.collection('candidates').find(searchObj);
		cursor.each(function(err, doc) {
			assert.equal(err, null);
			if (doc != null) {
				listCandidate.push(doc);
			} else {
				res.send(listCandidate);
				callback();
			}
		});
	};

	if(isSession){
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			findCandidate(db, function() {
				db.close();
				res.end();
			});
		});
	}else{
		res.send({type:'notLoggedIn', message:'Please login with valid credentials.'});
	}

});

app.post('/updateCandidate/:email', function (req, res) {

	var updateFeedback = function(db, callback) {
		db.collection('candidates').update(
			{ "email" : req.params.email },
			{$set : req.body}, function(err, results) {
				var msg ='';
				if(err){
					msg = {type:'error', message:'Some error occured'}
					console.log('error happend while updating', err);
				}else{
					msg = {type:'success', message:"Records updated successfully"}
				}
				callback(msg);
			}
		);
	};

	if(isSession){
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			updateFeedback(db, function(msg) {
				db.close();
				res.send(msg);
			});
		});	
	}else{
		res.send({type:'notLoggedIn', message:'Please login with valid credentials.'});
	}
});

app.post('/schedule/:email', function(req, res){
	// create reusable transporter object using the default SMTP transport 
	var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'hiringmanagement1984@gmail.com', // Your email id
            pass: 'a@12345678' // Your password
        }
    });

    var interviewerMail = {
	    from: 'hiringmanagement1984@gmail.com', // sender address
	    to: req.body.interviewerEmail, // list of receivers
	    subject: 'Interview Request for '+req.body.intervieweeFirstName+' '+req.body.intervieweeLastName, // Subject line
	   	html: '<div style="border:1px solid #ccc; padding:0 20px 10px;">'+ 
	   		'<h2>Greeting from HiringManagement.com ✔</h2>'+
	   		'<p>There is a request made by ' +req.body.recruiterName+ ' to take an interview for '+req.body.intervieweeFirstName+' '+req.body.intervieweeLastName+'</p>'+
	   		'<p>This interview has been scheduled for '+req.body.interviewDate+
	   		'<p>Type of interview is <b>'+req.body.interviewType+'</b>'+
	   		'<p>You can <b><a href="http://localhost:8081/feedback/'+req.body.intervieweeEmail+'">visit here to provide feedback</a></b></p>.'+
	   		'</div>'
	};

	var intervieweeMail = {
	    from: 'hiringmanagement1984@gmail.com', // sender address
	    to: req.body.intervieweeEmail, // list of receivers
	    subject: 'Interview Scheduled with HiringManagement',
	   	html: '<div style="border:1px solid #ccc; padding:0 20px 10px;">'+ 
	   		'<h2>Greeting from HiringManagement.com ✔</h2>'+
	   		'<p>This is to inform you that your interview has been scheduled with HiringManagement on ' +req.body.interviewDate+ '.</p>'+
	   		'<p>Your recruiter name is '+req.body.recruiterName+' and your interview will be taken by Mr. '+req.body.interviewerName+'.</p>'+
	   		'<p>Type of interview is <b>'+req.body.interviewType+'</b>'+
	   		'<p>Best of luck!.</p>'+
	   		'</div>'
	};

	if(isSession){
		transporter.sendMail(interviewerMail, function(error, info){
		    if(error){
		        res.json({type:'error', message:'An error occured while scheduling the interview.'});
		    }else{
		        sendIntervieweeMail();
		    };
		});
	}else{
		res.send({type:'notLoggedIn', message:'Please login with valid credentials.'});
	}

	var sendIntervieweeMail = function(){
		transporter.sendMail(intervieweeMail, function(error, info){
		    if(error){
		        res.json({type:'error', message:'An error occured while scheduling the interview.'});
		    }else{
		        updateStatus();
		    };
		});
	}

	var updateScheduleInterview = function(db, callback) {
		var data = {},
			type = req.body.interviewType.toLowerCase();
			data[type] = {};
			data[type][type+'_date'] = req.body.interviewDate;
			data[type][type+'_feedback'] = 'Interview has been scheduled';
		
		var $set = { $set: data };
		db.collection('candidates').update(
			{ "email" : req.params.email },
			$set, function(err, results) {
				var msg ='';
				if(err){
					msg = {type:'error', message:'Some error occured'}
					console.log('error happend while updating', err);
				}else{
					msg = {type:'success', message:"Interview has been scheduled successfully."}
				}
				callback(msg);
			}
		);
	};

	var updateStatus = function(){
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			updateScheduleInterview(db, function(msg) {
				db.close();
				res.send(msg);
			});
		});	
	}
});


var server = app.listen(8082, function () {

  var host = server.address().address
  var port = server.address().port
  console.log("listening at http://%s:%s", host, port)

})