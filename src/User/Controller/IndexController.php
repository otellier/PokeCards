<?php

namespace App\User\Controller;

use App\User\Entity\User;
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class IndexController
{
    public function newAction(Request $request, Application $app)
    {
        $parameters = $request->request->all();

        if ($app['repository.user']->getUserByTokenFacebook($parameters['token_facebook']) == null) {
            $content = json_encode(json_decode($app['repository.user']->insert($parameters)->to_json(), true));
            return new Response( $content, Response::HTTP_OK, array('content-type' => 'application/json'));
        }else{
            return new Response(null, Response::HTTP_CONFLICT, array('content-type' => 'application/json'));
        }
    }

    public function connectAction(Request $request, Application $app)
    {
        $parameters = $request->attributes->all();
        $content = $app['repository.user']->getUserByTokenFacebook($parameters['token']);
        if (!is_null($content)) {
            $content = json_encode(json_decode($content->to_json(), true));
            return new Response( $content, Response::HTTP_OK, array('content-type' => 'application/json'));
        }else{
            return new Response(null, Response::HTTP_METHOD_NOT_ALLOWED, array('content-type' => 'application/json'));
        }
    }
}
