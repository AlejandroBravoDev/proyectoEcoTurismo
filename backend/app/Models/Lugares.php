<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Comentarios;
use App\Models\Municipios;
use App\Models\Usuario; // Asegúrate de usar el modelo Usuario que definimos antes

class Lugares extends Model
{
    protected $table = 'lugares';

    protected $fillable = [
        'nombre',
        'descripcion',
        'ubicacion',
        'municipio_id',
        'hoteles_cercanos',
        'recomendaciones',
        'coordenadas',
        'imagenes',
        'usuario_id', // Añadido por si guardas quién creó el lugar
    ];

    protected $casts = [
        'hoteles_cercanos' => 'array',
        'imagenes' => 'array',
    ];

    /**
     * Appends: Estos campos no existen en la base de datos, 
     * pero se calculan al vuelo y se envían al frontend.
     */
    protected $appends = ['rating_promedio', 'total_comentarios'];

    // --- ACCESSORS PARA RATING ---

    /**
     * Calcula el promedio de estrellas basado en la tabla comentarios.
     */
    public function getRatingPromedioAttribute()
    {
        // Accede a la relación opiniones y saca el promedio de la columna 'rating'
        $promedio = $this->opiniones()->avg('rating');
        
        // Retorna el promedio redondeado a 1 decimal (ej: 4.5) o 0 si no hay votos
        return $promedio ? round($promedio, 1) : 0;
    }

    /**
     * Retorna el número total de comentarios.
     */
    public function getTotalComentariosAttribute()
    {
        return $this->opiniones()->count();
    }

    // --- RELACIONES ---

    /**
     * Relación con el municipio al que pertenece el lugar.
     */
    public function municipio()
    {
        return $this->belongsTo(Municipios::class, 'municipio_id');
    }

    /**
     * Relación con los comentarios (opiniones).
     * Nota: Mantenemos el nombre 'opiniones' pero apunta a 'Comentarios'.
     */
    public function opiniones()
    {
        return $this->hasMany(Comentarios::class, 'lugar_id')->latest();
    }

    /**
     * Relación con el usuario que registró el lugar (si aplica).
     */
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }
}