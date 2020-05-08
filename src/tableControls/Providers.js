import React from "react";
import {DataTypeProvider} from "@devexpress/dx-react-grid";

export const CurrencyTypeProvider = props => (
	<DataTypeProvider
		formatterComponent={CurrencyFormatter}
		{...props}
	/>
);

const CurrencyFormatter = ({value}) => (
	<text style={{color: 'black'}}>
		{value.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
	</text>
);
