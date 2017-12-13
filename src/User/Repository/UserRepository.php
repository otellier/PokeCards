<?php

namespace App\User\Repository;

use App\User\Entity\User;
use Doctrine\DBAL\Connection;

/**
 * User repository.
 */
class UserRepository
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
     * Returns user by his token_facebook.
     *
     * @param $token_facebook
     *   The token_facebook of the user to return.
     *
     * @return \App\User\Entity\User
     */
    public function getUserByTokenFacebook($token_facebook)
    {
        $queryBuilder = $this->db->createQueryBuilder();
        $queryBuilder
            ->select('u.*')
            ->from('user', 'u')
            ->where('token_facebook = ?')
            ->setParameter(0, $token_facebook);
        $statement = $queryBuilder->execute();
        $userData = $statement->fetchAll();
        if($statement->rowCount() != 0) {
            return new User(['id'], $userData[0]['username'], $userData[0]['coins'], $userData[0]['token_facebook']);
        }else{
            return null;
        }
    }



}
