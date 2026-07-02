import { useState, useEffect } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import {TbUsersGroup} from 'react-icons/tb'
import {GrTransaction} from 'react-icons/gr'
import {FaBagShopping, FaBasketShopping} from 'react-icons/fa6'
import axios from "axios";
// import Badge from "../ui/badge/Badge";
import {toast} from 'react-toastify'

const BASE_URL = import.meta.env.VITE_SERVER_MODE === 'development' ? import.meta.env.VITE_DEV_URL : import.meta.env.VITE_PROD_URL

export default function EcommerceMetrics() {
  const [num_products, setNumProducts] =                                                                                                                                                                                               useState(0)
  const [num_orders, setNumOrders] = useState(0)
  const [num_customers, setNumCustomers] = useState(0)
  const [num_complete_orders, setNumCompleteOrders] = useState(0)

  useEffect(() => {

    getNumProducts()
    getNumOrders()
    getNumCustomers()
    getNumCompleteOrders()

  }, [num_products])

  const getNumProducts = async () => {
    try {
      await axios.get(`${BASE_URL}/count/products`)
                  .then(result => {
                    if(result.status === 200){
                      console.log('result', result)
                      setNumProducts(result.data.data)
                    }
                  })
    } catch (error) {
      toast.error('Error when get number of products')
    }
  }
  const getNumOrders = async () => {
    try {
      await axios.get(`${BASE_URL}/count/orders`)
                  .then(result => {
                    if(result.status === 200){
                      console.log('result', result)
                      setNumOrders(result.data.data)
                    }
                  })
    } catch (error) {
      toast.error('Error when get number of products')
    }
  }
  const getNumCompleteOrders = async () => {
    try {
      await axios.get(`${BASE_URL}/count/complete-orders`)
                  .then(result => {
                    if(result.status === 200){
                      setNumCompleteOrders(result.data.data)
                    }
                  })
    } catch (error) {
      toast.error('Error when get number of products')
    }
  }

  const getNumCustomers = async () => {
    try {
      await axios.get(`${BASE_URL}/count/customers`)
                  .then(result => {
                    if(result.status === 200){
                      setNumCustomers(result.data.data)
                    }
                  })
    } catch (error) {
      toast.error('Error when get number of products')
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          {/* <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" /> */}
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90"/>
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Produk
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {num_products}
            </h4>
          </div>
          {/* <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge> */}
        </div>

      </div>

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Pelanggan
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {num_customers}
            </h4>
          </div>

          {/* <Badge color="error">
            <ArrowDownIcon />
            9.05%
          </Badge> */}
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <FaBasketShopping className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Pesanan
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {num_orders}
            </h4>
          </div>
          {/* <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge> */}
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <FaBagShopping className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Pesanan Selesai
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {num_complete_orders}
            </h4>
          </div>

          {/* <Badge color="error">
            <ArrowDownIcon />
            9.05%
          </Badge> */}
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
}
