
function onclickDropdowns(element) {	//comes here for when an item in the dropdowns is clicked 
	var $tablebody = $('#maintablebody');	
	var liID = element.id;
	var liText = document.getElementById(liID).innerHTML;	//Current text in <li>


	alert("element click ID -- " + liID + " clicked element text -- " + liText);
	switch(element.id.slice(0,5)) {
		case 'searc':
			var searchTerm = liText;	//current utility pageObj search term
			var objName = "searchtem";	//used in success: switch
			var forObject = "searchTermRows";	//get pageObject rows have selected SearchTerm
			var sqlCommand = "";
			console.log("filterItem" + " li ID -- " + liID);
			break;
	}
	var postData = {
		"forObject":forObject,	//used in switch() to customize code and function called in pageObjects.php
		"sqlCommand":sqlCommand,	//used in creating SQL for data search
		"pageObject":searchTerm,
		"fieldname":"",
		"clickedData":liID,
		};
	var dataString = JSON.stringify(postData);	//convert dataString string to JSON
	$.ajax({
	    url:'pageObjectsCRUD.php',
	    type:'POST',
	    data: {postOBJ: dataString},
		success:function(returnData) {
			console.log("returnData onclickDropdowns -- " + returnData + " returnData length -- " + returnData.length);
			if (returnData.length <= 1) {			
				var obj = $.parseJSON(returnData);
				var myObj = JSON.parse(returnData.substring(1, returnData.length-1));
			}
			/*alert("In onclickDropdowns returnData length -- " + obj.length +
			 "\n obj.status -- " + obj.status +
			 "\n myObj.lenght -- " + myObj.length + 
			 "\n myObj.status -- " + myObj.status);*/
			//var newStr = returnData.substring(1, returnData .length-1);
			//console.log("returnData -- " + myObj.status); //this breaks code when myObj.length = 1 !!
//			if (myObj.status == 'Success') {				
				//console.log("returnData -- " + returnData);				
				//alert("Success with Ajax onclickDropdowns()) -- " + myObj.info);				
				switch(objName) {
					case "searchtem":
						$tablebody.empty();
						$.each(returnData, function(i, resultitem){
					       	var tablerowtemplate = "<tr>" +
					       			"<td>" + resultitem.ID + "</td>" +
									"<td>" + resultitem.SearchTerm + "</td>" +
									"<td>" + resultitem.orderItems + "</td>" +
									"<td>" + resultitem.itemDisplay + "</td>" +
									"<td>" + resultitem.itemSQL + "</td>" +
									"<td>" + resultitem.ModifiedDate + "</td>" +
									"<td>" +
									"<a href='read.php?ID=" + resultitem.ID + "' title='View Record' data-toggle='tooltip'>" +
										"<span class='fa fa-eye'></span></a>" +
									"<a href='update.php?ID=" + resultitem.ID + "' title='Update Record' data-toggle='tooltip'>" +
										"<span class='fa fa-pencil'></span></a>" +
									"<a href='delete.php?ID=" + resultitem.ID + "' title='Delete Record' data-toggle='tooltip'>" +
										"<span class='fa fa-trash'></span></a>" +
									"</td>" +
									"</tr>";
							//alert("table row --" + tablerowtemplate);
							$tablebody.append(tablerowtemplate);
						});
						break;
				}
//			} else {
//				alert("Failed Ajax sortfield -- " + returnData);
//			}
		},
        error: function() {
        	alert('Error on sortby or filterby item clicked.');
        }
    //console.log("Out of switch");
    });	
}

function pageObjectsList(searchTerm, forObject, elementID) {	//Get row data from pageObjects table where = searchTerm
	var postData = {
		"forObject":forObject,	//forObject used in pageObjects.php by switch case for custom code
		"sqlCommand":"",
		"pageObject":searchTerm,	//used to get row items
		"fieldname":"",
		"clickedData":"",
	};
	//alert("in pageObjectsList \n searchTerm -- " + searchTerm + "\n forObject -- " + forObject + "\n elementID -- " + elementID);
	var dataString = JSON.stringify(postData);
    $.ajax({
        url:'pageObjectsCRUD.php',
        type:'POST',
        data: {postOBJ: dataString},
        success:function(returnData) {
			console.log("returnData -- " + returnData);			
			var myOBJ = document.getElementById(elementID);
			//alert("element myOBJ.id  -- " +  myOBJ.id + " elementID -- " + elementID);
			var objIDname = "searchterm";
			switch(forObject) {
				case "searchTermDropdown":
					var objIDname = "searchTerm";
					break;

			};
			//alert("in pageObjectsList: idname -- " + objIDname);
			$('#' + myOBJ.id).empty();
			$.each(returnData, function(i, resultitem){
				$('#' + myOBJ.id).append("<li id='" + objIDname + resultitem.ID + "' class='showitem'>" + resultitem.SearchTerm + "</li>");
			});				
        },
        error: function() {
        	alert('In pageObjectsList().  Error with getting data from pageObjects.php');
        }
	});
};

$(document).ready(function (){	// dropdowns clicked.
	
	$("#searchTermDropdown").on('click',function(){	//When SortBy dropdown data <li> is clicked
		var element = event.target;
		alert("Object in sortDropdown has been clicked -- " + element.id);		
		onclickDropdowns(element)	//function changes element text and gets SQL for <li> choice
	});



	
});

$(document).ready(function(){	//Code to run when page finishes loading

	//javascript session storage
	var testSession = sessionStorage.getItem("sessionStorageInit");
	//alert("Init Document load testSession -- " + typeof testSession);
	
	if ((typeof testSession == "undefined") || (testSession == null)) {	//Check if not true. Initilize session variables
		alert("In if() statement. Initilize sessionStorage -- " + typeof testSession);
		sessionStorage.setItem("sessionStorageInit", "TRUE");

	}
	//pageObjectsList(searchTerm, forObject, $elementID)
	pageObjectsList("selfUnique", 'searchTermDropdown', 'searchTermDropdown');	//Fill in <li> values for utilities dropdown


});
