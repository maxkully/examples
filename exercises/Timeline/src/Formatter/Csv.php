<?php

/**
 *
 */

namespace GrowFlow\Formatter;

use GrowFlow\Error\ValidationError;

/**
 * Class Csv
 * @package GrowFlow\Formatter
 */
class Csv extends Formatter
{
    /**
     * @param string $data
     * @return array
     * @throws ValidationError
     */
    public function decode($data)
    {
        if (!$data) {
            throw new ValidationError('Data can not be empty');
        }

        // @todo: make delimiter as config;
        $res = [];
        $data = str_getcsv($this->data, ',');
        foreach ($data as $item) {
            $row = [];
            foreach ($this->inputFields as $i => $field) {
                $row[$field] = $item[$i] ?? '';
            }

            if (!$row) {
                continue;
            }

            $res[] = $row;
        }

        if (!$res) {
            throw new ValidationError('Incorrect input data');
        }

        return $res;
    }

    /**
     * @param $data
     * @return false|string
     */
    public function encode($data)
    {
        $fhd = fopen('php://temp', 'rw');
        foreach ($data as $line) {
            $row = [];
            foreach ($this->outputFields as $outputField) {
                $row[$outputField] = $line[$outputField] ?? '';
            }

            fputcsv($fhd, $row, ',');
        }
        rewind($fhd);
        $csv = stream_get_contents($fhd);
        fclose($fhd);

        return $csv;
    }
}
