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
            $lugar = Lugares::with(['municipio', 'opiniones.usuario'])->findOrFail($id);
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

    public function update(Request $request, $id)
    {
        $lugar = Lugares::findOrFail($id);
        $lugar->update($request->all());
        return response()->json(['lugar' => $lugar], 200);
    }

    public function destroy($id)
    {
        $lugar = Lugares::findOrFail($id);
        $lugar->delete();
        return response()->json(['message' => 'Lugar eliminado'], 200);
    }

    public function store(Request $request)
    {
        try {
            // LOG para debugging
            Log::info('Datos recibidos en store:', $request->all());

            // Validación
            $validated = $request->validate([
                'nombre' => 'required|string|max:255',
                'descripcion' => 'required|string',
                'municipio_id' => 'required|exists:municipios,id',
                'ubicacion' => 'nullable|string',
                'coordenadas' => 'nullable|string',
                'imagen_principal' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096'
            ]);

            Log::info('Validación pasada');

            // Procesar la imagen
            $imagenesGuardadas = [];

            if ($request->hasFile('imagen_principal')) {
                $imagen = $request->file('imagen_principal');
                $path = $imagen->store('lugares', 'public');
                $url = Storage::url($path);
                $imagenesGuardadas[] = $url;
                Log::info('Imagen guardada en: ' . $path);
            }

            // Crear el lugar
            $lugar = Lugares::create([
                'nombre' => $request->nombre,
                'descripcion' => $request->descripcion,
                'coordenadas' => $request->coordenadas ?? null,
                'municipio_id' => $request->municipio_id,
                'imagenes' => !empty($imagenesGuardadas) ? $imagenesGuardadas : null,
                'ubicacion' => $request->ubicacion ?? null,
            ]);

            Log::info('Lugar creado con ID: ' . $lugar->id);

            return response()->json([
                'message' => 'Lugar creado correctamente',
                'data' => $lugar
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