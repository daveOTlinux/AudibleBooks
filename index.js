


function makeTitleSpace() {
	var dataMustache = {
		"titleText":"Audible Books",
		"titleNewButton":"Add New Audible Book"
	};
	fillTemplateSpace("titleSpace", "audibleTitleTemplate", dataMustache)
}

function makeHeaderSpace() {
	var dataMustache = {
		"sortbyText":sessionStorage.getItem("sortBysearchSelected"),
		"filterbyText":sessionStorage.getItem("filterBysearchSelected"),
	};
	fillTemplateSpace("headerSpace", "audibleHeaderTemplate", dataMustache)
}

function makeBodySpace() {
	fillTemplateSpace("bodySpace", "tableHeaderTemplate", "")	
}

function makeFooterSpace() {
	var dataMustache = {
		"utilitiesText":"Utilities "
	};
	fillTemplateSpace("footerSpace", "audibleFooterTemplate", dataMustache)
}

function fillTemplateSpace(templateDivName, templateName, mustacheData) {
	var $templateDivSpace = $("#" + templateDivName);
	var templateHTML = $("#" + templateName).html();
	//alert("In fillTemplateSpace() ")
	$templateDivSpace.empty();
	$templateDivSpace.append(Mustache.render(templateHTML, mustacheData));
}

function closeModifyAudible() {
	makeTitleSpace();
	makeHeaderSpace();
	makeBodySpace();
	makeFooterSpace();

	var sortBysearchTerm = sessionStorage.getItem("sortBysearchTerm");	//current sortBy pageObj search term
	var filterBysearchTerm = sessionStorage.getItem("filterBysearchTerm");	//current filterBy pageObj search term
	var utilitySearchTerm = sessionStorage.getItem("utilitySearchTerm");	//current utility pageObj search term
	var liText = sessionStorage.getItem("filterBysearchSelected");
	//alert ("In closeModifyAudible(). \nliText -- " + liText);
	if (liText == "Nothing") {
		setStateSearchBox("disabled", liText)
	} else {
		setStateSearchBox("enabled", liText)		
	}
	
	//pageObjectsList(searchTerm, forObject, $elementID) function values to pass
	pageObjectsList(sortBysearchTerm, 'Dropdowns', 'sortDropdown');	//Fill in <li> values for sortBy dropdown
	pageObjectsList(filterBysearchTerm, 'Dropdowns', 'filterDropdown');	//Fill in <li> values for sortBy dropdown
	pageObjectsList(utilitySearchTerm, 'Dropdowns', 'utilitiesDropdown');	//Fill in <li> values for utilities dropdown

	fetchTableResults()
}

