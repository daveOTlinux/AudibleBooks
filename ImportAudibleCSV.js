
function getImportRowbyID() {
	$('#dialogBoxStatus').modal('hide');
	var dialogRowID = parseInt($('#dialogInput-modal').val());
	alert("In getImportRowbyID() \n dialogRowID value and type -- " + dialogRowID + " and -- " + typeof(dialogRowID));
	fetchImportResults(dialogRowID);
	
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

function searchNoRowsFound() {
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

function fetchAudibleResults() {		// Fills the main Table <div> #maintablebody
	var inputAuthorSearch = $("#inputAuthorSearch").val();
	var $pageSection = $('#audibleSpace');
	var $templateHTML = $('#bodyAudibletemplate').html();
	
	var sqlObject = {
		"select":"SELECT `ID`, `Title`, `Author`, `Series`, `BookNumber`, `ReadOrderNumber`, `ReadOrder`, `Notes` ",
		"from":"FROM `AudibleBooks` ",
		"where":"WHERE `Title` LIKE '%" + inputAuthorSearch + "%'",
		"order":"",
		"limits":""
	};
	
	//	alert("SQL string before call -- \n " + select + "\n" + from + "\n" +
	//		 where + "\n" + order + "\n" + limits);
	
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
							"modifyAudible-ReadOrderNumber":resultitem.ReadOrderNumber,
							"modifyAudible-ReadOrder":resultitem.ReadOrder,
							"modifyAudible-Notes":resultitem.Notes,
						};
						$pageSection.append(Mustache.render($templateHTML, dataMustache));
					}else {
						//alert("Return from AJAX getAudibleRowData php call. Failed! \n resultitem.info -- " + resultitem.info);
						searchNoRowsFound();
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
	fetchImportResults(2);
});
