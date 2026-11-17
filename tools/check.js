// ============================================================
// 本地预览 + 自动检查（需要 Node.js）
//
// 在项目根目录执行：
//   node tools/check.js            # 只检查，不启动服务器
//   node tools/check.js --serve    # 启动本地服务器 http://localhost:8080
//
// 检查内容：
//   1. 每个 HTML 页面引用的 css / js / 图片文件是否存在
//   2. 站内链接（href="xxx.html"）指向的页面是否存在
//   3. 页面是否包含基本的 meta / title
//   4. 标签配对是否大致正常（div/section/article 的开闭数量）
// 输出全部通过时退出码为 0，有错误时为 1（可以在提交前跑一遍）。
// ============================================================
'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');

const root = path.resolve(__dirname, '..');
const errors = [];
const warnings = [];

function listHtml() {
  return fs.readdirSync(root).filter((f) => f.endsWith('.html'));
}

function exists(rel) {
  const clean = rel.split('#')[0].split('?')[0];
  if (!clean) return true;
  return fs.existsSync(path.join(root, clean));
}

function checkTags(html, file) {
  ['div', 'section', 'article', 'main', 'nav', 'header', 'footer', 'ul', 'dl', 'table', 'details'].forEach((tag) => {
    const open = (html.match(new RegExp('<' + tag + '(\\s|>)', 'g')) || []).length;
    const close = (html.match(new RegExp('</' + tag + '>', 'g')) || []).length;
    if (open !== close) {
      errors.push(`${file}: <${tag}> 开 ${open} 个 / 闭 ${close} 个，标签没有配对`);
    }
  });
}

const files = listHtml();
files.forEach((file) => {
  const html = fs.readFileSync(path.join(root, file), 'utf8');

  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${file}: 缺少 <title>`);
  if (!/<meta name="description"/.test(html)) warnings.push(`${file}: 缺少 meta description`);
  if (!/<meta charset="UTF-8"/.test(html)) errors.push(`${file}: 缺少 meta charset`);
  if (!/<meta name="viewport"/.test(html)) errors.push(`${file}: 缺少 viewport（手机上会显示不正常）`);

  checkTags(html, file);

  // 引用的资源
  const refs = [];
  (html.match(/(?:src|href)="([^"]+)"/g) || []).forEach((m) => {
    const v = m.replace(/^(?:src|href)="/, '').replace(/"$/, '');
    refs.push(v);
  });

  refs.forEach((ref) => {
    if (/^(https?:|mailto:|tel:|data:|#|javascript:)/.test(ref)) return;
    if (!exists(ref)) {
      // 图片允许暂时缺失（页面上会显示占位提示），只提示不报错
      if (/\.(jpg|jpeg|png|webp|gif)$/i.test(ref)) {
        warnings.push(`${file}: 图片还没有放进去 -> ${ref}`);
      } else {
        errors.push(`${file}: 链接 / 资源不存在 -> ${ref}`);
      }
    }
  });

  const imgs = html.match(/<img[^>]*>/g) || [];
  imgs.forEach((img) => {
    if (!/alt="/.test(img)) warnings.push(`${file}: 有一张图片没有 alt 属性`);
  });
});

// 是否还有待补充的内容
let todoCount = 0;
files.forEach((file) => {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const m = html.match(/待补充/g);
  if (m) todoCount += m.length;
});

// ---------------- 输出 ----------------
console.log('检查目录：' + root);
console.log('HTML 页面：' + files.length + ' 个\n');

if (warnings.length) {
  console.log('提示（' + warnings.length + '）：');
  warnings.forEach((w) => console.log('  · ' + w));
  console.log('');
}

if (errors.length) {
  console.log('错误（' + errors.length + '）：');
  errors.forEach((e) => console.log('  ✗ ' + e));
  console.log('');
}

if (todoCount) {
  console.log('还有 ' + todoCount + ' 处「待补充」，清单见 docs/content-checklist.md\n');
}

console.log(errors.length ? '❌ 检查未通过' : '✅ 检查通过');

// ---------------- 可选：启动本地服务器 ----------------
if (process.argv.includes('--serve') && !errors.length) {
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.txt': 'text/plain; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8'
  };
  const server = http.createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split('?')[0]);
    if (urlPath === '/') urlPath = '/index.html';
    const filePath = path.join(root, urlPath);
    if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(fs.readFileSync(path.join(root, '404.html')));
      return;
    }
    res.writeHead(200, { 'Content-Type': types[path.extname(filePath)] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
  server.listen(8080, () => {
    console.log('\n本地服务器已启动： http://localhost:8080   （Ctrl + C 停止）');
  });
} else {
  process.exitCode = errors.length ? 1 : 0;
}
