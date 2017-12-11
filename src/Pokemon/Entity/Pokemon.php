<?php

namespace App\Pokemon\Entity;

class Pokemon
{
    protected $id;
    protected $name;
    protected $image;
    protected $gen;
    protected $type;
    protected $height;
    protected $weight;
    protected $evolution;

    public function __construct($id, $name, $image, $gen, $type, $height, $weight, $evolution)
    {
        $this->id = $id;
        $this->name = $name;
        $this->image =  $image;
        $this->gen =  $gen;
        $this->type =  $type;
        $this->height =  $height;
        $this->weight =  $weight;
        $this->evolution =  $evolution;
    }

    public function  to_json(){
        return json_encode(array(
            'id' => $this->id,
            'name' => $this->name,
            'image' => $this->image,
            'gen' => $this->gen ,
            'type' => $this->type,
            'height' => $this->height,
            'weight' => $this->weight,
            'evolution' => $this->evolution
        ));
    }

}