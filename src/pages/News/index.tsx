import React, { useEffect, useCallback, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

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

interface INews {
  id: string;
  title: string;
  publication_schedule_date: Date;
  publication_schedule_date_formatted: string;
  level: number;
  user: IUser;
}

const News: React.FC = () => {
  const { user, updateToken } = useAuth();
  const location = useHistory();

  const [news, setNews] = useState<INews[]>([]);
  const [searchNews, setSearchNews] = useState<INews[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [idNewsDelete, setIdNewsDelete] = useState<INews>();

  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);

      if (term !== '') {
        const newsSearch = news;

        const newsFilterSearch = newsSearch.filter(n =>
          n.title.toUpperCase().includes(term.toLocaleUpperCase()),
        );

        setSearchNews(newsFilterSearch);
      } else {
        setSearchNews(news);
      }
    },
    [news],
  );

  const handleEditNews = useCallback(
    async (news_id: string) => {
      location.push(`/noticias/editar/${news_id}`);
    },
    [location],
  );

  const handleDelete = useCallback(
    async (newsItem: INews) => {
      setIdNewsDelete(newsItem);
      try {
        const resultConfirm = confirm(
          `Deseja deletar a notícia: ${newsItem.title}?`,
        );

        if (resultConfirm) {
          const result = await api.delete(`/news/delete/${newsItem.id}`);

          if (result.status === 204) {
            const newsDeleted = news.filter(n => n.id !== newsItem.id);

            setNews(newsDeleted);
            setSearchNews(newsDeleted);
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
                if (idNewsDelete) {
                  handleDelete(idNewsDelete);
                }
              }
            }
          }
        }
      }
    },
    [updateToken, idNewsDelete, news],
  );

  useEffect(() => {
    document.title = 'Notícias';
  }, []);

  useEffect(() => {
    async function loadNews() {
      try {
        if (user.type === 'user' && user.is_admin) {
          const response = await api.get('/news');

          const newsFormatted = response.data.map((newsItem: INews) => {
            const publicationScheduleDate = parseISO(
              newsItem.publication_schedule_date.toString(),
            );

            const newsResponse = {
              ...newsItem,
              publication_schedule_date_formatted: format(
                publicationScheduleDate,
                'dd/MM/yyyy',
                { locale: ptBR },
              ),
            } as INews;

            return newsResponse;
          });

          setNews(newsFormatted);
          setSearchNews(newsFormatted);
        } else if (user.type === 'user') {
          const response = await api.get(`/news/user/${user.id}`);

          const newsFormatted = response.data.map((newsItem: INews) => {
            const publicationScheduleDate = parseISO(
              newsItem.publication_schedule_date.toString(),
            );

            const newsResponse = {
              ...newsItem,
              publication_schedule_date_formatted: format(
                publicationScheduleDate,
                'dd/MM/yyyy',
                { locale: ptBR },
              ),
            } as INews;

            return newsResponse;
          });

          setNews(newsFormatted);
          setSearchNews(newsFormatted);
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
          <HeaderContent title="Notícias" />

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
          <Link to="noticias/criar">
            <FiPlus size={18} /> <span>Novo</span>
          </Link>

          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>Data agendada</th>
                <th>Grau</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {searchNews.map(newsItem => (
                <tr key={newsItem.id}>
                  <td>
                    <p>{newsItem.title}</p>
                  </td>

                  <td>
                    <p>{newsItem.user?.name}</p>
                  </td>

                  <td>
                    <p>{newsItem.publication_schedule_date_formatted}</p>
                  </td>

                  <td>
                    <p>{newsItem.level === 0 ? 'Geral' : newsItem.level}</p>
                  </td>

                  <td>
                    <button type="button">
                      <FiEdit
                        size={20}
                        onClick={() => handleEditNews(newsItem.id)}
                      />
                    </button>

                    <button type="button">
                      <FiTrash
                        size={20}
                        onClick={() => handleDelete(newsItem)}
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

export { News };
