<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            // Age limit details
            $table->string('age_min')->nullable();
            $table->string('age_max')->nullable();
            $table->text('age_relaxation')->nullable();

            // Application fee details
            $table->text('fee_general')->nullable();
            $table->text('fee_sc_st')->nullable();
            $table->text('fee_payment_mode')->nullable();

            // Vacancy details
            $table->text('vacancy_details')->nullable();
            $table->integer('vacancy_count')->nullable();

            // Important dates
            $table->date('exam_date')->nullable();
            $table->date('admit_card_date')->nullable();

            // Selection process
            $table->text('selection_process')->nullable();

            // Documents required
            $table->text('documents_required')->nullable();

            // Official links
            $table->string('notification_link')->nullable();
            $table->string('apply_link')->nullable();
            $table->string('official_website')->nullable();

            // Additional info
            $table->text('important_notes')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->dropColumn([
                'age_min',
                'age_max',
                'age_relaxation',
                'fee_general',
                'fee_sc_st',
                'fee_payment_mode',
                'vacancy_details',
                'vacancy_count',
                'exam_date',
                'admit_card_date',
                'selection_process',
                'documents_required',
                'notification_link',
                'apply_link',
                'official_website',
                'important_notes',
            ]);
        });
    }
};
