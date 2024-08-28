"use client";

import Toolbar from "@/components/Toolbar";
import Content_Cards_Container from "@/components/Content_Cards_Container";

//import Data from "@/Data/Data";

import { useSelector } from "react-redux";

import { useState } from "react";

export default function Arquivo_UA() {
  const Data = useSelector((state) => state.dataSlice.data);
  /* console.log("Teste de useSelector"); */

  const [filter, setFilter] = useState("Tudo");
  const [filteredData, setFilteredData] = useState(Data);

  const handleFilter = (type) => {
    setFilter(type);

    if (type === "Tudo") {
      setFilteredData(Data);
    } else {
      const newFilteredData = Data.filter(
        (item) => item.content_typology === type
      );
      setFilteredData(newFilteredData);
    }
  };

  return (
    <main className="main">
      <Toolbar onFilter={handleFilter} />
      <Content_Cards_Container data={filteredData} />
    </main>
  );
}
