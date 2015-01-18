<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>위키라이트</title>
	<link rel="icon" href="/wikilite/favicon.ico" type="image/ico">
	<!--<link rel="stylesheet" type="text/css" href="/wikilite/dist/css/default.css">-->
	<link rel="stylesheet" type="text/css" href="/wikilite/dist/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="/wikilite/dist/css/bootstrap-theme.min.css">
	
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	<script src="/wikilite/dist/js/bootstrap.min.js"></script>
	
</head>
<nav class="navbar navbar-default">
	<div class="container-fluid">
	<div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar" aria-expanded="true" aria-controls="navbar">
              <span class="sr-only"><font><font>전환 탐색</font></font></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="/wikilite/index.php"><font><font><b>위키대문</b></font></font></a>
    </div>

	<div id="navbar" class="navbar-collapse collapse" aria-expanded="true" style="height: 1px;">
	<ul class="navbar navbar-nav">
		<?php
			foreach ($data as $index => $project) {?>
			<li class="nav navbar-nav"><a class="navbar-brand" href="/wikilite/index.php/engine/project/<?php echo $project?>">
			<?php echo $project?></a></li>
		<?}?>
	</ul>
	</div>
	</div>
</nav>

<body>


