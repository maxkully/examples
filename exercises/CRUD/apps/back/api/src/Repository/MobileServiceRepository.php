<?php

namespace BDT\Repository;

use BDT\Entity\MobileService;
use BDT\Entity\Subscriber;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\DBAL\Connection;
use Doctrine\Persistence\ManagerRegistry;
use Psr\Log\LoggerInterface;
use Symfony\Component\Serializer\NameConverter\CamelCaseToSnakeCaseNameConverter as CamelCase;
use function Symfony\Component\DependencyInjection\Loader\Configurator\expr;

class MobileServiceRepository extends ServiceEntityRepository
{
    public static $DEFAULT_LIMIT = 5;
    /** @var  SubscriberRepository */
    private $subscrRepo;

    /** @var LoggerInterface */
    private $logger;

    public function __construct(ManagerRegistry $registry, SubscriberRepository $subscrRepo, LoggerInterface $logger)
    {
        parent::__construct($registry, MobileService::class);

        $this->subscrRepo = $subscrRepo;
        $this->logger = $logger;
    }

    public function forSubscriber($id)
    {
        $this->logger->debug('[MobileServiceRepository:forSubscriber] Received subscriber `'. $id);
        $services = [];
        $subscriber = $this->subscrRepo->find($id);
        /** @var Subscriber $subscriber */
        if ($subscriber) {
            foreach ($subscriber->getServices() as $service) {
                $services[] = $service->getId();
            }
            $this->logger->debug('[MobileServiceRepository:forSubscriber] for subscriber `'. $id. '` found services: '. print_r($services, 1));
        }

        $qb = $this->createQueryBuilder('ms')
            ->where('ms.id NOT IN (:services)')
            ->setParameter('services', $services, Connection::PARAM_STR_ARRAY);
        $query = $qb->getQuery();

        return $query->execute();
    }
}
