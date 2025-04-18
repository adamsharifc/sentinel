export default defineContentScript({
    matches: ['http://*/*', 'https://*/*'],
    run_at: 'document_start',
    all_frames: true,
    world: 'MAIN',

    main: async (ctx) => {
        console.log("Sentinel fingerprint protection loaded");

        // Patch canvas APIs in the current document
        patchCanvasPrototypes(window);

        // Also patch all same-origin iframes as soon as possible
        function patchAllIframes() {
            for (const iframe of document.getElementsByTagName('iframe')) {
                try {
                    if (!iframe.contentWindow) continue;
                    patchCanvasPrototypes(iframe.contentWindow);
                } catch (e) {
                    // Ignore cross-origin or inaccessible iframes
                }
            }
        }

        // Patch on DOMContentLoaded and whenever new iframes are added
        document.addEventListener('DOMContentLoaded', patchAllIframes);
        const observer = new MutationObserver(patchAllIframes);
        observer.observe(document.documentElement, {childList: true, subtree: true});

        // The actual patching function
        function patchCanvasPrototypes(win) {
            try {
                const noise = {
                    r: Math.floor(Math.random() * 10) - 5,
                    g: Math.floor(Math.random() * 10) - 5,
                    b: Math.floor(Math.random() * 10) - 5
                };

                function addNoise(imageData) {
                    if (!imageData || !imageData.data) return imageData;
                    const data = imageData.data;
                    const step = Math.max(50, Math.floor(data.length / 400));
                    for (let i = 0; i < data.length; i += step) {
                        if (i + 3 < data.length) {
                            data[i] = Math.max(0, Math.min(255, data[i] + noise.r));
                            data[i+1] = Math.max(0, Math.min(255, data[i+1] + noise.g));
                            data[i+2] = Math.max(0, Math.min(255, data[i+2] + noise.b));
                        }
                    }
                    return imageData;
                }

                const getImageData = win.CanvasRenderingContext2D.prototype.getImageData;
                Object.defineProperty(win.CanvasRenderingContext2D.prototype, "getImageData", {
                    value: function () {
                        const imageData = getImageData.apply(this, arguments);
                        addNoise(imageData);
                        return imageData;
                    },
                    configurable: true,
                    writable: true
                });

                const toDataURL = win.HTMLCanvasElement.prototype.toDataURL;
                Object.defineProperty(win.HTMLCanvasElement.prototype, "toDataURL", {
                    value: function () {
                        const ctx = this.getContext('2d');
                        if (ctx && this.width && this.height) {
                            try {
                                const imageData = ctx.getImageData(0, 0, this.width, this.height);
                                addNoise(imageData);
                                ctx.putImageData(imageData, 0, 0);
                            } catch (e) {}
                        }
                        return toDataURL.apply(this, arguments);
                    },
                    configurable: true,
                    writable: true
                });

                const toBlob = win.HTMLCanvasElement.prototype.toBlob;
                Object.defineProperty(win.HTMLCanvasElement.prototype, "toBlob", {
                    value: function () {
                        const ctx = this.getContext('2d');
                        if (ctx && this.width && this.height) {
                            try {
                                const imageData = ctx.getImageData(0, 0, this.width, this.height);
                                addNoise(imageData);
                                ctx.putImageData(imageData, 0, 0);
                            } catch (e) {}
                        }
                        return toBlob.apply(this, arguments);
                    },
                    configurable: true,
                    writable: true
                });
            } catch (e) {
                // Ignore errors (e.g., if win is not accessible)
            }
        }

        console.log('[Sentinel] Canvas protection active (property-based)');
    }
});