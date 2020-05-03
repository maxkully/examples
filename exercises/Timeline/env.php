<?php

require 'vendor/autoload.php';

use Symfony\Component\Dotenv\Dotenv;

$dotEnv = new Dotenv();
$dotEnv->load(__DIR__.'/.env');
