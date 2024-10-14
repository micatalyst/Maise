'use client';

import '@/styles/components/Navbar_Mobile.scss';

import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleHalfStroke, faUniversalAccess } from '@fortawesome/free-solid-svg-icons';

import { usePathname } from 'next/navigation';

import { useState, useEffect } from 'react';

export default function Navbar_Mobile({ isDropDownOpen, setIsDropDownOpen }) {
  const pathname = usePathname(); // Get current pathname

  //const pxToRem = (px) => px / parseFloat(getComputedStyle(document.documentElement).fontSize);

  const [activePath, setActivePath] = useState(pathname);

  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  return (
    <nav
      className={`nav-mobile ${isDropDownOpen ? 'open' : ''}`}
      aria-label="Navegação principal"
    >
      <ul>
        <li>
          <Link
            href="/"
            className={activePath === '/' ? 'active' : ''}
            onClick={() => setIsDropDownOpen(false)}
          >
            Arquivo UA
          </Link>
        </li>
        <li>
          <Link
            href="/Tornar_Acessivel"
            className={activePath === '/Tornar_Acessivel' ? 'active' : ''}
            onClick={() => setIsDropDownOpen(false)}
          >
            Tornar Acessível
          </Link>
        </li>
        <li>
          <Link
            href="/Area_Pessoal"
            className={activePath === '/Area_Pessoal' ? 'active' : ''}
            onClick={() => setIsDropDownOpen(false)}
          >
            Área Pessoal
          </Link>
        </li>
        <li>
          <Link
            href="/Ajuda"
            className={activePath === '/Ajuda' ? 'active' : ''}
            onClick={() => setIsDropDownOpen(false)}
          >
            Ajuda
          </Link>
        </li>
        <li>
          <Link
            href="/Sobre"
            className={activePath === '/Sobre' ? 'active' : ''}
            onClick={() => setIsDropDownOpen(false)}
          >
            Sobre
          </Link>
        </li>
        <li>
          <button type="button">
            <FontAwesomeIcon icon={faCircleHalfStroke} />
          </button>
        </li>
      </ul>
    </nav>
  );
}
