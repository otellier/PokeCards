<?php

$app->get('/user/list', 'App\User\Controller\IndexController::listAction')->bind('users.list');
$app->get('/user/edit/{id}', 'App\User\Controller\IndexController::editAction')->bind('users.edit');
$app->post('/user/delete/{id}', 'App\User\Controller\IndexController::deleteAction')->bind('users.delete');
$app->post('/user/save', 'App\User\Controller\IndexController::saveAction')->bind('users.save');




$app->get('/pokemon/list', 'App\Pokemon\Controller\IndexController::listAction')->bind('pokemon.list');
$app->get('/pokemon/list/{token}', 'App\Pokemon\Controller\IndexController::listofuserAction')->bind('pokemon.listofuser');

$app->post('/user/new', 'App\User\Controller\IndexController::newAction')->bind('users.new');