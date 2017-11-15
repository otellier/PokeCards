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
            array(0 => "fire", 1 => "stone"),
            1.90,
            70,
            array(0 => 6667, 1 => 6668)
            );
        $pok2 = new Pokemon(6667,
            'david goodenough',
            '¯\_(ツ)_/¯',
            'https://i.ytimg.com/vi/hhiTV5OQlOY/maxresdefault.jpg',
            '21/20',
            array(0 => "fire"),
            2.1,
            90,
            array()
        );

       $content =json_encode(array(json_decode($pok->to_json(), true),json_decode($pok2->to_json(), true)));



       return new Response($content,Response::HTTP_OK, array('content-type' => 'application/json'));
    }

    public function loadAction(Request $request, Application $app)
    {
        $list_url_pokemon = array();
        $list_pokemon = array();

        $client = new Client();

        // REQUEST GET ALL URL OF THE POKEMONS
        $res = $client->request('GET',
            'https://pokeapi.co/api/v2/pokemon/?limit=2');


       if($res->getStatusCode() == 200){
           $contents = $res->getBody()->getContents();
           $temp = json_decode($contents);

           $json = $temp->results;

           foreach ($json as $p){
               array_push($list_url_pokemon, $p->url);
           }
           //$lists =json_encode($list);
       }


       // foreach url in the array we make a get request
       foreach ($list_url_pokemon as $url){
           $res = $client->request('GET',
               $url);

           if($res->getStatusCode() == 200) {
               $contents = $res->getBody()->getContents();

               $pokemon = json_decode($contents);

               // Get the gen + evolution
               $res2 = $client->request('GET',
                   $pokemon->species->url);

               if($res2->getStatusCode() == 200) {
                   $contents2 = $res2->getBody()->getContents();
                   $pokemon_gen_evolution = json_decode($contents2);

                   //POKEMON gen
                   print_r($pokemon_gen_evolution->species->name);

                   // Get the evolution chain
               }

               //POKEMON INFO
               print_r($pokemon->id);
               print_r($pokemon->name);
               print_r($pokemon->sprites->front_default);
               print_r($pokemon->height);
               print_r($pokemon->weight);
               echo "<br><br>";

           }
       }




       return new Response($list_url_pokemon,Response::HTTP_OK, array('content-type' => 'application/json'));


       // If using JSON...
        //$content = $response;
        //return new Response($content,Response::HTTP_OK, array('content-type' => 'application/json'));
    }
}