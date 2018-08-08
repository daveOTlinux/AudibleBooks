
function reorderRowsUpdate(rowID, orderItems, promise) {	//called to change the number in the orderItems field
	var sqlCommand = "SET `orderItems` = " + orderItems + ", `ModifiedDate` = NOW() ";

	var postData = {
		"forObject":"updatePageObject",	//used in switch() to customize code and function called in pageObjects.php
		"sqlCommand":sqlCommand,	//used in creating SQL for data search
		"pageObject":"",
		"fieldname":"",
		"clickedData":rowID,
		};
	var dataString = JSON.stringify(postData);	//convert dataString string to JSON
	$.ajax({
	    url:'pageObjects.php',
	    type:'POST',
	    data: {postOBJ: dataString},
		done:function(returnData) {
			$.each(returnData, function(i, resultitem){
				if (resultitem.status == 'Success') {
					//alert(" call to PHP Success!");					
				} else {
					alert("acknowledgeDeleteRow() AJAX failed \n resultitem.info -- " + resultitem.info);
				}
			});
			
			//promise.resolve();
		    //return promise;			
			
/*			// Make sure the callback is a function
			if (typeof callback === "function") {
				// Execute the callback function and pass the parameters to it
				callback();
			}	*/

		},
        fail: function() {
        	alert('Error in modalCloseUpdate() no return from PHP call.');
        }
    });
}

function fixRowArrows(count) {	//callback. Disables top row up-arrow and bottom row down-arrow
	var downArrow = "tdRowArrowDown"  + (parseInt(count) - 1).toString();
	//alert("fixRowArrows() \n callback.  count -- " + count + " \n downArrow name -- " + downArrow);
	$("#tdRowArrowUp0").removeAttr("href");	//remove blue link
	$("#tdRowArrowUp0").removeAttr("onclick");	//remove link. Won't do anything when clicked
	$("#" + downArrow).removeAttr("href");	//remove blue link
	$("#" + downArrow).removeAttr("onclick");	//remove link. Won't do anything when clicked

}

function tdRowArrowDown(element) {	//ome here when the "DOWN-Arrow" in orderItems field is clicked
	var tdItemID = element.id;	//element name of clicked Down-Arrow
	var idClickedItem = sessionStorage.getItem("sessionCurrentSearchTermDropdown");
	var displayRowNumber = tdItemID.slice(14, tdItemID.length);	//display row number (starting at 0)
	var displayRowInt = parseInt(displayRowNumber);	
	var i = 1;	
	while (i < 3){
		var rowItemID = "ID-tdPageObjRow" + displayRowInt.toString();	//id name of ID field
		var rowItemOrder = "orderItemstdPageObjRow" + displayRowInt.toString();	//id name of orderItem field
	
		var rowOrderItem = $("#" + rowItemOrder).text();	//table td orderItems field of clicked row
		switch(i) {		
			case 1:
				var rowIDItemP = $("#" + rowItemID).text();	//table td ID field of clicked row
				var orderItemsNumP = parseInt(rowOrderItem) + 1;
/*				alert("In tdRowArrowDown() \n tdItemID -- " + tdItemID +
					"\n displayRowNumber -- " + displayRowNumber +
					"\n ID-tdPageObjRow table data, rowIDItem -- " + rowIDItemP +
					"\n orderItemstdPageObjRow data, rowOrderItem --" + rowOrderItem +
					"\n orderItemsNum -- " + orderItemsNumP +
					"\n displayRowInt -- " + displayRowInt);	*/
				break;

			case 2:
				var rowIDItemM = $("#" + rowItemID).text();	//table td ID field of clicked row
				var orderItemsNumM = parseInt(rowOrderItem) - 1;
/*				alert("In tdRowArrowDown() \n tdItemID -- " + tdItemID +
					"\n displayRowNumber -- " + displayRowNumber +
					"\n ID-tdPageObjRow table data, rowIDItem -- " + rowIDItemM +
					"\n orderItemstdPageObjRow data, rowOrderItem --" + rowOrderItem +
					"\n orderItemsNum -- " + orderItemsNumM +
					"\n displayRowInt -- " + displayRowInt);	*/
				break;
		}
	i++;
	displayRowInt++;
	

	}

	//console.log("P Row data ID, Order - "+rowIDItemP + ", " +orderItemsNumP + "\n M Row data ID, Order - "+rowIDItemM + "," +orderItemsNumM);

/*	var rowPlus = $.Deferred();
	var rowMinus = $.Deferred();
	rowPlus = reorderRowsUpdate(rowIDItemP, orderItemsNumP, rowPlus);
	rowMinus = reorderRowsUpdate(rowIDItemP, orderItemsNumP, rowMinus);
	$.when(rowPlus, rowMinus).done(onclickDropdowns(idClickedItem, "", fixRowArrows));	*/

	var deferred = $.Deferred();
	deferred
		.then(reorderRowsUpdate(rowIDItemP, orderItemsNumP, ""))
		.then(reorderRowsUpdate(rowIDItemM, orderItemsNumM, ""))
		.done(onclickDropdowns(idClickedItem, "", fixRowArrows));
	deferred.resolve();
	
//	reorderRowsUpdate(rowIDItemP, orderItemsNumP, fixRowArrows);
//	reorderRowsUpdate(rowIDItemM, orderItemsNumM, fixRowArrows);

//	reorderRowsUpdate(rowIDItem, orderItemsDownNum, "")	//set the orderItem value of the row moving down
//	reorderRowsUpdate(rowIDItem, orderItemsUPNum, "")	//set the orderItem value of the row moving up

}

