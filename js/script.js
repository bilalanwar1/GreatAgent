/* ==================================================
   GreatAgen — Vanilla JavaScript
   ================================================== */

(() => {
  "use strict";

  /* ---------- Sticky Navbar ---------- */
  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add("is-scrolled");
    } else {
      navbar.classList.remove("is-scrolled");
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile Nav Toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navMenu.classList.toggle("is-open");
      navToggle.classList.toggle("is-active", open);
      navToggle.setAttribute("aria-expanded", String(open));
    });

    navMenu.querySelectorAll(".has-dropdown > a").forEach((link) => {
      link.addEventListener("click", (e) => {
        if (window.innerWidth <= 900) {
          e.preventDefault();
          link.parentElement.classList.toggle("is-open");
        }
      });
    });

    navMenu.querySelectorAll(".dropdown a, .nav__item:not(.has-dropdown) > a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("is-open");
        navToggle.classList.remove("is-active");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Smooth Scroll for anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight + 8 : 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ---------- Fade-up on scroll ---------- */
  const fadeEls = document.querySelectorAll(".fade-up");
  const reveal = (el) => el.classList.add("is-visible");

  if ("IntersectionObserver" in window) {
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
    );
    fadeEls.forEach((el) => fadeObserver.observe(el));
    // Reveal anything already in the viewport on load
    requestAnimationFrame(() => {
      fadeEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
          reveal(el);
        }
      });
    });
  } else {
    fadeEls.forEach(reveal);
  }

  /* ---------- Animated Counters ---------- */
  const animateCount = (el, duration = 1600) => {
    const target = parseInt(el.getAttribute("data-count"), 10);
    if (Number.isNaN(target)) return;
    const start = performance.now();
    const format = (n) => n.toLocaleString("en-US");

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = format(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll("[data-count]").forEach((el) => animateCount(el));
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll(".metric-grid, .analytics-stats").forEach((el) => {
    counterObserver.observe(el);
  });

  /* ---------- Agent Progress Bars ---------- */
  const barsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".agent-bars__fill").forEach((bar) => {
            bar.classList.add("is-animated");
          });
          barsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  const agentsPanel = document.querySelector(".agents-panel");
  if (agentsPanel) barsObserver.observe(agentsPanel);

  /* ---------- Canvas Helpers ---------- */
  const getCtx = (id) => {
    const canvas = document.getElementById(id);
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || canvas.width;
    const h = rect.height || canvas.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    return { ctx, w, h, canvas };
  };

  /* ---------- Hero Line Chart ---------- */
  const drawHeroChart = () => {
    const data = getCtx("heroChart");
    if (!data) return;
    const { ctx, w, h } = data;
    // Approximate daily volume across May (peaks near May 19)
    const points = [2100, 2800, 2400, 3600, 3200, 4100, 3800, 4500, 4200, 5186, 4800, 5100, 4700, 5400, 4900];
    const xLabels = ["May 01", "May 08", "May 15", "May 22", "May 29"];
    const yLabels = ["10K", "7.5K", "5K", "2.5K", "0"];
    const pad = { t: 14, r: 12, b: 28, l: 36 };
    const chartW = w - pad.l - pad.r;
    const chartH = h - pad.t - pad.b;
    const max = 10000;
    const stepX = chartW / (points.length - 1);
    const tipIndex = 9; // May 19 peak

    const coords = points.map((v, i) => ({
      x: pad.l + i * stepX,
      y: pad.t + chartH - (v / max) * chartH,
      v,
    }));

    let progress = 0;
    const animate = () => {
      progress = Math.min(progress + 0.025, 1);
      ctx.clearRect(0, 0, w, h);

      // Y-axis labels + grid
      ctx.fillStyle = "rgba(148,163,184,0.7)";
      ctx.font = "9px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      yLabels.forEach((label, i) => {
        const y = pad.t + (chartH / 4) * i;
        ctx.fillText(label, pad.l - 6, y);
        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pad.l, y);
        ctx.lineTo(w - pad.r, y);
        ctx.stroke();
      });

      // X-axis labels
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      xLabels.forEach((label, i) => {
        const x = pad.l + (chartW / (xLabels.length - 1)) * i;
        ctx.fillText(label, x, pad.t + chartH + 8);
      });

      const visible = Math.floor((coords.length - 1) * progress) + 1;
      const partial = ((coords.length - 1) * progress) % 1;

      // area fill
      const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + chartH);
      grad.addColorStop(0, "rgba(59,130,246,0.4)");
      grad.addColorStop(0.55, "rgba(139,92,246,0.18)");
      grad.addColorStop(1, "rgba(59,130,246,0)");

      ctx.beginPath();
      coords.slice(0, visible).forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      if (visible < coords.length && partial > 0) {
        const a = coords[visible - 1];
        const b = coords[visible];
        ctx.lineTo(a.x + (b.x - a.x) * partial, a.y + (b.y - a.y) * partial);
      }
      const lastX =
        visible < coords.length && partial > 0
          ? coords[visible - 1].x + (coords[visible].x - coords[visible - 1].x) * partial
          : coords[visible - 1].x;
      ctx.lineTo(lastX, pad.t + chartH);
      ctx.lineTo(coords[0].x, pad.t + chartH);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // line
      ctx.beginPath();
      ctx.strokeStyle = "#60A5FA";
      ctx.lineWidth = 2.5;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      coords.slice(0, visible).forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      if (visible < coords.length && partial > 0) {
        const a = coords[visible - 1];
        const b = coords[visible];
        ctx.lineTo(a.x + (b.x - a.x) * partial, a.y + (b.y - a.y) * partial);
      }
      ctx.stroke();

      // tooltip on peak once fully drawn
      if (progress >= 1) {
        const tip = coords[tipIndex];
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = "#8B5CF6";
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        const label = "May 19, 5,186";
        ctx.font = "600 10px Inter, sans-serif";
        const tw = ctx.measureText(label).width;
        const bx = tip.x - tw / 2 - 8;
        const by = tip.y - 28;
        const bw = tw + 16;
        const bh = 20;
        ctx.fillStyle = "rgba(15,23,42,0.95)";
        ctx.strokeStyle = "rgba(255,255,255,0.12)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(bx, by, bw, bh, 6);
        } else {
          ctx.rect(bx, by, bw, bh);
        }
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, tip.x, by + bh / 2);
      }

      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  };

  /* ---------- Donut Chart ---------- */
  const drawDonut = () => {
    const data = getCtx("donutChart");
    if (!data) return;
    const { ctx, w, h } = data;
    const segments = [
      { value: 40, color: "#FBBF24" },
      { value: 25, color: "#3B82F6" },
      { value: 15, color: "#8B5CF6" },
      { value: 10, color: "#EC4899" },
      { value: 10, color: "#94A3B8" },
    ];
    const total = segments.reduce((s, seg) => s + seg.value, 0);
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) / 2 - 4;
    const inner = radius * 0.62;
    let start = -Math.PI / 2;
    let progress = 0;

    const animate = () => {
      progress = Math.min(progress + 0.03, 1);
      ctx.clearRect(0, 0, w, h);
      let angle = start;
      segments.forEach((seg) => {
        const sweep = (seg.value / total) * Math.PI * 2 * progress;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, angle, angle + sweep);
        ctx.arc(cx, cy, inner, angle + sweep, angle, true);
        ctx.closePath();
        ctx.fillStyle = seg.color;
        ctx.fill();
        angle += (seg.value / total) * Math.PI * 2 * progress;
      });

      // center
      ctx.beginPath();
      ctx.arc(cx, cy, inner - 1, 0, Math.PI * 2);
      ctx.fillStyle = "#1A2236";
      ctx.fill();

      if (progress >= 1) {
        ctx.fillStyle = "#fff";
        ctx.font = "bold 11px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("32,842", cx, cy - 6);
        ctx.fillStyle = "rgba(148,163,184,0.9)";
        ctx.font = "9px Inter, sans-serif";
        ctx.fillText("Total", cx, cy + 8);
      }

      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  };

  /* ---------- Analytics Dual Area Chart ---------- */
  let analyticsChartReady = false;

  const drawAnalyticsChart = (options = {}) => {
    const animateDraw = options.animate !== false;
    const data = getCtx("analyticsChart");
    if (!data) return;
    const { ctx, w, h } = data;
    const compact = w < 420;
    const conv = [6200, 7800, 5400, 9100, 7200, 9800, 8600];
    const resolved = [4100, 5200, 3800, 6400, 5100, 7200, 6800];
    const pad = {
      t: 12,
      r: compact ? 8 : 12,
      b: compact ? 28 : 32,
      l: compact ? 36 : 44,
    };
    const chartW = w - pad.l - pad.r;
    const chartH = h - pad.t - pad.b;
    if (chartW <= 0 || chartH <= 0) return;

    const max = 10000;
    const yLabels = ["10K", "7.5K", "5K", "2.5K", "0"];
    const xLabels = compact
      ? ["5/01", "5/08", "5/15", "5/22", "5/29"]
      : ["May 01", "May 08", "May 15", "May 22", "May 29"];
    const stepX = chartW / (conv.length - 1);
    const fontSize = compact ? 10 : 11;

    const toCoords = (arr) =>
      arr.map((v, i) => ({
        x: pad.l + i * stepX,
        y: pad.t + chartH - (v / max) * chartH,
      }));

    const c1 = toCoords(conv);
    const c2 = toCoords(resolved);
    let progress = animateDraw ? 0 : 1;

    const drawArea = (coords, stroke, fillTop, fillBottom, p) => {
      const count = Math.max(2, Math.floor((coords.length - 1) * p) + 1);
      const pts = coords.slice(0, count);
      if (pts.length < 2) return;

      const last = pts[pts.length - 1];
      const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + chartH);
      grad.addColorStop(0, fillTop);
      grad.addColorStop(1, fillBottom);

      ctx.beginPath();
      pts.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.lineTo(last.x, pad.t + chartH);
      ctx.lineTo(pts[0].x, pad.t + chartH);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = compact ? 2 : 2.5;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      pts.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
    };

    const render = () => {
      if (animateDraw) progress = Math.min(progress + 0.025, 1);
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(148,163,184,0.12)";
      ctx.fillStyle = "#94A3B8";
      ctx.font = `${fontSize}px Inter, system-ui, sans-serif`;
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";

      for (let i = 0; i <= 4; i++) {
        const y = pad.t + (chartH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(pad.l, y);
        ctx.lineTo(w - pad.r, y);
        ctx.stroke();
        ctx.fillText(yLabels[i], pad.l - 8, y);
      }

      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      xLabels.forEach((label, i) => {
        const x = pad.l + (chartW / (xLabels.length - 1)) * i;
        ctx.fillText(label, x, h - (compact ? 18 : 22));
      });

      drawArea(c1, "#3B82F6", "rgba(59,130,246,0.35)", "rgba(59,130,246,0.02)", progress);
      drawArea(c2, "#22C55E", "rgba(34,197,94,0.30)", "rgba(34,197,94,0.02)", progress);

      if (animateDraw && progress < 1) requestAnimationFrame(render);
    };

    render();
    analyticsChartReady = true;
  };

  /* ---------- Chart Intersection Triggers ---------- */
  const chartTriggers = [
    { id: "heroChart", fn: drawHeroChart },
    { id: "donutChart", fn: drawDonut },
    { id: "analyticsChart", fn: drawAnalyticsChart },
  ];

  chartTriggers.forEach(({ id, fn }) => {
    const el = document.getElementById(id);
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fn();
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
  });

  let analyticsResizeTimer;
  window.addEventListener("resize", () => {
    if (!analyticsChartReady) return;
    clearTimeout(analyticsResizeTimer);
    analyticsResizeTimer = setTimeout(() => {
      drawAnalyticsChart({ animate: false });
    }, 150);
  });

  /* ---------- Voice Preview Button ---------- */
  document.querySelectorAll(".voice-play").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.innerHTML = '<i class="fa-solid fa-pause"></i>';
      setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-play"></i>';
      }, 1500);
    });
  });

  /* ---------- Dashboard sidebar active state ---------- */
  document.querySelectorAll(".dashboard__link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll(".dashboard__link").forEach((l) => l.classList.remove("is-active"));
      link.classList.add("is-active");
    });
  });

  /* ---------- Inbox item selection ---------- */
  document.querySelectorAll(".inbox-card__item").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".inbox-card__item").forEach((i) => i.classList.remove("is-active"));
      item.classList.add("is-active");
    });
  });
})();
