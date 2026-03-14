# Government Job Hai - HTML/CSS/JavaScript Frontend

A modern, responsive frontend for government job listings built with vanilla HTML, CSS, and JavaScript. Connects to the PHP Laravel backend API.

## Features

- **Job Browsing**: View government jobs by category (Latest Jobs, Admit Cards, Results, etc.)
- **Search & Filter**: Advanced search with location, qualification, and job type filters
- **Apply Now**: Direct redirect to official government job portals
- **User Authentication**: Login/Register for accessing admin dashboard
- **Admin Dashboard**: Manage jobs with CRUD operations
- **Responsive Design**: Mobile-friendly interface
- **Fast Performance**: No framework overhead, pure vanilla JavaScript

## Prerequisites

- A web server (Apache, Nginx, or any static file server)
- PHP Laravel backend running on http://localhost:8000
- Modern web browser with JavaScript enabled

## Quick Start

### Option 1: Using Python Simple Server

```bash
cd frontend
python -m http.server 3000
```

### Option 2: Using Node.js http-server

```bash
npm install -g http-server
cd frontend
http-server -p 3000
```

### Option 3: Using PHP Built-in Server

```bash
cd frontend
php -S localhost:3000
```

### Option 4: VS Code Live Server

1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

Then open: **http://localhost:3000**

## Project Structure

```
frontend/
├── index.html          # Homepage with job listings
├── job.html            # Job details page
├── login.html          # User login page
├── register.html       # User registration page
├── admin.html          # Admin dashboard
├── profile.html        # User profile page (to be created)
├── search.html         # Search results page (to be created)
├── category/           # Category-specific pages (to be created)
├── css/
│   └── styles.css      # Main stylesheet
└── js/
    ├── api.js          # API communication
    ├── auth.js         # Authentication management
    └── main.js         # Main application logic
```

## Configuration

### API Base URL

The API base URL is automatically configured:
- **Development**: Uses Vite proxy at `/api` (proxies to http://localhost:8000)
- **Production**: Uses direct URL `http://localhost:8000/api`

To change the API URL, edit `js/api.js`:

```javascript
const API_CONFIG = {
    baseURL: 'http://your-backend-url/api',
    timeout: 10000
};
```

## Pages

### Homepage (`index.html`)
- Job search and filters
- Latest updates marquee
- Job listings by category (Results, Admit Cards, Latest Jobs)
- Secondary category links
- About section

### Job Details (`job.html`)
- Full job description
- External apply button (redirects to government portal)
- Save job functionality
- Print functionality

### Login (`login.html`)
- User authentication
- Redirect to previous page after login

### Register (`register.html`)
- New user registration
- Form validation

### Admin Dashboard (`admin.html`)
- Statistics overview
- Job management (CRUD)
- Add external government portal links
- Category management

## Features

### Apply Now Redirect
Jobs with an `external_link` field will redirect users directly to official government portals:

1. Admin adds job with external link (e.g., https://ssc.nic.in)
2. User clicks "Apply Now" button
3. New tab opens with the official government portal
4. Application is tracked in the database

### Search & Filter
- **Text Search**: Search in job title and content
- **Location Filter**: Filter by job location
- **Qualification Filter**: Filter by required qualification
- **Job Type Filter**: Full-time, Part-time, Contract

### Authentication
- Token-based authentication via Laravel Sanctum
- Auto-redirect to login for protected pages
- Persistent login using localStorage

## Admin Usage

### Login Credentials
Default admin account:
- Email: `admin@sarkari.com`
- Password: `admin123`

### Adding Jobs with External Links
1. Login to admin dashboard
2. Click "+ Add New Job"
3. Fill in job details
4. **Important**: Add the official government portal URL in "External Apply Link" field
   - Example: `https://ssc.nic.in`
   - Example: `https://upsc.gov.in`
   - Example: `https://www.indianrailways.gov.in`
5. Click "Save Job"

### Managing Jobs
- **Edit**: Update job details including external links
- **Delete**: Remove job listings
- **View Statistics**: Track total jobs, users, and applications

## Customization

### Styling
Edit `css/styles.css` to customize colors, fonts, and layout:

```css
:root {
    --primary-color: #004a99;
    --primary-dark: #003d7a;
    --success-color: #22c55e;
    /* ... more variables */
}
```

### Adding New Pages
1. Create HTML file in `frontend/` directory
2. Include CSS and JS files:
   ```html
   <link rel="stylesheet" href="css/styles.css">
   <script src="js/api.js"></script>
   <script src="js/auth.js"></script>
   ```
3. Use API functions from `api.js` and `auth.js`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Lightweight**: No framework dependencies
- **Fast Loading**: Minimal CSS and JavaScript
- **Responsive**: Works on all devices
- **SEO Friendly**: Semantic HTML structure

## Security

- Token-based authentication
- Protected admin routes
- Input sanitization (XSS prevention)
- HTTPS recommended for production

## Deployment

### Static Hosting
Deploy to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront
- Apache/Nginx server

### Build
No build process required! Just upload the files as-is.

### Production Configuration
Before deploying, update the API URL in `js/api.js` to your production backend URL.

## Troubleshooting

### API Connection Issues
- Ensure backend is running on http://localhost:8000
- Check browser console for errors
- Verify CORS is enabled in Laravel backend

### Login Not Working
- Clear browser localStorage
- Check if backend server is running
- Verify admin credentials

### Jobs Not Loading
- Check browser console for API errors
- Verify database has jobs (run `php artisan db:seed`)
- Check API endpoint URLs

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify backend server is running
3. Check database connection
4. Review API response in Network tab

## License

MIT
