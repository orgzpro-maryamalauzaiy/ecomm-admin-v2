import { useState } from "react";
import { CheckmarkOutline, CloseOutline } from "react-ionicons";
// import supabase from "configs/supabase";
// import { ColumnData } from "../types";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_SERVER_MODE === 'development' ? import.meta.env.VITE_DEV_URL : import.meta.env.VITE_PROD_URL

// const ORGZ_ID = process.env.REACT_APP_ORGZ_ID

let datas = []

await axios.get(`${BASE_URL}/balances/flows`, {withCredentials: true})
						.then(result => {
							console.log('result', result)
							if(result.status === 200){
								datas = result.data.data
							}
						})

// const { data: categorys, error } = await supabase
// 									.from('orgz_categorys')
// 									.select('id,type,title,slug,thumbnail,price,views,rating,subcategory_id,promote_text,description, orgz_subcategory(name, code)')
// 									.eq('orgz_id', ORGZ_ID)
// 									.eq('type', 'classes')

// if(categorys && categorys.length > 0){
// 	console.log('categorys--', categorys)

// 	datas = categorys.map(category => {return {id: category.id, type: category.type, title: category.title, slug: category.slug, thumbnail: category.thumbnail, price: category.price, views: category.views, rating:category.rating, subcategory_id: category.subcategory_id, subcategory_code: category.orgz_subcategory.code, subcategory_name: category.orgz_subcategory.name}})

// 	console.log('categorys-', datas)
// }else{
// 	// setError(true)
// 	// setErrorMessage(error)
// 	toast('Error retrive data from server.')
// }
// const types = datas['type']

// console.log('types', types)

export const data= {
	'No.': {
		values: datas?.map(category => category.id),
		classNames: (value) =>
			value === "Jane Smith" || value === "Emma Martinez"
				? "text-green-400 font-medium"
				: "text-white",
	},
	'Nama': {
		values: datas?.map(category => category.name),
		renderValue: (value) => {
					return (
						// <div className='font-medium'>
							<Link to={`/admin/balances/${datas.map(category => category.id)}`}>{value}</Link>
						// </div>
					)
				}
	},
	Parent: {
		values: datas?.map(category => category.parent_category_name),
		classNames: (value) =>
			typeof value === "string" && value.includes("john")
				? "text-green-400 font-medium"
				: "text-white",
	},
	// ToggleEventhumbnail: {
	// 	values: datas.map(category => category.type),
	// },
	// Price: {
	// 	values: datas.map(category => category.price),
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
	// 	values: datas.map(category => category.views),
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
	// 	values: datas.map(category => category.thumbnail || ''),
	// 	renderValue: (value) =>
	// 		<img src={value} className='rounded rounded-sm' width='200px' ></img>
	// 		// value ? (
	// 		// 	<CheckmarkOutline
	// 		// 		cssClasses={"!text-green-400"}
	// 		// 		width={"30px"}
	// 		// 		height={"30px"}
	// 		// 	/>
	// 		// )
	// 		// : (
	// 		// 	<CloseOutline
	// 		// 		cssClasses={"!text-red-400"}
	// 		// 		width={"30px"}
	// 		// 		height={"30px"}
	// 		// 	/>
	// 		// ),
	// },
	// Subcategory: {
	// 	values: datas.map(category => category.subcategory_name || '-'),
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