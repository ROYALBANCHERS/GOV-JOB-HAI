@echo off
echo ====================================
echo Laravel Backend Setup Script
echo ====================================
echo.

REM Check if PHP is installed
php -v >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: PHP is not installed or not in PATH!
    echo Please install PHP 8.1 or higher from https://windows.php.net/download/
    pause
    exit /b 1
)

echo PHP found!
php -v
echo.

REM Check if Composer is installed
composer --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Composer is not installed!
    echo Please install Composer from https://getcomposer.org/download/
    pause
    exit /b 1
)

echo Composer found!
composer --version
echo.

echo ====================================
echo Installing Laravel dependencies...
echo ====================================
call composer install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo ====================================
echo Setting up environment...
echo ====================================
if not exist .env (
    copy .env.example .env
    echo .env file created from .env.example
)

echo.
echo ====================================
echo Generating application key...
echo ====================================
call php artisan key:generate
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to generate application key!
    pause
    exit /b 1
)

echo.
echo ====================================
echo Creating database...
echo ==================================
if not exist database mkdir database
echo. > database\database.sqlite
echo SQLite database created at database/database.sqlite

echo.
echo ====================================
echo Running migrations...
echo ====================================
call php artisan migrate
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to run migrations!
    pause
    exit /b 1
)

echo.
echo ====================================
echo Seeding database with initial data...
echo ====================================
call php artisan db:seed
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Failed to seed database (this is optional)
)

echo.
echo ====================================
echo Setup completed successfully!
echo ====================================
echo.
echo To start the Laravel server, run:
echo   php artisan serve
echo.
echo The API will be available at: http://localhost:8000/api
echo.
echo Default admin credentials:
echo   Email: admin@sarkari.com
echo   Password: admin123
echo.
pause
