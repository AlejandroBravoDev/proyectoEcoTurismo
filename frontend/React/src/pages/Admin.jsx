import React, { use, useEffect, useState } from "react";
import Admin from "../components/admin/Admin";
import PanelAdmin from "../components/panelAdmin/PanelAdmin";
import CardsAdmin from "../components/admin/CardsAdmins";
import Footer from "../components/footer";
import Header from "../components/header";
import useAuthRedirect from "../hooks/useAuthRedirect";
import useAdminRedirect from "../hooks/useAdminRedirect";

function Lugares() {
  useAuthRedirect();
  useAdminRedirect();

  return (
    <>
      <Header />
      <div>
        <PanelAdmin />
      </div>

      <Footer />
    </>
  );
}

export default Lugares;
