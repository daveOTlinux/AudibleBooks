
function searchResults(thisID) {	//Called when item in Live Search box is clicked
	var $searchbox = $('#searchbox');
	var itemClicked = document.getElementById(thisID.id).innerHTML	 
	var postData = {
		"forObject":"searchbox",
		"sqlCommand":"WHERE",
		"fieldname":"Author",
		"clickedData":itemClicked,
		"pageObject":"NOT_USED"
		};
	var dataString = JSON.stringify(postData);	//convert "Author" SQL string to JSON
	$.ajax({
	    url:'pageObjects.php',
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

function pageObjectsList(searchTerm, forObject, $elementID) {	//Get row data from pageObjects table where = searchTerm
	var postData = {
		"forObject":forObject,	//forObject used in pageObjects.php by switch case for custom code
		"sqlCommand":"",
		"pageObject":searchTerm,	//used to get row items
		"fieldname":"",
		"clickedData":"",
	};
	var dataString = JSON.stringify(postData);
    $.ajax({
        url:'pageObjects.php',
        type:'POST',
        data: {postOBJ: dataString},
        success:function(returnData) {
			console.log("returnData -- " + returnData);			
			var myOBJ = document.getElementById($elementID);
			//alert("element -- " +  myOBJ.id + $elementID)
			$.each(returnData, function(i, resultitem){
				$('#' + myOBJ.id).append("<li id='sortItem" + resultitem.ID + "' class='showitem'>" + resultitem.itemDisplay + "</li>");
			});				
        },
        error: function() {
        	alert('Error with getting sortBy data.');
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

	$('.showitem').on('click',function(){	//When either SortBy or Filter By dropdown data <li> is clicked
		var liID = $(this).attr('id')
		var liText = document.getElementById(liID).innerHTML;	//Current text in <li>
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
		    url:'pageObjects.php',
		    type:'POST',
		    data: {postOBJ: dataString},
			success:function(returnData) {
				var obj = JSON.parse(returnData.substring(1, returnData .length-1));
				//var newStr = returnData.substring(1, returnData .length-1);
				//console.log("returnData -- " + obj.status);
				if (obj.status == 'Success') {				
					//console.log("returnData -- " + returnData);				
					alert("Success with Ajax sortfield -- " + location.href);				
					//$("#maintable-wrapper").load(location.href + " #maintable-wrapper");
					//location.reload();
				} else {
					alert("Failed Ajax sortfield -- " + returnData);
				}
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

	//searchResults(searchTerm, forObject, elementID)
	pageObjectsList('sortOrder00', 'sortDropdown', 'sortDropdown');	//Fill in <li> values for sortBy dropdown
	pageObjectsList('filterBy00', 'filterDropdown', 'filterDropdown');	//Fill in <li> values for sortBy dropdown

});

$(document).ready(function(){
	$('[data-toggle="tooltip"]').tooltip();   
});