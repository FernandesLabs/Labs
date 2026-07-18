/**
 * Fernandes Labs — Central Configuration Loader
 *
 * Loads /config.json from the domain root with a 1-hour localStorage cache
 * and sensible fallback defaults so every tool still works if the fetch
 * fails. This file is shared across the entire tool network.
 *
 * Usage in any tool:
 *   <script src="/assets/config-loader.js"></script>
 *   <script>
 *     FernandesConfig.load().then(config => { ... });
 *   </script>
 */
(function (global) {
  "use strict";

  var CACHE_KEY = "fernandes-config-cache";
  var CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

  // Resolve the config URL relative to the document, not the script.
  // This allows the tool network to work whether deployed at the domain root
  // or in a subdirectory. We walk up from the current page to find config.json
  // at the repo root. For a tool at /tools/cat/slug/, that's ../../../config.json.
  function resolveConfigUrl() {
    var path = window.location.pathname;
    // If the path ends with / (a directory), strip it for counting.
    var clean = path.replace(/\/$/, "");
    // Count depth: /tools/developer/json-formatter → 3 levels → ../../../
    var parts = clean.split("/").filter(Boolean);
    var depth = parts.length;
    var prefix = depth === 0 ? "" : "../".repeat(depth);
    return prefix + "config.json";
  }

  var CONFIG_URL = resolveConfigUrl();

  /** Fallback defaults used when the fetch fails or the config is missing. */
  var DEFAULTS = {
    site: {
      name: "Fernandes Labs",
      domain: "fernandeslabs.com",
      description: "Free online tools for developers, designers, and marketers."
    },
    monetization: {
      adsense: { enabled: false, client_id: null, ad_slots: {} },
      crypto: { enabled: false, wallets: {}, donation_amounts: [1, 5, 10] },
      affiliate: { enabled: false, links: {} }
    },
    analytics: {
      google: { enabled: false, measurement_id: null },
      plausible: { enabled: false, domain: null }
    },
    branding: {
      logo: "/assets/logo.svg",
      favicon: "/assets/favicon.ico",
      social_image: "/assets/social-preview.jpg",
      footer_text: "Built by Fernandes Labs",
      back_link: "/"
    },
    seo: {
      default_title_suffix: " — Fernandes Labs",
      default_description: "Free online tools.",
      default_keywords: "free online tools"
    },
    features: {
      dark_mode: true,
      analytics: false,
      crypto_donations: false,
      adsense: false,
      affiliate_links: false,
      back_to_tools: true
    }
  };

  /** Deep-merge two plain objects; values in `override` win. */
  function deepMerge(base, override) {
    if (typeof base !== "object" || base === null) return override;
    if (typeof override !== "object" || override === null) return override;
    var result = Array.isArray(base) ? base.slice() : Object.assign({}, base);
    for (var key in override) {
      if (Object.prototype.hasOwnProperty.call(override, key)) {
        result[key] = deepMerge(base[key], override[key]);
      }
    }
    return result;
  }

  /** Read the cached config if it exists and is still fresh. */
  function readCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed.timestamp || Date.now() - parsed.timestamp > CACHE_TTL_MS) {
        return null;
      }
      return parsed.config;
    } catch (e) {
      return null;
    }
  }

  /** Write the config to localStorage with a timestamp. */
  function writeCache(config) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        config: config
      }));
    } catch (e) {
      // localStorage may be full or blocked; non-fatal.
    }
  }

  /** Fetch the live config.json, falling back to cache then defaults. */
  function fetchConfig() {
    return fetch(CONFIG_URL, { cache: "no-cache" })
      .then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.json();
      })
      .then(function (live) {
        writeCache(live);
        return deepMerge(DEFAULTS, live);
      })
      .catch(function () {
        var cached = readCache();
        if (cached) return deepMerge(DEFAULTS, cached);
        return DEFAULTS;
      });
  }

  /** Load AdSense script if enabled and a client_id is present. */
  function loadAdSense(config) {
    if (!config.features.adsense || !config.monetization.adsense.enabled) return;
    var clientId = config.monetization.adsense.client_id;
    if (!clientId) return;
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + clientId;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }

  /** Load Google Analytics 4 if enabled and a measurement_id is present. */
  function loadAnalytics(config) {
    if (!config.features.analytics) return;
    var ga = config.analytics.google;
    if (!ga.enabled || !ga.measurement_id) return;
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + ga.measurement_id;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag("js", new Date());
    gtag("config", ga.measurement_id);
  }

  /** Apply branding: favicon, footer text, back link. */
  function applyBranding(config) {
    if (config.branding.favicon) {
      var link = document.querySelector("link[rel='icon']") || document.createElement("link");
      link.rel = "icon";
      // Resolve favicon relative to the page, not the domain root.
      link.href = resolveRelative(config.branding.favicon);
      document.head.appendChild(link);
    }
  }

  /** Resolve a root-relative URL (e.g. /assets/x) to a path relative to the current page. */
  function resolveRelative(url) {
    if (!url || !url.startsWith("/")) return url;
    var path = window.location.pathname.replace(/\/$/, "");
    var parts = path.split("/").filter(Boolean);
    var depth = parts.length;
    var prefix = depth === 0 ? "" : "../".repeat(depth);
    return prefix + url.slice(1);
  }

  var pendingPromise = null;

  var FernandesConfig = {
    /** Returns a promise resolving to the merged config (live → cache → defaults). */
    load: function () {
      if (pendingPromise) return pendingPromise;
      pendingPromise = fetchConfig().then(function (config) {
        loadAdSense(config);
        loadAnalytics(config);
        applyBranding(config);
        return config;
      });
      return pendingPromise;
    },

    /** Synchronous access to the default config (for immediate use before load resolves). */
    defaults: function () {
      return deepMerge({}, DEFAULTS);
    }
  };

  global.FernandesConfig = FernandesConfig;
})(window);
