<?php

namespace GrowFlow\Input;

use GrowFlow\Error\ValidationError;
use GrowFlow\Formatter\Formatter;

class Std extends Input
{
    /**
     * @return bool
     * @throws ValidationError
     */
    public function load()
    {
        $data = '';
        while ($line = fgets(STDIN)) {
            if (!$line) {
                throw new ValidationError('Empty input data');
            }
            $data .= $line;
        }

        // @todo: filter data for security reason
        /** @var Formatter $parser */
        $parser = new $this->format(trim($data));

        return $parser->parse();
    }
}
