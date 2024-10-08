// import { GoogleTagManager } from '@next/third-parties/google'
import type { Metadata } from 'next'
import SkipToContent from '@/ui/SkipToContent'
import Announcement from '@/ui/Announcement'
import Header from '@/ui/header'
import Footer from '@/ui/footer'
import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import '@/styles/app.css'

export const metadata: Metadata = {
	icons: {
		icon: `https://fav.farm/🔥`,
	},
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			{/* <GoogleTagManager gtmId='' /> */}

			<body className="bg-black font-moncheri uppercase text-white">
				<SkipToContent />
				<Announcement />
				<Header />
				<main id="main-content" tabIndex={-1}>
					{children}
				</main>
				<Footer />

				<SpeedInsights />
				<Analytics />
				{draftMode().isEnabled && <VisualEditing />}
			</body>
		</html>
	)
}
