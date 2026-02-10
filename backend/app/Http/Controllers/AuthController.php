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
            'email' => 'required|email',
            'password' => 'required|string',
        ], [
            'email.required' => 'El correo es obligatorio',
            'email.email' => 'Correo inválido',
            'password.required' => 'La contraseña es obligatoria',
        ]);

        // Validación adicional de email
        if (!$this->isValidEmail($request->email)) {
            return response()->json([
                'errors' => [
                    'email' => ['El correo tiene un formato inválido o extensión mal escrita']
                ]
            ], 422);
        }

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
            'email' => 'required|email|unique:usuarios,email',
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
            'password.required' => 'La contraseña es obligatoria',
            'password.min' => 'Debe tener mínimo 8 caracteres',
            'password.max' => 'Máximo 12 caracteres',
            'password.confirmed' => 'Las contraseñas no coinciden',
            'password.regex' => 'La contraseña debe contener letras y números',
            'password.not_regex' => 'La contraseña no puede ser secuencial ni repetitiva',
        ]);

        // Validación adicional personalizada de email
        if (!$this->isValidEmail($request->email)) {
            return response()->json([
                'errors' => [
                    'email' => ['El correo tiene un formato inválido o extensión mal escrita']
                ]
            ], 422);
        }

        $usuario = Usuario::create([
            'nombre_completo' => $request->nombre_completo,
            'email' => strtolower($request->email),
            'password' => $request->password,
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

    // 🛡️ Validación personalizada de email
    private function isValidEmail($email)
    {
        // Bloquear doble arroba
        if (strpos($email, '@@') !== false) {
            return false;
        }

        // Bloquear puntos consecutivos
        if (strpos($email, '..') !== false) {
            return false;
        }

        // Bloquear @. o .@
        if (strpos($email, '@.') !== false || strpos($email, '.@') !== false) {
            return false;
        }

        // Bloquear extensiones mal escritas
        $invalidExtensions = [
            '.comm', '.coom', '.gmial', '.gmai', '.hotmial',
            '.outlok', '.yahooo', '.gmil', '.hotmai', '.con'
        ];

        foreach ($invalidExtensions as $ext) {
            if (strtolower(substr($email, -strlen($ext))) === $ext) {
                return false;
            }
        }

        // Validar formato general
        $pattern = '/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|co|mx|es|ar|cl|pe|ve)$/';
        if (!preg_match($pattern, $email)) {
            return false;
        }

        return true;
    }
}