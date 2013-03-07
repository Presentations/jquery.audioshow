/*
/*
 * jQuery Audioshow
 *
 * Simplified BSD License (@see License)
 * @author        Keith Collins
 * @copyright     (c) 2012 Keith Collins
 * @version 0.0.1
 * @requires jQuery
 */
(function( $ ){
	var defaults = {
		transition: 'none',
		speed : 2000,
		bg_color : '#444',
		border_color : '#444',
		border_width : 5,
		mp3 : '',
		ogg : '',
		wav : '',
		fill_space : true,
		slide_duration : 10000,
	};
		
	var methods = {
	    init : function( options ) { 
			// get element info
			var slides = Array(),
				$ul = this,
				$ulParent = $ul.parent(),
				outsideWidth = $ulParent.width(),
				outsideHeight = $ulParent.height()
				ulId = $ul.attr('id'),			
				anchors = $("a", $ul),
				elementCount = anchors.length;
			var elements = {
				$ul : $ul,
				$ulParent : $ulParent,
				$controlHolder : $('<div class="audioshow-control-holder" />'),
				$ulHolder : $('<div class="audioshow-ul-holder" />'),
				$uiSlider : $('<div class="ln-slider" />'),
				$slideHolder : $('<div class="audioshow-show-holder" />'),
				$slideDiv : $('<div class="audioshow-show" />'),
				$slideCaption : $('<div class="audioshow-slide-caption" />'),
				$volumeSlider : $('<div class="ln-slider-verticle" />'),
				$playButton : $('<div class="ln-play" />'),
				$volumeControl : $('<div class="ln-volume-control" />'),
				$imageHolder : $('<div class="ln-image-holder" />'),
				$audio : false
			};
						
			// pop in elements
			elements.$ul.hide();
			elements.$controlHolder.appendTo($ulParent);
			elements.$uiSlider.append(elements.$ul);
			elements.$ulHolder.appendTo(elements.$controlHolder).append(elements.$uiSlider);
			elements.$playButton.insertBefore(elements.$ulHolder);
			elements.$volumeControl.insertAfter(elements.$ulHolder);
			elements.$slideHolder.insertBefore(elements.$controlHolder)
				.append(elements.$slideDiv)
				.append(elements.$slideCaption)
				.append(elements.$volumeSlider);
			//elements.$slideDiv.append(elements.$slideCaption);
			$('img', elements.$ul).addClass('thumb');
			elements.$imageHolder.insertAfter(elements.$controlHolder);
			
			// loop through anchors
			return anchors.each(function(i){
				var $this = $(this),
					data = $this.data('audioshow'),
					audioshow = $('<div />', {
						text : $this.attr('title')
					});
				slides.push({
					thumb_url: $("img", $this).attr('src'), 
					thumb_title: $("img", $this).attr('title'), 
					slide_url: $this.attr('href'),
					slide_caption: $("img", $this).attr('alt')
				});
				
				$("img", $this).attr('id',elements.$ul.attr('id')+'_img_'+i);
				
				// when loop is finished
				if (slides.length == elementCount) {
					// merge settings, options, defaults
					var settings = $.extend(true, {}, defaults);
					if (typeof options === 'object') {
						$.extend(true, settings, options);
					};
					// namespace data into one object literal (data)
					$ul.data('audioshow', {
						target : $this,
						audioshow : audioshow,
						settings : settings,
						slides : slides,
						outsideWidth : outsideWidth,
						outsideHeight : outsideHeight,
						elementCount : elementCount,
						elements : elements,
						biggestImageH : 0,
						biggestImageW : 0,
						ulId : ulId,
						divW : 0,
						divH : 0,
						timeoutId : 0,
						currentVolume : 1.0
					});

					var bg_rgb = $ul.audioshow('_hexToRgb', settings.bg_color);

					// set user defined styles in elements
					elements.$slideCaption.css('background', 'rgba('+bg_rgb.r+','+bg_rgb.g+','+bg_rgb.b+')');
					elements.$slideCaption.css('background', 'rgba('+bg_rgb.r+','+bg_rgb.g+','+bg_rgb.b+',0.7)');
					elements.$slideCaption.css('color', '#FFF');

					
					// get going
					$ul.audioshow('_loadImages');
					
				}
			});
	    },
		
		/* load images, get dimensions of biggest */
		
		_loadImages: function() {
			var $this = this,
				data = this.data('audioshow');
						
			// load images
			$.each(data.slides, function(index) {
				$image = $('<img class="audioshow-slide" id="slide_'+index+'" src="'+this.slide_url+'" alt="'+this.slide_caption+'" />');
				data.elements.$imageHolder.append($image);
			});	
			
			// once all images are loaded, find biggest
			var i = 0;
			$('img', data.elements.$imageHolder).load(function(){
				data.biggestImageH = ($(this).height() > data.biggestImageH) ? $(this).height() 
					: data.biggestImageH;
				data.biggestImageW = ($(this).width() > data.biggestImageW) ? $(this).width()
					: data.biggestImageW;
				$(this).hide();
				i++;
				if (i == data.elementCount) {
					// finished, go to size images
					$this.audioshow('_sizeImages', $('img', data.elements.$imageHolder), true);
				}
			});

		},
		
		/* size images and find offsets */

		_sizeImages: function(images, slide) {
			var $this = this,
				data = this.data('audioshow');
			
			// if image bigger than space, space is max size, otherwise, image is max size
			var maxh = data.biggestImageH,
				maxw = (data.biggestImageW > data.outsideWidth) ? data.outsideWidth : data.biggestImageW,
				setDivW = (data.settings.fill_space) ? data.outsideWidth : maxw,
				setDivH,i=0,percentage = 1;
			

			// size images
			images.each(function(){

				image_h = $(this).height();
				image_w = $(this).width();
								
				if (image_h > maxh || image_w > maxw) {
					if (image_h >= image_w) {
						percentage = (maxh / image_h);
					}
					else {
						percentage = (maxw / image_w);
					}
				}
				// when biggest image(s) resized, get new height for div
				setDivH = (image_h == maxh) ? (image_h*percentage) : setDivH;
				// set image size
				image_h = image_h*percentage;
				image_w = image_w*percentage;
				$(this).css({height:image_h,width:image_w});
				
				i++;
				if (i == data.elementCount) {
					// finished, go to offset images
					$this.audioshow('_offsetImages', $('img', data.elements.$imageHolder), setDivW, setDivH, true);
					// set div size depending on available space and fill_space setting
					data.divW = setDivW;
					data.divH = setDivH;
					data.elements.$slideDiv.width(setDivW-(data.settings.border_width*2));
					data.elements.$slideHolder.width(setDivW-(data.settings.border_width*2));
					data.elements.$slideDiv.height(setDivH);
					data.elements.$slideHolder.height(setDivH);
				}
			});
		},
		_offsetImages: function(images, maxw, maxh, slide) {
			var $this = this;
			var data = this.data('audioshow');
			var i = 0;
			images.each(function(){
				image_h = $(this).height();
				image_w = $(this).width();
				// offset if smaller than max 
				if (image_h < maxh) {
					var setTop = (maxh - image_h) / 2;
					$(this).css('margin-top', setTop+'px');
				}
				if (image_w < maxw) {
					var setLeft = (maxw - image_w) / 2;
					$(this).css('margin-left', setLeft+'px');
				}
				i++;
				if (i == data.elementCount) {
					// finished, go to load audio
					$this.audioshow('_loadAudio');
				}

			});
		},
		_loadAudio: function() {
			var $this = this,
				data = this.data('audioshow'),
				$mp3 = (data.settings.mp3) ? $('<source src="'+data.settings.mp3+'" type="audio/mpeg"></source>') : $(''),
				$ogg = (data.settings.mp3) ? $('<source src="'+data.settings.ogg+'" type="audio/ogg"></source>') : $(''),
				$wav = (data.settings.wav) ? $('<source src="'+data.settings.wav+'" type="audio/wav"></source>') : $('');		

			// if audio files exist, create audio element
			var $audio = ($mp3 || $ogg ||$wav) ? $('<audio id="'+data.ulId+'_audio" preload="metadata" />') : false
			if ($audio) { 
				$audio.append($mp3)
					.append($ogg)
					.append($wav)
					.appendTo(data.elements.$ulParent);
					
				data.elements.$audio = $audio.get(0);
				// when audio element loads, load everything else
				$(data.elements.$audio).bind('loadedmetadata', function(){
					var audioDuration = Math.ceil(data.elements.$audio.duration) * 1000;
					data.settings.slide_duration = audioDuration/data.elementCount;
					// now that audio is loaded and slide duration is set, load show and thumbs
					//$('#slide_0').appendTo($(data.elements.$slideDiv));
					$this.audioshow('_setupDock');
				}); 
			} else {
				// load show and thumbs without audio, use default duration
				//$('#slide_0').appendTo($(data.elements.$slideDiv));
				$this.audioshow('_setupDock');
			}
		},
		_setupDock: function(maxw) {
			var $this = this,
				data = this.data('audioshow'),
				maxw = data.divW,
				$timeleft = $('#timeupdate'),
				audioElement = data.elements.$audio;
						
			// set ul width and show it
			data.elements.$ul.width(maxw-120).show();
			data.elements.$ulHolder.width(maxw-120);
			data.elements.$uiSlider.width(maxw-120);
			data.elements.$controlHolder.width(maxw);
			
			var thumbWidth = (maxw-120)/data.elementCount,
				thumbHeight;
			
			// lastImage = $('#'+data.elements.$ul.attr('id')+'_img_'+data.elementCount-1);
			
			// apply width to all thumbs and anchors
			$('a', data.elements.$ul).width(thumbWidth-3);
			$('li', data.elements.$ul).width(thumbWidth-3);
			$('img.thumb', data.elements.$ul).css('margin-right', '3px').width(thumbWidth-3);
			// lastImage.css('margin-right', '0').width(thumbWidth);
			data.elements.$ul.height(50);
			data.elements.$uiSlider.height(50).css('margin-top', 5);

			firstAnchor = $('#'+data.ulId+'_img_0');
			var offset = ($(firstAnchor).height() >= 50) ? 0 : (50-$(firstAnchor).height())/2;
			$('.thumb').css('margin-top', offset);
			console.log(offset);

			// begin ui
			data.elements.$playButton.hover(function() {
			    $(this).animate({ backgroundColor: "#000" }, 500);
			},function() {
			    $(this).animate({ backgroundColor: "#333" }, 500);
			});
			data.elements.$volumeControl.hover(function() {
			    $(this).animate({ backgroundColor: "#000" }, 500);
			},function() {
			    $(this).animate({ backgroundColor: "#333" }, 500);
			});
			
			data.elements.$playButton.on('click',function() {
				if ($(this).hasClass('ln-pause')) {
					$(this).removeClass('ln-pause');
					// pause show
					$currentSlide = $(data.elements.$slideDiv.children().get(0));
					if ($currentSlide.is(':animated')) {
						audioElement.volume=0.0;
						window.setTimeout(function() {  
							audioElement.pause();
							clearTimeout(data.timeoutId);
						}, data.settings.speed);
					} else {
						audioElement.pause();
						clearTimeout(data.timeoutId);
					}
				} else {
					$(this).addClass('ln-pause');
					$this.audioshow('_slideInterval', 'play', false);
				}
			});
			
			data.elements.$volumeControl.on('click',function() {
				data.elements.$volumeSlider.fadeIn(500);
			});
			
			$('.thumb').on('click', function(e) {
				/*
				var ulId_length = data.elements.$ul.attr('id').length,
					trim = 5 + ulId_length,
					this_index = $(this).attr('id').substr(trim),
					audioElement = data.elements.$audio;
				data.elements.$audio.currentTime(this_index*data.settings.slide_duration);
				var pos = (data.elements.$audio.currentTime / data.elements.$audio.duration) * 100;
				$('.ui-slider-handle').css('left', pos + '%');
				*/
				e.preventDefault();
				return false;
			});
			
			data.elements.$uiSlider.slider({
				start:function() {
				},
				max: maxw-120,
				step: thumbWidth-1,
				stop: function(event, ui) {
					var handlePosition = ui.value,
						percentIn = ((handlePosition/(maxw-120))*100)*.01;
					console.log(handlePosition);
					console.log(percentIn);
					audioElement.currentTime = audioElement.duration*percentIn;
				}
			});

			data.elements.$volumeSlider.slider({
				orientation: "vertical",
				range: "min",
				min: 0,
				max: 100,
				value: data.currentVolume*100,
				stop: function(event,ui) {
					data.currentVolume = ui.value*0.01;
					audioElement.volume = data.currentVolume;
					data.elements.$volumeSlider.hide();
				},
				slide: function( event, ui ) {
					//$( "#amount" ).val( ui.value );
					console.log(ui.value);
				}
			});


			data.elements.$slideHolder.mouseenter(function(){
				if (! data.elements.$slideCaption.is(':visible')) {
				 	data.elements.$slideCaption.fadeIn(500);
				}
			}).mouseleave(function(){
				if (data.elements.$slideCaption.is(':visible')) {
					data.elements.$slideCaption.hide();
				}
			});

			// this runs every second that the audio is playing
			$(audioElement).on('timeupdate', function() {
				var rem = parseInt(audioElement.duration - audioElement.currentTime, 10);
				var pos = (audioElement.currentTime / audioElement.duration) * 100;
				var mins = Math.floor(rem/60,10);
				var secs = rem - mins*60;
				var currentTimeRem = parseInt(audioElement.currentTime, 10);
				var currentTimeMins = Math.floor(currentTimeRem/60,10);
				var currentTimeSecs = currentTimeRem - currentTimeMins*60;				
				var durationRem = parseInt(audioElement.duration, 10);
				var durationMins = Math.floor(durationRem/60,10);
				var durationSecs = durationRem - durationMins*60;				
				//timecode = currentTimeMins + ':' + (currentTimeSecs > 9 ? currentTimeSecs : '0' + currentTimeSecs) + ' / ' + durationMins + ':' + (durationSecs > 9 ? durationSecs : '0' + durationSecs);
				// $timeleft.text(timecode);
				
				// this moves the handle based on the audio
				$('.ui-slider-handle').css('left', pos + '%');
			});
		},
		
		_slideInterval: function(state, next) {
			var $this = this,
				data = this.data('audioshow'),
				audioElement = data.elements.$audio,
				interval = (data.settings.transition == 'none') ? data.settings.slide_duration : data.settings.slide_duration-data.settings.speed;
			if (state == 'play') {
				if (!next) {
					if (audioElement.currentTime > 0) {
						console.log('resume');
						// resume
						audioElement.volume = data.currentVolume;
						var wherePaused = Math.ceil(audioElement.currentTime) * 1000,
							howFarIn = wherePaused%data.settings.slide_duration;
						interval = (interval > howFarIn) ? (interval-howFarIn) : interval; // ??
					} else {
						// start from beginning
						interval = 0;
					}
				}
				audioElement.play();
				console.log('current interval is '+interval);
				data.timeoutId = setTimeout(function() {
					$this.audioshow('_doTransition');
				}, interval);
			}
		},

		_doTransition: function() {
			var $this = this,
				data = this.data('audioshow');
			var transition = data.settings.transition,
				speed = data.settings.speed,
				slide_id = -1;
			
			// if there's a slide in the container, get it and its id
			if (data.elements.$slideDiv.children().length > 0) {
				$currentSlide = $(data.elements.$slideDiv.children().get(0));
				slide_id = parseFloat($currentSlide.attr('id').substr(6));
			}
			// if we're loading the first slide
			if (slide_id == -1) {
				$slide = $(''); //?
				$nextSlide = $('#slide_0');
				$nextSlide.appendTo(data.elements.$slideDiv).fadeIn(data.settings.speed);
			} 
			// if this is not the first slide
			else if (slide_id >= 0) {
				$slide = $currentSlide;
				$nextSlide = $('#slide_'+parseFloat(slide_id+1));
				$nextSlide.appendTo(data.elements.$slideDiv);
			}
			
			$slide.css('z-index', '1');
			$nextSlide.css('z-index', '2');
			
			var caption_offset = ($nextSlide.width() >= data.divW) ? 0 : (data.divW-$nextSlide.width())/2;
			data.elements.$slideCaption.width($nextSlide.width()-20).css('margin-left', caption_offset);
			
			switch (transition) {
				case 'none': 
					console.log('none');
					data.elements.$slideCaption.html($nextSlide.attr('alt'));
					$nextSlide.show();
					$slide.hide().appendTo(data.elements.$imageHolder);
					$this.audioshow('_slideInterval', 'play', true);
					break;
				case 'fade':
					if ($slide.is(':visible')) {
						$slide.fadeOut((speed/2), function() {
							data.elements.$slideCaption.html($nextSlide.attr('alt'));
							$nextSlide.fadeIn((speed/2), function() {
								$slide.hide().appendTo(data.elements.$imageHolder);
								$this.audioshow('_slideInterval', 'play', true);
							});
						});
					} else {
						data.elements.$slideCaption.html($nextSlide.attr('alt'));
						$nextSlide.fadeIn(speed, function() {
							$slide.hide().appendTo(data.elements.$imageHolder);
							$this.audioshow('_slideInterval', 'play', true);
						});
					}
					break;
				case 'crossfade':
					data.elements.$slideCaption.html($nextSlide.attr('alt'));
					$nextSlide.fadeIn(speed, function() {																							
						$slide.hide().appendTo(data.elements.$imageHolder);
						$this.audioshow('_slideInterval', 'play', true);
					});
					break;
				case 'slideLeft': 
					var left_offset = $nextSlide.outerWidth();
					this.audioshow('_slideSlide', $nextSlide, $slide, left_offset, 0);
					break;
				case 'slideRight': 
					var left_offset = (0 - $nextSlide.outerWidth());
					this.audioshow('_slideSlide', $nextSlide, $slide, left_offset, 0);
					break;
				case 'slideUp': 
					var top_offset = $nextSlide.outerHeight();
					this.audioshow('_slideSlide', $nextSlide, $slide, 0, top_offset);
					break;
				case 'slideDown': 
					var top_offset = (0 - $nextSlide.outerHeight());
					this.audioshow('_slideSlide', $nextSlide, $slide, 0, top_offset);
					break;
			}
		},

		_slideSlide: function($slide, $previousSlide, left_offset, top_offset) {
			var $this = this,
				data = this.data('audioshow');
			var transition = data.settings.transition,
				speed = data.settings.speed,
				easing = 'swing';
			$slide.css({top: top_offset, left: left_offset});
			$slide.css('display', 'block');
			
			console.log($slide.attr('alt'));
			
			$slide.animate({
				top: 0,
				left: 0
			}, speed, easing, function() {
				data.elements.$slideCaption.html($slide.attr('alt'));
				$this.audioshow('_slideInterval', 'play', true);
			});
			$previousSlide.animate({
				top: (0 - top_offset)+'px',
				left: (0 - left_offset)+'px'
			}, speed, easing, function() {
				$previousSlide.hide().appendTo(data.elements.$imageHolder);
			});
		},

		_hexToRgb: function(hex) {
		    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		    return result ? {
		        r: parseInt(result[1], 16),
		        g: parseInt(result[2], 16),
		        b: parseInt(result[3], 16)
		    } : null;
		},

	};
	$.fn.audioshow = function(method) {
		// Method calling logic
	    if ( methods[method] ) {
	    	return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else if ( typeof method === 'object' || ! method ) {
	    	return methods.init.apply( this, arguments );
	    } else {
	    	$.error( 'Method ' +  method + ' does not exist on jQuery.audioshow' );
	    }    	
    };
})( jQuery );
