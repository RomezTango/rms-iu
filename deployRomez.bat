@echo off
cd /d "H:\Il mio Drive\RMS\RMS_UI"
echo -----------------------------------------
echo Inserisci il messaggio per il commit:
set /p msg=Messaggio: 
git add .
git commit -m "%msg%"
git push
netlify deploy --prod
pause