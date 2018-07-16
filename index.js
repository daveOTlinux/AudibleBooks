
function searchResults(thisID) {	//Called when item in Live Search box is clicked
	var $searchbox = $('#searchbox');
	var itemClicked = document.getElementById(thisID.id).innerHTML	 
	var postData = {
		"forObject":"searchbox",
		"sqlCommand":"WHERE",
		"fieldname":"Author",
		"clickedData":itemClicked,
		};
	var dataString = JSON.stringify(postData);	//convert "Author" SQL string to JSON
	$.ajax({
	    url:'goBetween.php',
	    type:'POST',
	    data: {postOBJ: dataString},
		success:function(clickedData) {
			$("#results").slideUp('fast');
			location.reload();
		},
        error: function() {
        	alert('Error on search item clicked.');
        }		
	});
}	


$(document).ready(function (){
	var $resultlist = $('#resultlist');
		
	$('#searchbox').on('keyup',function () {
		var key = $(this).val();
		var searchKEY = '%' + key + '%';
		var postData = {
			"field1":"Author",
		 	"select":"SELECT DISTINCT `Author` ",
			"from":"FROM AudibleBooks " ,
			"where":"WHERE `Author` LIKE " ,
			"order":" ORDER BY `Author` ASC" ,
			"searchkey":searchKEY
		};
		var dataString = JSON.stringify(postData);

		if (key.length > 0)	{	    	
		    $.ajax({
		        url:'fetch.php',
		        type:'POST',
		        data: {postOBJ: dataString},
		        beforeSend:function () {
		            $("#results").slideUp('fast');
		        },
		        success:function(results) {
		            $.each(results, function(i, resultitem){
		            	$resultlist.append('<li onclick="searchResults(this)" + id=item' + resultitem.id +' class="showitem">' + resultitem.author + '</li>');
					});		            
		            $('#results').slideDown('fast');
		        },
		        error: function() {
		        	alert('Error with Live Search.');
		        }
		    });
		} else {
			$('#results').slideUp('fast');	
		}
	});

	$('.showitem').on('click',function(){
		var liID = $(this).attr('id')
		var liText = document.getElementById(liID).innerHTML;
		switch(liID.slice(0,5)) {
			case 'sortI':
				document.getElementById('sortby').innerHTML = 'Sort by ' + liText;
				var searchTerm = "sortOrder00"
				console.log("sortItem text -- " + liText + " li ID -- " + liID);
				break;
			case 'filte':
				document.getElementById('filterby').innerHTML = 'Filter by ' + liText;
				//console.log("filterItem" + " li ID -- " + liID);
				break;
		}
		var postData = {
			"forObject":"sortfield",
			"sqlCommand":"ORDER",
			"pageObject":searchTerm,
			"fieldname":liText,
			"clickedData":liID,
			};
		var dataString = JSON.stringify(postData);	//convert dataString string to JSON
		$.ajax({
		    url:'goBetween.php',
		    type:'POST',
		    data: {postOBJ: dataString},
			success:function(returnData) {
				//console.log("returnData -- " + returnData);				
				//alert("Success with Ajax sortfield -- " + returnData)				
				//location.reload();
			},
	        error: function() {
	        	alert('Error on sortby or filterby item clicked.');
	        }
	    //console.log("Out of switch");
	    });
	});



});

$(document).ready(function(){
	//Code to run when page finishes loading
	
	//alert("Document has finished loading.");
});

$(document).ready(function(){
	$('[data-toggle="tooltip"]').tooltip();   
});