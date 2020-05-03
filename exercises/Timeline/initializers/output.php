<?php

use \GrowFlow\Output\Std;
use \GrowFlow\Formatter\Csv;

return new Std(\GrowFlow\Formatter\Json::class);
return new Std(Csv::class);
