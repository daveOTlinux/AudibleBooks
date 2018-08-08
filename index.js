


function makeTitleSpace() {
	var dataMustache = {
		"titleText":"Audible Books",
		"titleNewButton":"Add New Audible Book"
	};
	fillTemplateSpace("titleSpace", "audibleTitleTemplate", dataMustache)
}

function makeHeaderSpace() {
	var dataMustache = {
		"sortbyText":"Sort by Last Edit ",
		"filterbyText":"Filter "
	};
	fillTemplateSpace("headerSpace", "audibleHeaderTemplate", dataMustache)
}

function makeBodySpace() {
	var dataMustache = {
		"tableRowId":"maintable",
		"tablebodyId":"maintablebody"
	};
	fillTemplateSpace("bodySpace", "tableRowsTemplate", dataMustache)
}

function makeFooterSpace() {
	var dataMustache = {
		"utilitiesText":"Utilities "
	};
	fillTemplateSpace("footerSpace", "audibleFooterTemplate", dataMustache)
}

function fillTemplateSpace(templateDivName, templateName, mustacheData) {
	var $templateDivSpace = $("#" + templateDivName);
	var $templateHTML = $("#" + templateName).html();
	//alert("In fillTemplateSpace() ")
	$templateDivSpace.empty();
	$templateDivSpace.append(Mustache.render($templateHTML, mustacheData));
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
			url:'AudibleBooks.php',
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
				});
				$('#resultlist').slideDown('fast');
			},
			error: function() {
				alert('Error with Live Search. NO data from fetchSearchData.php');
			}
		});
	} else {
		$('#resultlist').slideUp('fast');	
	}
}

function onclickDropdowns(element) {	//comes here for when an item in the dropdowns is clicked 
	var liID = element.id;
	var liText = document.getElementById(liID).innerHTML;	//Current text in <li>
	//alert("onclickDropdowns() element click ID -- " + liID + " clicked element text -- " + liText);
	switch(element.id.slice(0,5)) {
		case 'sortI':
			document.getElementById('sortby').innerHTML = liText;
			sessionStorage.setItem("sortBysearchSelected", liText);	//Set storage variable to new value in sortBy
			var searchTerm = sessionStorage.getItem("sortBysearchTerm");	//current sortBy pageObj search term
			var objName = "sortby";
			var forObject = "getsqlItemByID";
			var sqlCommand = "";
			//console.log("sortItem text -- " + liText + " li ID -- " + liID);
			break;
		case 'filte':
			if (liText == "Nothing") {
				sessionStorage.setItem("searchboxPlaceholder", "");
				$('#searchbox').attr("placeholder", "");	//removed for disabled element
				$('#searchbox').prop('disabled', true);	//Disable searchbox when in "Last Edit" sortBy and filterBy Nothing mode.
			} else {
				$('#searchbox').prop('disabled', false);	//Enable searchbox when not sortBy "Last Edit"  and filterBy Nothing mode.
				$('#searchbox').attr("placeholder", "Search by " + liText);	//placeholder give idea of what to type
				sessionStorage.setItem("searchboxPlaceholder", "Search by " + liText);
			}
			document.getElementById('filterby').innerHTML = liText;
			sessionStorage.setItem("filterBysearchSelected", "Nothing");	//set filterby current selection session storage
			var searchTerm = sessionStorage.getItem("filterBysearchTerm");	//get vcurrent filterBy pageObj search term
			var objName = "filterby";
			//console.log("filterItem text -- " + liText + " li ID -- " + liID);
			break;
		case 'utili':
			var searchTerm = sessionStorage.getItem("utilitySearchTerm");	//current utility pageObj search term
			var objName = "utilities";	//used in success: switch
			var forObject = "getsqlItemByID";	//used pageObject.php to get itemSQL for and ID
			var sqlCommand = "";
			//console.log("filterItem" + " li ID -- " + liID);
			break;
	}
	var postData = {
		"forObject":forObject,	//used in switch() to customize code and function called in pageObjects.php
		"sqlCommand":sqlCommand,	//used in creating SQL for data search
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
			$.each(returnData, function(i, resultitem){
				//alert("Success with Ajax onclickDropdowns()) -- " + resultitem.info);				
				if (resultitem.status == 'Success') {				
					//console.log("returnData -- " + returnData);				
					switch(objName) {
						case "sortby":
							sessionStorage.setItem("mainTable_Order", "ORDER BY " + resultitem.info + " ")
							var searchkey = "";			
							//fetchTableResults(searchkey) uses variables
							fetchTableResults(searchkey);
							break;
						case "utilities":
							//alert("Utilities clicked. resultitem.info -- " + resultitem.info);
							window.open("https://onthebay.info" + resultitem.info);
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

function fetchTableResults(searchText) {		// Fills the main Table <div> #maintablebody
	var $tablebody = $('#maintablebody');

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

	alert("SQL string before call -- \n " + select + "\n" + from + "\n" +
		 where + "\n" + order + "\n" + limits + "\n searchText -- " + searchText);

	var postData = {
		"functionCall":"getTableRowData",
		"fieldName":sqlObject,
		"searchkey":searchText
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
		       	var tablerowtemplate = "<tr>" +
		       			"<td>" + resultitem.ID + "</td>" +
						"<td>" + resultitem.Title + "</td>" +
						"<td>" + resultitem.Author + "</td>" +
						"<td>" + resultitem.Series + "</td>" +
						"<td>" +
						"<a href='#' title='View Record' data-toggle='tooltip'>" +
							"<span class='fa fa-eye'></span></a>" +
						"<a href='#' title='Update Record' data-toggle='tooltip'>" +
							"<span class='fa fa-pencil'></span></a>" +
						"<a href='#' title='Delete Record' data-toggle='tooltip'>" +
							"<span class='fa fa-trash'></span></a>" +
						"</td>" +
						"</tr>";
				//alert("table row --" + tablerowtemplate);
				$tablebody.append(tablerowtemplate);
			});
        },
        error: function() {
        	alert('Error with getting row data from AudibleBooks.php.');
        }
	});
}

function searchResults(thisID) {	//Called when item in Live Search box is clicked
	//var $searchbox = $('#searchbox');
	var itemClickedText = document.getElementById(thisID.id).innerHTML;
	var filterbyText = $("#filterby").html();
	var where = "WHERE `" + filterbyText + "` = '" + itemClickedText + "' " ;	//get rows matching item clicked in searchbox results

	alert("searchResults() Clicked element innerHTML -- " + itemClickedText + "\n filterbyText -- " +
		filterbyText + "\n WHERE -- " + where);	

	
	sessionStorage.setItem("mainTable_Where", where);	//Get where session value


	//sessionStorage.setItem("mainTable_Where", "WHERE `Author` = '" + itemClicked + "' ");	//update mainTable SQL with selected search value. 
	//var searchkey = "";
	//fetchTableResults(searchkey) uses variables
	fetchTableResults("");	//Get table rows based on new WHERE
	$("#resultlist").slideUp('fast');	//hid results list
	$('#searchbox').attr("placeholder", sessionStorage.getItem("searchboxPlaceholder"));	//placeholder give idea of what to type
	$('#searchbox').val("");	//remove the typed chars.
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
			//alert("element myOBJ.id  -- " +  myOBJ.id + " elementID -- " + elementID);
			var objIDname = "noswitch";
			switch(elementID) {
				case "sortDropdown":
					var objIDname = "sortItem";
					break;
				case "filterDropdown":
					var objIDname = "filteritem";
					break;
				case "utilitiesDropdown":
					var objIDname = "utilitiesitem";
					break;
			};
			//alert("in pageObjectsList: idname -- " + objIDname);
			$('#' + myOBJ.id).empty();
			$.each(returnData, function(i, resultitem){
				$('#' + myOBJ.id).append("<li id='" + objIDname + resultitem.ID + "' onclick='onclickDropdowns(this)' " +
					"class='showitem'>" + resultitem.itemDisplay + "</li>");
			});				
        },
        error: function() {
        	alert('In pageObjectsList().  Error with getting data from pageObjects.php');
        }
	});
	
}

