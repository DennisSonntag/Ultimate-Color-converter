import { ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

import { cmykaReg, cmykaToHex, cmykReg, cmykToHex, hexAlphaToHex, hexaReg, hexReg, hslaReg, hslaToHex, hslReg, hslToHex, labReg, labToHex, rgbaReg, rgbaToHex, rgbReg, rgbToHex } from './util';

type PropTypes = {
	format: string;
	color: string;
	setColor: Dispatch<SetStateAction<string>>;
};

const Color: FC<PropTypes> = ({ format, color, setColor }) => {
	const [colorHex, setColorHex] = useState('');
	const handleChangeTest = (e: ChangeEvent<HTMLInputElement> | string) => {
		if (e instanceof Event && e.target instanceof HTMLInputElement) {
			const { value } = e.target;
			setColorHex(value);
			setColor(value);
		} else if (typeof e === 'string') {
			setColorHex(e);
			setColor(e);
		}
	};

	useEffect(() => {
		setColorHex(color);
	}, [color]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.currentTarget;

		switch (value) {
			case 'hex':
				if (hexReg.test(value) || value.length <= '#ffffff'.length) {
					setColor(value);
				}
				break;
			case 'hexa':
				if (hexaReg.test(value) || value.length <= '#ffffff00'.length) {
					setColor(value);
					setColorHex(hexAlphaToHex(value));
				}
				break;
			case 'rgb':
				if (rgbReg.test(value) || value.length <= 'rgb(255, 255, 255)'.length) {
					setColor(value);
					setColorHex(rgbToHex(value));
				}
				break;
			case 'rgba':
				if (rgbaReg.test(value) || value.length <= 'rgba(255, 255, 255,100)'.length) {
					setColor(value);
					setColorHex(rgbaToHex(value));
				}
				break;
			case 'hsl':
				if (hslReg.test(value) || value.length <= 'hsl(255%, 255%, 255%)'.length) {
					setColor(value);
					setColorHex(hslToHex(value));
				}
				break;
			case 'hsla':
				if (hslaReg.test(value) || value.length <= 'hsla(255%, 255%, 255%,100)'.length) {
					setColor(value);
					setColorHex(hslaToHex(value));
				}
				break;
			case 'cmyk':
				if (cmykReg.test(value) || value.length <= 'cmyk(100, 100, 100, 100)'.length) {
					setColor(value);
					setColorHex(cmykToHex(value));
				}
				break;
			case 'cmyka':
				if (cmykaReg.test(value) || value.length <= 'cmyka(100, 100, 100, 100,100)'.length) {
					setColor(value);
					setColorHex(cmykaToHex(value));
				}
				break;
			case 'lab':
				if (labReg.test(value) || value.length <= 'Lab(60.32,-34.13,57.45)'.length + 2) {
					setColor(value);
					setColorHex(labToHex(value));
				}
				break;
			default:
				setColor(value);
				break;
		}
	};
	return (
		<div className="w-fit h-fit relative">
			<HexColorPicker className="border-white border-solid border-2 rounded-lg" color={colorHex} onChange={handleChangeTest} />
			<h1 className="text-center font-extrabold text-white text-2xl">{format}</h1>
			<input onChange={handleChangeTest} type="text" name="color" value={color} />
		</div>
	);
};

export default Color;
