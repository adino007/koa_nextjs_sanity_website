import { defineField, defineType } from 'sanity'
import { TfiLayoutCtaCenter } from 'react-icons/tfi'
import { muxInput } from 'sanity-plugin-mux-input'
import { getBlockText } from '../../src/utils'

export default defineType({
	name: 'hero.video',
	title: 'Hero (Video)',
	icon: TfiLayoutCtaCenter,
	type: 'object',
	fields: [
		defineField({
			name: 'pretitle',
			type: 'string',
			title: 'Pretitle',
		}),
		defineField({
			name: 'content',
			type: 'array',
			title: 'Content',
			of: [{ type: 'block' }],
		}),
		defineField({
			name: 'ctas',
			type: 'array',
			title: 'Call-to-actions',
			of: [{ type: 'cta' }],
		}),
		defineField({
			name: 'muxVideo',
			type: 'mux.video',
			title: 'Background Video',
			description: 'Upload or select a video from Mux',
		}),
		defineField({
			name: 'image',
			type: 'image',
			title: 'Background Image',
			options: {
				hotspot: true,
			},
			fields: [
				defineField({
					name: 'alt',
					type: 'string',
					title: 'Alternative text',
				}),
				defineField({
					name: 'faded',
					type: 'boolean',
					title: 'Faded',
					initialValue: true,
				}),
				defineField({
					name: 'loading',
					type: 'string',
					title: 'Loading',
					options: {
						layout: 'radio',
						list: ['lazy', 'eager'],
					},
					initialValue: 'lazy',
				}),
			],
		}),
	],
	preview: {
		select: {
			content: 'content',
			media: 'muxVideo',
		},
		prepare: ({ content, media }) => ({
			title: content ? content[0]?.children?.[0]?.text : 'Untitled',
			subtitle: 'Hero (Video)',
			media,
		}),
	},
})
