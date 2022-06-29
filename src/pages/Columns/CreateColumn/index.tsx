import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react';

import { useHistory } from 'react-router-dom';

import JoditEditor from 'jodit-react';

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
  ContainerTitleInput,
  ContentEditor,
  BoxContent,
} from './styles';

const CreateColumns: React.FC = () => {
  const { user, updateToken } = useAuth();
  const history = useHistory();

  const contentTextRef = useRef(null);

  const config = useMemo(() => {
    return {
      readonly: false,
      height: 500,
      hidePoweredByJodit: true,
      placeholder: 'Inicie escrevendo',
      toolbarSticky: false,
      allowResizeX: false,
      allowResizeY: false,
      style: {
        font_size: '16px',
        color: '#000000',
        background: '#FFFFFF',
      },
    };
  }, []);

  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [title, setTitle] = useState('');
  const [contentText, setContentText] = useState('');

  const handleSaveContent = useCallback(async () => {
    try {
      setIsLoadingContent(true);

      if (title === '') {
        alert('Informe o título da coluna');
        setIsLoadingContent(false);
      } else if (contentText !== '') {
        const data = {
          title,
          content: contentText,
          writer_id: user.id,
        };

        await api.post('/writers_columns', data);
        setIsLoadingContent(false);
        alert('Coluna cadastrada com sucesso!');
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
  }, [contentText, title, updateToken, user.id, history]);

  useEffect(() => {
    document.title = 'Cadastrar coluna';
  }, []);

  return (
    <Container>
      <Header />

      <Content>
        <HeaderContent title="Cadastrar coluna" />

        <Box>
          <ContentEditor>
            <ContainerTitleInput>
              <input
                type="text"
                placeholder="Título"
                value={title}
                onChange={event => setTitle(event.target.value)}
              />
            </ContainerTitleInput>

            <BoxContent>
              <JoditEditor
                ref={contentTextRef}
                value={contentText}
                config={config}
                onBlur={content => setContentText(content)}
              />
            </BoxContent>

            <Button loading={isLoadingContent} onClick={handleSaveContent}>
              Salvar conteúdo
            </Button>
          </ContentEditor>
        </Box>
      </Content>
    </Container>
  );
};

export { CreateColumns };
