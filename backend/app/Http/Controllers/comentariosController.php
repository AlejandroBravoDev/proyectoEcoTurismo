<?php

namespace App\Http\Controllers;

use App\Models\Comentarios;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ComentariosController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'lugar_id' => 'nullable|exists:lugares,id',
            'hospedaje_id' => 'nullable|exists:hospedajes,id',
            'contenido' => 'required|string|max:5000',
            'rating' => 'required|integer|min:1|max:5',
            'category' => 'required|string',
            'image' => 'nullable|image|max:2048',
        ]);

        try {
            $path = null;
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('comentarios', $filename, 's3');
            }

            $comentario = Comentarios::create([
                'usuario_id' => auth()->id(),
                'lugar_id' => $request->lugar_id,
                'hospedaje_id' => $request->hospedaje_id,
                'contenido' => $request->contenido,
                'rating' => $request->rating,
                'category' => $request->category,
                'image_path' => $path,
            ]);

            $comentario->load('usuario');

            return response()->json([
                'message' => 'Comentario creado con éxito',
                'comentario' => [
                    'id' => $comentario->id,
                    'contenido' => $comentario->contenido,
                    'rating' => $comentario->rating,
                    'image_url' => $path ? Storage::disk('s3')->url($path) : null,
                    'user' => [
                        'name' => $comentario->usuario->nombre_completo,
                        'avatar' => $comentario->usuario->avatar_url,
                    ]
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al guardar el comentario.'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $comentario = Comentarios::findOrFail($id);
            if (Auth::id() !== $comentario->usuario_id) {
                return response()->json(['message' => 'No autorizado'], 403);
            }
            if ($comentario->image_path) {
                Storage::disk('s3')->delete($comentario->image_path);
            }
            $comentario->delete();
            return response()->json(['message' => 'Eliminado'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al eliminar'], 500);
        }
    }
}