function tdRowArrowUp(element) {	//Come here when the "UP-Arrow" in orderItems field is clicked
	var tdItemID = element.id;	//element name of clicked UP-Arrow
	//alert("In tdRowArrowUp() \n tdItemID -- " + tdItemID);
	var idClickedItem = sessionStorage.getItem("sessionCurrentSearchTermDropdown");
	var displayRowNumber = tdItemID.slice(12, tdItemID.length);	//display row number (starting at 0)
	var displayRowInt = parseInt(displayRowNumber);	
	var i = 1;	
	while (i < 3){
		var rowItemID = "ID-tdPageObjRow" + displayRowInt.toString();	//id name of ID field
		var rowItemOrder = "orderItemstdPageObjRow" + displayRowInt.toString();	//id name of orderItem field
	
		var rowOrderItem = $("#" + rowItemOrder).text();	//table td orderItems field of clicked row
		switch(i) {		
			case 1:
				var rowIDItemM = $("#" + rowItemID).text();	//table td ID field of clicked row
				var orderItemsNumM = parseInt(rowOrderItem) - 1;
/*				alert("In tdRowArrowUp() \n tdItemID -- " + tdItemID +
					"\n displayRowNumber -- " + displayRowNumber +
					"\n ID-tdPageObjRow table data, rowIDItem -- " + rowIDItemM +
					"\n orderItemstdPageObjRow data, rowOrderItem --" + rowOrderItem +
					"\n orderItemsNum -- " + orderItemsNumM +
					"\n displayRowInt -- " + displayRowInt);	*/
				break;
			case 2:
				var rowIDItemP = $("#" + rowItemID).text();	//table td ID field of clicked row
				var orderItemsNumP = parseInt(rowOrderItem) + 1;
/*				alert("In tdRowArrowUp() \n tdItemID -- " + tdItemID +
					"\n displayRowNumber -- " + displayRowNumber +
					"\n ID-tdPageObjRow table data, rowIDItem -- " + rowIDItemP +
					"\n orderItemstdPageObjRow data, rowOrderItem -- " + rowOrderItem +
					"\n orderItemsNum -- " + orderItemsNumP +
					"\n displayRowInt -- " + displayRowInt);	*/
				break;

		}
	i++;
	displayRowInt--;
	

	}

	//console.log("P Row data ID, Order - "+rowIDItemP + ", " +orderItemsNumP + "\n M Row data ID, Order - "+rowIDItemM + "," +orderItemsNumM);

/*	var rowPlus = $.Deferred();
	var rowMinus = $.Deferred();
	rowPlus = reorderRowsUpdate(rowIDItemP, orderItemsNumP, rowPlus);
	rowMinus = reorderRowsUpdate(rowIDItemP, orderItemsNumP, rowMinus);
	$.when(rowPlus, rowMinus).done(onclickDropdowns(idClickedItem, "", fixRowArrows));	*/

	var deferred = $.Deferred();
	deferred
		.then(reorderRowsUpdate(rowIDItemM, orderItemsNumM, ""))
		.then(reorderRowsUpdate(rowIDItemP, orderItemsNumP, ""))
		.done(onclickDropdowns(idClickedItem, "", fixRowArrows));
	deferred.resolve();
	
//	reorderRowsUpdate(rowIDItemP, orderItemsNumP, fixRowArrows);
//	reorderRowsUpdate(rowIDItemM, orderItemsNumM, fixRowArrows);

//	reorderRowsUpdate(rowIDItem, orderItemsDownNum, "")	//set the orderItem value of the row moving down
//	reorderRowsUpdate(rowIDItem, orderItemsUPNum, "")	//set the orderItem value of the row moving up


}