/*	$(document).ready(function (){	//searchbox keyup. Live Ajax
	var $resultlist = $('#resultlist');
		
	$('#searchbox').on('keyup',function () {	//Ajax Live Search. Comes here on ever keyup.
		var key = $(this).val();
		var searchKEY = key + '%';

		//alert("sortby dropdown -- " + $('#sortby').attr('id'));
		var objID = $('#sortby').attr('id');
		var objText = document.getElementById(objID).innerHTML;	//Current text in <sortBy> dropdown
		var sortBytext = objText.slice(objText.lastIndexOf(" ") + 1,objText.length);	//Get the last word
		//alert("text in sortby -- " + sortBytext);


		var postData = {
			"field1":sortBytext,
		 	"select":"SELECT DISTINCT `" + sortBytext + "` AS field1 ",
			"from":"FROM AudibleBooks " ,
			"where":"WHERE `" + sortBytext + "` LIKE " ,
			"order":"ORDER BY `" + sortBytext + "` ASC " ,
			"limit":"LIMIT 10",
			"searchkey":searchKEY
		};
		var dataString = JSON.stringify(postData);

		if (key.length > 0)	{	    	
		    $.ajax({
		        url:'fetchSearchData.php',
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
					});
					$('#resultlist').slideDown('fast');
		        },
		        error: function() {
		        	alert('Error with Live Search. NO data from fetchSearchData.php');
		        }
		    });
		} else {
			$('#resultlist').slideUp('fast');	
		}
	});
/*
	$("#sortDropdown").on('click',function(){	//When SortBy dropdown data <li> is clicked
		var element = event.target;
		//alert("Object in sortDropdown has been clicked -- " + element.id);		
		onclickDropdowns(element)	//function changes element text and gets SQL for <li> choice
	});

	$("#filterDropdown").on('click',function(){	//When FilterBy dropdown data <li> is clicked
		var element = event.target;
		//alert("Object in filterDropdown has been clicked -- " + element.id);		
		onclickDropdowns(element)	//function changes element text and gets SQL for <li> choice
	});
	
	$("#utilitiesDropdown").on('click',function(){	//When FilterBy dropdown data <li> is clicked
		var element = event.target;
		//alert("Object in utilitiesDropdown has been clicked -- " + element.id);		
		onclickDropdowns(element)	//function changes element text and gets SQL for <li> choice
	});

});	*/

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

	var searchkey = "";

	//fetchTableResults(searchkey) uses variables
	fetchTableResults(searchkey);
	
	
	
});

