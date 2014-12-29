<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>위키라이트</title>
	<link rel="icon" href="/wikilite/favicon.ico" type="image/ico">
	<!--<link rel="stylesheet" type="text/css" href="/wikilite/dist/css/default.css">-->
	<link rel="stylesheet" type="text/css" href="/wikilite/dist/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="/wikilite/dist/css/bootstrap-theme.min.css">
	<script src="/wikilite/dist/js/bootstrap.min.js"></script>
	
</head>
<nav>
	<ol>
		<li><a href="/wikilite">위키대문</a></li>
		<?php
			foreach ($data as $index => $project) {?>
			<li><a href="/wikilite/index.php/engine/project/<?php echo $project?>">
			<?php echo $project?></a></li>
		<?}?>
	</ol>
</nav>

<body>


