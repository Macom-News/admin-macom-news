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
  email: string;
  enabled: boolean;
}

const Writers: React.FC = () => {
  const { updateToken } = useAuth();
  const location = useHistory();

  const [writers, setWriters] = useState<IWriter[]>([]);
  const [searchWriters, setSearchWriters] = useState<IWriter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [writerDelete, setWriterDelete] = useState<IWriter>();

  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);

      if (term !== '') {
        const writersSearch = writers;

        const writerFilterSearch = writersSearch.filter(writer =>
          writer.name.toUpperCase().includes(term.toLocaleUpperCase()),
        );

        setSearchWriters(writerFilterSearch);
      } else {
        setSearchWriters(writers);
      }
    },
    [writers],
  );

  const handleEditWriter = useCallback(
    async (writer_id: string) => {
      location.push(`/colunistas/editar/${writer_id}`);
    },
    [location],
  );

  const handleDelete = useCallback(
    async (writerItem: IWriter) => {
      setWriterDelete(writerItem);
      try {
        const resultConfirm = confirm(
          `Deseja deletar o colunista: "${writerItem.name}"?`,
        );

        if (resultConfirm) {
          const result = await api.delete(`/writers/delete/${writerItem.id}`);

          if (result.status === 204) {
            const writerDeleted = writers.filter(w => w.id !== writerItem.id);

            setWriters(writerDeleted);
            setSearchWriters(writerDeleted);
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
                if (writerDelete) {
                  handleDelete(writerDelete);
                }
              }
            }
          }
        }
      }
    },
    [updateToken, writerDelete, writers],
  );

  useEffect(() => {
    document.title = 'Colunistas';
  }, []);

  useEffect(() => {
    async function loadWriters() {
      try {
        const response = await api.get('/writers');

        setWriters(response.data);
        setSearchWriters(response.data);
      } catch (err) {
        alert('Ops! Algo inesperado ocorreu, tente novamente');
        console.log(err);
      }
    }

    loadWriters();
  }, []);

  return (
    <Container>
      <Header />

      <Content>
        <div className="headerBack">
          <HeaderContent title="Colunistas" />

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
          <Link to="colunistas/criar">
            <FiPlus size={18} /> <span>Novo</span>
          </Link>

          <table>
            <thead>
              <tr>
                <th>Nome/E-mail</th>
                <th>Ativo</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {searchWriters.map(writer => (
                <tr key={writer.id}>
                  <td>
                    <div>
                      <p>{writer.name}</p>
                      <span>{writer.email}</span>
                    </div>
                  </td>

                  <td>{writer.enabled ? 'Sim' : 'Não'}</td>

                  <td>
                    <button type="button">
                      <FiEdit
                        size={20}
                        onClick={() => handleEditWriter(writer.id)}
                      />
                    </button>

                    <button type="button">
                      <FiTrash size={20} onClick={() => handleDelete(writer)} />
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

export { Writers };
