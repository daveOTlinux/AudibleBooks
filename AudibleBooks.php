<?php

	// Include config file
	//require_once 'config.php';

	global $count, $returnStatus;

	// Functions ************************************************
	
	function deleteTableRowByID($rowID) {
		// Include config file
		require_once 'config.php';

		$delete = "DELETE FROM `AudibleBooks` ";
		$where = "WHERE `ID` = " . $rowID;

		$strSQL = $delete . $where;
				
		//echo $strSQL;	//uncomment to see SQL string at start of "Network" return in chrome Developer Tools

		$returnStatus = array(array());

		if($mysqli->query($strSQL) === TRUE) {
			$returnStatus[0]["status"] = "Success";
			$returnStatus[0]["info"] = "Record deleted successfully";
		} else {
			$returnStatus[0]["status"] = "FAILED";
			$returnStatus[0]["info"] = "Error deleting record: " . $mysqli->error;
		}

		return $returnStatus;
	}

	function getAllFieldsByID($rowID) {
		// Include config file
		require_once 'config.php';
		
		// Prepare a select statement
		$strSQL = "SELECT * FROM AudibleBooks WHERE ID = " . $rowID;

		//echo $strSQL;	//uncomment to see SQL string at start of "Network" return in chrome Developer Tools

		$result = $mysqli->query($strSQL);

		$returnStatus = array(array());


		if($result->num_rows == 0) { // so if we have 0 records acc. to keyword display no records found
			$returnStatus[0]["status"] = "FAILED";
			$returnStatus[0]["info"] = "Error getDISTINCTSearchTerms() - " . $mysqli->error;
		}
		else {
			// Get results of query
			$count = 0;
			while($row = $result->fetch_assoc()) {  //outputs the records
				$returnStatus[$count]["ID"] = $row["ID"];
				$returnStatus[$count]["Title"] = $row["Title"];
				$returnStatus[$count]["Author"] = $row["Author"];
				$returnStatus[$count]["Series"] = $row["Series"];
				$returnStatus[$count]["BookNumber"] = $row["BookNumber"];
				$returnStatus[$count]["ReadOrderNumber"] = $row["ReadOrderNumber"];
				$returnStatus[$count]["ReadOrder"] = $row["ReadOrder"];
				$returnStatus[$count]["Length"] = $row["Length"];
				$returnStatus[$count]["Categories"] = $row["Categories"];
				$returnStatus[$count]["Status"] = $row["Status"];
				$returnStatus[$count]["ListenedTo"] = $row["ListenedTo"];
				$returnStatus[$count]["DateAdded"] = $row["DateAdded"];
				$returnStatus[$count]["MyRating"] = $row["MyRating"];
				$returnStatus[$count]["CoverArt"] = $row["CoverArt"];
				$returnStatus[$count]["Notes"] = $row["Notes"];
				$returnStatus[$count]["ModifiedDate"] = $row["ModifiedDate"];
				$count++;
			}
		}
		$result->close();
		$mysqli->close();
		return $returnStatus;
	}

	function getCountTableRows($sqlQuery) {
		require_once 'config.php';

		$select = "SELECT Count(*) AS Count ";
		$from = $sqlQuery['from'];
		$where = $sqlQuery['where'];
		
		$strSQL = $select . $from . $where;
		
		//echo $strSQL;	//uncomment to see SQL string at start of "Network" return in chrome Developer Tools
		
		$result = $mysqli->query($strSQL);

		$returnStatus = array(array());

		if($result->num_rows == 0) { // so if we have 0 records acc. to keyword display no records found
			$returnStatus[0]["status"] = "FAILED";
			$returnStatus[0]["info"] = "Error getTableRowData() - " . $mysqli->error;
		}
		else {
			// Get results of query
			$count = 0;
			while($row = $result->fetch_assoc()) {  //outputs the records
				$returnStatus[$count]["status"] = "Success";
				$returnStatus[$count]["Count"] = $row['Count'];
				$count++;
			}
		}	
		$result->close();
		$mysqli->close();
		return $returnStatus;
	}

	function getDISTINCTSearchTerms($fieldName, $searchKey) {
 		require_once 'config.php';

		$select = "SELECT DISTINCT `" . $fieldName . "` AS field1 ";
		$from = "FROM `AudibleBooks` ";
		$where = "WHERE `" . $fieldName . "` LIKE '" . $searchKey . "' ";
		$orderby = "ORDER BY `" . $fieldName . "` ASC ";
		$limit = "LIMIT 0, 10";

		$strSQL = $select . $from . $where . $orderby . $limit;

		//echo $strSQL;	//uncomment to see SQL string at start of "Network" return in chrome Developer Tools

		$result = $mysqli->query($strSQL);

		$returnStatus = array(array());

		if($result->num_rows == 0) { // so if we have 0 records acc. to keyword display no records found
			$returnStatus[0]["status"] = "FAILED";
			$returnStatus[0]["info"] = "Error getDISTINCTSearchTerms() - " . $mysqli->error;
		}else {
			// Get results of query
			$count = 0;
			while($row = $result->fetch_assoc()) {  //outputs the records
				$returnStatus[$count]["status"] = "Success";
				$returnStatus[$count]["numrows"] = $result->num_rows;
				$returnStatus[$count]["id"] = strval($count);
				$returnStatus[$count]["field1"] = $row['field1'];
				$count++;
			}
		}
		$result->close();
		$mysqli->close();
		return $returnStatus;
	}
	
	function getLatestModifiedRowID() {
		// Include config file
		require_once 'config.php';

		$strSQL = "SELECT `ID` FROM `AudibleBooks` ORDER BY `ModifiedDate` DESC LIMIT 1";
				
		//echo $strSQL;	//uncomment to see SQL string at start of "Network" return in chrome Developer Tools

		$result = $mysqli->query($strSQL);

		$returnStatus = array(array());

		if($result->num_rows == 0) { // so if we have 0 records acc. to keyword display no records found
			$returnStatus[0]["status"] = "FAILED";
			$returnStatus[0]["info"] = "Error getLatestModifiedRowID() - " . $mysqli->error;
		} else {
			// Get results of query
			$count = 0;
			while($row = $result->fetch_assoc()) {  //outputs the records
				$returnStatus[$count]["status"] = "Success";
				$returnStatus[$count]["ID"] = $row['ID'];
				$count++;
			}
		}
		$result->close();
		$mysqli->close();
		return $returnStatus;
	}
	
	function getTableRowData($sqlQuery){
		require_once 'config.php';

		$select = $sqlQuery['select'];
		$from = $sqlQuery['from'];
		$where = $sqlQuery['where'];
		$order = $sqlQuery['order'];
		$limits = $sqlQuery['limits'];
	
		$strSQL = $select . $from . $where . $order . $limits;

		//echo $strSQL;	//uncomment to see SQL string at start of "Network" return in chrome Developer Tools
		
		$result = $mysqli->query($strSQL);

		$returnStatus = array(array());

		if($result->num_rows == 0) { // so if we have 0 records acc. to keyword display no records found
			$returnStatus[0]["status"] = "FAILED";
			$returnStatus[0]["info"] = "Error getTableRowData() - " . $mysqli->error;
		} else {
			// Get results of query
			$count = 0;
			while($row = $result->fetch_assoc()) {  //outputs the records
				$returnStatus[$count]["status"] = "Success";
				$returnStatus[$count]["ID"] = $row['ID'];
				$returnStatus[$count]["Title"] = $row['Title'];
				$returnStatus[$count]["Author"] = $row['Author'];
				$returnStatus[$count]["Title"] = $row['Title'];
				$returnStatus[$count]["Series"] = $row['Series'];
				$count++;
			}
		}
		$result->close();
		$mysqli->close();
		return $returnStatus;
	}

	//function pass SQL INSERT part in $sqlInsert
	// return success or fail
	function insertNewRowTable($sqlInsert) {
		// Include config file
		require_once 'config.php';

		$insert = "INSERT INTO `AudibleBooks`";

		$strSQL = $insert . $sqlInsert;

		//echo $strSQL;	//uncomment to see SQL string at start of "Network" return in chrome Developer Tools

		$returnStatus = array(array());

		if($mysqli->query($strSQL) === TRUE) {
			$returnStatus[0]["status"] = "Success";
			$returnStatus[0]["info"] = "Inserted Record successfully";
		} else {
			$returnStatus[0]["status"] = "FAILED";
			$returnStatus[0]["info"] = "Error Inserting record: " . $mysqli->error;
		}

		return $returnStatus;
	}

	//function pass SQL SET part in $sqlSET, and the required row in $rowID
	// return success or fail
	function updateTableByID($sqlSET, $rowID) {
		// Include config file
		require_once 'config.php';
		
		$update = "UPDATE `AudibleBooks` ";
		$where = "WHERE `ID` = " . $rowID;

		$strSQL = $update . $sqlSET . $where;
				
		//echo $strSQL;	//uncomment to see SQL string at start of "Network" return in chrome Developer Tools

		$returnStatus = array(array());

		if($mysqli->query($strSQL) === TRUE) {
			$returnStatus[0]["status"] = "Success";
			$returnStatus[0]["info"] = "Record updated successfully";
		} else {
			$returnStatus[0]["status"] = "FAILED";
			$returnStatus[0]["info"] = "Error updating record: " . $mysqli->error;
		}

		return $returnStatus;
	}


