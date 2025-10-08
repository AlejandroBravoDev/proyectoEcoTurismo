<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Facades\Storage; 
use Illuminate\Validation\Rule; 
use App\Models\Usuario; 
 


class PerfilController extends Controller
{
    public function show(Request $request)
    {
        $usuario = $request->user();

        if (!$usuario) {
            return response()->json(['message' => 'No autenticado.'], 401);
        }

        $usuario->comentarios = []; 
        $usuario->favoritos = [];   

        return response()->json([
            'usuario' => $usuario
        ], 200);
    }

    public function update(Request $request)
    {
        $usuario = $request->user();
        
        $request->validate([
            'nombre_completo' => 'sometimes|required|string|max:100',
            'email' => ['sometimes', 'required', 'email', Rule::unique('usuarios', 'email')->ignore($usuario->id)],
            'profilePictureFile' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'bannerFile' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        
        $data = $request->only('nombre_completo', 'email');
        
        if ($request->hasFile('profilePictureFile')) {
            
            if ($usuario->avatar) {
                Storage::disk('public')->delete($usuario->avatar);
            }
            
            $path = $request->file('profilePictureFile')->store('avatars', 'public');
            $data['avatar'] = $path;
        }

    
        if ($request->hasFile('bannerFile')) {
         
            if ($usuario->banner) {
                Storage::disk('public')->delete($usuario->banner);
            }
            $path = $request->file('bannerFile')->store('banners', 'public');
            $data['banner'] = $path;
        }

     
        $usuario->update($data);

        return response()->json([
            'message' => 'Perfil actualizado con éxito.',
           
            'usuario' => $usuario->fresh() 
        ], 200);
    }
}