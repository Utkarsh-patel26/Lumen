$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location `"$root`"; npm install; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location `"$root\frontend`"; npm install; npm run dev"