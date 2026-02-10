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

        // Filtro por Municipio
        if ($request->has('municipio_id') && !empty($request->municipio_id)) {
            $query->where('municipio_id', $request->municipio_id);
        }

        // Filtro por Nombre o Descripción
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nombre', 'LIKE', "%{$search}%")
                  ->orWhere('descripcion', 'LIKE', "%{$search}%");
            });
        }

        $lugares = $query->get();

        $lugaresData = $lugares->map(function ($lugar) {
            return [
                'id' => $lugar->id,
                'nombre' => $lugar->nombre,
                'descripcion' => $lugar->descripcion,
                'municipio' => optional($lugar->municipio)->nombre,
                'municipio_id' => $lugar->municipio_id,
                'imagen_url' => $this->getImagenPrincipalUrl($lugar->imagenes ?? []),
                'ubicacion' => $lugar->ubicacion,
                'comentarios' => $lugar->opiniones->map(fn($op) => [
                    'rating' => $op->rating,
                    'category' => $op->category ?? 'General'
                ]),
            ];
        });

        return response()->json($lugaresData, 200);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Error en el servidor'], 500);
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
                        'image_path' => $comentario->image_path,
                        'image_url' => $comentario->image_path ? Storage::disk('s3')->url($comentario->image_path) : null,
                        'created_at' => $comentario->created_at->toDateTimeString(),
                        'updated_at' => $comentario->updated_at->toDateTimeString(),
                        'usuario_id' => $comentario->usuario_id,
                        'lugar_id' => $comentario->lugar_id,
                        'user' => [
                            'id' => optional($comentario->usuario)->id,
                            'name' => optional($comentario->usuario)->nombre_completo,
                            'avatar' => optional($comentario->usuario)->avatar_url,
                        ]
                    ];
                }),
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error en LugaresController@show: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Error al obtener los detalles del lugar.'], 500);
        }
    }

    public function update(Request $request, $id){
        try {
            $lugar = Lugares::findOrFail($id);

            $validated = $request->validate([
                'nombre' => 'required|string|max:255',
                'descripcion' => 'required|string',
                'imagenes_existentes' => 'nullable|string',
                'imagenes_nuevas.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            ]);

            $imagenesFinales = [];

            if ($request->filled('imagenes_existentes')) {
                $imagenesFinales = json_decode($request->imagenes_existentes, true) ?? [];
            }

            if ($request->hasFile('imagenes_nuevas')) {
                foreach ($request->file('imagenes_nuevas') as $imagen) {
                    $path = $imagen->store('lugares', 's3');
                    $imagenesFinales[] = $path;
                }
            }
            $imagenesFinales = array_slice($imagenesFinales, 0, 3);
            $lugar->update([
                'nombre' => $request->nombre,
                'descripcion' => $request->descripcion,
                'imagenes' => $imagenesFinales,
            ]);

            return response()->json([
                'message' => 'Lugar actualizado correctamente',
                'imagenes' => collect($imagenesFinales)->map(fn ($img) =>
                    Storage::disk('s3')->url($img)
                ),
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error en update Lugar', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Error al actualizar el lugar',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $lugar = Lugares::findOrFail($id);
            $imagenesPaths = $lugar->imagenes ?? [];
            if (!empty($imagenesPaths)) {
                $disk = 's3';
                foreach ($imagenesPaths as $path) {
                    if (!filter_var($path, FILTER_VALIDATE_URL)) {
                        Storage::disk($disk)->delete($path);
                    }
                }
                Log::info('Imágenes eliminadas de S3 para el lugar ID: ' . $lugar->id);
            }
            $lugar->delete();
            
            return response()->json(['message' => 'Lugar eliminado correctamente'], 200);

        } catch (\Exception $e) {
            Log::error('Error en LugaresController@destroy: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Error al eliminar el lugar.'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            Log::info('Datos recibidos en store:', $request->all());

            $validated = $request->validate([
                'nombre' => 'required|string|max:255',
                'descripcion' => 'required|string',
                'municipio_id' => 'required|exists:municipios,id',
                'ubicacion' => 'nullable|string',
                'coordenadas' => 'nullable|string',
                'imagen_principal' => 'required|image|mimes:jpg,jpeg,png,webp|max:4096' 
            ]);

            Log::info('Validación pasada');

            $imagenesGuardadas = [];
            $disk = 's3'; 

            if ($request->hasFile('imagen_principal')) {
                $imagen = $request->file('imagen_principal');
                $path = $imagen->store('lugares', $disk); 
                $imagenesGuardadas[] = $path;
                Log::info('Imagen guardada en S3: ' . $path);
            }

            $lugar = Lugares::create([
                'nombre' => $request->nombre,
                'descripcion' => $request->descripcion,
                'coordenadas' => $request->coordenadas ?? null,
                'municipio_id' => $request->municipio_id,
                'imagenes' => !empty($imagenesGuardadas) ? $imagenesGuardadas : null, 
                'ubicacion' => $request->ubicacion ?? null,
            ]);

            Log::info('Lugar creado con ID: ' . $lugar->id);
            $lugar->refresh();
            $imagenesPaths = $lugar->imagenes ?? [];
            
            return response()->json([
                'message' => 'Lugar creado correctamente',
                'data' => [
                    'id' => $lugar->id,
                    'nombre' => $lugar->nombre,
                    'descripcion' => $lugar->descripcion,
                    'imagen_principal_url' => $this->getImagenPrincipalUrl($imagenesPaths),
                ]
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Error de validación:', $e->errors());
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error en LugaresController@store: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);
            return response()->json([
                'message' => 'Error al crear el lugar',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}