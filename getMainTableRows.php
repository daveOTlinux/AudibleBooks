<?php
	// Start the session  NOTE Must be at top of file before any HTML
	session_start();
	
    //if($_POST['keyword'] && !empty($_POST['keyword'])){
	if($_POST['postOBJ'] && !empty($_POST['postOBJ'])){
		// Include config file
	    require 'config.php';

		$postOBJ = json_decode($_POST['postOBJ'], TRUE);	    
		
		$select = $postOBJ["select"];
		$from = $postOBJ["from"];
		$where = $postOBJ["where"];
		$order = $postOBJ["order"];
		$limits = $postOBJ["limits"];
	    $searchkey = $postOBJ["searchkey"];
		
		$strSQL = $select . $from . $where . $order . $limits;
		
		//global $javascript; 
		//$javascript = $strSQL;
		//echo "The current SQL string --" . $strSQL;
		//echo json_encode($strSQL);		
		
	    $result = $mysqli->query($strSQL);
	    
	    if($result->num_rows == 0) { // so if we have 0 records acc. to keyword display no records found
	        echo '<div id="item">Ah snap...! No results found :/</div>';
	        $result->close();
	        $mysqli->close();
	
	    }
	    else {
			//echo "<ul class='shownames'>";            
	         // Get results of query
	         $count = 0;
	         $fieldDATA = array(array());
	         while($row = $result->fetch_assoc()) {  //outputs the records
				$fieldDATA[$count]["ID"] = $row['ID'];;
				$fieldDATA[$count]["Title"] = $row['Title'];
				$fieldDATA[$count]["Author"] = $row['Author'];
				$fieldDATA[$count]["Title"] = $row['Title'];
				$fieldDATA[$count]["Series"] = $row['Series'];
				$count++;
	         	
				//echo "<div class='showitem' id='item" . $count . "' onclick='location.href=`read.php?ID=$ID`'> $Author </div>";					
	         }
			if($count > 1) {
				header('Content-type: application/json');
			}
			echo json_encode($fieldDATA);	         
	        //echo var_dump($fieldDATA,true); 
	        //echo json_encode($fieldDATA);
			//echo '</ul>';            
	        $result->close();
	        $mysqli->close();
	    };
	};
?>
