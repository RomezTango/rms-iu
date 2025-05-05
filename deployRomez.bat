@echo off
cd /d "H:\Il mio Drive\RMS\RMS_UI"
echo -----------------------------------------
echo Inserisci il messaggio per il commit:
set /p msg=Messaggio: 

:: Salva data e ora
for /f "tokens=1-3 delims=/: " %%a in ("%date%") do set today=%%c-%%b-%%a
for /f "tokens=1-2 delims=:." %%a in ("%time%") do set now=%%a-%%b
set timestamp=%today%_%now%

:: Inizio log
echo ----------------------------------------- >> deploy-log.txt
echo [%timestamp%] Commit: %msg% >> deploy-log.txt

:: Git commit e push
git add .
git commit -m "%msg%"
git push

if errorlevel 1 (
    echo Push fallito. >> deploy-log.txt
) else (
    echo Push riuscito. >> deploy-log.txt
)

:: Deploy su Netlify e cattura output
echo Eseguo il deploy su Netlify...
netlify deploy --prod --json > .deploy-output.tmp

:: Estrai URL dal JSON (grezzo ma funziona)
findstr /i "deploy_url" .deploy-output.tmp >> deploy-log.txt
del .deploy-output.tmp

:: Fine log
echo ----------------------------------------- >> deploy-log.txt
echo. >> deploy-log.txt

echo ✅ Deploy completato! Log aggiornato in deploy-log.txt
pause
