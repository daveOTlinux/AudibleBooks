

function fillTemplateSpace(templateDivName, templateName, mustacheData) {
	var $templateDivSpace = $("#" + templateDivName);
	var templateHTML = $("#" + templateName).html();
	//alert("In fillTemplateSpace() ")
	$templateDivSpace.empty();
	$templateDivSpace.append(Mustache.render(templateHTML, mustacheData));
}

function getImportRowbyID() {
	$('#dialogBoxStatus').modal('hide');
	var dialogRowID = parseInt($('#dialogInput-modal').val());
	alert("In getImportRowbyID() \n dialogRowID value and type -- " + dialogRowID + " and -- " + typeof(dialogRowID));
	fetchImportResults(dialogRowID);
	
}

function gotoNextRow() {
	var currentImportID = Number($("#importHeaderID").attr('data-id'));
	//alert("In gotoNextRow(). currentImportID -- " + currentImportID);
	fetchImportResults(currentImportID + 1);
	
}

function gotoPreviousRow() {
	var currentImportID = Number($("#importHeaderID").attr('data-id'));
	//alert("In gotoNextRow(). currentImportID -- " + currentImportID);
	fetchImportResults(currentImportID - 1);
	
}

function gotoRowID() {
	var modalContent = $("#update-modal");
	var modalTemplate = $('#dialogBox-template').html();	

	modalContent.empty();				
	var modalData = {
		"dialogInput-modal":"",
		"dialogInputType-modal":"text",
		"dialogTitle-modal":"Enter row ID of Import Table",
		"dialogBody-modal":"",
		"acceptButton-modal":"OK",
		"cancelButton-modal":"Cancel",
		"cancelButton-modalHidden":"",
		"acceptFunction-modal":"getImportRowbyID()",
	};
	modalContent.append(Mustache.render(modalTemplate, modalData));
	$("#dialogBoxStatus").modal();	//opens modal
}

function displayNoRowsFound() {
	$('#dialogBoxStatus').modal('hide');
	fetchImportResults(2);
	
}

function popupDialogModal() {
	var modalContent = $("#update-modal");
	var modalTemplate = $('#dialogBox-template').html();
	
	modalContent.empty();				
	var modalData = {
		"dialogInput-modal":"",
		"dialogInputType-modal":"hidden",
		"dialogTitle-modal":"No AudibleBooks Record found.",
		"dialogBody-modal":"",
		"acceptButton-modal":"OK",
		"cancelButton-modal":"",
		"cancelButton-modalHidden":"hidden",
		"acceptFunction-modal":"displayNoRowsFound()",
	};
	modalContent.append(Mustache.render(modalTemplate, modalData));
	$("#dialogBoxStatus").modal();	//opens modal
	
}

function insertAudibleTable(element) {
	var buttonId = $("#" + element.id).attr('id');
	var currentImportID = Number($("#importHeaderID").attr('data-id'));
	var selectedBookID = Number($("#" + buttonId).attr('data-id'));
	//alert("In insertAudibleTable(). currentImportID -- " + currentImportID + "\n selectedBookID -- " + selectedBookID);
	var inputTitle = $('#input-Title' + selectedBookID).val();
	var inputAuthor = $('#input-Author' + selectedBookID).val();
	var inputSeries = $('#input-Series' + selectedBookID).val();
	var inputBookNumber = $('#input-SeriesBook' + selectedBookID).val();
	var inputReadOrder = $('#input-ReadOrder' + selectedBookID).val();
	var inputReadOrderNumber = $('#input-ReadOrderNumber' + selectedBookID).val();
	var inputLength = $('#import-Length').val();
	var inputDateAdded = $('#import-DateAdded').val();
	
}

