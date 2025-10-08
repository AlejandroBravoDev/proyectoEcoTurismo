<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lugares;

class LugaresController extends Controller
{
    public function index()
    {
         $lugar = Lugares::all(); 
        
        return response()->json($lugar); 
    }

    
}
