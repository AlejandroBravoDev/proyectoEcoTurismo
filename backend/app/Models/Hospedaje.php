<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Comentarios;
use App\Models\Municipios;

class Hospedaje extends Model
{
    protected $table = 'hospedajes';
    protected $primaryKey = 'hospedaje_id';
    public $incrementing = true;
    protected $keyType = 'int';
    protected $fillable = [
        'nombre',
        'ubicacion',
        'descripcion',
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

    public function comentarios()
    {
        return $this->hasMany(Comentarios::class, 'hospedaje_id')->latest();
    }
}
