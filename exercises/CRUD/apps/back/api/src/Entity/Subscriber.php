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
 * @ORM\Table(name="subscribers")
 * @ORM\HasLifecycleCallbacks
 */
class Subscriber {
    use StatableTrait;
    use TimestampableTrait;

    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=15, unique=true)
     * @Assert\NotBlank()
     * @Assert\Length(
     *      min = 11,
     *      max = 15,
     *      minMessage = "Title must be at least {{ limit }} characters long",
     *      maxMessage = "Title cannot be longer than {{ limit }} characters",
     *      allowEmptyString = false
     * )
     * @Assert\Regex(pattern="/^[0-9]*$/", message="number_only")
     */
    private $phone;

    /**
     * @ORM\Column(type="string", length=2)
     * @Assert\NotBlank()
     * @todo: fix it
     * @Assert\Choice(choices={"en", "ru", "ky", "uz"})
     */
    private $locale;

    /**
     * @ORM\ManyToMany(targetEntity="BDT\Entity\MobileService", inversedBy="subscribers")
     */
    private $services;

    public function __construct()
    {
        $this->services = new ArrayCollection();
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return mixed
     */
    public function getPhone()
    {
        return $this->phone;
    }

    /**
     * @param mixed $phone
     */
    public function setPhone($phone)
    {
        $this->phone = $phone;

        return $this;
    }

    public static function getLocales()
    {
        return ['en', 'ru', 'ky', 'uz'];
    }

    /**1
     * @return mixed
     */
    public function getLocale()
    {
        return $this->locale;
    }

    /**
     * @param mixed $locale
     */
    public function setLocale($locale)
    {
        $this->locale = $locale;

        return $this;
    }

    /**
     * @return Collection|MobileService[]
     */
    public function getServices(): Collection
    {
        return $this->services;
    }

    public function addService(MobileService $service): self
    {
        if (!$this->services->contains($service)) {
            $this->services[] = $service;
            $service->addSubscriber($this);
        }
        return $this;
    }

    public function removeService(MobileService $service): self
    {
        if ($this->services->contains($service)) {
            $this->services->removeElement($service);
            $service->removeSubscriber($this);
        }
        return $this;
    }

    public function serialize($withRelations = false) {
        $response = [
            'id' => $this->getId(),
            'phone' => $this->getPhone(),
            'locale' => $this->getLocale(),
            'created_at' => $this->getCreatedAt()
        ];

        if ($withRelations) {
            $response['services'] = [];
            foreach ($this->getServices() as $service) {
                $response['services'][] = $service->serialize();
            }
        }

        return $response;
    }
}
