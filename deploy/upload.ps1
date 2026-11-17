# ============================================================
# 一键上传网站到云服务器（在 Windows 本机运行，需要 OpenSSH + tar）
# Windows 10/11 自带 ssh / scp / tar，不用另外安装。
#
# 用法（在项目根目录打开 PowerShell）：
#   .\deploy\upload.ps1 -Server 1.2.3.4 -User root
#
# 第一次连接会问 yes/no，输入 yes 回车即可。
# ============================================================
param(
    [Parameter(Mandatory = $true)][string]$Server,
    [string]$User = "root",
    [string]$RemoteDir = "/var/www/yijunchen",
    [string]$Port = "22"
)

$ErrorActionPreference = "Stop"
$target = "$User@$Server"

# 1. 本机打包：只打包网站需要的文件，不含 .git 和 docs
$packages = @("index.html", "404.html", "robots.txt", "sitemap.xml", "about.html",
              "projects.html", "courses.html", "certificates.html", "design.html",
              "fitness.html", "cycling.html", "cats.html", "contact.html", "assets") |
            Where-Object { Test-Path $_ }

if (-not $packages) {
    throw "没有找到网页文件，请在项目根目录（有 index.html 的那一层）运行本脚本。"
}

$tmp = Join-Path $env:TEMP "yijunchen-site.tar.gz"
Write-Host "==> 1/3 本机打包 -> $tmp" -ForegroundColor Cyan
tar -czf $tmp @packages

# 2. 服务器上建目录并解压
Write-Host "==> 2/3 上传并解压到 $RemoteDir" -ForegroundColor Cyan
ssh -p $Port $target "sudo mkdir -p $RemoteDir && sudo chown -R `$(whoami) $RemoteDir"
scp -P $Port $tmp "${target}:/tmp/yijunchen-site.tar.gz"
ssh -p $Port $target "tar -xzf /tmp/yijunchen-site.tar.gz -C $RemoteDir && rm -f /tmp/yijunchen-site.tar.gz && ls -l $RemoteDir"

# 3. 完成
Remove-Item $tmp -Force
Write-Host "==> 3/3 完成！打开浏览器访问： http://$Server/" -ForegroundColor Green
Write-Host "    如果打不开，检查云控制台的「安全组」是否放行了 80 端口。" -ForegroundColor Yellow
