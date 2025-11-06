@echo off
echo ===== TVORBA LOKÁLNÍHO APK =====
echo.

REM Kontrola zda jsme v správném adresáři
if not exist "package.json" (
    echo Chyba: Nejsme v root adresáři projektu!
    pause
    exit /b 1
)

REM Kontrola zda existuje android složka
if not exist "android" (
    echo Android složka neexistuje, spouštím prebuild...
    npx expo prebuild -p android --clean
)

REM Instalace závislostí
echo Instaluji závislosti...
npm install

REM Vytvoření build složky
if not exist "build" mkdir build

REM Přechod do android složky a build
cd android
echo Spouštím lokální Gradle build...
.\gradlew assembleRelease

REM Kopírování APK do build složky
if exist "app\build\outputs\apk\release\app-release.apk" (
    copy "app\build\outputs\apk\release\app-release.apk" "..\build\Quotidis.apk"
    echo.
    echo ✓ APK úspěšně vytvořeno!
    echo Umístění: build\Quotidis.apk
    echo Velikost: 
    for %%A in ("..\build\Quotidis.apk") do echo %%~zA bytes
) else (
    echo.
    echo ✗ Chyba při vytváření APK!
    echo Zkontrolujte chybové hlášky výše.
)

cd ..
pause


