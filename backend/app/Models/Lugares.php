<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Comentarios;
use App\Models\Municipios;

class Lugares extends Model
{
    protected $fillable = [
        'nombre',
        'descripcion',
        'ubicacion',
        'municipio_id',
        'hoteles_cercanos',
        'recomendaciones',
        'coordenadas',
        'imagenes',
    ];

    protected $casts = [
        'hoteles_cercanos' => 'array',
        'imagenes' => 'array',
    ];

    public function municipio()
    {
        return $this->belongsTo(Municipios::class, 'municipio_id');
    }

    public function opiniones()
    {
        return $this->hasMany(Comentarios::class, 'lugar_id')->latest();
    }
}