function saveModifyAudible(mode) {
	var currentID = $("#buttonAudibleTitle").attr('data-id');
	//alert("In saveModifyAudible(). currentID -- " + currentID);
	var inputTitle = $('#input-Title').val();
	var inputAuthor = $('#input-Author').val();
	var inputSeries = $('#input-Series').val();
	var inputBookNumber = $('#input-SeriesBook').val();
	var inputReadOrder = $('#input-ReadOrder').val();
	var inputReadOrderNumber = $('#input-ReadOrderNumber').val();
	var inputCategories = $('#input-Categories').val();
	var inputListenedTo = $('#input-ListenedTo').val();
	if(inputListenedTo == 'NO') {
		var inputListenedToValue = 0;
	} else {
		var inputListenedToValue = 1;
	}
	var inputStatus = $('#input-Status').val();
	var inputLength = $('#input-Length').val();
	var inputMyRating = $('#input-MyRating').val();
	var inputDateAdded = $('#input-DateAdded').val();
	var inputCoverArt = $('#input-CoverArt').val();
	var pathCoverArt = "CoverArt/" + inputCoverArt.slice(12,inputCoverArt.length)
	var inputNotes = $('#input-Notes').val();

	alert("In saveModifyAudible(). mode -- " + mode +
		"\n Title -- " + inputTitle +
		"\n Author -- " + inputAuthor +
		"\n Series -- " + inputSeries +
		"\n CoverArt -- " + pathCoverArt +
		"\n inputListenedTo -- " + inputListenedToValue +
		"\n Status -- " + inputStatus +
		"\n Categories -- " + inputCategories);
	switch(mode) {
		case "update":
			var sqlCommand = "SET `Title` = '" + inputTitle +
				"', `Author` = '" + inputAuthor +
				"', `Series` = '" + inputSeries +
				"', `BookNumber` = '" + inputBookNumber +
				"', `ReadOrderNumber` = '" + inputReadOrderNumber +
				"', `ReadOrder` = '" + inputReadOrder +
				"', `Length` = '" + inputLength +
				"', `Categories` = '" + inputCategories +
				"', `Status` = '" + inputStatus +
				"', `ListenedTo` = '" + inputListenedToValue +
				"', `DateAdded` = '" + inputDateAdded +
				"', `MyRating` = '" + inputMyRating +
				"', `Notes` = '" + inputNotes +
				"', `ModifiedDate` = NOW() ";
			if(!(pathCoverArt == "CoverArt/")) {
				sqlCommand + "`CoverArt` = '" + pathCoverArt + "' "
			}			
			var postData = {
				"functionCall":"updateTableByID",
				"fieldName":sqlCommand,
				"searchkey":currentID,		//ID of row to edit
			};
			break;
		case "insert":
			if(!(pathCoverArt == "CoverArt/")) {
				inputPathCoverArt = pathCoverArt;
			} else {
				inputPathCoverArt = "";
			}
			var sqlCommand = "(`ID`, `Title`, `Author`, `Series`, `BookNumber`, `ReadOrderNumber`, " +
				"`ReadOrder`, `Length`, `Categories`, `Status`, `ListenedTo`, `DateAdded`, " +
				"`MyRating`, `CoverArt`, `Notes`, `ModifiedDate`) " +
				"VALUES (NULL, " +
				"'" + inputTitle + "', " +
				"'" + inputAuthor + "', " +
				"'" + inputSeries + "', " +
				"'" + inputBookNumber + "', " +
				"'" + inputReadOrderNumber + "', " +
				"'" + inputReadOrder + "', " +
				"'" + inputLength + "', " +
				"'" + inputCategories + "', " +
				"'" + inputStatus + "', " +
				"'" + inputListenedToValue + "', " +
				"'" + inputDateAdded + "', " +
				"'" + inputMyRating + "', " +
				"'" + inputPathCoverArt + "', " +
				"'" + inputNotes + "', NOW())";
				var postData = {
					"functionCall":"insertNewRowTable",
					"fieldName":sqlCommand,
					"searchkey":"",		//ID of row to edit
				};
				break;
	} 

	var dataString = JSON.stringify(postData);	//convert dataString string to JSON
	$.ajax({
        url:'AudibleBooks.php',
        type:'POST',
        data: {postOBJ: dataString},
        success:function(returnData) {
			$.each(returnData, function(i, resultitem){
				if (resultitem.status == 'Success') {
					//alert("Return from AJAX updateTableByID php call. Success!");
					closeModifyAudible();
					//checkSearchTermChange(searchTermUpdate, doListUpdateDisplayRefresh);
				} else {
					alert("Return from AJAX updateTableByID php call. Failed! \n resultitem.info -- " + resultitem.info);
				}
			});
		},
        error: function() {
        	alert('Error in modalCloseUpdate() no return from PHP call.');
        }
    });	
}

