var poem = [
"It was so fine we lingered there for hours.",
"The long broad streets shone strongly after rain.",
"Sunset blinded the tremble of the crane",
"we watched from, dazed the heliport-towers.",
"The mile-high buildings flashed, flushed, greyed, went dark,",
"greyed, flushed, flashed, chameleons under flak",
"of cloud and sun. The last far thunder-sack",
"ripped and spilled its grumble. Ziggurat-stark,",
"a power-house reflected in the lead",
"of the old twilight river leapt alive",
"lit up at every window, and a boat",
"of students rowed past, slid from black to red",
"into the blaze. But where will they arrive",
"with all, boat, city, earth, like them, afloat?"]

window.line = 0
window.imgs = []

var ajaxQueue = $({});
$.ajaxQueue = function(ajaxOpts) {
	var oldComplete = ajaxOpts.complete;
	ajaxQueue.queue(function(next) {
	  ajaxOpts.complete = function() {
		if (oldComplete) oldComplete.apply(this, arguments);
		next(); 
	  };
	  $.ajax(ajaxOpts);
	});
};

$(document).ready(function() {
	var theQueue = $({}); 
	$.each(poem, function() {
		outputLine(poem) 
	})

	/*
    window.intervalId = window.setInterval(function() { 
        outputLine(poem) 
    }, 2500)
	*/

	$('#full-poem-button').toggle(
		function() { $('#full').show() },
		function() { $('#full').hide() }
	);
});

outputLine = function(poem) {
    if(window.line < poem.length) {
        var line = poem[window.line++];
        $.ajaxQueue({
            type: 'POST',
			dataType: 'json',
            url: "/word",
            data: { words: line },
        	success: function(data) {
				console.log(window.line)
				console.log(data)
				window.imgs.push(data.url)
				$('#wrapper').fadeOut('slow', function() {
					$('full').hide();
					$('#text').html(line);
					$('#full').append(line+"<br/>");
					$('#image').attr('src', data.url);
					$('#image').attr('alt', line);
					$('#wrapper').fadeIn('slow', function() {})
				})
			}
		})
    }
    else {
		window.clearInterval(window.intervalId);
			$('#wrapper').fadeOut('slow', function() {
				rows = Math.ceil(window.imgs.length/3)
				tbl = "<tbl>"
				for(var i=0; i < window.imgs; i++) {
					tbl += "<td><img src='"+window.imgs[i]+"' width='100px'/></td>"
					if(0 == i % rows) {
						tbl += "</tr><tr>"
					}
				}
				tbl = "</tbl>"
				$('#wrapper').empty()
				$(tbl).appendTo('#wrapper')
				$('#wrapper').fadeIn('slow', function() {})

			})
	}
}
