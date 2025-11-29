<?php

namespace App\Http\Controllers;

use App\Models\Favorito;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class FavoritosController extends Controller
{
    public function store(Request $request)
    {
        try {
            Log::info('Intentando añadir favorito - Usuario ID: ' . (Auth::id() ?? 'No autenticado'));
            Log::info('Lugar ID recibido: ' . ($request->lugar_id ?? 'No proporcionado'));

            $request->validate([
                'lugar_id' => 'required|exists:lugares,id',
            ]);

            $existingFavorite = Favorito::where('usuario_id', Auth::id())
                ->where('lugar_id', $request->lugar_id)
                ->first();

            if ($existingFavorite) {
                return response()->json(['message' => 'Este lugar ya está en favoritos'], 400);
            }

            $favorito = new Favorito();
            $favorito->usuario_id = Auth::id();
            $favorito->lugar_id = $request->lugar_id;
            $favorito->save();

            Log::info('Favorito añadido con ID: ' . $favorito->id);

            return response()->json(['message' => 'Favorito añadido'], 201);
        } catch (\Exception $e) {
            Log::error('Error al añadir favorito: ' . $e->getMessage());
            return response()->json(['message' => 'Error al añadir favorito'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $favorito = Favorito::where('usuario_id', Auth::id())
                ->where('lugar_id', $id)
                ->firstOrFail();
            $favorito->delete();

            return response()->json(['message' => 'Favorito eliminado'], 200);
        } catch (\Exception $e) {
            Log::error('Error al eliminar favorito: ' . $e->getMessage());
            return response()->json(['message' => 'Error al eliminar favorito'], 500);
        }
    }

    public function check($lugarId)
    {
        try {
            $isFavorite = Favorito::where('usuario_id', Auth::id())
                ->where('lugar_id', $lugarId)
                ->exists();
            return response()->json(['isFavorite' => $isFavorite], 200);
        } catch (\Exception $e) {
            Log::error('Error al verificar favorito: ' . $e->getMessage());
            return response()->json(['message' => 'Error al verificar favorito'], 500);
        }
    }
}
