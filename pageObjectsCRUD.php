<?php

	global $count;
	//Functions
	
	// return fieldDATA contains the rows of data from a SELECT DISTINCT `SearchTerm` search
	function getDISTINCTSearchTerms($fieldName) {
		// Include config file
	    require_once 'config.php';

//SELECT DISTINCT `SearchTerm` FROM `pageObjects` ORDER BY `SearchTerm` LIMIT 0, 10
    
		$select = "SELECT DISTINCT `" . $fieldName . "` ";
		$from = "FROM `pageObjects` ";
		$where = "";
		$orderby = "ORDER BY `" . $fieldName . "` ";
		$limit = "LIMIT 0, 10";

		$strSQL = $select . $from . $where . $orderby . $limit;				
		//echo $strSQL;

	    $result = $mysqli->query($strSQL);

	    $fieldDATA = array(array());

	    if($result->num_rows == 0) { // so if we have 0 records acc. to keyword display no records found
	        //echo '<div id="item">Ah snap...! No results found :/</div>';
	        //$itemSQL = "Ah snap...! No results found : in getPageObjectByID()";
	        $fieldDATA[0]["status"] = "FAILED";
			$fieldDATA[0]["info"] = "Ah snap...! No results found : in getObjectsBySearch()";
	    }
	    else {
	         // Get results of query
	         global $count;
	         $count = 0;
	         while($row = $result->fetch_assoc()) {  //outputs the records
				//$itemSQL = $row['itemSQL'];
				//$fieldDATA[$count]["status"] = "Success";
				$fieldDATA[$count]["ID"] = $count;
	         	$fieldDATA[$count]["SearchTerm"] = $row['SearchTerm'];
	         	$count++;
				//echo "IN getObjectsBySearch  ID -- " . $row[$ID] . " itemDisplay -- " . $row[$itemDisplay];

//		        $returnStatus[0]["status"] = "Success";
//				$returnStatus[0]["info"] = $row['itemSQL'];				
				//echo "<div > Success -- " . $itemSQL . " ID -- " . $pageObjectID . "</div>";	'"' . $itemSQL . '"'				
	         }
		}
        $result->close();
        $mysqli->close();
		return $fieldDATA;
	}

	//function pass ID of pageObjects "numeric part of clicked itemID"
	// return fieldDATA info contains the field data of the record given by ID
	function getPageObjectByID($pageObjectID) {
		// Include config file
	    require_once 'config.php';
    
		$select = "SELECT * ";
		$from = "FROM `pageObjects` ";
		$where = "WHERE `ID` = " . $pageObjectID;

		$strSQL = $select . $from . $where;
				
		//echo $strSQL;

	    $result = $mysqli->query($strSQL);

	    $fieldDATA = array(array());

	    if($result->num_rows == 0) {	// so if we have 0 records acc. to keyword display no records found
	        //echo '<div id="item">Ah snap...! No results found :/</div>';
	        $returnStatus[0]["status"] = "FAILED";
			$returnStatus[0]["info"] = "Ah snap...! No results found : in getPageObjectByID()";
	    }
	    else {
	         // Get results of query
	         $count = 0;
	         while($row = $result->fetch_assoc()) {  //outputs the records
				$fieldDATA[$count]["ID"] = $row['ID'];
				$fieldDATA[$count]["SearchTerm"] = $row['SearchTerm'];
				$fieldDATA[$count]["orderItems"] = $row['orderItems'];
	         	$fieldDATA[$count]["itemDisplay"] = $row['itemDisplay'];
				$fieldDATA[$count]["itemSQL"] = $row['itemSQL'];
				$fieldDATA[$count]["ModifiedDate"] = $row['ModifiedDate'];
	         	$count++;
	         }
		}
        $result->close();
        $mysqli->close();
		return $fieldDATA;
	}

	//function pass ID of pageObjects "numeric part of clicked itemID"
	// return returnStatus info contains the SQL command of the record given by ID
	function getitemSQLPageObjectByID($pageObjectID) {
		// Include config file
	    require_once 'config.php';
    
		$select = "SELECT `ID`, `itemDisplay`, `itemSQL` ";
		$from = "FROM `pageObjects` ";
		$where = "WHERE `ID` = " . $pageObjectID;

		$strSQL = $select . $from . $where;
				
		//echo $strSQL;
	    $result = $mysqli->query($strSQL);

	    $returnStatus = array(array());

	    if($result->num_rows == 0) {	// so if we have 0 records acc. to keyword display no records found
	        //echo '<div id="item">Ah snap...! No results found :/</div>';
	        $returnStatus[0]["status"] = "FAILED";
			$returnStatus[0]["info"] = "Ah snap...! No results found : in getPageObjectByID()";
	    }
	    else {
	         // Get results of query
	         while($row = $result->fetch_assoc()) {  //outputs the records
				//$itemSQL = $row['itemSQL'];
		        $returnStatus[0]["status"] = "Success";
				$returnStatus[0]["info"] = $row['itemSQL'];				
				//echo "<div > Success -- " . $itemSQL . " ID -- " . $pageObjectID . "</div>";	'"' . $itemSQL . '"'				
	         }
		}
        $result->close();
        $mysqli->close();
		return $returnStatus;
	}

	//function pass SearchTerm of pageObjects in $objectSearch
	// return returnStatus contains the rows of data from search
