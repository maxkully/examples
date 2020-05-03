<?php

namespace BDT\Listener;

use Psr\Log\LoggerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class ExceptionListener implements EventSubscriberInterface
{
    protected $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    /**
     * Use `console debug:event-dispatcher kernel.exception` command to check
     * if underlying listeners are in correct priority orders.
     *
     * {@inheritdoc}
     */
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::EXCEPTION => [
                ['handleException', 100]
            ]
        ];
    }

    public function handleException(ExceptionEvent $event)
    {
        $exception = $event->getThrowable();

        $this->logger->critical($exception);
    }
}
