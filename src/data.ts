import { FeatureItem, PricingPlan } from "./types";

export const FEATURES_DATA: FeatureItem[] = [
  {
    id: "external-internal",
    title: "ESP & Visuals",
    description: "Equipped with custom Box, Skeleton, and Tracer ESP. Our optimized overlay runs with sub-millisecond latencies directly through DirectX layouts.",
    badge: "Overlays"
  },
  {
    id: "aimbot",
    title: "Target Assist",
    description: "Highly configurable soft Aimbot with adjustable field-of-view, smooth factors, and vector tracking to look completely natural.",
    badge: "Combat"
  },
  {
    id: "protections",
    title: "Full Protections",
    description: "Our software comes equipped with an elite level Hyperion bypass, making our client 99.9% safe. Experience supreme gameplay enhancements without the risk of detection.",
    badge: "Security"
  },
  {
    id: "updates",
    title: "Fast Updates",
    description: "We develop our software to minimize downtime and automatically push cloud updates to ensure constant compatibility.",
    badge: "Release Cycles"
  },
  {
    id: "optimized",
    title: "Optimized Interface",
    description: "Our UI is designed to function stably and resource efficiently, minimizing the memory footprint and maximizing FPS.",
    badge: "Performance"
  },
  {
    id: "fast-support",
    title: "Fast Support",
    description: "Our support team on Discord is available to you at any time, whenever you encounter a problem with our product. Feel free to simply open a ticket.",
    badge: "Community"
  }
];

export const PRICING_PLANS_DATA: PricingPlan[] = [
  {
    id: "weekly",
    name: "Weekly",
    price: "$3.60",
    duration: "1 Week",
    tagline: "Get a taste of premium power for a low entry plan limit.",
    features: [
      "Access to External Overlay",
      "Access to Internal Memory Mods",
      "Aimbot, ESP & Client tweaks",
      "Secure bypass overrides",
      "Continuous auto-updates",
      "Yara undetected modules",
      "Anti-detection spoofing layers",
      "Direct Discord ticketing"
    ]
  },
  {
    id: "monthly",
    name: "Monthly",
    price: "$9.00",
    duration: "1 Month",
    isPopular: true,
    tagline: "The most popular choice for continuous protection and zero interruption.",
    features: [
      "Access to External Overlay",
      "Access to Internal Memory Mods",
      "Aimbot, ESP & Client tweaks",
      "Secure bypass overrides",
      "Continuous auto-updates",
      "Yara undetected modules",
      "Anti-detection spoofing layers",
      "Direct Discord ticketing"
    ]
  },
  {
    id: "yearly",
    name: "Yearly",
    price: "$35.00",
    duration: "1 Year",
    tagline: "Serious play requires serious commitments with absolute cost savings.",
    features: [
      "Access to External Overlay",
      "Access to Internal Memory Mods",
      "Aimbot, ESP & Client tweaks",
      "Secure bypass overrides",
      "Continuous auto-updates",
      "Yara undetected modules",
      "Anti-detection spoofing layers",
      "Direct Discord ticketing"
    ]
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: "$45.00",
    duration: "Enjoy stress-free, never-expiring licenses!",
    isLifetime: true,
    tagline: "Buy once, cheat forever. No recurring billing, no stress.",
    features: [
      "Access to External Overlay",
      "Access to Internal Memory Mods",
      "Aimbot, ESP & Client tweaks",
      "Secure bypass overrides",
      "Continuous auto-updates",
      "Yara undetected modules",
      "Anti-detection spoofing layers",
      "Direct Discord ticketing"
    ]
  }
];
