<?php
	$url = "http://".($_SERVER['SERVER_ADDR'])."/wikilite/index.php/engine/project/".$project."/".$title;
?>

<div class="panel panel-default" style="margin:20px">
	<div class="panel-heading">
	<h1 class="panel-title"><b> <?php echo $title; ?>  </b> </h1>
	</div>
	<div class="panel-body">
			<?php echo $content; ?>
	</div>

	<div class="panel-footer">
		URL : [ <a href="<?php echo $url;?>"><?php echo $url?></a> ] 
		<?php echo "<br>".$date?> 에 작성된 글입니다.</div>
</div>