function addNewAudibleBook() {
	var $tablebody = $('#bodySpace');
	var $templateHTML = $('#modifyAudibleBodyTemplate').html();
	$tablebody.empty();
	var dataMustache = {
		"modifyAudible-Title":"",
		"modifyAudible-Author":"",
		"modifyAudible-Series":"",
		"modifyAudible-modSeries":"",
		"modifyAudible-modBook":0,
		"modifyAudible-BookNumber":0,
		"modifyAudible-ReadOrderNumber":0,
		"modifyAudible-ReadOrder":"",
		"modifyAudible-Length":"",
		"modifyAudible-Categories":"",
		"modifyAudible-Status":"",
		"modifyAudible-ListenedTo":"NO",
		"modifyAudible-DateAdded":"",
		"modifyAudible-MyRating":0,
		"modifyAudible-CoverArt":"",
		"modifyAudible-Notes":"",
		"modifyAudible-ModifiedDate":"",					
	};
	$tablebody.append(Mustache.render($templateHTML, dataMustache));
	var mustacheData = {
		"modifyAudible-h2":"Add New Book",
		"modifyAudible-ID":"",
	};
	fillTemplateSpace("titleSpace", "modifyAudibleTitleTemplate", mustacheData);
	fillTemplateSpace("headerSpace", "modifyAudibleHeaderTemplate", "");
	var mustacheData = {
		"saveModifyFunction":"saveModifyAudible('insert')",
	};
	fillTemplateSpace("footerSpace", "modifyAudibleFooter", mustacheData);
	pageObjectsList("Status", "Dropdowns", "listStatusDropdown");
	pageObjectsList("ListenedTo", "Dropdowns", "listListenedToDropdown");
	pageObjectsList("Categories", "Dropdowns", "listCategoriesDropdown");
	$("#buttonAudibleTitle").prop('hidden', true);
	$("#span-Title").prop('hidden', true);
	$("#input-Title").prop('type', 'text');
	$("#span-Author").prop('hidden', true);
	$("#input-Author").prop('type', 'text');
	$("#span-Series").prop('hidden', true);
	$("#input-Series").prop('type', 'text');
	$("#span-SeriesBook").prop('hidden', false);
	$("#input-SeriesBook").prop('type', 'text');
	$("#span-ReadOrder").prop('hidden', true);
	$("#input-ReadOrder").prop('type', 'text');
	$("#span-ReadOrderNumber").prop('hidden', false);
	$("#input-ReadOrderNumber").prop('type', 'text');
	$("#span-Categories").prop('hidden', true);
	$("#input-Categories").prop('type', 'text');
	$("#span-ListenedTo").prop('hidden', true);
	$("#input-ListenedTo").prop('type', 'text');
	$("#span-Status").prop('hidden', true);
	$("#input-Status").prop('type', 'text');
	$("#span-Length").prop('hidden', true);
	$("#input-Length").prop('type', 'text');
	$("#span-MyRating").prop('hidden', true);
	$("#input-MyRating").prop('type', 'text');
	$("#span-DateAdded").prop('hidden', true);
	$("#input-DateAdded").prop('type', 'text');
	$("#span-Timestamp").prop('hidden', true);
	$("#strongSpan-Timestamp").prop('hidden', true);
//	$("#img-CoverArt").prop('hidden', true);
	$("#div-CoverArt").prop('hidden', false);
	//$("#strongSpan-CoverArt").prop('hidden', false);
	//$("#input-CoverArt").prop('type', 'text')
	$("#span-Notes").prop('hidden', true);
	$("#input-Notes").prop('hidden', false);
	$("#div-Notes").prop('style').height = '170px';
	$("#buttonLeft-modifyAudibleFooter").prop('text', 'Cancel');
	$("#buttonRight-modifyAudibleFooter").prop('hidden', false);
	//$("#input-Notes").text()	//return string being displayed
	//$("#input-CoverArt").val()	//selected file??

}

function modifyCurrentBook(element) {
	var currentID = $("#buttonAudibleTitle").attr('data-id');
	//alert("In modifyCurrentBook(). currentID -- " + currentID);
	var mustacheData = {
		"modifyAudible-h2":"Edit Book  ID- ",
		"modifyAudible-ID":currentID,
	};
	fillTemplateSpace("titleSpace", "modifyAudibleTitleTemplate", mustacheData);
	$("#buttonAudibleTitle").prop('hidden', true);
	$("#span-Title").prop('hidden', true);
	$("#input-Title").prop('type', 'text');
	$("#span-Author").prop('hidden', true);
	$("#input-Author").prop('type', 'text');
	$("#span-Series").prop('hidden', true);
	$("#input-Series").prop('type', 'text');
	$("#span-SeriesBook").prop('hidden', false);
	$("#input-SeriesBook").prop('type', 'text');
	$("#span-ReadOrder").prop('hidden', true);
	$("#input-ReadOrder").prop('type', 'text');
	$("#span-ReadOrderNumber").prop('hidden', false);
	$("#input-ReadOrderNumber").prop('type', 'text');
	$("#span-Categories").prop('hidden', true);
	$("#input-Categories").prop('type', 'text');
	$("#span-ListenedTo").prop('hidden', true);
	$("#input-ListenedTo").prop('type', 'text');
	$("#span-Status").prop('hidden', true);
	$("#input-Status").prop('type', 'text');
	$("#span-Length").prop('hidden', true);
	$("#input-Length").prop('type', 'text');
	$("#span-MyRating").prop('hidden', true);
	$("#input-MyRating").prop('type', 'text');
	$("#span-DateAdded").prop('hidden', true);
	$("#input-DateAdded").prop('type', 'text');
	$("#span-Timestamp").prop('hidden', true);
	$("#strongSpan-Timestamp").prop('hidden', true);
//	$("#img-CoverArt").prop('hidden', true);
	$("#div-CoverArt").prop('hidden', false);
	//$("#strongSpan-CoverArt").prop('hidden', false);
	//$("#input-CoverArt").prop('type', 'text')
	$("#span-Notes").prop('hidden', true);
	$("#input-Notes").prop('hidden', false);
	$("#div-Notes").prop('style').height = '170px';
	$("#buttonLeft-modifyAudibleFooter").prop('text', 'Cancel');
	$("#buttonRight-modifyAudibleFooter").prop('hidden', false);
	//$("#input-Notes").text()	//return string being displayed
	//$("#input-CoverArt").val()	//selected file??
	pageObjectsList("Status", "Dropdowns", "listStatusDropdown");
	pageObjectsList("ListenedTo", "Dropdowns", "listListenedToDropdown");
	pageObjectsList("Categories", "Dropdowns", "listCategoriesDropdown");
	
};

