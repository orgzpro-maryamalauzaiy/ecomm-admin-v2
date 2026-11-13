import React, { useState, useEffect } from "react";
import {
  // createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import { Link } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router";
import {toast} from 'react-toastify'

// Define types
interface User {
  profile: string;
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  progress: number;
  [key: string]: any;
}

// interface TanStackTableProps {
//   // Add any props if needed
// }

// Define column helper with proper type
// const columnHelper = createColumnHelper<User>();

const BASE_URL = import.meta.env.VITE_SERVER_MODE === "development"
  ? import.meta.env.VITE_DEV_URL
  : import.meta.env.VITE_PROD_URL;

const TanStackTable = ({uri1}) => {
  // State with proper typing
  const [data, setData] = useState<User[]>([]);
  const [columns, setColumns] = useState([])
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate()

  useEffect(() => {
    if(uri1 == 'products'){
      getProductColumns()
    }
    if(uri1 == 'categories'){
      getCategoriesColumns()
    }
    if(uri1 == 'orders'){
      getOrderColumns()
    }
    if(uri1 == 'customers'){
      getCustomerColumns()
    }
    if(uri1 == 'balances'){
      getBalanceColumns()
    }
    if(uri1 == 'order-reports'){
      getOrderReportColumns()
    }
  }, [uri1])

  const getProductColumns = () => {

    setColumns(
      [
        {
          id: "id",
          header: "No.",
          cell: (info) => <span>{info.row.index + 1}</span>,
        },
        {
          accessorKey: "type",
          header: "Tipe",
          cell: (info) => <span>{info.getValue() as string || '-' as string}</span>,
        },
        {
          accessorKey: "name",
          header: "Title",
          // cell: (info) => <Link to={`/product/${info.getValue('id')}`}>{info.getValue()}</Link>,
          cell: (info) => <span>{info.getValue() as string || '-' as string}</span>,
        },
        {
          accessorKey: "slug",
          header: "Slug",
          cell: (info) => <span>{info.getValue() as string || '-' as string}</span>,
        },
        {
          accessorKey: "Thumbnail",
          header: "thumbnail",
          cell: (info) => <span>{info.getValue() as string || '-' as string}</span>,
        },
        {
          accessorKey: "price",
          header: "Price",
          cell: (info) => <span>{formatCurrency(info.getValue(), 'IDR') as string || '-' as string}</span>,
        },
        {
          accessorKey: "category_name",
          header: "Kategori",
          cell: (info) => <span>{info.getValue() as string || '-' as string}</span>,
        },
        {
          accessorKey: "views",
          header: "Jumlah Dilihat",
          cell: (info) => <span>{info.getValue() as number || '-' as string}</span>,
        },
        {
          accessorKey: "id",
          header: "Aksi",
          cell: (info) => <>
              <button type='button' className="flex items-center justify-center w-full px-4 py-3 mb-2 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                    onClick={() => navigate('/products/' + info.getValue() as string)}
                  >
                    Detail
              </button>
              <button type='button' className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                    onClick={() => deleteProduct(info.getValue())}
                  >
                    Hapus
              </button>
          </>,
        },

        // {
        //   accessorKey: "originalPrice",
        //   header: "Original Price",
        //   cell: (info) => <span>{formatCurrency(info.getValue() || 0, 'IDR') as string}</span>,
        // },
        // {
        //   accessorKey: "discount",
        //   header: "Discount",
        //   cell: (info) => <span>{info.getValue() as number || 0 as number}</span>,
        // },
        // {
        //   accessorKey: "bgColor",
        //   header: "Background Color",
        //   cell: (info) => <span>{info.getValue() as string || '-' as string}</span>,
        // }
      ]

    )

  }

  const getOrderColumns = () => {

    setColumns(
      [
        {
          id: "id",
          header: "No.",
          cell: (info) => <span>{info.row.index + 1}</span>,
        },
        {
          accessorKey: "invoice_number",
          header: "No. Pesanan",
          cell: (info) => <span>{info.getValue() as string || '-' as string}</span>,
        },
        {
          accessorKey: "total_price",
          header: "Total Harga",
          cell: (info) => <span>{formatCurrency(info.getValue(), 'IDR') as string || '-' as string}</span>,
        },
        {
          accessorKey: "order_status",
          header: "Status Pesanan",
          cell: (info) => <span className={`border ${info.getValue() as string == 'success'? 'bg-green-400' : info.getValue() as string == 'pending'? 'bg-yellow-400' : 'bg-rose-400'} rounded-4xl px-2 py-3`}>{info.getValue()?.toUpperCase() as string}</span>,
          // cell: (info) => <span>{info.getValue() as string || '-' as string}</span>,
        },
        {
          accessorKey: "id",
          header: "Aksi",
          cell: (info) => <>
              <button type='button' className="flex items-center justify-center w-full px-4 py-3 mb-2 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                    onClick={() => navigate('/orders/' + info.getValue() as string)}
                  >
                    Detail
              </button>
              <button type='button' className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                    onClick={() => deleteItem(info.getValue() as string)}
                  >
                    Hapus
              </button>
          </>,
        },
        // {
        //   accessorKey: "subcategory_name",
        //   header: "Sub Category",
        //   cell: (info) => <span>{info.getValue() as string || '-' as string}</span>,
        // },
        // {
        //   accessorKey: "Sub Category",
        //   header: "subcategory_name",
        //   cell: (info) => <span>{info.getValue() as string || '-' as string}</span>,
        // },
        // {
        //   accessorKey: "views",
        //   header: "Views",
        //   cell: (info) => <span>{info.getValue() as number || '-' as string}</span>,
        // },
        // {
        //   accessorKey: "originalPrice",
        //   header: "Original Price",
        //   cell: (info) => <span>{formatCurrency(info.getValue() || 0, 'IDR') as string}</span>,
        // },
        // {
        //   accessorKey: "discount",
        //   header: "Discount",
        //   cell: (info) => <span>{info.getValue() as number || 0 as number}</span>,
        // },
        // {
        //   accessorKey: "bgColor",
        //   header: "Background Color",
        //   cell: (info) => <span>{info.getValue() as string || '-' as string}</span>,
        // }
      ]

    )

  }

  const getCustomerColumns = () => {

    setColumns(
      [
        {
          id: "id",
          header: "No",
          cell: (info) => <span>{info.row.index + 1}</span>,
        },
        {
          accessorKey: "full_name",
          header: "Nama",
          cell: (info) => <span>{info.getValue() as string}</span>,
          // <Link to={`/customers/${info.getValue('id') as string}`}>{info.getValue('id') as string}</Link>
        },
        {
          accessorKey: "avatar",
          header: "Profile",
          cell: (info) => (
            <img
              src={info.getValue() as string}
              alt="profile"
              className="rounded-full w-10 h-10 object-cover"
            />
          ),
        },
        {
          accessorKey: "email",
          header: "Email",
          cell: (info) => <span>{info.getValue() as string || '-' as string}</span>,
        },
        {
          accessorKey: "phone_number",
          header: "No. Hp",
          cell: (info) => <span>{info.getValue() as string || '-' as string}</span>,
        },
        {
          accessorKey: "id",
          header: "Aksi",
          cell: (info) => <>
              <button type='button' className="flex items-center justify-center w-full px-4 py-3 mb-2 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                    onClick={() => navigate('/customers/' + info.getValue() as string)}
                  >
                    Detail
              </button>
              <button type='button' className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                    onClick={() => deleteItem(info.getValue() as string)}
                  >
                    Hapus
              </button>
          </>,
        },
        // {
        //   accessorKey: "originalPrice",
        //   header: "Original Price",
        //   cell: (info) => <span>{formatCurrency(info.getValue() || 0, 'IDR') as string}</span>,
        // },
        // {
        //   accessorKey: "discount",
        //   header: "Discount",
        //   cell: (info) => <span>{info.getValue() as number || 0 as number}</span>,
        // },
        // {
        //   accessorKey: "bgColor",
        //   header: "Background Color",
        //   cell: (info) => <span>{info.getValue() as string || '-' as string}</span>,
        // }
      ]

    )

  }
  const getBalanceColumns = () => {

    setColumns(
      [
        {
          id: "withdraw_number",
          header: "Nomor Penarikan",
          cell: (info) => <span>{info.getValue() as string}</span>,
        },
        {
          accessorKey: "last_balance",
          header: "Saldo Terakhir",
          cell: (info) => <span>{info.getValue() as string}</span>,
          // <Link to={`/customers/${info.getValue('id') as string}`}>{info.getValue('id') as string}</Link>
        },
        {
          accessorKey: "last_debit",
          header: "Debit Terakhir",
          cell: (info) => <span>{info.getValue() as string}</span>,
          // <Link to={`/customers/${info.getValue('id') as string}`}>{info.getValue('id') as string}</Link>
        },
        {
          accessorKey: "admin_fee",
          header: "Biaya Admin",
          cell: (info) => <span>{info.getValue() as string}</span>,
          // <Link to={`/customers/${info.getValue('id') as string}`}>{info.getValue('id') as string}</Link>
        },
        {
          accessorKey: "total_debit",
          header: "Tota Debit",
          cell: (info) => <span>{info.getValue() as string}</span>,
          // <Link to={`/customers/${info.getValue('id') as string}`}>{info.getValue('id') as string}</Link>
        },
        {
          accessorKey: "withdraw_form",
          header: "Formulir Penarikan",
          cell: (info) => <span>{info.getValue() as string}</span>,
        },
        {
          accessorKey: "transfer_eviden",
          header: "Bukti Transfer",
          cell: (info) => <span>{info.getValue() as string || '-' as string}</span>,
        },
        {
          accessorKey: "is_complete",
          header: "Status Penarikan",
          cell: (info) => <span className={`border ${info.getValue() as string == 'success'? 'bg-green-400' : info.getValue() as string == 'pending'? 'bg-yellow-400' : 'bg-rose-400'} rounded-4xl `}>{info.getValue() as string}</span>,
        },
        {
          accessorKey: "id",
          header: "Aksi",
          cell: (info) => <>
              <button type='button' className="flex items-center justify-center w-full px-4 py-3 mb-2 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                    onClick={() => navigate('/balances/' + info.getValue() as string)}
                  >
                    Detail
              </button>
              <button type='button' className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                    onClick={() => deleteItem(info.getValue() as string)}
                  >
                    Hapus
              </button>
          </>,
        },
        // {
        //   accessorKey: "originalPrice",
        //   header: "Original Price",
        //   cell: (info) => <span>{formatCurrency(info.getValue() || 0, 'IDR') as string}</span>,
        // },
        // {
        //   accessorKey: "discount",
        //   header: "Discount",
        //   cell: (info) => <span>{info.getValue() as number || 0 as number}</span>,
        // },
        // {
        //   accessorKey: "bgColor",
        //   header: "Background Color",
        //   cell: (info) => <span>{info.getValue() as string || '-' as string}</span>,
        // }
      ]

    )

  }

  const getOrderReportColumns = () => {

    setColumns(
      [
        {
          id: "id",
          header: "No",
          cell: (info) => <span>{info.row.index + 1}</span>,
        },
        {
          accessorKey: "invoice_number",
          header: "No. Pesanan",
          cell: (info) => <span>{info.getValue() as string}</span>,
          // <Link to={`/customers/${info.getValue('id') as string}`}>{info.getValue('id') as string}</Link>
        },
        {
          accessorKey: "customer_name",
          header: "Name Pelanggan",
          cell: (info) => <span>{info.getValue() as string}</span>,
          // <Link to={`/customers/${info.getValue('id') as string}`}>{info.getValue('id') as string}</Link>
        },
        {
          accessorKey: "total_price",
          header: "Total Harga",
          cell: (info) => <span>{info.getValue() as number}</span>,
          // <Link to={`/customers/${info.getValue('id') as string}`}>{info.getValue('id') as string}</Link>
        },
        {
          accessorKey: "total_amount",
          header: "Jumlah",
          cell: (info) => <span>{info.getValue() as number}</span>,
          // <Link to={`/customers/${info.getValue('id') as string}`}>{info.getValue('id') as string}</Link>
        },
        {
          accessorKey: "total_discount",
          header: "Diskon",
          cell: (info) => <span>{info.getValue() as number}</span>,
          // <Link to={`/customers/${info.getValue('id') as string}`}>{info.getValue('id') as string}</Link>
        },
        {
          accessorKey: "order_status",
          header: "Status Pesanan",
          cell: (info) => <span className={`border ${info.getValue() as string == 'success'? 'bg-green-400' : info.getValue() as string == 'pending'? 'bg-yellow-400' : 'bg-rose-400'} rounded-4xl `}>{info.getValue() as string}</span>,
          // <Link to={`/customers/${info.getValue('id') as string}`}>{info.getValue('id') as string}</Link>
        },
        // {
        //   accessorKey: "total_discount",
        //   header: "Qty",
        //   cell: (info) => (
        //     <img
        //       src={info.getValue() as string}
        //       alt="profile"
        //       className="rounded-full w-10 h-10 object-cover"
        //     />
        //   ),
        // },
        // {
        //   accessorKey: "email",
        //   header: "Email",
        //   cell: (info) => <span>{info.getValue() as string || '-' as string}</span>,
        // },
        // {
        //   accessorKey: "phone_number",
        //   header: "No. Hp",
        //   cell: (info) => <span>{info.getValue() as string || '-' as string}</span>,
        // },
        {
          accessorKey: "id",
          header: "Aksi",
          cell: (info) => <>
              <button type='button' className="flex items-center justify-center w-full px-4 py-3 mb-2 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                    onClick={() => navigate('/customers/' + info.getValue() as string)}
                  >
                    Detail
              </button>
              <button type='button' className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                    onClick={() => deleteItem(info.getValue() as string)}
                  >
                    Hapus
              </button>
          </>,
        },
        // {
        //   accessorKey: "originalPrice",
        //   header: "Original Price",
        //   cell: (info) => <span>{formatCurrency(info.getValue() || 0, 'IDR') as string}</span>,
        // },
        // {
        //   accessorKey: "discount",
        //   header: "Discount",
        //   cell: (info) => <span>{info.getValue() as number || 0 as number}</span>,
        // },
        // {
        //   accessorKey: "bgColor",
        //   header: "Background Color",
        //   cell: (info) => <span>{info.getValue() as string || '-' as string}</span>,
        // }
      ]

    )

  }

  const getCustomersColumns = () => {

    setColumns(
      [
        {
          id: "id",
          header: "No",
          cell: (info) => <span>{info.row.index + 1}</span>,
        },
        {
          accessorKey: "name",
          header: "Nama",
          cell: (info) => <span>{info.getValue() as string}</span>,
          // <Link to={`/customers/${info.getValue('id') as string}`}>{info.getValue('id') as string}</Link>
        },
        {
          accessorKey: "parent_category_name",
          header: "Kategori Induk",
          cell: (info) => <Link to={`/categories/${columns.map(col => col.accessorKey == 'id') as string}`}>{info.getValue() as string}</Link>,
          // <span>{info.getValue() as string}</span>
        },
        // {
        //   accessorKey: "total_discount",
        //   header: "Qty",
        //   cell: (info) => (
        //     <img
        //       src={info.getValue() as string}
        //       alt="profile"
        //       className="rounded-full w-10 h-10 object-cover"
        //     />
        //   ),
        // },
        // {
        //   accessorKey: "email",
        //   header: "Email",
        //   cell: (info) => <span>{info.getValue() as string || '-' as string}</span>,
        // },
        // {
        //   accessorKey: "phone_number",
        //   header: "No. Hp",
        //   cell: (info) => <span>{info.getValue() as string || '-' as string}</span>,
        // },
        {
          accessorKey: "id",
          header: "Aksi",
          cell: (info) => <>
              <button type='button' className="flex items-center justify-center w-full px-4 py-3 mb-2 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                    onClick={() => navigate('/customers/' + info.getValue() as string)}
                  >
                    Detail
              </button>
              <button type='button' className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                    onClick={() => deleteItem(info.getValue() as string)}
                  >
                    Hapus
              </button>
          </>,
        },
        // {
        //   accessorKey: "originalPrice",
        //   header: "Original Price",
        //   cell: (info) => <span>{formatCurrency(info.getValue() || 0, 'IDR') as string}</span>,
        // },
        // {
        //   accessorKey: "discount",
        //   header: "Discount",
        //   cell: (info) => <span>{info.getValue() as number || 0 as number}</span>,
        // },
        // {
        //   accessorKey: "bgColor",
        //   header: "Background Color",
        //   cell: (info) => <span>{info.getValue() as string || '-' as string}</span>,
        // }
      ]

    )

  }

  const getCategoriesColumns = () => {

    setColumns(
      [
        {
          id: "id",
          header: "No.",
          cell: (info) => <span>{info.row.index + 1}</span>,
        },
        {
          accessorKey: "name",
          header: "Nama",
          cell: (info) => <span>{info.getValue() as string || '-' as string}</span>,
        },
        {
          accessorKey: "category_name",
          header: "Nama Parent",
          // cell: (info) => <Link to={`/product/${info.getValue('id')}`}>{info.getValue()}</Link>,
          cell: (info) => <span>{info.getValue() as string || '-' as string}</span>,
        },
        {
          accessorKey: "id",
          header: "Aksi",
          cell: (info) => <>
              <button type='button' className="flex items-center justify-center px-4 py-3 mb-2 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
              // <button type='button' className="flex items-center text-center justify-center px-4 py-3 mb-2 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                    onClick={() => navigate('/categories/' + info.getValue() as string)}
                  >
                    Detail
              </button>
              <button type='button' className="flex items-center justify-center px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
              // <button type='button' className="flex items-center justify-center px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                    onClick={() => deleteCategories(info.getValue() as string)}
                  >
                    Hapus
              </button>
          </>,
        },

        // {
        //   accessorKey: "originalPrice",
        //   header: "Original Price",
        //   cell: (info) => <span>{formatCurrency(info.getValue() || 0, 'IDR') as string}</span>,
        // },
        // {
        //   accessorKey: "discount",
        //   header: "Discount",
        //   cell: (info) => <span>{info.getValue() as number || 0 as number}</span>,
        // },
        // {
        //   accessorKey: "bgColor",
        //   header: "Background Color",
        //   cell: (info) => <span>{info.getValue() as string || '-' as string}</span>,
        // }
      ]

    )

  }

  // Define columns with proper typing - using ColumnDef<User> directly
  // const columns = datas.map((data, key) => {
  //   id: Object.keys(datas)[0].values
  // })
  // const columns: ColumnDef<User>[] = [
    // {
    //   id: "id",
    //   header: "No",
    //   cell: (info) => <span>{info.row.index + 1}</span>,
    // },
    // {
    //   accessorKey: "full_name",
    //   header: "Nama",
    //   cell: (info) => <span>{info.getValue() as string || '-' as string}</span>,
    // },
    // {
    //   accessorKey: "avatar",
    //   header: "Profile",
    //   cell: (info) => (
    //     <img
    //       src={info.getValue() as string}
    //       alt="profile"
    //       className="rounded-full w-10 h-10 object-cover"
    //     />
    //   ),
    // },
    // {
    //   accessorKey: "email",
    //   header: "Email",
    //   cell: (info) => <span>{info.getValue() as string || '-' as string}</span>,
    // },
    // {
    //   accessorKey: "phone_number",
    //   header: "No. Hp",
    //   cell: (info) => <span>{info.getValue() as string || '-' as string}</span>,
    // },
    // {
    //   accessorKey: "price",
    //   header: "Price",
    //   cell: (info) => <span>{formatCurrency(info.getValue(), 'IDR') as string || '-' as string}</span>,
    // },
    // {
    //   accessorKey: "originalPrice",
    //   header: "Original Price",
    //   cell: (info) => <span>{formatCurrency(info.getValue() || 0, 'IDR') as string}</span>,
    // },
    // {
    //   accessorKey: "discount",
    //   header: "Discount",
    //   cell: (info) => <span>{info.getValue() as number || 0 as number}</span>,
    // },
    // {
    //   accessorKey: "bgColor",
    //   header: "Background Color",
    //   cell: (info) => <span>{info.getValue() as number || '-' as string}</span>,
    // },
  // ];

  // useEffect(() => {

  //   if(uri1){
  //     getProducts(uri1)
  //   }

  // }, [uri1])

  // Fetch data
  const getProducts = async (uri): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(`${BASE_URL}/${uri}`);

      if (response.status === 200) {
        console.log('response', response)
        if(response.data.data.length > 0){
          setData(response.data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategories = async (id) =>{
    try {
      if(id){
        await axios.delete(`${BASE_URL}/categories/` + id, {withCredentials: true})
                    .then(result =>{
                      console.log('result', result)
                      if(result.status === 200){
                        getProducts(uri1)
                        toast.success('Berhasil, Berhasil menghapus kategori')
                      }
                    })
                    .catch(error => {
                      toast.error('Gagal, gagal menghapus kategori')
                    })
      }
    } catch (error) {
      toast.error('Gagal, gagal menghapus kategori')

    }
  }
  const deleteProduct = async (id) =>{
    try {
      if(id){
        await axios.delete(`${BASE_URL}/products/` + id, {withCredentials: true})
                    .then(result =>{
                      console.log('result', result)
                      if(result.status === 200){
                        getProducts(uri1)

                        toast.success('Berhasil, Berhasil menghapus produk')
                      }
                    })
                    .catch(error => {
                      toast.error('Gagal, gagal menghapus produk')
                    })
      }
    } catch (error) {
      toast.error('Gagal, gagal menghapus produk')

    }
  }

  const deleteOrder = async (id) =>{
    try {
      if(id){
        await axios.delete(`${BASE_URL}/orders/` + id, {withCredentials: true})
                    .then(result =>{
                      console.log('result', result)
                      if(result.status === 200){
                        toast.success('Berhasil, Berhasil menghapus pesanan')
                      }
                    })
                    .catch(error => {
                      toast.error('Gagal, gagal menghapus pesanan')
                    })
      }
    } catch (error) {
      toast.error('Gagal, gagal menghapus pesanan')

    }
  }
  const deleteCustomer = async (id) =>{
    try {
      if(id){
        await axios.delete(`${BASE_URL}/customers/` + id, {withCredentials: true})
                    .then(result =>{
                      console.log('result', result)
                      if(result.status === 200){
                        toast.success('Berhasil, Berhasil menghapus pelanggan')
                      }
                    })
                    .catch(error => {
                      toast.error('Gagal, gagal menghapus produk')
                    })
      }
    } catch (error) {
      toast.error('Gagal, gagal menghapus produk')

    }
  }

  useEffect(() => {
    if(uri1){
      getProducts(uri1);
      console.log('uri1', uri1)
    }
  }, [uri1]); // Empty dependency array to run only once on mount

  // Create table instance
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  function getDefaultLocale(currencyCode) {
      const currencyLocaleMap = {
          USD: 'en-US',
          IDR: 'id-ID',
          EUR: 'de-DE',
          JPY: 'ja-JP',
          GBP: 'en-GB',
          CNY: 'zh-CN',
          AUD: 'en-AU'
      };

      return currencyLocaleMap[currencyCode] || 'en-US'; // fallback ke en-US
  }

  function formatCurrency(amount, currencyCode, locale = getDefaultLocale(currencyCode)) {
      return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currencyCode,
          maximumFrAksiDigits: 2
      }).format(amount);
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="p-2 max-w-5xl mx-auto text-white fill-gray-400">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <span className="ml-3">Loading data...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-2 max-w-5xl mx-auto text-white fill-gray-400">
        <div className="text-center text-red-500 p-4">
          <p>{error}</p>
          <button
            onClick={() => getProducts(uri1)}
            className="mt-2 px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 w-full mx-auto text-white fill-gray-400">
      <div className="flex justify-between mb-2">
        <div className="w-full flex items-center gap-1">
          <SearchIcon />
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value: string) => setGlobalFilter(value)}
            className="p-2 bg-indigo-600 outline-none border-b-2 w-1/5 focus:w-1/3 duration-300 border-indigo-500"
            placeholder="Search all columns..."
          />
        </div>
        <DownloadBtn data={data} fileName="peoples" />
        <button
          onClick={() => navigate(`/${uri1}/add`)}
          className="px-4 py-2 ml-3 text-base bg-indigo-600 rounded hover:bg-indigo-700 transition-colors"
        >
          Tambah
    </button>
      </div>

      <div className="overflow-x-auto">
        <table className="border border-gray-700 w-full text-left min-w-max">
          <thead className="bg-indigo-600">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="capitalize px-3.5 py-2 whitespace-nowrap"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={`${
                    i % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                  } hover:bg-gray-700 transition-colors`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3.5 py-2 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr className="text-center h-32">
                <td colSpan={columns.length} className="py-8">
                  No records found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-end mt-4 gap-2">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="p-1 border border-gray-300 text-gray-800 hover:text-white px-2 rounded disabled:opacity-30 hover:bg-gray-700 transition-colors"
          aria-label="Previous page"
        >
          {"<"}
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="p-1 border border-gray-300 text-gray-800 hover:text-white px-2 rounded disabled:opacity-30 hover:bg-gray-700 transition-colors"
          aria-label="Next page"
        >
          {">"}
        </button>

        <span className="flex items-center gap-1 text-sm text-gray-400">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>

        <span className="flex items-center gap-1 text-sm text-gray-400">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            min={1}
            max={table.getPageCount()}
            className="border p-1 rounded w-16 bg-gray-600 text-center text-white"
            aria-label="Page number"
          />
        </span>

        <select
          value={table.getState().pagination.pageSize}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            table.setPageSize(Number(e.target.value));
          }}
          className="p-2 bg-gray-600 border rounded"
          aria-label="Rows per page"
          // bg-transparent
        >
          {[10, 20, 30, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 text-sm text-gray-400">
        Showing {table.getRowModel().rows.length} of {data.length} total rows
      </div>
    </div>
  );
};

// Component interfaces
interface DebouncedInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  delay?: number;
}

