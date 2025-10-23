<?php

  use Illuminate\Database\Migrations\Migration;
  use Illuminate\Database\Schema\Blueprint;
  use Illuminate\Support\Facades\Schema;

  class AddMissingFieldsToComentariosTable extends Migration
  {
      public function up()
      {
          Schema::table('comentarios', function (Blueprint $table) {
              $table->string('image_path')->after('rating')->nullable();
              $table->string('category')->after('image_path')->nullable();
          });
      }

      public function down()
      {
          Schema::table('comentarios', function (Blueprint $table) {
              $table->dropColumn(['image_path', 'category']);
          });
      }
  }
