export default defineContentScript({
    matches: ['http://*/*', 'https://*/*'],
    run_at: 'document_start',
    all_frames: true,
    world: 'MAIN',

    main: () => {
        // --- WebGL Fingerprinting Protection ---
        function patchWebGLContextPrototype(proto) {
            if (!proto) return;

            // Patch getParameter
            const origGetParameter = proto.getParameter;
            if (origGetParameter) {
                Object.defineProperty(proto, "getParameter", {
                    value: function(param) {
                        const spoofedParams = {
                            37445: "Sentinel", // UNMASKED_VENDOR_WEBGL
                            37446: "Sentinel", // UNMASKED_RENDERER_WEBGL
                            3379: 4096,        // MAX_TEXTURE_SIZE
                            36347: 4096,       // MAX_RENDERBUFFER_SIZE
                            34076: 16,         // MAX_VERTEX_ATTRIBS
                        };
                        if (param in spoofedParams) {
                            return spoofedParams[param];
                        }
                        const value = origGetParameter.apply(this, arguments);
                        if (typeof value === "number" && [3379, 36347, 34076].includes(param)) {
                            return value + Math.floor(Math.random() * 3) - 1; // ±1 noise
                        }
                        return value;
                    },
                    configurable: true,
                    writable: true
                });
            }

            // Patch getSupportedExtensions
            const origGetSupportedExtensions = proto.getSupportedExtensions;
            if (origGetSupportedExtensions) {
                Object.defineProperty(proto, "getSupportedExtensions", {
                    value: function() {
                        const exts = origGetSupportedExtensions.apply(this, arguments);
                        if (Array.isArray(exts)) {
                            return exts.slice().sort(() => Math.random() - 0.5);
                        }
                        return exts;
                    },
                    configurable: true,
                    writable: true
                });
            }

            // Patch readPixels
            const origReadPixels = proto.readPixels;
            if (origReadPixels) {
                Object.defineProperty(proto, "readPixels", {
                    value: function(...args) {
                        // Call the original method
                        origReadPixels.apply(this, args);

                        // WebGL1: readPixels(x, y, w, h, format, type, pixels)
                        // WebGL2: readPixels(x, y, w, h, format, type, offset)
                        // We only want to add noise to the buffer (pixels argument)
                        let pixels = args[6] || args[5];
                        if (pixels && typeof pixels.length === "number") {
                            for (let i = 0; i < pixels.length; i += 50) {
                                pixels[i] = Math.max(0, Math.min(255, pixels[i] + Math.floor(Math.random() * 3) - 1));
                            }
                        }
                    },
                    configurable: true,
                    writable: true
                });
            }
        }

        function patchWebGLPrototypes(win) {
            try {
                // Patch WebGLRenderingContext (WebGL1)
                patchWebGLContextPrototype(win.WebGLRenderingContext && win.WebGLRenderingContext.prototype);

                // Patch WebGL2RenderingContext (WebGL2)
                patchWebGLContextPrototype(win.WebGL2RenderingContext && win.WebGL2RenderingContext.prototype);

                // Patch HTMLCanvasElement.getContext to always return patched contexts
                const origGetContext = win.HTMLCanvasElement && win.HTMLCanvasElement.prototype.getContext;
                if (origGetContext) {
                    Object.defineProperty(win.HTMLCanvasElement.prototype, "getContext", {
                        value: function(type, ...args) {
                            const ctx = origGetContext.apply(this, [type, ...args]);
                            return ctx;
                        },
                        configurable: true,
                        writable: true
                    });
                }
            } catch (e) {
                // Ignore errors
            }
        }

        // Patch WebGL APIs in the current document
        patchWebGLPrototypes(window);

        // Also patch all same-origin iframes as soon as possible
        function patchAllIframesWebGL() {
            for (const iframe of document.getElementsByTagName('iframe')) {
                try {
                    if (!iframe.contentWindow) continue;
                    patchWebGLPrototypes(iframe.contentWindow);
                } catch (e) {
                    // Ignore cross-origin or inaccessible iframes
                }
            }
        }
        document.addEventListener('DOMContentLoaded', patchAllIframesWebGL);
        const observerWebGL = new MutationObserver(patchAllIframesWebGL);
        observerWebGL.observe(document.documentElement, {childList: true, subtree: true});

        console.log('[Sentinel] WebGL fingerprinting protection active');

    }
});