import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router";
import { RouterProvider } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import TanStackTable from "./components/tables/TanStackTable";
import Products from "./pages/Products/Products"
import Categories from "./pages/Categories/Categories"
import Orders from "./pages/Orders/Orders"
import Customers from "./pages/Customers/Customers"
import Balances from "./pages/Balances/Balances"
import ProductCreate from "./pages/Products/ProductCreate";
import ProductDetail from "./pages/Products/ProductDetail";
import CustomerCreate from "./pages/Categories/CategoryCreate";
import CategoryCreate from "./pages/Categories/CategoryCreate";
import ProtectedRoute from "./layout/ProtectedRoute";
import CustomerDetail from "./pages/Customers/CustomerDetail";
import CategoryDetail from "./pages/Categories/CategoryDetail";
import BalanceDetail from "./pages/Balances/BalanceDetail";
import OrderReports from "./pages/OrderReports/OrderReports"
import Cookies from "js-cookie";
import {useAuth} from './providers/AuthProvider'
import OrderDetail from "./pages/Orders/OrderDetail";
import { useSelector } from "react-redux";
import ResetPasswordForm from "./components/auth/ResetPasswordForm";
import ResetPassword from "./pages/AuthPages/ResetPassword";
// import { useCookies } from 'react-cookie'


export default function App() {
  // const [cookies, setCookie] = useCookies(['token'])
  const {userEmail} = useSelector(state => state.authReducer)
  const [userInfo, setUserInfo] = useState("")
  const [cookies, setCookie] = useState("")
  const navigate = useNavigate()
  // const {token} = useAuth()
  const auth = useAuth()
  const token = Cookies.get('token')

  const handleCookie = ({token}) => {
    // setCookie({token: token})

    // cookies.token = token

    // console.log('cookies', cookies.token)
  }

  useEffect(() => {

    if(token){
      setCookie(token)
      console.log('token: ', token, cookies, auth)
      // setToken(token)
    }
    console.log('auth', auth)
    console.log('userEmail', userEmail)

    if(userEmail){
      setUserInfo(userEmail)
    }else{
      // navigate('/admin/login')
    }
  }, [])

  const routesForPublic = [
    {
      path: "/service",
      element: <div>Service Page</div>,
    },
    {
      path: "/about-us",
      element: <div>About Us</div>,
    },
  ];

  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          path: "/",
          element: <div>User Home Page</div>,
        },
        {
          path: "/profile",
          element: <div>User Profile</div>,
        },
        {
          path: "/logout",
          element: <div>Logout</div>,
        },
      ],
    },
  ];

  const routesForNotAuthenticatedOnly = [
    {
      path: "/",
      element: <div>Home Page</div>,
    },
    {
      path: "/login",
      element: <div>Login</div>,
    },
  ];

  // const router = createBrowserRouter([
  //   ...routesForPublic,
  //   ...(!token ? routesForNotAuthenticatedOnly : []),
  //   ...routesForAuthenticatedOnly,
  // ]);

  return (
    <>
      {/* <RouterProvider router={router} /> */}
    {/* <CookiesProvider> */}
      {/* <Router> */}
        <ScrollToTop />
        <Routes>

          {/* Dashboard Layout */}

          <Route element={<ProtectedRoute user={userInfo} />}>
            <Route element={<AppLayout user={userInfo} />}>
            <Route index path="/" element={ <Home user={userInfo} />} />
              {/* Others Page */}
              <Route path="/profile" element={<UserProfiles user={userInfo} />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />

              {/* Forms */}
              <Route path="/form-elements" element={<FormElements />} />

              {/* Tables */}
              <Route path="/basic-tables" element={<BasicTables />} />
              <Route path="/products" element={<Products user={userInfo} />} />
            {/* <Route path="/products" element={<TanStackTable />} /> */}
              <Route path="/products/:id" element={<ProductDetail user={userInfo} />} />
              <Route path="/products/add" element={<ProductCreate user={userInfo} />} />
              <Route path="/categories" element={<Categories user={userInfo} />} />
              <Route path="/categories/add" element={<CategoryCreate user={userInfo}/>} />
              <Route path="/categories/:id" element={<CategoryDetail user={userInfo}/>} />
              <Route path="/orders" element={<Orders user={userInfo}/>} />
              <Route path="/orders/:id" element={<OrderDetail user={userInfo}/>} />
              <Route path="/customers" element={<Customers user={userInfo}/>} />
              <Route path="/customers/:id" element={<CustomerDetail user={userInfo}/>} />
              <Route path="/balances" element={<Balances user={userInfo}/>} />
              <Route path="/balances/:id" element={<BalanceDetail user={userInfo}/>} />
              <Route path="/order-reports" element={<OrderReports user={userInfo}/>} />

              {/* Ui Elements */}
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />

              {/* Charts */}
              {/* <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} /> */}
            </Route>
          </Route>

          {/* Auth Layout */}
          <Route path="/admin/login" element={<SignIn user={userInfo} />} />
          <Route path="/admin/register" element={<SignUp user={userInfo}/>} />
          <Route path="/admin/reset-password" element={<ResetPassword user={userInfo}/>} />
          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />


        </Routes>
      {/* </Router> */}
    {/* </CookiesProvider> */}
    </>
  );
}
