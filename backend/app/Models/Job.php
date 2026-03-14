<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'category',
        'post_date',
        'last_date',
        'short_info',
        'content',
        'external_link',
        'location',
        'job_type',
        'industry',
        'experience_level',
        'qualification',
        'is_filled',
        'views',
        // Age details
        'age_min',
        'age_max',
        'age_relaxation',
        // Fee details
        'fee_general',
        'fee_sc_st',
        'fee_payment_mode',
        // Vacancy details
        'vacancy_details',
        'vacancy_count',
        // Important dates
        'exam_date',
        'admit_card_date',
        // Selection & documents
        'selection_process',
        'documents_required',
        // Official links
        'notification_link',
        'apply_link',
        'official_website',
        // Additional info
        'important_notes',
    ];

    protected $casts = [
        'is_filled' => 'boolean',
        'views' => 'integer',
        'post_date' => 'date',
        'last_date' => 'date',
    ];

    public function savedByUsers()
    {
        return $this->belongsToMany(User::class, 'saved_jobs')->withTimestamps();
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    public function incrementViews()
    {
        $this->increment('views');
    }
}
