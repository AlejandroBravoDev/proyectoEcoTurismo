<?php

namespace App\Http\Controllers;

use App\Models\Lugares;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class LugaresController extends Controller
{
    private function getImagenPrincipalUrl($imagenes)
    {
        if (empty($imagenes) || !is_array($imagenes)) {
            return null;
        }
        $relativePath = $imagenes[0];
        if (filter_var($relativePath, FILTER_VALIDATE_URL)) {
            return $relativePath;
        }
        return Storage::disk('s3')->url($relativePath);
    }

    public function index(Request $request)
    {
        try {
            $query = Lugares::with(['municipio', 'opiniones']);
            
            if ($request->has('municipio_id') && $request->municipio_id != 0) {
                $query->where('municipio_id', $request->municipio_id);
            }
            
            $lugares = $query->get();

            $lugaresData = $lugares->map(function ($lugar) {
                return [
                    'id' => $lugar->id,
                    'nombre' => $lugar->nombre,
                    'descripcion' => $lugar->descripcion,
                    'coordenadas' => $lugar->coordenadas,
                    'municipio' => optional($lugar->municipio)->nombre,
                    'imagen_url' => $this->getImagenPrincipalUrl($lugar->imagenes),
                    'ubicacion' => $lugar->ubicacion,
                    'comentarios' => $lugar->opiniones->map(function ($op) {
                        return [
                            'rating' => $op->rating,
                            'category' => $op->category
                        ];
                    }),
                ];
            });

            return response()->json($lugaresData, 200);
        } catch (\Exception $e) {
            Log::error('Error en LugaresController@index: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno del servidor.'], 500);
        }
    }

    public function show($id)
    {
        try {
            $lugar = Lugares::with(['municipio', 'opiniones.usuario'])->findOrFail($id);
            $imagenesPaths = $lugar->imagenes ?? [];
            
            $todasLasImagenesUrls = collect($imagenesPaths)->map(function ($path) {
                 return filter_var($path, FILTER_VALIDATE_URL) ? $path : Storage::disk('s3')->url($path);
            })->toArray();

            return response()->json([
                'id' => $lugar->id,
                'nombre' => $lugar->nombre,
                'descripcion' => $lugar->descripcion,
                'coordenadas' => $lugar->coordenadas,
                'municipio' => optional($lugar->municipio)->nombre,
                'imagen_principal_url' => $this->getImagenPrincipalUrl($imagenesPaths),
                'todas_las_imagenes' => $todasLasImagenesUrls,
                'ubicacion' => $lugar->ubicacion,
                'hoteles_cercanos' => $lugar->hoteles_cercanos,
                'comentarios' => $lugar->opiniones->map(function ($comentario) {
                    return [
                        'id' => $comentario->id,
                        'contenido' => $comentario->contenido,
                        'rating' => $comentario->rating,
                        'category' => $comentario->category,
                        'image_url' => $comentario->image_path ? Storage::disk('s3')->url($comentario->image_path) : null,
                        'created_at' => $comentario->created_at->toDateTimeString(),
                        'user' => [
                            'id' => optional($comentario->usuario)->id,
                            'name' => optional($comentario->usuario)->nombre_completo,
                            'avatar' => optional($comentario->usuario)->avatar_url,
                        ]
                    ];
                }),
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al obtener detalles.'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nombre' => 'required|string|max:255',
                'descripcion' => 'required|string',
                'municipio_id' => 'required|exists:municipios,id',
                'imagen_principal' => 'required|image|max:4096' 
            ]);

            $path = $request->file('imagen_principal')->store('lugares', 's3');

            $lugar = Lugares::create([
                'nombre' => $request->nombre,
                'descripcion' => $request->descripcion,
                'coordenadas' => $request->coordenadas,
                'municipio_id' => $request->municipio_id,
                'imagenes' => [$path], 
                'ubicacion' => $request->ubicacion,
            ]);

            return response()->json([
                'message' => 'Lugar creado correctamente',
                'data' => [
                    'id' => $lugar->id,
                    'nombre' => $lugar->nombre,
                    'imagen_principal_url' => Storage::disk('s3')->url($path),
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al crear.', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $lugar = Lugares::findOrFail($id);
            $imagenesFinales = $request->filled('imagenes_existentes') 
                ? json_decode($request->imagenes_existentes, true) 
                : [];

            if ($request->hasFile('imagenes_nuevas')) {
                foreach ($request->file('imagenes_nuevas') as $imagen) {
                    $imagenesFinales[] = $imagen->store('lugares', 's3');
                }
            }

            $lugar->update([
                'nombre' => $request->nombre,
                'descripcion' => $request->descripcion,
                'imagenes' => array_slice($imagenesFinales, 0, 3),
            ]);

            return response()->json(['message' => 'Actualizado correctamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al actualizar'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $lugar = Lugares::findOrFail($id);
            if ($lugar->imagenes) {
                foreach ($lugar->imagenes as $path) {
                    if (!filter_var($path, FILTER_VALIDATE_URL)) {
                        Storage::disk('s3')->delete($path);
                    }
                }
            }
            $lugar->delete();
            return response()->json(['message' => 'Eliminado'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al eliminar'], 500);
        }
    }
}