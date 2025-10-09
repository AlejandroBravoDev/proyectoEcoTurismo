<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\Municipios; 

class Lugares extends Model
{
    protected $fillable = [
        'nombre', 
        'descripcion', 
        'ubicacion', 
        'municipio_id', 
        'hoteles_cercanos',
        'comentarios', 
        'imagenes',
        'recomendaciones'
    ];

    protected $casts = [
        'hoteles_cercanos' => 'array', 
        'comentarios' => 'array',      
        'imagenes' => 'array',        
    ];
   
    public function municipio()
    {
        return $this->belongsTo(Municipios::class, 'municipio_id');
    }
}
