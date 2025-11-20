<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Comentarios;
use App\Models\Municipios;

class Hospedaje extends Model
{
    protected $table = 'hospedajes';
    protected $fillable = [
        'nombre',
        'descripcion',
        'ubicacion',
        'municipio_id',
        'tipo',            // Ej: hotel, cabaña, glamping, finca, etc.
        'contacto',        // Teléfono o correo
        'coordenadas',
        'servicios',       // Opcional: jacuzzi, wifi, senderismo, etc.
        'imagenes',        // Array de imágenes
    ];

    protected $casts = [
        'imagenes' => 'array',
        'servicios' => 'array',
    ];

    public function municipio()
    {
        return $this->belongsTo(Municipios::class, 'municipio_id');
    }

    public function opiniones()
    {
        return $this->hasMany(Comentarios::class, 'hospedaje_id')->latest();
    }
}