function acknowledgeDeleteRow() {	//Open modal dialog Sure to "Delete" record
	var rowID = $('#dialogID-modal').val();
	var currentSearchTermDropDown = sessionStorage.getItem("sessionCurrentSearchTermDropdown");
	$('#dialogBoxStatus').modal('hide');
	
	//	alert("In acknowledgeDeleteRow() rowID -- " + rowID);
	var postData = {
		"forObject":"deletePageObjectbyID",	//used in switch() to customize code and function called in pageObjects.php
		"sqlCommand":"",
		"pageObject":"",
		"fieldname":"",
		"clickedData":rowID,	//ID of row to be deleted
		};
	var dataString = JSON.stringify(postData);	//convert dataString string to JSON
	$.ajax({
	    url:'pageObjects.php',
	    type:'POST',
	    data: {postOBJ: dataString},
		success:function(returnData) {
			$.each(returnData, function(i, resultitem){
				if (resultitem.status == 'Success') {
					//alert("acknowledgeDeleteRow() deletePageObjectbyID call to PHP Success!");					
					pageObjectsList("SearchTerm", 'getDISTINCTSearchTerms', 'searchTermDropdown');	//Fill in <li> values for utilities dropdown
					onclickDropdowns(currentSearchTermDropDown, "", fixRowArrows)	//redraw current rows
				} else {
					alert("acknowledgeDeleteRow() AJAX failed \n resultitem.info -- " + resultitem.info);
				}
			});
		},
        error: function() {
        	alert('Error in acknowledgeDeleteRow() no return from PHP call.');
        }
    });
}

function deleteThisRow(element) {	//Come here when the "Delete" icon in row is clicked
	var rowItemID = element.id;
	var rowRecordID = rowItemID.slice(13, rowItemID.length);
	var modalContent = $("#update-modal");
	var modalTemplate = $('#dialogBox-template').html();
/*	alert("In deleteThisRow() \n rowItemID to delete -- " + rowItemID +
		"\n database row ID - " + rowRecordID);	*/

	modalContent.empty();				
	var modalData = {
		"dialogID-modal":rowRecordID,
		"dialogTitle-modal":"Delete Record",
		"dialogBody-modal":"Delete Record ID - " + rowRecordID + " ?",
		"acceptButton-modal":"Yes",
		"cancelButton-modal":"No",
		"acceptFunction-modal":"acknowledgeDeleteRow()",
	};
	modalContent.append(Mustache.render(modalTemplate, modalData));
	$("#dialogBoxStatus").modal();	//opens modal
}

