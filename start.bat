@echo off
setlocal
cd /d "%~dp0"

title REGEX DIFFERENCE EVALUATOR :: TAE1 AUTOMATA ENGINE
color 0B
cls

echo.
echo    ========================================================================================
echo    ^|                                                                                      ^|
echo    ^|   ######   #####   ######     ######   #####   ######                                ^|
echo    ^|   ##   ##  ##  ##  ##         ##   ##  ##  ##  ##                                    ^|
echo    ^|   ######   ##  ##  #####      ######   ##  ##  #####                                 ^|
echo    ^|   ##  ##   ##  ##  ##         ##  ##   ##  ##  ##                                    ^|
echo    ^|   ##   ##  #####   ######     ##   ##  #####   ######                                ^|
echo    ^|                                                                                      ^|
echo    ^|   --------------------------------------------------------------------------------   ^|
echo    ^|   * REGEX DIFFERENCE EVALUATOR  ^|  FORMAL AUTOMATA AND REGULAR LANGUAGES         *   ^|
echo    ^|   * Thompson NFA  --^>  Subset Total DFA  --^>  Product D1 x !D2  --^>  BFS Shortest *   ^|
echo    ^|   --------------------------------------------------------------------------------   ^|
echo    ^|                                                                                      ^|
echo    ========================================================================================
echo.

:: [1] Environment Check
echo    [^>] [1/3] Verifying Node.js and npm runtime environment...

where node >nul 2>nul
if errorlevel 1 (
    color 0C
    echo.
    echo    [!] CRITICAL ERROR: Node.js was not found in system PATH.
    echo    [!] Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

for /f "delims=" %%v in ('node -v 2^>nul') do set "NODE_VER=%%v"
for /f "delims=" %%v in ('npm -v 2^>nul') do set "NPM_VER=%%v"
echo    [+] [OK] Node.js %NODE_VER% detected - npm v%NPM_VER%

:: [2] Dependency Verification
echo.
echo    [^>] [2/3] Checking project dependencies...
if not exist "node_modules\" (
    echo    [*] node_modules missing. Running automatic initial setup [npm install]...
    echo.
    call npm install
    if errorlevel 1 (
        color 0C
        echo.
        echo    [!] ERROR: Failed to install project dependencies.
        pause
        exit /b 1
    )
    echo    [+] [OK] Dependencies installed successfully.
) else (
    echo    [+] [OK] All node_modules dependencies verified.
)

:: [3] Start Server & Launch Browser
echo.
echo    [^>] [3/3] Initializing Vite Development Server with auto-launch browser...
echo.
echo    +--------------------------------------------------------------------------------------+
echo    ^|                                                                                      ^|
echo    ^|   STATUS:      LOCAL DEV ENGINE IS ONLINE                                            ^|
echo    ^|   ACCESS URL:  http://localhost:5173/                                                ^|
echo    ^|   NETWORK:     http://127.0.0.1:5173/                                                ^|
echo    ^|                                                                                      ^|
echo    ^|   ^> Your default web browser will open automatically...                             ^|
echo    ^|   ^> Press [CTRL + C] in this console window anytime to stop the server.             ^|
echo    ^|                                                                                      ^|
echo    +--------------------------------------------------------------------------------------+
echo.

:: Launch Vite with automatic browser open and custom host/port
call npx vite --open --host 127.0.0.1 --port 5173

if errorlevel 1 (
    echo.
    echo    [!] Server process terminated.
    pause
)
