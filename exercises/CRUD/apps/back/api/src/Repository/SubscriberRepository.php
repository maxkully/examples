<?php

namespace BDT\Repository;

use BDT\Entity\Subscriber;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Serializer\NameConverter\CamelCaseToSnakeCaseNameConverter as CamelCase;

class SubscriberRepository extends ServiceEntityRepository
{
    public static $DEFAULT_LIMIT = 5;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Subscriber::class);
    }

    public function list($filter, $sorting, $paging)
    {
        $converter = new CamelCase();

        $field = $sorting['field'] ?? 'created_at';
        $direction = $sorting['direction'] ?? 'DESC';
        $limit = $paging['limit'] ?? self::$DEFAULT_LIMIT;
        $offset = $paging['offset'] ?? 0;
        $phone = $filter['phone'] ?? '%%';
        $from = $filter['created_at']['from'];
        $to = $filter['created_at']['to'];

        $qb = $this->createQueryBuilder('s')
            ->where('s.phone LIKE :phone')
            ->setParameter('phone', '%' . $phone . '%')
            ->orderBy('s.'. $converter->denormalize($field), $direction)
            ->setMaxResults((int) $limit ? $limit : self::$DEFAULT_LIMIT);

        if ($from) {
            $qb->andWhere('s.createdAt >= :fromDate')->setParameter('fromDate', $from . " 00:00:00");
        }

        if ($to) {
            $qb->andWhere('s.createdAt <= :toDate')->setParameter('toDate', $to . " 23:59:59");
        }
        $query = $qb->getQuery();

        return $query->execute();
    }
}
