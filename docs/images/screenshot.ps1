# ============================================================
# 用 Microsoft Edge 无头模式给网站截图（本机装了 Edge 就能用）
#
# 在项目根目录执行：
#   powershell -ExecutionPolicy Bypass -File docs\images\screenshot.ps1
#
# 生成：
#   docs/images/home.png       首页（桌面 1440px）
#   docs/images/projects.png   项目经历
#   docs/images/courses.png    上过的课程
#   docs/images/mobile.png     手机尺寸（390px）
#
# 需要 Node.js（用来模拟手机尺寸的小服务在 screenshot-server.js）。
# 没有 Node.js 就手动截图：浏览器 F12 → Ctrl+Shift+M → 选设备 → 截图。
# ============================================================
$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$out  = $PSScriptRoot
$edge = @(
    "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $edge) { throw "没有找到 Microsoft Edge，请手动截图。" }

$profileDir = Join-Path ([IO.Path]::GetTempPath()) "yijunchen-edge-profile"
$pages = @(
    @{ name = "home";     page = "index.html";    w = 1440; h = 2400 },
    @{ name = "projects"; page = "projects.html"; w = 1440; h = 1800 },
    @{ name = "courses";  page = "courses.html";  w = 1440; h = 1800 },
    @{ name = "mobile";   page = "index.html";    w = 390;  h = 1600 }
)

foreach ($p in $pages) {
    $file = Join-Path $out ($p.name + ".png")
    $url  = "file:///" + (((Join-Path $root $p.page) -replace '\\', '/'))
    $args = @(
        "--headless=new", "--disable-gpu", "--hide-scrollbars",
        "--no-first-run", "--no-default-browser-check",
        "--user-data-dir=$profileDir",
        "--window-size=$($p.w),$($p.h)",
        "--virtual-time-budget=8000",
        "--screenshot=$file",
        $url
    )
    & $edge @args 2>$null | Out-Null
    if (Test-Path $file) { Write-Host "已生成 $file" -ForegroundColor Green }
    else { Write-Host "截图失败：$($p.name)" -ForegroundColor Red }
}

$profileDir | ForEach-Object { Remove-Item -Recurse -Force $_ -ErrorAction SilentlyContinue }
