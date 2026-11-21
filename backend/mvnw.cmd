@REM ----------------------------------------------------------------------------
@REM Maven Wrapper Batch Script for Student Attendance System
@REM Automatically downloads and runs Maven without manual installation!
@REM ----------------------------------------------------------------------------

@IF "%DEBUG%" == "" @ECHO OFF
@SETLOCAL EnableExtensions EnableDelayedExpansion

REM Auto-detect Java 17
IF NOT DEFINED JAVA_HOME (
    IF EXIST "C:\Program Files\Java\jdk-17" (
        SET "JAVA_HOME=C:\Program Files\Java\jdk-17"
    )
)
IF DEFINED JAVA_HOME (
    SET "PATH=%JAVA_HOME%\bin;%PATH%"
)

SET "DIR=%~dp0"
SET "MVN_DIR=%DIR%.maven\apache-maven-3.9.6"
SET "MVN_EXE=%MVN_DIR%\bin\mvn.cmd"

IF EXIST "%MVN_EXE%" (
    GOTO :RUN_MAVEN
)

ECHO =========================================================================
ECHO Maven is not detected. Automatically downloading portable Maven for you...
ECHO (This is a one-time automated download of ~9MB. Please wait a few seconds)
ECHO =========================================================================

IF NOT EXIST "%DIR%.maven" (
    MKDIR "%DIR%.maven"
)

SET "ZIP_URL=https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip"
SET "ZIP_FILE=%DIR%.maven\maven.zip"

ECHO Downloading Apache Maven from %ZIP_URL%...
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('%ZIP_URL%', '%ZIP_FILE%')"

IF NOT EXIST "%ZIP_FILE%" (
    ECHO [ERROR] Failed to download Maven zip file. Please check your internet connection.
    PAUSE
    EXIT /B 1
)

ECHO Extracting Maven...
powershell -Command "Expand-Archive -Path '%ZIP_FILE%' -DestinationPath '%DIR%.maven' -Force"
IF EXIST "%ZIP_FILE%" DEL "%ZIP_FILE%"

IF NOT EXIST "%MVN_EXE%" (
    ECHO [ERROR] Extraction failed. Could not find %MVN_EXE%
    PAUSE
    EXIT /B 1
)

ECHO Maven download and setup completed successfully!
ECHO =========================================================================

:RUN_MAVEN
"%MVN_EXE%" %*
