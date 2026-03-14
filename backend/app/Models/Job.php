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
