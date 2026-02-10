<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Comentarios;
use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Auth\Passwords\CanResetPassword as CanResetPasswordTrait;
use App\Notifications\ResetPasswordNotification;
use App\Models\Favorito; 
use Illuminate\Support\Facades\Storage;

class Usuario extends Authenticatable implements CanResetPassword
{
    use HasApiTokens, HasFactory, Notifiable, CanResetPasswordTrait;

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
    protected $appends = ['avatar_url', 'banner_url'];

    public function getAvatarUrlAttribute()
    {
        if (!$this->avatar) return null;

        if (filter_var($this->avatar, FILTER_VALIDATE_URL)) {
            return $this->avatar;
        }

        return Storage::disk('s3')->url($this->avatar);
    }

    public function getBannerUrlAttribute()
    {
        if (!$this->banner) return null;

        if (filter_var($this->banner, FILTER_VALIDATE_URL)) {
            return $this->banner;
        }

        return Storage::disk('s3')->url($this->banner);
    }

    public function setPasswordAttribute($value)
    {
        if (!empty($value)) {
            $this->attributes['password'] = Hash::make($value);
        }
    }

    public function getEmailForPasswordReset() { return $this->email; }

    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token, $this->email));
    }

    public function esAdmin() { return $this->rol === 'admin'; }

    public function favoritos() { return $this->hasMany(Favorito::class, 'usuario_id'); }

    public function comentarios() { return $this->hasMany(Comentarios::class, 'usuario_id'); }
}