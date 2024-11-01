'use client';

import Toolbar from '@/components/Toolbar';
import Content_Cards_Container from '@/components/Content_Cards_Container';

import { useDispatch, useSelector } from 'react-redux';

import { useState, useEffect, useCallback } from 'react';

import { fetchContent } from '@/slicers/dataSlice';

// import { getExampleProduct } from '@/api';

export default function Arquivo_UA() {
  const { data, loading } = useSelector((state) => state.dataSlice); // Chamada da informação da "API" para mostrar o conteúdo

  // const [exampleProduct, setexampleProduct] = useState({
  //   data: null,
  //   loading: false,
  // });

  // const getExampleProductFromApi = useCallback(async () => {
  //   setexampleProduct((previous) => ({ data: null, loading: true }));
  //   const quote = await getExampleProduct();
  //   setexampleProduct((previous) => ({ data: quote, loading: false }));
  // });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchContent());
  }, []);

  const [filterLevel2, setFilterLevel2] = useState(false);
  const [finalData, setFinalData] = useState([]);

  const [filter, setFilter] = useState('Tudo');
  const [searchParam, setSearchParam] = useState('');

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

    if (filter === 'Tudo') {
      filteredDataLayer1 = data;

      // Depois aqui posso colocar aqui o que acontece quando o array de resultados está vazio ou tratar disso apenas na outra página.
    } else {
      filteredDataLayer1 = data.filter((item) => item.content_typology === filter);

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
  }, [filter, searchParam, data, filterLevel2]);

  const desktopBreakpoint = '(min-width: 1066px)';
  const isMatching = window.matchMedia(desktopBreakpoint).matches;
  const [mediaQueryMatches, setMediaQueryMatches] = useState(isMatching);

  useEffect(() => {
    // Define a função de verificação da media query
    const checkMediaQuery = () => {
      const isMatching = window.matchMedia(desktopBreakpoint).matches;
      setMediaQueryMatches(isMatching);
    };

    // Adiciona um listener de eventos para mudanças na media query
    const mediaQueryList = window.matchMedia(desktopBreakpoint);
    mediaQueryList.addEventListener('change', checkMediaQuery);

    // Limpeza ao desmontar o componente
    return () => mediaQueryList.removeEventListener('change', checkMediaQuery);
  }, []); // Não depende de nada, roda apenas na montagem do componente

  return (
    <main className="main">
      {/* <div>
        <button
          type="button"
          onClick={getExampleProductFromApi}
        >
          Get Product
        </button>
        {exampleProduct.loading
          ? 'Loading product'
          : exampleProduct.data && (
              <div>
                <div>Product: {exampleProduct.data.title}</div>
                <div>Price: {exampleProduct.data.price}</div>
              </div>
            )}
      </div> */}
      {mediaQueryMatches !== undefined && !mediaQueryMatches && <h1>Arquivo UA</h1>}
      <Toolbar
        onFilterType={handleFilter}
        filter={filter}
        onSearch={handleSearch}
        mediaQueryMatches={mediaQueryMatches}
      />
      <Content_Cards_Container
        site="ArquivoUA"
        data={finalData}
        mediaQueryMatches={mediaQueryMatches}
      />
    </main>
  );
}
