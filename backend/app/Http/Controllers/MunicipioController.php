<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Municipios; 

class MunicipioController extends Controller
{
    public function index()
    {
        $municipios = Municipios::select('id', 'nombre')->get();
        
        return response()->json($municipios);
    }
}
