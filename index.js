
function liveSearchKeyPress(key) {
	var $resultlist = $('#resultlist');
	var searchKEY = key + '%';
	//alert("sortby dropdown -- " + $('#sortby').attr('id'));
	var objID = $('#sortby').attr('id');
	var objText = document.getElementById(objID).innerHTML;	//Current text in <sortBy> dropdown
	var sortBytext = objText.slice(objText.lastIndexOf(" ") + 1,objText.length);	//Get the last word
	//alert("text in sortby -- " + sortBytext + "\n searchKEY --" + searchKEY);
	var postData = {
		"functionCall":"getDISTINCTSearchTerms",
		"fieldName":sortBytext,
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
			sessionStorage.setItem("sortBysearchSelected", liText);	//Set storage variable to new value in sortBy
			//alert("clicked dropdown item ID -- " + liID + " item text -- " + liText);
			if (liText == "Latest Modified") {
				//sessionStorage.setItem("sortBysearchSelected", "Latest Modified");
				sessionStorage.setItem("searchboxPlaceholder", "");
				$('#searchbox').attr("placeholder", "");	//removed for disabled element
				$('#searchbox').prop('disabled', true);	//Disable searchbox when in "Last Edit" sortBy and filterBy Nothing mode.
			} else {
				$('#searchbox').prop('disabled', false);	//Enable searchbox when not sortBy "Last Edit"  and filterBy Nothing mode.
				$('#searchbox').attr("placeholder", "Search by " + liText);	//placeholder give idea of what to type
				sessionStorage.setItem("searchboxPlaceholder", "Search by " + liText);
			}
			document.getElementById('sortby').innerHTML = 'Sort by ' + liText;
			sessionStorage.setItem("sortBysearchSelected", "Sort by " + liText);
			var searchTerm = sessionStorage.getItem("sortBysearchTerm");	//current sortBy pageObj search term
			var objName = "sortby";
			var forObject = "sortfield";
			var sqlCommand = "ORDER";
			console.log("sortItem text -- " + liText + " li ID -- " + liID);
			break;
		case 'filte':
			document.getElementById('filterby').innerHTML = 'Filter by ' + liText;
			var searchTerm = sessionStorage.getItem("filterBysearchTerm");	//current filterBy pageObj search term
			var objName = "filterby";
			//console.log("filterItem" + " li ID -- " + liID);
			break;
		case 'utili':
			var searchTerm = sessionStorage.getItem("utilitySearchTerm");	//current utility pageObj search term
			var objName = "utilities";	//used in success: switch
			var forObject = "getsqlItemByID";	//used pageObject.php to get itemSQL for and ID
			var sqlCommand = "";
			console.log("filterItem" + " li ID -- " + liID);
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
							alert("Utilities clicked. resultitem.info -- " + resultitem.info);
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

function fetchTableResults(searchkey) {		// Fills the main Table <div> #maintablebody
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


/*	alert("SQL string before call -- \n " + select + "\n" + from + "\n" +
		 where + "\n" + order + "\n" + limits + "\n" + searchkey)	*/

	var postData = {
		"functionCall":"getTableRowData",
		"fieldName":sqlObject,
		"searchkey":searchkey
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
        },
        error: function() {
        	alert('Error with getting row data from AudibleBooks.php.');
        }
	});
}

function searchResults(thisID) {	//Called when item in Live Search box is clicked
	//var $searchbox = $('#searchbox');
	var itemClicked = document.getElementById(thisID.id).innerHTML	 

	//alert("Clicked element innerHTML -- " + itemClicked );	

	sessionStorage.setItem("mainTable_Where", "WHERE `Author` = '" + itemClicked + "' ");	//update mainTable SQL with selected search value. 
	var searchkey = "";
	//fetchTableResults(searchkey) uses variables
	fetchTableResults(searchkey);	//Get table rows based on new WHERE
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
				$('#' + myOBJ.id).append("<li id='" + objIDname + resultitem.ID + "' class='showitem'>" + resultitem.itemDisplay + "</li>");
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

$(document).ready(function (){	// actions with html objects. dropdowns, text entry, mouse hover...
	$('#searchbox').on('keyup',function () {	//Ajax Live Search. Comes here on ever keyup.
		//var key = $(this).val();
		liveSearchKeyPress($(this).val());
	});

	$('[data-toggle="tooltip"]').tooltip();   
	
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

	
});

$(document).ready(function(){	//Code to run when page finishes loading

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
	if (sessionStorage.getItem("sortBysearchSelected") == "Latest Modified") {
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

	//pageObjectsList(searchTerm, forObject, $elementID)
	pageObjectsList(sortBysearchTerm, 'Dropdowns', 'sortDropdown');	//Fill in <li> values for sortBy dropdown
	pageObjectsList(filterBysearchTerm, 'Dropdowns', 'filterDropdown');	//Fill in <li> values for sortBy dropdown
	pageObjectsList(utilitySearchTerm, 'Dropdowns', 'utilitiesDropdown');	//Fill in <li> values for utilities dropdown

	var searchkey = "";

	//fetchTableResults(searchkey) uses variables
	fetchTableResults(searchkey);
	

});

/*	$(document).ready(function(){	//tooltip
	$('[data-toggle="tooltip"]').tooltip();   
});	*/