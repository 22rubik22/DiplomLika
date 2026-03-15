<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->enum('event_type', ['author_meeting', 'presentation', 'lecture', 'workshop']);
            $table->foreignId('author_id')->nullable()->constrained()->onDelete('set null');
            $table->datetime('start_date');
            $table->datetime('end_date')->nullable();
            $table->string('location');
            $table->integer('max_participants')->nullable();
            $table->integer('registered_count')->default(0);
            $table->decimal('price', 10, 2)->default(0);
            $table->string('image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index('start_date');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};