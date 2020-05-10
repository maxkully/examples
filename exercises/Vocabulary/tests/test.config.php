<?php

return [
    // @todo make logLevel usable
    'logLevel' => 'DEBUG',
    // Setup provider for source data
	'source' => [
		'provider' => 'Vocabulary\\Sources\\File',
		'options' => [
            'logLevel' => 'DEBUG'
        ]
	],
    // Setup provider for vocabulary storage
	'storage' => [
        'logLevel' => 'DEBUG',
		'provider' => 'Vocabulary\\Storages\\File',
		'options' => [
            'logLevel' => 'DEBUG',
			'dir' => '/home/ws/app/tests/tmp', // directory for saving files
			'extension' => '.wbv', // extension for files with words (WiseBits Vocabulary)
            'capacity' => 8,
		],
	],
    // Setup parsing settings
	'vocabulary' => [
        'logLevel' => 'DEBUG',
		'blockSize' => 128, // number of reading bytes per iteration
		'threads' => 1, // number of threads used for read source data (doesn't implemented)
	]
];
