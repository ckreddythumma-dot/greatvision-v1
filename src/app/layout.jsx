import Script from 'next/script'
import './globals.css'

export const metadata = {
  title: 'GreatVision — Interactive ECE Concepts for GATE',
  description: 'Interactive visualizations for Electronic Devices concepts, anchored to real-world chip design. Built for GATE aspirants.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-C3M88RYKF1"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('consent', 'default', {
              analytics_storage: 'granted',
              ad_storage: 'denied',
            });
            gtag('config', 'G-C3M88RYKF1');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
