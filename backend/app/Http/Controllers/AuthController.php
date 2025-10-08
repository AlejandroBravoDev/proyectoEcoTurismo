<?php

namespace App\Http\Controllers;

use App\Models\Usuario; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Validation\ValidationException; 
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule; 

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
    'nombre_completo' => 'required|string|max:100',
    'email' => ['required', 'string', 'email', Rule::unique('usuarios', 'email')],  
    'password' => 'required|string|min:6',
]);

        $usuario = Usuario::create([
            'nombre_completo' => $request->nombre_completo,
            'email' => $request->email,
            'password' => $request->password,
            'rol' => 'usuario',
        ]);

        $token = $usuario->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'usuario' => $usuario,
        ], 201);
    }

    public function login(Request $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Credenciales inválidas. Verifica tu email y contraseña.'
            ], 401);
        }
        $usuario = Auth::user(); 
        $usuario->tokens()->delete();
        $token = $usuario->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'usuario' => $usuario,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete(); 
        return response()->json(['message' => 'Sesión cerrada.'], 200);
    }
}
