import { Outlet } from "react-router-dom";
import React from "react";

import NavbarEcommerce from "../components/NavbarEcommerce.jsx";
import Footer from "../components/Footer.jsx";

export default function EcommerceLayout() {
  return (
    <>
      <NavbarEcommerce />

      <Outlet />

      <Footer isEcommerce={true} />
    </>
  );
}