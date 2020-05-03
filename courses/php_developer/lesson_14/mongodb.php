#!/usr/bin/env php
<?php

require 'vendor/autoload.php'; // include Composer's autoloader

$client = new MongoDB\Client("mongodb://localhost:27017");

$db = $client->demo;
$collection = $db->hdello;

$result = $db->hello->insertOne(['status' => 'OK']);
$result = $db->hello->insertOne(['status' => 'Failed']);
$result = $db->hello->insertOne(['status' => 'Pending']);

$result = $db->hello->find();
foreach ($result as $item) {
    //print_r($item);
}

$result = $db->hello->count();
echo $result;