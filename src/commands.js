exports.autoPlay = async function (mix, layer, mediaId, imageTimeout) {
	let self = this
	let TIMER = 1000 // 1 second in milliseconds
	let TO_MILLISECONDS = 1000

	// Calculate length of the clip
	let durationSeconds = await self
		.sendGetRequest(`/media/${mediaId}`)
		.then((body) => {
			return JSON.parse(body).duration
		})
		.catch((error) => {
			self.log('error', 'Something went wrong calculating clip duration')
			return
		})

	//Load clip into layer
	await self.sendGetRequest(`/mix/${mix}/layer/${layer}/media/${mediaId}`)

	// Fade layer level up
	await self.sendGetRequest(`/pin/fadevalue/Engine_Mix${mix}_Layer${layer}_Mixer_Level/100/${TIMER}`)

	// Wait for clip to finish, if image timeout is 1 second
	let timeout = imageTimeout * TO_MILLISECONDS

	if (durationSeconds !== 0) {
		timeout = (durationSeconds - 1) * TO_MILLISECONDS
	}

	setTimeout(async () => {
		await self.sendGetRequest(`/pin/fadevalue/Engine_Mix${mix}_Layer${layer}_Mixer_Level/0/${TIMER}`)
	}, timeout)
}
