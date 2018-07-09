<?php
// Include config file
require 'config.php';
   
// Define variables and initialize with empty values
$ShowName = $NextEpisode = $Season = $ShowSource = "";
$ShowName_err = $NextEpisode_err = $Season_err = $ShowSource_err = "";

// Processing form data when form is submitted
if(isset($_POST["ID"]) && !empty($_POST["ID"])){
    // Get hidden input value
    $ID = $_POST["ID"];
    
    // Validate ShowName
    $input_ShowName = trim($_POST["ShowName"]);
    if(empty($input_ShowName)){
        $ShowName_err = "Please enter a Show Name.";
    } elseif(!filter_var(trim($_POST["ShowName"]), FILTER_VALIDATE_REGEXP, array("options"=>array("regexp"=>"/^[a-zA-Z'-.\s ]+$/")))){
        $ShowName_err = 'Please enter a valid Show Name.';
    } else{
        $ShowName = $input_ShowName;
    }
    
	// Validate NextEpisode
	$input_NextEpisode = trim($_POST["NextEpisode"]);
	if(empty($input_NextEpisode)){
	    $NextEpisode_err = 'Please enter an Next Episode.';     
	} else{
		$temp = intval(ltrim($input_NextEpisode, "a..zA..Z"));
		if($temp < 10) {
			$NextEpisode = "E0" . strval($temp);
		} else {
			$NextEpisode = "E" . strval($temp);			
		}
	}
    
    // Validate Season
    $input_Season = trim($_POST["Season"]);
    if(empty($input_Season)){
        $Season_err = "Please enter the Season.";     
    } else{
		$temp = intval(ltrim($input_Season, "a..zA..Z"));
		if($temp < 10) {
			$Season = "S0" . strval($temp);
		} else {
			$Season = "S" . strval($temp);			
		}    }

    // Validate ShowSource
    $input_ShowSource = trim($_POST["ShowSource"]);
    if(empty($input_ShowSource)){
        $ShowSource_err = "Please enter a Show Source.";
    } elseif(!filter_var(trim($_POST["ShowSource"]), FILTER_VALIDATE_REGEXP, array("options"=>array("regexp"=>"/^[a-zA-Z'-.\s ]+$/")))){
        $ShowSource_err = 'Please enter a valid Show Source.';
    } else{
        $ShowSource = $input_ShowSource;
    }
    
    // Check input errors before inserting in database
    if(empty($ShowName_err) && empty($NextEpisode_err) && empty($Season_err) && empty($ShowSource_err)){
        // Prepare an insert statement
        $sql = "UPDATE tvEpisodes SET ShowName=?, NextEpisode=?, Season=?, ShowSource=? WHERE ID=?";
        if($stmt = $mysqli->prepare($sql)){
            // Bind variables to the prepared statement as parameters
            $stmt->bind_param("ssssi", $param_ShowName, $param_NextEpisode, $param_Season, $param_ShowSource, $param_ID);
            // Set parameters
            $param_ShowName = $ShowName;
            $param_NextEpisode = $NextEpisode;
            $param_Season = $Season;
            $param_ShowSource = $ShowSource;
            $param_ID = $ID;
            // Attempt to execute the prepared statement
            if($stmt->execute()){
                // Records updated successfully. Redirect to landing page
                header("location: index.php");
                exit();
            } else{
                echo "In POST section.  Something went wrong. Please try again later.";
            }
        }
         
        // Close statement
        $stmt->close();
    }
    
    // Close connection
    $mysqli->close();

} else{  

    // Check existence of ID parameter before processing further
    if(isset($_GET["ID"]) && !empty(trim($_GET["ID"]))){
        // Get URL parameter
        $ID =  trim($_GET["ID"]);
        
        // Prepare a select statement
        $sql = "SELECT * FROM tvEpisodes WHERE ID = ?";
        if($stmt = $mysqli->prepare($sql)){
            // Bind variables to the prepared statement as parameters
            $stmt->bind_param("i", $param_ID);
            
            // Set parameters
            $param_ID = $ID;
            
            // Attempt to execute the prepared statement
            if($stmt->execute()){
                $result = $stmt->get_result();
                
                if($result->num_rows == 1){
                    /* Fetch result row as an associative array. Since the result set
                    contains only one row, we don't need to use while loop */
                    $row = $result->fetch_array(MYSQLI_ASSOC);
                    
                    // Retrieve individual field value
                    $ShowName = $row["ShowName"];
                    $NextEpisode = $row["NextEpisode"];
                    $Season = $row["Season"];
                    $ShowSource = $row["ShowSource"];
                } else{
                    // URL doesn't contain valid ID. Redirect to error page
                    header("location: error.php");
                    exit();
                }
                
            } else{
                echo "Oops! Something went wrong. Please try again later.";
            }
        }
        
        // Close statement
        $stmt->close();
        
        // Close connection
        $mysqli->close();
    }  else{
        // URL doesn't contain ID parameter. Redirect to error page
        header("location: error.php");
        exit();
    }  
}  
?>
 
<!DOCTYPE html>
<html lang="en">
<head>
	<title>View Record</title>
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

	<style type="text/css">
	    .wrapper{
	        width: 600px;
	        margin: 0 auto;
	    }
	</style>
	
</head>
<body>
    <div class="wrapper">
        <div class="container-fluID">
            <div class="row">
                <div class="col-md-12">
                    <div class="page-header">
                        <h2>Update Record</h2>
                    </div>
                    <p>Please edit the input values and submit to update the record.</p>
                    
                    <form action="<?php echo htmlspecialchars(basename($_SERVER['REQUEST_URI'])); ?>" method="post">
                        <div class="form-group <?php echo (!empty($ShowName_err)) ? 'has-error' : ''; ?>">
                            <label>ShowName</label>
                            <input type="text" name="ShowName" class="form-control" value="<?php echo $ShowName; ?>">
                            <span class="help-block"><?php echo $ShowName_err;?></span>
                        </div>
	                     <div class="form-group <?php echo (!empty($NextEpisode_err)) ? 'has-error' : ''; ?>">
                           <label>NextEpisode</label>
									<div class="row align-items-center">
										<span class="text-right pr-0 col-sm-1">E</span>                        
                            	<input type="text" name="NextEpisode" class="text-left col-sm-1 form-control" value="<?php echo ltrim($NextEpisode, "Ee"); ?>">
										<span class="col-sm-10"> </span>                        
									</div>
                           <span class="help-block"><?php echo $NextEpisode_err;?></span>
								</div>
                        <div class="form-group <?php echo (!empty($Season_err)) ? 'has-error' : ''; ?>">
									<label>Season</label>
									<div class="row align-items-center">
										<span class="text-right pr-0 col-sm-1">S</span>                        
                            	<input type="text" name="Season" class="text-left col-sm-1 form-control" value="<?php echo ltrim($Season, "Ss"); ?>">
										<span class="col-sm-10"> </span>                        
									</div>
                            <span class="help-block"><?php echo $Season_err;?></span>
                        </div>
                        <div class="form-group <?php echo (!empty($ShowSource_err)) ? 'has-error' : ''; ?>">
                            <label>ShowSource</label>
                            <input type="text" name="ShowSource" class="form-control" value="<?php echo $ShowSource; ?>">
                            <span class="help-block"><?php echo $ShowSource_err;?></span>
                        </div>
                        <input type="hidden" name="ID" value="<?php echo $ID; ?>"/>
                        <input type="submit" class="btn btn-primary" value="Submit">
                        <a href="index.php" class="btn btn-default">Cancel</a>
                    </form>               
                                        
                </div>
            </div>        
        </div>
    </div>
</body>
</html>
