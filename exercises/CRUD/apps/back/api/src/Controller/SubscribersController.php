<?php

namespace BDT\Controller;

use BDT\Entity\MobileService;
use BDT\Message\ActionLog;
use BDT\Repository\SubscriberRepository;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\Messenger\MessageBusInterface;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use BDT\Entity\Subscriber;
use BDT\Form\SubscriberType;
use BDT\Service\Locking;

/**
 * Movie controller.
 * @Route("/api", name="api_")
 */
class SubscribersController extends AbstractFOSRestController
{
    /** @var LoggerInterface */
    private $logger;
    private $bus;
    /**
     * @var SubscriberRepository
     */
    private $repository;

    public function __construct(LoggerInterface $logger, MessageBusInterface $bus, SubscriberRepository $repository)
    {
        $this->logger = $logger;
        $this->bus = $bus;
        $this->repository = $repository;
    }

    public function log($entity, $action, $ref = null)
    {
        if (!$this->getUser()) {
            throw new UnauthorizedHttpException('Current user is empty');
        }

        try {
            if (isset($ref)) {
                $refId = $ref->getId();
                $refName = get_class($ref);
            } else{
                $refId = $refName = null;
            }
            $this->bus->dispatch(new ActionLog($this->getUser()->getId(), $entity->getId(), get_class($entity), $action, $refId, $refName));
        } catch (\Exception $e) {
            $this->logger->critical(get_class($e) . ': ' . $e->getMessage());
            $this->logger->debug($e->getTraceAsString());
        }
    }

    /**
     * Lists all subscribers
     * @Rest\Get("/subscribers")
     *
     * @return Response
     */
    public function getSubscribersAction(Request $request)
    {
        try {
            $response = [];
            $filter = [
                'created_at' => $request->query->get('created_at'),
                'phone' => $request->query->get('phone'),
            ];
            $sorting = $request->query->get('sorting');
            $paging = $request->query->get('paging');

            $objects = $this->repository->list($filter, $sorting, $paging);

            // validate field
            $columns = $this->getDoctrine()->getManager()->getClassMetadata(Subscriber::class)->getColumnNames();
            if (!in_array($sorting['field'] ?? '', $columns)) {
                unset($sorting['field']);
            }

            // validate and transform dates
            $created_at = $filter['created_at'] ?? [];
            if ($created_at['from'] !== date('Y-m-d', strtotime($created_at['from']))) {
                unset($created_at['from']);
            }
            if ($created_at['to'] !== date('Y-m-d', strtotime($created_at['to']))) {
                unset($created_at['to']);
            }
            $filter['created_at'] = $created_at;

            /** @var Subscriber $obj */
            foreach ($objects as $obj) {
                $response[] = $obj->serialize();
            }

            return $this->handleView($this->view($response));
        } catch (\Exception $e) {
            $this->logger->error(get_class($e) . ': ' . $e->getMessage());
            $this->logger->debug($e->getTraceAsString());

            return $this->handleView($this->view(['message' => 'error.unexpected'], Response::HTTP_INTERNAL_SERVER_ERROR));
        }
    }

    /**
     * Create subscriber.
     * @Rest\Post("/subscribers")
     * @param Request $request
     *
     * @return Response
     */
    public function createSubscriberAction(Request $request)
    {
        try {
            $obj = new Subscriber();
            $data = json_decode($request->getContent(), true);
            $form = $this->createForm(SubscriberType::class, $obj);
            $form->submit($data);
            if ($form->isSubmitted() && $form->isValid()) {
                $em = $this->getDoctrine()->getManager();
                $em->persist($obj);
                $em->flush();
                $this->log($obj, ActionLog::$CREATE);

                return $this->handleView($this->view($obj->serialize(), Response::HTTP_CREATED));
            }

            return $this->handleView($this->view($form->getErrors(), Response::HTTP_BAD_REQUEST));
        } catch (UniqueConstraintViolationException $e) {
            return $this->handleView($this->view(['message' => 'subscriber.title.unique.violation'], Response::HTTP_BAD_REQUEST));
        } catch (\Exception $e) {
            $this->logger->error(get_class($e) . ': ' . $e->getMessage());
            $this->logger->debug($e->getTraceAsString());

            return $this->handleView($this->view(['message' => 'error.unexpected'], Response::HTTP_INTERNAL_SERVER_ERROR));
        }
    }

    /**
     * Update subscriber
     * @Rest\Get("/subscribers/{id}")
     * @param Request $request
     *
     * @return Response
     */
    public function showSubscriberAction(Request $request)
    {
        try {
            /** @var Subscriber $obj */
            $obj = $this->getDoctrine()->getRepository(Subscriber::class)->find($request->get('id'));
            if (!$obj) {
                return $this->handleView($this->view([], Response::HTTP_NOT_FOUND));
            }

            return $this->handleView($this->view($obj->serialize(true)));
        } catch (\Exception $e) {
            $this->logger->error($e->getMessage());
            $this->logger->debug($e->getTraceAsString());

            return $this->handleView($this->view(['message' => 'error.unexpected'], Response::HTTP_INTERNAL_SERVER_ERROR));
        }
    }

