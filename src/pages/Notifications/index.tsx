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

interface INotifications {
  id: string;
  title: string;
  message: string;
  publication_schedule_date?: Date;
  publication_schedule_date_formatted?: string;
  user: IUser;
}

const Notifications: React.FC = () => {
  const { user, updateToken } = useAuth();
  const location = useHistory();

  const [notifications, setNotifications] = useState<INotifications[]>([]);
  const [searchNotifications, setSearchNotifications] = useState<
    INotifications[]
  >([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [idNotificationsDelete, setIdNotificationsDelete] =
    useState<INotifications>();

  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);

      if (term !== '') {
        const notificationsSearch = notifications;

        const notificationsFilterSearch = notificationsSearch.filter(n =>
          n.title.toUpperCase().includes(term.toLocaleUpperCase()),
        );

        setSearchNotifications(notificationsFilterSearch);
      } else {
        setSearchNotifications(notifications);
      }
    },
    [notifications],
  );

  const handleDeleteNotifications = useCallback(
    async (notificationsItem: INotifications) => {
      setIdNotificationsDelete(notificationsItem);
      try {
        const resultConfirm = confirm(
          `Deseja deletar a notificação: ${notificationsItem.title}?`,
        );

        if (resultConfirm) {
          const result = await api.delete(
            `/notifications/delete/${notificationsItem.id}`,
          );

          if (result.status === 204) {
            const notificationsDeleted = notifications.filter(
              n => n.id !== notificationsItem.id,
            );

            setNotifications(notificationsDeleted);
            setSearchNotifications(notificationsDeleted);
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
                if (idNotificationsDelete) {
                  handleDeleteNotifications(idNotificationsDelete);
                }
              }
            }
          }
        }
      }
    },
    [idNotificationsDelete, notifications, updateToken],
  );

  useEffect(() => {
    document.title = 'Editar notificação';
  }, []);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const response = await api.get('/push_notification');

        // console.log(response.data);

        const notificationsFormatted = response.data.map(
          (notificationsItem: INotifications) => {
            const publicationScheduleDate =
              notificationsItem.publication_schedule_date
                ? notificationsItem.publication_schedule_date
                : '-';
            let formatedDatePublication = '-';

            if (notificationsItem.publication_schedule_date) {
              formatedDatePublication = format(
                new Date(notificationsItem.publication_schedule_date),
                'dd/MM/yyyy',
                { locale: ptBR },
              );
            }

            const notificationsResponse = {
              ...notificationsItem,
              publication_schedule_date: publicationScheduleDate,
              publication_schedule_date_formatted: formatedDatePublication,
            } as INotifications;

            return notificationsResponse;
          },
        );

        setNotifications(notificationsFormatted);
        setSearchNotifications(notificationsFormatted);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const errorAxios = err as AxiosError;

          if (errorAxios.response) {
            const statusCode = errorAxios.response.status;

            if (statusCode === 401) {
              const successRefreshToken = await updateToken();

              if (successRefreshToken) {
                loadNotifications();
              }

              return;
            }

            alert('Ops! Ocorreu um problema, tente novamente');
          }
        }
      }
    }

    loadNotifications();
  }, [user, updateToken]);

  return (
    <Container>
      <Header />

      <Content>
        <div className="headerContent">
          <HeaderContent title="Notificações" />

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
          <div>
            {/* <Link to="notificacoes/criar">
              <FiPlus size={18} /> <span>Notificação Simples</span>
            </Link>

            <Link to="/notificacoesAgendadas/criar">
              <FiPlus size={18} /> <span>Notificação Agendada</span>
            </Link> */}
          </div>

          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Mensagem</th>
                <th>Data agendada</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {notifications.map(notificationsItem => (
                <tr key={notificationsItem.id}>
                  <td>
                    <p>{notificationsItem.title}</p>
                  </td>

                  <td>
                    <p>{notificationsItem.message}</p>
                  </td>

                  <td>
                    <p>
                      {notificationsItem.publication_schedule_date_formatted}
                    </p>
                  </td>

                  <td>
                    <button type="button">
                      <FiTrash
                        size={20}
                        onClick={() =>
                          handleDeleteNotifications(notificationsItem)
                        }
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

export { Notifications };
