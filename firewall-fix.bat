@echo off
echo === Windows Firewall Fix (Run as Administrator) ===
echo Adding Node.js to Windows Firewall exceptions...
echo.

netsh advfirewall firewall add rule name="Node.js Metro Server" dir=in action=allow protocol=TCP localport=8081
netsh advfirewall firewall add rule name="Expo Development" dir=in action=allow program="%USERPROFILE%\AppData\Roaming\npm\node_modules\@expo\cli\build\bin\npx" enable=yes

echo.
echo Firewall rules added successfully!
echo Now restart: npx expo start --lan
pause