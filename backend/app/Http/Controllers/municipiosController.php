<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\municipios;

class municipiosController extends Controller
{
    public function index()
    {
        $municipios = municipios:: all();
        return response()->json($municipios);

    }

}
