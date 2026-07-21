@echo off
setlocal

:: 1. スクリプトがあるディレクトリへ移動
pushd "%~dp0"

:: 2. Git Bash 経由で sh スクリプトを実行
"C:\Program Files\Git\bin\bash.exe" -c "./clean-spaces"

:: 3. エラーが起きても必ず元の場所へ戻る
popd
