'use client';

import Horizontal_Tab_Area_Pessoal from '@/components/Horizontal_Tab_Area_Pessoal';
import Toolbar from '@/components/Toolbar';
import Content_Cards_Container from '@/components/Content_Cards_Container';

import Content_Typology_General_Card from '@/components/Content_Typology_General_Card';

import { useDispatch, useSelector } from 'react-redux';

import { useState, useEffect } from 'react';

import { fetchContent } from '@/slicers/dataSlice';

export default function Area_Pessoal() {
  const { data, loading } = useSelector((state) => state.dataSlice); // Chamada da informação da "API" para mostrar o conteúdo
  const { numMecan } = useSelector((state) => state.userSlice);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchContent());
  }, []);

  const [filterLevel2, setFilterLevel2] = useState(false);
  const [finalData, setFinalData] = useState([]);

  const [filterTab, setFilterTab] = useState('Documentos pessoais');
  const [filterType, setFilterType] = useState('Tudo');
  const [searchParam, setSearchParam] = useState('');

  const handleTab = (activeTab) => {
    setFilterTab(activeTab);
  };

  const handleFilter = (type) => {
    setFilterType(type);
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

  // Tab Update Filters Reset

  useEffect(() => {
    setFilterType('Tudo');
  }, [filterTab]);

  useEffect(() => {
    let filteredDataLayer0, filteredDataLayer1, filteredDataLayer2;

    if (filterTab === 'Documentos pessoais') {
      filteredDataLayer0 = data.filter((item) => item.numMecan === numMecan /* .toString() */);
    } else if (filterTab === 'Guardados') {
      filteredDataLayer0 = data.filter((item) => item.saved);
    }

    if (filterType === 'Tudo') {
      filteredDataLayer1 = filteredDataLayer0;

      // Depois aqui posso colocar aqui o que acontece quando o array de resultados está vazio ou tratar disso apenas na outra página.
    } else {
      filteredDataLayer1 = filteredDataLayer0.filter((item) => item.content_typology === filterType);

      // Depois aqui posso colocar aqui o que acontece quando o array de resultados está vazio ou tratar disso apenas na outra página.
    }

    if (filterLevel2) {
      filteredDataLayer2 = filteredDataLayer1.filter(
        (item) => item.title.toLowerCase().includes(searchParam.toLowerCase()),
        // Depois aqui posso colocar aqui o que acontece quando o array de resultados está vazio ou tratar disso apenas na outra página.
      );

      setFinalData(filteredDataLayer2);
    } else {
      setFinalData(filteredDataLayer1);
    }
  }, [filterTab, filterType, searchParam, data, filterLevel2]);

  return (
    <main className="main">
      <Horizontal_Tab_Area_Pessoal onActiveTab={handleTab} />
      <div className="RightSide-Grid-Container">
        <div>
          <Toolbar
            onFilterType={handleFilter}
            onSearch={handleSearch}
            onTabUpdate={filterTab}
          />
          <Content_Cards_Container data={finalData} />
        </div>
        <div>
          <Content_Typology_General_Card />
        </div>
      </div>
    </main>
  );
}
