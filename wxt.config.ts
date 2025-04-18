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
			'webRequest',
			'activeTab',
			'scripting',
		],
		description: 'A browser extension that blocks ads and trackers.',
		name: 'Sentinel',
		content_scripts: [
			{
				matches: ['<all_urls>'],
				js: [
					'./content-scripts/fingerprintBlocking.js',
					'./content-scripts/audioFingerprintBlocking.js',
					'./content-scripts/webglFingerprintBlocking.js',
				],
				run_at: 'document_start',
				all_frames: true,
				world: 'MAIN',
			},
		],
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
	},
});
