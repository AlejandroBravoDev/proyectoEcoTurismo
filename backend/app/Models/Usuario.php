<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash; 
use Laravel\Sanctum\HasApiTokens;
use App\Models\Comentarios; 
use App\Models\Favorito; 
use Illuminate\Support\Facades\Storage; 

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
    
    
    public function getAvatarUrlAttribute(): string
    {
        if (!$this->avatar) {
            return asset('assets/usuarioDemo.png'); 
        }
        return Storage::disk('s3')->url($this->avatar); 
    }
    
    public function getBannerUrlAttribute(): string
    {
        if (!$this->banner) {
            return asset('assets/img4.jpg'); 
        }
        return Storage::disk('s3')->url($this->banner);
    }
    
    public function comentarios()
    {
        return $this->hasMany(Comentarios::class, 'usuario_id');
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
