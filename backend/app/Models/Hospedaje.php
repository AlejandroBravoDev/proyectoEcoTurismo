<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Comentarios;
use App\Models\Municipios;

class Hospedaje extends Model
{
    protected $table = 'hospedajes';
    protected $primaryKey = 'id'; // ✅ CORREGIDO: usar 'id' en lugar de 'hospedaje_id'
    public $incrementing = true;
    protected $keyType = 'int';
    
    protected $fillable = [
        'nombre',
        'ubicacion',
        'descripcion',
        'municipio_id',
        'tipo',
        'contacto',
        'coordenadas',
        'servicios',
        'imagenes',
    ];

    protected $casts = [
        'imagenes' => 'array',
        'servicios' => 'array',
    ];

    public function municipio()
    {
        return $this->belongsTo(Municipios::class, 'municipio_id');
    }

    // ✅ CORREGIDO: Relación con comentarios (igual que Lugares)
    public function opiniones()
    {
        return $this->hasMany(Comentarios::class, 'id')->latest();
    }
}