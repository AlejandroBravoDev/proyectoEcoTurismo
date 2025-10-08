import React, { use, useEffect, useState } from "react";
import SearchBar from "../components/Lugares/SearchBar";
import Cards from "../components/Lugares/Cards";
import SearchBarStyles from "../components/Lugares/lugares.module.css";
import Footer from "../components/footer";
import Header from "../components/header";
function Lugares() {
  return (
    <>
      <Header />
      <div className={SearchBarStyles.Background}>
        <SearchBar />
      </div>
      <Cards />
      <Footer />
    </>
  );
}

export default Lugares;
