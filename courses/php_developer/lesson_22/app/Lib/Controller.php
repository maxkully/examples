<?php

namespace RightWay\Lib;

abstract class Controller {
    private $templateEngine;

    public function __construct($templateEngine)
    {
        $this->templateEngine = $templateEngine;
    }

    protected function render(string $template, array $params) {
        $template = $this->templateEngine->load($template . ".html");
        echo $template->render($params);
    }
}