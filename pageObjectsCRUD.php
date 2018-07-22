<?php

	//Functions
	
	//function pass SearchTerm of pageObjects in $objectSearch
	// return returnStatus contains the rows of data from search
	function getDISTINCTSearchTerms() {
		// Include config file
	    require_once 'config.php';

//SELECT DISTINCT `SearchTerm` FROM `pageObjects` ORDER BY `SearchTerm` LIMIT 0, 10
    
		$select = "SELECT DISTINCT `SearchTerm` ";
		$from = "FROM `pageObjects` ";
		$where = "";
		$orderby = "ORDER BY `SearchTerm` ";
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

	function getObjectsBySearch($objectSearch) {
		// Include config file
	    require_once 'config.php';
    
		$select = "SELECT * ";
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

?>