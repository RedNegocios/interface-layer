param(
    [Parameter(Mandatory=$false)]
    [string]$BuildPath = "C:\Projects\interface-layer\build",

    [Parameter(Mandatory=$false)]
    [string]$ServerPath = "C:\Projects\servers\red-negocios\frontend",

    [Parameter(Mandatory=$false)]
    [int]$Port = 3000
)

# deploy-frontend.ps1
# Copia el build a $ServerPath\dist, prepara un server minimal con express, y usa pm2 para arrancar/restart el proceso.

Write-Host "deploy-frontend.ps1 - BuildPath: $BuildPath, ServerPath: $ServerPath, Port: $Port" -ForegroundColor Cyan

if (-Not (Test-Path $BuildPath)) {
    Write-Host "ERROR: BuildPath no existe: $BuildPath" -ForegroundColor Red
    exit 1
}

# Crear server path y carpeta dist
if (-Not (Test-Path $ServerPath)) {
    New-Item -ItemType Directory -Path $ServerPath -Force | Out-Null
    Write-Host "Directorio creado: $ServerPath" -ForegroundColor Green
}

$distPath = Join-Path $ServerPath "dist"
if (Test-Path $distPath) {
    Write-Host "Limpiando carpeta dist existente..." -ForegroundColor Yellow
    Remove-Item -Path (Join-Path $distPath "*") -Recurse -Force -ErrorAction SilentlyContinue
} else {
    New-Item -ItemType Directory -Path $distPath -Force | Out-Null
}

# Copiar build -> dist
Write-Host "Copiando build de $BuildPath a $distPath ..." -ForegroundColor Cyan
Copy-Item -Path (Join-Path $BuildPath "*") -Destination $distPath -Recurse -Force
Write-Host "Copiado." -ForegroundColor Green

# Crear server.js que usa express para servir dist
$serverJs = @"
const express = require('express');
const path = require('path');
const port = process.env.PORT || $Port;
const app = express();
const staticDir = path.join(__dirname, 'dist');
app.use(express.static(staticDir));
app.get('*', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});
app.listen(port, () => console.log(`Frontend server listening on ${port}`));
"@

$serverJsPath = Join-Path $ServerPath "server.js"
Set-Content -Path $serverJsPath -Value $serverJs -Force -Encoding UTF8
Write-Host "server.js generado en $serverJsPath" -ForegroundColor Green

# Ensure package.json in serverPath
$pkgPath = Join-Path $ServerPath "package.json"
if (-Not (Test-Path $pkgPath)) {
    Write-Host "Creando package.json en $ServerPath" -ForegroundColor Yellow
    Push-Location $ServerPath
    npm init -y | Out-Null
    Pop-Location
}

# Install express locally if missing
$expressInstalled = Test-Path (Join-Path $ServerPath "node_modules\express")
if (-Not $expressInstalled) {
    Write-Host "Instalando express... Esto puede tardar unos segundos." -ForegroundColor Yellow
    Push-Location $ServerPath
    npm install express --no-audit --no-fund --silent
    $code = $LASTEXITCODE
    Pop-Location
    if ($code -ne 0) {
        Write-Host "ERROR: npm install express fallo con codigo $code" -ForegroundColor Red
        exit 1
    }
    Write-Host "express instalado" -ForegroundColor Green
} else {
    Write-Host "express ya esta instalado" -ForegroundColor Green
}

# Ensure pm2 is available globally
$pm2Found = $false
try {
    $pm2V = & pm2 -v 2>$null
    if ($LASTEXITCODE -eq 0) { $pm2Found = $true }
} catch {
    $pm2Found = $false
}

if (-Not $pm2Found) {
    Write-Host "pm2 no esta instalado globalmente. Intentando instalar pm2 globalmente..." -ForegroundColor Yellow
    npm install -g pm2
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ADVERTENCIA: No se pudo instalar pm2 globalmente. Puedes instalarlo manualmente: npm i -g pm2" -ForegroundColor Yellow
    } else {
        Write-Host "pm2 instalado globalmente" -ForegroundColor Green
    }
}

# Start or restart process with pm2
$pm2Name = "red-negocios-frontend"
Push-Location $ServerPath

# Check if pm2 process exists
$pm2List = @()
try {
    $pm2List = pm2 jlist 2>$null | ConvertFrom-Json
} catch {
    # if pm2 jlist not available fallback to pm2 list parsing
    $pm2List = @()
}

# Determine if process exists by checking pm2 status
$processExists = $false
try {
    $desc = pm2 describe $pm2Name 2>$null
    if ($LASTEXITCODE -eq 0 -and $desc) { $processExists = $true }
} catch {
    $processExists = $false
}

if ($processExists) {
    Write-Host "Reiniciando proceso pm2 '$pm2Name'..." -ForegroundColor Cyan
    pm2 restart $pm2Name
    if ($LASTEXITCODE -ne 0) {
        Write-Host "pm2 restart fallo, intentando stop + start" -ForegroundColor Yellow
        pm2 stop $pm2Name | Out-Null
        pm2 start server.js --name $pm2Name --update-env
    }
    Write-Host "pm2 proceso reiniciado" -ForegroundColor Green
} else {
    Write-Host "Iniciando nuevo proceso pm2 '$pm2Name'..." -ForegroundColor Cyan
    pm2 start server.js --name $pm2Name --update-env
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: pm2 start fallo con codigo $LASTEXITCODE" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    Write-Host "pm2 proceso iniciado" -ForegroundColor Green
}

# Save pm2 process list for startup
try {
    pm2 save | Out-Null
    Write-Host "pm2 lista guardada (pm2 save)" -ForegroundColor Green
} catch {
    Write-Host "Advertencia: pm2 save fallo" -ForegroundColor Yellow
}

# Back to original location
Pop-Location

# Quick check TCP
Write-Host "Verificando que el puerto $Port responda..." -ForegroundColor Cyan
$test = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue
if ($test.TcpTestSucceeded) {
    Write-Host "Frontend accesible en http://localhost:$Port" -ForegroundColor Green
} else {
    Write-Host "Advertencia: el puerto $Port no responde aun. Revisa pm2 logs: pm2 logs $pm2Name" -ForegroundColor Yellow
}

Write-Host "Deploy finalizado." -ForegroundColor Cyan