    /**
     * Update subscriber
     * @Rest\Put("/subscribers/{id}")
     * @param Request $request
     *
     * @return Response
     */
    public function updateSubscriberAction(Request $request)
    {
        try {
            /** @var Subscriber $obj */
            $obj = $this->getDoctrine()->getRepository(Subscriber::class)->find($request->get('id'));
            if (!$obj) {
                return $this->handleView($this->view([], Response::HTTP_NOT_FOUND));
            }

            $data = json_decode($request->getContent(), true);
            $form = $this->createForm(SubscriberType::class, $obj);

            $form->submit($data);
            if ($form->isSubmitted() && $form->isValid()) {
                $em = $this->getDoctrine()->getManager();
                $em->persist($obj);
                $em->flush();
                $this->log($obj, ActionLog::$UPDATE);

                return $this->handleView($this->view([], Response::HTTP_NO_CONTENT));
            }

            return $this->handleView($this->view($form->getErrors(), Response::HTTP_BAD_REQUEST));
        } catch (\Exception $e) {
            $this->logger->error($e->getMessage());
            $this->logger->debug($e->getTraceAsString());

            return $this->handleView($this->view(['message' => 'error.unexpected'], Response::HTTP_INTERNAL_SERVER_ERROR));
        }
    }

    /**
     * Delete subscriber
     * @Rest\Delete("/subscribers/{id}")
     * @param Request $request
     *
     * @return Response
     */
    public function deleteSubscriberAction(Request $request)
    {
        try {
            $em = $this->getDoctrine()->getManager();
            $obj = $em->getRepository(Subscriber::class)->find($request->get('id'));

            if (!$obj) {
                return $this->handleView($this->view(['message' => 'subscriber.not_found'], Response::HTTP_NOT_FOUND));
            }

            $this->log($obj, ActionLog::$DELETE);
            $em->remove($obj);
            $em->flush();

            return $this->handleView($this->view([], Response::HTTP_NO_CONTENT));
        } catch (\Exception $e) {
            $this->logger->error($e->getMessage());
            $this->logger->debug($e->getTraceAsString());

            return $this->handleView($this->view([['message' => 'error.unexpected']], Response::HTTP_INTERNAL_SERVER_ERROR));
        }
    }

    /**
     * Enable Service
     * @Rest\Put("/subscribers/{id}/services/{service_id}")
     * @param Request $request
     *
     * @return Response
     */
    public function enableServiceAction(Request $request)
    {
        try {
            /** @var Subscriber $subscriber */
            $subscriber = $this->getDoctrine()->getRepository(Subscriber::class)->find($request->get('id'));
            if (!$subscriber) {
                return $this->handleView($this->view(['message' => 'subscriber.not_found'], Response::HTTP_NOT_FOUND));
            }
            /** @var MobileService $service */
            $service = $this->getDoctrine()->getRepository(MobileService::class)->find($request->get('service_id'));
            if (!$service) {
                return $this->handleView($this->view(['message' => 'service.not_found'], Response::HTTP_NOT_FOUND));
            }

            $lock = Locking::instance()->create('subscriber.service');
            try {
                if ($lock->acquire()) {
                    $subscriber->addService($service);

                    $em = $this->getDoctrine()->getManager();
                    $em->persist($subscriber);
                    $em->persist($service);
                    $em->flush();

                    $this->log($subscriber, ActionLog::$LINK, $service);
                } else {
                    return $this->handleView($this->view(['message' => 'subscriber.service.enable.locked'], Response::HTTP_LOCKED));
                }
            } finally {
                $lock->release();
            }

            return $this->handleView($this->view([], Response::HTTP_NO_CONTENT));

        } catch (\Exception $e) {
            $this->logger->error($e->getMessage());
            $this->logger->debug($e->getTraceAsString());

            return $this->handleView($this->view(['message' => 'error.unexpected'], Response::HTTP_INTERNAL_SERVER_ERROR));
        }
    }

    /**
     * Disable Service
     * @Rest\Delete("/subscribers/{id}/services/{service_id}")
     * @param Request $request
     *
     * @return Response
     */
    public function disableServiceAction(Request $request)
    {
        try {
            /** @var Subscriber $subscriber */
            $subscriber = $this->getDoctrine()->getRepository(Subscriber::class)->find($request->get('id'));
            if (!$subscriber) {
                return $this->handleView($this->view(['message' => 'subscriber.not_found'], Response::HTTP_NOT_FOUND));
            }
            /** @var MobileService $service */
            $service = $this->getDoctrine()->getRepository(MobileService::class)->find($request->get('service_id'));
            if (!$service) {
                return $this->handleView($this->view(['message' => 'service.not_found'], Response::HTTP_NOT_FOUND));
            }

            // @todo: implement thread safety tests
            // @todo: implement through amqp
            $lock = Locking::instance()->create('subscriber.service');
            try {
                if ($lock->acquire()) {
                    $subscriber->removeService($service);

                    $em = $this->getDoctrine()->getManager();
                    $em->persist($subscriber);
                    $em->persist($service);
                    $em->flush();

                    $this->log($subscriber, ActionLog::$RELEASE, $service);
                } else {
                    return $this->handleView($this->view(['message' => 'subscriber.service.enable.locked'], Response::HTTP_LOCKED));
                }
            } finally {
                $lock->release();
            }

            return $this->handleView($this->view([], Response::HTTP_NO_CONTENT));
        } catch (\Exception $e) {
            $this->logger->error($e->getMessage());
            $this->logger->debug($e->getTraceAsString());

            return $this->handleView($this->view(['message' => 'error.unexpected'], Response::HTTP_INTERNAL_SERVER_ERROR));
        }
    }
}
