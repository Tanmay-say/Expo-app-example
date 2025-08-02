@echo off
echo =====================================================
echo    ElectroQuick LAN Mode Startup
echo =====================================================
echo Setting up environment variables...
set REACT_NATIVE_PACKAGER_HOSTNAME=192.168.84.91
set EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
echo.
echo LAN IP: %REACT_NATIVE_PACKAGER_HOSTNAME%
echo Listen Address: %EXPO_DEVTOOLS_LISTEN_ADDRESS%
echo.
echo Starting Expo Metro bundler...
npx expo start --lan --clear
echo.
echo Press any key to exit...
pause >nul
