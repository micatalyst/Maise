"use client";

import Toolbar from "@/components/Toolbar";
import Content_Cards_Container from "@/components/Content_Cards_Container";

import { useSelector } from "react-redux";

import { useState, useEffect } from "react";

export default function Arquivo_UA() {
  const Data = useSelector((state) => state.dataSlice.data); // Chamada da informação da "API" para mostrar o conteúdo

  const [filterLevel2, setFilterLevel2] = useState(false);
  const [finalData, setFinalData] = useState([]);

  const [filter, setFilter] = useState("Tudo");
  const [searchParam, setSearchParam] = useState("");

  const handleFilter = (type) => {
    setFilter(type);
  };

  const handleSearch = (searchValue) => {
    if (searchValue) {
      setSearchParam(searchValue);
      setFilterLevel2(true);
    } else {
      setFilterLevel2(false);
    }
  };

  // Neste momento eu tenho o useEffect apenas a atuar quando o input de pesquisa é diferente do anterior input (portanto spamar o "enter" num mesmo input seguido, não provoca o useEffect)
  // Isto acontece porque nas dependencias do useEffect, a variável de estado "searchParam" possui dados primitivos
  //(Ex: Números, strings, booleanos, null, undefined) e não objetos ou arrays cuja comparação dos dados é feita pela sua referência e não apenas pelo seu valor.

  useEffect(() => {
    let filteredDataLayer1, filteredDataLayer2;

    if (filter === "Tudo") {
      filteredDataLayer1 = Data;

      // Depois aqui posso colocar aqui o que acontece quando o array de resultados está vazio ou tratar disso apenas na outra página.
    } else {
      filteredDataLayer1 = Data.filter(
        (item) => item.content_typology === filter
      );

      // Depois aqui posso colocar aqui o que acontece quando o array de resultados está vazio ou tratar disso apenas na outra página.
    }

    if (filterLevel2) {
      filteredDataLayer2 = filteredDataLayer1.filter(
        (item) => item.title.toLowerCase().includes(searchParam.toLowerCase())
        // Depois aqui posso colocar aqui o que acontece quando o array de resultados está vazio ou tratar disso apenas na outra página.
      );

      setFinalData(filteredDataLayer2);
    } else {
      setFinalData(filteredDataLayer1);
    }
  }, [filter, searchParam, Data, filterLevel2]);

  return (
    <main className="main">
      <Toolbar onFilterType={handleFilter} onSearch={handleSearch} />
      <Content_Cards_Container data={finalData} />
    </main>
  );
}
