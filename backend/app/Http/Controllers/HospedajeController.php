<?php

namespace App\Http\Controllers;

use App\Models\Hospedaje;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class HospedajeController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Hospedaje::with(['municipio']);

            // Filtrar por búsqueda de texto
            if ($request->has('search') && !empty($request->search)) {
                $searchTerm = $request->search;
                $query->where(function($q) use ($searchTerm) {
                    $q->where('nombre', 'LIKE', "%{$searchTerm}%")
                      ->orWhere('descripcion', 'LIKE', "%{$searchTerm}%")
                      ->orWhere('ubicacion', 'LIKE', "%{$searchTerm}%");
                });
            }

            // Filtrar por municipio
            if ($request->has('municipio_id') && $request->municipio_id != 0) {
                $query->where('municipio_id', $request->municipio_id);
            }

            $hospedajes = $query->get();

            $hospedajesData = $hospedajes->map(function ($hospedaje) {
                $imagenes = $hospedaje->imagenes ?? [];
                $imagenPrincipalUrl = (!empty($imagenes) && is_array($imagenes))
                    ? $imagenes[0]
                    : '';

                return [
                    'id' => $hospedaje->id,
                    'nombre' => $hospedaje->nombre,
                    'descripcion' => $hospedaje->descripcion,
                    'coordenadas' => $hospedaje->coordenadas,
                    'municipio' => optional($hospedaje->municipio)->nombre,
                    'municipio_id' => $hospedaje->municipio_id,
                    'imagen_url' => $imagenPrincipalUrl,
                    'ubicacion' => $hospedaje->ubicacion,
                    'tipo' => $hospedaje->tipo,
                    'contacto' => $hospedaje->contacto,
                ];
            });

            return response()->json($hospedajesData, 200);

        } catch (\Exception $e) {
            Log::error('Error en HospedajeController@index: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al obtener hospedajes.'
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $hospedaje = Hospedaje::with(['municipio', 'opiniones.usuario'])->findOrFail($id);

            $imagenes = $hospedaje->imagenes ?? [];
            $imagenPrincipalUrl = (!empty($imagenes) && is_array($imagenes))
                ? $imagenes[0]
                : '';

            return response()->json([
                'id' => $hospedaje->id,
                'nombre' => $hospedaje->nombre,
                'descripcion' => $hospedaje->descripcion,
                'coordenadas' => $hospedaje->coordenadas,
                'municipio' => optional($hospedaje->municipio)->nombre,
                'imagen_principal_url' => $imagenPrincipalUrl,
                'todas_las_imagenes' => $imagenes,
                'ubicacion' => $hospedaje->ubicacion,
                'tipo' => $hospedaje->tipo,
                'contacto' => $hospedaje->contacto,
                'comentarios' => $hospedaje->opiniones->map(function ($comentario) {
                    return [
                        'id' => $comentario->id,
                        'contenido' => $comentario->contenido,
                        'rating' => $comentario->rating,
                        'category' => $comentario->category,
                        'image_path' => $comentario->image_path,
                        'image_url' => $comentario->image_path
                            ? Storage::disk('s3')->url($comentario->image_path)
                            : null,
                        'created_at' => $comentario->created_at->toDateTimeString(),
                        'updated_at' => $comentario->updated_at->toDateTimeString(),
                        'usuario_id' => $comentario->usuario_id,
                        'hospedaje_id' => $comentario->hospedaje_id,
                        'user' => [
                            'id' => optional($comentario->usuario)->id,
                            'name' => optional($comentario->usuario)->nombre_completo,
                            'avatar' => optional($comentario->usuario)->avatar_url,
                        ]
                    ];
                }),
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error en HospedajeController@show: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al obtener el hospedaje.'
            ], 500);
        }
    }
}