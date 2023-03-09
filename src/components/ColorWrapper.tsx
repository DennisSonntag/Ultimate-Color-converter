import { FC, useState } from 'react';

import Color from './Color';

type PropTypes = {
	colors: string[];
};

const ColorWrapper: FC<PropTypes> = ({ colors }) => {
	const [color, setColor] = useState('');
	return (
		<div className="w-fit h-fit grid grid-cols-4 auto-rows-fr absolute inset-0 m-auto gap-4">
			{colors.map(elm => (
				<Color format={elm} color={color} setColor={setColor} />
			))}
		</div>
	);
};

export default ColorWrapper;
