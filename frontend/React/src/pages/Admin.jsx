import React, { use, useEffect, useState } from "react";
import Admin from "../components/admin/Admin";
import CardsAdmin from "../components/admin/CardsAdmins";
import Cards from "../components/Lugares/Cards";
import SearchBarStyles from "../components/Lugares/lugares.module.css";
import Footer from "../components/footer";
import Header from "../components/header";
function Lugares() {
  return (
    <>
      <Header />
      <div className={SearchBarStyles.Background}>
        <Admin />
      </div>
      <CardsAdmin />
      <Footer />
    </>
  );
}

export default Lugares;
