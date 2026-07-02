import { useState } from "react";
import { CheckmarkOutline, CloseOutline } from "react-ionicons";
// import supabase from "configs/supabase";
// import { ColumnData } from "../types";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_SERVER_MODE === 'development' ? import.meta.env.VITE_DEV_URL : import.meta.env.VITE_PROD_URL


let datas = []

		await axios.get(`${BASE_URL}/products`)
						.then(result => {
							console.log(result)
							if(result.status === 200){
								datas = result.data.data
							}
						})
						.catch(error => {
							toast.error('Error! Error get products')
						})


// const { data: products, error } = await supabase
// 									.from('orgz_products')
// 									.select('id,type,title,slug,thumbnail,price,views,rating,subcategory_id,promote_text,description, orgz_subcategory(name, code)')
// 									.eq('orgz_id', ORGZ_ID)
// 									.eq('type', 'classes')

// if(products && products.length > 0){
// 	console.log('products--', products)

// 	datas = products.map(product => {return {id: product.id, type: product.type, title: product.title, slug: product.slug, thumbnail: product.thumbnail, price: product.price, views: product.views, rating:product.rating, subcategory_id: product.subcategory_id, subcategory_code: product.orgz_subcategory.code, subcategory_name: product.orgz_subcategory.name}})

// 	console.log('products-', datas)
// }else{
// 	// setError(true)
// 	// setErrorMessage(error)
// 	toast('Error retrive data from server.')
// }
// const types = datas['type']

// console.log('types', types)

export const data= {
	'No.': {
		values: datas && datas.map(product => product.id),
		classNames: (value) =>
			value === "Jane Smith" || value === "Emma Martinez"
				? "text-green-400 font-medium"
				: "text-white",
	},
	Type: {
		values: datas && datas.map(product => product.type),
		classNames: (value) =>
			value === "Jane Smith" || value === "Emma Martinez"
				? "text-green-400 font-medium"
				: "text-white",
	},
	Title: {
		values: datas && datas.map(product => product.name),
		renderValue: (value) => {
					return (
						// <div className='font-medium'>
							<Link to={`/admin/classes/${datas.map(product => product.id)}`}>{value}</Link>
						// </div>
					)
				}
	},
	Slug: {
		values: datas && datas.map(product => '/' +product.slug),
		classNames: (value) =>
			typeof value === "string" && value.includes("john")
				? "text-green-400 font-medium"
				: "text-white",
	},
	// ToggleEventhumbnail: {
	// 	values: datas.map(product => product.type),
	// },
	Price: {
		values: datas && datas.map(product => product.price),
		renderValue: (value) => {
			if (typeof value === "number") {
				return (
					<div className={`font-medium ${value > 8000 ? "text-green-400" : "text-red-400"}`}>
						${value.toLocaleString()}
					</div>
				);
			}
			return value;
		},
	},
	Views: {
		values: datas && datas.map(product => product.views),
		renderBoolean: (value) =>
			value ? (
				<CheckmarkOutline
					cssClasses={"!text-green-400"}
					width={"30px"}
					height={"30px"}
				/>
			) : (
				<CloseOutline
					cssClasses={"!text-red-400"}
					width={"30px"}
					height={"30px"}
				/>
			),
	},
	Thumbnail: {
		values: datas && datas.map(product => product.thumbnail || ''),
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
	Subcategory: {
		values: datas && datas.map(product => product.subcategory_name || '-'),
		renderBoolean: (value) =>
			value ? (
				<CheckmarkOutline
					cssClasses={"!text-green-400"}
					width={"30px"}
					height={"30px"}
				/>
			) : (
				<CloseOutline
					cssClasses={"!text-red-400"}
					width={"30px"}
					height={"30px"}
				/>
			),
	}
};