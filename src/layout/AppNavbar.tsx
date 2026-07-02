import React from "react";
import { useState, useEffect } from "react";

import UserDropdown from "components/Dropdowns/UserDropdown.js";
import { useLocation } from "react-router-dom";

export default function AppNavbar() {
  const location = useLocation()
  const page = location.pathname.split('/')[1]

  const [page_title, setPageTitle] = useState(page || '')

  useEffect(() => {
    if(page==='products'){
      setPageTitle('Produk')
    }
    if(page==='categories'){
      setPageTitle('Kategori')
    }
    if(page==='orders'){
      setPageTitle('Pemesanan')
    }
    if(page==='customers'){
      setPageTitle('Pelanggan')
    }
    if(page==='profile'){
      setPageTitle('Akun')
    }
  }, [page])
  return (
    <>

      {/* <!-- Breadcrumb --> */}
      {page_title}
      <nav className="flex p-3 bg-neutral-secondary-medium border border-default-medium rounded-base mt-0 mb-3" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <a href={`/`} className="inline-flex items-center text-sm font-medium text-body hover:text-fg-brand">
              <svg className="w-4 h-4 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"/></svg>
              Dashboard
            </a>
          </li>
          {page_title && (
            <li>
              <div className="flex items-center space-x-1.5">
                <svg className="w-3.5 h-3.5 rtl:rotate-180 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7"/></svg>
                <a href="" className="inline-flex items-center text-sm font-medium text-body hover:text-fg-brand">{page_title?.slice(0,1).toUpperCase() + page_title?.slice(- (page_title?.length - 1))}</a>
              </div>
            </li>
          )}
          {/* <li aria-current="page">
            <div className="flex items-center space-x-1.5">
              <svg className="w-3.5 h-3.5 rtl:rotate-180 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7"/></svg>
              <span className="inline-flex items-center text-sm font-medium text-body-subtle">Flowbite</span>
            </div>
          </li> */}
        </ol>
      </nav>

      {/* End Navbar */}
    </>
  );
}
