@echo off
cd /d "H:\Il mio Drive\RMS\RMS_UI"

:: Data e ora formattati
for /f "tokens=1-3 delims=/: " %%a in ("%date%") do set today=%%c-%%b-%%a
for /f "tokens=1-2 delims=:." %%a in ("%time%") do set now=%%a-%%b
set timestamp=%today%_%now%
set logfolder=logs
set logfile=%logfolder%\deploy-%timestamp%.txt

:: Crea cartella logs se non esiste
if not exist "%logfolder%" mkdir "%logfolder%"

echo ----------------------------------------- >> "%logfile%"
echo [%timestamp%] >> "%logfile%"
echo. >> "%logfile%"

:: Messaggio commit
echo Inserisci il messaggio per il commit:
set /p msg=Messaggio: 
echo Commit: %msg% >> "%logfile%"

:: Git add, commit e push
git add .
git commit -m "%msg%"
git push

if errorlevel 1 (
    echo Push fallito. >> "%logfile%"
) else (
    echo Push riuscito. >> "%logfile%"
)

:: Elenco dei file modificati
echo. >> "%logfile%"
echo File modificati: >> "%logfile%"
git diff --name-only HEAD~1 HEAD >> "%logfile%"

:: Deploy Netlify
echo. >> "%logfile%"
echo Eseguo il deploy su Netlify... >> "%logfile%"
netlify deploy --prod --dir="." >> "%logfile%"

:: URL live (aggiunto a mano per comodità)
echo. >> "%logfile%"
echo Sito online: https://r-member-system-app.netlify.app >> "%logfile%"

:: Fine
echo ----------------------------------------- >> "%logfile%"
echo Log salvato in %logfile%
echo.

:: (Opzionale) Apri il sito live
start https://r-member-system-app.netlify.app

pause
