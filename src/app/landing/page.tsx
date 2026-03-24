import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Editorial Engine | AI-Powered WordPress Block Themes',
  description: 'Generate production-ready block themes from simple natural language. Complete with theme.json, full site editing templates, and curated style variations.',
};

export default function LandingPage() {
  return (
    <div
      className="landing-page"
      dangerouslySetInnerHTML={{
        __html: LANDING_HTML,
      }}
    />
  );
}

const LANDING_HTML = `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;0,6..72,700;1,6..72,400&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  .landing-page { font-family: 'Inter', sans-serif; color: #2d3336; background: #f9f9fa; }
  .landing-page .newsreader { font-family: 'Newsreader', serif; }
  .landing-page .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }

  .landing-page nav { background: #f9f9fa; position: fixed; top: 0; z-index: 50; width: 100%; }
  .landing-page nav .nav-inner { display: flex; justify-content: space-between; align-items: center; padding: 0 2rem; height: 4rem; max-width: 1536px; margin: 0 auto; }
  .landing-page nav .brand { font-size: 1.5rem; font-weight: 700; font-family: 'Newsreader', serif; color: #176491; letter-spacing: -0.025em; }
  .landing-page nav .nav-links { display: flex; align-items: center; gap: 2rem; }
  .landing-page nav .nav-links a { font-family: 'Newsreader', serif; font-size: 0.875rem; color: #596065; transition: color 0.3s; text-decoration: none; }
  .landing-page nav .nav-links a:hover, .landing-page nav .nav-links a.active { color: #176491; }
  .landing-page nav .nav-links a.active { border-bottom: 2px solid #176491; padding-bottom: 0.25rem; font-weight: 700; }
  .landing-page nav .nav-actions { display: flex; align-items: center; gap: 1.5rem; }
  .landing-page nav .nav-actions .signin { color: #596065; font-weight: 500; background: none; border: none; cursor: pointer; }
  .landing-page nav .nav-actions .signin:hover { color: #176491; }
  .landing-page nav .nav-actions .cta { background: linear-gradient(135deg, #176491, #005783); color: white; padding: 0.5rem 1.25rem; border-radius: 0.25rem; border: none; cursor: pointer; font-weight: 500; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
  .landing-page nav .nav-actions .cta:hover { opacity: 0.9; }

  .landing-page .hero { padding: 8rem 2rem 6rem; max-width: 1280px; margin: 0 auto; display: flex; align-items: center; gap: 4rem; }
  .landing-page .hero-content { flex: 3; }
  .landing-page .hero-visual { flex: 2; position: relative; }
  .landing-page .hero .badge { display: inline-block; padding: 0.25rem 0.75rem; background: #e4e9ec; color: #176491; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em; border-radius: 9999px; margin-bottom: 1.5rem; font-weight: 600; }
  .landing-page .hero h1 { font-family: 'Newsreader', serif; font-size: clamp(3rem, 6vw, 5rem); line-height: 0.9; letter-spacing: -0.04em; margin-bottom: 2rem; }
  .landing-page .hero h1 .accent { font-style: italic; color: #176491; }
  .landing-page .hero .subtitle { font-size: 1.25rem; color: #5a6063; max-width: 40rem; line-height: 1.7; margin-bottom: 2.5rem; }
  .landing-page .hero .buttons { display: flex; gap: 1rem; flex-wrap: wrap; }
  .landing-page .hero .btn-primary { background: #176491; color: #f4f8ff; padding: 1rem 2rem; border-radius: 0.25rem; border: none; font-size: 1.125rem; font-weight: 500; cursor: pointer; transition: transform 0.2s; text-decoration: none; display: inline-block; }
  .landing-page .hero .btn-primary:hover { transform: scale(0.95); }
  .landing-page .hero .btn-secondary { background: white; border: 1px solid rgba(173,179,182,0.15); color: #2d3336; padding: 1rem 2rem; border-radius: 0.25rem; font-family: 'Newsreader', serif; font-style: italic; font-size: 1.125rem; cursor: pointer; text-decoration: none; display: inline-block; }

  .landing-page .hero-img-wrap { aspect-ratio: 4/5; background: #e4e9ec; border-radius: 0.5rem; overflow: hidden; position: relative; box-shadow: 0 25px 50px rgba(0,0,0,0.15); border: 1px solid rgba(173,179,182,0.1); }
  .landing-page .hero-img-wrap img { width: 100%; height: 100%; object-fit: cover; opacity: 0.9; }
  .landing-page .hero-img-wrap .overlay { position: absolute; inset: 0; background: linear-gradient(to top, #f9f9fa, transparent); }
  .landing-page .hero-img-wrap .ai-badge { position: absolute; bottom: 1.5rem; left: 1.5rem; right: 1.5rem; padding: 1.5rem; background: rgba(255,255,255,0.85); backdrop-filter: blur(12px); border-radius: 0.25rem; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
  .landing-page .hero-img-wrap .ai-badge .label { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
  .landing-page .hero-img-wrap .ai-badge .label span:first-child { color: #176491; }
  .landing-page .hero-img-wrap .ai-badge .label span:last-child { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em; color: #596065; }
  .landing-page .hero-img-wrap .ai-badge p { font-family: 'Newsreader', serif; font-style: italic; font-size: 1.125rem; }

  .landing-page .section { padding: 6rem 2rem; max-width: 1280px; margin: 0 auto; }
  .landing-page .section-alt { background: #f2f4f5; }
  .landing-page .section-title { font-family: 'Newsreader', serif; font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 1rem; }
  .landing-page .section-subtitle { color: #5a6063; font-size: 1.125rem; max-width: 40rem; }
  .landing-page .section-divider { height: 4px; width: 6rem; background: #176491; margin: 0 auto; margin-top: 1rem; }

  .landing-page .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4rem; margin-top: 4rem; }
  .landing-page .step { text-align: center; }
  .landing-page .step .icon-wrap { width: 5rem; height: 5rem; border-radius: 50%; background: #f2f4f5; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem; position: relative; }
  .landing-page .step .icon-wrap .num { position: absolute; top: -0.5rem; right: -0.5rem; width: 2rem; height: 2rem; border-radius: 50%; background: #176491; color: white; font-size: 0.75rem; display: flex; align-items: center; justify-content: center; font-weight: 700; }
  .landing-page .step h3 { font-family: 'Newsreader', serif; font-style: italic; font-size: 1.5rem; margin-bottom: 1rem; }
  .landing-page .step p { color: #5a6063; line-height: 1.7; padding: 0 1rem; }

  .landing-page .bento { display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(2, 1fr); gap: 1.5rem; min-height: 600px; }
  .landing-page .bento .card { background: white; padding: 2rem; border-radius: 0.25rem; border: 1px solid rgba(173,179,182,0.1); display: flex; flex-direction: column; justify-content: space-between; transition: background 0.2s; }
  .landing-page .bento .card:hover { background: #f9f9fa; }
  .landing-page .bento .card h4 { font-family: 'Newsreader', serif; font-size: 1.25rem; margin-top: 0.5rem; }
  .landing-page .bento .card p { color: #5a6063; font-size: 0.875rem; margin-top: 0.5rem; }
  .landing-page .bento .card-wide { grid-column: span 2; }
  .landing-page .bento .card-tall { grid-row: span 2; background: #176491; color: #f4f8ff; border: none; box-shadow: 0 10px 30px rgba(23,100,145,0.2); }
  .landing-page .bento .card-tall:hover { background: #176491; }
  .landing-page .bento .card-tall p { color: rgba(244,248,255,0.8); }
  .landing-page .bento .card-tall .stat { margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1); }
  .landing-page .bento .card-tall .stat .num { font-family: 'Newsreader', serif; font-style: italic; font-size: 1.875rem; }
  .landing-page .bento .card-tall .stat .label { font-size: 0.625rem; text-transform: uppercase; letter-spacing: 0.15em; opacity: 0.6; }

  .landing-page .audience { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 3rem; }
  .landing-page .audience .card { background: white; padding: 2.5rem; border-radius: 0.5rem; border: 1px solid rgba(173,179,182,0.05); box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
  .landing-page .audience .card .tag { color: #176491; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 600; margin-bottom: 1rem; }
  .landing-page .audience .card h4 { font-family: 'Newsreader', serif; font-size: 1.5rem; margin-bottom: 1rem; }
  .landing-page .audience .card p { color: #5a6063; font-size: 0.875rem; line-height: 1.7; }

  .landing-page .cta-section { padding: 8rem 2rem; text-align: center; background: white; position: relative; overflow: hidden; }
  .landing-page .cta-section h2 { font-family: 'Newsreader', serif; font-size: clamp(2.5rem, 5vw, 4rem); line-height: 1.1; margin-bottom: 2rem; max-width: 48rem; margin-left: auto; margin-right: auto; }
  .landing-page .cta-section .accent { font-style: italic; color: #176491; }
  .landing-page .cta-section .buttons { display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap; }
  .landing-page .cta-section .note { margin-top: 2rem; color: #5a6063; font-size: 0.875rem; font-style: italic; }

  .landing-page footer { background: #f9f9fa; border-top: 1px solid #f2f4f5; padding: 3rem 2rem; }
  .landing-page footer .footer-inner { max-width: 1280px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 2rem; }
  .landing-page footer .footer-brand { font-family: 'Newsreader', serif; font-style: italic; color: #adb3b6; font-size: 1.125rem; }
  .landing-page footer .footer-links { display: flex; flex-wrap: wrap; gap: 2rem; }
  .landing-page footer .footer-links a { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em; color: #adb3b6; text-decoration: underline; }
  .landing-page footer .footer-links a:hover { color: #176491; }
  .landing-page footer .copyright { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em; color: #adb3b6; }

  @media (max-width: 768px) {
    .landing-page .hero { flex-direction: column; padding: 6rem 1.5rem 3rem; }
    .landing-page .hero-content, .landing-page .hero-visual { flex: none; width: 100%; }
    .landing-page .steps { grid-template-columns: 1fr; gap: 2rem; }
    .landing-page .bento { grid-template-columns: 1fr; grid-template-rows: auto; }
    .landing-page .bento .card-wide, .landing-page .bento .card-tall { grid-column: span 1; grid-row: span 1; }
    .landing-page .audience { grid-template-columns: 1fr; }
    .landing-page nav .nav-links { display: none; }
    .landing-page footer .footer-inner { flex-direction: column; text-align: center; }
  }
</style>

<!-- Navigation -->
<nav>
  <div class="nav-inner">
    <div class="brand newsreader">The Editorial Engine</div>
    <div class="nav-links">
      <a href="#" class="active">Showcase</a>
      <a href="#">Tutorials</a>
      <a href="#">Pricing</a>
      <a href="#">Documentation</a>
    </div>
    <div class="nav-actions">
      <button class="signin">Sign In</button>
      <a href="/create" class="cta">Create Theme</a>
    </div>
  </div>
</nav>

<!-- Hero -->
<div style="padding-top:4rem">
  <div class="hero">
    <div class="hero-content">
      <span class="badge">WordPress Native AI</span>
      <h1>The Future of WordPress is <span class="accent">Yours to Command</span></h1>
      <p class="subtitle">Generate production-ready block themes from simple natural language. Complete with theme.json, full site editing templates, and curated style variations.</p>
      <div class="buttons">
        <a href="/create" class="btn-primary">Generate your theme</a>
        <a href="#workflow" class="btn-secondary newsreader">View demo</a>
      </div>
    </div>
    <div class="hero-visual">
      <div class="hero-img-wrap">
        <div style="width:100%;height:100%;background:linear-gradient(135deg,#e4e9ec,#dde3e7);display:flex;align-items:center;justify-content:center;">
          <div style="text-align:center;opacity:0.4;">
            <div style="font-family:Newsreader,serif;font-size:4rem;font-style:italic;">W</div>
            <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.2em;margin-top:0.5rem;">Block Theme</div>
          </div>
        </div>
        <div class="overlay"></div>
        <div class="ai-badge">
          <div class="label">
            <span class="material-symbols-outlined">auto_awesome</span>
            <span>Editor AI</span>
          </div>
          <p>"Crafting a bespoke architectural portfolio..."</p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Workflow Steps -->
<div id="workflow" style="background:#f2f4f5;padding:6rem 0;">
  <div class="section" style="text-align:center;">
    <h2 class="section-title newsreader">A Refined Workflow</h2>
    <div class="section-divider"></div>
    <div class="steps">
      <div class="step">
        <div class="icon-wrap">
          <span class="material-symbols-outlined" style="color:#176491;font-size:1.5rem;">edit_note</span>
          <span class="num">01</span>
        </div>
        <h3 class="newsreader">Describe</h3>
        <p>Simply explain the vibe, purpose, and audience of your site in natural language.</p>
      </div>
      <div class="step">
        <div class="icon-wrap">
          <span class="material-symbols-outlined" style="color:#176491;font-size:1.5rem;">bolt</span>
          <span class="num">02</span>
        </div>
        <h3 class="newsreader">Generate</h3>
        <p>Our AI curates typography, colors, and layout structures based on best-in-class editorial design.</p>
      </div>
      <div class="step">
        <div class="icon-wrap">
          <span class="material-symbols-outlined" style="color:#176491;font-size:1.5rem;">download</span>
          <span class="num">03</span>
        </div>
        <h3 class="newsreader">Export</h3>
        <p>Download a standard .zip file. Install on any WordPress site. It's that simple.</p>
      </div>
    </div>
  </div>
</div>

<!-- Feature Bento -->
<div style="background:#f2f4f5;padding:0 0 6rem;">
  <div class="section" style="padding-top:0;">
    <div class="bento">
      <div class="card card-wide">
        <div>
          <span class="material-symbols-outlined" style="color:#176491;">settings_ethernet</span>
          <h4>theme.json control</h4>
          <p>Every generation includes a perfectly formatted theme.json for global style management.</p>
        </div>
      </div>
      <div class="card card-tall">
        <div>
          <span class="material-symbols-outlined" style="color:rgba(255,255,255,0.5);">speed</span>
          <h4 style="font-family:Newsreader,serif;font-size:1.5rem;margin-top:1rem;">Lightning-fast Performance</h4>
          <p>Zero bloat. No jQuery. Pure block-based architecture scoring 100/100 on Core Web Vitals.</p>
        </div>
        <div class="stat">
          <div class="num newsreader" style="font-style:italic;">Sub-100ms</div>
          <div class="label">LCP Average</div>
        </div>
      </div>
      <div class="card">
        <div>
          <span class="material-symbols-outlined" style="color:#176491;">accessible</span>
          <h4>100% Accessible</h4>
          <p>WCAG 2.1 compliant by default.</p>
        </div>
      </div>
      <div class="card">
        <div>
          <span class="material-symbols-outlined" style="color:#176491;">layers</span>
          <h4>Block Patterns</h4>
          <p>Pre-built sections for fast editing.</p>
        </div>
      </div>
      <div class="card card-wide">
        <div>
          <span class="material-symbols-outlined" style="color:#176491;">palette</span>
          <h4>Style Variations</h4>
          <p>Alternate color and typography pairings generated specifically for your brand identity.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Audience -->
<div class="section-alt" style="padding:6rem 0;">
  <div class="section" style="text-align:center;">
    <h2 class="section-title newsreader" style="font-style:italic;">Built for the Curators of the Web</h2>
    <p class="section-subtitle" style="margin:0 auto;">Scalable solutions for teams that demand excellence without the overhead.</p>
    <div class="audience">
      <div class="card">
        <div class="tag">Agencies</div>
        <h4>Scale Production</h4>
        <p>Cut custom theme development time by 80%. Deliver high-fidelity, editable WordPress sites in days, not weeks.</p>
      </div>
      <div class="card">
        <div class="tag">Publishers</div>
        <h4>Design Control</h4>
        <p>Empower your editorial team to create custom layouts without breaking the brand guidelines or needing a developer.</p>
      </div>
      <div class="card">
        <div class="tag">Creators</div>
        <h4>Bespoke Portfolios</h4>
        <p>Finally, a theme that matches your creative vision without the generic "pre-made" template look.</p>
      </div>
    </div>
  </div>
</div>

<!-- CTA -->
<div class="cta-section">
  <h2>Ready to define your <span class="accent">digital presence?</span></h2>
  <div class="buttons">
    <a href="/create" class="btn-primary" style="padding:1.25rem 2.5rem;font-size:1.25rem;box-shadow:0 10px 30px rgba(23,100,145,0.2);">Get Started for Free</a>
    <a href="#" class="btn-secondary newsreader" style="padding:1.25rem 2.5rem;font-size:1.25rem;">Book a Demo</a>
  </div>
  <p class="note">No credit card required. WordPress.org compatible.</p>
</div>

<!-- Footer -->
<footer>
  <div class="footer-inner">
    <div class="footer-brand newsreader">The Editorial Engine</div>
    <div class="footer-links">
      <a href="#">Privacy Policy</a>
      <a href="#">Terms of Service</a>
      <a href="#">WordPress.org</a>
      <a href="#">Open Source</a>
    </div>
    <div class="copyright">&copy; 2025 The Editorial Engine. Built for the Open Web.</div>
  </div>
</footer>
`;
