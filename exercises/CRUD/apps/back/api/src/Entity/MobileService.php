<?php

namespace BDT\Entity;

use BDT\Entity\Traits\StatableTrait;
use BDT\Entity\Traits\TimestampableTrait;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity
 * @ORM\Table(name="services")
 * @ORM\HasLifecycleCallbacks
 */
class MobileService {
    use StatableTrait;
    use TimestampableTrait;

    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=200, unique=true)
     * @Assert\NotBlank()
     * @Assert\Length(
     *      min = 3,
     *      max = 200,
     *      minMessage = "Title must be at least {{ limit }} characters long",
     *      maxMessage = "Title cannot be longer than {{ limit }} characters",
     *      allowEmptyString = false
     * )
     */
    private $title;

    /**
     * @ORM\Column(type="string", length=1000, nullable=true)
     *      * @Assert\Length(
     *      min = 3,
     *      max = 1000,
     *      minMessage = "Title must be at least {{ limit }} characters long",
     *      maxMessage = "Title cannot be longer than {{ limit }} characters",
     *      allowEmptyString = true
     * )
     */
    private $description = '';

    /**
     * @ORM\ManyToMany(targetEntity="BDT\Entity\Subscriber", mappedBy="services")
     */
    private $subscribers;

    public function __construct()
    {
        $this->subscribers = new ArrayCollection();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getTitle()
    {
        return $this->title;
    }

    public function setTitle($title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): string
    {
        return $this->description ?? '';
    }

    public function setDescription($description): self
    {
        $this->description = $description;

        return $this;
    }

    /**
     * @return Collection|Subscriber[]
     */
    public function getSubscribers(): Collection
    {
        return $this->subscribers;
    }

    public function addSubscriber(Subscriber $subscribers): self
    {
        if (!$this->subscribers->contains($subscribers)) {
            $this->subscribers[] = $subscribers;
            $subscribers->addService($this);
        }
        return $this;
    }

    public function removeSubscriber(Subscriber $subscribers): self
    {
        if ($this->subscribers->contains($subscribers)) {
            $this->subscribers->removeElement($subscribers);
            $subscribers->removeService($this);
        }
        return $this;
    }

    public function serialize($withRelations = false) {
        $response = [
            'id' => $this->getId(),
            'title' => $this->getTitle(),
            'description' => $this->getDescription(),
            'created_at' => $this->getCreatedAt()
        ];

        if ($withRelations) {
            $response['users'] = [];
            foreach ($this->getSubscribers() as $subscriber) {
                $response['users'][] = $subscriber->serialize();
            }
        }

        return $response;
    }
}
