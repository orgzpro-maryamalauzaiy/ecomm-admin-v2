import React, { useState, useEffect } from "react";
import {useSelector} from 'react-redux'

import { toast } from "react-toastify";

// components

import CardTransStats from "../../components/ecommerce/CardTransStats"

export default function OrderHeader() {

  const {userInfo, userEmail} = useSelector(state => state.authReducer)
  const [balance, setBalance] = useState(0)
  const [total_transactions, setTotalTransactions] = useState(0)
  const [amount_transactions, setAmountTransactions] = useState(0)
  const [total_credit, setTotalKredit] = useState(0)

  useEffect(() => {
    getBalance()
    getTotalTransactions()
    getAmountOfTransaction()
  }, [])

  const getBalance = async () => {

    try {
      await axios.get(`${BASE_URL}/order-reports/balances`, {withCredentials: true})
                  then(result => {
                    if(result.status == 200){
                      setBalance(result.data.data.balance)
                    }
                  })
                  .catch(error => {
                    toast.error("Failed, Failed when get balance")
                  })
    } catch (error) {
      toast.error("Failed, Failed when get balance")
    }

  }

  const getTotalTransactions = async () => {

    try {
      await axios.get(`${BASE_URL}/order-reports/total-transactions`, {withCredentials: true})
                  then(result => {
                    if(result.status == 200){
                      setTotalTransactions(result.data.data.total_transactions)
                    }
                  })
                  .catch(error => {
                    toast.error("Failed, Failed when get transactions")
                  })
    } catch (error) {
      toast.error("Failed, Failed when get transactions")
    }

  }

  const getAmountOfTransaction = async () => {

    try {
      await axios.get(`${BASE_URL}/order-reports/amount-transactions`, {withCredentials: true})
                  then(result => {
                    if(result.status == 200){
                      setAmountTransactions(result.data.data.amuont_transactions)
                    }
                  })
                  .catch(error => {
                    toast.error("Failed, Failed when get transactions")
                  })
    } catch (error) {
      toast.error("Failed, Failed when get transactions")
    }
  }
  return (
    <>
      {/* Header */}
      <div className="relative bg-lightBlue-600 md:pt-24 pb-24 pt-12 -mt-10 -mx-10">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            {/* Card stats */}
            <div className="flex flex-wrap">
              <div className="w-full lg:w-3/12 xl:w-3/12 px-4">
                <CardTransStats
                  statSubtitle="Total Saldo"
                  statTitle={balance}
                  type="money"
                  // statArrow="up"
                  // statPercent="3.48"
                  statPercentColor="text-emerald-500"
                  statDescription="1 pekan terakhir"
                  statIconName="fas fa-money"
                  statIconColor="bg-red-500"
                />
              </div>
              <div className="w-full lg:w-3/12 xl:w-3/12 px-4">
                <CardTransStats
                  statSubtitle="Total Transaksi"
                  statTitle={total_transactions}
                  type="money"
                  // statArrow="down"
                  // statPercent="3.48"
                  statPercentColor="text-red-500"
                  // statDescription="Since last week"
                  statIconName="fas fa-arrow"
                  statIconColor="bg-orange-500"
                />
              </div>
              <div className="w-full lg:w-3/12 xl:w-3/12 px-4">
                <CardTransStats
                  statSubtitle="Jumlah Transaksi"
                  statTitle={amount_transactions}
                  // statArrow="down"
                  // statPercent="1.10"
                  statPercentColor="text-orange-500"
                  // statDescription="Since yesterday"
                  statIconName="fas fa-box"
                  statIconColor="bg-pink-500"
                />
              </div>
              {/* <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="PERFORMANCE"
                  statTitle="49,65%"
                  statArrow="up"
                  statPercent="12"
                  statPercentColor="text-emerald-500"
                  statDescripiron="Since last month"
                  statIconName="fas fa-percent"
                  statIconColor="bg-lightBlue-500"
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
