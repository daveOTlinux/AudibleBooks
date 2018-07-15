<?php
	// Start the session  NOTE Must be at top of file before any HTML
	session_start();
	
	//if($_POST['keyword'] && !empty($_POST['keyword'])){
	if($_POST['postOBJ'] && !empty($_POST['postOBJ'])){
		$postOBJ = json_decode($_POST['postOBJ'], TRUE);
		$forObject = $postOBJ["forObject"];
		$sqlCommand = $postOBJ["sqlCommand"];		
		$fieldName = $postOBJ["fieldname"];
		$clickedData = $postOBJ["clickedData"];

	}

	switch ($forObject) {
		case "searchbox":
			$strSQL = $sqlCommand . " `" . $fieldName . "` = '" . $clickedData ."' ";
			$_SESSION["mainWHERE"] = $strSQL;
			$_SESSION["searchWHEREset"] = TRUE;
			break;
	
	}

	echo json_encode($clickedData);

	
?>