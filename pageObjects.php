<?php

	global $count, $returnStatus;

	//Functions

	//function pass SQL VALUES part in $sqlSET
	// return success or fail
	function appendPageObjectRow($sqlSET) {
		// Include config file
		require_once 'config.php';
    
		$update = "INSERT INTO `pageObjects`(`SearchTerm`, `orderItems`, `itemDisplay`, `itemSQL`, `ModifiedDate`) ";

		$strSQL = $update . $sqlSET;

		//echo $strSQL;	//uncomment to see SQL string at start of "Network" return in chrome Developer Tools

		$returnStatus = array(array());

		if($mysqli->query($strSQL) === TRUE) {
			$returnStatus[0]["status"] = "Success";
			$returnStatus[0]["info"] = "Record Appended successfully";
		} else {
			$returnStatus[0]["status"] = "FAILED";
			$returnStatus[0]["info"] = "Error appending record: " . $mysqli->error;
		}

		return $returnStatus;	
	}

	//function pass ID of row in $whereID
	// return success or fail
	function deletePageObjectbyID($whereID) {
		// Include config file
		require_once 'config.php';
    
		$delete = "DELETE FROM `pageObjects` WHERE `ID` = ";

		$strSQL = $delete . $whereID;

		//echo $strSQL;	//uncomment to see SQL string at start of "Network" return in chrome Developer Tools

		$returnStatus = array(array());

		if($mysqli->query($strSQL) === TRUE) {
			$returnStatus[0]["status"] = "Success";
			$returnStatus[0]["info"] = "Record Deleted successfully";
		} else {
			$returnStatus[0]["status"] = "FAILED";
			$returnStatus[0]["info"] = "Error deleteing record: " . $mysqli->error;
		}

		return $returnStatus;	
	}


	// return fieldDATA contains the rows of data from a SELECT DISTINCT `SearchTerm` search
	function getDISTINCTSearchTerms($fieldName) {
		// Include config file
		require_once 'config.php';
    
		$select = "SELECT DISTINCT `" . $fieldName . "` ";
		$from = "FROM `pageObjects` ";
		$where = "";
		$orderby = "ORDER BY `" . $fieldName . "` ";
		$limit = "LIMIT 0, 10";

		$strSQL = $select . $from . $where . $orderby . $limit;

		//echo $strSQL;	//uncomment to see SQL string at start of "Network" return in chrome Developer Tools

		$result = $mysqli->query($strSQL);

		$returnStatus = array(array());

		if($result->num_rows == 0) { // so if we have 0 records acc. to keyword display no records found
			$returnStatus[0]["status"] = "FAILED";
			$returnStatus[0]["info"] = "Error getDISTINCTSearchTerms() - " . $mysqli->error;
		} else {
			// Get results of query
			$count = 0;
			while($row = $result->fetch_assoc()) {  //outputs the records
				$returnStatus[$count]["id"] = $count;
				$returnStatus[$count]["SearchTerm"] = $row['SearchTerm'];
				$count++;
			}
		}
		$result->close();
		$mysqli->close();
		return $returnStatus;
	}

	function getIDbyItemDisplay($itemDisplay) {
		// Include config file
		require_once 'config.php';
    
		$select = "SELECT `ID` ";
		$from = "FROM `pageObjects` ";
		$where = "WHERE `itemDisplay` = '" . $itemDisplay ."'";

		$strSQL = $select . $from . $where;

		echo $strSQL;	//uncomment to see SQL string at start of "Network" return in chrome Developer Tools

		$result = $mysqli->query($strSQL);

		$returnStatus = array(array());

		if($result->num_rows == 0) { // so if we have 0 records acc. to keyword display no records found
			$returnStatus[0]["status"] = "FAILED";
			$returnStatus[0]["info"] = "Error getIDbyItemDisplay() - " . $mysqli->error;
		} else {
			// Get results of query
			while($row = $result->fetch_assoc()) {  //outputs the records
				$returnStatus[0]["status"] = "Success";
				$returnStatus[0]["ID"] = $row['ID'];
			}
		}
		$result->close();
		$mysqli->close();
		return $returnStatus;

	}
	
	//function pass ID of pageObjects "numeric part of clicked itemID"
	// return returnStatus info contains the data from field itemSQL of the record given by ID
	function getitemSQLPageObjectByID($pageObjectID) {
		// Include config file
		require_once 'config.php';
    
		$select = "SELECT `ID`, `itemSQL` ";
		$from = "FROM `pageObjects` ";
		$where = "WHERE `ID` = " . $pageObjectID;

		$strSQL = $select . $from . $where;

		//echo $strSQL;	//uncomment to see SQL string at start of "Network" return in chrome Developer Tools

		$result = $mysqli->query($strSQL);

		$returnStatus = array(array());

		if($result->num_rows == 0) {	// so if we have 0 records acc. to keyword display no records found
			$returnStatus[0]["status"] = "FAILED";
			$returnStatus[0]["info"] = "Error getitemSQLPageObjectByID() - " . $mysqli->error;
		} else {
			// Get results of query
			while($row = $result->fetch_assoc()) {  //outputs the records
				$returnStatus[0]["status"] = "Success";
				$returnStatus[0]["info"] = $row['itemSQL'];
			}
		}
		$result->close();
		$mysqli->close();
		return $returnStatus;
	}

	//function pass ID of pageObjects "numeric part of clicked itemID"
	// return fieldDATA contains data from all the fields of the record given by ID
	function getPageObjectByID($pageObjectID) {
		// Include config file
		require_once 'config.php';
    
		$select = "SELECT * ";
		$from = "FROM `pageObjects` ";
		$where = "WHERE `ID` = " . $pageObjectID;

		$strSQL = $select . $from . $where;

		//echo $strSQL;	//uncomment to see SQL string at start of "Network" return in chrome Developer Tools

		$result = $mysqli->query($strSQL);

		$returnStatus = array(array());

		if($result->num_rows == 0) {	// so if we have 0 records acc. to keyword display no records found
			$returnStatus[0]["status"] = "FAILED";
			$returnStatus[0]["info"] = "Error getPageObjectByID() - " . $mysqli->error;
		} else {
			// Get results of query
			$count = 0;
			while($row = $result->fetch_assoc()) {  //outputs the records
				$returnStatus[$count]["ID"] = $row['ID'];
				$returnStatus[$count]["SearchTerm"] = $row['SearchTerm'];
				$returnStatus[$count]["orderItems"] = $row['orderItems'];
				$returnStatus[$count]["itemDisplay"] = $row['itemDisplay'];
				$returnStatus[$count]["itemSQL"] = $row['itemSQL'];
				$returnStatus[$count]["ModifiedDate"] = $row['ModifiedDate'];
				$count++;
			}
		}
		$result->close();
		$mysqli->close();
		return $returnStatus;
	}

	//function pass SearchTerm of pageObjects in $objectSearch and choice of fields returned in $sqlModes
	// return returnStatus contains the rows of data from search
	function getPageObjectsBySearch($objectSearch, $sqlModes) {
		// Include config file
		require_once 'config.php';
    
		$select = "SELECT * ";
		$from = "FROM `pageObjects` ";
		$where = "WHERE `SearchTerm` = '" . $objectSearch . "' ";

		switch($sqlModes) {
			case "Dropdowns":
				$select = "SELECT `ID`, `itemDisplay` ";
				break;
			case "*":
				$select = "SELECT * ";
				break;
			default:
				$where = $sqlCommand;
				break;
		}

		$orderby = "ORDER BY `orderItems` ASC";

		$strSQL = $select . $from . $where . $orderby;

		//echo $strSQL;	//uncomment to see SQL string at start of "Network" return in chrome Developer Tools

		$result = $mysqli->query($strSQL);

		$returnStatus = array(array());

		if($result->num_rows == 0) { // so if we have 0 records acc. to keyword display no records found
			$returnStatus[0]["status"] = "FAILED";
			$returnStatus[0]["info"] = "Error getpageObjectsBySearch() - " . $mysqli->error;
		} else {
			// Get results of query
			$count = 0;
			while($row = $result->fetch_assoc()) {  //outputs the records
				$returnStatus[$count]["status"] = "Success";
				$returnStatus[$count]["info"] = $result->num_rows;
				$returnStatus[$count]["ID"] = $row['ID'];
				$returnStatus[$count]["itemDisplay"] = $row['itemDisplay'];
				if(!($sqlModes == "Dropdowns")) {
					$returnStatus[$count]["SearchTerm"] = $row['SearchTerm'];
					$returnStatus[$count]["orderItems"] = $row['orderItems'];
					$returnStatus[$count]["itemSQL"] = $row['itemSQL'];
					$returnStatus[$count]["ModifiedDate"] = $row['ModifiedDate'];
				}
				$count++;
			}
		}
		$result->close();
		$mysqli->close();
		return $returnStatus;
	}

	//function pass SQL SET part in $sqlSET, and the required row in $rowID
	// return success or fail
	function updatePageObjectRow($sqlSET, $rowID) {
		// Include config file
		require_once 'config.php';
    
		$update = "UPDATE `pageObjects` ";
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




//******************************************************************	
	//if($_POST['keyword'] && !empty($_POST['keyword'])){
	if($_POST['postOBJ'] && !empty($_POST['postOBJ'])){
		$postOBJ = json_decode($_POST['postOBJ'], TRUE);
		$forObject = $postOBJ["forObject"];
		$sqlCommand = $postOBJ["sqlCommand"];		
		$fieldName = $postOBJ["fieldname"];
		$clickedData = $postOBJ["clickedData"];
		$pageObject = $postOBJ["pageObject"];

		switch ($forObject) {
			case "appendPageObject":
				$returnStatus = appendPageObjectRow($sqlCommand);
				break;
			case "deletePageObjectbyID":
				$itemID = (int) filter_var($clickedData, FILTER_SANITIZE_NUMBER_INT);
				$returnStatus = deletePageObjectbyID($itemID);
				break;
			case "Dropdowns":
				$returnStatus = getpageObjectsBySearch($pageObject, $forObject);
				break;
			case "pageObjectRow":
				$itemID = (int) filter_var($clickedData, FILTER_SANITIZE_NUMBER_INT);
				$returnStatus = getPageObjectByID($itemID);				
				break;
			case "getDISTINCTSearchTerms":
				$returnStatus = getDISTINCTSearchTerms($pageObject);
				break;
			case "getIDbyItemDisplay":
				$returnStatus = getIDbyItemDisplay($clickedData);
				break;
				case "getsqlItemByID":
				$itemID = (int) filter_var($clickedData, FILTER_SANITIZE_NUMBER_INT);
				$returnStatus = getitemSQLPageObjectByID($itemID);
				break;
			case "searchTermRows":
				$returnStatus = getPageObjectsBySearch($pageObject, $sqlCommand);
				break;
			case "updatePageObject":
				$returnStatus = updatePageObjectRow($sqlCommand, $clickedData);
				break;
		}

	} else {
		$returnStatus[0]["status"] = "FAILED";
		$returnStatus[0]["info"] = "No POST data.";
	}
	header('Content-type: application/json');
	echo json_encode($returnStatus);

?>