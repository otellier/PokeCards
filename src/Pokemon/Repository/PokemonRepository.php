<?php

namespace App\pokemon\Repository;

use App\pokemon\Entity\pokemon;
use Doctrine\DBAL\Connection;

/**
 * pokemon repository.
 */
class pokemonRepository
{
    /**
     * @var \Doctrine\DBAL\Connection
     */
    protected $db;

    public function __construct(Connection $db)
    {
        $this->db = $db;
    }

    /**
     * Returns a collection of id of pokemons.
     *
     * @param array $orderBy
     *   Optionally, the order by info, in the $column => $direction format.
     *
     * @return array A collection of pokemons, keyed by pokemon id.
     */
    public function getAllUserCards()
    {
        $queryBuilder = $this->db->createQueryBuilder();
        $queryBuilder
            ->select('c.id')
            ->from('user_cards', 'c')
            ->orderBy('c.id','ASC');

        $statement = $queryBuilder->execute();
        $pokemonListIdData= $statement->fetchAll();

        $pokemonListId =array();
        foreach ($pokemonListIdData as $pokemonId){
            array_push($pokemonListId,$pokemonId['id']);
        }

        return $pokemonListId;
    }

    public function insert($parameters)
    {
        // TABLE pokemon
        $queryBuilder = $this->db->createQueryBuilder();
        $queryBuilder
            ->insert('pokemon')
            ->values(
                array(
                    'id'        => ':id',
                    'name'      => ':name',
                    'image'     => ':image',
                    'gen'       => ':gen',
                    'gen'       => ':id',
                    'height'    => ':height',
                    'height'    => ':height',
                )
            )
            ->setParameter(':id', $parameters['id'])
            ->setParameter(':name', $parameters['name'])
            ->setParameter(':image', $parameters['image'])
            ->setParameter(':gen', $parameters['gen'])
            ->setParameter(':height', $parameters['height'])
            ->setParameter(':weight', $parameters['weight'])
            ->setParameter(':evolution', $parameters['evolution']);
        $statement = $queryBuilder->execute();

        // TABLE pokemon_type
        foreach ($parameters['type'] as $type) {

            // GET ALL TYPES (in our array) WITH NAME
            $queryBuilder = $this->db->createQueryBuilder();
            $queryBuilder
                ->select('t.*')
                ->from('type', 't')
                ->where('name = ?')
                ->setParameter(0, $parameters['type']);
            $statement = $queryBuilder->execute();
            $typeData = $statement->fetchAll();

            $type_id = $typeData[0]['id'];

            $queryBuilder = $this->db->createQueryBuilder();
            $queryBuilder
                ->insert('pokemon_type')
                ->values(
                    array(
                        'id_pokemon' => ':id_pokemon',
                        'id_type' => ':id_type'
                    )
                )
                ->setParameter(':id_pokemon', $parameters['id'])
                ->setParameter(':id_type', $type_id);
            $statement = $queryBuilder->execute();
        }

        // TABLE pokemon_evolution
        foreach ($parameters['evolution'] as $evolution) {
            $queryBuilder = $this->db->createQueryBuilder();
            $queryBuilder
                ->insert('pokemon_evolution')
                ->values(
                    array(
                        'id_pokemon' => ':id_pokemon',
                        'id_evolution' => ':id_evolution'
                    )
                )
                ->setParameter(':id_pokemon', $parameters['id'])
                ->setParameter(':id_evolution', $evolution);
            $statement = $queryBuilder->execute();
        }
    }


}
