/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Allow dev assets to be requested from your LAN device (adjust origin/port as needed)
  allowedDevOrigins: [
    "http://192.168.1.12:3000",
    "http://172.168.15.166:3000",
  ],
  // Rewrite common missing image requests to safe fallbacks to avoid 404 noise during dev
  async rewrites() {
    return [
      { source: '/bali-indonesia-rice-terraces.jpg', destination: '/images/modern-minimalist-design.jpg' },
      { source: '/barcelona-spain-beach-city.jpg', destination: '/images/modern-minimalist-design.jpg' },
      { source: '/tokyo-japan-cityscape.jpg', destination: '/images/modern-minimalist-design.jpg' },
      { source: '/bali-beach-sunset.png', destination: '/images/modern-minimalist-design.jpg' },
      { source: '/eiffel-tower-paris.png', destination: '/images/modern-minimalist-design.jpg' },
      { source: '/kyoto-temple.png', destination: '/images/modern-minimalist-design.jpg' },
      { source: '/luxury-modern-interior-design-living-room-with-con.jpg', destination: '/images/interior-design-3d-walkthrough.jpg' },
      { source: '/luxury-modern-interior-design-living-room-contempo.jpg', destination: '/images/interior-design-3d-walkthrough.jpg' },
    ]
  },
}

export default nextConfig
