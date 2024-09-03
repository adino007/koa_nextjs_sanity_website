'use client'

import Link from 'next/link'
import processUrl from '@/lib/processUrl'
import { cn } from '@/lib/utils'
import { stegaClean } from '@sanity/client/stega'
import { useEffect } from 'react'

export default function CTA({
	link,
	style,
	className,
	children,
	...rest
}: Sanity.CTA & React.HTMLAttributes<HTMLAnchorElement>) {
	useEffect(() => {
		console.log('CTA Link:', link)
		if (link?.type === 'internal' && !link.internal) {
			console.warn('CTA is marked as internal but has no valid internal link.')
		}
	}, [link])

	const props = {
		className: cn(style, className) || undefined,
		children:
			children || link?.label || link?.internal?.title || link?.external,
		...rest,
	}

	if (link?.type === 'internal' && link.internal)
		return (
			<Link
				href={processUrl(link.internal, {
					base: false,
					params: link.params,
				})}
				{...props}
			/>
		)

	if (link?.type === 'external' && link.external)
		return <a href={stegaClean(link.external)} {...props} />

	return props.children
}
