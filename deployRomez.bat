@echo off
cd /d "%~dp0"

:: ================================
:: 🚀 RMS_UI - Deploy Universale
:: ✔️ Commit + Push + Deploy Netlify
:: ✔️ Log dettagliato in /logs
:: ✔️ A prova di percorso e cache
:: ================================

:: 📆 Timestamp
for /f "tokens=1-3 delims=/: " %%a in ("%date%") do set today=%%c-%%b-%%a
for /f "tokens=1-2 delims=:." %%a in ("%time%") do set now=%%a-%%b
set timestamp=%today%_%now%
set logfolder=logs
set logfile=%logfolder%\deploy-%timestamp%.txt

:: 📁 Crea cartella log se non esiste
if not exist "%logfolder%" mkdir "%logfolder%"

echo ----------------------------------------- >> "%logfile%"
echo [%timestamp%] >> "%logfile%"
echo. >> "%logfile%"

:: 📝 Chiedi il messaggio di commit
echo Inserisci il messaggio per il commit:
set /p msg=Messaggio: 
echo Commit: %msg% >> "%logfile%"

:: 🧹 Rimuove file temporanei
del /s /q "%~dp0*.tmp" >nul 2>&1

:: 📦 Git add, commit e push
git add .
git commit -m "%msg%"
git push

:: 🔁 Verifica esito push
if errorlevel 1 (
    echo ❌ Push fallito. >> "%logfile%"
) else (
    echo ✅ Push riuscito. >> "%logfile%"
)

:: 📋 File modificati
echo. >> "%logfile%"
echo File modificati: >> "%logfile%"
git diff --name-only HEAD~1 HEAD >> "%logfile%"

:: ✅ Verifica index.html presente
if exist index.html (
    echo ✅ index.html trovato. >> "%logfile%"
) else (
    echo ⚠️ ATTENZIONE: index.html NON trovato! >> "%logfile%"
)

:: 🚀 Deploy Netlify (call per sicurezza)
echo. >> "%logfile%"
echo Eseguo il deploy su Netlify... >> "%logfile%"
call netlify deploy --prod --dir="." >> "%logfile%"

:: 🌍 URL online
echo. >> "%logfile%"
echo Sito online: https://r-member-system-app.netlify.app >> "%logfile%"

:: ✅ Fine log
echo ----------------------------------------- >> "%logfile%"
echo Log salvato in %logfile%
echo.

:: 🎉 Happy beep finale
echo.
echo DEPLOY COMPLETATO! Tutto online e funzionante! 🎉
echo 
ping -n 2 127.0.0.1 >nul
echo 

:: 🌐 Apri sito in browser
start https://r-member-system-app.netlify.app


:: 🌐 Apri sito in browser
start https://r-member-system-app.netlify.app

pause
