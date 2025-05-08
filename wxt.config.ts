import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
	extensionApi: "webextension-polyfill",
	modules: ['@wxt-dev/module-react'],
	manifest: {
		permissions: [
			'declarativeNetRequest',
			'declarativeNetRequestFeedback',
			'declarativeNetRequestWithHostAccess',
			'activeTab',
			'scripting',
			'storage'
		],
		description: 'A browser extension that blocks ads and trackers.',
		name: 'Sentinel',
		host_permissions: [
			"<all_urls>",
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
		options_ui: {
			page: 'options/index.html',
			open_in_tab: true,
		}
	},
});
