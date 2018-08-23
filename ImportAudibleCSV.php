<?php

	// Include config file
	//require_once 'config.php';

	global $count, $returnStatus;
	//Functions

		//function pass SQL SET part in $sqlSET, and the required row in $rowID
	// return success or fail
	function updateImportRowDoneByID($sqlSET, $rowID) {
		// Include config file
	    require_once 'config.php';
    
		$update = "UPDATE `AudibleWeb` ";
		$where = "WHERE `ID` = " . $rowID;

		$strSQL = $update . $sqlSET . $where;
				
		//echo $strSQL;	//uncomment to see SQL string at start of "Network" return in chrome Developer Tools

	    $returnStatus = array(array());

		if($mysqli->query($strSQL) === TRUE) {
			$returnStatus[0]["status"] = "Success";
			$returnStatus[0]["info"] = "Record updated successfully";				
		} else {
			$returnStatus[0]["status"] = "FAILED";
			$returnStatus[0]["info"] = "In updateImportRowDoneByID() Error updating record: " . $mysqli->error;
		}

		return $returnStatus;
}

	
	function getImportRowData($sqlQuery){
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
			$returnStatus[0]["info"] = "Error getImportRowData() - " . $mysqli->error;
	
	    }
	    else {
	         // Get results of query
	         $count = 0;
	         while($row = $result->fetch_assoc()) {  //outputs the records
				$returnStatus[$count]["status"] = "Success";
				$returnStatus[$count]["ID"] = $row['ID'];;
				$returnStatus[$count]["Title"] = $row['Title'];
				$returnStatus[$count]["Author"] = $row['Author'];
				$returnStatus[$count]["Title"] = $row['Title'];
				$returnStatus[$count]["Length"] = $row['Length'];
				$returnStatus[$count]["strDateAdded"] = $row['strDateAdded'];
				$returnStatus[$count]["DateAdded"] = $row['DateAdded'];
				$returnStatus[$count]["RowDone"] = $row['RowDone'];
				$count++;
	         }
	    };	
		$result->close();
		$mysqli->close();
		return $returnStatus;
	}

	function getAudibleRowData($sqlQuery){
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
			$returnStatus[0]["info"] = "Error getAudibleRowData() - " . $mysqli->error;
	
	    }
	    else {
	         // Get results of query
	         $count = 0;
	         while($row = $result->fetch_assoc()) {  //outputs the records
				$returnStatus[$count]["status"] = "Success";
				$returnStatus[$count]["ID"] = $row['ID'];;
				$returnStatus[$count]["Title"] = $row['Title'];
				$returnStatus[$count]["Author"] = $row['Author'];
				$returnStatus[$count]["Title"] = $row['Title'];
				$returnStatus[$count]["Series"] = $row['Series'];
				$returnStatus[$count]["BookNumber"] = $row['BookNumber'];
				$returnStatus[$count]["ReadOrderNumber"] = $row['ReadOrderNumber'];
				$returnStatus[$count]["ReadOrder"] = $row['ReadOrder'];
				$returnStatus[$count]["Notes"] = $row['Notes'];
				$count++;
	         }
	    };	
		$result->close();
		$mysqli->close();
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
			case "getImportRowData":
				$returnStatus = getImportRowData($fieldName);
				break;
			case "getAudibleRowData":
				$returnStatus = getAudibleRowData($fieldName);
				break;
			case "updateImportRowDoneByID":
				$itemID = (int) filter_var($searchKey, FILTER_SANITIZE_NUMBER_INT);
				$returnStatus = updateImportRowDoneByID($fieldName, $itemID);
				break;
	    }
	    
	} else {
		$returnStatus[0]["status"] = "FAILED";
		$returnStatus[0]["info"] = "No POST data.";
	};
	header('Content-type: application/json');		
	echo json_encode($returnStatus);		
	
?>



