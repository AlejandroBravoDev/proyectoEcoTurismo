<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // LOGIN
    public function login(Request $request)
    {
        $request->validate([
            'email' => [
                'required',
                'email',
                'regex:/^[^@]+@[^@]+\.[a-zA-Z]{2,3}$/'
            ],
            'password' => 'required|string',
        ], [
            'email.required' => 'El correo es obligatorio',
            'email.email' => 'Correo inválido',
            'email.regex' => 'Formato de correo incorrecto',
            'password.required' => 'La contraseña es obligatoria',
        ]);

        $usuario = Usuario::where(
            'email',
            strtolower($request->email)
        )->first();

        if (!$usuario) {
            return response()->json([
                'message' => 'El correo no está registrado'
            ], 401);
        }

        if (!Hash::check($request->password, $usuario->password)) {
            return response()->json([
                'message' => 'Contraseña incorrecta'
            ], 401);
        }

        // borrar tokens viejos
        $usuario->tokens()->delete();

        $token = $usuario->createToken('login-token')->plainTextToken;

        return response()->json([
            'message' => 'Login exitoso',
            'token' => $token,
            'usuario' => $usuario,
        ], 200);
    }

    // REGISTRO 
    public function register(Request $request)
    {
        $request->validate([
            'nombre_completo' => 'required|string|max:100',
            'email' => [
                'required',
                'email',
                'unique:usuarios,email',
                'regex:/^[^@]+@[^@]+\.[a-zA-Z]{2,3}$/'
            ],
            'password' => [
                'required',
                'string',
                'min:8',
                'max:12',
                'confirmed',
                'regex:/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/',
                'not_regex:/^(\d)\1+$/',
                'not_regex:/123456|234567|345678|456789|012345/',
            ],
        ], [
            'nombre_completo.required' => 'El nombre es obligatorio',
            'email.required' => 'El correo es obligatorio',
            'email.email' => 'Correo inválido',
            'email.unique' => 'Este correo ya está registrado',
            'email.regex' => 'Formato de correo incorrecto',
            'password.required' => 'La contraseña es obligatoria',
            'password.min' => 'Debe tener mínimo 8 caracteres',
            'password.max' => 'Máximo 12 caracteres',
            'password.confirmed' => 'Las contraseñas no coinciden',
            'password.regex' => 'La contraseña debe contener letras y números',
            'password.not_regex' => 'La contraseña no puede ser secuencial ni repetitiva',
        ]);

        $usuario = Usuario::create([
            'nombre_completo' => $request->nombre_completo,
            'email' => strtolower($request->email),
            'password' => $request->password, // ⚠️ SIN Hash::make
            'rol' => 'usuario',
        ]);

        return response()->json([
            'message' => 'Registro exitoso',
        ], 201);
    }

    // LOGOUT 
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada correctamente'
        ], 200);
    }
}