function updateAudibleTable(element) {
	var buttonId = $("#" + element.id).attr('id');
	var currentImportID = Number($("#importHeaderID").attr('data-id'));
	var selectedBookID = Number($("#" + buttonId).attr('data-id'));
	//alert("In updateAudibleTable(). currentImportID -- " + currentImportID + "\n selectedBookID -- " + selectedBookID);
	var inputTitle = $('#input-Title' + selectedBookID).val();
	var inputAuthor = $('#input-Author' + selectedBookID).val();
	var inputSeries = $('#input-Series' + selectedBookID).val();
	var inputBookNumber = $('#input-SeriesBook' + selectedBookID).val();
	var inputReadOrder = $('#input-ReadOrder' + selectedBookID).val();
	var inputReadOrderNumber = $('#input-ReadOrderNumber' + selectedBookID).val();
	var inputLength = $('#import-Length').val();
	var inputDateAdded = $('#import-DateAdded').val();
	alert("In updateAudibleTable(). " +
		"\n inputTitle -- " + inputTitle +
		"\n inputAuthor -- " + inputAuthor +
		"\n inputSeries -- " + inputSeries +
		"\n inputBookNumber -- " + inputBookNumber +
		"\n inputReadOrder -- " + inputReadOrder +
		"\n inputReadOrderNumber -- " + inputReadOrderNumber +
		"\n inputLength -- " + inputLength +
		"\n inputDateAdded -- " + inputDateAdded);

	var sqlCommand = "SET `Title` = '" + inputTitle +
	"', `Author` = '" + inputAuthor +
	"', `Series` = '" + inputSeries +
	"', `BookNumber` = '" + inputBookNumber +
	"', `ReadOrderNumber` = '" + inputReadOrderNumber +
	"', `ReadOrder` = '" + inputReadOrder +
	"', `Length` = '" + inputLength +
	"', `DateAdded` = '" + inputDateAdded +
	"', `ModifiedDate` = NOW() ";
	
	var postData = {
		"functionCall":"updateTableByID",
		"fieldName":sqlCommand,
		"searchkey":selectedBookID,		//ID of row to edit
	};
	
	var dataString = JSON.stringify(postData);	//convert dataString string to JSON
	$.ajax({
		url:'AudibleBooks.php',
		type:'POST',
		data: {postOBJ: dataString},
		success:function(returnData) {
			$.each(returnData, function(i, resultitem){
				if (resultitem.status == 'Success') {
					alert("Return from AJAX updateAudibleTable() php call. Success!");
					//closeModifyAudible();
					//checkSearchTermChange(searchTermUpdate, doListUpdateDisplayRefresh);
				} else {
					alert("Return from AJAX updateTableByID() php call. Failed! \n resultitem.info -- " + resultitem.info);
				}
			});
		},
		error: function() {
			alert('Error in updateAudibleTable() no return from PHP call.');
		}
	});		
}

function fetchAudibleResults() {		// Fills the main Table <div> #maintablebody
	var inputTitleSearch = $("#inputTitleSearch").val();
	var $pageSection = $('#audibleSpace');
	var $templateHTML = $('#bodyAudibletemplate').html();
	
	var sqlObject = {
		"select":"SELECT `ID`, `Title`, `Author`, `Series`, `BookNumber`, `ReadOrderNumber`, `ReadOrder`, `Notes` ",
		"from":"FROM `AudibleBooks` ",
		"where":"WHERE `Title` LIKE '%" + inputTitleSearch + "%'",
		"order":"",
		"limits":""
	};
	
	var postData = {
		"functionCall":"getAudibleRowData",
		"fieldName":sqlObject,
		"searchkey":""
	};
	var dataString = JSON.stringify(postData);
	$.ajax({
		url:'ImportAudibleCSV.php',
		type:'POST',
		data: {postOBJ: dataString},
		success:function(returnData) {
			//console.log("returnData fetchTableResults -- " + returnData);
			//alert("In fetchTableResults returnData length -- " + returnData.length);
				$pageSection.empty();
				$.each(returnData, function(i, resultitem){
					if (resultitem.status == 'Success') {
						var dataMustache = {
							"modifyAudible-ID":resultitem.ID,
							"modifyAudible-Title":resultitem.Title,
							"modifyAudible-Author":resultitem.Author,
							"modifyAudible-Series":resultitem.Series,
							"modifyAudible-BookNumber":resultitem.BookNumber,
							"modifyAudible-Button":"updateAudibleTable(this)",
							"modifyAudible-ButtonMode":"Update",
							"modifyAudible-ReadOrderNumber":resultitem.ReadOrderNumber,
							"modifyAudible-ReadOrder":resultitem.ReadOrder,
							"modifyAudible-Notes":resultitem.Notes,
						};
						$pageSection.append(Mustache.render($templateHTML, dataMustache));
					}else {
						//alert("Return from AJAX getAudibleRowData php call. Failed! \n resultitem.info -- " + resultitem.info);
						var dataMustache = {
							"modifyAudible-ID":"0",
							"modifyAudible-Title":$("#import-Title").val(),
							"modifyAudible-Author":$("#import-Author").val(),
							"modifyAudible-Series":"",
							"modifyAudible-BookNumber":"",
							"modifyAudible-Button":"insertAudibleTable(this)",
							"modifyAudible-ButtonMode":"Insert",
							"modifyAudible-ReadOrderNumber":"",
							"modifyAudible-ReadOrder":"",
							"modifyAudible-Notes":"",
						};
						$pageSection.append(Mustache.render($templateHTML, dataMustache));
					}
				});
		},
		error: function() {
			alert('In fetchAudibleResults(). Error with getting row data from AudibleBooks.php.');
		}
	});
} 

