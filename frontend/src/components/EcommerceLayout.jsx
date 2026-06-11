import { Outlet } from "react-router-dom";
import React from "react";

import NavbarCompany from "./NavbarCompany.jsx";
import Footer from "./Footer.jsx";

export default function CompanyLayout() {
  return (
    <>
      <NavbarCompany />

      <Outlet />

      <Footer isEcommerce={false} />
    </>
  );
}