$(document).ready(function(){
	
	var appFocus = false;




	//expanding/minimixing function for quads

	$(".expand").click(function()	{


	var thisBox = $(this).closest('section');
		
		//variable - is the map full screen or not?  ****************************** To Do : resize MAP only if user expands MAP quadrant **************
		appFocus = !appFocus;

		if (appFocus)	{

			//chance sign to minimize
			$(this).html("-");

			//fadeout dial
			$("article>div").fadeOut(200);

			//fade all boxes except this one
			$("article>section").not(thisBox).css('z-index', 0 ).animate({
				opacity: 0
	  		}, 300, function() {
	    		// Animation complete.
	    		$(this).css('display', 'none');

	 		});
			
			//make this box full screen
			thisBox.css('z-index', 0 ).animate({
				height: 820,
	    		width: "100%",
	    		opacity: 1
	    		
	  		}, 400, function() {
	    		// Animation complete.
	    		thisBox.css('z-index', 0 );

	 		});



	 		/////////// MAP FUNCTION  /////////////////

			//make the map full screen
	 		$(".fundedMap").animate({
				height: 820,
				marginTop: "-50px",
				marginLeft: "50px" 
	    		
	  		}, 400);

		}
		else	{

			// Maximize me!
			$(this).html("+");

			//fade in that dial again
			$("article>div").not('.dialExpanded').fadeIn(600);

			//don't forget to fade in the other boxes!
			$("article>section").not(thisBox).css('display', 'block').css('z-index', 0 ).animate({
				opacity: 1
	  		}, 600, function() {
	    		// Animation complete.
	 		});
			
			//resize this box!
			thisBox.css('z-index', 0 ).animate({
	    		width: "575px",
				height: "395px",
				opacity: 1
	  		}, 300, function() {
	    		// Animation complete.

	 		});


			/////////// MAP FUNCTION  /////////////////

			//make the map not full screen


	 		$(".fundedMap").animate({
				height: 130,
	    		marginTop: "0px",
	    		marginLeft: "0px"
	  		}, 300);

		}

	});



	//Map Hover State - color the pieces just for fun

	$("path").hover(function()	{
		$(this).css('fill', "#000");
		
	}, function()	{
		$(this).css('fill', "orange");
	});


	//move the map on mouseover? sure why not!
	$(".fundedMap").hover(function()	{
		//hovered! now test for mouse movement

		$(this).mousemove(function(e){
			//mouse movement detected!
		  var pageCoords = "( " + e.pageX + ", " + e.pageY + " )";
		  var clientCoords = "( " + e.clientX + ", " + e.clientY + " )";

			$(".fundedMap").scrollTop( ( e.pageY - $(".fundedMap").offset().top ) * 2 - 40 );

			$(".fundedMap").scrollLeft( ( e.pageX - $(".fundedMap").offset().left )  - 20 );
		});
	}, function()	{
		//mouse movement has ended. please return to your seats in an orderly fashion.
	})





	//Expand dial on click
	$('.dialCenter').each(function(){
		$(this).bind('click', function(){
			$('.dialExpanded').toggle(400, function(){ });
		});
	});
	$('.dialSVG').each(function(){
		$(this).bind('click', function(){
			$('.dialExpanded').toggle(400, function(){ });
		});
	});

	//Create dial displays
	$(".dialSelector").knob({
		'min':0,
		'max':14,
		'displayInput':false,
		'fgColor':'#ffbe57',
		'bgColor':'#fff',
		'width':106,
		'thickness':1,
		'readOnly':true
	});
	// $(".dialExpandedSelector").knob({
	// 	'min':0,
	// 	'max':14,
	// 	'displayInput':false,
	// 	'fgColor':'#ffbe57',
	// 	'bgColor':'transparent',
	// 	'width':156,
	// 	'thickness':1,
	// 	'change': function(v){
	// 		$('.dialSelector').val(v).trigger('change');
	// 		$('.yearTwo').text(1999+v);
	// 	}
	// });

	Draw();

});

