<?php
	// Start the session  NOTE Must be at top of file before any HTML
	session_start();
	
    //if($_POST['keyword'] && !empty($_POST['keyword'])){
	if($_POST['strSQL'] && !empty($_POST['strSQL'])){
		// Include config file
	    require 'config.php';
	    
	    $strSQL = $_POST['strSQL'];
	    
	    $result = $mysqli->query($strSQL);
	    
	    if($result->num_rows == 0) { // so if we have 0 records acc. to keyword display no records found
	        echo '<div id="item">Ah snap...! No results found :/</div>';
	        $result->close();
	        $mysqli->close();
	
	    }
	    else {
				echo "<ul class='shownames'>";            
	         // Get results of query
	         $count = 0;
	         while($row = $result->fetch_assoc()) {  //outputs the records
	         	$count++;
	         	$Author = $row["Author"];
				echo "<div class='showitem' id='item" . $count . "' onclick='location.href=`read.php?ID=$ID`'> $Author </div>";					
	         }
				echo '</ul>';            
	        $result->close();
	        $mysqli->close();
	    }; 
	};
?>
