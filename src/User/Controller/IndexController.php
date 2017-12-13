<?php

namespace App\User\Controller;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;

class IndexController
{



    public function deleteAction(Request $request, Application $app)
    {
        $parameters = $request->attributes->all();
        $app['repository.user']->delete($parameters['id']);

        return $app->redirect($app['url_generator']->generate('users.list'));
    }


    public function saveAction(Request $request, Application $app)
    {
        $parameters = $request->request->all();
        if ($parameters['id']) {
            $user = $app['repository.user']->update($parameters);
        } else {
            $user = $app['repository.user']->insert($parameters);
        }

        return $app->redirect($app['url_generator']->generate('users.list'));
    }

    public function newAction(Request $request, Application $app)
    {
        $parameters = $request->request->all();
        if ($parameters['token_facebook']) {

        }

        return $app['twig']->render('users.form.html.twig');
    }
}
