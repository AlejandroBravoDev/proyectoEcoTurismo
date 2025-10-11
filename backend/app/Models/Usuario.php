<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash; 
use Laravel\Sanctum\HasApiTokens;
use App\Models\Comentario; 
use App\Models\Favorito; 
use Illuminate\Support\Facades\Storage; // Para S3

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
    
    // Accesores para URLs completas de S3 (convierte path a URL pública)
    public function getAvatarUrlAttribute(): string
    {
        if (!$this->avatar) {
            return asset('assets/usuarioDemo.png'); // Default local si no hay imagen
        }
        return Storage::disk('s3')->url($this->avatar); // URL completa de S3
    }
    
    public function getBannerUrlAttribute(): string
    {
        if (!$this->banner) {
            return asset('assets/img4.jpg'); // Default local
        }
        return Storage::disk('s3')->url($this->banner);
    }
    
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
