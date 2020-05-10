<?php declare(strict_types=1);

use PHPUnit\Framework\TestCase;

final class VocabularyTest extends TestCase
{
    protected $subject;
    protected $options;

    protected function setUp(): void
    {
        $this->options = require __DIR__ . '/../../test.config.php';
        $fixtureFile = __DIR__ . '/../../fixtures/input.txt';

        $source = $this->options['source'];
        $source = new $source['provider']($fixtureFile, $source['options']);

        $storage = $this->options['storage'];
        $storage = new $storage['provider']($storage['options']);

        $this->subject = new Vocabulary\Vocabulary($fixtureFile, $source, $storage, $this->options);

    }

    public function testLoad() {
        $this->subject->load();
        $fileName = crc32('lorem') % $this->options['storage']['options']['capacity'];
        $this->assertTrue(file_exists(__DIR__ . "/../../tmp/$fileName.wbv"), "File `$fileName.wbv` must exists" );
    }

    public function testCount() {
        $this->subject->load();
        $this->assertEquals(2, $this->subject->count('lorem'), 'Lorem must occurred twice in fixture text');
        $this->assertEquals(2, $this->subject->count('ipsum'), 'Ipsum must occurred twice in fixture text');
    }

    protected function tearDown(): void
    {
        $files = glob($this->options['storage']['options']['dir'] . '/*');
        foreach ($files as $file) {
            if (is_file($file)) {
                unlink($file);
            }
        }
    }
}
