<?php

namespace BDT\MessageHandler;

use BDT\Entity\Log;
use BDT\Entity\User;
use BDT\Message\ActionLog;
use BDT\Repository\UserRepository;
use Symfony\Component\Messenger\Handler\MessageHandlerInterface;
use Doctrine\ORM\EntityManagerInterface;

class ActionLogHandler implements MessageHandlerInterface
{
    /** @var UserRepository */
    private $userRepository;

    /** @var EntityManagerInterface */
    private $entityManager;


    public function __construct(UserRepository $userRepository, EntityManagerInterface $entityManager)
    {
        $this->userRepository = $userRepository;
        $this->entityManager = $entityManager;
    }

    public function __invoke(ActionLog $message)
    {
        /** @var User $user */
        $user = $this->userRepository->find($message->userId);

        $log = new Log();
        $log->setUser($user);
        $log->setEntityId($message->entityId);
        $log->setAction($message->action);
        $log->setEntity($message->entity);
        $log->setRef($message->ref);
        $log->setRefId($message->refId);
        $log->updatedTimestamps();

        $this->entityManager->persist($log);
        $this->entityManager->flush();

    }
}
