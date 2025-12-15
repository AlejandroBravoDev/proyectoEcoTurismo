<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HospedajeController;
use App\Http\Controllers\LugaresController;
use App\Http\Controllers\MunicipioController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\favoritosController;
use App\Http\Controllers\ComentariosController;
use App\Http\Controllers\PerfilController;

/* Apis públicas */
Route::get('/lugares', [LugaresController::class, 'index']);
Route::get('/lugares/{id}', [LugaresController::class, 'show']);
Route::get('/hospedajes', [HospedajeController::class, 'index']);
Route::get('/hospedajes/{id}', [HospedajeController::class, 'show']);
Route::get('/municipios', [MunicipioController::class, 'index']);
Route::get('/favoritos', [favoritosController::class, 'index']);
Route::get('/comentarios', [ComentariosController::class, 'index']);

// Rutas de usuarios sin auth para probar
Route::get('/usuarios', [UsuarioController::class, 'index']);
Route::get('/usuarios/{id}', [UsuarioController::class, 'show']);
Route::put('/usuarios/{id}', [UsuarioController::class, 'update']); 
Route::delete('/usuarios/{id}', [UsuarioController::class, 'destroy']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        $user = $request->user();
        return response()->json([
            'id' => $user->id,
            'nombre_completo' => $user->nombre_completo,
            'avatar_url' => $user->avatar_url, 
        ]);
    });
    
    Route::get('/perfil', [PerfilController::class, 'show']);
    Route::post('/perfil/update', [PerfilController::class, 'update']);
    Route::post('/comentarios', [ComentariosController::class, 'store']);
    Route::delete('/comentarios/{id}', [ComentariosController::class, 'destroy']);
    Route::post('/favoritos', [favoritosController::class, 'store']);
    Route::delete('/favoritos/{id}', [favoritosController::class, 'destroy']);
    Route::get('/favoritos/check/{lugarId}', [favoritosController::class, 'check']);
    
    Route::post('/logout', [AuthController::class, 'logout']);

    //lugares
    Route::post('/lugares', [LugaresController::class, 'store']);
    Route::put('/lugares/{id}', [LugaresController::class, 'update']); // 🛑 Se utiliza PUT
    Route::delete('/lugares/{id}', [LugaresController::class, 'destroy']);

    //hospedajes
    Route::post('/hospedajes', [HospedajeController::class, 'store']);
    Route::put('/hospedajes/{id}', [HospedajeController::class, 'update']);
    Route::delete('/hospedajes/{id}', [HospedajeController::class, 'destroy']);

    // Usuarios (si el admin puede crear usuarios)
    Route::post('/usuario', [UsuarioController::class, 'store']);
    Route::put('/usuario/{id}', [UsuarioController::class, 'update']);
    Route::delete('/usuario/{id}', [UsuarioController::class, 'destroy']);

});