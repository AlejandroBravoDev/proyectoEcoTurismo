<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController; 
use App\Http\Controllers\HospedajeController;
use App\Http\Controllers\LugaresController;
use App\Http\Controllers\municipiosController;
use App\Http\Controllers\usuarioController;
use App\Http\Controllers\favoritosController;
use App\Http\Controllers\comentariosController;
use App\Http\Controllers\PerfilController;

/*Apis*/ 
Route::get('/lugares', 'App\Http\Controllers\LugaresController@index');
Route::get('/hospedajes', 'App\Http\Controllers\HospedajeController@index');
Route::get('/municipios', 'App\Http\Controllers\municipiosController@index');
Route::get('/usuario', 'App\Http\Controllers\usuarioController@index');
Route::get('/favoritos', 'App\Http\Controllers\favoritosController@index');
Route::get('/comentarios', 'App\Http\Controllers\comentariosController@index');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () { 
    Route::get('/perfil', [PerfilController::class, 'show']); 
    
    // 🛑 RUTA DE ACTUALIZACIÓN (Necesaria para la edición)
    Route::put('/perfil/update', [PerfilController::class, 'update']);
    
    
    Route::post('/logout', [AuthController::class, 'logout']);
});