function modalCloseAppend() {	//Come here when append modal "Save" button is clicked
	//alert("IN modalCloseAppend()");

	var rowID = $('#ID-modal').val();
	var searchTermUpdate = $('#inputSearchTerm-modal').val();
	var orderItemsUpdate = $('#orderItems-modal').val();
	var itemDisplayUpdate = $('#itemDisplay-modal').val();
	var itemSQLUpdate = $('#itemSQL-modal').val();
	var currentSearchTermDropDown = sessionStorage.getItem("sessionCurrentSearchTermDropdown");

/*	alert("Update modal closed.\n currentSearchTermDropDown -- " + currentSearchTermDropDown +
		 "\nmodal searchTermUpdate -- " + searchTermUpdate);	*/

	var sqlCommand = "VALUES ('" +
		 searchTermUpdate + "','" +
		 orderItemsUpdate + "','" +
		 itemDisplayUpdate + "','" +
		 itemSQLUpdate + "',NOW())";	

	var postData = {
		"forObject":"appendPageObject",	//used in switch() to customize code and function called in pageObjects.php
		"sqlCommand":sqlCommand,	//used in creating SQL for data search
		"pageObject":"",
		"fieldname":"",
		"clickedData":"",
		};
	var dataString = JSON.stringify(postData);	//convert dataString string to JSON
	$.ajax({
	    url:'pageObjects.php',
	    type:'POST',
	    data: {postOBJ: dataString},
		success:function(returnData) {
			//console.log("returnData modalCloseUpdate() status-- " + returnData.status + " returnData length -- " + returnData.length);
			//alert("modalCloseUpdate() AJAX success \n returnData.status -- " + returnData.status);
/*			alert("Update modal closed.\n currentSearchTermDropDown -- " + currentSearchTermDropDown +
				"\nmodal searchTermUpdate -- " + searchTermUpdate);	*/
			$.each(returnData, function(i, resultitem){
				if (resultitem.status == 'Success') {
					//alert("modalCloseAppend() appendPageObject call to PHP Success! searhTermUpdate -- " + searchTermUpdate);					
					checkSearchTermChange(searchTermUpdate, doListUpdateDisplayRefresh);
				} else {
					alert("modalCloseAppend() AJAX failed \n resultitem.info -- " + resultitem.info);
				}
			});
		},
        error: function() {
        	alert('Error in modalCloseUpdate() no return from PHP call.');
        }
    });	

}

function modalOpenAppend() {	//Come here when "Add New pageObject" is clicked
	var modalContent = $("#update-modal");
	var modalTemplate = $('#itemUpdate-modal-template').html();

	//alert("IN modalOpenAppend()");

	modalContent.empty();				

		var modalData = {
			"ID":"NEW",
			"SearchTerm-modal":"",
			"orderItems-modal":"",
			"itemDisplay-modal":"",
			"itemSQL-modal":"",
			"onclick-modal":"modalCloseAppend()",
		};
		//alert("modalData ID -- " + resultitem.ID.toString());
		modalContent.append(Mustache.render(modalTemplate, modalData));

	//pageObjectsList(dbFieldName, forObject, $elementID)		
	pageObjectsList("SearchTerm", 'getDISTINCTSearchTerms', 'listSearchtermDropdown-modal');	//Fill in <li> values for dropdown

	$("#myModal").modal();	//opens modal

}

function doListUpdateDisplayRefresh(idClickedItem, searchTermUpdateText) {	//Refreshes dropdown list and table rows
	var currentSearchTermDropDown = sessionStorage.getItem("sessionCurrentSearchTermDropdown");
/*	alert("IN doListUpdateDisplayRefresh()\n idClickedItem -- " + idClickedItem +
		"\nsearchTermUpdateText -- " + searchTermUpdateText +
		"\ncurrentSearchTermDropDown -- " + currentSearchTermDropDown);	*/
										
	if (!idClickedItem == currentSearchTermDropDown) {	//check if SearchTerm has changed?
		sessionStorage.setItem("sessionCurrentSearchTermDropdown", searchTermUpdate);	//save the changed SerchTerm
		var currentSearchTermDropDown = sessionStorage.getItem("sessionCurrentSearchTermDropdown");
	}
	//pageObjectsList(searchTerm, forObject, $elementID)
	pageObjectsList("SearchTerm", 'getDISTINCTSearchTerms', 'searchTermDropdown');	//Fill in <li> values for utilities dropdown
	onclickDropdowns(idClickedItem, searchTermUpdateText, fixRowArrows)	//redraw current rows
}

