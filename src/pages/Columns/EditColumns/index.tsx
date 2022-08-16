import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
  ChangeEvent,
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
  HeaderForm,
  ContentEditor,
  ContentImage,
  ContainerTitleInput,
  BoxContent,
} from './styles';

interface IColumns {
  id: string;
  title: string;
  content: string;
  image_url: string;
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

  const [isContentFocus, setIsContentFocus] = useState(true);
  const [isImageFocus, setIsImageFocus] = useState(false);

  const [isLoadingContentSaveButton, setIsLoadingContentSaveButton] =
    useState(false);
  const [isLoadingImageColumnSaveButton, setIsLoadingImageColumnSaveButton] =
    useState(false);

  const [title, setTitle] = useState('');
  const [contentText, setContentText] = useState('');
  const [imageColumn, setImageColumn] = useState<File>();
  const [previewImageColumn, setPreviewImageColumn] = useState('');

  const handleTextFocus = useCallback(() => {
    setIsContentFocus(true);
    setIsImageFocus(false);
  }, []);

  const handleImageColumnFocus = useCallback(() => {
    setIsContentFocus(false);
    setIsImageFocus(true);
  }, []);

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
  }, [columns_id, contentText, title, updateToken, user.id]);

  const handleSelectedImageColumn = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) {
        return;
      }

      const image = event.target.files[0];
      setImageColumn(image);

      setPreviewImageColumn(URL.createObjectURL(image));
    },
    [],
  );

  const handleImageColumnSave = useCallback(async () => {
    try {
      setIsLoadingImageColumnSaveButton(true);

      if (!imageColumn) {
        alert('Selecione uma imagem');
        setIsLoadingImageColumnSaveButton(false);

        return;
      }

      if (columns) {
        const data = new FormData();
        data.append('id', columns.id);
        data.append('image', imageColumn);

        await api.patch('/writers_columns/upload', data);
        setIsLoadingImageColumnSaveButton(false);
        alert('Imagem salva com sucesso');
        history.goBack();
      }
    } catch (err) {
      setIsLoadingImageColumnSaveButton(false);
      alert('Ops! Não foi possível enviar a imagem, tente novamente');
    }
  }, [imageColumn, columns, history]);

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
          setPreviewImageColumn(columnsData.image_url);
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
          <HeaderForm>
            <button
              type="button"
              className={isContentFocus ? 'active' : ''}
              onClick={handleTextFocus}
            >
              Conteúdo
            </button>

            <button
              type="button"
              className={isImageFocus ? 'active' : ''}
              disabled={!columns}
              onClick={handleImageColumnFocus}
            >
              Imagem
            </button>
          </HeaderForm>

          {isContentFocus && (
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
          )}

          {isImageFocus && (
            <ContentImage>
              <label htmlFor="imageTop">
                <div className="image-container">
                  {previewImageColumn && (
                    <img src={previewImageColumn} alt="Maçom News" />
                  )}

                  {!previewImageColumn && <p>Selecione uma imagem</p>}
                </div>
              </label>

              <input
                type="file"
                id="imageTop"
                onChange={handleSelectedImageColumn}
              />

              <Button
                loading={isLoadingImageColumnSaveButton}
                onClick={handleImageColumnSave}
              >
                Salvar imagem
              </Button>
            </ContentImage>
          )}
        </Box>
      </Content>
    </Container>
  );
};

export { EditColumns };
