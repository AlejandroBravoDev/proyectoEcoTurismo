<?php

namespace App\Http\Controllers;

use App\Models\Comentarios;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ComentariosController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'lugar_id' => 'required|exists:lugares,id',
            'contenido' => 'required|string|max:1000',
            'rating' => 'required|integer|min:1|max:5',
            'category' => 'required|string',
            'image' => 'nullable|image|max:2048',
        ]);

        try {
            $path = null;
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('comentarios', 'public');
            }

            $comentario = Comentarios::create([
                'usuario_id' => auth()->id(),
                'lugar_id' => $request->lugar_id,
                'contenido' => $request->contenido,
                'rating' => $request->rating,
                'category' => $request->category,
                'image_path' => $path,
            ]);

            $comentario->load('usuario');

            $comentarioData = [
                'id' => $comentario->id,
                'contenido' => $comentario->contenido,
                'rating' => $comentario->rating,
                'category' => $comentario->category,
                'image_path' => $comentario->image_path,
                'created_at' => $comentario->created_at->toDateTimeString(),
                'updated_at' => $comentario->updated_at->toDateTimeString(),
                'usuario_id' => $comentario->usuario_id,
                'lugar_id' => $comentario->lugar_id,

                'user' => [
                    'id' => $comentario->usuario->id,
                    'name' => $comentario->usuario->nombre_completo,
                    'avatar' => $comentario->usuario->avatar_url,
                ]
            ];

            return response()->json([
                'message' => 'Comentario creado con éxito',
                'comentario' => $comentarioData
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error al crear comentario:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Error al guardar el comentario.', 'error' => $e->getMessage()], 500);
        }
    }
}
