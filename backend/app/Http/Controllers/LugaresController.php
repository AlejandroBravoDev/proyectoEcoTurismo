<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lugar;
use App\Models\Lugares; 

class LugaresController extends Controller
{
    public function index(Request $request)
    {
       
        $query = Lugares::query();
        
        
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('nombre', 'like', '%' . $search . '%')
                  ->orWhere('descripcion', 'like', '%' . $search . '%');
        }
        if ($request->has('municipio_id')) {
            $municipioId = $request->input('municipio_id');
            if (is_numeric($municipioId)) {
                $query->where('municipio_id', (int)$municipioId);
            }
        }
        $lugares = $query->get();
        
        return response()->json($lugares); 
    }
    public function show($id)
    {
        $lugar = Lugares::with(['imagenes', 'comentarios.usuario'])->findOrFail($id);

       
        $imagenesUrls = $lugar->imagenes->pluck('url')->toArray();
        $responseData = $lugar->toArray();
        $responseData['imagenes'] = $imagenesUrls; 

        return response()->json($responseData, 200);
    }
}