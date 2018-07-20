<?php
	// Start the session  NOTE Must be at top of file before any HTML
	//session_start();


	//Functions
		
	//function pass ID of pageObjects "numeric part of clicked itemID"
	// return returnStatus info contains the SQL command of the record given by ID
	function getPageObjectByID($pageObjectID) {
		// Include config file
	    require_once 'config.php';
		
		$select = "SELECT `ID`, `itemDisplay`, `itemSQL` ";
		$from = "FROM `pageObjects` ";
		$where = "WHERE `ID` = " . $pageObjectID;

		$strSQL = $select . $from . $where;
				
		echo $strSQL;
	    
	    $result = $mysqli->query($strSQL);

	    $returnStatus = array(array());

	    if($result->num_rows == 0) { // so if we have 0 records acc. to keyword display no records found
	        //echo '<div id="item">Ah snap...! No results found :/</div>';
	        //$itemSQL = "Ah snap...! No results found : in getPageObjectByID()";
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
	function getObjectsBySearch($objectSearch) {
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
	         global $count;
	         $count = 0;
	         while($row = $result->fetch_assoc()) {  //outputs the records
				//$itemSQL = $row['itemSQL'];
				$fieldDATA[$count]["ID"] = $row['ID'];
	         	$fieldDATA[$count]["itemDisplay"] = $row['itemDisplay'];
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
	
	//if($_POST['keyword'] && !empty($_POST['keyword'])){
	if($_POST['postOBJ'] && !empty($_POST['postOBJ'])){
		$postOBJ = json_decode($_POST['postOBJ'], TRUE);
		$forObject = $postOBJ["forObject"];
		$sqlCommand = $postOBJ["sqlCommand"];		
		$fieldName = $postOBJ["fieldname"];
		$clickedData = $postOBJ["clickedData"];
		$pageObject = $postOBJ["pageObject"];

		switch ($forObject) {
			case "searchbox":	//might not be used now??
				$strSQL = $sqlCommand . " `" . $fieldName . "` = '" . $clickedData ."' ";
				$_SESSION["mainWHERE"] = $strSQL;
				$_SESSION["searchWHEREset"] = TRUE;
				break;
			case "sortfield":
				//$returnStatus = array(array());
				$itemID = (int) filter_var($clickedData, FILTER_SANITIZE_NUMBER_INT);
				$returnStatus = getPageObjectByID($itemID);
				
				if($returnStatus[0]["status"] == "Success") {
				}
				echo json_encode($returnStatus);
				break;
			case "sortDropdown":
				//$count = 0;
				$returnStatus = getObjectsBySearch($pageObject);
				if($count > 1) {
					header('Content-type: application/json');
				}
				echo json_encode($returnStatus);
				break;
			case "filterDropdown":
				//$count = 0;
				$returnStatus = getObjectsBySearch($pageObject);
				if($count > 1) {
					header('Content-type: application/json');
				}
				echo json_encode($returnStatus);
				break;
			case "uitilityDropdown":
				//$count = 0;
				$returnStatus = getObjectsBySearch($pageObject);
				//if($count > 1) {
					header('Content-type: application/json');
				//}
				echo json_encode($returnStatus);
				break;
		}
	
		//echo json_encode($clickedData);

	} else {
		$returnStatus[0]["status"] = "FAILED";
		$returnStatus[0]["info"] = "No POST data.";
		//header('Content-type: application/json');	//required if more than 1 row to return!!
		echo json_encode($returnStatus);		
	}



	
?>