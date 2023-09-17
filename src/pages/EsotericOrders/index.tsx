import { useEffect, useCallback, useState } from 'react';
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

interface IEsotericOrder {
  id: string;
  title: string;
  user: IUser;
}

const EsotericOrders = () => {
  const { user, updateToken } = useAuth();
  const location = useHistory();

  const [esotericOrders, setEsotericOrders] = useState<IEsotericOrder[]>([]);
  const [searchEsotericOrders, setSearchEsotericOrders] = useState<
    IEsotericOrder[]
  >([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [idEsotericOrderDelete, setIdEsotericOrderDelete] =
    useState<IEsotericOrder>();

  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);

      if (term !== '') {
        const esotericOrdersSearch = esotericOrders;

        const esotericOrdersFilterSearch = esotericOrdersSearch.filter(i =>
          i.title.toUpperCase().includes(term.toLocaleUpperCase()),
        );

        setSearchEsotericOrders(esotericOrdersFilterSearch);
      } else {
        setSearchEsotericOrders(esotericOrders);
      }
    },
    [esotericOrders],
  );

  const handleEditEsotericOrder = useCallback(
    async (esotericOrderid: string) => {
      location.push(`/ordens_esotericas/editar/${esotericOrderid}`);
    },
    [location],
  );

  const handleDelete = useCallback(
    async (esotericOrderItem: IEsotericOrder) => {
      setIdEsotericOrderDelete(esotericOrderItem);
      try {
        const resultConfirm = confirm(
          `Deseja deletar a ordem esotérica: ${esotericOrderItem.title}?`,
        );

        if (resultConfirm) {
          const result = await api.delete(
            `/esoteric_orders/${esotericOrderItem.id}`,
          );

          if (result.status === 204) {
            const esotericOrderDeleted = esotericOrders.filter(
              i => i.id !== esotericOrderItem.id,
            );

            setEsotericOrders(esotericOrderDeleted);
            setSearchEsotericOrders(esotericOrderDeleted);
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
                if (idEsotericOrderDelete) {
                  handleDelete(idEsotericOrderDelete);
                }
              }
            }
          }
        }
      }
    },
    [idEsotericOrderDelete, esotericOrders, updateToken],
  );

  useEffect(() => {
    document.title = 'Ordens esotéricas';
  }, []);

  useEffect(() => {
    async function loadEsotericOrders() {
      try {
        if (user.type === 'user' && user.is_admin) {
          const response = await api.get('/esoteric_orders');

          setEsotericOrders(response.data);
          setSearchEsotericOrders(response.data);
        } else if (user.type === 'user') {
          const response = await api.get(`/esoteric_orders/user/${user.id}`);

          setEsotericOrders(response.data);
          setSearchEsotericOrders(response.data);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const errorAxios = err as AxiosError;

          if (errorAxios.response) {
            const statusCode = errorAxios.response.status;

            if (statusCode === 401) {
              const successRefreshToken = await updateToken();

              if (successRefreshToken) {
                loadEsotericOrders();
              }

              return;
            }

            alert('Ops! Ocorreu um problema, tente novamente');
          }
        }
      }
    }

    loadEsotericOrders();
  }, [user, updateToken]);

  return (
    <Container>
      <Header />

      <Content>
        <div className="headerContent">
          <HeaderContent title="Ordens esotéricas" />

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
          <Link to="ordens_esotericas/criar">
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
              {searchEsotericOrders.map(esotericOrderItem => (
                <tr key={esotericOrderItem.id}>
                  <td>
                    <p>{esotericOrderItem.title}</p>
                  </td>

                  <td>
                    <p>{esotericOrderItem.user?.name}</p>
                  </td>

                  <td>
                    <button type="button">
                      <FiEdit
                        size={20}
                        onClick={() =>
                          handleEditEsotericOrder(esotericOrderItem.id)
                        }
                      />
                    </button>

                    <button type="button">
                      <FiTrash
                        size={20}
                        onClick={() => handleDelete(esotericOrderItem)}
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

export { EsotericOrders };