Draw = function(){
	var n = 14; //number of years on dial
	var sectors = [];
	var sectors2 = [];
	var rotateAmount = [];
	var dial = Raphael($('#dialDraw').get(0));
	var sliceRotate = (360/n);

	//calculate rotation amounts
	for (var i=0; i<n; i++){
		rotateAmount[i] = (i * 360/n) - (360/n)/2 ;
	}

	//create slices
	dial.setStart();
	for (var i=0; i<n; i++){
		var start = (i * (360/n)) - (360/n)/2;
		var end = (i+1) * (360/n) - (360/n)/2;
		sectors[n] = dial.sector(85,85,77,end,start).attr({"fill": "transparent", "stroke": "#ebebeb"});
		sectors[n].data("value", i);
	}
	var slices = dial.setFinish();

	//create filled slices
	dial.setStart();
	for (var i=0; i<n; i++){
		var start = (i * (360/n)) - (360/n)/2;
		var end = (i+1) * (360/n) - (360/n)/2;
		sectors2[n] = dial.sector(85,85,77,end,start).attr({"fill": "#ffbe57", "stroke": "#ebebeb"});
		sectors2[n].data("value", i);
	}
	var filledslices = dial.setFinish();

	//create set of the 2 handles
	dial.setStart();
	var handle1 = dial.rect(133, 83, 32, 6,1).data("value", 0);
	var handle2 = dial.rect(133, 83, 32, 6,1).data("value", 1);
	var handles = dial.setFinish();
	handle1.attr({"fill": "#f1f1f1", "stroke": "#b3b3b3"});
	handle2.attr({"fill": "#ff9205", "stroke": "#c98b20"});


	handle1.transform('...R' + rotateAmount[0] + " 85 85");
	handle2.transform('...R' + rotateAmount[0] + " 85 85");
	handle1.data("value", 0);
	handle2.data("value", n);

	//click within slice
	slices.forEach(function(slice){
		slice.click(function(e){
			Update(e,this);
		});
	});
	filledslices.forEach(function(slice){
		slice.click(function(e){
			Update(e,this);
		});
	});









	Update = function(e,slice) {
		//get click location
		posx = e.pageX - $(document).scrollLeft() - $('#dialDraw').offset().left;
		posy = e.pageY - $('#dialDraw').offset().top;

		var sliceNum = slice.data().value;
		var startNum = handle1.data().value;
		var endNum = handle2.data().value;

		// Case 1
		if (sliceNum == startNum){
			handle2.data("value", sliceNum);
			handle2.attr("transform","");
			if (sliceNum+1 >= rotateAmount.length) {
				handle2.transform('...r' + rotateAmount[0] + " 85 85");
			} 
			handle2.transform('...r' + rotateAmount[sliceNum+1] + " 85 85");
	 		$('.yearTwo').text(2000+sliceNum);
		}
		// Case 2
		else if (sliceNum == endNum){
			handle1.data("value", sliceNum);
			handle1.attr("transform","");
			handle1.transform('...r' + rotateAmount[sliceNum] + " 85 85");
	 		$('.yearOne').text(2000+sliceNum);
		}
		// Case 3
		else if (sliceNum > endNum){
			handle2.data("value", sliceNum);
			handle2.attr("transform","");
			if (sliceNum+1 >= rotateAmount.length) {
				handle2.transform('...r' + rotateAmount[0] + " 85 85");
			}
			handle2.transform('...r' + rotateAmount[sliceNum+1] + " 85 85");
	 		$('.yearTwo').text(2000+sliceNum);
		}
		// Case 4
		else if (sliceNum < startNum){
			handle1.data("value", sliceNum);
			handle1.attr("transform","");
			handle1.transform('...r' + rotateAmount[sliceNum] + " 85 85");
	 		$('.yearOne').text(2000+sliceNum);
		}
		// Case 5a
		else if ((endNum - sliceNum) == (sliceNum - endNum)){
			handle1.data("value", sliceNum);
			handle1.attr("transform","");
			handle1.transform('...r' + rotateAmount[sliceNum] + " 85 85");
	 		$('.yearOne').text(2000+sliceNum);
		}
		// Case 5b
		else if ((endNum - sliceNum) > (sliceNum - startNum)){
			handle1.data("value", sliceNum);
			handle1.attr("transform","");
			handle1.transform('...r' + rotateAmount[sliceNum] + " 85 85");
	 		$('.yearOne').text(2000+sliceNum);
		}
		// Case 5c
		else {
			handle2.data("value", sliceNum);
			handle2.attr("transform","");
			handle2.transform('...r' + rotateAmount[sliceNum+1] + " 85 85");
	 		$('.yearTwo').text(2000+sliceNum);
		}

		//display filled slice if between start and finish
		filledslices.forEach(function(e){
			if ((e.data().value >= handle1.data().value) && (e.data().value <= handle2.data().value)){
				e.show();
			}
			else {
				e.hide();
			}
		});
	};

};



function getCircletoPath(x , y, r) { // x and y are center and r is the radius 
	var s = "M";
	s = s + "" + (x) + "," + (y-r) + "A"+r+","+r+",0,1,1,"+(x-0.1)+","+(y-r)+"z";
	return s;
}

Raphael.fn.sector = function(cx, cy, r, startAngle, endAngle) {
	var dial = this;
	var rad = Math.PI / 180;
    var x1 = cx + r * Math.cos(startAngle * rad),
        x2 = cx + r * Math.cos(endAngle * rad),
        y1 = cy + r * Math.sin(startAngle * rad),
        y2 = cy + r * Math.sin(endAngle * rad);
    return dial.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(startAngle - endAngle > 180), 0, x2, y2, "z"]);
};





