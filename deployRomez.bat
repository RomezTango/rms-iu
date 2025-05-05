@echo off
cd /d "%~dp0"

:: ================================
:: 🛠️ RMS_UI - Deploy Universale
:: ✔️ Portabile tra drive H: / G: / USB ecc.
:: ✔️ Pulizia .tmp + commit + deploy Netlify
:: ✔️ Log automatico in /logs
:: ================================

:: 📆 Crea timestamp data + ora
for /f "tokens=1-3 delims=/: " %%a in ("%date%") do set today=%%c-%%b-%%a
for /f "tokens=1-2 delims=:." %%a in ("%time%") do set now=%%a-%%b
set timestamp=%today%_%now%
set logfolder=logs
set logfile=%logfolder%\deploy-%timestamp%.txt

:: 📁 Crea cartella logs se non esiste
if not exist "%logfolder%" mkdir "%logfolder%"

echo ----------------------------------------- >> "%logfile%"
echo [%timestamp%] >> "%logfile%"
echo. >> "%logfile%"

:: 📝 Chiedi il messaggio di commit
echo Inserisci il messaggio per il commit:
set /p msg=Messaggio: 
echo Commit: %msg% >> "%logfile%"

:: 🧹 Rimuove eventuali file temporanei .tmp
del /s /q "%~dp0*.tmp" >nul 2>&1

:: 📦 Git add, commit e push
git add .
git commit -m "%msg%"
git push

:: 🔁 Controlla esito push
if errorlevel 1 (
    echo Push fallito. >> "%logfile%"
) else (
    echo Push riuscito. >> "%logfile%"
)

:: 📋 Log dei file modificati
echo. >> "%logfile%"
echo File modificati: >> "%logfile%"
git diff --name-only HEAD~1 HEAD >> "%logfile%"

:: 🚀 Deploy Netlify
echo. >> "%logfile%"
echo Eseguo il deploy su Netlify... >> "%logfile%"
netlify deploy --prod --dir="." >> "%logfile%"

:: 🌍 Link live del sito
echo. >> "%logfile%"
echo Sito online: https://r-member-system-app.netlify.app >> "%logfile%"

:: ✅ Fine log
echo ----------------------------------------- >> "%logfile%"
echo Log salvato in %logfile%
echo.

:: 🌐 Apri il sito automaticamente
start https://r-member-system-app.netlify.app

pause