function fetchImportResults(rowID) {		// Fills the main Table <div> #maintablebody
	var $pageSection = $('#inputSpace');
	var $templateHTML = $('#bodyImportCSVtemplate').html();
	
	var sqlObject = {
		"select":"SELECT * ",
		"from":"FROM `AudibleWeb` ",
		"where":"WHERE `ID` = " + rowID,
		"order":"",
		"limits":""
	}
	
	//	alert("SQL string before call -- \n " + select + "\n" + from + "\n" +
	//		 where + "\n" + order + "\n" + limits);
	
	var postData = {
		"functionCall":"getImportRowData",
		"fieldName":sqlObject,
		"searchkey":""
	};
	var dataString = JSON.stringify(postData);
	$.ajax({
		url:'ImportAudibleCSV.php',
		type:'POST',
		data: {postOBJ: dataString},
		success:function(returnData) {
			//console.log("returnData fetchTableResults -- " + returnData);
			//alert("In fetchTableResults returnData length -- " + returnData.length);
			$pageSection.empty();
			$.each(returnData, function(i, resultitem){
				$("#importHeaderID").text('Import Table Row ID: ' + resultitem.ID);
				$("#importHeaderID").attr('data-id', resultitem.ID);
				var dataMustache = {
					"tableRow-ID":resultitem.ID,
					"tableRow-Title":resultitem.Title,
					"tableRow-Author":resultitem.Author,
					"tableRow-Length":resultitem.Length,
					"tableRow-strDateAdded":resultitem.strDateAdded,
					"tableRow-DateAdded":resultitem.DateAdded,
		  
				};
				$pageSection.append(Mustache.render($templateHTML, dataMustache));
			});
		},
		error: function() {
			alert('In fetchImportResults(). Error with getting row data from ImportAudibleCSV.php.');
		}
	});
} 

$(document).ready(function(){	//Code to run when page finishes loading
	fillTemplateSpace("titleSpace", "headerImportCSVtemplate", "");
	fetchImportResults(2);
	fillTemplateSpace("footerSpace", "footerImportCSVtemplate", "");
	
	$("#button-Finished").on('click',function(){	//When "update" icon in row is clicked
		//var element = event.target;
		//var idClickedItem = element.id;
		//alert("Button 'Finished' has been clicked -- " + idClickedItem);
		window.close();
	});

	$("#button-Previous").on('click',function(){	//When "update" icon in row is clicked
		//var element = event.target;
		//var idClickedItem = element.id;
		//alert("Button 'Finished' has been clicked -- " + idClickedItem);
		gotoPreviousRow();
	});

	$("#button-Next").on('click',function(){	//When "update" icon in row is clicked
		//var element = event.target;
		//var idClickedItem = element.id;
		//alert("Button 'Finished' has been clicked -- " + idClickedItem);
		gotoNextRow();
	});

	$("#button-gotoRowID").on('click',function(){	//When "update" icon in row is clicked
		//var element = event.target;
		//var idClickedItem = element.id;
		//alert("Button 'Finished' has been clicked -- " + idClickedItem);
		gotoRowID();
	});
	
});
