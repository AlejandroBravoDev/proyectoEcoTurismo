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

    public function show($id){
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
                'imagenes' => $imagenes,
                'ubicacion' => $hospedaje->ubicacion,
                'tipo' => $hospedaje->tipo,
                'contacto' => $hospedaje->contacto
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error en HospedajeController@show: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el hospedaje.'
            ], 500);
        }
    }

    public function store(Request $request){
        try {
            $validated = $request->validate([
                'nombre' => 'required|string|max:255',
                'ubicacion' => 'nullable|string',
                'descripcion' => 'nullable|string',
                'municipio_id' => 'required|integer',
                'tipo' => 'nullable|string',
                'contacto' => 'nullable|string',
                'servicios' => 'nullable|array',
                'imagenes' => 'nullable|array',
            ]);

            $hospedaje = Hospedaje::create($validated);

            return response()->json([
                'message' => 'Hospedaje creado con éxito',
                'data' => $hospedaje
            ], 201);

        } catch (\Exception $e) {
            \Log::error("Error creando hospedaje: " . $e->getMessage());
            return response()->json(['error' => 'Error al crear el hospedaje'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $hospedaje = Hospedaje::findOrFail($id);

            // Si quieres eliminar también sus imágenes y relaciones, puedes hacerlo aquí

            $hospedaje->delete();

            return response()->json([
                'message' => 'Hospedaje eliminado correctamente'
            ], 200);

        } catch (\Exception $e) {
            \Log::error("Error eliminando hospedaje: " . $e->getMessage());
            return response()->json(['error' => 'Error al eliminar el hospedaje'], 500);
        }
    }

}