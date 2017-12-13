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
        $list_url_pokemon = array();
        $list_pokemon = array();

        $client = new Client();


        ////////////
        /// REQUEST GET ALL URL OF THE POKEMONS
        ///
        $res = $client->request('GET',
            'https://pokeapi.co/api/v2/pokemon/?limit=6&offset=0');


        if($res->getStatusCode() == 200){
            $contents = $res->getBody()->getContents();
            $temp = json_decode($contents);

            $json = $temp->results;

            foreach ($json as $p){
                array_push($list_url_pokemon, $p->url);
            }
        }

        /// foreach url in the array we make a get request
        foreach ($list_url_pokemon as $url) {
            // Variables Pokemon
            $gen = null;
            $type = array();
            $evolution =array();

            ////////////
            /// REQUEST GET ALL THE BASICS INFO OF POKEMONS
            ///
            $res = $client->request('GET', $url);

            if ($res->getStatusCode() == 200) {
                $contents = $res->getBody()->getContents();
                $pokemon = json_decode($contents);

                $temp = new Pokemon(
                    $pokemon->id,
                    $pokemon->name,
                    $pokemon->sprites->front_default,
                    $gen,
                    $type,
                    $pokemon->height,
                    $pokemon->weight,
                    $evolution
                );
                array_push($list_pokemon, json_decode($temp->to_json(), true));
            }
        }
        //$return = json_encode(array('previous'=>$_SERVER['REQUEST_URI'] ,$list_pokemon,'next'=>$_SERVER['REQUEST_URI']));
        $return = json_encode($list_pokemon);
        return new Response($return,Response::HTTP_OK, array('content-type' => 'application/json'));
    }


    public function listofuserAction(Request $request, Application $app)
    {
        $parameters = $request->attributes->all();
        $id_user = $app['repository.user']->getUserByTokenFacebook($parameters['token']);

        if($id_user != null) {
            $list_pokemon_id = $app['repository.pokemon']->getAllUserCards($id_user);


            $list_pokemon = array();

            $client = new Client();

            /// foreach url in the array we make a get request
            foreach ($list_pokemon_id as $pokemon_id) {
                // Variables Pokemon
                $gen = null;
                $type = array();
                $evolution = array();

                ////////////
                /// REQUEST GET ALL THE BASICS INFO OF POKEMONS
                ///
                $res = $client->request('GET', 'https://pokeapi.co/api/v2/pokemon/' . $pokemon_id);

                if ($res->getStatusCode() == 200) {
                    $contents = $res->getBody()->getContents();
                    $pokemon = json_decode($contents);

                    $temp = new Pokemon(
                        $pokemon->id,
                        $pokemon->name,
                        $pokemon->sprites->front_default,
                        $gen,
                        $type,
                        $pokemon->height,
                        $pokemon->weight,
                        $evolution
                    );

                    array_push($list_pokemon, json_decode($temp->to_json(), true));
                }
            }
            //$return = json_encode(array('previous'=>$_SERVER['REQUEST_URI'] ,$list_pokemon,'next'=>$_SERVER['REQUEST_URI']));
            $return = json_encode($list_pokemon);
            return new Response($return, Response::HTTP_OK, array('content-type' => 'application/json'));
        }else{
            return new Response(null, Response::HTTP_NO_CONTENT, array('content-type' => 'application/json'));
        }
    }
    
/*

    public function getAction(Request $request, Application $app)
    {
        $parameters = $request->request->all();


        $list_url_pokemon = array();
        $list_pokemon = array();

        $client = new Client();




        ////////////
        /// REQUEST GET ALL URL OF THE POKEMONS
        ///
        $res = $client->request('GET',
            'https://pokeapi.co/api/v2/pokemon/'.$parameters['id']);


        if($res->getStatusCode() == 200){

        }else {
        }

            // Variable URLS
            $url_species = null;
            $url_evolution = null;
            $list_url_evolution = array();

            // Variables Pokemon

            $id = null;
            $name= null;
            $image= null;
            $gen = null;
            $type = array();
            $height = null;
            $weight = null;
            $evolution =array();

            ////////////
            /// REQUEST GET ALL THE BASICS INFO OF POKEMONS
            ///
            $res = $client->request('GET', $url);

            if ($res->getStatusCode() == 200) {
                $contents = $res->getBody()->getContents();
                $pokemon = json_decode($contents);

                // Type
                $id= $pokemon->id;
                $name = $pokemon->name;
                $image = $pokemon->sprites->front_default;
                $height = $pokemon->height;
                $weight = $pokemon->weight;

                $url_species =  $pokemon->species->url;
            }


            ////////////
            /// REQUEST GET GENERATION OF POKEMONS
            ///
            if($url_species != null) {
                $res = $client->request('GET', $url_species);

                if ($res->getStatusCode() == 200) {
                    $contents = $res->getBody()->getContents();
                    $pokemon = json_decode($contents);

                    //POKEMON generation + url evolution
                    $gen = $pokemon->generation->name;
                    $url_evolution = $pokemon->evolution_chain->url;
                }
            }


            ////////////
            /// REQUEST GET URLS OF EVOLUTIONS OF POKEMONS
            ///
            if($url_evolution != null) {
                $res = $client->request('GET', $url_evolution);

                if ($res->getStatusCode() == 200) {
                    $contents = $res->getBody()->getContents();
                    $pokemon = json_decode($contents);

                    foreach ($pokemon->chain->evolves_to as $_evol) {
                        array_push($list_url_evolution, $_evol->species->url);
                        foreach ($_evol->evolves_to as $_evol2) {
                            array_push($list_url_evolution, $_evol2->species->url);
                        }
                    }
                }
            }


            ////////////
            /// REQUEST GET EVOLUTIONS OF POKEMONS
            ///
            foreach ($list_url_evolution as $evol){
                $res = $client->request('GET', $evol);

                if ($res->getStatusCode() == 200) {
                    $contents = $res->getBody()->getContents();
                    $pokemon = json_decode($contents);
                    if($pokemon->id > $id)
                        array_push($evolution, $pokemon->id);


                }
            }


            $temp = new Pokemon(
                $id,
                $name,
                $image,
                $gen,
                $type,
                $height,
                $weight,
                $evolution
            );

            array_push($list_pokemon, json_decode($temp->to_json(),true ));

        $return = json_encode($list_pokemon);

        return new Response($return,Response::HTTP_OK, array('content-type' => 'application/json'));
    }

*/

}