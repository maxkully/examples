<?php
/**
 * Change this file for studying list data type
 */

/**
 * Implementation classic abstract data type List for studying purpose
 *
 * Class OtusListElement
 */
class OtusListElement
{
    /**
     * Info field
     * @var mixed
     */
    private $inf;

    /**
     * Link to next list element
     * @var OtusListElement or NULL
     */
    private $next;

    /**
     * OtusListElement constructor.
     *
     * @param $inf
     */
    public function __construct($inf)
    {
        $this->inf = $inf;
        $this->next = NULL;
    }

    /**
     * Assign new value to info field of list element
     * @param $inf
     */
    public function assign($inf) {
        $this->inf = $inf;
    }

    /**
     * Link element with another list element
     * @param OtusListElement $next
     */
    public function link(OtusListElement $next)
    {
        $this->next = $next;
    }

    /**
     * Mark element as Tail
     */
    public function unlink() {
        $this->next = NULL;
    }
}


/**
 * Add new element to list after destination element
 * @param                 $inf
 * @param OtusListElement $destination
 *
 * @return OtusListElement
 */
function addElement($inf, OtusListElement $destination) {
    $element = new OtusListElement($inf);
    $destination->link($element);
    return $element;
}

// Example of usage

// Create first list element (head). Do not reassign this value if you won't lost start point of your list.
$head = new OtusListElement(1);
// Create second element
$second = new OtusListElement(2);
// Link with element
$head->link($second);