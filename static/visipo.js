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

window.line = 0;

$(document).ready(function() {
	outputLine(poem) 
    window.intervalId = window.setInterval(function() { 
        outputLine(poem) 
    }, 5000)
});

outputLine = function(poem) {
    if(window.line < poem.length) {
        var line = poem[window.line++];
        $.ajax({
            type: "POST",
            url: "/word",
            data: { words: line }
        }).done(function(img) {
			$('#wrapper').fadeOut('slow', function() {
				$('#text').html(line);
				$('#image').attr('src', img);
				$('#image').attr('alt', line);
				$('#wrapper').fadeIn('slow', function() {})
			})
        });

    }
    else window.clearInterval(window.intervalId);
}