function checkSearchTermChange(searchTermText, callback) {	//pass searchTerm field text 
	var idClickedItem = "";	
	var postData = {
		"forObject":"getDISTINCTSearchTerms",	//forObject used in pageObjects.php by switch case for custom code
		"sqlCommand":"",
		"pageObject":"SearchTerm",	//used to get row items
		"fieldname":"",
		"clickedData":"",
	};
	//alert("in pageObjectsList \n searchTerm -- " + searchTerm + "\n forObject -- " + forObject + "\n elementID -- " + elementID);
	var dataString = JSON.stringify(postData);
    $.ajax({
        url:'pageObjects.php',
        type:'POST',
        data: {postOBJ: dataString},
        success:function(returnData) {
			//console.log("returnData -- " + returnData);			
			//alert("element myOBJ.id  -- " +  myOBJ.id + " elementID -- " + elementID);
			$.each(returnData, function(i, resultitem){
/*				alert("AJAX return. \n resultitem.SearchTerm -- " + resultitem.SearchTerm +
					"\n resultitem.ID -- " + resultitem.ID);	*/
				if (resultitem.SearchTerm == searchTermText) {
					idClickedItem = "searchterm" + resultitem.ID;
					//alert("checkSearchTermChange \n in if() idClickedItem -- " +idClickedItem);
				}
			});
			//alert("checkSearchTermChange() return \n idClickedItem -- " + idClickedItem);

			// Make sure the callback is a function
			if (typeof callback === "function") {
				// Execute the callback function and pass the parameters to it
				callback(idClickedItem, searchTermText);
			}
    		//return idClickedItem;
        },
        error: function() {
        	alert('In pageObjectsList().  Error with getting data from pageObjects.php');
        }
	});
}