/*	function getObjectsBySearch($objectSearch) {
		// Include config file
	    require_once 'config.php';
    
		$select = "SELECT `ID`, `itemDisplay`, `itemSQL` ";
		$from = "FROM `pageObjects` ";
		$where = "WHERE `SearchTerm` = '" . $objectSearch . "' ";
		$orderby = "ORDER BY `orderItems` ASC";

		$strSQL = $select . $from . $where . $orderby;
				
		//echo $strSQL;
	    $result = $mysqli->query($strSQL);

	    $fieldDATA = array(array());

	    if($result->num_rows == 0) { // so if we have 0 records acc. to keyword display no records found
	        //echo '<div id="item">Ah snap...! No results found :/</div>';
	        //$itemSQL = "Ah snap...! No results found : in getPageObjectByID()";
	        $fieldDATA[0]["status"] = "FAILED";
			$fieldDATA[0]["info"] = "Ah snap...! No results found : in getObjectsBySearch()";
	    }
	    else {
	         // Get results of query
	         $count = 0;
	         while($row = $result->fetch_assoc()) {  //outputs the records
				//$itemSQL = $row['itemSQL'];
				$fieldDATA[$count]["ID"] = $row[ID];
	         	$fieldDATA[$count]["itemDisplay"] = $row[itemDisplay];
	         	$count++;
				//echo "IN getObjectsBySearch  ID -- " . $row[$ID] . " itemDisplay -- " . $row[$itemDisplay];

//		        $returnStatus[0]["status"] = "Success";
//				$returnStatus[0]["info"] = $row['itemSQL'];				
				//echo "<div > Success -- " . $itemSQL . " ID -- " . $pageObjectID . "</div>";	'"' . $itemSQL . '"'				
	         }
		}
        $result->close();
        $mysqli->close();
		return $fieldDATA;
	}	*/


	//function pass SearchTerm of pageObjects in $objectSearch
	// return returnStatus contains the rows of data from search
	function getObjectsBySearch($objectSearch, $sqlCommand) {
		// Include config file
	    require_once 'config.php';
    
		$select = "SELECT * ";
		$from = "FROM `pageObjects` ";
		if($sqlCommand == "") {
			$where = "WHERE `SearchTerm` = '" . $objectSearch . "' ";
		} else {
			$where = $sqlCommand;
		}
		$orderby = "ORDER BY `orderItems` ASC";

		$strSQL = $select . $from . $where . $orderby;
				
		//echo $strSQL;
		 
	    $result = $mysqli->query($strSQL);

	    $fieldDATA = array(array());

	    if($result->num_rows == 0) { // so if we have 0 records acc. to keyword display no records found
	        //echo '<div id="item">Ah snap...! No results found :/</div>';
	        //$itemSQL = "Ah snap...! No results found : in getPageObjectByID()";
	        $fieldDATA[0]["status"] = "FAILED";
			$fieldDATA[0]["info"] = "Ah snap...! No results found : in getObjectsBySearch()";
	    }
	    else {
	         // Get results of query
	         global $count;
	         $count = 0;
	         while($row = $result->fetch_assoc()) {  //outputs the records
				$fieldDATA[$count]["ID"] = $row['ID'];
				$fieldDATA[$count]["SearchTerm"] = $row['SearchTerm'];
				$fieldDATA[$count]["orderItems"] = $row['orderItems'];
	         	$fieldDATA[$count]["itemDisplay"] = $row['itemDisplay'];
				$fieldDATA[$count]["itemSQL"] = $row['itemSQL'];
				$fieldDATA[$count]["ModifiedDate"] = $row['ModifiedDate'];
	         	$count++;
	         }
		}
        $result->close();
        $mysqli->close();
		return $fieldDATA;
	}

	//function pass SQL SET part in $sqlSET, and the required row in $rowID
	// return success or fail
	function updatePageObjectrow($sqlSET, $rowID) {
		// Include config file
	    require_once 'config.php';
    
		$update = "UPDATE `pageObjects` ";
		$where = "WHERE `ID` = " . $rowID;

		$strSQL = $update . $sqlSET . $where;
				
		//echo $strSQL;

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
			case "searchbox":
				$strSQL = $sqlCommand . " `" . $fieldName . "` = '" . $clickedData ."' ";
				$_SESSION["mainWHERE"] = $strSQL;
				$_SESSION["searchWHEREset"] = TRUE;
				break;
			case "sortfield":
				//$returnStatus = array(array());
				$itemID = (int) filter_var($clickedData, FILTER_SANITIZE_NUMBER_INT);
				$returnStatus = getitemSQLPageObjectByID($itemID);
				
				if($returnStatus[0]["status"] == "Success") {
					//$_SESSION["mainORDERBY"] = "ORDER BY " . $returnStatus[0]["info"];					
					//$returnStatus[0]["status"] = $itemSQL;
					//$returnStatus[0]["info"] = "Failed getPageObjectByID() function";
					//header('Content-type: application/json');					
					//echo json_encode($returnStatus);
				}
				echo json_encode($returnStatus);
				break;

			case "pageObjectRow":
				//$returnStatus = array(array());
				$itemID = (int) filter_var($clickedData, FILTER_SANITIZE_NUMBER_INT);
				$returnStatus = getPageObjectByID($itemID);				
				//if($count > 1) {
					header('Content-type: application/json');
				//}
				echo json_encode($returnStatus);
				break;

			case "sortDropdown":
				$returnStatus = getObjectsBySearch($pageObject, $sqlCommand);
				header('Content-type: application/json');				
				echo json_encode($returnStatus);
				break;
			case "searchTermDropdown":
				$returnStatus = getDISTINCTSearchTerms($pageObject);
				//if($count > 1) {
					header('Content-type: application/json');
				//}
				echo json_encode($returnStatus);
				break;
			case "searchTermRows":
				$returnStatus = getObjectsBySearch($pageObject, $sqlCommand);
				//if($count > 1) {
					header('Content-type: application/json');
				//}
				echo json_encode($returnStatus);
				
				break;
			case "updatePageObject":
				$returnStatus = updatePageObjectrow($sqlCommand, $clickedData);

				header('Content-type: application/json');
				echo json_encode($returnStatus);
				break;

		}

		//echo json_encode($clickedData);

	} else {
		$returnStatus[0]["status"] = "FAILED";
		$returnStatus[0]["info"] = "No POST data.";
		//header('Content-type: application/json');		
		echo json_encode($returnStatus);		
	}




/*

	//if($_POST['keyword'] && !empty($_POST['keyword'])){
	if($_POST['postOBJ'] && !empty($_POST['postOBJ'])){
		$postOBJ = json_decode($_POST['postOBJ'], TRUE);
		$forObject = $postOBJ["forObject"];
		$sqlCommand = $postOBJ["sqlCommand"];		
		$fieldName = $postOBJ["fieldname"];
		$clickedData = $postOBJ["clickedData"];
		$pageObject = $postOBJ["pageObject"];

		switch ($forObject) {
			case "searchTermDropdown":
				$returnStatus = getDISTINCTSearchTerms();
				if($count > 1) {
					header('Content-type: application/json');
				}
				echo json_encode($returnStatus);
				break;
			case "searchTermRows":
				$returnStatus = getObjectsBySearch($pageObject);
				if($count > 1) {
					header('Content-type: application/json');
				}
				echo json_encode($returnStatus);
				
				break;
			
		}
		

	} else {
		$returnStatus[0]["status"] = "FAILED";
		$returnStatus[0]["info"] = "No POST data.";
		//header('Content-type: application/json');	//required if more than 1 row to return!!
		echo json_encode($returnStatus);		
	}
*/
?>