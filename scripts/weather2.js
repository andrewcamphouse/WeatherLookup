//url : "http://api.wunderground.com/api/7de1af5f6cc9ede8/hourly10day/q/IL/Chicago.json"
$(document).ready(function(){

    function getForecast(state, city){
    	$.ajax({
		url : "http://api.wunderground.com/api/4371aa9f5b89ae82/hourly/q/"+state+'/'+city+".json",
		dataType: "jsonp",
		success : function(parsed_json){
			console.log("success");

			var promptString = "<p>Showing forcast for: "+city+", "+state+"</p>";
			$("#prompt").html(promptString);


			var currentdate = new Date();
			var month = currentdate.getMonth() + 1;
			var monthDay = currentdate.getDate() + 1;
			var year = currentdate.getFullYear();
			var totalTemp = 0;
			var highTemp = -200;
			var lowTemp = 200;
			var numForecasts = 0;

			var dataArray = [];
			var dArrayDisplay = [];
			var gheader = ['time', 'temperature'];
			var header = ['time', 'temperature', 'conditions'];
			dataArray.push(gheader);

			forecasts = parsed_json['hourly_forecast'];
			$('#dataTable').html("");
			$('#dataTable').append("<tr><th>Time</th><th>Temperature</th></tr>");
			for (forecast in forecasts){
				fMonth = forecasts[forecast]['FCTTIME']['mon'];
				fDay = forecasts[forecast]['FCTTIME']['mday'];
				fYear = forecasts[forecast]['FCTTIME']['year'];
				if(month == fMonth && monthDay == fDay && year == fYear){
					time = forecasts[forecast]['FCTTIME']['civil'];
					temp = forecasts [forecast]['temp']['english'];
				row = [];
				row.push(time);
				row.push(parseInt(temp));
				dataArray.push(row);

				totalTemp = totalTemp + parseInt(temp);
				numForecasts += 1;
				if(temp > highTemp){
					highTemp = temp;
				}
				if(temp < lowTemp){
					lowTemp = temp;
				}
				$('#dataTable').append('<tr><td>'+time+'</td><td>'+ temp+'</td></tr>');
				}				
				var avgTemp = totalTemp/numForecasts;
				var summaryString = '<p>Average Temperature: '+avgTemp.toFixed(2)+'</p>';
				summaryString = summaryString+'<p>High Temperature: '+highTemp+'</p>';
				summaryString = summaryString+'<p>Low Temperature: '+lowTemp+'</p>';

				$("#summary").html(summaryString);

				var data = google.visualization.arrayToDataTable(dataArray);
				var options = {
					'title' : 'Hourly Temperature',
					'legend' : {position : 'bottom'}

				};
			var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
			chart.draw(data,options);			
			}
		}
		})
    }
    $('#localForm').submit(function() {
		$.ajax({
			// Extra web service I guess:
			// This API displays IP info. Calling the base JSON page uses your IP by default.
			url : "http://ip-api.com/json",
    		dataType: 'jsonp',
			success : function(parsed_json){
				var city = parsed_json['city'].replace(' ', '_');
				var state = parsed_json['region'];
				console.log(city);
				console.log(state);
				getForecast(state, city);
				}
			})
		// Easier way to use default HTML5 form validation without actually submitting
		return false;
		})
});	

