<?php

$options = [
    // @todo make logLevel usable
    'logLevel' => 'DEBUG',
    // Setup provider for source data (from file)
	'source' => [
		'provider' => 'Vocabulary\\Sources\\File',
		'options' => [
            'logLevel' => 'DEBUG'
        ]
	],
    // Setup provider for vocabulary storage (use files)
	'storage' => [
        'logLevel' => 'DEBUG',
		'provider' => 'Vocabulary\\Storages\\File',
		'options' => [
            'logLevel' => 'DEBUG',
			'dir' => '/home/ws/app/tmp/storage', // directory for saving files
			'extension' => '.wbv' // extension for files with words (WiseBits Vocabulary)
		]
	],
	'vocabulary' => [
        'logLevel' => 'DEBUG',
		'blockSize' => 128, // number of reading bytes per iteration
		'threads' => 1, // number of threads used for read source data (doesn't implemented)
	]
];
