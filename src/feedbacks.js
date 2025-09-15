const { combineRgb } = require('@companion-module/base')

module.exports = async function (self) {
	self.setFeedbackDefinitions({
		// ChannelState: {
		// 	name: 'AutoPlay',
		// 	type: 'boolean',
		// 	label: 'MediaPlayer State',
		// 	defaultStyle: {
		// 		bgcolor: combineRgb(255, 0, 0),
		// 		color: combineRgb(0, 0, 0),
		// 	},
		// 	options: [
		// 		{
		// 			id: 'mix',
		// 			type: 'number',
		// 			label: 'Mix',
		// 			default: 1,
		// 			min: 1,
		// 		},
		// 		{
		// 			id: 'layer',
		// 			type: 'number',
		// 			label: 'Layer',
		// 			default: 1,
		// 			min: 1,
		// 		},
		// 	],
		// 	callback: (feedback) => {
		// 		return self.isBusyLayer[feedback.options.mix][feedback.options.layer]
		//     }
		// },
	})
}
