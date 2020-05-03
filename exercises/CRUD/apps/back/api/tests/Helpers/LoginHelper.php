<?php

namespace BDT\Tests\Helpers;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class LoginHelper extends WebTestCase
{
    static public function getAuthorizedClient()
    {
        $credentials = ['username' => 'admin@bdt.com', 'password' => 'admin'];
        $client = static::createClient();

        $client->request(
            'POST',
            '/api/auth/login',
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode($credentials)
        );
        $data = json_decode($client->getResponse()->getContent(), true);
        $client->setServerParameter('HTTP_Authorization', sprintf('Bearer %s', $data['token']));

        return $client;
    }
}
