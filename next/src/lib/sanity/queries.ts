import { fetchSanity, groq } from './fetch'

export const heroVideoQuery = groq`
  *[_type == "hero.video"]{
    ...,
    "muxVideo": muxVideo.asset->{
      playbackId,
      status,
      filename
    }
  }
`

export async function getHeroVideo() {
	const heroVideo = await fetchSanity(heroVideoQuery)

	if (!heroVideo || heroVideo.length === 0) {
		throw new Error('No hero video found in Sanity.')
	}

	return heroVideo[0]
}

export const linkQuery = groq`
  ...,
  internal->{ _type, title, metadata }
`

const navigationQuery = groq`
  title,
  items[]{
    ${linkQuery},
    link{ ${linkQuery} },
    links[]{ ${linkQuery} }
  }
`

export async function getSite() {
	const site = await fetchSanity<Sanity.Site>(
		groq`
      *[_type == 'site'][0]{
        ...,
        ctas[]{
          ...,
          link{ ${linkQuery} }
        },
        headerMenu->{ ${navigationQuery} },
        footerMenu->{ ${navigationQuery} },
        social->{ ${navigationQuery} },
        'ogimage': ogimage.asset->url
      }
    `,
		{ tags: ['site'] },
	)

	if (!site) throw new Error("Missing 'site' document in Sanity Studio")

	return site
}

export const modulesQuery = groq`
  ...,
  ctas[]{
    ...,
    link{ ${linkQuery} }
  },
  _type == 'hero.video' => {
    ...,
    "muxVideo": muxVideo.asset->{
      playbackId,
      status,
      filename
    }
  },
  _type == 'blog-list' => { predefinedFilters[]-> },
  _type == 'breadcrumbs' => { crumbs[]{ ${linkQuery} } },
  _type == 'creative-module' => {
    modules[]{
      ...,
      subModules[]{
        ...,
        ctas[]{
          ...,
          link{ ${linkQuery} }
        }
      }
    }
  },
  _type == 'logo-list' => { logos[]-> },
  _type == 'pricing-list' => { tiers[]-> },
  _type == 'richtext-module' => {
    'headings': select(
      tableOfContents => content[style in ['h2', 'h3', 'h4', 'h5', 'h6']]{
        style,
        'text': pt::text(@)
      }
    ),
  },
  _type == 'testimonial.featured' => { testimonial-> },
  _type == 'testimonial-list' => { testimonials[]-> },
`
// ### Explanation

// - **Hero Video Case**: The query now includes `_type == 'hero.video' => {...}`, which handles the hero video module specifically. It ensures that the `muxVideo` field is fully resolved to include the `playbackId`, `status`, and `filename`.

// ### Next Steps

// 1. **Replace `modulesQuery` in Your Code**: Ensure that this updated `modulesQuery` is correctly integrated into your code, replacing the existing `modulesQuery` in `queries.ts`.

// 2. **Verify Data Flow**: After updating, check the data being passed to your `HeroVideo` component by adding console logs or using the browser's developer tools.

// 3. **Test the Page**: Load your page and ensure that the Mux video is correctly displayed, with the `playbackId` properly resolved and passed to the `HeroVideo` component.

// This update should ensure that the `playbackId` is included in the data passed to the `HeroVideo` component, allowing the video to be displayed correctly. Let me know if you encounter any issues!
