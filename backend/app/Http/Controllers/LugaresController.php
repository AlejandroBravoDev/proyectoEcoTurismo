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

                return [
                    'id' => $lugar->id,
                    'nombre' => $lugar->nombre,
                    'descripcion' => $lugar->descripcion,
                    
                    'municipio' => optional($lugar->municipio)->nombre, 
                    'imagenes' => $imagenes, 
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
            $lugar = Lugares::with(['municipio', 'opiniones.usuario'])->findOrFail($id);
            
            $comentarios = $lugar->opiniones; 
            $comentariosFormateados = [];

            if (optional($comentarios)->isNotEmpty()) {
                foreach ($comentarios as $comentario) {
                    $user = $comentario->usuario;
                    
                    $image_url = null;
                    if ($comentario->image_path) {
                        $image_url = Storage::disk('s3')->url($comentario->image_path);
                    }

                    $comentarioData = [
                        'id' => $comentario->id,
                        'contenido' => $comentario->contenido,
                        'rating' => $comentario->rating,
                        'category' => $comentario->category,
                        'image_path' => $comentario->image_path,
                        'image_url' => $image_url, 
                        'usuario_id' => $comentario->usuario_id,
                        'lugar_id' => $comentario->lugar_id,
                        'created_at' => optional($comentario->created_at)->toDateTimeString(),

                        'user' => $user ? [
                            'id' => $user->id,
                            'name' => $user->nombre_completo,
                            'avatar' => $user->avatar_url, 
                        ] : [
                            'id' => null,
                            'name' => 'Usuario Anónimo',
                            'avatar' => 'https://via.placeholder.com/40',
                        ],
                    ];
                    $comentariosFormateados[] = $comentarioData;
                }
            }
            $responseData = $lugar->toArray(); 
            $responseData['comentarios'] = $comentariosFormateados;
            $responseData['municipio'] = optional($lugar->municipio)->nombre;
            $responseData['imagenes'] = $lugar->imagenes ?? []; 
            $responseData['ubicacion'] = $lugar->ubicacion ?? null; 
            $responseData['hoteles_cercanos'] = $lugar->hoteles_cercanos ?? [];

            return response()->json($responseData, 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'El lugar no fue encontrado.'], 404);
        } catch (\Exception $e) {
            Log::error('Error en show (LugaresController): ' . $e->getMessage());
            return response()->json(['message' => 'Error interno al cargar el lugar.'], 500);
        }
    }
}