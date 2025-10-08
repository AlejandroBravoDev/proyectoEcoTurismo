<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash; 
use Laravel\Sanctum\HasApiTokens;
use App\Models\Comentario; 
use App\Models\Favorito; 

class Usuario extends Authenticatable 
{
    use HasApiTokens, HasFactory, Notifiable;
    protected $table = 'usuarios'; 

    protected $fillable = [
        'nombre_completo',
        'email',
        'password',
        'avatar', 
        'banner',
        'rol',
    ];
    
    protected $hidden = [
        'password',
        'remember_token',
    ];
    
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Hash::make($value);
    }
    
    // 3. Relaciones
    public function comentarios()
    {
        return $this->hasMany(Comentario::class, 'usuario_id');
    }

    public function favoritos()
    {
        return $this->hasMany(Favorito::class, 'usuario_id'); 
    }

    public function esAdmin()
    {
        return $this->rol === 'admin';
    }

    
}
