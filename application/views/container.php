<?php
	$url = "http://".($_SERVER['SERVER_ADDR'])."/wikilite/index.php/engine/project/".$project."/".$title;
?>

<div id="container">
	<h1 class="title"><b> <?php echo $title; ?>  </b> </h1>
	<div id="body">
			<?php echo $content; ?>
	</div>

	<p class="footer">
		URL : [ <a href="<?php echo $url;?>"><?php echo $url?></a> ] 
		<?php echo "<br>".$date?> 에 작성된 글입니다.</p>
</div>

