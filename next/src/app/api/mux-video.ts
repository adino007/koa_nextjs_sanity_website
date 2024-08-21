import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import fetch from 'node-fetch'

// Initializing the CORS middleware
const cors = Cors({
	methods: ['GET', 'POST', 'HEAD'],
})

// Helper function to run the middleware
function runMiddleware(
	req: NextApiRequest,
	res: NextApiResponse,
	fn: Function,
) {
	return new Promise((resolve, reject) => {
		fn(req, res, (result: any) => {
			if (result instanceof Error) {
				return reject(result)
			}
			return resolve(result)
		})
	})
}

// API handler with CORS and Mux proxying
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	// Run the CORS middleware
	await runMiddleware(req, res, cors)

	const { playbackId } = req.query

	// Validate the playbackId
	if (!playbackId) {
		return res.status(400).json({ error: 'Playback ID is required' })
	}

	try {
		// Fetch the video from Mux
		const muxUrl = `https://stream.mux.com/${playbackId}.m3u8`
		const response = await fetch(muxUrl)

		if (!response.ok) {
			return res
				.status(response.status)
				.json({ error: `Failed to load video: ${response.statusText}` })
		}

		// Stream the video content back to the client
		response.body.pipe(res)
	} catch (error) {
		res
			.status(500)
			.json({ error: 'An error occurred while fetching the video' })
	}
}
