<?php
// Include config file
require 'config.php';
 
// Define variables and initialize with empty values
$ShowName = $NextEpisode = $Season = $ShowSource = "";
$ShowName_err = $NextEpisode_err = $Season_err = $ShowSource_err = "";
 
// Processing form data when form is submitted
if($_SERVER["REQUEST_METHOD"] == "POST"){
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
        $sql = "INSERT INTO tvEpisodes (ShowName, NextEpisode, Season, ShowSource) VALUES (?, ?, ?, ?)";
 
        if($stmt = $mysqli->prepare($sql)){
            // Bind variables to the prepared statement as parameters
            $stmt->bind_param("ssss", $param_ShowName, $param_NextEpisode, $param_Season, $param_ShowSource);
            
            // Set parameters
            $param_ShowName = $ShowName;
            $param_NextEpisode = $NextEpisode;
            $param_Season = $Season;
            $param_ShowSource = $ShowSource;
            
            // Attempt to execute the prepared statement
            if($stmt->execute()){
                // Records created successfully. Redirect to landing page
                header("location: index.php");
                exit();
            } else{
                echo "Something went wrong. Please try again later.";
            }
        }
         
        // Close statement
        $stmt->close();
    }
    
    // Close connection
    $mysqli->close();
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

	<style type="text/css">
	    .wrapper{
	        width: 600px;
	        margin: 0 auto;
	    }
	</style>

</head>
<body>
    <div class="wrapper">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <div class="page-header">
                        <h2>Create Record</h2>
                    </div>
                    <p>Please fill this form and submit to add a a new show to the database.</p>
                    <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
                        <div class="form-group <?php echo (!empty($ShowName_err)) ? 'has-error' : ''; ?>">
                            <label>ShowName</label>
                            <input type="text" name="ShowName" class="form-control" value="<?php echo $ShowName; ?>">
                            <span class="help-block"><?php echo $ShowName_err;?></span>
                        </div>
	                     <div class="form-group <?php echo (!empty($NextEpisode_err)) ? 'has-error' : ''; ?>">
                           <label>NextEpisode</label>
									<div class="row align-items-center">
										<span class="text-right pr-0 col-sm-1">E</span>                        
                            	<input type="text" name="NextEpisode" class="text-left col-sm-1 form-control" value="<?php echo ltrim($NextEpisode, "E"); ?>">
										<span class="col-sm-10"> </span>                        
									</div>
                           <span class="help-block"><?php echo $NextEpisode_err;?></span>
								</div>
                        <div class="form-group <?php echo (!empty($Season_err)) ? 'has-error' : ''; ?>">
									<label>Season</label>
									<div class="row align-items-center">
										<span class="text-right pr-0 col-sm-1">S</span>                        
                            	<input type="text" name="Season" class="text-left col-sm-1 form-control" value="<?php echo ltrim($Season, "S"); ?>">
										<span class="col-sm-10"> </span>                        
									</div>
                            <span class="help-block"><?php echo $Season_err;?></span>
                        </div>
                        <div class="form-group <?php echo (!empty($ShowSource_err)) ? 'has-error' : ''; ?>">
                            <label>Show Source</label>
                            <input type="text" name="ShowSource" class="form-control" value="<?php echo $ShowSource; ?>">
                            <span class="help-block"><?php echo $ShowSource_err;?></span>
                        </div>
                        <input type="submit" class="btn btn-primary" value="Submit">
                        <a href="index.php" class="btn btn-default">Cancel</a>
                    </form>
                </div>
            </div>        
        </div>
    </div>
</body>
</html>
