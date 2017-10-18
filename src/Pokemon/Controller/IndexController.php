<?php

namespace App\Pokemon\Controller;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
class IndexController
{
    public function listAction(Request $request, Application $app)
    {
      $content = json_encode('Salameche');
      return new Response($content,Response::HTTP_OK, array('content-type' => 'application/json'));
    }

}
