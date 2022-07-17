import React, { useEffect, useState, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { FiSearch, FiEdit, FiTrash, FiPlus } from 'react-icons/fi';

import axios, { AxiosError } from 'axios';
import { api } from '../../services/api';

import { useAuth } from '../../hooks/auth';

import { Header } from '../../components/Header';
import { HeaderContent } from '../../components/HeaderContent';

import { Container, Content, ContainerInput, Table } from './styles';

interface IWriter {
  id: string;
  name: string;
}

interface IColumns {
  id: string;
  title: string;
  writer?: IWriter;
}

const Columns: React.FC = () => {
  const { user, updateToken } = useAuth();
  const location = useHistory();

  const [columns, setColumns] = useState<IColumns[]>([]);
  const [searchColumns, setSearchColumns] = useState<IColumns[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [idColumnsDelete, setIdColumnsDelete] = useState<IColumns>();

  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);

      if (term !== '') {
        const columnsSearch = columns;

        const columnsFilterSearch = columnsSearch.filter(column =>
          column.title.toUpperCase().includes(term.toLocaleUpperCase()),
        );

        setSearchColumns(columnsFilterSearch);
      } else {
        setSearchColumns(columns);
      }
    },
    [columns],
  );

  const handleEditColumns = useCallback(
    async (columns_id: string) => {
      location.push(`/colunas/editar/${columns_id}`);
    },
    [location],
  );

  const handleDelete = useCallback(
    async (columnsItem: IColumns) => {
      setIdColumnsDelete(columnsItem);
      try {
        const resultConfirm = confirm(
          `Deseja deletar a coluna: ${columnsItem.title}?`,
        );

        if (resultConfirm) {
          const result = await api.delete(
            `/writers_columns/delete/${columnsItem.id}`,
          );

          if (result.status === 204) {
            const columnsDeleted = columns.filter(c => c.id !== columnsItem.id);

            setColumns(columnsDeleted);
            setSearchColumns(columnsDeleted);
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
                if (idColumnsDelete) {
                  handleDelete(idColumnsDelete);
                }
              }
            }
          }
        }
      }
    },
    [columns, idColumnsDelete, updateToken],
  );

  useEffect(() => {
    document.title = 'Colunas';
  }, []);

  useEffect(() => {
    async function loadColumns() {
      try {
        if (user.type === 'user' && user.is_admin) {
          const response = await api.get('/writers_columns');

          setColumns(response.data);
          setSearchColumns(response.data);
        } else if (user.type === 'writer') {
          const response = await api.get(`/writers_columns/writer/${user.id}`);

          setColumns(response.data);
          setSearchColumns(response.data);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const errorAxios = err as AxiosError;

          if (errorAxios.response) {
            const statusCode = errorAxios.response.status;

            if (statusCode === 401) {
              const successRefreshToken = await updateToken();

              if (successRefreshToken) {
                loadColumns();
              }

              return;
            }

            alert('Ops! Ocorreu um problema, tente novamente');
          }
        }
      }
    }

    loadColumns();
  }, [updateToken, user.id, user.is_admin, user.type]);

  return (
    <Container>
      <Header />

      <Content>
        <div className="headerBack">
          <HeaderContent title="Colunas" />

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
          {user.type === 'writer' && (
            <Link to="/colunas/criar">
              <FiPlus size={18} /> <span>Novo</span>
            </Link>
          )}

          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                {user.type === 'writer' && <th>Ações</th>}
              </tr>
            </thead>

            <tbody>
              {searchColumns.map(columnsItem => (
                <tr key={columnsItem.id}>
                  <td>
                    <div>
                      <p>{columnsItem.title}</p>
                    </div>
                  </td>

                  <td>
                    <p>{columnsItem.writer?.name}</p>
                  </td>

                  {user.type === 'writer' && (
                    <td>
                      <button type="button">
                        <FiEdit
                          size={20}
                          onClick={() => handleEditColumns(columnsItem.id)}
                        />
                      </button>

                      <button type="button">
                        <FiTrash
                          size={20}
                          onClick={() => handleDelete(columnsItem)}
                        />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </Table>
      </Content>
    </Container>
  );
};

export { Columns };
