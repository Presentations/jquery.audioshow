jquery.audioshow
================

Audioshow: Audio Slideshows with jQuery By Keith Collins

http://keithcollins.net

twitter: @collinskeith

Note: All photos and audio included in this repository are owned by the author and 
are to be used for demonstration purposes only.

WORK IN PROGRESS:

This isn't quite ready for production. See the known issues below.

INTRO:

Audioshow is a simple way to take an audio file and some photos and turn them into an audio slideshow. 

See live demo at http://www.keithcollins.net/audioshow/

USAGE:

See demo.html

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

KNOWN ISSUES:

- There's some trouble with pause/play, probably while during
transitions
- Should add introductory/before-play slide with title options
- Currently can't click thumbnail to move to that part of show
- Volume control is buggy. Perhaps is a result of using older jQuery UI
with newest jQuery release.
