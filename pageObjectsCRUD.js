
function modalCloseUpdate() {
	var rowID = $('#ID-modal').val();
	var searchTermUpdate = $('#SearchTerm-modal').val();
	var orderItemsUpdate = $('#orderItems-modal').val();
	var itemDisplayUpdate = $('#itemDisplay-modal').val();
	var itemSQLUpdate = $('#itemSQL-modal').val();
	var currentSearchTermDropDown = sessionStorage.getItem("sessionCurrentSearchTermDropdown")
	alert("Update modal closed. currentSearchTermDropDown -- " + currentSearchTermDropDown);

	var sqlCommand = "SET `SearchTerm` = '" + searchTermUpdate +
		"', `orderItems` = '" + orderItemsUpdate +
		"', `itemDisplay` = '" + itemDisplayUpdate +
		"', `itemSQL` = '" + itemSQLUpdate +
		"', `ModifiedDate` = NOW() ";
		
	var postData = {
		"forObject":"updatePageObject",	//used in switch() to customize code and function called in pageObjects.php
		"sqlCommand":sqlCommand,	//used in creating SQL for data search
		"pageObject":"",
		"fieldname":"",
		"clickedData":rowID,
		};
	var dataString = JSON.stringify(postData);	//convert dataString string to JSON
	$.ajax({
	    url:'pageObjectsCRUD.php',
	    type:'POST',
	    data: {postOBJ: dataString},
		success:function(returnData) {
			//console.log("returnData modalCloseUpdate() status-- " + returnData.status + " returnData length -- " + returnData.length);
			//alert("modalCloseUpdate() AJAX success \n returnData.status -- " + returnData.status);
			$.each(returnData, function(i, resultitem){
				if (resultitem.status == 'Success') {
					onclickDropdowns(currentSearchTermDropDown)	//redraw current rows
				} else {
					alert("modalCloseUpdate() AJAX failed \n resultitem.info -- " + resultitem.info);
				}				
			});
		},
        error: function() {
        	alert('Error in modalCloseUpdate() no return from PHP call.');
        }
    });	
	
}

function modalOpenUpdate(element) {	//come here if any update buttons clicked in table rows
	var tdItemID = element.id;
	var modalContent = $("#update-modal");
	var modalTemplate = $('#itemUpdate-modal-template').html(); 
	//var liText = document.getElementById(liID).innerHTML;	//Current text in <li>
	//alert("element click ID -- " + tdItemID + "Element -- " + element);

	//var cllickedItem = element;
	var postData = {
		"forObject":"pageObjectRow",	//forObject used in pageObjects.php by switch case for custom code
		"sqlCommand":"",	//SQL to get ID row data
		"pageObject":"",	//used to get row items
		"fieldname":"",
		"clickedData":tdItemID,	//clicked item. The number part is removed and passed as ID of row
	};
	//alert("in pageObjectsList \n searchTerm -- " + searchTerm + "\n forObject -- " + forObject + "\n elementID -- " + elementID);
	var dataString = JSON.stringify(postData);
    $.ajax({
        url:'pageObjectsCRUD.php',
        type:'POST',
        data: {postOBJ: dataString},
        success:function(returnData) {
			//console.log("returnData onclickDropdowns -- " + returnData + " returnData length -- " + returnData.length);
/*			if (returnData.length <= 1) {			
				//var obj = $.parseJSON(returnData);
				var myObj = JSON.parse(returnData.substring(1, returnData.length-1));
			}	*/
			modalContent.empty();				
			$.each(returnData, function(i, resultitem){
				var modalData = {
					"ID":resultitem.ID.toString(),
					"SearchTerm-modal":resultitem.SearchTerm,
					"orderItems-modal":resultitem.orderItems,
					"itemDisplay-modal":resultitem.itemDisplay,
					"itemSQL-modal":resultitem.itemSQL,
				};
				alert("modalData ID -- " + resultitem.ID.toString());
				modalContent.append(Mustache.render(modalTemplate, modalData));
	
			});
			$("#myModal").modal();	//opens modal
		},
        error:function() {
        	alert('In pageObjectsList().  Error with getting data from pageObjects.php');
        }
	});
	

}

function onclickDropdowns(idClickedItem) {	//comes here for when an item in the dropdowns is clicked 
	var tablebody = $('#maintablebody');
	var liID = idClickedItem;
	var liText = document.getElementById(idClickedItem).innerHTML;	//Current text in <li>
	var tableRowTemplate = $('#pageObjectRow-template').html(); 

	//alert("element click ID -- " + liID + " clicked element text -- " + liText);
	switch(idClickedItem.slice(0,5)) {
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
			//console.log("returnData onclickDropdowns -- " + returnData + " returnData length -- " + returnData.length);
				switch(objName) {
					case "searchtem":
						tablebody.empty();
						$.each(returnData, function(i, resultitem){
							//alert("table row --" + tablerowtemplate);
							tablebody.append(Mustache.render(tableRowTemplate, resultitem));
						});
						break;
				}
		},
        error: function() {
        	alert('Error on sortby or filterby item clicked.');
        }
    });	
}

function pageObjectsList(searchTerm, forObject, elementID) {	//Get row data from pageObjects table where = searchTerm
	var myOBJ = document.getElementById(elementID);
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
			//alert("element myOBJ.id  -- " +  myOBJ.id + " elementID -- " + elementID);
			var objIDname = "searchterm";
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

$(document).ready(function (){	// html elements clicked.
	
	$("#searchTermDropdown").on('click',function(){	//When SortBy dropdown data <li> is clicked
		var element = event.target;
		var idClickedItem = element.id;
		sessionStorage.setItem("sessionCurrentSearchTermDropdown", idClickedItem)
		//alert("Object in sortDropdown has been clicked -- " + idClickedItem);		
		onclickDropdowns(idClickedItem)	//function changes element text and gets SQL for <li> choice
	});

	$("#maintablebody").on('click',function(){	//When "update" icon in row is clicked
		var element = event.target;
		//alert("Object in maintablebody has been clicked -- " + element.id);
	});

	
});

$(document).ready(function(){	//Code to run when page finishes loading

	//javascript session storage
	var testSession = sessionStorage.getItem("sessionStorageInit");
	//alert("Init Document load testSession -- " + typeof testSession);
	
	if ((typeof testSession == "undefined") || (testSession == null)) {	//Check if not true. Initilize session variables
		alert("In if() statement. Initilize sessionStorage -- " + typeof testSession);
		sessionStorage.setItem("sessionStorageInit", "TRUE");
		sessionStorage.setItem("currentSearchTermDropDown", "");

	}
	//pageObjectsList(searchTerm, forObject, $elementID)
	pageObjectsList("selfUnique", 'searchTermDropdown', 'searchTermDropdown');	//Fill in <li> values for utilities dropdown


});


