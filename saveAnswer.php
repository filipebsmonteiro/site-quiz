<?php
$data = $_POST['data'];
$inp = file_get_contents('json/answers.json');
$tempArray = json_decode($inp);
array_push($tempArray, $data);
$jsonData = json_encode($tempArray);
file_put_contents('json/answers.json', $jsonData);
?>
