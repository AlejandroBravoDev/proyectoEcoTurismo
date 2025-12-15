use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('favoritos', function (Blueprint $table) {
            // Se asume que 'hospedajes' es la tabla de donde viene el ID
            $table->foreignId('hospedaje_id')->constrained('hospedajes')->after('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('favoritos', function (Blueprint $table) {
            // Elimina la clave foránea y la columna si revierte
            $table->dropForeign(['hospedaje_id']);
            $table->dropColumn('hospedaje_id');
        });
    }
};