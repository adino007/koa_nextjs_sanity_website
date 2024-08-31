'use client' // Ensure this component is treated as a Client Component

import Img, { Source } from '@/ui/Img'
import { PortableText } from '@portabletext/react'
import CTAList from '@/ui/CTAList'
import Pretitle from '@/ui/Pretitle'
import { cn } from '@/lib/utils'
import { stegaClean } from '@sanity/client/stega'
import css from './Hero.module.css'
import MuxPlayer from '@mux/mux-player-react' // Use MuxPlayer for Mux video
import { useEffect, useState } from 'react' // Import useEffect for debugging playback

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

	const [error, setError] = useState<string | null>(null)

	// Sanitize playbackId to remove any unwanted characters
	const sanitizePlaybackId = (id: string): string => {
		// Regular expression to match valid characters
		return id.replace(/[^a-zA-Z0-9-_]/g, '')
	}

	const sanitizedPlaybackId = hasVideo
		? sanitizePlaybackId(muxVideo.playbackId)
		: null

	useEffect(() => {
		if (sanitizedPlaybackId) {
			console.log('Sanitized Playback ID:', sanitizedPlaybackId)
		} else {
			console.warn('No valid video found or playbackId is missing.')
			setError('Invalid Playback ID')
		}
	}, [sanitizedPlaybackId])

	return (
		<section
			className={cn(
				(hasImage || hasVideo) &&
					'grid overflow-hidden bg-ink text-canvas *:col-span-full *:row-span-full',
			)}
		>
			{/* Background Video */}
			<div className={css.muxPlayerWrapper}>
				{error ? (
					<div className="error-message">
						Video could not be loaded: {error}
					</div>
				) : (
					<MuxPlayer
						src={`https://stream.mux.com/${sanitizedPlaybackId}.m3u8`} // Use sanitized playback ID
						autoPlay
						loop
						muted
						playsInline
						className="h-full w-full object-contain" // Adjusted to fit within the component
						onError={(e) => {
							console.error('Video error:', e)
							setError('Video failed to load')
						}}
					/>
				)}
			</div>

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
