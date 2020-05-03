<?php

namespace BDT\Entity;

use BDT\Entity\Traits\TimestampableTrait;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity
 * @ORM\Table(name="logs")
 * @ORM\HasLifecycleCallbacks
 */
class Log {
    use TimestampableTrait;

    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     */
    private $user;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     */
    private $entity;

    /**
     * @ORM\Column(type="integer")
     * @Assert\NotBlank()
     */
    private $entity_id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $ref;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $ref_id;

    /**
     * @ORM\Column(type="smallint")
     * @Assert\NotBlank()
     */
    private $action;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    public function getUser() {
        return $this->user;
    }

    public function setUser(User $user) {
        $this->user = $user;

        return $this;
    }

    public function getEntity() {
        return $this->entity;
    }

    public function setEntity($entity) {
        $this->entity = $entity;

        return $this;
    }

    public function getEntityId() {
        return $this->entity_id;
    }

    public function setEntityId($entityId) {
        $this->entity_id = $entityId;

        return $this;
    }

    public function getRef() {
        return $this->ref;
    }

    public function setRef($entity) {
        $this->ref = $entity;

        return $this;
    }

    public function getRefId() {
        return $this->ref_id;
    }

    public function setRefId($refId) {
        $this->ref_id = $refId;

        return $this;
    }

    public function getAction() {
        return $this->action;
    }

    public function setAction($action) {
        $this->action = $action;

        return $this;
    }

    public function serialize($withRelation = false) {
        $response = [
            'id' => $this->getId(),
            'user' => $this->getUser()->serialize(),
            'entity_id' => $this->getEntityId(),
            'entity' => $this->getEntity(),
            'ref_id' => $this->getRefId(),
            'ref' => $this->getRef(),
            'action' => $this->getAction(),
            'created_at' => $this->getCreatedAt(),
        ];

        if ($withRelation) {
            // @todo: implement gathering entity
            return $response;
        }

        return $response;
    }
}
