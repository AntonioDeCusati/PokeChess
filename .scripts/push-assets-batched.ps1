# =============================================================================
# Pushes apps/assets/ to origin/main in batches of $BatchSize files per commit.
# Usage:    .\.scripts\push-assets-batched.ps1                 (default 10000)
#           .\.scripts\push-assets-batched.ps1 -BatchSize 5000
#           .\.scripts\push-assets-batched.ps1 -StartBatch 7   (resume)
# Safe to re-run: each iteration only adds files that are still untracked.
# =============================================================================

[CmdletBinding()]
param(
    [int]$BatchSize  = 10000,
    [int]$StartBatch = 1
)

$ErrorActionPreference = 'Stop'
Set-Location -Path (Join-Path $PSScriptRoot '..')

$listPath = Join-Path $env:TEMP 'pokechess-asset-files.txt'

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function Refresh-FileList {
    Write-Host '[scan] enumerating untracked assets...' -ForegroundColor Cyan
    $lines = git ls-files --others --exclude-standard apps/assets
    [System.IO.File]::WriteAllLines($listPath, $lines, $utf8NoBom)
    return $lines
}

$files     = Refresh-FileList
$total     = $files.Count
$batches   = [math]::Ceiling($total / $BatchSize)
Write-Host ("[plan] {0} files / {1} per batch = {2} batches" -f $total, $BatchSize, $batches) -ForegroundColor Yellow

if ($total -eq 0) { Write-Host 'Nothing to do.' -ForegroundColor Green; exit 0 }

for ($i = $StartBatch; $i -le $batches; $i++) {
    $start = ($i - 1) * $BatchSize
    $end   = [Math]::Min($start + $BatchSize - 1, $total - 1)
    $batch = $files[$start..$end]

    $idxStr   = ([string]$i).PadLeft(3, '0')
    $totStr   = ([string]$batches).PadLeft(3, '0')
    $label    = "$idxStr-of-$totStr"
    $batchFile = Join-Path $env:TEMP "pokechess-batch-$idxStr.txt"
    [System.IO.File]::WriteAllLines($batchFile, $batch, $utf8NoBom)

    Write-Host ""
    Write-Host "==== batch $label : $($batch.Count) files ====" -ForegroundColor Magenta

    Write-Host '[add ] staging...' -ForegroundColor DarkGray
    git add --pathspec-from-file=$batchFile
    if ($LASTEXITCODE -ne 0) { throw "git add failed at batch $i" }

    Write-Host '[cmt ] committing...' -ForegroundColor DarkGray
    git commit -m "chore(assets): import PMDCollab pack $label" --quiet
    if ($LASTEXITCODE -ne 0) { throw "git commit failed at batch $i" }

    Write-Host '[sync] git pull --rebase ...' -ForegroundColor DarkGray
    git pull --rebase origin main
    if ($LASTEXITCODE -ne 0) { throw "git pull --rebase failed at batch $i" }

    Write-Host '[push] pushing to origin/main...' -ForegroundColor DarkGray
    git push origin main
    if ($LASTEXITCODE -ne 0) { throw "git push failed at batch $i" }

    Remove-Item -LiteralPath $batchFile -ErrorAction SilentlyContinue
    Write-Host "[done] batch $label OK" -ForegroundColor Green
}

Write-Host ""
Write-Host 'ALL BATCHES PUSHED.' -ForegroundColor Green
