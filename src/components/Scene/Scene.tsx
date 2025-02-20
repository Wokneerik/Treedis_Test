'use client'
import { MatterportSDK, Mattertag } from '@/src/types/sdk'
import { useEffect, useRef } from 'react'

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

				console.log('SDK Connected!', mpSdk)

				mpSdk.on('ready', async () => {
					console.log('Showcase is ready!')

					const cameraPosition = await mpSdk.Camera.getPosition()

					const tagPosition = {
						x: cameraPosition.x + 0.8,
						y: cameraPosition.y,
						z: cameraPosition.z + 0.8,
					}

					console.log('Camera Position:', cameraPosition)

					const tagData: Mattertag = {
						label: 'OFFICE',
						description: 'Office Area',
						anchorPosition: tagPosition,
						stemVector: { x: 0, y: 2, z: 0 },
						color: { r: 0, g: 255, b: 0 },
						stemHeight: 3.0,
						size: {
							diameter: 8,
							height: 8,
						},
					}
					console.log('Adding Tag:', tagData)

					try {
						const tag = await mpSdk.Mattertag.add([tagData])
						console.log('Tag created successfully:', tag)

						await mpSdk.Mattertag.navigateToTag(
							tag[0],
							mpSdk.Mattertag.Transition.FLY
						)

						try {
							await mpSdk.Mattertag.editColor(
								tag[0],
								{
									r: 0,
									g: 122,
									b: 0,
								},
								true
							)
						} catch (e) {
							console.log('Pulse effect not available')
						}
					} catch (error) {
						console.error('Error creating tag:', error)
					}
				})

				mpSdk.Pointer.intersection.subscribe(intersection => {
					if (intersection) {
						// console.log('Pointer position:', intersection.position)
					}
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
