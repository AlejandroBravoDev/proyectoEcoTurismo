<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Favoritos;

class favoritosController extends Controller
{
   
    public function index()
    {
       $favoritos = Favoritos::all(); 
        
        return response()->json($favoritos);
    }

    
}
