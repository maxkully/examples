<?php

namespace GrowFlow\Formatter;

class Json extends Formatter
{
    public function decode($data)
    {
        return json_decode($data, true);
    }

    public function encode($data)
    {
        $res = [];
        foreach ($data as $item) {
            $row = [];
            foreach ($this->outputFields as $outputField) {
                $row[$outputField] = $item[$outputField] ?? '';
            }
            $res[] = $row;
        }
        return json_encode($res);
    }
}
