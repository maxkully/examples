<?php

// Load environment variables
require 'env.php';

use \GrowFlow\Kernel;
use \GrowFlow\Error\IllegalUsageError;
use \GrowFlow\Error\InitError;
use \GrowFlow\Error\NotImplementedError;
use \GrowFlow\Error\ValidationError;

try {
    $app = new Kernel();
    $app->logger->info('Application was loaded successfully');
} catch (InitError $e) {
    fwrite(STDERR, '[ERROR] Loading application failed' . PHP_EOL);
    fwrite(STDERR, 'Error details: ' . $e->getMessage() . PHP_EOL);

    exit(1);
} catch (\Exception $e) {
    fwrite(STDERR, '[ERROR] Unexpected error occurred, investigation needs...' . PHP_EOL);
    fwrite(STDERR, 'Error details: ' . $e->getMessage() . PHP_EOL);

    exit(1);
}

try {
    $positions = $app->input->load();
    $app->logger->info('Input data was loaded');
    $app->logger->debug('[INPUT] ' . print_r($positions, 1));

    $positions = $app->calendar->denormalize($positions);
    $app->logger->info('Data was denormalized');
    $app->logger->debug('[POSITIONS] => ' . print_r($positions, 1));

    $app->output->store($positions);
    $app->logger->info('Data was stored');
} catch (IllegalUsageError $e) {
    $app->logger->error('Illegal usage error');
    $app->logger->debug('Error details: ' . $e->getMessage());
    $app->logger->debug($e->getTraceAsString());

    exit(1);
} catch (ValidationError $e) {
    $app->logger->error('Incorrect data received');
    $app->logger->debug('Error details: ' . $e->getMessage());
    $app->logger->debug($e->getTraceAsString());

    exit(1);
} catch (NotImplementedError $e) {
    $app->logger->error('Some used components not implemented yet');
    $app->logger->debug('Error details: ' . $e->getMessage());
    $app->logger->debug($e->getTraceAsString());

    exit(1);
} catch (\Exception $e) {
    $app->logger->error('Unexpected error occurred, investigation needs...');
    $app->logger->debug('Error details: ' . $e->getMessage());
    $app->logger->debug($e->getTraceAsString());

    exit(1);
}
