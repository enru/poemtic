window.lines = 0
window.imgs = []

output = function(line) {
		window.lines++
        $.ajaxQueue({
            type: 'POST',
			dataType: 'json',
            url: "/word",
            data: { words: line },
        	complete: function() {
				$('#wrapper').fadeOut('slow', function() {
					$('.load-wrap').hide();
					$('#image-text').show();
				}).fadeIn('fast', function() {})
			},
			error: function() {
				error_img = 'http://farm5.staticflickr.com/4129/5073166764_1611bf7323.jpg';
				window.imgs.push(error_img)
				$('#text').html(line);
				$('#image').attr('src', error_img);
				$('#image').attr('alt', 'not found');
				$('#image-credits').html('n/a')
			},
			success: function(data) {
				var newLine = line.replace(data.word, '<span class="theword">'+data.word+'</span>');
				$('#text').html(newLine);
				$('.poem .line').each(function() { 
					$(this).removeClass('active')
					if($(this).html() == line) {
						$(this).html(newLine) 
						$(this).addClass('active')
					}
				})
				if(data.url) {
					window.imgs.push(data.url)
					$('#image').attr('src', data.url);
					$('#image').attr('alt', line);
					$('#image-credits').html(
						'<p>&copy;&nbsp;'
						+'<a href="'
						+data.user.url
						+'">'
						+data.user.real
						+' ('
						+data.user.name
						+') '
						+'</a>'
						+'</p>'
					)
				}
				else {
					this.error();
				}
			}
		})
}

theEnd = function() {
	$('.poem .line').removeClass('active');
	$(this).removeClass('active')
	$('#image-text').fadeOut('slow', function() {
		tbl = "<ul class='imgs'>"
		for(var i=0; i < window.imgs.length; i++) {
			tbl += "<li><img src='"+window.imgs[i].replace(/\.jpg$/, '_s.jpg')+"' /></li>"
		}
		tbl += "</ul>"
		$('#image-text').empty().html(tbl)
		$('#full').show()
	}).fadeIn('fast', function() {})
}

$(document).ready(function() {
	$('.poem .line').each(function() { 
		output($(this).html()) 
	})
	intervalId = window.setInterval(function() {
		if(window.imgs.length == window.lines) {
			window.clearInterval(intervalId)
			window.setTimeout(theEnd, 5000)
		}
	}, 5000)
	$('#full-poem-button').toggle(
		function() { $('#full').show(); },
		function() { $('#full').hide() }
	);
});

