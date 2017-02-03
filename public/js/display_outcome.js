$(document).ready(function(){
	
	$.ajax({
			url: "/city_name_on_load",
			type: "GET",
			dataType: "json",
			data:{allcities: ""},
			contentType: "application/json",
			cache: true,
			timeout: 5000,
			complete: function() {
			  //called when complete
			  console.log('process complete');
			},
			success: function(data) {
				//show in select statement here
				var city_drop_down;
				city_drop_down += '<option value=\"all\">ALL LOCATIONS</option>';
				for(var i=0; i<data.length; i++)
				{
					var city_option = '';
					var city_name = data[i].city;
					var city_value = data[i].city;
					city_value = city_value.toString().toLowerCase();
					city_value = city_value.replace(/ /g,'');
					city_option = '<option value=\"' + city_value + '\">' + city_name + '</option>';
					city_drop_down += city_option;
					console.log(city_value);
				}			
				document.getElementById("city_name").innerHTML = city_drop_down;
			},

			error: function() {
			  console.log('process error');
			},			
	});
	
	
    $(".submit").click(function(e){
		e.preventDefault();
		console.log("Before $.ajax");
		$.ajax({
			url: "/see_outcome",
			type: "GET",
			dataType: "json",
			data:{city_name: $("#city_name").val(), duration: $("#time_period").val()},
			contentType: "application/json",
			cache: true,
			timeout: 5000,
			complete: function() {
			  //called when complete
			  console.log('process complete');
			},

			success: function(data) {
			  console.log(data);
			  console.log('process sucess');
			  
			  document.getElementById("export_button").style.display="block";
			  document.getElementById("fav_runtime").style.display="block";
			  document.getElementById("ideal_stack").style.display="block";			  
			  document.getElementById("event_needs").style.display="block";
			  document.getElementById("suggestions").style.display="block";
			  document.getElementById("new_features").style.display="block";
			  document.getElementById("future_projects").style.display="block";
			  document.getElementById("reasons_for_no").style.display="block";
			  document.getElementById("email_twitter").style.display="block";
			  document.getElementById("total_survey_candidates").style.display="block";
			  document.getElementById("total_survey_candidates").innerHTML = "<br> # of attendees who took the survey : " + Number(data['total']) + "<br><br>";
			  //var runtime_count = "Node JS:"+node_count+"<br>Ruby:"+ruby_count+"<br>Python:"+python_count+"<br>Java:"+java_count+"<br>Other:"+other_count+"<br>";
			  document.getElementById("nodejs_percent").innerHTML = Number(data['nodejs']).toFixed(2);
			  document.getElementById("python_percent").innerHTML = Number(data['python']).toFixed(2);
			  document.getElementById("ruby_percent").innerHTML = Number(data['ruby']).toFixed(2);
			  document.getElementById("java_percent").innerHTML = Number(data['java']).toFixed(2);
			  document.getElementById("other_percent").innerHTML = Number(data['other']).toFixed(2);
			  document.getElementById("not_dev_percent").innerHTML = Number(data['no_code']).toFixed(2);
			  document.getElementById("php_percent").innerHTML =
			  Number(data['php']).toFixed(2);
			  document.getElementById("go_percent").innerHTML =
			  Number(data['go']).toFixed(2);
			  document.getElementById("objc_percent").innerHTML = Number(data['objc']).toFixed(2);
			  document.getElementById("cpp_percent").innerHTML = Number(data['cpp']).toFixed(2);
			  document.getElementById("html_percent").innerHTML = Number(data['html']).toFixed(2);
			  document.getElementById("net_percent").innerHTML = Number(data['net']).toFixed(2);
			  document.getElementById("perl_percent").innerHTML = Number(data['perl']).toFixed(2);
			  document.getElementById("swift_percent").innerHTML = Number(data['swift']).toFixed(2);
			  
			  document.getElementById("rating_yes_percent").innerHTML = data['rating_yes'].toFixed(2);
			  document.getElementById("rating_no_percent").innerHTML = data['rating_no'].toFixed(2); 
			  document.getElementById("future_yes_percent").innerHTML = Number(data['future_yes']).toFixed(2);
			  document.getElementById("future_maybe_percent").innerHTML = Number(data['future_maybe']).toFixed(2);
			  document.getElementById("future_no_percent").innerHTML = Number(data['future_no']).toFixed(2);
			  
			  document.getElementById("not_dev_stack_percent").innerHTML = Number(data['not_dev']).toFixed(2);
			  document.getElementById("lamp_stack_percent").innerHTML = Number(data['lamp']).toFixed(2);
			  document.getElementById("mean_stack_percent").innerHTML = Number(data['mean']).toFixed(2);
			  document.getElementById("open_stack_percent").innerHTML = Number(data['open']).toFixed(2);
			  document.getElementById("lyme_stack_percent").innerHTML = Number(data['lyme']).toFixed(2);
			  document.getElementById("xampp_stack_percent").innerHTML = Number(data['xampp']).toFixed(2);
			  document.getElementById("wamp_stack_percent").innerHTML = Number(data['wamp']).toFixed(2);
			  document.getElementById("other_stack_percent").innerHTML = Number(data['other_stack']).toFixed(2);
			  document.getElementById("mamp_stack_percent").innerHTML = Number(data['mamp']).toFixed(2);
			  //document.getElementById("lyme_stack_percent").innerHTML = 'neer';
		  
			  /*
			  var table = "<table border=\"1\">";
			  var stacklist = data['fav_stack'];					  
			  var total_length = Number(stacklist.length);
			  console.log("length is : " + total_length);
			  for(var i=0; i<stacklist.length; i++)
				  table += "<tr><td>"+ stacklist[i].stack; + "</td></tr>";			  
			  table += "</table>";
			  console.log(table);			  
			  document.getElementById("ideal_stack").innerHTML = table;
			  */
			  
			  //Table string			  
			  
			  var event_reco_table = "<table border=\"1\">";
			  var reco_list = data['next_event_reco'];
			  var reco_list_length = Number(reco_list.length);
			  for(var j=0; j<reco_list_length; j++)
				  event_reco_table += "<tr><td>"+ reco_list[j].reco; + "</td></tr>";			  
			  event_reco_table += "</table>";
			  console.log(event_reco_table);			  
			  document.getElementById("suggestions").innerHTML = event_reco_table; 
			  
			  var new_features_table = "<table border=\"1\">";
			  var new_features_list = data['new_features'];
			  var new_features_list_length = Number(new_features_list.length);
			  for(var k=0; k<new_features_list_length; k++)
				  new_features_table += "<tr><td>"+ new_features_list[k].features + "</td></tr>";
			  new_features_table += "</table>";
			  console.log(new_features_table);
			  document.getElementById("new_features").innerHTML = new_features_table;
			  
			  var email_twitter_table = "<table border=\"1\">";
			  var email_twitter_list = data['email_twit'];
			  var email_twitter_list_length = Number(email_twitter_list.length);
			  for(var l=0; l<email_twitter_list_length; l++)
				  email_twitter_table += "<tr><td>"+ email_twitter_list[l].social + "</td></tr>";
			  email_twitter_table += "</table>";
			  console.log(email_twitter_table);
			  document.getElementById("email_twitter").innerHTML = email_twitter_table;
			  
			  
			  var reasons_for_no_table = "<table border=\"1\"> <tr><th> Reasons for choosing No </th></tr>";
			  var reasons_for_no_list = data['no_reason'];
			  var reasons_for_no_list_length = Number(reasons_for_no_list.length);
			  for(var l=0; l<reasons_for_no_list_length; l++)
				  reasons_for_no_table += "<tr><td>"+ reasons_for_no_list[l].reason + "</td></tr>";
			  reasons_for_no_table += "</table><br>";
			  console.log(reasons_for_no_table);
			  document.getElementById("reasons_for_no").innerHTML = reasons_for_no_table;
		    },

			error: function() {
			  console.log('process error');
			},
        });
		
		
		console.log("After $.ajax");
		return true;
	});
});