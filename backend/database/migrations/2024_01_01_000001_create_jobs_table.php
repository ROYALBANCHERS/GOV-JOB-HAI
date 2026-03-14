<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category');
            $table->string('post_date')->nullable();
            $table->string('last_date')->nullable();
            $table->text('short_info')->nullable();
            $table->text('content')->nullable();
            $table->string('external_link')->nullable();
            $table->string('location')->nullable();
            $table->string('job_type')->nullable(); // 'Full-time', 'Part-time', 'Contract'
            $table->string('industry')->nullable();
            $table->string('experience_level')->nullable(); // 'Entry', 'Mid', 'Senior'
            $table->string('qualification')->nullable();
            $table->boolean('is_filled')->default(false);
            $table->integer('views')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};
