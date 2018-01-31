<?php

namespace App\User\Entity;

class User
{
    protected $id;

    protected $username;

    protected $token_facebook;

    protected $coins;

    /**
     * User constructor.
     *
     * @param $username
     * @param $token_facebook
     * @param $coins
     */
    public function __construct($username, $coins, $token_facebook)
    {

        $this->username = $username;
        $this->coins = $coins;
        $this->token_facebook = $token_facebook;
    }


    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * @param mixed $username
     */
    public function setUsername($username)
    {
        $this->username = $username;
    }

    /**
     * @return mixed
     */
    public function getTokenFacebook()
    {
        return $this->token_facebook;
    }

    /**
     * @param mixed $token_facebook
     */
    public function setTokenFacebook($token_facebook)
    {
        $this->token_facebook = $token_facebook;
    }

    /**
     * @return mixed
     */
    public function getCoins()
    {
        return $this->coins;
    }

    /**
     * @param mixed $coins
     */
    public function setCoins($coins)
    {
        $this->coins = $coins;
    }

    public function toArray()
    {
        $array = array();
        $array['id'] = $this->id;
        $array['username'] = $this->username;
        $array['coins'] = $this->coins;
        $array['token_facebook'] = $this->token_facebook;
        return $array;
    }

    public function  to_json(){
        return json_encode(array(
            'username' => $this->username,
            'coins' => $this->coins ,
            'token_facebook' => $this->token_facebook
        ));
    }
}
