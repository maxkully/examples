<?php

namespace GrowFlow\Formatter;

abstract class Formatter
{
    protected $data;

    protected $result;

    /**
     * @var array
     */
    protected $inputFields = [
        'position_id',
        'order_date_from',
        'delivery_date_from',
        'price'
    ];

    protected $outputFields = [
        'position_id',
        'order_date_from',
        'order_date_to',
        'delivery_date_from',
        'delivery_date_to',
        'price'
    ];

    public function __construct($data)
    {
        $this->data = $data;
        $this->result = false;
    }

    public function parse()
    {
        $this->result = $this->decode($this->data);
        return $this->result;
    }

    public function dump()
    {
        $this->result = $this->encode($this->data);
        return $this->result;
    }

    abstract protected function encode($data);

    abstract protected function decode($data);
}
