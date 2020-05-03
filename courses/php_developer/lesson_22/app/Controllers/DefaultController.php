<?php

namespace RightWay\Controllers;
use RightWay\Lib\Controller;
use RightWay\Lib\Request;
use RightWay\Models\Page;

class DefaultController extends Controller {
    public function index(Request $request) {
        $page = Page::where(['page' => $request->action]);
        $this->render('default', ['content' => $page->content]);
    }
}