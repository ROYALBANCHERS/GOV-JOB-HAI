# Government Job Hai - Laravel Backend API

This is the Laravel backend API for the Government Job Hai application.

## Requirements

- PHP 8.1 or higher
- Composer
- SQLite (included with PHP)

## Quick Setup

### Windows Users:

1. Run the setup script:
   ```bash
   setup.bat
   ```

### Manual Setup:

1. Install dependencies:
   ```bash
   composer install
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env
   ```

3. Generate application key:
   ```bash
   php artisan key:generate
   ```

4. Create database:
   ```bash
   mkdir database
   echo. > database\database.sqlite
   ```

5. Run migrations and seed database:
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

6. Start the server:
   ```bash
   php artisan serve
   ```

The API will be available at: **http://localhost:8000/api**

## Default Admin Credentials

- Email: `admin@sarkari.com`
- Password: `admin123`

## API Endpoints

### Authentication

- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user (requires auth)
- `GET /api/me` - Get current user (requires auth)

### Jobs (Public)

- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/{id}` - Get job by ID

### Jobs (User - Requires Auth)

- `POST /api/save-job/{id}` - Save a job
- `DELETE /api/save-job/{id}` - Unsave a job
- `GET /api/saved-jobs` - Get saved jobs
- `POST /api/apply/{id}` - Apply for a job (returns external link)
- `GET /api/applications` - Get user applications

### Jobs (Admin - Requires Admin Auth)

- `POST /api/admin/jobs` - Create new job
- `PUT /api/admin/jobs/{id}` - Update job
- `DELETE /api/admin/jobs/{id}` - Delete job
- `GET /api/admin/analytics` - Get analytics data

## Job Model

The job model includes the following fields:

- `title` - Job title
- `category` - Job category (latest_job, admit_card, result, etc.)
- `post_date` - Posting date
- `last_date` - Last date to apply
- `short_info` - Short description
- `content` - Full job content
- `external_link` - Link to official government portal (for Apply Now)
- `location` - Job location
- `job_type` - Type (Full-time, Part-time, Contract)
- `industry` - Industry sector
- `experience_level` - Level required (Entry, Mid, Senior)
- `qualification` - Required qualification
- `is_filled` - Whether the position is filled
- `views` - View count

## External Redirect Feature

When users click "Apply Now", they are redirected to the official government job portal via the `external_link` field. The `/api/apply/{id}` endpoint:

1. Records the application in the database
2. Returns the external link for the job
3. The frontend then redirects the user to the official portal

## Development

### Run migrations:
```bash
php artisan migrate
```

### Seed database:
```bash
php artisan db:seed
```

### Clear cache:
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

### Tinker (interactive console):
```bash
php artisan tinker
```

## Security

- All protected routes require authentication via Laravel Sanctum
- Admin routes require admin role
- CORS enabled for frontend communication
- CSRF protection enabled for web routes

## License

MIT
