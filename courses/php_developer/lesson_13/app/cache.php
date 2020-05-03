#!/usr/bin/env php
<?php

require 'vendor/autoload.php';

use OtusCourses\RedisCache;

$cache = new RedisCache();

$url = 'hello-world';

$page = $cache->read($url);

if (!isset($page)) {
    $page = random_int(10, 1000000);
    $cache->write($url, $page);
    $cache->expire($url, 60);
}
