import React, { useEffect, useState, useCallback } from 'react';

import { useHistory } from 'react-router-dom';

import axios, { AxiosError } from 'axios';
import { api } from '../../../services/api';

import { useAuth } from '../../../hooks/auth';

import { Header } from '../../../components/Header';
import { HeaderContent } from '../../../components/HeaderContent';
import { Button } from '../../../components/Button';

import {
  Container,
  Content,
  Box,
  ContentEditor,
  ContainerTitleInput,
} from './styles';

interface INotifications {
  id: string;
}

const CreateNotifications: React.FC = () => {
  const { user, updateToken } = useAuth();
  const history = useHistory();

  const [notifications, setNotifications] = useState<INotifications>();

  const [isLoadingContentSaveButton, setIsLoadingContentSaveButton] =
    useState(false);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleSaveContent = useCallback(async () => {
    try {
      setIsLoadingContentSaveButton(true);

      if (title === '') {
        alert('Informe o título da notificação');
        setIsLoadingContentSaveButton(false);
      } else if (message === '') {
        alert('Informe a mensagem da notificação');
        setIsLoadingContentSaveButton(false);
      } else {
        const data = {
          title,
          message,
          user_id: user.id,
        };

        const response = await api.post('/push_notification/create', data);
        setNotifications(response.data);

        setIsLoadingContentSaveButton(true);
        alert('Notificação salva com sucesso');
        history.goBack();
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorAxios = err as AxiosError;

        if (errorAxios.response) {
          const statusCode = errorAxios.response.status;

          if (statusCode === 401) {
            const successRefreshToken = await updateToken();

            if (successRefreshToken) {
              await handleSaveContent();
            }
          }
        }
      }
    }
  }, [history, message, title, updateToken, user.id]);

  useEffect(() => {
    document.title = 'Cadastrar notificação';
  }, []);

  return (
    <Container>
      <Header />

      <Content>
        <HeaderContent title="Cadastrar notificação" />

        <Box>
          <ContentEditor>
            <ContainerTitleInput>
              <input
                type="text"
                placeholder="Título"
                value={title}
                disabled={!!notifications}
                onChange={event => setTitle(event.target.value)}
              />
            </ContainerTitleInput>

            <ContainerTitleInput>
              <input
                type="text"
                placeholder="Mensagem"
                value={message}
                disabled={!!notifications}
                onChange={event => setMessage(event.target.value)}
              />
            </ContainerTitleInput>

            {!notifications && (
              <Button
                loading={isLoadingContentSaveButton}
                onClick={handleSaveContent}
              >
                Salvar notificação
              </Button>
            )}
          </ContentEditor>
        </Box>
      </Content>
    </Container>
  );
};

export { CreateNotifications };
