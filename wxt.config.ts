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
				{
					id: 'advert-dnr',
					path: 'advert-dnr.json',
					enabled: true,
				},
				{
					id: 'tracker-dnr',
					path: 'tracker-dnr.json',
					enabled: true,
				},
				{
					id: 'social-dnr',
					path: 'social-dnr.json',
					enabled: true,
				}
			],
		},
	},
});
