// Gera en/index.html a partir de index.html com o <head> e o conteúdo já em
// inglês, para que compartilhamentos e buscadores (que não rodam JS) vejam a
// versão certa em /en. O script do site continua cuidando da troca sem
// recarregar: o PT de cada nó fica guardado em data-pt / data-pt-<atributo>.
//
// Uso (dev): node scripts/build-en.mjs   — precisa do Playwright (Chromium).
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(resolve(root, 'index.html'), 'utf8');

const META_EN = {
  title: 'Amaral & Silva — Brand strategy & systems engineering',
  description: 'A duo that builds a brand and the technology behind it from the ground up: strategy, research and go-to-market alongside custom systems, dashboards, automation and applied AI.',
  ogDescription: 'Brands that stand out. Systems that sustain them. Brand strategy and systems engineering at the same table.',
  canonical: 'https://amaralesilva.vercel.app/en',
  ogImage: 'https://amaralesilva.vercel.app/og-en.png',
  ogImageAlt: 'Amaral & Silva — Brands that stand out. Systems that sustain them.',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Amaral & Silva',
    url: 'https://amaralesilva.vercel.app/en',
    description: 'Brand strategy and systems engineering: branding, research and go-to-market alongside custom systems, dashboards, automation and applied AI.',
    areaServed: 'BR',
    availableLanguage: ['pt-BR', 'en'],
    address: { '@type': 'PostalAddress', addressLocality: 'São Paulo', addressCountry: 'BR' },
    telephone: '+55-11-96904-1800',
    member: [
      { '@type': 'Person', name: 'Bruno Amaral', jobTitle: 'Marketing Strategist & Branding Consultant' },
      { '@type': 'Person', name: 'Matheus Silva', jobTitle: 'Civil Engineer, MSc in Structures & Full-Stack Developer' },
    ],
  },
};

const browser = await chromium.launch();
const page = await browser.newPage({ javaScriptEnabled: false });
await page.setContent(src, { waitUntil: 'domcontentloaded' });

const html = await page.evaluate((META) => {
  const setMeta = (sel, value) => { const el = document.head.querySelector(sel); if (el) el.setAttribute('content', value); };

  document.documentElement.lang = 'en';
  document.title = META.title;
  setMeta('meta[name="description"]', META.description);
  setMeta('meta[property="og:title"]', META.title);
  setMeta('meta[property="og:description"]', META.ogDescription);
  setMeta('meta[property="og:url"]', META.canonical);
  setMeta('meta[property="og:locale"]', 'en_US');
  setMeta('meta[property="og:locale:alternate"]', 'pt_BR');
  setMeta('meta[property="og:image"]', META.ogImage);
  setMeta('meta[property="og:image:alt"]', META.ogImageAlt);
  setMeta('meta[name="twitter:title"]', META.title);
  setMeta('meta[name="twitter:description"]', META.ogDescription);
  setMeta('meta[name="twitter:image"]', META.ogImage);
  document.head.querySelector('link[rel="canonical"]').setAttribute('href', META.canonical);
  const nav = document.getElementById('site-nav'); if (nav) nav.setAttribute('aria-label', 'Main navigation');
  const lang = document.querySelector('.lang-toggle'); if (lang) lang.setAttribute('aria-label', 'Language / Idioma');
  document.querySelectorAll('.lang-toggle button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === 'en')));

  document.querySelectorAll('[data-en]').forEach((el) => {
    el.setAttribute('data-pt', el.innerHTML);
    el.innerHTML = el.getAttribute('data-en');
  });
  ['href', 'alt', 'aria-label'].forEach((attr) => {
    document.querySelectorAll('[data-en-' + attr + ']').forEach((el) => {
      el.setAttribute('data-pt-' + attr, el.getAttribute(attr));
      el.setAttribute(attr, el.getAttribute('data-en-' + attr));
    });
  });
  const ld = document.querySelector('script[type="application/ld+json"]');
  if (ld) ld.textContent = '\n' + JSON.stringify(META.jsonLd, null, 2) + '\n';

  return '<!DOCTYPE html>\n' + document.documentElement.outerHTML + '\n';
}, META_EN);

await browser.close();
mkdirSync(resolve(root, 'en'), { recursive: true });
writeFileSync(resolve(root, 'en', 'index.html'), '<!-- GERADO por scripts/build-en.mjs a partir de index.html — não edite à mão. -->\n' + html);
console.log('en/index.html gerado:', html.length, 'bytes');
