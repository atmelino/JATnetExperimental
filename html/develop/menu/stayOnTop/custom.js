/*
	Allure Custom Javascript
	Author: Spacehead Concepts (http://www.spaceheadconcepts.com)
*/

jQuery.noConflict();
(function ($) {	


var menu = $('#flmenu'),
		pos = menu.offset();
		
		$(window).scroll(function(){
			if($(this).scrollTop() > pos.top+menu.height() && menu.hasClass('menudefault')){
				menu.fadeOut('fast', function(){
					$(this).removeClass('menudefault').addClass('menufixed').fadeIn('fast');
				});
			} else if($(this).scrollTop() <= pos.top && menu.hasClass('menufixed')){
				menu.fadeOut('fast', function(){
					$(this).removeClass('menufixed').addClass('menudefault').fadeIn('fast');
				});
			}
		});


$.fn.imagefit = function(width, height, mWidth, mHeight) {
	var contH = 0;
	var contW = 0;
	var imgs;
	
	width = width || 1;
	height = height || 1;
	mWidth = mWidth || 1;
	mHeight = mHeight || 1;
	
	var fit = {
		all : function(imgs){
			imgs.each(function(){
				fit.one(this);
				})
			},
		one : function(img){
			$(img).each(function()
				{
					var imgW = 0, imgH = 0;
					
					
					var initW = $(this).width(), initH = $(this).height();
					var ratio = initH / initW;
					
					imgW = contW;
					imgH = Math.round(contW * ratio);
					
					
					if(imgH < contH || ratio > 1.1){
						imgH = contH;
						imgW = Math.round(imgH / ratio);
					} 
					
					var mar_left = Math.round((contW - imgW)/2);
					var mar_top = Math.round((contH - imgH)/2);
					
					$(this).css({'margin-left' : mar_left, 'margin-top': mar_top, 'width' : imgW, 'height' : imgH});
				})
			}
	};
	
	this.each(function(){
			var container = this;
		
			if(( mWidth != 1 || mHeight != 1)  && $(window).width() <= 767) {
				contW = $(container).width() * mWidth + 1;
				contH = $(container).height() * mHeight;
			} else {
				contW = $(container).width() * width + 1;
				contH = $(container).height() * height;
			}
			
			// store list of contained images (excluding those in tables)
			imgs = $('img', container);
			// store initial dimensions on each image 
			fit.all(imgs);
		
			// Re-adjust when window width is changed
			$(window).resize(function(){
				imgs = $('img', container);
				
				if(( mWidth != 1 || mHeight != 1)  && $(window).width() <= 767) {
					contW = $(container).width() * mWidth + 1;
					contH = $(container).height() * mHeight;
				} else {
					contW = $(container).width() * width + 1;
					contH = $(container).height() * height;
				}
				
				fit.all(imgs);
			});
		});
	
	return this;
};

function hashchange () {
    var hash = window.location.hash
      , el = $('ul.tabs [href*="' + hash + '"]')
      , content = $(hash)
	   	
    if (el.length && !el.hasClass('active') && content.length) {
      el.closest('.tabs').find('.active').removeClass('active');
      el.addClass('active');
      content.fadeIn(500).addClass('active').siblings().hide().removeClass('active');
    } 
}

// listen on event and fire right away
$(window).on('hashchange.tabs', hashchange);
hashchange();
$(hashchange);
  	
$(document).ready( function($) {
	
	$(".searchform .search").focus(function()
    {
        if ($(this).val() == $(this)[0].title)
        {
            $(this).removeClass("notActive");
            $(this).val("");
        }
    });
    
    $(".searchform .search").blur(function()
    {
        if ($(this).val() == "")
        {
            $(this).addClass("notActive");
            $(this).val($(this)[0].title);
        }
    });
    
    $(".searchform .search").blur();
    
    $('.searchform').submit(function(){
    	if ($('.search',this).val() != "") {
        	return true;
      	}
      $('.search',this).blur();
      return false;
    });
    
	if(jQuery().tipsy) {
		$('.socialIconsWidget a').tipsy({ gravity: 's', fade: true});
	}
	
	$("#notification .close").click(function() {
		$("#notification").slideUp(400, "easeOutCubic");
		setCookie( 'NotificationState', 'closed' );
		$('header').addClass('remove-padding');
	});
	

    var cookieVal = getCookie( 'NotificationState' ); // get cookie value
    if( cookieVal == null || cookieVal == '' ){ // if cookie value is null
        setCookie( 'NotificationState', 'open' );
    } 
    
	function setCookie( name, value ){ // set cookie
        var date = new Date();
        date.setDate( date.getDate() + 1 );
        expDate = date.toGMTString();
        document.cookie = name + "=" + value +";expires=" + expDate + "; path=/";    
    }
 
    function getCookie( name ) { // read cookie value
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for( var i=0;i < ca.length;i++ ) {
            var c = ca[i];
            while ( c.charAt( 0 ) == ' ' ) c = c.substring( 1, c.length );
            if ( c.indexOf( nameEQ ) == 0 ) return c.substring( nameEQ.length, c.length );
        }
        return null;
    }
        
	$("#nav-main ul.sf-menu").superfish( {
		autoArrows: true,
		dropShadows: !!isMenuShadow
	}); 
	
	// This hides all the sub menus on page load
	
	$('#nav-mobile ul.sub-menu').hide();
	
	/*if($('#nav-mobile').is(':visible')) {
		// This makes sure that all the sub menus are open when applicable
		$('#nav-mobile li.current-menu-item').children().show();
		// This keeps the nav open to the item that you are navigating to.
		$('#nav-mobile li.current-menu-item').parents().show();
	
	}*/
  
 	$("#toggleMobileMenu").on("click", function(){
		$("#nav-mobile > ul").slideToggle();
		$(this).toggleClass("active");
	});
	$('#nav-mobile > ul').find('.sub-menu').each(function() {
		$(this).parent().children('a').append('<span class="submenu-icon"></span>');
	});
	$('#nav-mobile ul li a').click(
	function() {
	  var checkElement = $(this).next();
	  if((checkElement.is('ul')) && (checkElement.is(':visible'))) {
	    return false;
	    }
	  if((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
	    $(this).parent().siblings("li:has(ul)").find("ul").slideUp('normal');
	    $('#nav-mobile ul ul li ul:visible').slideUp('normal');
	    checkElement.slideDown('normal');
	    return false;
	    }
	  }
	);
	
	$('#nav-mobile ul ul li a').click(
	function() {
	  var checkElement = $(this).next();
	  if((checkElement.is('ul')) && (checkElement.is(':visible'))) {
	    return false;
	    }
	  if((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
	    $('#nav-mobile ul ul').slideUp('normal');
	    $('#nav-mobile ul ul li ul:visible').slideUp('normal');
	    checkElement.slideDown('normal');
	    return false;
	    }
	  }
	); 
 
 	
 	$(".toggleHeading").click(function(){
		var parent = $(this).parent('.toggle');
		if(parent.is(".active")){
			parent.removeClass('active');
			$(this).siblings('.toggleContent').slideUp("fast");
		}else{
			parent.addClass('active');
			$(this).siblings('.toggleContent').slideDown("fast");
		
		}
	});
	
    if(jQuery().prettyPhoto) { 
    	$("a[rel^='prettyPhoto']").prettyPhoto({
 
    	});
	  }
 	
	$("#slideshow-cycle-1 li, #slideshow-cycle-2 li, #slideshow-cycle-3 li").css({'opacity' : 0});
	
	if(typeof sliderType === 'undefined' || sliderType == 1) {
	$("#slideshow-cycle-1").preloader({loadall: true, container: "#slideshow-cycle-1", ondone: function() {  $('#slideshow-cycle-1 li').css({'opacity' : 1}).imagefit(); $('#slideshow-cycle-1').cycle({
			fx: cycleTransition,
			easing: "easeInOutQuad",
			fit: 0,
			slideResize: 0,
			containerResize: 0,
			center: 0,
			height: 430,
			width : null,
			speed: 400,
			timeout: cycleSpeed,
			cleartype:  true,
    		cleartypeNoBg:  true,
			pause: true,
			pager:  '#cycle-nav',
			prev:   '#prev', 
    		next:   '#next',
			pagerAnchorBuilder: function(idx, slide) { 
		        return '#cycle-nav li:eq(' + idx + ') a'; 
		    } 
			
	}); }});
	}
	
	

	if(typeof sliderType === 'undefined' || sliderType == 2) {
	$("#slideshow-cycle-2").preloader({loadall: true, container: "#slideshow-cycle-2", ondone: function() { 
		$('#slideshow-cycle-2 li').css({'opacity' : 1}).imagefit();
		
		$('#slideshow-cycle-2').cycle({
			fx: cycleTransition,
			easing: "easeInOutQuad",
			fit: 0,
			slideResize: 0,
			containerResize: 0,
			center: 0,
			height: 340,
			width : null,
			speed: 400,
			timeout: cycleSpeed,
			pause: true,
			before: onBefore2,
    		after: onAfter2,
			cleartype:  true,
    		cleartypeNoBg:  true,
			pager:  '#cycle-nav',
			prev:   '#prev', 
    		next:   '#next',
			pagerAnchorBuilder: function(idx, slide) { 
		        return '#cycle-nav li:eq(' + idx + ') a'; 
		    } 
			
	}); }});
	}
	
	function onBefore2(curr, next, opts, fwd) {
            // sliding text
            $(next).find('.slideHeadingText').css({'display':'none', 'top':'-500px'});
            $(next).find('.slideCaptionText').css({'display':'none', 'left':'-1000px'});            
	}
	function onAfter2(curr, next, opts, fwd) {
            // sliding text
            $(this).find('.slideHeadingText').css({'display':'block'}).delay(50).animate({'top':'0', 'opacity':1}, 250, 'easeOutQuad');
            $(this).find('.slideCaptionText').css({'display':'block'}).delay(250).animate({'left':'0', 'opacity':1}, 350, 'easeOutQuad');
	}
	
	if(typeof sliderType === 'undefined' || sliderType == 3) {
		$("#slideshow-cycle-3").preloader({loadall: true, container: "#slideshow-cycle-3", ondone: function() { 
			$('#slideshow-cycle-3 li').css({'opacity' : 1}); 
		
			$('#slideshow-cycle-3').cycle({
					fx: cycleTransition,
					easing: "easeInOutQuad",
					fit: 0,
					slideResize: 0,
					containerResize: 0,
					center: 0,
					height: 390,
					width : null,
					speed: 400,
					timeout: cycleSpeed,
					before: onBefore3,
		    		after: onAfter3,
					cleartype:  true,
		    		cleartypeNoBg:  true,
					pause: true,
					pager:  '#cycle-nav',
					prev:   '#prev', 
		    		next:   '#next',
					pagerAnchorBuilder: function(idx, slide) { 
				        return '#cycle-nav li:eq(' + idx + ') a'; 
				    } 
			}); 
		}
		});
	}
	
	function onBefore3(curr, next, opts, fwd) {
            // sliding image
            $(next).find('.slideHeadingText').css({'display':'none', 'left':'-1000px'});
            // sliding text
            $(next).find('.slideCaptionText').css({'display':'none', 'left':'-1000px'});
	}
	function onAfter3(curr, next, opts, fwd) {
            // sliding image
            $(this).find('.slideHeadingText').css({'display':'block'}).delay(50).animate({'left':'0', 'opacity':1}, 250, 'easeOutQuad');
            // sliding text
            $(this).find('.slideCaptionText').css({'display':'block'}).delay(250).animate({'left':'0', 'opacity':1}, 350, 'easeOutQuad');
	}


	$(".mediaContainer, .gallery-item").preloader({oneachload:function(image){ $(image).parents('.mediaContainer:not(:has(.placeholder), .noResize)').imagefit(); }});

if(jQuery().isotope) {  
  	var $container = $('#portfolioContainer');
  	
    $container.isotope({
		layoutMode: 'fitRows'
	});  
  	
  	// filter items when filter link is clicked
	$('#portfolioTags a').click(function(){
	  var selector = $(this).attr('data-filter');
	  $container.isotope({ filter: selector });
	  if ( !$(this).hasClass('active') ) {
        $('#portfolioTags').find('.active').removeClass('active');
        $(this).addClass('active');
      }
	  return false;
	});
	
	

}  
 
});
	


})(jQuery);