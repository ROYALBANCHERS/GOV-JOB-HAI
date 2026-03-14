<?php

namespace Database\Seeders;

use App\Models\Job;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::firstOrCreate(
            ['email' => 'admin@sarkari.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );

        // Create sample jobs
        $jobs = [
            [
                'title' => 'SSC CGL 2024 Tier II Admit Card',
                'category' => 'admit_card',
                'post_date' => '2024-03-10',
                'last_date' => '2024-03-20',
                'short_info' => 'Staff Selection Commission (SSC) has released the admit card for CGL 2024 Tier II Exam.',
                'content' => '# SSC CGL 2024 Tier II Admit Card\n\nStaff Selection Commission (SSC) has released the admit card for Combined Graduate Level (CGL) 2024 Tier II Examination.',
                'external_link' => 'https://ssc.nic.in',
                'location' => 'All India',
                'job_type' => 'Full-time',
                'industry' => 'Government',
                'experience_level' => 'Entry',
                'qualification' => 'Graduate',
            ],
            [
                'title' => 'Railway RPF Constable Recruitment 2024',
                'category' => 'latest_job',
                'post_date' => '2024-03-01',
                'last_date' => '2024-04-15',
                'short_info' => 'Railway Recruitment Board (RRB) invites online applications for RPF Constable posts.',
                'content' => '# Railway RPF Constable Recruitment 2024\n\nRailway Recruitment Board (RRB) is inviting applications for the post of Constable in Railway Protection Force (RPF).',
                'external_link' => 'https://www.indianrailways.gov.in',
                'location' => 'Multiple Locations',
                'job_type' => 'Full-time',
                'industry' => 'Railway',
                'experience_level' => 'Entry',
                'qualification' => '10th Pass',
            ],
            [
                'title' => 'UPSC Civil Services Exam 2024 Result',
                'category' => 'result',
                'post_date' => '2024-03-05',
                'last_date' => null,
                'short_info' => 'Union Public Service Commission has declared the Civil Services 2024 final result.',
                'content' => '# UPSC Civil Services Exam 2024 Result\n\nThe Union Public Service Commission (UPSC) has declared the final result of Civil Services Examination 2024.',
                'external_link' => 'https://www.upsc.gov.in',
                'location' => 'All India',
                'job_type' => 'Full-time',
                'industry' => 'Government',
                'experience_level' => 'Entry',
                'qualification' => 'Graduate',
            ],
        ];

        foreach ($jobs as $job) {
            Job::firstOrCreate(
                ['title' => $job['title']],
                $job
            );
        }
    }
}
