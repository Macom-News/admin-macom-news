import React, { useEffect, useCallback, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';

import { FiCamera } from 'react-icons/fi';

import { api } from '../../services/api';

import { useAuth } from '../../hooks/auth';

import { Header } from '../../components/Header';

import { Container, Content, AvatarInput, Box } from './styles';
import { HeaderContent } from '../../components/HeaderContent';

const Configuration: React.FC = () => {
  const { user, updateUser } = useAuth();

  const handleAvatarChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const formData = new FormData();

        formData.append('avatar', event.target.files[0]);

        if (user.type === 'user') {
          api.patch('/users_profile/avatar', formData).then(response => {
            const userUpdateAvatar = Object.assign(response.data, {
              type: 'user',
            });

            updateUser(userUpdateAvatar);
          });
        } else if (user.type === 'writer') {
          api.patch('/writers_profile/avatar', formData).then(response => {
            const userUpdateAvatar = Object.assign(response.data, {
              type: 'writer',
            });

            updateUser(userUpdateAvatar);
          });
        }
      }
    },
    [updateUser, user.type],
  );

  useEffect(() => {
    document.title = 'Configurações';
  }, []);

  return (
    <>
      <Header />
      <Container>
        <Content>
          <div className="headerContent">
            <HeaderContent title="Configurações" />
          </div>

          {/* <h1>Configurações</h1> */}

          <AvatarInput>
            {user.image_url && (
              <img src={user.image_url} alt="Imagem do perfil do usuário" />
            )}

            <label htmlFor="avatar_img" className="avatar_label">
              <FiCamera size={24} />

              <input
                type="file"
                id="avatar_img"
                onChange={handleAvatarChange}
              />
            </label>
          </AvatarInput>

          <Box>
            <a href={`usuarios/editar/${user.id}`}>Atualizar perfil</a>
          </Box>

          {user.type === 'user' && user.is_admin && (
            <>
              <Box>
                <Link to="/usuarios">Usuários</Link>
              </Box>

              <Box>
                <Link to="/colunistas">Colunistas</Link>
              </Box>

              <Box>
                <Link to="/planos">Planos</Link>
              </Box>
            </>
          )}
        </Content>
      </Container>
    </>
  );
};

export { Configuration };
