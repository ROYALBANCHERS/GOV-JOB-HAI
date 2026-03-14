<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JobController extends Controller
{
    public function index(Request $request)
    {
        $query = Job::where('is_filled', false);

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Search query
        if ($request->has('q')) {
            $searchTerm = $request->q;
            $query->where(function($q) use ($searchTerm) {
                $q->where('title', 'like', "%{$searchTerm}%")
                  ->orWhere('content', 'like', "%{$searchTerm}%");
            });
        }

        // Location filter
        if ($request->has('location')) {
            $query->where('location', 'like', "%{$request->location}%");
        }

        // Job type filter
        if ($request->has('job_type')) {
            $query->where('job_type', $request->job_type);
        }

        // Industry filter
        if ($request->has('industry')) {
            $query->where('industry', $request->industry);
        }

        // Experience level filter
        if ($request->has('experience_level')) {
            $query->where('experience_level', $request->experience_level);
        }

        // Qualification filter
        if ($request->has('qualification')) {
            $query->where('qualification', 'like', "%{$request->qualification}%");
        }

        $jobs = $query->orderBy('created_at', 'desc')->get();

        return response()->json($jobs);
    }

    public function show($id)
    {
        $job = Job::findOrFail($id);
        $job->incrementViews();

        return response()->json($job);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Job::class);

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'post_date' => 'nullable|date',
            'last_date' => 'nullable|date',
            'short_info' => 'nullable|string',
            'content' => 'nullable|string',
            'external_link' => 'nullable|url',
            'location' => 'nullable|string',
            'job_type' => 'nullable|string',
            'industry' => 'nullable|string',
            'experience_level' => 'nullable|string',
            'qualification' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $job = Job::create($request->all());

        return response()->json($job, 201);
    }

    public function update(Request $request, $id)
    {
        $job = Job::findOrFail($id);
        $this->authorize('update', $job);

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'post_date' => 'nullable|date',
            'last_date' => 'nullable|date',
            'short_info' => 'nullable|string',
            'content' => 'nullable|string',
            'external_link' => 'nullable|url',
            'location' => 'nullable|string',
            'job_type' => 'nullable|string',
            'industry' => 'nullable|string',
            'experience_level' => 'nullable|string',
            'qualification' => 'nullable|string',
            'is_filled' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $job->update($request->all());

        return response()->json($job);
    }

    public function destroy($id)
    {
        $job = Job::findOrFail($id);
        $this->authorize('delete', $job);

        $job->delete();

        return response()->json([
            'message' => 'Job deleted successfully'
        ]);
    }

    public function saveJob(Request $request, $id)
    {
        $user = $request->user();
        $job = Job::findOrFail($id);

        if ($user->savedJobs()->where('job_id', $id)->exists()) {
            return response()->json([
                'message' => 'Job already saved'
            ], 400);
        }

        $user->savedJobs()->attach($id);

        return response()->json([
            'message' => 'Job saved successfully'
        ]);
    }

    public function unsaveJob(Request $request, $id)
    {
        $user = $request->user();
        $job = Job::findOrFail($id);

        $user->savedJobs()->detach($id);

        return response()->json([
            'message' => 'Job unsaved successfully'
        ]);
    }

    public function savedJobs(Request $request)
    {
        $user = $request->user();
        $jobs = $user->savedJobs()->orderBy('created_at', 'desc')->get();

        return response()->json($jobs);
    }

    public function apply(Request $request, $id)
    {
        $user = $request->user();
        $job = Job::findOrFail($id);

        // Check if already applied
        if ($user->applications()->where('job_id', $id)->exists()) {
            return response()->json([
                'message' => 'Already applied'
            ], 400);
        }

        // Create application record
        $application = $user->applications()->create([
            'job_id' => $id,
            'status' => 'applied',
        ]);

        // Return external link if available
        if ($job->external_link) {
            return response()->json([
                'message' => 'Application recorded. Redirecting to official portal.',
                'external_link' => $job->external_link,
                'application_id' => $application->id,
            ]);
        }

        return response()->json([
            'message' => 'Application recorded successfully',
            'application_id' => $application->id,
        ]);
    }

    public function applications(Request $request)
    {
        $user = $request->user();
        $applications = $user->applications()
            ->with('job:title,id')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($applications);
    }

    public function analytics(Request $request)
    {
        $this->authorize('viewAnalytics', Job::class);

        $topJobs = Job::orderBy('views', 'desc')->limit(5)->get(['title', 'views']);
        $totalJobs = Job::count();
        $totalUsers = \App\Models\User::count();
        $totalApps = \App\Models\Application::count();

        return response()->json([
            'topJobs' => $topJobs,
            'totalJobs' => $totalJobs,
            'totalUsers' => $totalUsers,
            'totalApps' => $totalApps,
        ]);
    }
}
