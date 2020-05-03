<?php

namespace BDT\Controller;

use BDT\Entity\Log;
use BDT\Entity\User;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Hoa\Exception\Exception;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use BDT\Form\MobileServiceType;
use BDT\Entity\MobileService;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use BDT\Service\Cache;

/**
 * Movie controller.
 * @Route("/api", name="api_")
 */
class ActivitiesController extends AbstractFOSRestController
{
    /** @var LoggerInterface */
    private $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    /**
     * Use carefully on large activity log
     * For debug purpose only
     * @Rest\Get("/activities")
     *
     * @return Response
     */
    public function getActivityLog() {
        $response = [];

        $objects = $this->getDoctrine()
            ->getRepository(Log::class)
            ->findAll();

        /** @var Log $obj */
        foreach ($objects as $obj) {
            $response[] = $obj->serialize();
        }

        return $this->handleView($this->view($response));
    }
}
