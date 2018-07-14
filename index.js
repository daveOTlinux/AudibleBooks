
function searchResults(thisID) {
	var $searchbox = $('#searchbox');
	var itemClicked = document.getElementById(thisID.id).innerHTML	 
	var postData = {
		"forObject":"searchbox",
		"sqlCommand":"WHERE",
		"fieldname":"Author",
		"clickedData":itemClicked,
		};
	var dataString = JSON.stringify(postData);
	$.ajax({
	    url:'goBetween.php',
	    type:'POST',
	    data: {postOBJ: dataString},
		success:function(clickedData) {
			document.getElementById("searchbox").placeholder = clickedData;
			var $test1 = document.getElementById("searchbox").placeholder;
			alert("Return from goBetween.php clickedData -- " + clickedData + "test1 -- " + $test1);
			console.log(document.getElementById("searchbox"));
			$("#results").slideUp('fast');
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


});

$(document).ready(function(){
	$('[data-toggle="tooltip"]').tooltip();   
});