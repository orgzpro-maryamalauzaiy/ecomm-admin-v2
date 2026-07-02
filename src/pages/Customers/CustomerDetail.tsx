import { useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import UserMetaCard from "../../components/UserProfile/UserMetaCard";
import UserInfoCard from "../../components/UserProfile/UserInfoCard";
import UserAddressCard from "../../components/UserProfile/UserAddressCard";
import CustomerInfoCard from "./layout/CustomerInfoCard";
import PageMeta from "../../components/common/PageMeta";

import { useParams } from "react-router";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_SERVER_MODE === 'development' ? import.meta.env.VITE_DEV_URL : import.meta.env.VITE_PROD_URL

export default function CustomerDetail({user}) {

  // const [customerData, setCustomerData] = useState("")
  const {id} = useParams()

  useEffect(() => {
    console.log('user', user)

    getCustomerById()

  }, [])

  const getCustomerById = async () => {
    try {

      // await axios.get(`${BASE_URL}/categories/${id}`, {withCredentials:true})
      //           .then(result => {
      //             console.log('result', result)
      //             if(result.status == 200){
      //               setCustomerData(result.data.data)
      //             }
      //           })

    } catch (error) {
      toast.error('Failed, Failed when get Customer profile:' + error)
    }
  }

  return (
    <>
      <PageMeta
        title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          {/* <UserMetaCard /> */}
          <CustomerInfoCard id={id}/>
          {/* <UserAddressCard /> */}
        </div>
      </div>
    </>
  );
}
