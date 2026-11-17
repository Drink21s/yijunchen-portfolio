/* ===== 易俊臣 · 个人网站 共用脚本 ===== */
(function () {
  'use strict';

  /* ---------- 顶部导航 ----------
     先在 HTML 里写一份“不会闪”的基础导航，这里再统一替换成完整版。
     这样做的好处：以后加页面只改这一处，不用去 10 个 HTML 文件里逐个改。 */
  function currentPage() {
    var name = window.location.pathname.split('/').pop();
    return (!name || name === 'index.html') ? 'index.html' : name;
  }

  function renderNav() {
    var nav = document.querySelector('.site-nav');
    if (!nav) return;
    var page = currentPage();
    var inMore = ['about.html', 'design.html', 'fitness.html', 'cycling.html', 'cats.html'].indexOf(page) > -1;

    var moreLinks = [
      ['about.html', '关于我'],
      ['design.html', '设计作品'],
      ['fitness.html', '健身日常'],
      ['cycling.html', '骑行记录'],
      ['cats.html', '我家的猫']
    ].map(function (item) {
      return '<a href="' + item[0] + '"' + (page === item[0] ? ' class="active"' : '') + '>' + item[1] + '</a>';
    }).join('');

    nav.innerHTML =
      '<a href="index.html"' + (page === 'index.html' ? ' class="active"' : '') + '>首页</a>' +
      '<a href="projects.html"' + (page === 'projects.html' ? ' class="active"' : '') + '>项目</a>' +
      '<a href="courses.html"' + (page === 'courses.html' ? ' class="active"' : '') + '>课程</a>' +
      '<a href="certificates.html"' + (page === 'certificates.html' ? ' class="active"' : '') + '>证书</a>' +
      '<details class="nav-more">' +
        '<summary' + (inMore ? ' class="active"' : '') + '>生活</summary>' +
        '<div class="nav-menu"><small>关于生活</small>' + moreLinks + '</div>' +
      '</details>' +
      '<a href="contact.html"' + (page === 'contact.html' ? ' class="active"' : '') + '>联系</a>';

    // 点菜单外面 / 按 Esc 就收起
    var more = nav.querySelector('.nav-more');
    if (more) {
      document.addEventListener('click', function (e) {
        if (more.open && !more.contains(e.target)) more.open = false;
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') more.open = false;
      });
    }
  }

  // 页面淡入
  function show() { document.body.classList.add('ready'); }
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    requestAnimationFrame(show);
  } else {
    document.addEventListener('DOMContentLoaded', show);
  }
  // 从浏览器返回时恢复显示
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { document.body.classList.remove('leaving'); show(); }
  });

  renderNav();

  // 站内跳转时先淡出，再进入下一个页面
  document.querySelectorAll('a[href]').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href || href.charAt(0) === '#' || href.indexOf('http') === 0 ||
        href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return;
    if (link.target === '_blank') return;
    link.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      document.body.classList.add('leaving');
      window.setTimeout(function () { window.location.href = href; }, 250);
    });
  });

  // 滚动入场
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && items.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.14 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // 技能条：滚到眼前时再增长
  var bars = document.querySelectorAll('.skill');
  if ('IntersectionObserver' in window && bars.length) {
    var bo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); bo.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    bars.forEach(function (el) { bo.observe(el); });
  } else {
    bars.forEach(function (el) { el.classList.add('in'); });
  }

  // 首屏跟随鼠标的光晕
  var hero = document.querySelector('.hero');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasHover = window.matchMedia('(hover: hover)').matches;
  if (hero && !reduce && hasHover) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      hero.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  }

  // 唱片 / 均衡器（关于我页面的歌单）
  var disc = document.getElementById('disc');
  var playBtn = document.getElementById('playBtn');
  var nowCard = document.getElementById('nowCard');
  if (disc && nowCard) {
    var playing = false;
    var setPlaying = function (next) {
      playing = next;
      disc.classList.toggle('playing', playing);
      nowCard.classList.toggle('playing', playing);
      if (playBtn) {
        playBtn.setAttribute('aria-pressed', String(playing));
        playBtn.textContent = playing ? '⏸ 暂停' : '▶ 播放';
      }
    };
    if (playBtn) playBtn.addEventListener('click', function () { setPlaying(!playing); });
    var title = document.getElementById('nowTitle');
    var artist = document.getElementById('nowArtist');
    document.querySelectorAll('.song').forEach(function (row) {
      row.addEventListener('click', function () {
        if (title) title.textContent = row.dataset.title;
        if (artist) artist.textContent = row.dataset.artist;
        setPlaying(true);
      });
    });
  }

  // 照片还没放进去时，显示提示而不是破图
  document.querySelectorAll('img[data-photo]').forEach(function (img) {
    var mark = function () {
      var box = img.closest('.photo');
      if (box) box.classList.add('missing');
    };
    if (img.complete && img.naturalWidth === 0) mark();
    img.addEventListener('error', mark);
  });

  // 年份
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- 课程页：按学期筛选 + 点表头排序 ---------- */
  var courseTable = document.getElementById('courseTable');
  if (courseTable) {
    var tbody = courseTable.tBodies[0];
    var rows = Array.prototype.slice.call(tbody.rows);
    var filterBar = document.querySelector('.filter-bar');

    function applyFilter(key) {
      rows.forEach(function (tr) {
        var on = (key === 'all') || (tr.dataset.term === key);
        tr.classList.toggle('is-hidden', !on);
      });
    }

    if (filterBar) {
      filterBar.addEventListener('click', function (e) {
        var btn = e.target.closest('button[data-filter]');
        if (!btn) return;
        filterBar.querySelectorAll('button').forEach(function (b) {
          b.setAttribute('aria-pressed', String(b === btn));
        });
        applyFilter(btn.dataset.filter);
      });
    }

    // 排序：课程数量不多，直接重新排一次就够，也看得懂
    var heads = courseTable.querySelectorAll('th.sortable');
    heads.forEach(function (th) {
      th.addEventListener('click', function () {
        var col = Number(th.dataset.col);
        var asc = th.dataset.order !== 'asc';
        heads.forEach(function (h) { h.classList.remove('asc', 'desc'); });
        th.classList.add(asc ? 'asc' : 'desc');

        var visible = rows.filter(function (tr) { return !tr.classList.contains('is-hidden'); });
        visible.sort(function (a, b) {
          var x = a.cells[col].textContent.trim();
          var y = b.cells[col].textContent.trim();
          var nx = parseFloat(x), ny = parseFloat(y);
          var res;
          if (!isNaN(nx) && !isNaN(ny)) { res = nx - ny; }
          else { res = x.localeCompare(y, 'zh-Hans-CN'); }
          return asc ? res : -res;
        });
        visible.forEach(function (tr) { tbody.appendChild(tr); });
      });
    });
  }

  /* ---------- 「打印 / 存为 PDF」按钮 ---------- */
  document.querySelectorAll('[data-print]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      window.print();
    });
  });
})();
