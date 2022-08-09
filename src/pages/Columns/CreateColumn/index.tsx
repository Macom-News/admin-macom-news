import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
  ChangeEvent,
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
  HeaderForm,
  ContentImage,
} from './styles';

interface IColumns {
  id: string;
}

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

  const [columns, setColumns] = useState<IColumns>();

  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [title, setTitle] = useState('');
  const [contentText, setContentText] = useState('');

  const [isContentFocus, setIsContentFocus] = useState(true);
  const [isImageFocus, setIsImageFocus] = useState(false);

  const [isLoadingContentSaveButton, setIsLoadingContentSaveButton] =
    useState(false);
  const [isLoadingImageColumnSaveButton, setIsLoadingImageColumnSaveButton] =
    useState(false);

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

        const response = await api.post('/writers_columns', data);
        setColumns(response.data);
        handleImageColumnFocus();
        setIsLoadingContent(false);

        alert('Coluna cadastrada com sucesso!');
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
  }, [title, contentText, user.id, handleImageColumnFocus, updateToken]);

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
    document.title = 'Cadastrar coluna';
  }, []);

  return (
    <Container>
      <Header />

      <Content>
        <HeaderContent title="Cadastrar coluna" />

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
              <p className="success" hidden={!columns}>
                Cadastro realizado com sucesso
              </p>

              <ContainerTitleInput>
                <input
                  type="text"
                  placeholder="Título"
                  value={title}
                  disabled={!!columns}
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

              {!columns && (
                <Button loading={isLoadingContent} onClick={handleSaveContent}>
                  Salvar conteúdo
                </Button>
              )}
            </ContentEditor>
          )}

          {isImageFocus && (
            <ContentImage>
              <label htmlFor="imageColumn">
                <div className="image-container">
                  {previewImageColumn && (
                    <img src={previewImageColumn} alt="Coluna - Maçom News" />
                  )}

                  {!previewImageColumn && <p>Selecione uma imagem</p>}
                </div>
              </label>

              <input
                type="file"
                id="imageColumn"
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

export { CreateColumns };
