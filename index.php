<?php
	// Start the session  NOTE Must be at top of file before any HTML
	session_start();
	
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
	    .wrapper{
	        width: 700px;
	        margin: 0 auto;
	    }
	    .page-header h2{
	        margin-top: 0;
	    }
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
						<div class='dropdown'>
<!--					        <a id='sortby' data-target'#' href='index.php' data-toggle='dropdown' class='dropdown-toggle'>Sort by Last Edit <b class='caret'></b></a>-->
					        <a id='sortby' data-target'#' data-toggle='dropdown' class='dropdown-toggle'>Sort by Last Edit <b class='caret'></b></a>
				        	<?php
								// Include config file
								require_once 'config.php';
								  
								// Attempt select query execution
								$sql = "SELECT `ID`, `itemDisplay`, `itemSQL` ".
									"FROM `pageObjects` ".
									"WHERE `SearchTerm` = 'sortOrder00' ".
									"ORDER BY `orderItems` ASC";
								if($result = $mysqli->query($sql)){
									if($result->num_rows > 0){
										echo "<ul id='sortDropdown' class='dropdown-menu'>";
										while($row = $result->fetch_array()){
//											echo "<li id='sortItem". $row['ID'] . "'  class='showitem'><a id='sortItem". $row['ID'] . "' href='index.php?sortfield=" . $row['itemSQL'] . "'>" . $row['itemDisplay'] . "</a></li>";
											echo "<li id='sortItem". $row['ID'] . "' class='showitem'>" . $row['itemDisplay'] . "</li>";

										}
									echo "</ul>";
									}
								}
							?>						
						</div>					        					    
					</div>
					<div class="col-sm-4">
						<div class='dropdown'>
					        <a id='filterby' data-target'#' href='index.php' data-toggle='dropdown' class='dropdown-toggle'>Filter by Nothing<b class='caret'></b></a>
				        	<?php
								// Include config file
								require_once 'config.php';
								  
								// Attempt select query execution
								$sql = "SELECT `ID`, `itemDisplay`, `itemSQL` ".
									"FROM `pageObjects` ".
									"WHERE `SearchTerm` = 'filterBy00' ".
									"ORDER BY `orderItems` ASC";
								if($result = $mysqli->query($sql)){
									if($result->num_rows > 0){
										echo "<ul id='filterDropdown' class='dropdown-menu'>";
										while($row = $result->fetch_array()){
//											echo "<li class='showitem'><a id='filterItem". $row['ID'] . "' href='index.php?filterfield=" . $row['itemSQL'] . "'>" . $row['itemDisplay'] . "</a></li>";
											echo "<li id='filterItem". $row['ID'] . "' class='showitem'>" . $row['itemDisplay'] . "</li>";
										}
									echo "</ul>";
									}
								}
							?>						
						</div>					        					    
					</div>
					<div class="col-sm-4" id="content">
						<input type="search" name="keyword" placeholder="Search Names" id="searchbox">
						<div id='results'>
							<!--<a href="post-location">Fetched Item</a>-->
							<ul class='list-unstyled' id='resultlist'></ul>
						</div>
					</div>
			</div>
			<div id='maintable-wrapper'>			
			<div id='maintable'  class='row'>
              <?php
											
              //Setup field to sort database or use default field

			if(isset($_GET["sortfield"]) && !empty(trim($_GET["sortfield"]))){
				$_SESSION["currentSortField"] = trim($_GET["sortfield"]);
				//$_SESSION["currentSortField"] = $sortField;
				$_SESSION["sortfieldSet"] = TRUE;
			} else if(!$_SESSION["sortfieldSet"]){
				$_SESSION["currentSortField"] = "`ModifiedDate` DESC";
				$_SESSION["sortfieldSet"] = TRUE;
			}

			//Store main SQL for index.php page in $_SESSION[] variables
			if(!$_SESSION["mainSQLset"]){
				$_SESSION["mainSELECT"] = "SELECT `ID`, `Title`, `Author`, `Series` ";
				$_SESSION["mainFROM"] = "FROM AudibleBooks ";
				$_SESSION["mainORDERBY"] = "";
				$_SESSION["mainSQLset"] = TRUE;
				if(!$_SESSION["searchWHEREset"]) {
					$_SESSION["mainWHERE"] = "";
					$_SESSION["searchWHEREset"] = TRUE;
				}
			}

			// Include config file
			require_once 'config.php';
			
			// Attempt select query execution $sortField has ORDER BY command included
			//$mainSQL = "SELECT `ID`, `Title`, `Author`, `Series` ". "FROM AudibleBooks ";

			$mainSQL = $_SESSION["mainSELECT"] .
				$_SESSION["mainFROM"] .
				$_SESSION["mainWHERE"] .
				$_SESSION["mainORDERBY"] .
				$_SESSION["currentSortField"];

              if($result = $mysqli->query($mainSQL)){
                  if($result->num_rows > 0){
                      echo "<table class='table table-bordered table-hover'>";
                          echo "<thead>";
                              echo "<tr>";
                                  echo "<th style='width: 8%'>ID</th>";
                                  echo "<th style='width: 40%'>Title</th>";
                                  echo "<th style='width: 20%'>Author</th>";
                                  echo "<th style='width: 20%'>Series</th>";
                                  echo "<th style='width: 22%'>Action</th>";
                              echo "</tr>";
                          echo "</thead>";
                          echo "<tbody>";
							while($row = $result->fetch_array()){
								echo "<tr>";
									echo "<td>" . $row['ID'] . "</td>";
									echo "<td>" . $row['Title'] . "</td>";
									echo "<td>" . $row['Author'] . "</td>";
									echo "<td>" . $row['Series'] . "</td>";
									echo "<td>";
										echo "<a href='read.php?ID=". $row['ID'] ."' title='View Record' data-toggle='tooltip'><span class='fa fa-eye'></span></a>";
										echo "<a href='update.php?ID=". $row['ID'] ."' title='Update Record' data-toggle='tooltip'><span class='fa fa-pencil'></span></a>";
										echo "<a href='delete.php?ID=". $row['ID'] ."' title='Delete Record' data-toggle='tooltip'><span class='fa fa-trash'></span></a>";
									echo "</td>";
								echo "</tr>";
							}
                          echo "</tbody>";                            
                      echo "</table>";
                      // Free result set
                      $result->free();
                  } else{
                      echo "<p class='lead'><em>No records were found.</em></p>";
                  }
              } else{
                  echo "ERROR: Could not able to execute $sql. " . $mysqli->error;
              }
              
              // Close connection
              $mysqli->close();
              ?>
            </div>
			</div>			
		</div>        
    </div>
</body>
</html>