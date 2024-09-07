'use client'

import { PortableText } from '@portabletext/react'
import CTAList from '@/ui/CTAList'
import { cn } from '@/lib/utils'
import { stegaClean } from '@sanity/client/stega'
import css from './Hero.module.css'
import MuxPlayer from '@mux/mux-player-react'
import { useEffect, useState } from 'react'

export default function HeroVideo({
	content,
	ctas,
	muxVideo,
	textAlign = 'center',
	alignItems,
}: Partial<{
	pretitle: string
	content: any
	ctas: Sanity.CTA[]
	muxVideo: {
		playbackId: string
		status: string
		filename: string
	}
	textAlign: React.CSSProperties['textAlign']
	alignItems: React.CSSProperties['alignItems']
}>) {
	const hasVideo = !!muxVideo?.playbackId

	const [error, setError] = useState<string | null>(null)

	// Sanitize playbackId to remove any unwanted characters
	const sanitizePlaybackId = (id: string): string => {
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

	// // CTAs Testing
	// useEffect(() => {
	// 	if (ctas && ctas.length > 0) {
	// 		ctas.forEach((cta, index) => {
	// 			console.log(`CTA ${index}:`, cta)
	// 			console.log(`CTA ${index} Link:`, cta.link)

	// 			// Checking the link type correctly
	// 			if (!cta.link) {
	// 				console.warn(`CTA ${index} is missing a link.`)
	// 			} else if (!cta.link.internal && cta.link.type !== 'external') {
	// 				console.warn(`CTA ${index} is missing a valid internal link.`)
	// 			}
	// 		})
	// 	} else {
	// 		console.warn('No CTAs provided to HeroVideo component.')
	// 	}
	// }, [ctas])

	return (
		<section
			className={cn(
				'videosection',
				hasVideo &&
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
						src={`https://stream.mux.com/${sanitizedPlaybackId}.m3u8`}
						autoPlay
						loop
						muted
						playsInline
						className="h-full w-full object-cover"
						onError={(e) => {
							console.error('Video error:', e)
							setError('Video failed to load')
						}}
					/>
				)}
			</div>

			{content && (
				<div className="section relative z-10 flex h-full w-full flex-col">
					<div
						className={cn(
							'richtext relative isolate max-w-xl [&_:is(h1,h2)]:text-balance',
							hasVideo && 'text-shadow',
							css.txt,
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
