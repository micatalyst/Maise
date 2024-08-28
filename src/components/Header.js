"use client";

import "@/styles/components/Header.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setData } from "@/slicers/dataSlice";

/* import Data from "@/Data/Data"; */

import Navbar from "@/components/Navbar";

export default function Header() {

  /* const dispatch = useDispatch();
  dispatch(setData(Data));
  console.log("Teste de dispatch"); */

  return (
    <header className="header">
      <div className="logotipo-text"> MAISE </div>
      <Navbar />
      <button type="button">
        <FontAwesomeIcon icon={faRightFromBracket} /> Sair
      </button>
    </header>
  );
}
