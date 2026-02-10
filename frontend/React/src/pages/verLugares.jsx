import ScrollToTop from "../components/ScrollToTop";
import VerLugares from "../components/verLugares/verLugares";
import useAuthRedirect from "../hooks/useAuthRedirect";

function verLugares() {
  useAuthRedirect();
  return (
    <>
      <VerLugares />
    </>
  );
}

export default verLugares;
