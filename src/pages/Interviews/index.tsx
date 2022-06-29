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

interface IInterviews {
  id: string;
  title: string;
  user: IUser;
}

const Interviews: React.FC = () => {
  const { user, updateToken } = useAuth();
  const location = useHistory();

  const [interviews, setInterviews] = useState<IInterviews[]>([]);
  const [searchInterviews, setSearchInterviews] = useState<IInterviews[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [idInterviewsDelete, setIdInterviewsDelete] = useState<IInterviews>();

  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);

      if (term !== '') {
        const interviewsSearch = interviews;

        const interviewsFilterSearch = interviewsSearch.filter(i =>
          i.title.toUpperCase().includes(term.toLocaleUpperCase()),
        );

        setSearchInterviews(interviewsFilterSearch);
      } else {
        setSearchInterviews(interviews);
      }
    },
    [interviews],
  );

  const handleEditInterviews = useCallback(
    async (interviews_id: string) => {
      location.push(`/entrevistas/editar/${interviews_id}`);
    },
    [location],
  );

  const handleDelete = useCallback(
    async (interviewsItem: IInterviews) => {
      setIdInterviewsDelete(interviewsItem);
      try {
        const resultConfirm = confirm(
          `Deseja deletar a entrevista: ${interviewsItem.title}?`,
        );

        if (resultConfirm) {
          const result = await api.delete(`/interviews/${interviewsItem.id}`);

          if (result.status === 204) {
            const interviewsDeleted = interviews.filter(
              i => i.id !== interviewsItem.id,
            );

            setInterviews(interviewsDeleted);
            setSearchInterviews(interviewsDeleted);
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
                if (idInterviewsDelete) {
                  handleDelete(idInterviewsDelete);
                }
              }
            }
          }
        }
      }
    },
    [idInterviewsDelete, interviews, updateToken],
  );

  useEffect(() => {
    document.title = 'Entrevistas';
  }, []);

  useEffect(() => {
    async function loadInterviews() {
      try {
        if (user.type === 'user' && user.is_admin) {
          const response = await api.get('/interviews');

          setInterviews(response.data);
          setSearchInterviews(response.data);
        } else if (user.type === 'user') {
          const response = await api.get(`/interviews/user/${user.id}`);

          setInterviews(response.data);
          setSearchInterviews(response.data);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const errorAxios = err as AxiosError;

          if (errorAxios.response) {
            const statusCode = errorAxios.response.status;

            if (statusCode === 401) {
              const successRefreshToken = await updateToken();

              if (successRefreshToken) {
                loadInterviews();
              }

              return;
            }

            alert('Ops! Ocorreu um problema, tente novamente');
          }
        }
      }
    }

    loadInterviews();
  }, [user, updateToken]);

  return (
    <Container>
      <Header />

      <Content>
        <div className="headerContent">
          <HeaderContent title="Entrevistas" />

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
          <Link to="entrevistas/criar">
            <FiPlus size={18} /> <span>Novo</span>
          </Link>

          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {searchInterviews.map(interviewsItem => (
                <tr key={interviewsItem.id}>
                  <td>
                    <p>{interviewsItem.title}</p>
                  </td>

                  <td>
                    <p>{interviewsItem.user?.name}</p>
                  </td>

                  <td>
                    <button type="button">
                      <FiEdit
                        size={20}
                        onClick={() => handleEditInterviews(interviewsItem.id)}
                      />
                    </button>

                    <button type="button">
                      <FiTrash
                        size={20}
                        onClick={() => handleDelete(interviewsItem)}
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

export { Interviews };
