import React from "react";
import useAuthRedirect from "../hooks/useAuthRedirect";
import Hospedaje from "../components/Hospedajes";

function HospedajesPage() {
  useAuthRedirect();
  return (
    <div>
      <Hospedaje />
    </div>
  );
}

export default HospedajesPage;
