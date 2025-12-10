import { AuthContext } from "../../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

export default function LogOut({}) {
  const { logout } = useContext(AuthContext);
 const navigate = useNavigate()

  useEffect(() => {
    logout();
    navigate("/login")
  }, []);



  return (
    <>
    Log out
    </>
  );
}