function modalCloseUpdate() {	//Come here when "Save" button on Update modal is clicked
	var idClickedItem = "";	
	var rowID = $('#ID-modal').val();
	var searchTermUpdate = $('#inputSearchTerm-modal').val();
	var orderItemsUpdate = $('#orderItems-modal').val();
	var itemDisplayUpdate = $('#itemDisplay-modal').val();
	var itemSQLUpdate = $('#itemSQL-modal').val();
	var currentSearchTermDropDown = sessionStorage.getItem("sessionCurrentSearchTermDropdown");
/*	alert("Update modal closed.\n currentSearchTermDropDown -- " + currentSearchTermDropDown +
		 "\nmodal searchTermUpdate -- " + searchTermUpdate);	*/
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
	    url:'pageObjects.php',
	    type:'POST',
	    data: {postOBJ: dataString},
		success:function(returnData) {
			$.each(returnData, function(i, resultitem){
				if (resultitem.status == 'Success') {
					checkSearchTermChange(searchTermUpdate, doListUpdateDisplayRefresh);
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
        url:'pageObjects.php',
        type:'POST',
        data: {postOBJ: dataString},
        success:function(returnData) {
			//console.log("returnData onclickDropdowns -- " + returnData + " returnData length -- " + returnData.length);

			modalContent.empty();				
			$.each(returnData, function(i, resultitem){
				var modalData = {
					"ID":resultitem.ID.toString(),
					"SearchTerm-modal":resultitem.SearchTerm,
					"orderItems-modal":resultitem.orderItems,
					"itemDisplay-modal":resultitem.itemDisplay,
					"itemSQL-modal":resultitem.itemSQL,
					"onclick-modal":"modalCloseUpdate()",
				};
				//alert("modalData ID -- " + resultitem.ID.toString());
				modalContent.append(Mustache.render(modalTemplate, modalData));
	
			});
			//pageObjectsList(dbFieldName, forObject, $elementID)		
			pageObjectsList("SearchTerm", 'getDISTINCTSearchTerms', 'listSearchtermDropdown-modal');	//Fill in <li> values for dropdown

			$("#myModal").modal();	//opens modal
		},
        error:function() {
        	alert('In pageObjectsList().  Error with getting data from pageObjects.php');
        }
	});
	

}

function onclickDropdowns(idClickedItem, textClickedItem, callback) {	//Writes table rows. when an item in the dropdowns is clicked 
	var tablebody = $('#maintablebody');
	var liID = idClickedItem;
	if (textClickedItem == "") {
		var liText = document.getElementById(idClickedItem).innerHTML;	//Current text in <li>		
	} else {
		var liText = textClickedItem;
	}
	var tableRowTemplate = $('#pageObjectRow-template').html(); 

	//alert("element click ID -- " + liID + " clicked element text -- " + liText);
	switch(idClickedItem.slice(0,5)) {
		case 'searc':
			var searchTerm = liText;	//`SearchTerm` field search value for WHERE SQL
			var objName = "searchtem";	//used in success: switch
			var forObject = "searchTermRows";	//get pageObject rows having selected searchTerm
			var sqlCommand = "*";
			//console.log("dropdown Item liID -- " + liID);
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
	    url:'pageObjects.php',
	    type:'POST',
	    data: {postOBJ: dataString},
		success:function(returnData) {
			//console.log("returnData onclickDropdowns -- " + returnData + " returnData length -- " + returnData.length);
				switch(objName) {
					case "searchtem":
						tablebody.empty();
						var count = 0;
						$.each(returnData, function(i, resultitem){
							var modalData = {
								"trPageObjRow":count,
								"ID-tdPageObjRow":resultitem.ID,
								"SearchTerm-tdPageObjRow":resultitem.SearchTerm,
								"orderItems-tdPageObjRow":resultitem.orderItems,
								"itemDisplay-tdPageObjRow":resultitem.itemDisplay,
								"itemSQL-tdPageObjRow":resultitem.itemSQL,
								"ModifiedDate-tdPageObjRow":resultitem.ModifiedDate,
							};
							tablebody.append(Mustache.render(tableRowTemplate, modalData));
							count++;
						});
						// Make sure the callback is a function
						if (typeof callback === "function") {
							// Execute the callback function and pass the parameters to it
							callback(count);
						}						
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
        url:'pageObjects.php',
        type:'POST',
        data: {postOBJ: dataString},
        success:function(returnData) {
			//console.log("returnData -- " + returnData);			
			//alert("element myOBJ.id  -- " +  myOBJ.id + " elementID -- " + elementID);
			var objIDname = "searchterm";
			//alert("in pageObjectsList: idname -- " + objIDname);
			$('#' + myOBJ.id).empty();
			$.each(returnData, function(i, resultitem){
				$('#' + myOBJ.id).append("<li id='" + objIDname + resultitem.id + "' class='showitem'>" + resultitem.SearchTerm + "</li>");
			});				
        },
        error: function() {
        	alert('In pageObjectsList().  Error with getting data from pageObjects.php');
        }
	});
};

$(document).ready(function (){	// html elements clicked.

/*	$("#listSearchtermDropdown-modal").on('click',function(){	//When dropdown data <li> is clicked
		var element = event.target;
		var idClickedItem = element.id;
		//sessionStorage.setItem("sessionCurrentSearchTermDropdown", idClickedItem)
		alert(".JS Object in listSearchtermDropdown-modal has been clicked -- " + idClickedItem);		

		//onclickDropdowns(idClickedItem)	//function changes element text and gets SQL for <li> choice
	});	*/
	
	$("#searchTermDropdown").on('click',function(){	//When SortBy dropdown data <li> is clicked
		var element = event.target;
		var idClickedItem = element.id;
		//var textClickedItem = document.getElementById(idClickedItem).innerHTML;
		sessionStorage.setItem("sessionCurrentSearchTermDropdown", idClickedItem);
/*		alert("Object in searchTermDropdown has been clicked \n " +
			"idClickedItem -- " + idClickedItem + " \n textClickedItem -- " + textClickedItem);	*/
		
		onclickDropdowns(idClickedItem, "", fixRowArrows);	//function changes element text and gets SQL for <li> choice
	});

/*	$("#maintablebody").on('click',function(){	//When "update" icon in row is clicked
		var element = event.target;
		//alert("Object in maintablebody has been clicked -- " + element.id);
	});	*/

	$("#buttonFinished").on('click',function(){	//When "update" icon in row is clicked
		var element = event.target;
		var idClickedItem = element.id;
		//alert("Button 'Finished' has been clicked -- " + idClickedItem);
		window.close();
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
	pageObjectsList("SearchTerm", 'getDISTINCTSearchTerms', 'searchTermDropdown');	//Fill in <li> values for utilities dropdown


});


