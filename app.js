var express = require('express');
var cfenv = require('cfenv');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var request = require('request');
//var request = require('request-json');
var json2csv = require('json2csv');
var fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

//Code to create add cloudant service
var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
var dbCredentials = {
	dbName : 'surveyanswers'
};
var db;
var nano;

if(process.env.VCAP_SERVICES) {
	services = JSON.parse(process.env.VCAP_SERVICES);	
	if(services.cloudantNoSQLDB) {
		dbCredentials.url = services.cloudantNoSQLDB[0].credentials.url;
	}
	console.log('VCAP Services: '+JSON.stringify(process.env.VCAP_SERVICES));
	
	host = process.env.VCAP_APP_HOST; 
	port = process.env.VCAP_APP_PORT;
	console.log("app is in bluemix");
}
nano = require('nano')("https://f69bd6d1-bf42-43db-8a1f-822f06e0e954-bluemix:0409af40c352e41c849e648f2360a1139ae966e61e940b1375dc184058147d93@f69bd6d1-bf42-43db-8a1f-822f06e0e954-bluemix.cloudant.com");
db = nano.use("surveyanswers");
var city_to_generate_csv;
var appEnv = cfenv.getAppEnv();


app.get('/city_name_on_load', function(req, res){
	
	var password = '0409af40c352e41c849e648f2360a1139ae966e61e940b1375dc184058147d93';
	var username = 'f69bd6d1-bf42-43db-8a1f-822f06e0e954-bluemix';	
	var url="https://"+username+":"+password+"@f69bd6d1-bf42-43db-8a1f-822f06e0e954-bluemix.cloudant.com/city_actions/_design/city_actions/_view/city_actions";
	
	request({
			 url: url,
			 json: true
			}, function (error, response, body) {	
		if (!error && response.statusCode === 200)
		{
			//Check if current input is present in the table, else add. If present then return with error message
			var user_data = body.rows;
			var city_present = 0; //false
			var list_of_cities = '[';
			var city_name_array = [];
			
			for(var i=0; i< user_data.length; i++)
				city_name_array.push(user_data[i].value);
			city_name_array.sort();			
			for(var i=0; i<city_name_array.length; i++)
			{
				var city_JSON = '{\"city\":\"' + city_name_array[i] + '\"}';
				if(i == 0)
					list_of_cities = list_of_cities.concat(city_JSON);
				else
				{
					list_of_cities = list_of_cities.concat(",");
					list_of_cities = list_of_cities.concat(city_JSON);
				}
			}

			console.log("List of cities : " + city_name_array);
			list_of_cities = list_of_cities.concat("]");
			console.log(list_of_cities);
			res.contentType('application/json');
			res.send(JSON.parse(list_of_cities));
		}
		else
		{
			console.log("No data from URL");
			console.log("Response is : " + response.statusCode);
			var name_string="{\"added\":\"DB read error\"}";
			res.contentType('application/json');
			res.send(JSON.parse(name_string));
		}
	});	
});


