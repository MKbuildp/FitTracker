@echo off
echo ===== VYTVORENI AAB PRO REPCOUNTER =====
echo.

REM Určení cílové složky
set TARGET_DIR=C:\FitTrackerBuild

echo Cílový adresář pro build: %TARGET_DIR%
echo.

REM Kontrola zda cílový adresář existuje, jinak ho vytvoříme
if not exist "%TARGET_DIR%" (
  echo Vytvářím adresář %TARGET_DIR%...
  mkdir "%TARGET_DIR%"
) else (
  echo Adresář %TARGET_DIR% už existuje, bude přepsán.
  rmdir /S /Q "%TARGET_DIR%"
  mkdir "%TARGET_DIR%"
)

echo.
echo Kopíruji soubory projektu do %TARGET_DIR%...
xcopy /E /I /Y ".\" "%TARGET_DIR%\"

echo.
echo Přecházím do adresáře %TARGET_DIR%
cd /d "%TARGET_DIR%"

echo.
echo Spouštím přípravu nativního kódu...
call npx expo prebuild -p android

echo.
echo Přecházím do adresáře android...
cd android

echo.
echo Spouštím build AAB...
call .\gradlew bundleRelease

echo.
if exist "app\build\outputs\bundle\release\app-release.aab" (
  echo AAB ÚSPĚŠNĚ VYTVOŘENO!
  echo.
  echo AAB soubor najdete v: %TARGET_DIR%\android\app\build\outputs\bundle\release\app-release.aab
  
  REM Zkopírování AAB do výchozí složky projektu pro snadnější přístup
  echo.
  echo Kopíruji AAB zpět do původního adresáře...
  copy "app\build\outputs\bundle\release\app-release.aab" "..\..\RepCounter.aab"
  
  echo.
  echo AAB zkopírováno do: %~dp0RepCounter.aab
) else (
  echo Chyba při vytváření AAB!
  echo Zkontrolujte výpis chyb výše.
)

echo.
echo ===== KONEC =====
pause 