<?php
$app->get('/pokemon/list', 'App\Pokemon\Controller\IndexController::listAction')->bind('pokemon.list');
$app->get('/pokemon/list/{token}', 'App\Pokemon\Controller\IndexController::listofuserAction')->bind('pokemon.listofuser');

$app->get('/user/{token}', 'App\User\Controller\IndexController::connectAction')->bind('user.connect');
$app->post('/user/new', 'App\User\Controller\IndexController::newAction')->bind('user.new');