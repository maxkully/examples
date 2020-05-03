<?php

namespace BDT\Tests\Controller;

use BDT\Tests\Helpers\LoginHelper;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class MobileServiceControllerTest extends WebTestCase
{
    private $client;

    protected function setUp(): void
    {
        $this->client = LoginHelper::getAuthorizedClient();
    }

    public function testUnauthorizedAccess() {
        $client = static::createClient();

        $client->request('POST', '/api/services');
        $this->assertEquals(401, $client->getResponse()->getStatusCode());
    }

    public function testGetServices()
    {
        $this->client->request('GET', '/api/services');
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
    }

    public function testGetNotFound()
    {
        $this->client->request('GET', '/api/services/1111111111111111');
        $this->assertEquals(404, $this->client->getResponse()->getStatusCode());
    }
}
