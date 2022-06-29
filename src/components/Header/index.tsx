import React from 'react';
import { Link } from 'react-router-dom';

import { FiSettings, FiPower } from 'react-icons/fi';
import { useAuth } from '../../hooks/auth';

import logoSvg from '../../assets/logo.svg';

import { Container, BoxLogo, Config } from './styles';

const Header: React.FC = () => {
  const { signOut, user } = useAuth();

  return (
    <Container>
      <Link to="/">
        <BoxLogo>
          <img src={String(logoSvg)} alt="MaçomNews" />

          <h1>Maçon News</h1>
        </BoxLogo>
      </Link>

      <Config>
        <div className="user_authenticate">
          <span>Olá,</span>
          <p>{user.name}</p>
        </div>

        <div>
          <Link to="/configuracoes">
            <FiSettings size={25} />
          </Link>
        </div>

        <div>
          <FiPower size={25} onClick={signOut} />
        </div>
      </Config>
    </Container>
  );
};

export { Header };
