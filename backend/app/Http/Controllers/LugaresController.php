<?php

namespace App\Http\Controllers;

use App\Models\Lugares;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class LugaresController extends Controller
{
   public function index(Request $request)
    {
        try {
            $query = Lugares::with(['municipio']); 
            if ($request->has('municipio_id') && $request->municipio_id != 0) {
                $query->where('municipio_id', $request->municipio_id);
            }
            $lugares = $query->get();
            $lugaresData = $lugares->map(function ($lugar) {
                
                $imagenes = $lugar->imagenes ?? []; 
                $imagenPrincipalUrl = (!empty($imagenes) && is_array($imagenes))
                                        ? $imagenes[0]
                                        : ''; 

                return [
                    'id' => $lugar->id,
                    'nombre' => $lugar->nombre,
                    'descripcion' => $lugar->descripcion,
                    'coordenadas' => $lugar->coordenadas, 
                    'municipio' => optional($lugar->municipio)->nombre, 
                    'imagen_url' => $imagenPrincipalUrl, 
                    'ubicacion' => $lugar->ubicacion,
                ];
            });

            return response()->json($lugaresData, 200);

        } catch (\Exception $e) {
            Log::error('Error en LugaresController@index: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Error interno del servidor al obtener la lista de lugares.'], 500);
        }
    }
    
    public function show($id)
    {
        try {
            $lugar = Lugares::with(['municipio'])->findOrFail($id);
            
            $imagenes = $lugar->imagenes ?? []; 
            
            $imagenPrincipalUrl = (!empty($imagenes) && is_array($imagenes))
                                    ? $imagenes[0]
                                    : ''; 

            return response()->json([
                'id' => $lugar->id,
                'nombre' => $lugar->nombre,
                'descripcion' => $lugar->descripcion,
                'coordenadas' => $lugar->coordenadas, 
                'municipio' => optional($lugar->municipio)->nombre, 
                'imagen_principal_url' => $imagenPrincipalUrl, 
                'todas_las_imagenes' => $imagenes, 
                'ubicacion' => $lugar->ubicacion,
                'hoteles_cercanos' => $lugar->hoteles_cercanos,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error en LugaresController@show: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Error al obtener los detalles del lugar.'], 500);
        }
    }
}