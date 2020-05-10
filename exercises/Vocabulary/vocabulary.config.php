<?php

$options = [
    // @todo make logLevel usable
    'logLevel' => 'DEBUG',
    'fixtures_dir' => '/home/ws/app/tmp',
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
			'dir' => '/home/ws/app/tmp/storage', // directory for saving files
			'extension' => '.wbv', // extension for files with words (WiseBits Vocabulary)
            'capacity' => 8,
		],
        'routing' => [
            '0.300' => [
                'logLevel' => 'DEBUG',
                'provider' => 'Vocabulary\\Storages\\Db',
                'options' => [
                    'logLevel' => 'DEBUG',
                    'table' => 'vocabulary',
                ],
            ],
            '301.600' => [
                'logLevel' => 'DEBUG',
                'provider' => 'Vocabulary\\Storages\\Redis',
                'options' => [
                    'logLevel' => 'DEBUG',
                    'prefix_key' => 'ws:vocabulary'
                ],
            ],
            'default' => [
                'logLevel' => 'DEBUG',
                'provider' => 'Vocabulary\\Storages\\File',
                'options' => [
                    'logLevel' => 'DEBUG',
                    'dir' => '/home/ws/app/tmp/storage', // directory for saving files
                    'extension' => '.wbv' // extension for files with words (WiseBits Vocabulary)
                ],
            ]
        ]
	],
    // Setup parsing settings
	'vocabulary' => [
        'logLevel' => 'DEBUG',
		'blockSize' => 128, // number of reading bytes per iteration
		'threads' => 1, // number of threads used for read source data (doesn't implemented)
	]
];
