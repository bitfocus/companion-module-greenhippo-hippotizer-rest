module.exports = function (self) {
	self.setActionDefinitions({
		/*
		 *  LAYER CONTROLS
		 */
		layer_load_media: {
			name: 'Layer: Load Media',
			description: 'Load media into a layer, includes an optional autoplay option',
			options: [
				{
					id: 'mix',
					type: 'number',
					label: 'Mix',
					default: 1,
					min: 1,
					max: 100,
				},
				{
					id: 'layer',
					type: 'number',
					label: 'Layer',
					default: 1,
					min: 1,
					max: 24,
				},
				{
					id: 'bank',
					type: 'number',
					label: 'Bank Number',
					default: 0,
					min: 0,
					max: 255,
				},
				{
					id: 'slot',
					type: 'number',
					label: 'Slot Number',
					default: 0,
					min: 0,
					max: 255,
				},
				{
					id: 'AutoPlay',
					type: 'checkbox',
					label: 'Autoplay Enabled?',
					default: false,
					tooltip: 'Loads a media file onto a layer, fades up the layer, plays media, then fades out the layer',
				},
				{
					id: 'image_timeout',
					label: 'Image Timeout',
					type: 'number',
					isVisible: (options) => {
						return options.AutoPlay
					},
					default: 1,
					min: 0,
					tooltip: 'How long should an image display for? (Seconds)',
				},
			],
			callback: async (event) => {
				const mediaId = self.parseBankSlot(event.options.bank, event.options.slot)

				if (event.options.AutoPlay) {
					self.autoPlay(event.options.mix, event.options.layer, mediaId, event.options.image_timeout)
				} else {
					await self.sendGetRequest(`/mix/${event.options.mix}/layer/${event.options.layer}/media/${mediaId}`)
				}
			},
		},
		layer_level_fade: {
			name: 'Layer: Fade Level',
			description: 'Fade a layer level pin value over a user defined period of time',
			options: [
				{
					id: 'mix',
					type: 'number',
					label: 'Mix',
					default: 1,
					min: 1,
					max: 100,
				},
				{
					id: 'layer',
					type: 'number',
					label: 'Layer',
					default: 1,
					min: 1,
					max: 24,
				},
				{
					id: 'value',
					type: 'number',
					label: 'Level',
					default: 100,
					min: 0,
					max: 100,
				},
				{
					id: 'fade_time',
					type: 'number',
					label: 'Fade Time(ms)',
					default: 1000,
					min: 0,
					max: 20000,
				},
			],
			callback: async (event) => {
				await self.sendGetRequest(
					`/pin/fadevalue/Engine_Mix${event.options.mix}_Layer${event.options.layer}_Mixer_Level/${event.options.value}/${event.options.fade_time}`,
				)
			},
		},
		layer_load_preset_on: {
			name: 'Layer: Load Preset',
			description: 'Load a layer preset into a layer',
			options: [
				{
					id: 'mix',
					type: 'number',
					label: 'Mix',
					default: 1,
					min: 1,
					max: 100,
				},
				{
					id: 'layer',
					type: 'number',
					label: 'Layer',
					default: 1,
					min: 1,
					max: 24,
				},
				{
					id: 'bank',
					type: 'number',
					label: 'Bank Number',
					default: 0,
					min: 0,
					max: 255,
				},
				{
					id: 'slot',
					type: 'number',
					label: 'Slot Number',
					default: 0,
					min: 0,
					max: 255,
				},
				{
					id: 'preset_fade',
					type: 'checkbox',
					label: 'Use Recorded Fade Info?',
					default: false,
				},
				{
					id: 'fade_type',
					type: 'dropdown',
					label: 'Select Fade Type',
					choices: [
						{ id: '0', label: 'Cut' },
						{ id: '1', label: 'Crossfade' },
						{ id: '2', label: 'Fade Through Black' },
						{ id: '3', label: 'Fade Up First' },
						{ id: '4', label: 'Snap Start' },
						{ id: '5', label: 'Snap End' },
					],
					default: '1',
					isVisible: (options) => {
						return !options.preset_fade
					},
				},
				{
					id: 'fade_time',
					type: 'number',
					label: 'Fade Time(ms)',
					default: 1000,
					min: 0,
					max: 20000,
					isVisible: (options) => {
						return !options.preset_fade
					},
				},
			],
			callback: async (event) => {
				const presetId = self.parseBankSlot(event.options.bank, event.options.slot)
				if (event.options.preset_fade) {
					await self.sendGetRequest(
						`/pin/setvalue/Engine_Mix${event.options.mix}_Layer${event.options.layer}_Presets_UsePresetSettings/true`,
					)
				} else {
					await self.sendGetRequest(
						`/pin/setvalue/Engine_Mix${event.options.mix}_Layer${event.options.layer}_Presets_UsePresetSettings/false`,
					)
					await self.sendGetRequest(
						`/pin/setvalue/Engine_Mix${event.options.mix}_Layer${event.options.layer}_Presets_FadeTime/${event.options.fade_time}`,
					)
					await self.sendGetRequest(
						`/pin/setvalue/Engine_Mix${event.options.mix}_Layer${event.options.layer}_Presets_FadeType/${event.options.fade_type}`,
					)
				}
				await self.sendGetRequest(`/mix/${event.options.mix}/layer/${event.options.layer}/preset/${presetId}`)
			},
		},
		layer_play_modes: {
			name: 'Layer: Play Modes',
			description: 'Select a playmode for a layer',
			options: [
				{
					id: 'playmode',
					type: 'dropdown',
					label: 'Select Action',
					choices: [
						{ id: '0', label: 'Forward' },
						{ id: '1', label: 'Forward Looping' },
						{ id: '2', label: 'Backward' },
						{ id: '3', label: 'Backward Loop' },
						{ id: '4', label: 'Ping Pong' },
						{ id: '5', label: 'Random' },
						{ id: '6', label: 'In' },
						{ id: '7', label: 'Out' },
						{ id: '8', label: 'Inner Loop' },
						{ id: '9', label: 'Loop Start' },
						{ id: '10', label: 'Loop End' },
					],
					default: '1',
				},
				{
					id: 'mix',
					type: 'number',
					label: 'Mix',
					default: 1,
					min: 1,
					max: 100,
				},
				{
					id: 'layer',
					type: 'number',
					label: 'Layer',
					default: 1,
					min: 1,
					max: 24,
				},
			],
			callback: async (event) => {
				await self.sendGetRequest(
					`/pin/setvalue/Engine_Mix${event.options.mix}_Layer${event.options.layer}_Source_MediaPlayer_PlayMode/${event.options.playmode}`,
				)
			},
		},
		/*
		 *  MIX CONTROLS
		 */
		mix_level_fade: {
			name: 'Mix: Fade Level',
			description: 'Fade a mix level pin value over a user defined period of time',
			options: [
				{
					id: 'mix',
					type: 'number',
					label: 'Mix',
					default: 1,
					min: 1,
					max: 100,
				},
				{
					id: 'value',
					type: 'number',
					label: 'Level',
					default: 100,
					min: 0,
					max: 100,
				},
				{
					id: 'fade_time',
					type: 'number',
					label: 'Fade Time(ms)',
					default: 1000,
					min: 0,
					max: 20000,
				},
			],
			callback: async (event) => {
				await self.sendGetRequest(
					`/pin/fadevalue/Engine_Mix${event.options.mix}_MixControls_Level/${event.options.value}/${event.options.fade_time}`,
				)
			},
		},
		mix_load_preset_on: {
			name: 'Mix: Load Preset',
			description: 'Load a mix preset into a mix',
			options: [
				{
					id: 'mix',
					type: 'number',
					label: 'Mix',
					default: 1,
					min: 1,
					max: 100,
				},
				{
					id: 'bank',
					type: 'number',
					label: 'Bank Number',
					default: 0,
					min: 0,
					max: 255,
				},
				{
					id: 'slot',
					type: 'number',
					label: 'Slot Number',
					default: 0,
					min: 0,
					max: 255,
				},
			],
			callback: async (event) => {
				const presetId = self.parseBankSlot(event.options.bank, event.options.slot)
				await self.sendGetRequest(`/mix/${event.options.mix}/preset/${presetId}`)
			},
		},
		/*
		 *  PIN CONTROLS
		 */
		pin_set_value: {
			name: 'Pin: Set Value',
			description:
				'Sets the value of a target pin if valid data is provided, path should use underscores as path seperators',
			options: [
				{
					id: 'path',
					type: 'textinput',
					label: 'Path',
					tooltip: 'Path should be seperated with underscores. Ex. Engine_Mix1_Layer1',
					default: 'Seperate_Pin_Path_With_Underscores',
				},
				{
					id: 'value',
					type: 'textinput',
					label: 'Pin Value',
					default: '0',
				},
			],
			callback: async (event) => {
				await self.sendGetRequest(`/pin/setvalue/${event.options.path}/${event.options.value}`)
			},
		},
		pin_fade_to_value: {
			name: 'Pin: Fade To Value',
			description: 'Changes a target pins value over a specified time',
			options: [
				{
					id: 'path',
					type: 'textinput',
					label: 'Path',
					tooltip: 'Path should be seperated with underscores. Ex. Engine_Mix1_Layer1',
					default: 'Seperate_Pin_Path_With_Underscores',
				},
				{
					id: 'value',
					type: 'textinput',
					label: 'Pin Value',
					default: '0',
				},
				{
					id: 'fade_time',
					type: 'number',
					label: 'Fade Time(ms)',
					default: 1000,
					min: 0,
					max: 20000,
				},
			],
			callback: async (event) => {
				await self.sendGetRequest(
					`/pin/fadevalue/${event.options.path}/${event.options.value}/${event.options.fade_time}`,
				)
			},
		},
		pin_reset_value: {
			name: 'Pin: Reset Value',
			description: 'Sets the value of a target pin to its default value',
			options: [
				{
					id: 'path',
					type: 'textinput',
					label: 'Path',
					tooltip: 'Path should be seperated with underscores. Ex. Engine_Mix1_Layer1',
					default: 'Seperate_Pin_Path_With_Underscores',
				},
			],
			callback: async (event) => {
				await self.sendGetRequest(`/pin/reset/${event.options.path}`)
			},
		},
		/*
		 *  TIMELINE CONTROLS
		 */
		timeline_action: {
			name: 'Timeline: Action',
			description: 'Trigger an action on specified timeline(s)',
			options: [
				{
					id: 'timeline_all',
					type: 'checkbox',
					label: 'All Timelines?',
					default: false,
				},
				{
					id: 'timeline_id',
					type: 'textinput',
					label: 'Timeline ID',
					isVisible: (options) => {
						return !options.timeline_all
					},
					default: '0',
				},
				{
					id: 'timeline_action',
					type: 'dropdown',
					label: 'Select Action',
					choices: [
						{ id: 'play', label: 'Play' },
						{ id: 'stop', label: 'Stop' },
						{ id: 'reset', label: 'Reset' },
						{ id: 'mute', label: 'Mute' },
						{ id: 'unmute', label: 'Unmute' },
						{ id: 'gonextcue', label: 'Go Next Cue' },
						{ id: 'gopreviouscue', label: 'Go Previous Cue' },
						{ id: 'gocue', label: 'Go Cue' },
					],
					default: 'play',
				},
				{
					id: 'and_then',
					type: 'dropdown',
					label: 'And then...?',
					choices: [
						{ id: 'play', label: 'Play' },
						{ id: 'stop', label: 'Stop' },
					],
					default: 'play',
					isVisible: (options) => {
						return ['gocue', 'gonextcue', 'gopreviouscue'].includes(options.timeline_action)
					},
				},
				{
					id: 'cue_number',
					type: 'textinput',
					label: 'Cue Number',
					isVisible: (options) => {
						return options.timeline_action == 'gocue'
					},
					default: 0,
				},
			],
			callback: async (event) => {
				let timeline_id = event.options.timeline_id

				if (event.options.timeline_all) {
					timeline_id = 'all'
				}

				let endpoint = `/timelines/${timeline_id}/${event.options.timeline_action}`
				self.log('error', `endpoint= ${endpoint}`)

				if (event.options.timeline_action == 'gocue') {
					endpoint += `/${event.options.cue_number}`
				}

				await self.sendGetRequest(endpoint)

				if (['gocue', 'gonextcue', 'gopreviouscue'].includes(event.options.timeline_action)) {
					await self.sendGetRequest(`/timelines/${timeline_id}/${event.options.and_then}`)
				}
			},
		},
		timeline_timecode: {
			name: 'Timeline: Global Timecode',
			description: 'Set TimelinePlus component global timecode state',
			options: [
				{
					id: 'timeline_tc',
					type: 'checkbox',
					label: 'Enable',
					default: false,
				},
			],
			callback: async (event) => {
				let state = 0
				if (event.options.timeline_tc) {
					state = 1
				}
				await self.sendGetRequest(`/pin/setvalue/TimeLinePlus_TimelinePlus_EnableTimecode/${state}`)
			},
		},
	})
}
