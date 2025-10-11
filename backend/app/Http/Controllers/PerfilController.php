<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Facades\Storage; 
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule; 
use Illuminate\Support\Str;
use App\Models\Usuario; 

class PerfilController extends Controller
{
    public function show(Request $request)
    {
        try {
            $usuario = $request->user();

            if (!$usuario) {
                return response()->json(['message' => 'No autenticado.'], 401);
            }

            $usuario->comentarios = []; 
            $usuario->favoritos = [];   

            // Fuerza incluir accesores en JSON
            $usuario->append(['avatar_url', 'banner_url']);

            Log::info('Show perfil - avatar path: ' . $usuario->avatar . ', URL: ' . $usuario->avatar_url);

            return response()->json([
                'usuario' => $usuario
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error en show perfil: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request)
    {
        try {
            $usuario = $request->user();
            
            Log::info('Update perfil iniciado para user ID: ' . $usuario->id);
            Log::info('Files detectados: profilePictureFile=' . ($request->hasFile('profilePictureFile') ? 'Sí' : 'No') . ', bannerFile=' . ($request->hasFile('bannerFile') ? 'Sí' : 'No'));
            
            $request->validate([
                'nombre_completo' => 'sometimes|required|string|max:100',
                'email' => ['sometimes', 'required', 'email', Rule::unique('usuarios', 'email')->ignore($usuario->id)],
                'profilePictureFile' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'bannerFile' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
            
            $data = $request->only('nombre_completo', 'email');
            
            if ($request->hasFile('profilePictureFile')) {
                Log::info('Subiendo avatar: ' . $request->file('profilePictureFile')->getClientOriginalName());
                
                if ($usuario->avatar && $usuario->avatar !== '0') {
                    Storage::disk('s3')->delete($usuario->avatar);
                    Log::info('Avatar viejo borrado: ' . $usuario->avatar);
                }
                
                $profileFile = $request->file('profilePictureFile');
                $profileFilename = Str::uuid() . '.' . $profileFile->getClientOriginalExtension();
                $profilePath = $profileFile->storeAs('avatars', $profileFilename, 's3');
                $data['avatar'] = $profilePath; // Guarda path en DB
                Log::info('Avatar subido a S3: ' . $profilePath . ', URL: ' . Storage::disk('s3')->url($profilePath));
            }

            if ($request->hasFile('bannerFile')) {
                Log::info('Subiendo banner: ' . $request->file('bannerFile')->getClientOriginalName());
                
                if ($usuario->banner && $usuario->banner !== '0') {
                    Storage::disk('s3')->delete($usuario->banner);
                    Log::info('Banner viejo borrado: ' . $usuario->banner);
                }
                
                $bannerFile = $request->file('bannerFile');
                $bannerFilename = Str::uuid() . '.' . $bannerFile->getClientOriginalExtension();
                $bannerPath = $bannerFile->storeAs('banners', $bannerFilename, 's3');
                $data['banner'] = $bannerPath; // Guarda path en DB
                Log::info('Banner subido a S3: ' . $bannerPath . ', URL: ' . Storage::disk('s3')->url($bannerPath));
            }

            Log::info('Data a guardar: ', $data);
            
            $usuario->update($data);

            $usuario->fresh(); // Recarga para accesores

            // Fuerza incluir accesores en JSON
            $usuario->append(['avatar_url', 'banner_url']);

            Log::info('Update exitoso, avatar path: ' . $usuario->avatar . ', URL: ' . $usuario->avatar_url);

            return response()->json([
                'message' => 'Perfil actualizado con éxito.',
                'usuario' => $usuario // Incluye avatar_url de S3
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error en update perfil: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al actualizar: ' . $e->getMessage(),
            ], 500);
        }
    }
}