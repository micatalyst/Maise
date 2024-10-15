'use client';

import '@/styles/components/Navbar_Desktop.scss';

import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleHalfStroke, faUniversalAccess } from '@fortawesome/free-solid-svg-icons';

import { usePathname } from 'next/navigation';

import { useState, useEffect } from 'react';

export default function Navbar_Desktop({ toggleTheme }) {
  const pathname = usePathname(); // Get current pathname

  const [activePath, setActivePath] = useState(pathname);

  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  return (
    <nav
      className="nav-desktop"
      aria-label="Navegação principal"
    >
      <ul>
        <li>
          <Link
            href="/"
            className={activePath === '/' ? 'active' : ''}
          >
            Arquivo UA
          </Link>
        </li>
        <li>
          <Link
            href="/Tornar_Acessivel"
            className={activePath === '/Tornar_Acessivel' ? 'active' : ''}
          >
            Tornar Acessível
          </Link>
        </li>
        <li>
          <Link
            href="/Area_Pessoal"
            className={activePath === '/Area_Pessoal' ? 'active' : ''}
          >
            Área Pessoal
          </Link>
        </li>
        <li>
          <Link
            href="/Ajuda"
            className={activePath === '/Ajuda' ? 'active' : ''}
          >
            Ajuda
          </Link>
        </li>
        <li>
          <Link
            href="/Sobre"
            className={activePath === '/Sobre' ? 'active' : ''}
          >
            Sobre
          </Link>
        </li>
        <li>
          <button
            type="button"
            onClick={toggleTheme}
          >
            <FontAwesomeIcon icon={faCircleHalfStroke} />
          </button>
        </li>
        {/* <li>
          <button type="button">
            <FontAwesomeIcon icon={faUniversalAccess} />
          </button>
        </li> */}
      </ul>
    </nav>
  );
}
