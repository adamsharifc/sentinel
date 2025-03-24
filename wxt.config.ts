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
			'webRequest',
			'activeTab'
		],
		declarative_net_request: {
			rule_resources: [
			// {
			// 	id: 'ruleset_1',
			// 	path: 'rules.json',
			// 	enabled: true,
			// },
			// {
			// 	id: 'advert_rules_1',
			// 	path: 'advert_rules_1.json',
			// 	enabled: true,
			// },
			// {
			// 	id: 'advert_rules_2',
			// 	path: 'advert_rules_2.json',
			// 	enabled: true,
			// },
			// {
			// 	id: 'tracking_rules_1',
			// 	path: 'tracking_rules_1.json',
			// 	enabled: true,
			// },
			// {
			// 	id: 'tracking_rules_2',
			// 	path: 'tracking_rules_2.json',
			// 	enabled: true,
			// }
			// {
			// 	id: "ruleset_1",
			// 	path: "advert.json",
			// 	enabled: true,
			// }
			],
		},
	},
});
