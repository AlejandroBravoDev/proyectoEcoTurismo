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
            // Consulta base con la relación al municipio
            $query = Hospedaje::with(['municipio']);

            // Filtrar por búsqueda de texto (nombre o descripción)
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

            // Filtrar por pueblo (si tienes la columna pueblo_id en tu tabla)
            if ($request->has('pueblo_id') && $request->pueblo_id != 0) {
                $query->where('pueblo_id', $request->pueblo_id);
            }

            // Filtrar por tipo de hospedaje (opcional)
            if ($request->has('tipo') && !empty($request->tipo)) {
                $query->where('tipo', $request->tipo);
            }

            // Obtener hospedajes
            $hospedajes = $query->get();

            // Transformar la información
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
                    'imagen_principal' => $imagenPrincipalUrl,
                    'ubicacion' => $hospedaje->ubicacion,
                    'tipo' => $hospedaje->tipo,
                    'contacto' => $hospedaje->contacto,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $hospedajesData,
                'total' => $hospedajesData->count()
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error en HospedajesController@index: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor al obtener la lista de hospedajes.'
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            // Obtener hospedaje con municipio y opiniones
            $hospedaje = Hospedaje::with(['municipio', 'opiniones.usuario'])->findOrFail($id);

            $imagenes = $hospedaje->imagenes ?? [];
            $imagenPrincipalUrl = (!empty($imagenes) && is_array($imagenes))
                ? $imagenes[0]
                : '';

            return response()->json([
                'success' => true,
                'data' => [
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
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error en HospedajesController@show: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los detalles del hospedaje.'
            ], 500);
        }
    }
}