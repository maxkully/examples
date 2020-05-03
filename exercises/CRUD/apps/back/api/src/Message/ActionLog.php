<?php

namespace BDT\Message;

class ActionLog
{
    static public $CREATE = 100;
    static public $UPDATE = 200;
    static public $DELETE = 300;
    static public $LINK = 400;
    static public $RELEASE = 500;

    private $userId;
    private $entity;
    private $entityId;
    private $ref;
    private $refId;
    private $action;

    public function __construct(int $userId, int $entityId, string $entity, string $action, int $refId = null, string $ref = null)
    {
        $this->userId = $userId;
        $this->entityId = $entityId;
        $this->entity = $entity;
        $this->refId = $refId;
        $this->ref = $ref;
        $this->action = $action;
    }

    public function __get($name)
    {
        return $this->$name;
    }
}
