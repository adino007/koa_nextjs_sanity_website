'use client'

import { cn } from '@/lib/utils'
import CTA from './CTA'
import { useEffect } from 'react'

export default function CTAList({
	ctas,
	className,
}: React.HTMLAttributes<HTMLParagraphElement> & {
	ctas?: Sanity.CTA[]
}) {
	useEffect(() => {
		if (ctas && ctas.length > 0) {
			ctas.forEach((cta, index) => {
				console.log(`CTA ${index}:`, cta)
				console.log(`CTA ${index} Link:`, cta.link)
				if (!cta.link || !cta.link.internal) {
					console.warn(`CTA ${index} is missing a valid internal link.`)
				}
			})
		} else {
			console.warn('No CTAs provided to HeroVideo component.')
		}
	}, [ctas])

	if (!ctas?.length) return null

	return (
		<div className={cn('flex flex-wrap items-center gap-[.5em]', className)}>
			{ctas?.map((cta, key) => (
				<CTA className="max-sm:w-1/2" {...cta} key={key} />
			))}
		</div>
	)
}
