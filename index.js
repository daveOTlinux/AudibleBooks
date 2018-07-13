

$(document).ready(function (){
	$('#searchbox').on('keyup',function () {
		var key = $(this).val();
		if (key.length > 0)	{	
			var strSQL = 'SELECT DISTINCT `Author` ' +
				'FROM AudibleBooks ' +
				'WHERE `Author` LIKE "%' + key +
				'%" ORDER BY `Author` ASC';
	    	
		    $.ajax({
		        url:'fetch.php',
		        type:'POST',
		        data: { 'strSQL' : strSQL },
		        beforeSend:function () {
		            $("#results").slideUp('fast');
		        },
		        success:function (data) {
		            $("#results").html(data);
		            $("#results").slideDown('fast');
		        }
		    });
		} else {
			$("#results").slideUp('fast');	
		}
	});

	$('#results').on('click',function () {
		alert('You click in the RESULTS box!');
	});

});

$(document).ready(function(){
	$('[data-toggle="tooltip"]').tooltip();   
});