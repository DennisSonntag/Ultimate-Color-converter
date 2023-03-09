/* eslint-disable no-bitwise */

export const hexReg = /^#?([0-9A-F]{3}){1,2}$/i;
export const hexaReg = /^#?([0-9A-F]{4}|[0-9A-F]{8})$/i;
export const rgbReg = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i;
export const rgbaReg = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([01](\.\d+)?)\s*\)$/i;
export const hslReg = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i;
export const hslaReg = /^hsla\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*([01](\.\d+)?)\s*\)$/i;
export const labReg = /^lab\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)$/i;
export const cmykReg = /^cmyk\(\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i;
export const cmykaReg = /^cmyk\(\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*([01](\.\d+)?)\s*\)$/i;

export const rgbToHex = (rgb: string): string => {
	// Extract the red, green, and blue values from the string
	const values = rgb.substring(rgb.indexOf('(') + 1, rgb.lastIndexOf(')')).split(',');
	const r = parseInt(values[0].trim(), 10);
	const g = parseInt(values[1].trim(), 10);
	const b = parseInt(values[2].trim(), 10);

	// Convert the RGB values to a hex string
	const hex = ((r << 16) | (g << 8) | b).toString(16).toUpperCase().padStart(6, '0');

	return `#${hex}`;
};

export const hexAlphaToHex = (hexAlpha: string): string => {
	return hexAlpha.replace(/^#?([0-9a-f]{4}|[0-9a-f]{8})$/i, (_match, hex) => {
		if (hex.length === 4) {
			hex = hex
				.split('')
				.map((c: any) => c + c)
				.join('');
		}
		const alpha = Math.round((parseInt(hex.slice(6), 16) / 255) * 100);
		return `#${hex.slice(0, 6)}${alpha.toString(16).padStart(2, '0')}`;
	});
};

export const rgbaToHex = (rgba: string): string => {
	const match = rgba.match(rgbaReg);
	if (!match) {
		throw new Error('Invalid RGBA color format');
	}
	const [, r, g, b, a] = match.map(n => parseInt(n, 10));
	return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}${Math.round(a * 255)
		.toString(16)
		.padStart(2, '0')}`;
};

export const hslToHex = (hsl: string): string => {
	// Extract the hue, saturation, and lightness values from the string
	const values = hsl.substring(hsl.indexOf('(') + 1, hsl.lastIndexOf(')')).split(',');
	const h = parseInt(values[0].trim(), 10);
	const s = parseInt(values[1].trim(), 10);
	const l = parseInt(values[2].trim(), 10);

	// Convert the HSL values to RGB values
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l - c / 2;

	let r = 0;
	let g = 0;
	let b = 0;
	if (h >= 0 && h < 60) {
		r = c;
		g = x;
		b = 0;
	} else if (h >= 60 && h < 120) {
		r = x;
		g = c;
		b = 0;
	} else if (h >= 120 && h < 180) {
		r = 0;
		g = c;
		b = x;
	} else if (h >= 180 && h < 240) {
		r = 0;
		g = x;
		b = c;
	} else if (h >= 240 && h < 300) {
		r = x;
		g = 0;
		b = c;
	} else if (h >= 300 && h < 360) {
		r = c;
		g = 0;
		b = x;
	}

	// Convert the RGB values to a hex string
	const hex = ((((r + m) * 255) << 16) | (((g + m) * 255) << 8) | ((b + m) * 255)).toString(16).toUpperCase().padStart(6, '0');

	return `#${hex} `;
};

export function hslaToHex(hslaColor: string): string {
	// Extract the HSLA components from the string
	const hslaRegex = /^hsla\((\d+),\s*(\d+)%,\s*(\d+)%,\s*(\d+)\)$/;
	const match = hslaRegex.exec(hslaColor);

	if (!match) {
		throw new Error('Invalid HSLA color string');
	}

	const h = parseInt(match[1], 10);
	const s = parseInt(match[2], 10) / 100;
	const l = parseInt(match[3], 10) / 100;

	// Convert HSLA to RGBA
	let r;
	let g;
	let b;
	if (s === 0) {
		r = l;
		g = l;
		b = l;
	} else {
		const hue2rgb = (p: number, q: number, t: number) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h / 360 + 1 / 3);
		g = hue2rgb(p, q, h / 360);
		b = hue2rgb(p, q, h / 360 - 1 / 3);
	}

	// Convert RGBA to hex
	const toHex = (num: number) => {
		const hex = num.toString(16);
		return hex.length === 1 ? `0${hex}` : hex;
	};
	const hex = `#${toHex(Math.round(r * 255))}${toHex(Math.round(g * 255))}${toHex(Math.round(b * 255))}`;

	return hex;
}

export const cmykToHex = (cmyk: string): string => {
	// Extract the cyan, magenta, yellow, and black values from the string
	const values = cmyk.substring(cmyk.indexOf('(') + 1, cmyk.lastIndexOf(')')).split(',');
	const c = parseFloat(values[0].trim());
	const m = parseFloat(values[1].trim());
	const y = parseFloat(values[2].trim());
	const k = parseFloat(values[3].trim());

	// Convert the CMYK values to RGB values
	const r = Math.round(255 * (1 - c) * (1 - k));
	const g = Math.round(255 * (1 - m) * (1 - k));
	const b = Math.round(255 * (1 - y) * (1 - k));

	// Convert the RGB values to a hex string
	const hex = ((r << 16) | (g << 8) | b).toString(16).toUpperCase().padStart(6, '0');

	return `#${hex} `;
};

export const cmykaToHex = (cmykaString: string): string => {
	// Extract the CMYKA values from the input string
	const cmyka = cmykaString.split(',').map(parseFloat);

	// Convert CMYKA to RGBA
	const [c, m, y, k] = cmyka;
	const r = (1 - c) * (1 - k);
	const g = (1 - m) * (1 - k);
	const b = (1 - y) * (1 - k);

	// Convert RGBA to hex
	const hex = `#${((1 << 24) + (Math.round(r * 255) << 16) + (Math.round(g * 255) << 8) + Math.round(b * 255)).toString(16).slice(1)}`;

	return hex;
};

export const labToHex = (labColor: string): string => {
	// Extract the L, a, and b values from the input string
	const [L, a, b] = labColor.split(/[,()]/).slice(1, 4).map(parseFloat);

	// Convert Lab values to XYZ values
	const Y = (L + 16) / 116;
	const X = a / 500 + Y;
	const Z = Y - b / 200;

	const XYZToRGB = (valueArg: number): number => {
		const v = valueArg > 0.206893034 ? valueArg ** 3 : (valueArg - 16 / 116) / 7.787037;
		return Math.round(v * 255);
	};

	// Convert XYZ values to RGB values
	const R = XYZToRGB(3.2406 * X - 1.5372 * Y - 0.4986 * Z);
	const G = XYZToRGB(-0.9689 * X + 1.8758 * Y + 0.0415 * Z);
	const B = XYZToRGB(0.0557 * X - 0.204 * Y + 1.057 * Z);

	// Convert RGB values to hex code
	const componentToHex = (component: number): string => {
		const hex = component.toString(16);
		return hex.length === 1 ? `0${hex}` : hex;
	};
	const hexCode = `#${componentToHex(R)}${componentToHex(G)}${componentToHex(B)}`;

	return hexCode;
};
