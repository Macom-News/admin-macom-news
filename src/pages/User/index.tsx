import React, { useEffect, useState, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { FiSearch, FiEdit, FiTrash, FiPlus } from 'react-icons/fi';

import axios, { AxiosError } from 'axios';
import { api } from '../../services/api';

import { useAuth } from '../../hooks/auth';

import { Header } from '../../components/Header';
import { HeaderContent } from '../../components/HeaderContent';

import { Container, Content, ContainerInput, Table } from './styles';

interface IUser {
  id: string;
  name: string;
  email: string;
  is_admin: boolean;
  enabled: boolean;
}

const Users: React.FC = () => {
  const { updateToken } = useAuth();
  const location = useHistory();

  const [users, setUsers] = useState<IUser[]>([]);
  const [searchUsers, setSearchUsers] = useState<IUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userDelete, setUserDelete] = useState<IUser>();

  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);

      if (term !== '') {
        const usersSearch = users;

        const userFilterSearch = usersSearch.filter(u =>
          u.name.toUpperCase().includes(term.toLocaleUpperCase()),
        );

        setSearchUsers(userFilterSearch);
      } else {
        setSearchUsers(users);
      }
    },
    [users],
  );

  const handleEditUser = useCallback(
    async (user_id: string) => {
      location.push(`/usuarios/editar/${user_id}`);
    },
    [location],
  );

  const handleDelete = useCallback(
    async (userItem: IUser) => {
      setUserDelete(userItem);
      try {
        const resultConfirm = confirm(
          `Deseja deletar o usuário: "${userItem.name}"?`,
        );

        if (resultConfirm) {
          const result = await api.delete(`/users/delete/${userItem.id}`);

          if (result.status === 204) {
            const userDeleted = users.filter(u => u.id !== userItem.id);

            setUsers(userDeleted);
            setSearchUsers(userDeleted);
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
                if (userDelete) {
                  handleDelete(userDelete);
                }
              }
            }
          }
        }
      }
    },
    [updateToken, userDelete, users],
  );

  useEffect(() => {
    document.title = 'Usuários';
  }, []);

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await api.get('/users');

        setUsers(response.data);
        setSearchUsers(response.data);
      } catch (err) {
        alert('Ops! Algo inesperado ocorreu, tente novamente');
      }
    }

    loadUsers();
  }, []);

  return (
    <Container>
      <Header />

      <Content>
        <div className="headerContent">
          <HeaderContent title="Usuários" />

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
          <Link to="usuarios/criar">
            <FiPlus size={18} /> <span>Novo</span>
          </Link>

          <table>
            <thead>
              <tr>
                <th>Nome/E-mail</th>
                <th>Administrador</th>
                <th>Ativo</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {searchUsers.map(userItem => (
                <tr key={userItem.id}>
                  <td>
                    <div>
                      <p>{userItem.name}</p>
                      <span>{userItem.email}</span>
                    </div>
                  </td>

                  <td>{userItem.is_admin ? 'Sim' : 'Não'}</td>

                  <td>{userItem.enabled ? 'Sim' : 'Não'}</td>

                  <td>
                    <button type="button">
                      <FiEdit
                        size={20}
                        onClick={() => handleEditUser(userItem.id)}
                      />
                    </button>

                    <button type="button">
                      <FiTrash
                        size={20}
                        onClick={() => handleDelete(userItem)}
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

export { Users };
