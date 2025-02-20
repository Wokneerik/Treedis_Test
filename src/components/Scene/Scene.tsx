'use client'

import { useEffect, useRef } from 'react'

type MatterportSDK = {
	connect: (
		iframe: HTMLIFrameElement | null,
		key: string,
		password?: string
	) => Promise<any>
}

declare global {
	interface Window {
		MP_SDK: MatterportSDK
	}
}

const Scene = () => {
	const SDK_KEY = process.env.NEXT_PUBLIC_MATTERPORT_SDK_KEY ?? ''
	const showcaseRef = useRef<HTMLIFrameElement | null>(null)

	useEffect(() => {
		let showcase: any

		const loadShowcase = async () => {
			try {
				const mpSdk = await window.MP_SDK.connect(
					showcaseRef.current,
					SDK_KEY,
					''
				)

				console.log('SDK Connected!')

				mpSdk.on('ready', () => {
					console.log('Showcase is ready!')
				})
			} catch (e) {
				console.error(e)
			}
		}

		const script = document.createElement('script')
		script.src =
			'https://static.matterport.com/showcase-sdk/2.0.1-0-g64e7e88/sdk.js'
		script.async = true
		script.onload = loadShowcase
		document.body.appendChild(script)

		return () => {
			if (showcase) {
				showcase.disconnect()
			}
		}
	}, [SDK_KEY])

	return (
		<main style={{ height: '100vh', width: '100vw' }}>
			<iframe
				ref={showcaseRef}
				id='showcase-iframe'
				src='https://my.matterport.com/show/?m=m72PGKzeknR'
				width='100%'
				height='100%'
				allowFullScreen
			/>
		</main>
	)
}

export default Scene
