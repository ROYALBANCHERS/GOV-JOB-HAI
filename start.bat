@echo off
echo ====================================
echo Government Job Hai - Startup Script
echo ====================================
echo.
echo Checking environment...
if not exist .env (
    echo WARNING: .env file not found!
    echo Creating .env from .env.example...
    if exist .env.example (
        copy .env.example .env
        echo .env file created successfully!
        echo.
        echo Please edit .env file with your configuration before starting.
        echo Press any key to open .env file...
        pause > nul
        notepad .env
    ) else (
        echo ERROR: .env.example not found!
        echo Please create .env file manually.
    )
    echo.
    pause
    exit /b 1
)

echo.
echo Installing dependencies (if needed)...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo ====================================
echo Starting development server...
echo ====================================
echo.
echo The application will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
call npm run dev
