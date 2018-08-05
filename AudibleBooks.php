<?php

	// Include config file
	require 'config.php';

	global $count;
	//Functions

	//function 
	function getDISTINCTSearchTerms($fieldName, $searchKey) {
    
		$select = "SELECT DISTINCT `" . $fieldName . "` AS field1 ";
		$from = "FROM `AudibleBooks` ";
		$where = "WHERE `" . $fieldName . "` LIKE '" . $searchkey . "' ";
		$orderby = "ORDER BY `" . $fieldName . "` ASC ";
		$limit = "LIMIT 0, 10";

		$strSQL = $select . $from . $where . $orderby . $limit;				

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
				$returnStatus[$count]["id"] = strval($count);
	         	$returnStatus[$count]["field1"] = $row['field1'];
	         	$count++;
	         }
		}
        $result->close();
        $mysqli->close();
		return $returnStatus;
	}
	
	function getTableRowData($fieldName){
		require 'config.php';

		$select = $fieldName['select'];
		$from = $fieldName['from'];
		$where = $fieldName['where'];
		$order = $fieldName['order'];
		$limits = $fieldName['limits'];
	
		$strSQL = $select . $from . $where . $order . $limits;

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
				$returnStatus[$count]["ID"] = $row['ID'];;
				$returnStatus[$count]["Title"] = $row['Title'];
				$returnStatus[$count]["Author"] = $row['Author'];
				$returnStatus[$count]["Title"] = $row['Title'];
				$returnStatus[$count]["Series"] = $row['Series'];
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
			case "getDISTINCTSearchTerms":
				$returnStatus = getDISTINCTSearchTerms($fieldName, $searchKey);
			case "getTableRowData":
				$returnStatus = getTableRowData($fieldName);

	    }
	    
		header('Content-type: application/json');
		echo json_encode($returnStatus);	         
	} else {
		$returnStatus[0]["status"] = "FAILED";
		$returnStatus[0]["info"] = "No POST data.";
		header('Content-type: application/json');		
		echo json_encode($returnStatus);		
	};
	
?>
