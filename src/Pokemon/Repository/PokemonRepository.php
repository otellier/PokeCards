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
     * Returns a collection of pokemons.
     *
     * @param int $limit
     *   The number of users to return.
     * @param int $offset
     *   The number of users to skip.
     * @param array $orderBy
     *   Optionally, the order by info, in the $column => $direction format.
     *
     * @return array A collection of pokemons, keyed by pokemon id.
     */
    public function getAll()
    {
        $queryBuilder = $this->db->createQueryBuilder();
        $queryBuilder
            ->select('p.*')
            ->from('pokemon', 'p');

        $statement = $queryBuilder->execute();
        $pokemonsData = $statement->fetchAll();
        $pokemonEntityList = null;
        foreach ($pokemonsData as $pokemonData) {
            $pokemonEntityList[$pokemonData['id']] = new pokemon(
                $pokemonData['id'],
                $pokemonData['name'],
                $pokemonData['image'],
                $pokemonData['gen'],
                $pokemonData['type'],
                $pokemonData['height'],
                $pokemonData['weight'],
                $pokemonData['evolution']
            );
        }

        return $pokemonEntityList;
    }

    /**
     * Returns an pokemon object.
     *
     * @param $id
     *   The id of the pokemon to return.
     *
     * @return array A collection of pokemons, keyed by pokemon id.
     */
    public function getById($id)
    {
        $queryBuilder = $this->db->createQueryBuilder();
        $queryBuilder
            ->select('p.*')
            ->from('pokemon', 'p')
            ->where('id = ?')
            ->setParameter(0, $id);
        $statement = $queryBuilder->execute();
        $pokemonData = $statement->fetchAll();

        return new pokemon(
            $pokemonData[0]['id'],
            $pokemonData[0]['name'],
            $pokemonData[0]['image'],
            $pokemonData[0]['gen'],
            $pokemonData[0]['type'],
            $pokemonData[0]['height'],
            $pokemonData[0]['weight'],
            $pokemonData[0]['evolution']
        );
    }

    public function delete($id)
    {
        $queryBuilder = $this->db->createQueryBuilder();
        $queryBuilder
            ->delete('pokemon')
            ->where('id = :id')
            ->setParameter(':id', $id);

        $statement = $queryBuilder->execute();
    }

    public  function deleteAll(){
        // DROP TABLE pokemon
        $queryBuilder = $this->db->createQueryBuilder();
        $queryBuilder
            ->delete('pokemon');
        $statement = $queryBuilder->execute();

        // DROP TABLE pokemon_evolution
        $queryBuilder = $this->db->createQueryBuilder();
        $queryBuilder
            ->delete('pokemon_evolution');
        $statement = $queryBuilder->execute();

        // DROP TABLE pokemon_type
        $queryBuilder = $this->db->createQueryBuilder();
        $queryBuilder
            ->delete('pokemon_type');
        $statement = $queryBuilder->execute();

        // DROP TABLE type
        $queryBuilder = $this->db->createQueryBuilder();
        $queryBuilder
            ->delete('type');
        $statement = $queryBuilder->execute();
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

    public function insertType($parameters)
    {

        $this->deleteAll();

        // TABLE pokemon
        $queryBuilder = $this->db->createQueryBuilder();
        $count = 0;
        foreach ($parameters as $_type) {
            $queryBuilder
                ->insert('type')
                ->values(
                    array(
                        'id' => ':id',
                        'name' => ':name'
                    )
                )
                ->setParameter(':id', $count)
                ->setParameter(':name', $_type);
            $statement = $queryBuilder->execute();
        }
    }

//TODO UPDATE
/*
    public function update($parameters)
    {
        $queryBuilder = $this->db->createQueryBuilder();
        $queryBuilder
            ->update('pokemon')
            ->where('id = :id')
            ->setParameter(':id', $parameters['id']);

        if ($parameters['nom']) {
            $queryBuilder
                ->set('nom', ':nom')
                ->setParameter(':nom', $parameters['nom']);
        }

        if ($parameters['prenom']) {
            $queryBuilder
                ->set('prenom', ':prenom')
                ->setParameter(':prenom', $parameters['prenom']);
        }

        $statement = $queryBuilder->execute();
    }
*/
}