app.get('/see_outcome', function(req,res)
{
	console.log("City chosen :" + req.query.city_name+":");
	city_to_generate_csv = req.query.city_name;
	var ruby=0, node=0, java=0, other=0, python=0, php=0, go=0, objc = 0, cpp = 0, html = 0, net = 0, perl = 0, not_dev = 0, swift = 0;
	var stack_not_dev = 0, stack_lamp = 0, stack_mean = 0, stack_open = 0, stack_lyme = 0, stack_xampp = 0, stack_mamp = 0, stack_wamp = 0, stack_other = 0;
	var rating_yes = 0, rating_no = 0;
	var future_yes = 0, future_no = 0, future_maybe = 0;
	var total = 0;

	var fav_stack = '\"fav_stack\":[' + '{\"stack\":\"'+" "+'\"}';
	var next_event_recommendations = '\"next_event_reco\" : [' + '{\"reco\":\"'+" "+'\"}';
	var new_features = '\"new_features\" : [' + '{\"features\":\"'+ " " +'\"}'; 
	var email_twit = '\"email_twit\" : [' + '{\"social\":\"'+" "+'\"}';
	var reasons_for_no = '\"no_reason\" : [' + '{\"reason\":\"'+" "+'\"}';
	var string;
	
	var password = '0409af40c352e41c849e648f2360a1139ae966e61e940b1375dc184058147d93';
	var username = 'f69bd6d1-bf42-43db-8a1f-822f06e0e954-bluemix';	
	var url="https://"+username+":"+password+"@f69bd6d1-bf42-43db-8a1f-822f06e0e954-bluemix.cloudant.com/surveyanswers/_design/answers/_view/answers";	
	request({
		url: url,
		json: true
		}, function (error, response, body) {
		if (!error && response.statusCode === 200)
		{
			var user_data = body.rows;
			for(var i=0; i<user_data.length; i++)
			{
				var doc = user_data[i];
				var runtime = doc.value[4];
				var stack = doc.value[5];
				var next_event_reco_string = ',{\"reco\":\"'+doc.value[3]+'\"}';
				var features = ',{\"features\":\"'+doc.value[6]+'\"}';
				
				if(city_to_generate_csv === "all")
				{
					if(runtime === "ruby")
						ruby++;
					else if(runtime === "node js")
						node++;
					else if(runtime === "java")
						java++;
					else if(runtime === "other_runtime")
						other++;
					else if(runtime === "python")
						python++;
					else if(runtime === "php")
						php++;
					else if(runtime === "go")
						go++;
					else if(runtime === "objc")
						objc++;
					else if(runtime === "cpp")
						cpp++;
					else if(runtime === "html")
						html++;
					else if(runtime === "net")
						net++;
					else if(runtime === "perl")
						perl++;
					else if(runtime === "no_code")
						not_dev++;
					else if(runtime === "swift")
						swift++;
					total++;
					
					if(stack === "not_dev")
						stack_not_dev++;
					else if(stack === "lamp")
						stack_lamp++;
					else if(stack === "mean")
						stack_mean++;
					else if(stack === "open_stack")
						stack_open++;
					else if(stack === "lyme")
						stack_lyme++;
					else if(stack === "xampp")
						stack_xampp++;
					else if(stack === "mamp")
						stack_mamp++;
					else if(stack === "wamp")
						stack_wamp++;
					else if(stack === "other_stack")
						stack_other++;
					
					if(doc.value[1] === "yes")
						rating_yes++;
					else if(doc.value[1] === "no")
						rating_no++;
					
					if(doc.value[7] === "yes")
						future_yes++;
					else if(doc.value[7] == "maybe")
						future_maybe++;
					else if(doc.value[7] === "no")
						future_no++;
					
					if(doc.value[3].toUpperCase().trim() !== ("NA") && doc.value[3].toUpperCase().trim() !== ("N/A"))
						next_event_recommendations = next_event_recommendations.concat(next_event_reco_string);
					if(doc.value[6].toUpperCase().trim() !== ("NA") && doc.value[6].toUpperCase().trim() !== ("N/A"))
						new_features = new_features.concat(features);
					if(doc.value[8].length != 0)
					{
						var social = ',{\"social\":\"'+doc.value[8]+'\"}';
						email_twit = email_twit.concat(social);
					}
					if(doc.value[9] != null)
					{
						if(doc.value[9].length != 0)
						{
							var reason = ',{\"reason\":\"'+doc.value[9]+'\"}';
							reasons_for_no = reasons_for_no.concat(reason);
						}
					}						
				}
				else if(city_to_generate_csv === doc.key) //equal to 1 of the city
				{
					if(runtime === "ruby")
						ruby++;
					else if(runtime === "node js")
						node++;
					else if(runtime === "java")
						java++;
					else if(runtime === "other_runtime")
						other++;
					else if(runtime === "python")
						python++;
					else if(runtime === "php")
						php++;
					else if(runtime === "go")
						go++;
					else if(runtime === "objc")
						objc++;
					else if(runtime === "cpp")
						cpp++;
					else if(runtime === "html")
						html++;
					else if(runtime === "net")
						net++;
					else if(runtime === "perl")
						perl++;
					else if(runtime === "no_code")
						not_dev++;
					else if(runtime === "swift")
						swift++;
					total++;
					
					if(stack === "not_dev")
						stack_not_dev++;
					else if(stack === "lamp")
						stack_lamp++;
					else if(stack === "mean")
						stack_mean++;
					else if(stack === "open_stack")
						stack_open++;
					else if(stack === "lyme")
						stack_lyme++;
					else if(stack === "xampp")
						stack_xampp++;
					else if(stack === "mamp")
						stack_mamp++;
					else if(stack === "wamp")
						stack_wamp++;
					else if(stack === "other_stack")
						stack_other++;
					
					if(doc.value[1] === "yes")
						rating_yes++;
					else if(doc.value[1] === "no")
						rating_no++;
					
					if(doc.value[7] === "yes")
						future_yes++;
					else if(doc.value[7] == "maybe")
						future_maybe++;
					else if(doc.value[7] === "no")
						future_no++;
					
					if(doc.value[3].toUpperCase().trim() !== ("NA") && doc.value[3].toUpperCase().trim() !== ("N/A"))
						next_event_recommendations = next_event_recommendations.concat(next_event_reco_string);
					if(doc.value[6].toUpperCase().trim() !== ("NA") && doc.value[6].toUpperCase().trim() !== ("N/A"))
						new_features = new_features.concat(features);
					if(doc.value[8].length != 0)
					{
						var social = ',{\"social\":\"'+doc.value[8]+'\"}';
						email_twit = email_twit.concat(social);
					}
					if(doc.value[9] != null)
					{
						if(doc.value[9].length != 0)
						{
							var reason = ',{\"reason\":\"'+doc.value[9]+'\"}';
							reasons_for_no = reasons_for_no.concat(reason);
						}
					}
				}
			}
			
			fav_stack = fav_stack.concat(']');
			next_event_recommendations = next_event_recommendations.concat(']');	
			new_features = new_features.concat(']');
			email_twit = email_twit.concat(']');
			reasons_for_no = reasons_for_no.concat(']');
				
			if(total != 0)
			{
				console.log("total : " + total);
				rating_yes = (rating_yes/total)*100;
				console.log("Rating No before % : " + rating_no);
				rating_no = 100 - rating_yes;
				console.log("Rating No : " + rating_no);
					
				future_yes = (future_yes/total)*100;
				future_no = (future_no/total)*100;
				future_maybe = (future_maybe/total)*100;
				
				ruby = (ruby/total)*100;
				python = (python/total)*100;
				java = (java/total)*100;
				other = (other/total)*100;
				node = (node/total)*100;	
				php = (php/total)*100;
				perl = (perl/total)*100;
				go = (go/total)*100;
				objc = (objc/total)*100;
				cpp = (cpp/total)*100;
				html = (html/total)*100;
				net = (net/total)*100;
				not_dev = (not_dev/total)*100;
				
				stack_lamp = (stack_lamp/total)*100;
				stack_lyme = (stack_lyme/total)*100;
				stack_mamp = (stack_mamp/total)*100;
				stack_mean = (stack_mean/total)*100;
				stack_not_dev = (stack_not_dev/total)*100;
				stack_open = (stack_open/total)*100;
				stack_other = (stack_other/total)*100;
				stack_wamp = (stack_wamp/total)*100;
				stack_xampp = (stack_xampp/total)*100;
			}
			string = '{\"ruby\":'+ ruby + ',\"php\":'+php+',\"perl\":'+perl+',\"go\":'+go+ ',\"objc\":' + objc + ',\"cpp\" : ' + cpp + ',\"html\" : ' + html + ',\"net\" : ' + net + ',\"no_code\":'+not_dev +',\"java\" : ' + java + ', \"nodejs\" : ' + node + ', \"other\" : '+ other + ',\"swift\":'+ swift +', \"python\" : '+python+', \"total\" : ' + total + ',\"lamp\":'+ stack_lamp+ ',\"lyme\":'+stack_lyme+',\"mamp\":'+stack_mamp+',\"mean\":'+stack_mean+',\"not_dev\":'+stack_not_dev+',\"open\":'+stack_open+',\"other_stack\":'+stack_other+',\"wamp\":'+stack_wamp+',\"xampp\":'+stack_xampp + ', \"rating_yes\" : ' + rating_yes + ', \"rating_no\" : ' + rating_no + ',' + next_event_recommendations + ',' + new_features + ',\"future_yes\" : ' + future_yes + ',\"future_maybe\" : '+ future_maybe + ',\"future_no\" : '+future_no+ ',' + reasons_for_no + ',' + email_twit + '}';

			console.log("Sent string to front end");
			var obj = JSON.parse(string);
			res.contentType('application/json');
			res.send(obj);
		  }
		else
		{
		   console.log("No data from URL");
		   console.log("Response is : " + response.statusCode);
		}
	});
});


