jquery.audioshow
================

Audioshow: Audio Slideshows with jQuery
By Keith Collins
http://keithcollins.net
twitter: @collinskeith

Note: All photos and audio included in this repository are owned by the author and are to be used for demonstration purposes only.

INTRO:

Audioshow is a simply way to take an audio file and some photos and turn them into an audio slideshow. 

See live demo at http://www.keithcollins.net/audioshow/

USAGE:

  <div class="audioshow-container">
	  <ul class="audioshow-thumbs" id="demo">
	    <li>
	    	<a href="img/slides/street_music_10.jpg" title="">
	    		<img width="150" height="150" src="img/slides/street_music_10-150x150.jpg" class="attachment-thumbnail" alt="This is a caption. Captions are pulled in from the slide image&#039;s alt attribute." />
	    	</a>
	    </li>
	    <li>
	    	<a href="img/slides/street_music_11.jpg" title="">
	    		<img width="150" height="150" src="img/slides/street_music_11-150x150.jpg" class="attachment-thumbnail" alt="This is a caption. Captions are pulled in from the slide image&#039;s alt attribute." />
	    	</a>
	    </li>
	    <li>
    </ul>
  </div>

<script type="text/javascript">
// loud narrative player setup
  $('#demo').audioshow({
		'transition' : 'fade',
		'speed' : 2000,
		'bg_color' : '#000000',
		'border_color' : 'black',
		'border_width' : 5,
		'mp3' : 'audio/streetmusic-harmonica.mp3',
		'ogg' : 'audio/streetmusic-harmonica.ogg',
		'wav' : 'audio/streetmusic-harmonica.wav',
		'fill_space' : true
	});
</script>

OPTIONS:

'transition' means how one photo fades into the next. 
  Options: 
    'fade' means fade out one, fade in next
    'crossfade' means cross dissolve, fade one into next
    'slideLeft'
    'slideRight'
    'slideUp'
    'slidedown'

'speed' is the speed of the transition itself, in miliseconds 

'fill_space'
  Options:
    'true' will take up the entire width of the parent container
    'false' will base the width of the player on the largest photo in the set
