<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController; 
use App\Http\Controllers\HospedajeController;
use App\Http\Controllers\LugaresController;
use App\Http\Controllers\MunicipioController;
use App\Http\Controllers\usuarioController;
use App\Http\Controllers\favoritosController;
use App\Http\Controllers\comentariosController;
use App\Http\Controllers\PerfilController;

/*Apis*/ 

Route::get('/lugares', [LugaresController::class, 'index']);
Route::get('/lugares/{id}', [LugaresController::class, 'show']);
Route::get('/hospedajes', [HospedajeController::class, 'index']);
Route::get('/municipios', [MunicipioController::class, 'index']);
Route::get('/usuario', [usuarioController::class, 'index']);
Route::get('/favoritos', [favoritosController::class, 'index']);
Route::get('/comentarios', [comentariosController::class, 'index']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () { 
    Route::get('/perfil', [PerfilController::class, 'show']); 
    
    // POST para files
    Route::post('/perfil/update', [PerfilController::class, 'update']);
    
    Route::post('/logout', [AuthController::class, 'logout']);
});