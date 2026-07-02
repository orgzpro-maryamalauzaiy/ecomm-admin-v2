import { useState } from "react";
import { CheckmarkOutline, CloseOutline } from "react-ionicons";
// import supabase from "configs/supabase";
// import { ColumnData } from "../types";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_SERVER_MODE === 'development' ? import.meta.env.VITE_DEV_URL : import.meta.env.VITE_PROD_URL

// const ORGZ_ID = process.env.REACT_APP_ORGZ_ID

let datas = []

	await axios.get(`${BASE_URL}/orders`)
						.then(result => {
							console.log(result)
							if(result.status === 200){
								datas = result.data.data
							}
						})
						.catch(error => {
							toast.error('Error! Error get products')
						})


// const { data: orderss, error } = await supabase
// 									.from('orgz_orderss')
// 									.select('id,type,title,slug,thumbnail,price,views,rating,subcategory_id,promote_text,description, orgz_subcategory(name, code)')
// 									.eq('orgz_id', ORGZ_ID)
// 									.eq('type', 'classes')

// if(orderss && orderss.length > 0){
// 	console.log('orderss--', orderss)

// 	datas = orderss.map(orders => {return {id: orders.id, type: orders.type, title: orders.title, slug: orders.slug, thumbnail: orders.thumbnail, price: orders.price, views: orders.views, rating:orders.rating, subcategory_id: orders.subcategory_id, subcategory_code: orders.orgz_subcategory.code, subcategory_name: orders.orgz_subcategory.name}})

// 	console.log('orderss-', datas)
// }else{
// 	// setError(true)
// 	// setErrorMessage(error)
// 	toast('Error retrive data from server.')
// }
// const types = datas['type']

// console.log('types', types)

export const data= {
	'No.': {
		values: datas && datas.map(orders => orders.id),
		classNames: (value) =>
			value === "Jane Smith" || value === "Emma Martinez"
				? "text-green-400 font-medium"
				: "text-white",
	},
	'No. Order': {
		values: datas && datas.map(orders => orders.invoice_number),
		classNames: (value) =>
			value === "Jane Smith" || value === "Emma Martinez"
				? "text-green-400 font-medium"
				: "text-white",
	},
	Price: {
		values: datas && datas.map(orders => orders.total_price),
		renderValue: (value) => {
					return (
						// <div className='font-medium'>
							<Link to={`/admin/classes/${datas.map(orders => orders.id)}`}>{value}</Link>
						// </div>
					)
				}
	},
	'Status Pesanan': {
		values: datas && datas.map(orders => '/' +orders.order_status),
		classNames: (value) =>
			typeof value === "string" && value.includes("john")
				? "text-green-400 font-medium"
				: "text-white",
	},
	// ToggleEventhumbnail: {
	// 	values: datas.map(orders => orders.type),
	// },
	// Price: {
	// 	values: datas.map(orders => orders.price),
	// 	renderValue: (value) => {
	// 		if (typeof value === "number") {
	// 			return (
	// 				<div className={`font-medium ${value > 8000 ? "text-green-400" : "text-red-400"}`}>
	// 					${value.toLocaleString()}
	// 				</div>
	// 			);
	// 		}
	// 		return value;
	// 	},
	// },
	// Views: {
	// 	values: datas.map(orders => orders.views),
	// 	renderBoolean: (value) =>
	// 		value ? (
	// 			<CheckmarkOutline
	// 				cssClasses={"!text-green-400"}
	// 				width={"30px"}
	// 				height={"30px"}
	// 			/>
	// 		) : (
	// 			<CloseOutline
	// 				cssClasses={"!text-red-400"}
	// 				width={"30px"}
	// 				height={"30px"}
	// 			/>
	// 		),
	// },
	// Thumbnail: {
	// 	values: datas.map(orders => orders.thumbnail || ''),
	// 	renderValue: (value) =>
	// 		<img src={value} className='rounded rounded-sm' width='200px' ></img>
			// value ? (
			// 	<CheckmarkOutline
			// 		cssClasses={"!text-green-400"}
			// 		width={"30px"}
			// 		height={"30px"}
			// 	/>
			// )
			// : (
			// 	<CloseOutline
			// 		cssClasses={"!text-red-400"}
			// 		width={"30px"}
			// 		height={"30px"}
			// 	/>
			// ),
	// },
	// Subcategory: {
	// 	values: datas.map(orders => orders.subcategory_name || '-'),
	// 	renderBoolean: (value) =>
	// 		value ? (
	// 			<CheckmarkOutline
	// 				cssClasses={"!text-green-400"}
	// 				width={"30px"}
	// 				height={"30px"}
	// 			/>
	// 		) : (
	// 			<CloseOutline
	// 				cssClasses={"!text-red-400"}
	// 				width={"30px"}
	// 				height={"30px"}
	// 			/>
	// 		),
	// }
};