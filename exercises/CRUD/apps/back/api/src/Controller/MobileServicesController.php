<?php

namespace BDT\Controller;

use BDT\Repository\MobileServiceRepository;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Hoa\Exception\Exception;
use Predis\Client as Redis;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use BDT\Form\MobileServiceType;
use BDT\Entity\MobileService;
use BDT\Service\Cache;

/**
 * Movie controller.
 * @Route("/api", name="api_")
 */
class MobileServicesController extends AbstractFOSRestController
{
    /** @var LoggerInterface */
    private $logger;
    private $cache;
    private static $CACHE_SERVICES_LIST = 'BDT>Controller>MobileServicesController>servicesList';

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
        $redis = new Redis(getenv('REDIS_DSN'));
        $redis->connect();
        $this->cache = Cache::instance($redis);
    }

    /**
     * Lists all services
     * @Rest\Get("/services")
     *
     * @return Response
     */
    public function getServicesAction(Request $request, MobileServiceRepository $msRepo)
    {
        try {
            if ($request->get('subscriber_id')) {
                $objects = [];
                foreach ($msRepo->forSubscriber($request->get('subscriber_id')) as $obj) {
                    $objects[] = $obj->serialize();
                }
                return $this->handleView($this->view($objects));
            }

            $response = $this->cache->get(self::$CACHE_SERVICES_LIST, function () {
                $objects = $this->getDoctrine()
                    ->getRepository(MobileService::class)
                    ->findAll();
                /** @var MobileService $obj */
                foreach ($objects as $obj) {
                    $response[] = $obj->serialize();
                }

                return $objects;
            });

            return $this->handleView($this->view($response));
        } catch (\Exception $e) {
            // @todo: put it common handler exception
            $this->logger->error($e->getMessage());
            $this->logger->debug($e->getTraceAsString());

            return $this->handleView($this->view(['message' => 'error.unexpected'], Response::HTTP_INTERNAL_SERVER_ERROR));
        }
    }

    /**
     * Create service
     * @Rest\Post("/services")
     * @param Request $request
     *
     * @return Response
     */
    public function createServiceAction(Request $request)
    {
        try {
            $obj = new MobileService();
            $data = json_decode($request->getContent(), true);
            $form = $this->createForm(MobileServiceType::class, $obj);
            $form->submit($data);
            if ($form->isSubmitted() && $form->isValid()) {
                $em = $this->getDoctrine()->getManager();
                $em->persist($obj);
                $em->flush();
                $this->cache->delete(self::$CACHE_SERVICES_LIST);
                return $this->handleView($this->view($obj->serialize(), Response::HTTP_CREATED));
            }

            return $this->handleView($this->view($form->getErrors(), Response::HTTP_BAD_REQUEST));
        } catch (UniqueConstraintViolationException $e) {
            return $this->handleView($this->view(['message' => 'subscriber.title.unique.violation'], Response::HTTP_BAD_REQUEST));
        } catch (\Exception $e) {
            // @todo: put it common handler exception
            $this->logger->error($e->getMessage());
            $this->logger->debug($e->getTraceAsString());

            return $this->handleView($this->view(['message' => 'error.unexpected'], Response::HTTP_INTERNAL_SERVER_ERROR));
        }
    }

    /**
     * Update subscriber
     * @Rest\Get("/services/{id}")
     * @param Request $request
     *
     * @return Response
     */
    public function showServiceAction(Request $request)
    {
        try {
            /** @var MobileService $obj */
            $obj = $this->getDoctrine()->getRepository(MobileService::class)->find($request->get('id'));
            if (!$obj) {
                return $this->handleView($this->view([], Response::HTTP_NOT_FOUND));
            }

            return $this->handleView($this->view($obj->serialize(true)));
        } catch (\Exception $e) {
            // @todo: put it common handler exception
            $this->logger->error($e->getMessage());
            $this->logger->debug($e->getTraceAsString());

            return $this->handleView($this->view(['message' => 'error.unexpected'], Response::HTTP_INTERNAL_SERVER_ERROR));
        }
    }

    /**
     * Update service
     * @Rest\Put("/services/{id}")
     * @param Request $request
     *
     * @return Response
     */
    public function updateServiceAction(Request $request)
    {
        try {
            /** @var MobileService $obj */
            $obj = $this->getDoctrine()->getRepository(MobileService::class)->find($request->get('id'));
            if (!$obj) {
                return $this->handleView($this->view([], Response::HTTP_NOT_FOUND));
            }

            $data = json_decode($request->getContent(), true);
            $form = $this->createForm(MobileServiceType::class, $obj);

            $form->submit($data);
            if ($form->isSubmitted() && $form->isValid()) {
                $em = $this->getDoctrine()->getManager();
                $em->persist($obj);
                $em->flush();
                $this->cache->delete(self::$CACHE_SERVICES_LIST);
                return $this->handleView($this->view([], Response::HTTP_NO_CONTENT));
            }

            return $this->handleView($this->view($form->getErrors(), Response::HTTP_BAD_REQUEST));
        } catch (UniqueConstraintViolationException $e) {
            return $this->handleView($this->view(['message' => 'subscriber.title.unique.violation'], Response::HTTP_BAD_REQUEST));
        } catch (\Exception $e) {
            // @todo: put it common handler exception
            $this->logger->error($e->getMessage());
            $this->logger->debug($e->getTraceAsString());

            return $this->handleView($this->view(['message' => 'error.unexpected'], Response::HTTP_INTERNAL_SERVER_ERROR));
        }
    }

    /**
     * Delete service
     * @Rest\Delete("/services/{id}")
     * @param Request $request
     *
     * @return Response
     */
    public function deleteServiceAction(Request $request)
    {
        try {
            $em = $this->getDoctrine()->getManager();
            $obj = $em->getRepository(MobileService::class)->find($request->get('id'));

            if (!$obj) {
                return $this->handleView($this->view([], Response::HTTP_NOT_FOUND));
            }

            $em->remove($obj);
            $em->flush();
            $this->cache->delete(self::$CACHE_SERVICES_LIST);

            return $this->handleView($this->view([], Response::HTTP_NO_CONTENT));
        } catch (\Exception $e) {
            // @todo: put it common handler exception
            // @todo: repeat if connection problem exception
            $this->logger->error($e->getMessage());
            $this->logger->debug($e->getTraceAsString());

            return $this->handleView($this->view(['message' => 'error.unexpected'], Response::HTTP_INTERNAL_SERVER_ERROR));
        }
    }

    /**
     * Enable Service
     * @Rest\Put("/services/{id}/subscribers/{subscriber_id}")
     * @param Request $request
     *
     * @return Response
     */
    public function enableServiceAction(Request $request)
    {
        throw new Exception('Not implemented');
    }

    /**
     * Disable Service for Subscriber
     * @Rest\Delete("/services/{id}/subscribers/{subscriber_id}")
     * @param Request $request
     *
     * @return Response
     */
    public function disableServiceAction(Request $request)
    {
        throw new Exception('Not implemented');
    }
}
