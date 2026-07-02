import { useState } from "react";
import { CheckmarkOutline, CloseOutline } from "react-ionicons";
// import supabase from "configs/supabase";
// import { ColumnData } from "../types";
import axios from 'axios'
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_SERVER_MODE === 'development' ? import.meta.env.VITE_DEV_URL : import.meta.env.VITE_PROD_URL

// const ORGZ_ID = process.env.REACT_APP_ORGZ_ID

let datas = []


// const { data: customerss, error } = await supabase
// 									.from('orgz_customerss')
// 									.select('id,type,title,slug,thumbnail,price,views,rating,subcategory_id,promote_text,description, orgz_subcategory(name, code)')
// 									.eq('orgz_id', ORGZ_ID)
// 									.eq('type', 'classes')
 await axios.get(`${BASE_URL}/customers`)
						.then(result => {
							console.log(result)
							if(result.status === 200){
								datas = result.data.data
							}
						})
						.catch(error => {
							toast.error('Error! Error get customers')
						})

// if(customerss && customerss.length > 0){
// 	console.log('customerss--', customerss)

// 	datas = customerss.map(customers => {return {id: customers.id, type: customers.type, title: customers.title, slug: customers.slug, thumbnail: customers.thumbnail, price: customers.price, views: customers.views, rating:customers.rating, subcategory_id: customers.subcategory_id, subcategory_code: customers.orgz_subcategory.code, subcategory_name: customers.orgz_subcategory.name}})

// 	console.log('customerss-', datas)
// }else{
// 	// setError(true)
// 	// setErrorMessage(error)
// 	toast('Error retrive data from server.')
// }
const types = datas['type']

console.log('types', types, datas)

export const data= {
	Nama: {
		values: datas.map(customers => customers.full_name),
		classNames: (value) =>
			value === "Jane Smith" || value === "Emma Martinez"
				? "text-green-400 font-medium"
				: "text-white",
		renderValue: (value) => {
					return (
						// <div className='font-medium'>
							<Link to={`/customers/${datas.map(customers => customers.id)}`}>{value}</Link>
						// </div>
					)
				}
	},
	'No. Hp': {
		values: datas.map(customers => customers.phone_number),
		// renderValue: (value) => {
		// 			return (
		// 				// <div className='font-medium'>
		// 					<Link to={`/admin/classes/${datas.map(customers => customers.id)}`}>{value}</Link>
		// 				// </div>
		// 			)
		// 		}
	},
	Email: {
		values: datas.map(customers => customers.email),
		classNames: (value) =>
			typeof value === "string" && value.includes("john")
				? "text-green-400 font-medium"
				: "text-white",
	},
	// ToggleEventhumbnail: {
	// 	values: datas.map(customers => customers.type),
	// },
	// Price: {
	// 	values: datas.map(customers => customers.price),
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
	// 	values: datas.map(customers => customers.views),
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
	Profile: {
		values: datas.map(customers => customers.avatar || ''),
		renderValue: (value) =>
			<img src={value} className='rounded rounded-sm' width='200px' ></img>
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
	},
	// Subcategory: {
	// 	values: datas.map(customers => customers.subcategory_name || '-'),
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