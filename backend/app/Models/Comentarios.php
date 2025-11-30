<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comentarios extends Model
{
    protected $fillable = [
        'lugar_id',
        'hospedaje_id', // ✅ AÑADIDO
        'usuario_id',
        'contenido',
        'rating',
        'image_path',
        'category'
    ];
    
    protected $table = 'comentarios'; 

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }
    
    public function lugar()
    {
        return $this->belongsTo(Lugares::class, 'lugar_id');
    }
    
    // ✅ AÑADIDO: Relación con hospedajes
    public function hospedaje()
    {
        return $this->belongsTo(Hospedaje::class, 'hospedaje_id');
    }
}