<?php

namespace App\Http\Controllers;

use App\Models\Hospedaje;
use App\Models\Favorito;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class HospedajeController extends Controller
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

        // Si ya es una URL completa, la devolvemos
        if (filter_var($relativePath, FILTER_VALIDATE_URL)) {
            return $relativePath;
        }

        // Generar la URL completa desde S3
        return Storage::disk('s3')->url($relativePath);
    }

    public function index(Request $request)
    {
        try {
            $query = Hospedaje::with(['municipio']);

            // 🔍 Filtro de búsqueda
            if ($request->has('search') && !empty($request->search)) {
                $searchTerm = $request->search;
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('nombre', 'LIKE', "%{$searchTerm}%")
                      ->orWhere('descripcion', 'LIKE', "%{$searchTerm}%")
                      ->orWhere('ubicacion', 'LIKE', "%{$searchTerm}%");
                });
            }

            // 🏙️ Filtro por municipio
            if ($request->has('municipio_id') && $request->municipio_id != 0) {
                $query->where('municipio_id', $request->municipio_id);
            }

            $hospedajes = $query->get();

            $hospedajesData = $hospedajes->map(function ($hospedaje) {
                $imagenesPaths = $hospedaje->imagenes ?? [];

                $imagenPrincipalUrl = $this->getImagenPrincipalUrl($imagenesPaths);

                // ⭐ Favoritos
                $isFavorite = false;
                if (Auth::check()) {
                    $isFavorite = Favorito::where('usuario_id', Auth::id())
                        ->where('hospedaje_id', $hospedaje->id)
                        ->exists();
                }

                return [
                    'id' => $hospedaje->id,
                    'nombre' => $hospedaje->nombre,
                    'descripcion' => $hospedaje->descripcion,
                    'coordenadas' => $hospedaje->coordenadas,
                    'municipio' => optional($hospedaje->municipio)->nombre,
                    'municipio_id' => $hospedaje->municipio_id,
                    'imagen_url' => $imagenPrincipalUrl, // ✅ AWS S3
                    'ubicacion' => $hospedaje->ubicacion,
                    'tipo' => $hospedaje->tipo,
                    'contacto' => $hospedaje->contacto,
                    'isFavorite' => $isFavorite,
                ];
            });

            return response()->json($hospedajesData, 200);

        } catch (\Exception $e) {
            Log::error('Error en HospedajeController@index: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error al obtener hospedajes.'
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $hospedaje = Hospedaje::with(['municipio', 'opiniones.usuario'])->findOrFail($id);

            $imagenesPaths = $hospedaje->imagenes ?? [];

            $imagenPrincipalUrl = $this->getImagenPrincipalUrl($imagenesPaths);

            $todasLasImagenesUrls = collect($imagenesPaths)->map(function ($path) {
                return filter_var($path, FILTER_VALIDATE_URL)
                    ? $path
                    : Storage::disk('s3')->url($path);
            })->toArray();

            // ⭐ Favoritos
            $isFavorite = false;
            if (Auth::check()) {
                $isFavorite = Favorito::where('usuario_id', Auth::id())
                    ->where('hospedaje_id', $hospedaje->id)
                    ->exists();
            }

            return response()->json([
                'id' => $hospedaje->id,
                'nombre' => $hospedaje->nombre,
                'descripcion' => $hospedaje->descripcion,
                'coordenadas' => $hospedaje->coordenadas,
                'municipio' => optional($hospedaje->municipio)->nombre,
                'imagen_principal_url' => $imagenPrincipalUrl, // ✅ AWS
                'imagenes' => $todasLasImagenesUrls,           // ✅ Galería
                'ubicacion' => $hospedaje->ubicacion,
                'tipo' => $hospedaje->tipo,
                'contacto' => $hospedaje->contacto,
                'isFavorite' => $isFavorite,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error en HospedajeController@show: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error al obtener el hospedaje.'
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nombre' => 'required|string|max:255',
                'ubicacion' => 'nullable|string',
                'descripcion' => 'nullable|string',
                'municipio_id' => 'required|integer',
                'tipo' => 'nullable|string',
                'contacto' => 'nullable|string',
                'servicios' => 'nullable|array',
                'imagenes' => 'nullable|array', // rutas relativas
            ]);

            $hospedaje = Hospedaje::create($validated);

            return response()->json([
                'message' => 'Hospedaje creado con éxito',
                'data' => $hospedaje
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error creando hospedaje: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Error al crear el hospedaje'
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $hospedaje = Hospedaje::findOrFail($id);

            // 🧹 Si luego quieres borrar imágenes de S3, aquí es el lugar
            $hospedaje->delete();

            return response()->json([
                'message' => 'Hospedaje eliminado correctamente'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error eliminando hospedaje: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Error al eliminar el hospedaje'
            ], 500);
        }
    }
}
