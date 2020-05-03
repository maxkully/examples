<?php

namespace BDT\Entity\Traits;

use Doctrine\ORM\Mapping as ORM;
use DateTime;

trait StatableTrait
{
    /**
     * @var int $wfStatus
     *
     * @ORM\Column(name="wf_status", type="smallint")
     */
    private $wfStatus = 1;

    /**
     * Get workflow state
     *
     * @return int
     */
    public function getWfStatus()
    {
        return $this->wfStatus;
    }
}
