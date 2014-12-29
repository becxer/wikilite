<?php
if (!defined('BASEPATH'))
	exit('No direct script access allowed');

class Engine extends CI_Controller {

	/*
	 * Author : Becxer (whitewest87@gmail.com)
	 * */

	public function __construct() {
		parent::__construct();
		$this -> load -> helper('directory');
		$this -> load -> helper('file');
		include './parsedown-master/Parsedown.php';
		$this -> parsedown = new Parsedown();
		$this -> article_dir = './articles';
		log_message("DEBUG","construct");
	}

	public function test() {
		var_dump($this -> getDirectories($this -> article_dir));
		var_dump($this -> getFiles($this -> article_dir));
	}

	//return :: directories in dir
	private function getDirectories($dir) {
		$map = directory_map($dir, 1);
		foreach ($map as $index => $item) {
			if (!is_dir('' . $dir . '/' . $item)) {
				unset($map[$index]);
			}
		}
		return $map;
	}

	//return :: files in dir
	private function getFiles($path) {
		$map = directory_map($path, 1);
		foreach ($map as $index => $item) {
			if (is_dir('' . $path . '/' . $item)) {
				unset($map[$index]);
			}
		}
		return $map;
	}

	private function loadHeader() {
		$data = array('data' => $this -> getDirectories($this -> article_dir));
		$this -> load -> view('header', $data);
	}

	private function loadFooter() {
		$this -> load -> view('footer');
	}

	//Intro page
	public function index() {
		//--------Intro page----------------------------------
		$this -> loadHeader();
		$this -> feedinner($this->article_dir, 'wikilite.md');
		$this -> load -> view('footer');
		//----------------------------------------------------
		
	}

	public function feedinner($dir, $filename) {
		$content = $this -> parsedown -> text(read_file($dir . '/' . $filename));
		$project = substr($dir,11,strlen($dir)-1);
		$date = date("Y년 m월 d일 H시 i분 s초", filemtime($dir . '/' . $filename));
		$title = substr($filename, 0, -(strlen($filename) - strripos($filename, '.md')));
		$data = array('project'=> $project, 'title' => $title, 'content' => $content, 'date' => $date);
		$this -> load -> view('container', $data);
	}

	public function loadEditor(){
		$this -> load -> view('write');
	}

	public function project($project, $feed = null) {
		$this -> loadHeader();
		$dir = $this -> article_dir . '/' . $project;
		if(empty($feed)){
		if (file_exists($dir) && is_dir($dir)) {
			//load editor.
			$this -> loadEditor();
			
			//show all feeds in project
			$filelist = $this -> getFiles($dir);
			$files = array();
			
			//sort file list with time
			foreach ($filelist as $index => $filename){
				if($filename != "." && $filename != ".."){
					$files[filemtime($dir.'/'.$filename)] = $filename;
				}
			}
			krsort($files);
			
			//file load in feed.
			foreach ($files as $filename) {
				if (strripos($filename, '.md')) {
					$this->feedinner($dir, $filename);
				}
			}
		}
		}else{
		if(file_exists($dir) && file_exists($dir.'/'.$feed.'.md')){
			//show only one file in feed.
			$filename = $feed.'.md';
			$this->feedinner($dir, $filename);
		}
		}
		$this -> loadFooter();
	}

}
