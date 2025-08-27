import { defineConfig, type UserManifest } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
	modules: ['@wxt-dev/module-react'],
	manifest: ({ browser, manifestVersion }) => {
		const manifest: UserManifest = {
			permissions: [
				'activeTab',
				'scripting',
				'storage',
			],
			host_permissions: ['<all_urls>'],
			description: 'A browser extension that blocks ads and trackers.',
			name: 'Sentinel',
			options_ui: {
				page: 'options/index.html',
				open_in_tab: true,
			},
			...(browser !== 'firefox'
				? {
						permissions: [
							'activeTab',
							'scripting',
							'storage',
							'declarativeNetRequest',
							'declarativeNetRequestFeedback',
							'declarativeNetRequestWithHostAccess',
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
								},
							],
						},
					}
				: {}),
		};

		if (browser === 'firefox') {
			manifest.permissions?.push('webRequest', 'webRequestBlocking');
			manifest.host_permissions = ['<all_urls>'];
		}

		return manifest;
	},
});