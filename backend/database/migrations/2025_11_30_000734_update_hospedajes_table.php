<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('hospedajes', function (Blueprint $table) {
            // Si la primary key es 'hospedaje_id', renombrarla a 'id'
            if (Schema::hasColumn('hospedajes', 'hospedaje_id') && !Schema::hasColumn('hospedajes', 'id')) {
                $table->renameColumn('hospedaje_id', 'id');
            }
        });
    }

    public function down()
    {
        Schema::table('hospedajes', function (Blueprint $table) {
            $table->renameColumn('id', 'hospedaje_id');
        });
    }
};