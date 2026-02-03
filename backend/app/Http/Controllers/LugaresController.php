<?php
namespace App\Http\Controllers;

use App\Models\Lugares;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class LugaresController extends Controller
{
    /**
     * Helper para obtener la URL completa de la primera imagen.
     * @param array|null $imagenes
     * @return string|null
     */
    private function getImagenPrincipalUrl($imagenes)
    {
        if (empty($imagenes) || !is_array($imagenes)) {
            return null;
        }

        $relativePath = $imagenes[0];

        // Se usa 's3' (o 'public' si así está configurado en tu proyecto). 
        // Asumiendo que S3 está configurado para almacenar las rutas relativas.
        // Si la ruta ya es una URL completa (como en el caso de tests), la devuelve, si no, genera la URL.
        if (filter_var($relativePath, FILTER_VALIDATE_URL)) {
            return $relativePath;
        }
        
        // Generar la URL completa de S3 (o el disco configurado)
        return Storage::disk('s3')->url($relativePath);
    }

    public function index(Request $request)
    {
        try {
            $query = Lugares::with(['municipio']);
            if ($request->has('municipio_id') && $request->municipio_id != 0) {
                $query->where('municipio_id', $request->municipio_id);
            }
            $lugares = $query->get();

            $lugaresData = $lugares->map(function ($lugar) {
                // Obtener solo las rutas relativas (si se usa un Accessor en el modelo, se puede simplificar)
                $imagenesPaths = $lugar->imagenes ?? [];
                
                return [
                    'id' => $lugar->id,
                    'nombre' => $lugar->nombre,
                    'descripcion' => $lugar->descripcion,
                    'coordenadas' => $lugar->coordenadas,
                    'municipio' => optional($lugar->municipio)->nombre,
                    // Generar la URL completa de S3 para la imagen principal
                    'imagen_url' => $this->getImagenPrincipalUrl($imagenesPaths),
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
            $imagenesPaths = $lugar->imagenes ?? []; // Rutas relativas guardadas
            
            // Generar URLs completas para todas las imágenes
            $todasLasImagenesUrls = collect($imagenesPaths)->map(function ($path) {
                 return filter_var($path, FILTER_VALIDATE_URL) ? $path : Storage::disk('s3')->url($path);
            })->toArray();

            return response()->json([
                'id' => $lugar->id,
                'nombre' => $lugar->nombre,
                'descripcion' => $lugar->descripcion,
                'coordenadas' => $lugar->coordenadas,
                'municipio' => optional($lugar->municipio)->nombre,
                // Generar la URL de la imagen principal
                'imagen_principal_url' => $this->getImagenPrincipalUrl($imagenesPaths),
                // Devolver el array con las URLs completas para el carrusel/galería
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
                        // Asumiendo que 'image_path' del comentario es la ruta relativa
                        'image_url' => $comentario->image_path ? Storage::disk('s3')->url($comentario->image_path) : null,
                        'created_at' => $comentario->created_at->toDateTimeString(),
                        'updated_at' => $comentario->updated_at->toDateTimeString(),
                        'usuario_id' => $comentario->usuario_id,
                        'lugar_id' => $comentario->lugar_id,
                        'user' => [
                            'id' => optional($comentario->usuario)->id,
                            'name' => optional($comentario->usuario)->nombre_completo,
                            // Asumiendo un Accessor 'avatar_url' en el modelo Usuario
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

            // 1️⃣ Imágenes que el usuario dejó (vienen como JSON)
            if ($request->filled('imagenes_existentes')) {
                $imagenesFinales = json_decode($request->imagenes_existentes, true) ?? [];
            }

            // 2️⃣ Subir nuevas imágenes a S3
            if ($request->hasFile('imagenes_nuevas')) {
                foreach ($request->file('imagenes_nuevas') as $imagen) {
                    $path = $imagen->store('lugares', 's3');
                    $imagenesFinales[] = $path;
                }
            }

            // 3️⃣ Seguridad: máximo 3 imágenes
            $imagenesFinales = array_slice($imagenesFinales, 0, 3);

            // 4️⃣ Actualizar datos
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

            // 1. Eliminar imágenes asociadas de S3
            $imagenesPaths = $lugar->imagenes ?? [];
            if (!empty($imagenesPaths)) {
                $disk = 's3';
                foreach ($imagenesPaths as $path) {
                    // Solo intenta eliminar si no parece una URL completa
                    if (!filter_var($path, FILTER_VALIDATE_URL)) {
                        Storage::disk($disk)->delete($path);
                    }
                }
                Log::info('Imágenes eliminadas de S3 para el lugar ID: ' . $lugar->id);
            }

            // 2. Eliminar el registro
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

            // Validación
            $validated = $request->validate([
                'nombre' => 'required|string|max:255',
                'descripcion' => 'required|string',
                'municipio_id' => 'required|exists:municipios,id',
                'ubicacion' => 'nullable|string',
                'coordenadas' => 'nullable|string',
                // CAMBIO: La validación ahora solo busca 'imagen_principal'
                'imagen_principal' => 'required|image|mimes:jpg,jpeg,png,webp|max:4096' 
            ]);

            Log::info('Validación pasada');

            // Procesar la imagen
            $imagenesGuardadas = [];
            $disk = 's3'; // Usar el disco S3

            if ($request->hasFile('imagen_principal')) {
                $imagen = $request->file('imagen_principal');
                // Almacenar en la carpeta 'lugares'
                $path = $imagen->store('lugares', $disk); 
                $imagenesGuardadas[] = $path; // Guardar la ruta relativa
                Log::info('Imagen guardada en S3: ' . $path);
            }

            // Crear el lugar
            $lugar = Lugares::create([
                'nombre' => $request->nombre,
                'descripcion' => $request->descripcion,
                'coordenadas' => $request->coordenadas ?? null,
                'municipio_id' => $request->municipio_id,
                // Guardar el array de rutas relativas
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