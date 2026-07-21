# 1. スクリプトのディレクトリへ移動
Push-Location (Resolve-Path "$PSScriptRoot")

try {
  # 2. フルパスで bash.exe を指定して ./clean-spaces を実行
  & "C:\Program Files\Git\bin\bash.exe" "./clean-spaces"
}
finally {
  # 3. エラーが起きても必ず元の場所へ戻る
  Pop-Location
}