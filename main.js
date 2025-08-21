const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./src/upgrades')
const UpdateActions = require('./src/actions')
const UpdateFeedbacks = require('./src/feedbacks')
const UpdateVariableDefinitions = require('./src/variables')
const requests = require('./src/requests')
const utils = require('./src/utils')
const commands = require('./src/commands')

class HippotizerRestInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

        Object.assign(this, {
            ...requests,
            ...utils,
            ...commands
        })
        this.isBusy = {}
	}

	async init(config) {
		this.config = config

		this.updateStatus(InstanceStatus.Ok)

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'static-text',
                label: 'Information',
				id: 'info',
				width: 12,
                value: 'Interfaces with the Hippotizer REST component. Add the REST API component in Hippotizer.',
			},
			{
				type: 'static-text',
                label: 'Supports Hippotizer v4.7.1 or later',
				id: 'info',
				width: 12,
			},
			{
				type: 'textinput',
				id: 'ip',
				label: 'Target IP',
                default: '127.0.0.1',
				width: 8,
				regex: Regex.IP,
			}
		]
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}
}

runEntrypoint(HippotizerRestInstance, UpgradeScripts)
