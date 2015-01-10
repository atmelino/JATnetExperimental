// JavaScript Document
(function($){
$.fn.preloader = function(options){
	
	var defaults = {
		             delay:200,
					 preload_parent:"a",
					 container: "",
					 check_timer:300,
					 ondone:function(){ },
					 oneachload:function(image){  },
					 fadein:500,
					 loadall: false 
					};
	
	// variables declaration and precaching images and parent container
	 var options = $.extend(defaults, options),
	 root = $(this) , images = root.find("img").css({"visibility":"hidden",opacity:0}) ,  timer ,  counter = 0, i=0 , checkFlag = [] , delaySum = options.delay ,
	 
	 init = function(){
		
		timer = setInterval(function(){
			
			if(counter>=checkFlag.length)
			{
			clearInterval(timer);
			options.ondone();
			if(options.loadall == true) {
				$(images).css("visibility","visible").animate({opacity:1},options.fadein,
						function(){ 
							if(options.container != "")
								$(options.container).removeClass("preloader");
							else
							$(this).parent().removeClass("preloader");
							  
							$(this).css('opacity', '');
							
						});
			}
			return;
			}
		
			for(i=0;i<images.length;i++)
			{
				if(images[i].complete==true)
				{
					if(checkFlag[i]==false)
					{
						checkFlag[i] = true;
						options.oneachload(images[i]);
						counter++;
						
						delaySum = delaySum + options.delay;
					}
					
					if(options.loadall == false) {
						$(images[i]).css("visibility","visible").delay(delaySum).animate({opacity:1},options.fadein,
						function(){ 
							if(options.container != "")
								$(options.container).removeClass("preloader");
							else
							$(this).parent().removeClass("preloader");   
							
							$(this).css('opacity', '');
							
						});
					}
					
				}
			}
		
			},options.check_timer) 
		 
		 
		 } ;
	
	images.each(function(){
		
		if(options.container != "")
			$(options.container).addClass("preloader");
		else
		$(this).parent().addClass("preloader");
		
		checkFlag[i++] = false;
		
		
		}); 
	images = $.makeArray(images); 
	
	
	var icon = jQuery("<img />",{
		
		id : 'loadingicon' ,
		src : themeURL + '/images/preloader.gif'
		
		}).hide().appendTo("body");
	
	
	
	timer = setInterval(function(){
		
		if(icon[0].complete==true)
		{
			clearInterval(timer);
			init();
			icon.remove();
			return;
		}
		
		},100);
	
	}

})(jQuery);	
	