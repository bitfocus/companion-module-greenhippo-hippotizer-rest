const request = require('request')
const { InstanceStatus } = require('@companion-module/base')

const timeoutMs = 2000
const port = 40512

function logStatusCodeMsg(statusCode) {
	msg = ''
	switch (statusCode) {
		case 400:
			msg += '(Pin path was incorrectly or badly formed)'
			break
		case 404:
			msg += '(Could not find the pin on remote host)'
			break
		case 500:
			msg += '(Server error while setting pin value)'
			break
		default:
			msg += ' (' + result.statusCode + ': ' + result.text + ')'
	}
	return msg
}

exports.sendGetRequest = function (patch) {
	let self = this

	return new Promise(function (resolve, reject) {
		// Call the api endpoint to get the state.
		const options = {
			method: 'GET',
			url: 'http://' + self.config.ip + ':' + port + patch,
			timeout: timeoutMs,
			headers: {
				'Content-type': 'application/json',
			},
		}

		request(options, function (err, result, body) {
			self.handleResponse(err, result)
			if (result === undefined) {
				return reject()
			} else {
				return resolve(body)
			}
		})
	})
}

exports.handleResponse = function (err, result) {
	const self = this

	// Check if request was unsuccessful.
	if (err !== null || result.statusCode !== 200) {
		let msg = 'HTTP Request for ' + self.config.ip + ' failed '
		if (err !== null) {
			msg += ' (' + err + ')'
		} else {
			msg += logStatusCodeMsg(result.statusCode)
		}
		self.log('error', msg)
		self.updateStatus(InstanceStatus.ConnectionFailure, msg)
	}

	// Made a successful request.
	else {
		self.log('debug', 'HTTP request success')
		self.updateStatus(InstanceStatus.Ok)
	}
}
