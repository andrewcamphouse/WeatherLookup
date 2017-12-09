//url : "http://api.wunderground.com/api/7de1af5f6cc9ede8/hourly10day/q/IL/Chicago.json"
$(document).ready(function(){
	var today = new Date();
	var day = today.getDate()-1;
	var month = today.getMonth()+1;
	var year = today.getFullYear();
	var todayStr = month+'/'+day+'/'+year;
	console.log(todayStr)
	$('#datePicker').datepicker({
    format: "yyyy/mm/dd",
    endDate: new Date(todayStr),
    autoclose: true
	})
    .on('changeDate', function(e) {
        console.log("Changed date");
        $("#selectedDate").val($("#datePicker").datepicker('getFormattedDate'));
    });

    function getForecast(queryHelper, date){
		console.log("http://api.wunderground.com/api/4371aa9f5b89ae82/history_"+date+queryHelper+".json");
    	$.ajax({
		url : "http://api.wunderground.com/api/4371aa9f5b89ae82/history_"+date+queryHelper+".json",
		dataType: "jsonp",
		success : function(parsed_json){
			console.log("success");
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

			forecasts = parsed_json['history']['observations'];
			console.log(forecasts);
			$('#dataTable').html("");
			$('#dataTable').append("<tr><th>Time</th><th>Temperature</th><th>Conditions</th></tr>");
			for (forecast in forecasts){
				fMonth = forecasts[forecast]['date']['mon'];
				fDay = forecasts[forecast]['date']['mday'];
				fYear = forecasts[forecast]['date']['year'];
				time = forecasts[forecast]['date']['pretty'].substring(0, 8);//split(/[^\S+\s+.M]/);
				temp = forecasts [forecast]['tempi'];
				condition = forecasts [forecast]['conds'];
				icon = forecasts[forecast]['icon'];
				// Row is used for the graph, rowDisplay includes conditions
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
				$('#dataTable').append('<tr><td>'+time+'</td><td>'+ temp+'</td><td><img src=\"https://icons.wxug.com/i/c/i/'+icon+'.gif\" >'+condition+'</td></tr>');			
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
    $('#dateForm').submit(function() {

		console.log('test');
		$.ajax({
			url : "http://autocomplete.wunderground.com/aq?query="+$('#cityText').val()+"&c=US&cb=call=?",
			crossDomain: true,
    		dataType: 'jsonp',
			success : function(parsed_json){
				var selectedDate = $('#selectedDate').val().replace(/\//g, "")//.replace("/","");
				var results = parsed_json['RESULTS']
				var name = results[0]['name']
				var queryHelper = results[0]['l']
				console.log("Date: "+selectedDate)
				console.log("Found: "+name+". QueryHelp: "+queryHelper);
				getForecast(queryHelper, selectedDate);
				}
			})
		// Easier way to use default HTML5 form validation without actually submitting
		return false;
		})
});	

