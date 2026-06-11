import { Outlet } from "react-router-dom";
import React from "react";

import NavbarCompany from "../components/NavbarCompany.jsx";
import Footer from "../components/Footer.jsx";

export default function CompanyLayout() {
  return (
    <>
      <NavbarCompany />

      <Outlet />

      <Footer isEcommerce={false} />
    </>
  );
}