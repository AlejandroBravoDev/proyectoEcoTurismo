<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Hospedaje; 

class HospedajeController extends Controller
{
    public function index() 
    {
        $hospedajes = Hospedaje::all(); 
        
        return response()->json($hospedajes); 
    }
}
?>