import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';

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
  ContentEditor,
  ContainerTitleInput,
  BoxContent,
} from './styles';

interface IColumns {
  id: string;
  title: string;
  content: string;
}

interface IRouteMatchParams {
  columns_id: string;
}

const EditColumns: React.FC = () => {
  const { params } = useRouteMatch<IRouteMatchParams>();
  const { columns_id } = params;
  const history = useHistory();
  const { user, updateToken } = useAuth();

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

  const [columns, setColumns] = useState<IColumns>();

  const [isLoadingContentSaveButton, setIsLoadingContentSaveButton] =
    useState(false);

  const [title, setTitle] = useState('');
  const [contentText, setContentText] = useState('');

  const handleSaveContent = useCallback(async () => {
    try {
      setIsLoadingContentSaveButton(true);

      if (title === '') {
        alert('Informe o título da notícia');
        setIsLoadingContentSaveButton(false);
      } else if (contentText !== '') {
        const data = {
          id: columns_id,
          title,
          content: contentText,
          writer_id: user.id,
        };

        const response = await api.put('/writers_columns', data);

        if (response.status === 200) {
          setColumns(response.data);
        }

        setIsLoadingContentSaveButton(false);
        alert('Coluna alterada com sucesso!');
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
  }, [columns_id, contentText, title, updateToken, user.id, history]);

  useEffect(() => {
    document.title = 'Editar coluna';
  }, []);

  useEffect(() => {
    async function loadColumns() {
      try {
        const response = await api.get(`/writers_columns/show/${columns_id}`);

        if (response.status === 200) {
          const columnsData = response.data as IColumns;

          setColumns(columnsData);

          setTitle(columnsData.title);
          setContentText(columnsData.content);
        }
      } catch (err) {
        alert('Ops! Não conseguimos encontrar a coluna, tente novamente');
      }
    }

    loadColumns();
  }, [columns_id]);

  return (
    <Container>
      <Header />

      <Content>
        <HeaderContent title="Editar coluna" />

        <Box>
          <ContentEditor>
            <ContainerTitleInput>
              <input
                type="text"
                placeholder="Título"
                defaultValue={title}
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

            <Button
              loading={isLoadingContentSaveButton}
              onClick={handleSaveContent}
            >
              Salvar conteúdo
            </Button>
          </ContentEditor>
        </Box>
      </Content>
    </Container>
  );
};

export { EditColumns };
