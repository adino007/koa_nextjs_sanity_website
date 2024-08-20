'use client' // Ensure this component is treated as a Client Component

import Img, { Source } from '@/ui/Img'
import { PortableText } from '@portabletext/react'
import CTAList from '@/ui/CTAList'
import Pretitle from '@/ui/Pretitle'
import { cn } from '@/lib/utils'
import { stegaClean } from '@sanity/client/stega'
import css from './Hero.module.css'
import MuxPlayer from '@mux/mux-player-react' // Use MuxPlayer for Mux video
import { useEffect } from 'react' // Import useEffect for debugging playback

export default function HeroVideo({
	pretitle,
	content,
	ctas,
	bgImage,
	bgImageMobile,
	muxVideo, // This now contains the resolved asset with playbackId
	textAlign = 'center',
	alignItems,
}: Partial<{
	pretitle: string
	content: any
	ctas: Sanity.CTA[]
	bgImage: Sanity.Image
	bgImageMobile: Sanity.Image
	muxVideo: {
		playbackId: string
		status: string
		filename: string
	}
	textAlign: React.CSSProperties['textAlign']
	alignItems: React.CSSProperties['alignItems']
}>) {
	const hasImage = !!bgImage?.asset
	const hasVideo = !!muxVideo?.playbackId

	// Debugging: Log the muxVideo object to the console
	useEffect(() => {
		console.log('muxVideo:', muxVideo)
		if (hasVideo) {
			console.log('Playback ID:', muxVideo.playbackId)
		} else {
			console.warn('No valid video found or playbackId is missing.')
		}
	}, [muxVideo, hasVideo])

	return (
		<section
			className={cn(
				(hasImage || hasVideo) &&
					'grid overflow-hidden bg-ink text-canvas *:col-span-full *:row-span-full',
			)}
		>
			{/* Background Video */}
			{hasVideo && (
				<MuxPlayer
					playbackId={muxVideo.playbackId} // Use playbackId from Mux video
					autoPlay
					loop
					muted
					playsInline
					className="absolute inset-0 h-full w-full object-cover"
					onError={(e) => console.error('Video error:', e)}
				/>
			)}

			{/* Background Image */}
			{bgImage?.asset && !hasVideo && (
				<picture>
					<Source image={bgImageMobile} imageWidth={1200} />
					<Img
						className="size-full max-h-fold object-cover"
						image={bgImage}
						imageWidth={1800}
						draggable={false}
					/>
				</picture>
			)}

			{content && (
				<div className="section relative z-10 flex w-full flex-col">
					<div
						className={cn(
							'richtext relative isolate max-w-xl [&_:is(h1,h2)]:text-balance',
							(hasImage || hasVideo) && 'text-shadow',
							hasImage && css.txt,
							{
								'mb-8': stegaClean(alignItems) === 'start',
								'my-auto': stegaClean(alignItems) === 'center',
								'mt-auto': stegaClean(alignItems) === 'end',
							},
							{
								'mr-auto': stegaClean(textAlign) === 'left',
								'mx-auto': stegaClean(textAlign) === 'center',
								'ml-auto': stegaClean(textAlign) === 'right',
							},
						)}
						style={{ textAlign: stegaClean(textAlign) }}
					>
						<Pretitle
							className={cn((hasImage || hasVideo) && 'text-canvas/70')}
						>
							{pretitle}
						</Pretitle>
						<PortableText value={content} />
						<CTAList
							ctas={ctas}
							className={cn('!mt-4', {
								'justify-start': stegaClean(textAlign) === 'left',
								'justify-center': stegaClean(textAlign) === 'center',
								'justify-end': stegaClean(textAlign) === 'right',
							})}
						/>
					</div>
				</div>
			)}
		</section>
	)
}
