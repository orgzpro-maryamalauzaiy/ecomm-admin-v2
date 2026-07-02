import React from "react";
import { useState, useEffect } from "react";

// components

// import CardTable from "../../components/Cards/CardTable.js";
// import Datatable from "../../components/Tables/Datatables.js"
// import NewDataTable from "../../components/Tables/NewDatatables";
import TanStackTable from "../../components/tables/TanStackTable.js"
import { data } from "../../utils/orders.jsx";
import OrderHeader from "../../components/header/OrderHeader.jsx";
// import { toast } from "react-toastify";
// import supabase from "configs/supabase.js";

const Orders = () => {
  const [datas, setDatas] = useState([])
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if(data){
      setDatas(data)
    }
    console.log('orders', data, datas)

  },[data])
  return (
    <>
      <div className="flex flex-wrap">
        <OrderHeader/>
        {/* <div className="w-full mb-12 px-4">
          <CardTable />
        </div>
        <div className="w-full mb-12 px-4">
          <CardTable color="dark" />
        </div> */}
        {/* FROM PRO */}
        {/* <div className="w-full mb-12 px-4"> */}
          <TanStackTable uri1="orders"/>
          {/* <NewDataTable
            data={datas}
            searchBar
            excelExport
            pageSizeControl
            pagination
            removableRows
          /> */}
        {/* </div> */}
      </div>
    </>
  );
}

export default Orders