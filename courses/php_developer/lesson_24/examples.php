<?php

/**
 * Using Double Linked List
 */
$list = new SplDoublyLinkedList();

$list->setIteratorMode(SplDoublyLinkedList::IT_MODE_FIFO);
$list->setIteratorMode(SplDoublyLinkedList::IT_MODE_LIFO);

for ($i = 1; $i < 6; $i++) {
    $list->push($i);
}

for ($list->rewind(); $list->valid(); $list->next()) {
    echo $list->current() . " ";
}
/* Output: 5 4 3 2 1 */

$list->rewind();
$list->next();
$list->next();
$list->next();
for ($list->next(); $list->valid(); $list->prev()) {
    echo $list->current() . " ";
}
/* Output: 1 2 3 4 5 */
/**
 * Working with SplStack
 * See more details here
 */
$q = new SplStack();
for ($i = 1; $i < 6; $i++) {
    $q->push($i);
}
$q->rewind();

while ($q->valid() && $q->count()) {
    echo $q->pop() ." ";
}

/* Output: 5 4 3 2 1 */

/**
 * Working with SplQueue
 * See more details here
 */
$q = new SplQueue();
for ($i = 1; $i < 6; $i++) {
    $q->enqueue($i);
}
$q->rewind();

while($q->valid() && $q->count()){
    echo $q->dequeue() . " ";
}

/* Output: 1 2 3 4 5 */