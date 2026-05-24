import LogoutCard from "./LogoutCard";
import useLogout from "./useLogout";

function Logout() {
  const { message } = useLogout();

  return (
    <section className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
      <LogoutCard message={message} />
    </section>
  );
}

export default Logout;