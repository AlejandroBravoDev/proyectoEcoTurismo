<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comentarios;

class comentariosController extends Controller
{
   
    public function index()
    {
        $comentarios = Comentarios::all(); 
        
        return response()->json($comentarios);
    }

    
}
