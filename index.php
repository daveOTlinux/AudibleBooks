<?php
	// Start the session  NOTE Must be at top of file before any HTML
	session_start();
/*	
	//Check if $_SESSION["sortfieldSet"] exists.
	if(!isset($_SESSION["sortfieldSet"]) && empty(trim($_SESSION["sortfieldSet"]))){
		$_SESSION["sortfieldSet"] = FALSE;
	}

	//Check if $_SESSION["searchWHEREset"] exists.
	if(!isset($_SESSION["searchWHEREset"]) && empty(trim($_SESSION["searchWHEREset"]))){
		$_SESSION["searchWHEREset"] = FALSE;
	}
	
	//Check if $_SESSION["mainSQLset"] exists.
	if(!isset($_SESSION["mainSQLset"]) && empty(trim($_SESSION["mainSQLset"]))){
		$_SESSION["mainSQLset"] = FALSE;
	}

*/

?>

<!DOCTYPE html>
<html lang="en">
<head>
	<title>Audible Books Dashboard</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<script
		src="https://code.jquery.com/jquery-3.3.1.min.js"
		integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
		crossorigin="anonymous"></script>
	<link
		rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css"
		integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB"
		crossorigin="anonymous">
  	<script
  		src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"
  		integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49"
  		crossorigin="anonymous"></script>
	<script
		src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"
		integrity="sha384-smHYKdLADwkXOn1EmN1qk/HfnUcbVRZyYmZ4qpPea6sjB/pTJ0euyQp0Mk8ck+5T"
		crossorigin="anonymous"></script>
	<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">

	<link href="style.css" rel="stylesheet">
		
	<script src="index.js"></script>

	<style type="text/css">
<!--	    .wrapper{
	        width: 700px;
	        margin: 0 auto;
	    }
	    .page-header h2{
	        margin-top: 0;
	    } -->
	    table tr td:last-child a{
	        margin-right: 15px;
	        white-space: pre;
	    }
	</style>    

</head>
<body>
    <div class="wrapper">
        <div class="container-fluid">
			<div class="row" style="height: 75px;">
				<div class="pt-2 col-sm-6">
					<div class="page-header clearfix">
						<h2 class="pull-left">Audible Books</h2>
					</div>
				</div>
				<div class="pt-2 col-sm-6">  		
					<a href="create.php" class="btn btn-success pull-right">Add New Audible Book</a>
				</div>
			</div>
			<div class="row" style="height: 50px;">    
				<div class="col-sm-4">
					<div id='sortbydiv' class='dropdown'>
				        <a id='sortby' data-target'#' data-toggle='dropdown' class='dropdown-toggle'>Sort by Last Edit <b class='caret'></b></a>
						<ul id='sortDropdown' class='dropdown-menu'></ul>
					</div>
				</div>
				<div class="col-sm-4">
					<div id='filterbydiv' class='dropdown'>
				        <a id='filterby' data-target'#' data-toggle='dropdown' class='dropdown-toggle'>Filter by Nothing<b class='caret'></b></a>
						<ul id='filterDropdown' class='dropdown-menu'></ul>
					</div>
				</div>
				<div class="col-sm-4">
				
				</div>
			</div>

			<div id='maintable-wrapper'>
				<div class='row'id='maintable'>
					<table class='table table-bordered table-hover'>
						<thead>
							<tr>
								<th style='width: 8%'>ID</th>
								<th style='width: 40%'>Title</th>
								<th style='width: 20%'>Author</th>
								<th style='width: 20%'>Series</th>
								<th style='width: 22%'>Action</th>
							</tr>
						</thead>
						<tbody id='maintablebody'>

						</tbody>
					</table>


				</div>
			</div>


		</div>        
    </div>
</body>
</html>						