app.get('/download_csv', function(req, res){
	var json_string_for_csv_conversion = new Array();
	
	console.log("Downloading file");	
	console.log("After conversion");
	var password = '0409af40c352e41c849e648f2360a1139ae966e61e940b1375dc184058147d93';
	var username = 'f69bd6d1-bf42-43db-8a1f-822f06e0e954-bluemix';	
	var url="https://"+username+":"+password+"@f69bd6d1-bf42-43db-8a1f-822f06e0e954-bluemix.cloudant.com/surveyanswers/_design/answers/_view/answers";	
	  request({
		 url: url,
		 json: true
		}, 
		function (error, response, body) {
			if (!error && response.statusCode === 200)
			{	
			    console.log("Status is : " + response.statusCode);
				var user_data = body.rows;
				//for(var i=0; i< user_data.length; i++)
				for(var i=0; i< user_data.length; i++)
				{
					var doc = user_data[i];
					var city_csv_line = new Array();
					city_csv_line["city_name"] = doc.key;
					city_csv_line["event_date"] = doc.value[0];
					city_csv_line["event_need"] = doc.value[1];
					city_csv_line["facilitator_rating"] = doc.value[2];
					city_csv_line["recommendations"] = doc.value[3];
					city_csv_line["runtime"] = doc.value[4];
					city_csv_line["stack"] = doc.value[5];
					city_csv_line["newfeatures"] = doc.value[6];
					city_csv_line["use_bluemix"] = doc.value[7];
					city_csv_line["reason_for_no"] = doc.value[9];
					city_csv_line["email_twitter"] = doc.value[8];	
					city_csv_line["other_runtime_entry"] = doc.value[10];
					city_csv_line["other_stack_entry"] = doc.value[11];
					
					if(city_to_generate_csv === "all")
						json_string_for_csv_conversion.push(city_csv_line);
					else if(city_to_generate_csv === doc.key)
						json_string_for_csv_conversion.push(city_csv_line);
				}

				var download_filename = "survey_outcome_" + city_to_generate_csv + ".csv";
				
				var fields = ['city_name', 'event_date', 'event_need','facilitator_rating','recommendations','runtime','other_runtime_entry','stack','other_stack_entry','newfeatures','use_bluemix','reason_for_no','email_twitter'];

				json2csv({data: json_string_for_csv_conversion, fields: fields }, function(err, csv) {
				if (err) console.log(err);
				fs.writeFile(download_filename, csv, function(err) {
					if (err) throw err;
					console.log('file saved');
					console.log(csv);
					
					fs.readdir(__dirname, function (err, files) {
						if (err)
							throw err;
						for (var index in files) {
							if(files[index] === download_filename)
								console.log(download_filename + " is present");
						}
					});					 
					var fileName = __dirname + '\/' + download_filename;
					res.download(fileName);
					
					});
				});
			}
			else
			{
				console.log("No data from URL");
				console.log("Response is : " + response.statusCode);
			}
		});
});

app.listen(appEnv.port, function() {
  console.log("server starting on " + appEnv.url);
  
});