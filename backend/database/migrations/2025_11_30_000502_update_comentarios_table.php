<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('comentarios', function (Blueprint $table) {
            // Hacer que lugar_id sea nullable
            $table->unsignedBigInteger('lugar_id')->nullable()->change();
            
            // Añadir hospedaje_id nullable
            if (!Schema::hasColumn('comentarios', 'hospedaje_id')) {
                $table->unsignedBigInteger('hospedaje_id')->nullable()->after('lugar_id');
                $table->foreign('hospedaje_id')->references('id')->on('hospedajes')->onDelete('cascade');
            }
            
            // Aumentar límite de contenido
            $table->text('contenido')->change();
        });
    }

    public function down()
    {
        Schema::table('comentarios', function (Blueprint $table) {
            $table->dropForeign(['hospedaje_id']);
            $table->dropColumn('hospedaje_id');
        });
    }
};