const DebouncedInput: React.FC<DebouncedInputProps> = ({
  value,
  onChange,
  className,
  placeholder,
  delay = 300,
}) => {
  const [inputValue, setInputValue] = useState<string>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(inputValue);
    }, delay);

    return () => clearTimeout(timer);
  }, [inputValue, delay, onChange]);

  return (
    <input
      type="text"
      value={inputValue}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setInputValue(e.target.value)
      }
      className={className}
      placeholder={placeholder}
    />
  );
};

interface DownloadBtnProps {
  data: User[];
  fileName: string;
}

const DownloadBtn: React.FC<DownloadBtnProps> = ({ data, fileName }) => {
  const handleDownload = () => {
    // Convert data to CSV
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(","),
      ...data.map(row =>
        headers.map(header => JSON.stringify(row[header] || "")).join(",")
      )
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${fileName}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 transition-colors"
    >
      Download CSV
    </button>
  );
};

// Search Icon component
const SearchIcon: React.FC = () => (
  <svg
    className="w-5 h-5 text-gray-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

export default TanStackTable;
// import {
//   createColumnHelper,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// // import { USERS } from "../data";
// import { useState, useEffect } from "react";
// import DownloadBtn from "./DownloadBtn";
// import DebouncedInput from "./DebouncedInput";
// import { SearchIcon } from "../Icons/Icons";
// import axios from 'axios'

// const BASE_URL = import.meta.env.VITE_SERVER_MODE == 'development'? import.meta.env.VITE_SERVER_LOCAL_URL : import.meta.env.env.VITE_SERVER_PROD_URL

// const TanStackTable = () => {
//   const columnHelper = createColumnHelper();

//   const columns = [
//     columnHelper.accessor("", {
//       id: "S.No",
//       cell: (info) => <span>{info.row.index + 1}</span>,
//       header: "S.No",
//     }),
//     columnHelper.accessor("profile", {
//       cell: (info) => (
//         <img
//           src={info?.getValue()}
//           alt="..."
//           className="rounded-full w-10 h-10 object-cover"
//         />
//       ),
//       header: "Profile",
//     }),
//     columnHelper.accessor("firstName", {
//       cell: (info) => <span>{info.getValue()}</span>,
//       header: "First Name",
//     }),
//     columnHelper.accessor("lastName", {
//       cell: (info) => <span>{info.getValue()}</span>,
//       header: "Last Name",
//     }),
//     columnHelper.accessor("age", {
//       cell: (info) => <span>{info.getValue()}</span>,
//       header: "Age",
//     }),
//     columnHelper.accessor("visits", {
//       cell: (info) => <span>{info.getValue()}</span>,
//       header: "Visits",
//     }),
//     columnHelper.accessor("progress", {
//       cell: (info) => <span>{info.getValue()}</span>,
//       header: "Progress",
//     }),
//   ];
//   const [data, setData] = useState(() => []);
// //   ...USERS
//   const [globalFilter, setGlobalFilter] = useState("");

//   useEffect(() => {
//     getProducts()
//   }, data)

//   const getProducts = async () => {
//     try {
//         await axios.get(`${BASE_URL}/products`)
//                         .then(result => {
//                             if(result.status == 200){
//                                 setData(result.data)
//                             }
//                         })
//                         .catch(error => {
//                             console.log(error)
//                         })
//     } catch (error) {
//         console.log(error)
//     }
//   }

//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       globalFilter,
//     },
//     getFilteredRowModel: getFilteredRowModel(),
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//   });

//   return (
//     <div className="p-2 max-w-5xl mx-auto text-white fill-gray-400">
//       <div className="flex justify-between mb-2">
//         <div className="w-full flex items-center gap-1">
//           <SearchIcon />
//           <DebouncedInput
//             value={globalFilter ?? ""}
//             onChange={(e) => setGlobalFilter(String(e))}
//             className="p-2 bg-transparent outline-none border-b-2 w-1/5 focus:w-1/3 duration-300 border-indigo-500"
//             placeholder="Search all columns..."
//           />
//         </div>
//         <DownloadBtn data={data} fileName={"peoples"} />
//       </div>
//       <table className="border border-gray-700 w-full text-left">
//         <thead className="bg-indigo-600">
//           {table.getHeaderGroups().map((headerGroup) => (
//             <tr key={headerGroup.id}>
//               {headerGroup.headers.map((header) => (
//                 <th key={header.id} className="capitalize px-3.5 py-2">
//                   {flexRender(
//                     header.column.columnDef.header,
//                     header.getContext()
//                   )}
//                 </th>
//               ))}
//             </tr>
//           ))}
//         </thead>
//         <tbody>
//           {table.getRowModel().rows.length ? (
//             table.getRowModel().rows.map((row, i) => (
//               <tr
//                 key={row.id}
//                 className={`
//                 ${i % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
//                 `}
//               >
//                 {row.getVisibleCells().map((cell) => (
//                   <td key={cell.id} className="px-3.5 py-2">
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </td>
//                 ))}
//               </tr>
//             ))
//           ) : (
//             <tr className="text-center h-32">
//               <td colSpan={12}>No Recoard Found!</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//       {/* pagination */}
//       <div className="flex items-center justify-end mt-2 gap-2">
//         <button
//           onClick={() => {
//             table.previousPage();
//           }}
//           disabled={!table.getCanPreviousPage()}
//           className="p-1 border border-gray-300 px-2 disabled:opacity-30"
//         >
//           {"<"}
//         </button>
//         <button
//           onClick={() => {
//             table.nextPage();
//           }}
//           disabled={!table.getCanNextPage()}
//           className="p-1 border border-gray-300 px-2 disabled:opacity-30"
//         >
//           {">"}
//         </button>

//         <span className="flex items-center gap-1">
//           <div>Page</div>
//           <strong>
//             {table.getState().pagination.pageIndex + 1} of{" "}
//             {table.getPageCount()}
//           </strong>
//         </span>
//         <span className="flex items-center gap-1">
//           | Go to page:
//           <input
//             type="number"
//             defaultValue={table.getState().pagination.pageIndex + 1}
//             onChange={(e) => {
//               const page = e.target.value ? Number(e.target.value) - 1 : 0;
//               table.setPageIndex(page);
//             }}
//             className="border p-1 rounded w-16 bg-transparent"
//           />
//         </span>
//         <select
//           value={table.getState().pagination.pageSize}
//           onChange={(e) => {
//             table.setPageSize(Number(e.target.value));
//           }}
//           className="p-2 bg-transparent"
//         >
//           {[10, 20, 30, 50].map((pageSize) => (
//             <option key={pageSize} value={pageSize}>
//               Show {pageSize}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// };

// export default TanStackTable;