@echo off
cd android && gradlew.bat assembleRelease && gradlew.bat installRelease && cd ..
