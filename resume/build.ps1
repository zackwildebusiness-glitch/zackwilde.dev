param(
  [string]$InputPath = "resume/resume.html",
  [string]$OutputPath = "Zack_Wilde_Resume.pdf"
)

$ErrorActionPreference = "Stop"

$programFilesX86 = [Environment]::GetEnvironmentVariable("ProgramFiles(x86)")

$browserCandidates = @(
  $env:CHROME_PATH,
  $env:EDGE_PATH,
  "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe",
  "$env:LOCALAPPDATA\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
  $(if ($programFilesX86) { "$programFilesX86\Google\Chrome\Application\chrome.exe" }),
  $(if ($programFilesX86) { "$programFilesX86\Microsoft\Edge\Application\msedge.exe" })
) | Where-Object { $_ -and (Test-Path $_) }

if (-not $browserCandidates) {
  throw "No Chrome or Edge executable was found. Set CHROME_PATH or EDGE_PATH to a Chromium browser executable, then rerun this script."
}

$browser = $browserCandidates[0]
$resolvedInput = (Resolve-Path $InputPath).ProviderPath
$resolvedOutput = Join-Path (Get-Location) $OutputPath
$inputUrl = [System.Uri]::new($resolvedInput).AbsoluteUri

& $browser `
  "--headless=new" `
  "--disable-gpu" `
  "--no-pdf-header-footer" `
  "--print-to-pdf=$resolvedOutput" `
  $inputUrl

if ($null -ne $LASTEXITCODE -and $LASTEXITCODE -ne 0) {
  throw "Browser PDF generation failed with exit code $LASTEXITCODE."
}

Write-Host "Wrote $resolvedOutput"
