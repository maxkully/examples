<?php

namespace CLI;

/**
 * Class Factory
 * Instantiate handler for command
 * Return Commands instance by command name
 * @example
 *   $handler = Factory::instance('command', [], []);
 *   $handler->start();
 */
class Factory
{
    /**
     * @param string $command
     * @param array $inputs - attributes from command line (file for example)
     * @param array $options - attributes from config files
     * @return Commands\Fixture|Commands\Load|Commands\Count
     * @throws \Exception - unexpected command from command line
     */
    public static function instance($command, $inputs, $options)
    {
        switch ($command) {
            case 'load':
                return new Commands\Load($inputs, $options);
            case 'fixture':
                return new Commands\Fixture($inputs, $options);
            case 'count':
                return new Commands\Count($inputs, $options);
            default:
                throw new \Exception('Command `' . $command . '` not found', 1);
        }
    }
}
