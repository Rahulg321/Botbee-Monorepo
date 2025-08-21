// app/embed/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

export default function EmbedPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = (params.get("theme") || "light") as "light" | "dark";
    setTheme(t);
  }, []);

  // auto-resize: observe content changes and post height to parent
  useEffect(() => {
    const el = rootRef.current!;
    const ro = new ResizeObserver(() => {
      const height = Math.ceil(el.scrollHeight);
      window.parent.postMessage({ type: "EMBED_SIZE", height }, "*");
    });
    ro.observe(el);

    // announce readiness
    window.parent.postMessage({ type: "EMBED_READY" }, "*");

    return () => ro.disconnect();
  }, []);

  // example: send custom events back to host
  const notifyClick = () => {
    console.log("notifyClick");
    window.parent.postMessage(
      { type: "EMBED_EVENT", action: "clicked_cta" },
      "*"
    );
  };

  return (
    <div
      ref={rootRef}
      style={{
        fontFamily: "system-ui, sans-serif",
        padding: 16,
        background: theme === "dark" ? "#0b0b0c" : "#fff",
        color: theme === "dark" ? "#fff" : "#111",
        lineHeight: 1.5,
      }}
    >
      <h2 style={{ marginTop: 0 }}>My Embeddable Widget</h2>
      <p>This is rendered inside an iframe. Resize is automatic.</p>
      <Button onClick={notifyClick}>Do the Thing</Button>
    </div>
  );
}
