<?php

// @todo: find more elegant way, dive deeper to phpunit docs
class Fixtures {
    private static $instance;

    private $storage;

    public static function instance() {
        if (!isset(self::$instance)) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    private function __construct()
    {
        $this->load();
    }

    public function get($name) {
        return $this->storage[$name] ?? [];
    }

    private function load() {
        foreach (glob("tests/fixtures/*.json") as $filename)
        {
            $content = file_get_contents($filename);
            $this->storage[basename($filename, '.json')] = json_decode($content, true);
        }
    }
}
