var sequence = [],
	level = 3;

function generate_grid(){
	$("#canvas").html("");
	for(i=1;i<=4;i++){
		$("#canvas").append("<div id='"+i+"' class='tile'>x</div>");
	}
}

function generate_sequence(){
	sequence = [];
	for(i=1;i<=level;i++){
		var random = Math.round(Math.random()*3) +1;
		sequence.push(random);
	}
}

function play_sequence(){
	$(sequence).each(function (e){
		var timeoutID = window.setTimeout(function(){
			$("#"+sequence[e]).css("backgroundColor","red");
			console.log(sequence[e]);
			}, (e+1)*1000);
		var timeoutID2 = window.setTimeout(function(){
			$("#"+sequence[e]).css("backgroundColor","black");

		}, (e+1)*1000+500+((e+1)*100));
	});
}

function listen_sequence(current){
	$("#canvas div.tile").click(function(){
		if( $(this).attr("id") == sequence[current] ){
			console.log('bravo');
			$("#canvas div.tile").unbind("click");
			current+=1;
			if( current < level ){
				listen_sequence(current);

			} else {
				alert("bravo");
				level +=1;
				generate_grid();
				 generate_sequence();
				play_sequence();
				listen_sequence(0);
			}
		} else {
			$("#canvas div.tile").unbind("click");
			console.log("error : expected:"+sequence[current]);
			alert("error : expected:"+sequence[current]);
			generate_grid();
			generate_sequence();
			play_sequence();
			listen_sequence(0);
		}
	});
}

$(function() {
	generate_grid();
	generate_sequence();
	console.log(sequence);
	play_sequence();
	listen_sequence(0);
});
