export default defineContentScript({
    matches: ['http://*/*', 'https://*/*'],
    run_at: 'document_start',
    all_frames: true,
    world: 'MAIN',

    main: () => {

        // Patch CanvasRenderingContext2D.measureText
        if (window.CanvasRenderingContext2D) {
            const origMeasureText = CanvasRenderingContext2D.prototype.measureText;
            Object.defineProperty(CanvasRenderingContext2D.prototype, "measureText", {
                value: function(text) {
                    const metrics = origMeasureText.apply(this, arguments);
                    // Add small random noise to width
                    if (metrics && typeof metrics.width === "number") {
                        metrics.width += (Math.random() - 0.5) * 0.01; // ±0.005 px noise
                    }
                    return metrics;
                },
                configurable: true,
                writable: true
            });
        }

        // Patch HTMLElement.offsetWidth/offsetHeight for font detection via DOM
        function patchOffsetDimension(proto, prop) {
            const orig = Object.getOwnPropertyDescriptor(proto, prop);
            if (orig && orig.get) {
                Object.defineProperty(proto, prop, {
                    get: function() {
                        const value = orig.get.call(this);
                        // Add small noise only for elements likely used in font probing
                        if (this && this.style && this.style.fontFamily) {
                            return value + (Math.random() - 0.5) * 0.5; // ±0.25 px noise
                        }
                        return value;
                    },
                    configurable: true
                });
            }
        }
        patchOffsetDimension(HTMLElement.prototype, "offsetWidth");
        patchOffsetDimension(HTMLElement.prototype, "offsetHeight");

        // Patch getComputedStyle for font-family
        const origGetComputedStyle = window.getComputedStyle;
        window.getComputedStyle = function(element, pseudoElt) {
            const style = origGetComputedStyle.apply(this, arguments);
            if (style && typeof style.getPropertyValue === "function") {
                const origGetPropertyValue = style.getPropertyValue;
                style.getPropertyValue = function(prop) {
                    if (prop === "font-family") {
                        // Optionally spoof font-family
                        return "Sentinel, Arial, sans-serif";
                    }
                    return origGetPropertyValue.apply(this, arguments);
                };
            }
            return style;
        };

        console.log('[Sentinel] Font fingerprinting protection active');
    }
});