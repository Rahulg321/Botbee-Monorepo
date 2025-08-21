import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "tiktoken"],
  // async headers() {
  //   const dev = process.env.NODE_ENV !== "production";
  //   const base = [
  //     {
  //       key: "Content-Security-Policy",
  //       value: [
  //         "frame-ancestors",
  //         // allow same-origin parents
  //         "'self'",
  //         // production partners
  //         "https://*.partner1.com",
  //         "https://client-site.com",
  //         "https://*.vercel.app",
  //         // dev convenience: allow local parents (only in dev!)
  //         dev ? "http://localhost:*" : "",
  //         dev ? "http://127.0.0.1:*" : "",
  //       ]
  //         .filter(Boolean)
  //         .join(" "),
  //     },
  //   ];

  //   return [{ source: "/special", headers: base }];
  // },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "0cpxrvsgvffgqns0.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },

      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },

      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "seeklogo.com",
        port: "",
        pathname: "/**",
      },

      {
        hostname: "avatar.vercel.sh",
      },
    ],
  },
};

export default nextConfig;
