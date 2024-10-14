'use client';

import Link from 'next/link';

import '@/styles/components/Header.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import { useState, useEffect } from 'react';

import { usePathname } from 'next/navigation';

//import { useMediaQuery } from '@/hooks/useMediaQuery';

import Navbar_Desktop from '@/components/Navbar_Desktop';
import Navbar_Mobile from '@/components/Navbar_Mobile';

export default function Header() {
  //const mediaQueryMatches = useMediaQuery('--laptop');

  const path = usePathname();

  const [pathName, setPathName] = useState('');

  useEffect(() => {
    switch (path) {
      case '/':
        return setPathName('Arquivo UA');
      case '/Tornar_Acessivel':
        return setPathName('Tornar Acessível');
      case '/Area_Pessoal':
        return setPathName('Área Pessoal');
      case '/Ajuda':
        return setPathName('Ajuda');
      case '/Sobre':
        return setPathName('Sobre');
    }
  }, [path]);

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

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  useEffect(() => {
    if (mediaQueryMatches && isDropDownOpen) {
      setIsDropDownOpen(false);
    }
  }, [mediaQueryMatches]);

  const handleOpenDropDown = () => {
    setIsDropDownOpen(!isDropDownOpen); // set true if false / set false if true
  };

  const MobileHeader = (
    <header className="header-mobile">
      <div className="logotipo-text">
        <Link href="/">MAISE</Link>
      </div>
      {/* <div>{pathName}</div> */}
      <button
        type="button"
        onClick={handleOpenDropDown}
      >
        <FontAwesomeIcon icon={faBars} />
      </button>
      {
        <Navbar_Mobile
          isDropDownOpen={isDropDownOpen}
          setIsDropDownOpen={setIsDropDownOpen}
        />
      }
    </header>
  );

  const DesktopHeader = (
    <header className="header-desktop">
      <div className="logotipo-text">
        <Link href="/">MAISE</Link>
      </div>
      <Navbar_Desktop />
      <button type="button">
        <FontAwesomeIcon icon={faRightFromBracket} /> Sair
      </button>
    </header>
  );

  return mediaQueryMatches === undefined ? '' : mediaQueryMatches ? DesktopHeader : MobileHeader;
}
