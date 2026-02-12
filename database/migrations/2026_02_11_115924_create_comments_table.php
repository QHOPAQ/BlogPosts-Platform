<?php

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
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('article_id')
                  ->constrained()
                  ->onDelete('cascade');  // Удаляются комментарии при удалении статьи
                  
            $table->string('author_name'); // Имя автора комментария
            $table->text('content');       // Текст комментария
            $table->timestamps();          // created_at, updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};