<?php

namespace App\Pokemon\Controller;

use App\Pokemon\Entity\Pokemon;
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use GuzzleHttp\Client;

class IndexController
{
    public function listAction(Request $request, Application $app)
    {
        $pok = new Pokemon(6666,
            'briseur de tendon',
            'Brise les tendons de ses ennemis avant de crier : Yeee!',
            'http://i0.kym-cdn.com/entries/icons/original/000/016/362/tumblr_nb7jgq9kcR1slfxluo1_1280.jpg',
            '21/20',
            'Yeee!',
            1.90,
            70,
            array(0 => '666', 1 => '667')
            );

       $content = $pok->to_json();
        //$content += $pok->to_json();


       return new Response($content,Response::HTTP_OK, array('content-type' => 'application/json'));
    }

    public function loadAction(Request $request, Application $app)
    {
        $client = new Client();
        $res = $client->request('GET', 'https://pokeapi.co/api/v2/pokemon/?limit=1');

       if($res->getStatusCode() == 200){
           $contents = $res->getBody()->getContents();
           $pok = json_decode($contents);
           //echo $pok->results;
           $list = $pok->results;
           $lists =json_encode($list);
           //echo $contents;
       }

       return new Response($lists,Response::HTTP_OK, array('content-type' => 'application/json'));


       // If using JSON...
        //$content = $response;
        //return new Response($content,Response::HTTP_OK, array('content-type' => 'application/json'));
    }
}