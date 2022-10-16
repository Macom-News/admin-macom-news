import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { FiUsers, FiTrello, FiMic } from 'react-icons/fi';

import { useAuth } from '../../hooks/auth';

import { Container, Content, GridLayout, Box } from './styles';
import { Header } from '../../components/Header';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'Dashboard';
  }, []);

  return (
    <Container>
      <Header />

      <Content>
        <GridLayout>
          {user.type === 'user' && user.is_admin && (
            <Link to="/clientes">
              <Box>
                <FiUsers size={30} />
                <h2>Clientes</h2>
              </Box>
            </Link>
          )}

          {user.type === 'user' && (
            <>
              <Link to="/noticias">
                <Box>
                  <FiTrello size={30} />
                  <h2>Matérias</h2>
                </Box>
              </Link>

              <Link to="/acao_social">
                <Box>
                  <FiTrello size={30} />
                  <h2>Ações sociais</h2>
                </Box>
              </Link>

              <Link to="/entrevistas">
                <Box>
                  <FiMic size={30} />
                  <h2>Entrevistas</h2>
                </Box>
              </Link>
            </>
          )}

          <Link to="/colunas">
            <Box>
              <FiTrello size={30} />
              <h2>Colunas</h2>
            </Box>
          </Link>

          <Link to="/notificacoes">
            <Box>
              <FiTrello size={30} />
              <h2>Notificações</h2>
            </Box>
          </Link>
        </GridLayout>
      </Content>
    </Container>
  );
};

export { Dashboard };
