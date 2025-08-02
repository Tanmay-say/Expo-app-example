@echo off
echo === ElectroQuick Fix Script ===
echo.
echo Solution 1: Tunnel Mode (bypasses all network issues)
set REACT_NATIVE_PACKAGER_HOSTNAME=192.168.84.91
npx expo start --tunnel --clear
echo.
echo If tunnel is slow, press Ctrl+C and try Solution 2:
echo npx expo start --lan