<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comentarios extends Model
{
    protected $fillable = ['lugar_id', 'usuario_id', 'contenido', 'rating', 'image_path', 'category'];
    protected $table = 'comentarios'; 

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }
}