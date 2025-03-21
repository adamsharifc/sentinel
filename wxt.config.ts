import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
	extensionApi: 'chrome',
	modules: ['@wxt-dev/module-react'],
	manifest: {
		permissions: [
			'storage', 
			'declarativeNetRequest',
			'declarativeNetRequestFeedback',
			'declarativeNetRequestWithHostAccess',
			''
		],
		declarative_net_request: {
			rule_resources: [
			{
				id: 'ruleset_1',
				path: 'rules.json',
				enabled: true,
			},
			],
		},
	},
});
