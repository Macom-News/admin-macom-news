import React, { useEffect, useCallback, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { FiSearch, FiPlus, FiEdit, FiTrash } from 'react-icons/fi';

import axios, { AxiosError } from 'axios';
import { api } from '../../services/api';

import { useAuth } from '../../hooks/auth';

import { Header } from '../../components/Header';
import { HeaderContent } from '../../components/HeaderContent';

import { Container, Content, ContainerInput, Table } from './styles';

interface IUser {
  id: string;
  name: string;
}

interface ISocialAction {
  id: string;
  title: string;
  enabled: boolean;
  user: IUser;
}

const SocialAction: React.FC = () => {
  const { user, updateToken } = useAuth();
  const location = useHistory();

  const [socialActions, setSocialActions] = useState<ISocialAction[]>([]);
  const [searchSocialActions, setSearchSocialActions] = useState<
    ISocialAction[]
  >([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [socialActionDelete, setSocialActionDelete] = useState<ISocialAction>();

  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);

      if (term !== '') {
        const socialActionSearch = socialActions;

        const socialActionFilterSearch = socialActionSearch.filter(n =>
          n.title.toUpperCase().includes(term.toLocaleUpperCase()),
        );

        setSearchSocialActions(socialActionFilterSearch);
      } else {
        setSearchSocialActions(socialActions);
      }
    },
    [socialActions],
  );

  const handleEditNews = useCallback(
    async (social_action_id: string) => {
      location.push(`/acao_social/editar/${social_action_id}`);
    },
    [location],
  );

  const handleDelete = useCallback(
    async (socialActionItem: ISocialAction) => {
      setSocialActionDelete(socialActionItem);
      try {
        const resultConfirm = confirm(
          `Deseja deletar a ação social: "${socialActionItem.title}"?`,
        );

        if (resultConfirm) {
          const result = await api.delete(
            `/social_actions_news/${socialActionItem.id}`,
          );

          if (result.status === 204) {
            const newsDeleted = socialActions.filter(
              n => n.id !== socialActionItem.id,
            );

            setSocialActions(newsDeleted);
            setSearchSocialActions(newsDeleted);
          }
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError;

          if (axiosError.response) {
            const statusCode = axiosError.response.status;

            if (statusCode === 401) {
              const successRefreshToken = await updateToken();

              if (successRefreshToken) {
                if (socialActionDelete) {
                  handleDelete(socialActionDelete);
                }
              }
            }
          }
        }
      }
    },
    [updateToken, socialActionDelete, socialActions],
  );

  useEffect(() => {
    document.title = 'Ação social';
  }, []);

  useEffect(() => {
    async function loadNews() {
      try {
        if (user.type === 'user' && user.is_admin) {
          const response = await api.get('/social_actions_news');

          setSocialActions(response.data);
          setSearchSocialActions(response.data);
        } else if (user.type === 'user') {
          const response = await api.get(`/social_actions_news/user`);

          setSocialActions(response.data);
          setSearchSocialActions(response.data);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const errorAxios = err as AxiosError;

          if (errorAxios.response) {
            const statusCode = errorAxios.response.status;

            if (statusCode === 401) {
              const successRefreshToken = await updateToken();

              if (successRefreshToken) {
                loadNews();
              }

              return;
            }

            alert('Ops! Ocorreu um problema, tente novamente');
          }
        }
      }
    }

    loadNews();
  }, [user, updateToken]);

  return (
    <Container>
      <Header />

      <Content>
        <div className="headerContent">
          <HeaderContent title="Ação Social" />

          <ContainerInput>
            <FiSearch size={20} color="#FFFFFF" />

            <input
              type="text"
              value={searchTerm}
              onChange={event => {
                handleSearch(event.target.value);
              }}
            />
          </ContainerInput>
        </div>

        <Table>
          <Link to="acao_social/criar">
            <FiPlus size={18} /> <span>Novo</span>
          </Link>

          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>Ativo</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {searchSocialActions.map(socialActionItem => (
                <tr key={socialActionItem.id}>
                  <td>
                    <p>{socialActionItem.title}</p>
                  </td>

                  <td>
                    <p>{socialActionItem.user?.name}</p>
                  </td>
                  <td>
                    <p>{socialActionItem.enabled ? 'Sim' : 'Não'}</p>
                  </td>

                  <td>
                    <button type="button">
                      <FiEdit
                        size={20}
                        onClick={() => handleEditNews(socialActionItem.id)}
                      />
                    </button>

                    <button type="button">
                      <FiTrash
                        size={20}
                        onClick={() => handleDelete(socialActionItem)}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Table>
      </Content>
    </Container>
  );
};

export { SocialAction };