//======================================================================================

	//if($_POST['keyword'] && !empty($_POST['keyword'])){
	if($_POST['postOBJ'] && !empty($_POST['postOBJ'])){

		$postOBJ = json_decode($_POST['postOBJ'], TRUE);
		
		$functionCall = $postOBJ["functionCall"];
		$fieldName = $postOBJ["fieldName"];
		$searchKey = $postOBJ["searchkey"];

		switch($functionCall) {
			case "deleteTableRowByID":
				$itemID = (int) filter_var($searchKey, FILTER_SANITIZE_NUMBER_INT);
				$returnStatus = deleteTableRowByID($itemID);
				break;
			case "getAllFieldsByID":
				$itemID = (int) filter_var($searchKey, FILTER_SANITIZE_NUMBER_INT);
				$returnStatus = getAllFieldsByID($itemID);
				break;
			case "getCountTableRows":
				$returnStatus = getCountTableRows($fieldName);
				break;
			case "getDISTINCTSearchTerms":
				$returnStatus = getDISTINCTSearchTerms($fieldName, $searchKey);
				break;
			case "getLatestModifiedRowID":
				$returnStatus = getLatestModifiedRowID();
				break;
			case "getTableRowData":
				$returnStatus = getTableRowData($fieldName);
				break;
			case "insertNewRowTable":
				$returnStatus = insertNewRowTable($fieldName);
				break;
			case "updateTableByID":
				$itemID = (int) filter_var($searchKey, FILTER_SANITIZE_NUMBER_INT);
				$returnStatus = updateTableByID($fieldName, $itemID);
				break;
		}

		//header('Content-type: application/json');
		//echo json_encode($returnStatus);	         
	} else {
		$returnStatus[0]["status"] = "FAILED";
		$returnStatus[0]["info"] = "No POST data.";
		//header('Content-type: application/json');		
		//echo json_encode($returnStatus);		
	}
	header('Content-type: application/json');		
	echo json_encode($returnStatus);		

?>
