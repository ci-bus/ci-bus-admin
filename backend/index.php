<?php session_start();

	error_reporting(E_ERROR);
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	
	include __DIR__ . "/core/autoload.php";
	$config = new Config();
	
	header('Content-Type: text/html; charset='.$config->getConfig('charset'));

	$urlparts = false;
	
	if ($_SERVER['argv']) {
	    $turi = trim(explode('&', $_SERVER['argv'][0])[0], "/");
	} else {
	    $turi = trim($_SERVER['QUERY_STRING'], "/");
	}
	
	$dt = explode('/', $turi);

	if ($_SERVER['REQUEST_METHOD'] != 'GET') {
		parse_str(file_get_contents("php://input"), $_POST);
	}
	
	$data = $_POST['data']? json_decode($_POST['data'], true): array_slice($_GET, 1);
		
	if (!$dt[1]) {
		$dt[1] = $dt[0];
		unset($dt[0]);
	}
	$path = trim($dt[1]).'Store.php';
	if ($dt[0]) {
		$path = trim($dt[0]).'/'.$path;
	}								

	if(file_exists('module/'.$path))
	{
		$temp_class = ucwords($dt[1]);
		include 'module/'.$path;
		$class = new $temp_class($data);
		$method = $_SERVER['REQUEST_METHOD'];
		$class->$method($data);
	}
	else
	{
		echo 'File not exists: module/'.$path;
	}
		
?>