function setInputStatusValue(element) {
	var liText = $("#" + element.id).text();
	//alert("In setInputElementValue().\n liText --" + liText);
	$("#input-Status").val(liText);
}

function setInputListenedToValue(element) {
	var liText = $("#" + element.id).text();
	//alert("In setInputListenedToValue().\n liText --" + liText);
	$("#input-ListenedTo").val(liText);
}

function setInputCategoriesValue(element) {
	var liText = $("#" + element.id).text();
	//alert("In setInputCategoriesValue().\n liText --" + liText);
	$("#input-Categories").val(liText);
}

function updateTableRow(element) {
	var $tablebody = $('#bodySpace');
	var $templateHTML = $('#modifyAudibleBodyTemplate').html();
	var $clickedIcon = element.id;
	var $clickedID = $clickedIcon.slice(13, $clickedIcon.length);
	var mustacheData = {
		"modifyAudible-h2":"View Book  ID- ",
		"modifyAudible-ID":$clickedID,
	};
	fillTemplateSpace("titleSpace", "modifyAudibleTitleTemplate", mustacheData);
	fillTemplateSpace("headerSpace", "modifyAudibleHeaderTemplate", "");
	var mustacheData = {
		"saveModifyFunction":"saveModifyAudible('update')",
	};
	fillTemplateSpace("footerSpace", "modifyAudibleFooter", mustacheData);
	
//	alert ("In tableRowUpdate(). \n$clickedIcon -- " +
//		$clickedIcon + "\n ID -- " + $clickedID);
	
	var postData = {
		"functionCall":"getAllFieldsByID",
		"fieldName":"",
		"searchkey":$clickedID,		//ID of row to edit
	};
	var dataString = JSON.stringify(postData);
    $.ajax({
        url:'AudibleBooks.php',
        type:'POST',
        data: {postOBJ: dataString},
        success:function(returnData) {
			//console.log("returnData fetchTableResults -- " + returnData);
			//alert("In fetchTableResults returnData length -- " + returnData.length);
			$tablebody.empty();
			$.each(returnData, function(i, resultitem){
				if(resultitem.BookNumber==0) {
					var modifySeries = resultitem.Series;
				}else {
					var modifySeries = resultitem.Series + " -- Book " + resultitem.BookNumber;
				}
				if(resultitem.BookOrderNumber==0) {
					var modifyBook = resultitem.ReadOrder;
				}else {
					var modifyBook = resultitem.ReadOrder + " -- Book " + resultitem.ReadOrderNumber;
				}
				if(resultitem.ListenedTo==0) {
					var modifyListenedTo = "NO";
				}else {
					var modifyListenedTo = "YES";
				}	    					
				//var SeriesReadOrder = resultitem.ReadOrder + " Book - " + resultitem.ReadOrderNumber;
				var dataMustache = {
					"modifyAudible-ID":resultitem.ID,
					"modifyAudible-Title":resultitem.Title,
					"modifyAudible-Author":resultitem.Author,
					"modifyAudible-Series":resultitem.Series,
					"modifyAudible-modSeries":modifySeries,
					"modifyAudible-modBook":modifyBook,
					"modifyAudible-BookNumber":resultitem.BookNumber,
					"modifyAudible-ReadOrderNumber":resultitem.ReadOrderNumber,
					"modifyAudible-ReadOrder":resultitem.ReadOrder,
					"modifyAudible-Length":resultitem.Length,
					"modifyAudible-Categories":resultitem.Categories,
					"modifyAudible-Status":resultitem.Status,
					"modifyAudible-ListenedTo":modifyListenedTo,
					"modifyAudible-DateAdded":resultitem.DateAdded,
					"modifyAudible-MyRating":resultitem.MyRating,
					"modifyAudible-CoverArt":resultitem.CoverArt,
					"modifyAudible-Notes":resultitem.Notes,
					"modifyAudible-ModifiedDate":resultitem.ModifiedDate,					
				};
				$tablebody.append(Mustache.render($templateHTML, dataMustache));
			});
        },
        error: function() {
        	alert('In tableRowUpdate(). Error with getting row data from AudibleBooks.php.');
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

function acknowledgeDeleteRow() {
	var rowID = $('#dialogID-modal').val();
	$('#dialogBoxStatus').modal('hide');
	
	//	alert("In acknowledgeDeleteRow() rowID -- " + rowID);
	var postData = {
		"functionCall":"deleteTableRowByID",
		"fieldName":"",
		"searchkey":rowID,		//ID of row to delete
	};
	var dataString = JSON.stringify(postData);
    $.ajax({
        url:'AudibleBooks.php',
        type:'POST',
        data: {postOBJ: dataString},
        success:function(returnData) {
			$.each(returnData, function(i, resultitem){
				//alert("Success with Ajax onclickDropdowns()) -- " + resultitem.info);				
				if (resultitem.status == 'Success') {				
					//console.log("returnData -- " + returnData);				
					fetchTableResults()
				} else {
					alert("Failed Ajax PHP call deleteTableRowByID -- " + returnData);
				}
							
			});
		},
		error: function() {
			alert('AJAX Error deleteTableRow(element).');
		}
	//console.log("Out of switch");
	});	
}

function liveSearchKeyPress(element) {
	var $searchBoxId = element.id;
	var key = $("#" + $searchBoxId).val();
	//console.log("element id -- "+element.id + " key -- "+ $("#" + $searchBoxId).val());
	//alert("liveSearchKeyPress() element.id -- " + $searchBoxId + "\n key -- " + key);
	var $resultlist = $('#resultlist');
	var searchKEY = key + '%';
	//alert("sortby dropdown -- " + $('#sortby').attr('id'));
	var objID = $('#filterby').attr('id');
	var objText = document.getElementById(objID).innerHTML;	//Current text in <sortBy> dropdown
	var searchBytext = objText.slice(objText.lastIndexOf(" ") + 1,objText.length);	//Get the last word
	//alert("text in sortby -- " + sortBytext + "\n searchKEY -- " + searchKEY);
	var postData = {
		"functionCall":"getDISTINCTSearchTerms",
		"fieldName":searchBytext,
		"searchkey":searchKEY
	};
	var dataString = JSON.stringify(postData);

	if (key.length > 0)	{	    	
		$.ajax({
			url:'.php',
			type:'POST',
			data: {postOBJ: dataString},
			beforeSend:function () {
				$("#resultlist").slideUp('fast');
			},
			success:function(returnData) {
				//console.log("returnData '#searchbox').on('keyup' -- " + returnData);
				//alert("In '#searchbox').on('keyup' returnData length -- " + returnData.length)
				$resultlist.empty();

				$.each(returnData, function(i, resultitem){
					//alert("id -- " + resultitem.id + " " + sortBytext +" -- " + resultitem.field1);
					var searchItemTemplate = "<li onclick='searchResults(this)' " +
							"id=searchitem" + resultitem.id +
							" class='showitem'>" + resultitem.field1 + "</li>";
					$resultlist.append(searchItemTemplate);
				});AudibleBooks
				$('#resultlist').slideDown('fast');
			},
			error: function() {
				alert('Error with Live Search. NO data from AudibleBooks.php');
			}
		});
	} else {
		$('#resultlist').slideUp('fast');	
	}
}

function setStateSearchBox(state, liText) {
	if (state == "disabled") {
		sessionStorage.setItem("searchboxPlaceholder", "");
		$('#searchbox').attr("placeholder", "");	//removed for disabled element
		$('#searchbox').prop('disabled', true);	//Disable searchbox when in "Last Edit" sortBy and filterBy Nothing mode.
		sessionStorage.setItem("mainTable_Where", "");	//Set SQL to show all rows
	} else {
		$('#searchbox').prop('disabled', false);	//Enable searchbox when not sortBy "Last Edit"  and filterBy Nothing mode.
		$('#searchbox').attr("placeholder", "Search by " + liText);	//placeholder give idea of what to type
		sessionStorage.setItem("searchboxPlaceholder", "Search by " + liText);
	}
}

function onclickDropdowns(element) {	//comes here for when an item in the dropdowns is clicked 
	var liID = element.id;
	var liText = document.getElementById(liID).innerHTML;	//Current text in <li>
	var sqlCommand = "";
	//alert("onclickDropdowns() element click ID -- " + liID + " clicked element text -- " + liText);
	switch(element.id.slice(0,5)) {
		case 'sortI':
			document.getElementById('sortby').innerHTML = liText;
			sessionStorage.setItem("sortBysearchSelected", liText);	//Set storage variable to new value in sortBy
			var searchTerm = sessionStorage.getItem("sortBysearchTerm");	//current sortBy pageObj search term
			var objName = "sortby";
			var forObject = "getsqlItemByID";
			//var sqlCommand = "";
			//console.log("sortItem text -- " + liText + " li ID -- " + liID);
			break;
		case 'filte':
			switch(liText) {
				case 'Nothing':
					sessionStorage.setItem("sortBysearchTerm", "sortOrder00");	//set sortBy pageObj session storage
					sessionStorage.setItem("sortBysearchSelected", "Latest Modified");	//set sortBy current selection session storage
					setStateSearchBox("disabled", liText);
					pageObjectsList("sortOrder00", 'Dropdowns', 'sortDropdown');	//Fill in <li> values for sortBy dropdown
					var searchTerm = sessionStorage.getItem("sortBysearchTerm");	//current sortBy pageObj search term
					var objName = "sortby";					
					var liID = $("#sortDropdown li").last().attr('id');	//get id of first <li> in sortby dropdown
					$("#sortby").text('Latest Modified');	//set sortby dropdown to correct display
					break;
				case 'Author':
					sessionStorage.setItem("sortBysearchTerm", "sortOrder01");	//set sortBy pageObj session storage
					sessionStorage.setItem("sortBysearchSelected", "Title");	//set sortBy current selection session storage
					setStateSearchBox("enable", liText);
					pageObjectsList("sortOrder01", 'Dropdowns', 'sortDropdown');	//Fill in <li> values for sortBy dropdown
					var searchTerm = sessionStorage.getItem("sortBysearchTerm");	//current sortBy pageObj search term
					var objName = "sortby";					
					var liID = $("#sortDropdown li").first().attr('id');	//get id of first <li> in sortby dropdown
					$("#sortby").text('Title');	//set sortby dropdown to correct display
					break;
				case 'Series':
					sessionStorage.setItem("sortBysearchTerm", "sortOrder02");	//set sortBy pageObj session storage
					sessionStorage.setItem("sortBysearchSelected", "Read Order");	//set sortBy current selection session storage
					setStateSearchBox("enable", liText);
					pageObjectsList("sortOrder02", 'Dropdowns', 'sortDropdown');	//Fill in <li> values for sortBy dropdown
					var searchTerm = sessionStorage.getItem("sortBysearchTerm");	//current sortBy pageObj search term
					var objName = "sortby";					
					var liID = $("#sortDropdown li").first().attr('id');	//get id of first <li> in sortby dropdown
					$("#sortby").text('Read Order');	//set sortby dropdown to correct display
					
					break;
			}
			document.getElementById('filterby').innerHTML = liText;
			sessionStorage.setItem("filterBysearchSelected", liText);	//set filterby current selection session storage
			var forObject = "getsqlItemByID";	//used pageObject.php to get itemSQL for and ID
			//console.log("filterItem text -- " + liText + " li ID -- " + liID);
			break;
		case 'utili':
			var searchTerm = sessionStorage.getItem("utilitySearchTerm");	//current utility pageObj search term
			var objName = "utilities";	//used in success: switch
			var forObject = "getsqlItemByID";	//used pageObject.php to get itemSQL for and ID
			break;
	}
	var postData = {
		"forObject":forObject,	//used in switch() to customize code and function called in pageObjects.php
		"sqlCommand":"",	//used in creating SQL for data search
		"pageObject":searchTerm,
		"fieldname":liText,
		"clickedData":liID,
		};
	var dataString = JSON.stringify(postData);	//convert dataString string to JSON
	//alert("In onclickDropdowns(). JSON dataString --\n" + dataString);
	$.ajax({
	    url:'pageObjects.php',
	    type:'POST',
	    data: {postOBJ: dataString},
		success:function(returnData) {
			$.each(returnData, function(i, resultitem){
				//alert("Success with Ajax onclickDropdowns()) -- " + resultitem.info);				
				if (resultitem.status == 'Success') {				
					//console.log("returnData -- " + returnData);				
					switch(objName) {
						case "sortby":
							sessionStorage.setItem("mainTable_Order", "ORDER BY " + resultitem.info + " ");
							fetchTableResults();
							break;
						case "utilities":
							//alert("Utilities clicked. resultitem.info -- " + resultitem.info);
							window.open("https://onthebay.info" + resultitem.info);
							break;
						default:
							fetchTableResults();							
							break;
					}
				} else {
					alert("Failed Ajax sortfield -- " + returnData);
				}
				
			});
		},
        error: function() {
        	alert('Error on sortby or filterby item clicked.');
        }
    //console.log("Out of switch");
    });	
}

function fetchTableResults() {		// Fills the main Table <div> #maintablebody
	var $tablebody = $('#maintablebody');
	//var $templateDivSpace = $("#" + templateDivName);
	var $templateHTML = $('#tableRowsTemplate').html();

	var select = sessionStorage.getItem("mainTable_Select");	//Get select session value
	var from = sessionStorage.getItem("mainTable_From");	//Get from session value
	var where = sessionStorage.getItem("mainTable_Where");	//Get where session value
	var order = sessionStorage.getItem("mainTable_Order");	//Get select session value
	var limits = sessionStorage.getItem("mainTable_Limits");	//Get select session value
	
	var sqlObject = {
		"select":select,
		"from":from,
		"where":where,
		"order":order,
		"limits":limits
	}

//	alert("SQL string before call -- \n " + select + "\n" + from + "\n" +
//		 where + "\n" + order + "\n" + limits);

	var postData = {
		"functionCall":"getTableRowData",
		"fieldName":sqlObject,
		"searchkey":""
	};
	var dataString = JSON.stringify(postData);
    $.ajax({
        url:'AudibleBooks.php',
        type:'POST',
        data: {postOBJ: dataString},
        success:function(returnData) {
			//console.log("returnData fetchTableResults -- " + returnData);
			//alert("In fetchTableResults returnData length -- " + returnData.length);
			$tablebody.empty();
			$.each(returnData, function(i, resultitem){
				var dataMustache = {
					"tableRow-ID":resultitem.ID,
					"tableRow-Title":resultitem.Title,
					"tableRow-Author":resultitem.Author,
					"tableRow-Series":resultitem.Series,
					
				};
				$tablebody.append(Mustache.render($templateHTML, dataMustache));
			});
        },
        error: function() {
        	alert('In fetchTableResults(). Error with getting row data from AudibleBooks.php.');
        }
	});
}

function searchResults(thisID) {	//Called when item in Live Search box is clicked
	//var $searchbox = $('#searchbox');
	var itemClickedText = document.getElementById(thisID.id).innerHTML;
	var filterbyText = $("#filterby").html();
	var where = "WHERE `" + filterbyText + "` = '" + itemClickedText + "' " ;	//get rows matching item clicked in searchbox results

	//alert("searchResults() Clicked element innerHTML -- " + itemClickedText + "\n filterbyText -- " +
	//	filterbyText + "\n WHERE -- " + where);	

	
	sessionStorage.setItem("mainTable_Where", where);	//Get where session value


	//sessionStorage.setItem("mainTable_Where", "WHERE `Author` = '" + itemClicked + "' ");	//update mainTable SQL with selected search value. 
	//fetchTableResults() uses variables
	fetchTableResults();	//Get table rows based on new WHERE
	$("#resultlist").slideUp('fast');	//hid results list
	$('#searchbox').attr("placeholder", sessionStorage.getItem("searchboxPlaceholder"));	//placeholder give idea of what to type
	$('#searchbox').val("");	//remove the typed chars.
}

function getListItems(postData) {
	var dataString = JSON.stringify(postData);
    $.ajax({
        url:'pageObjects.php',
        type:'POST',
        data: {postOBJ: dataString},
        success:function(returnData) {
			console.log("returnData -- " + returnData);			
			return returnData;
        },
        error: function() {
        	alert('In pageObjectsList().  Error with getting data from pageObjects.php');
        }
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
        url:'pageObjects.php',
        type:'POST',
        data: {postOBJ: dataString},
        success:function(returnData) {
			console.log("returnData -- " + returnData);			
			var myOBJ = document.getElementById(elementID);
			var $myOBJContent = $('#' + myOBJ.id);
			var myOBJTemplate = $('#liItemEntryTemplate').html();
			//alert("element myOBJ.id  -- " +  myOBJ.id + " elementID -- " + elementID);
			var objIDname = "noswitch";
			switch(elementID) {
				case "sortDropdown":
					var objIDname = "sortItem";
					var objOnclick = "onclickDropdowns(this)";
					break;
				case "filterDropdown":
					var objIDname = "filteritem";
					var objOnclick = "onclickDropdowns(this)";
					break;
				case "utilitiesDropdown":
					var objIDname = "utilitiesitem";
					var objOnclick = "onclickDropdowns(this)";
					break;
				case "listStatusDropdown":
					var objIDname = "listStatus";
					var objOnclick = "setInputStatusValue(this)";
					break;
				case "listCategoriesDropdown":
					var objIDname = "listCategories";
					var objOnclick = "setInputCategoriesValue(this)";
					break;
				case "listListenedToDropdown":
					var objIDname = "listListenedTo";
					var objOnclick = "setInputListenedToValue(this)";
					break;
			};
			//alert("in pageObjectsList: idname -- " + objIDname);
			$myOBJContent.empty();
			$.each(returnData, function(i, resultitem){
				if(resultitem.itemDisplay == "REFRESH") {
					var objOnclick = "fetchTableResults()";
				}
				var myOBJdata = {
					"liItemEntryId":objIDname + resultitem.ID,
					"liItemEntryOnclick":objOnclick,
					"liItemDisplay":resultitem.itemDisplay,
				};
				$myOBJContent.append(Mustache.render(myOBJTemplate, myOBJdata));
				//$myOBJContent.append("<li id='" + objIDname + resultitem.ID + "' onclick='onclickDropdowns(this)' " +
				//	"class='showitem'>" + resultitem.itemDisplay + "</li>");
			});				
        },
        error: function() {
        	alert('In pageObjectsList().  Error with getting data from pageObjects.php');
        }
	});
	
}

$(document).ready(function(){	//Code to run when page finishes loading

	//alert("In initial $(document).ready(function()");

/*	//build and fill template buffers with html
	makeTitleSpace();
	makeHeaderSpace();
	makeBodySpace();
	makeFooterSpace();	*/
	

	//javascript session storage
	var testSession = sessionStorage.getItem("sessionStorageInit");
	//alert("Init Document load testSession -- " + typeof testSession);
	
	if ((typeof testSession == "undefined") || (testSession == null)) {	//Check if not true. Initilize session variables
		alert("In if() statement. Initilize sessionStorage -- " + typeof testSession);
		sessionStorage.setItem("sessionStorageInit", "TRUE");

		sessionStorage.setItem("sortBysearchTerm", "sortOrder00");	//setup sortBy pageObj session storage
		sessionStorage.setItem("sortBysearchSelected", "Latest Modified");	//setup sortBy current selection session storage
		sessionStorage.setItem("filterBysearchTerm", "filterBy00");	//setup filterBy pageObj session storage
		sessionStorage.setItem("filterBysearchSelected", "Nothing");	//setup sortBy current selection session storage
		sessionStorage.setItem("searchboxPlaceholder", "");	//setup searchbox Placeholder current selection session storage
		sessionStorage.setItem("utilitySearchTerm", "utilities0");	//setup sortBy pageObj session storage

	
		sessionStorage.setItem("mainTable_Select", "SELECT `ID`, `Title`, `Author`, `Series` ");	//setup filterBy pageObj session storage
		sessionStorage.setItem("mainTable_From", "FROM AudibleBooks ");	//setup filterBy pageObj session storage
		sessionStorage.setItem("mainTable_Where", "");	//setup filterBy pageObj session storage
		sessionStorage.setItem("mainTable_Order", "ORDER BY `ModifiedDate` DESC ");	//setup filterBy pageObj session storage
		sessionStorage.setItem("mainTable_Limits", "LIMIT 0, 15");	//setup filterBy pageObj session storage		
	}
	
	document.getElementById('sortby').innerHTML = sessionStorage.getItem("sortBysearchSelected");
	document.getElementById('filterby').innerHTML = sessionStorage.getItem("filterBysearchSelected");

	if (sessionStorage.getItem("filterBysearchSelected") == "Nothing") {
		$('#searchbox').attr("placeholder", "");	//removed for disabled element
		$('#searchbox').prop('disabled', true);	//Disable searchbox when in "Last Edit" sortBy and filterBy Nothing mode.
	} else {
		$('#searchbox').prop('disabled', false);	//Enable searchbox when not sortBy "Last Edit"  and filterBy Nothing mode.
		$('#searchbox').attr("placeholder", sessionStorage.getItem("searchboxPlaceholder"));	//placeholder give idea of what to type
		//alert("sortby text -- "+ sessionStorage.getItem("sortBysearchSelected") + 
		//	"\n searchbox placeholder -- " + sessionStorage.getItem("searchboxPlaceholder") +
		//	" searchbox disabled -- " + $('#searchbox').prop('disabled'));
	}
	
	var sortBysearchTerm = sessionStorage.getItem("sortBysearchTerm");	//current sortBy pageObj search term
	var filterBysearchTerm = sessionStorage.getItem("filterBysearchTerm");	//current filterBy pageObj search term
	var utilitySearchTerm = sessionStorage.getItem("utilitySearchTerm");	//current utility pageObj search term

	//pageObjectsList(searchTerm, forObject, $elementID) function values to pass
	pageObjectsList(sortBysearchTerm, 'Dropdowns', 'sortDropdown');	//Fill in <li> values for sortBy dropdown
	pageObjectsList(filterBysearchTerm, 'Dropdowns', 'filterDropdown');	//Fill in <li> values for sortBy dropdown
	pageObjectsList(utilitySearchTerm, 'Dropdowns', 'utilitiesDropdown');	//Fill in <li> values for utilities dropdown

	//var searchkey = "";

	//fetchTableResults() uses variables
	fetchTableResults();
	
	
	
});

