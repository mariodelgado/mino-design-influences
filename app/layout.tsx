import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mino Design Influences | Tanaka × PlayStation',
  description: 'Exploring the synthesis of Ikko Tanaka geometric minimalism and PlayStation 4 zen interface design',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
