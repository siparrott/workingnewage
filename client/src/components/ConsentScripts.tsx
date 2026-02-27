// src/components/ConsentScripts.tsx
// Only loads Analytics/Marketing scripts AFTER user consent (GDPR-compliant)

import { useEffect } from "react";
import { hasConsent } from "../lib/consent";

export default function ConsentScripts() {
  useEffect(() => {
    const load = () => {
      // Analytics - only load if user has consented
      if (hasConsent("analytics")) {
        loadGA4("G-8W76BVNNW9");
        console.log("[Consent] Analytics consent granted - loading GA");
      }

      // Marketing - only load if user has consented
      if (hasConsent("marketing")) {
        // Meta Pixel example (uncomment and add your ID)
        // loadMetaPixel("XXXXXXXXXX");
        console.log("[Consent] Marketing consent granted - ready to load Meta Pixel");
      }
    };

    // Initial load check
    load();

    // Listen for consent updates (when user changes preferences)
    const onUpdate = () => load();
    window.addEventListener("consent:updated", onUpdate);
    return () => window.removeEventListener("consent:updated", onUpdate);
  }, []);

  return null;
}

// Helper function to load Google Analytics 4
export function loadGA4(measurementId: string) {
  if (typeof window === "undefined") return;
  if ((window as any).gaLoaded) return; // Prevent double-loading

  // Load gtag script
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize gtag
  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) {
    (window as any).dataLayer.push(args);
  }
  (window as any).gtag = gtag;
  gtag("js", new Date());
  gtag("config", measurementId, {
    anonymize_ip: true, // GDPR-friendly
  });

  (window as any).gaLoaded = true;
  console.log("[Analytics] Google Analytics loaded:", measurementId);
}

// Helper function to load Meta Pixel
export function loadMetaPixel(pixelId: string) {
  if (typeof window === "undefined") return;
  if ((window as any).fbqLoaded) return; // Prevent double-loading

  // Meta Pixel base code
  (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

  (window as any).fbq("init", pixelId);
  (window as any).fbq("track", "PageView");

  (window as any).fbqLoaded = true;
  console.log("[Marketing] Meta Pixel loaded:", pixelId);
}
