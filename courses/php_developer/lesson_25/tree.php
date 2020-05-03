<?php

class Tree
{
    /**
     * @var int
     */
    private $inf;

    /**
     * @var Tree
     */
    private $left;

    /**
     * @var Tree
     */
    private $right;

    public function __construct($inf)
    {
        $this->inf = (int) $inf;
        $this->left = null;
        $this->right = null;
    }

    public function linkLeft(Tree $left)
    {
        $this->left = $left;
    }

    public function linkRight(Tree $right)
    {
        $this->right = $right;
    }

    public function left()
    {
        return $this->left;
    }

    public function right()
    {
        return $this->right;
    }

    public function inf()
    {
        return $this->inf;
    }

    public function createLeft(int $inf)
    {
        if ($this->left()) {
            return null;
        }

        $leaf = new Tree($inf);
        $this->linkLeft($leaf);
        return $leaf;
    }

    public function createRight(int $inf)
    {
        if ($this->right()) {
            return null;
        }

        $leaf = new Tree($inf);
        $this->linkRight($leaf);
        return $leaf;
    }

    public function dump($level = 0)
    {
        for ($i = 0; $i <= $level; $i++) {
            echo '|';
        }
        echo '>'. $this->inf() . PHP_EOL;
        $level++;
        if ($this->left()) {
            $this->left()->dump($level);
        }
        if ($this->right()) {
            $this->right()->dump($level);
        }
    }
}

$root = new Tree(0);
$queue = [];
$branch = $root;
for ($i = 1; $i < 10; $i++) {
    if (!$branch->left()) {
        $leaf = $branch->createLeft($i);
    } else {
        $leaf = $branch->createRight($i);
        $branch = array_shift($queue);
    }
    $queue[] = $leaf;
}

$root->dump();
/*
OUTPUT:
|>0
||>1
|||>3
||||>7
||||>8
|||>4
||||>9
||>2
|||>5
|||>6
*/