@echo off
rem Kompyuter bilan tanishuv - saytni shu kompyuterda ishga tushiradi.
rem Internet kerak emas: faqat loyiha ichidagi vite ishlatiladi.
chcp 65001 >nul
title Kompyuter bilan tanishuv
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 goto :nonode
if not exist "node_modules\vite\bin\vite.js" goto :nomodules
if not exist "dist\index.html" goto :build
goto :run

:build
echo.
echo  Sayt birinchi marta yig'ilmoqda, biroz kuting...
echo.
call npm run build
if errorlevel 1 goto :buildfail

:run
echo.
echo  Sayt ishga tushdi:  http://localhost:4173
echo  Sinfdagi boshqa kompyuterlar uchun manzil pastda "Network" qatorida chiqadi.
echo  To'xtatish uchun shu oynani yoping.
echo.
node "node_modules\vite\bin\vite.js" preview --host --port 4173 --strictPort --open
if errorlevel 1 goto :runfail
goto :eof

:nonode
echo.
echo  Node.js topilmadi.
echo  https://nodejs.org saytidan Node.js ni o'rnating va start.bat ni qayta ishga tushiring.
goto :stop

:nomodules
echo.
echo  node_modules papkasi yo'q.
echo  Bir marta internet bilan shu papkada "npm install" buyrug'ini bajaring,
echo  keyin start.bat ni qayta ishga tushiring.
goto :stop

:buildfail
echo.
echo  Saytni yig'ib bo'lmadi. Yuqoridagi xato matnini tekshiring.
goto :stop

:runfail
echo.
echo  Sayt ishga tushmadi. 4173-port band bo'lishi mumkin:
echo  avval ochilgan start.bat oynasini yoping va qayta urinib ko'ring.

:stop
echo.
pause
