import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
  ChangeEvent,
} from 'react';

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
  ContainerTitleInput,
  BoxContent,
  ContentImage,
} from './styles';

interface ISocialAction {
  id: string;
}

const CreateSocialAction: React.FC = () => {
  const { user, updateToken } = useAuth();

  const content1Ref = useRef(null);
  const content2Ref = useRef(null);

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

  const [socialAction, setSocialAction] = useState<ISocialAction>();

  const [isContentFocus, setIsContentFocus] = useState(true);
  const [isImageTopFocus, setIsImageTopFocus] = useState(false);
  const [isImageMiddleFocus, setIsImageMiddleFocus] = useState(false);

  const [isLoadingContentSaveButton, setIsLoadingContentSaveButton] =
    useState(false);
  const [isLoadingImageTopSaveButton, setIsLoadingImageTopSaveButton] =
    useState(false);
  const [isLoadingImageMiddleSaveButton, setIsLoadingImageMiddleSaveButton] =
    useState(false);

  const [title, setTitle] = useState('');
  const [content1, setContent1] = useState('');
  const [content2, setContent2] = useState('');

  const [imageTop, setImageTop] = useState<File>();
  const [imageMiddle, setImageMiddle] = useState<File>();
  const [previewImageTop, setPreviewImageTop] = useState('');
  const [previewImageMiddle, setPreviewImageMiddle] = useState('');

  const handleText1Focus = useCallback(() => {
    setIsContentFocus(true);
    setIsImageTopFocus(false);
    setIsImageMiddleFocus(false);
  }, []);

  const handleImageTopFocus = useCallback(() => {
    setIsContentFocus(false);
    setIsImageTopFocus(true);
    setIsImageMiddleFocus(false);
  }, []);

  const handleImageMiddleFocus = useCallback(() => {
    setIsContentFocus(false);
    setIsImageTopFocus(false);
    setIsImageMiddleFocus(true);
  }, []);

  const handleSaveContent = useCallback(async () => {
    try {
      setIsLoadingContentSaveButton(true);

      if (title === '') {
        alert('Informe o título da notícia');
        setIsLoadingContentSaveButton(false);
      } else if (content1 !== '') {
        const data = {
          title,
          content_1: content1,
          content_2: content2 || null,
          user_id: user.id,
          enabled: true,
        };

        const response = await api.post('/social_actions_news', data);
        setSocialAction(response.data);
        handleImageTopFocus();

        setIsLoadingContentSaveButton(false);
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
  }, [content1, content2, updateToken, title, user.id, handleImageTopFocus]);

  const handleSelectedImageTop = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) {
        return;
      }

      const image = event.target.files[0];
      setImageTop(image);

      setPreviewImageTop(URL.createObjectURL(image));
    },
    [],
  );

  const handleImageTopSave = useCallback(async () => {
    try {
      setIsLoadingImageTopSaveButton(true);

      if (!imageTop) {
        alert('Selecione uma imagem');
        setIsLoadingImageTopSaveButton(false);

        return;
      }

      if (socialAction) {
        const data = new FormData();
        data.append('id', socialAction.id);
        data.append('image', imageTop);

        await api.patch('/social_actions_news/upload_image_1', data);
        setIsLoadingImageTopSaveButton(false);
        alert('Imagem salva com sucesso');
      }
    } catch (err) {
      setIsLoadingImageTopSaveButton(false);
      alert('Ops! Não foi possível enviar a imagem, tente novamente');
    }
  }, [imageTop, socialAction]);

  const handleSelectedImageMiddle = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) {
        return;
      }

      const image = event.target.files[0];
      setImageMiddle(image);

      setPreviewImageMiddle(URL.createObjectURL(image));
    },
    [],
  );

  const handleImageMiddleSave = useCallback(async () => {
    try {
      setIsLoadingImageMiddleSaveButton(true);

      if (!imageMiddle) {
        alert('Selecione uma imagem');
        setIsLoadingImageMiddleSaveButton(false);

        return;
      }

      if (socialAction) {
        const data = new FormData();
        data.append('id', socialAction.id);
        data.append('image', imageMiddle);

        await api.patch('/social_actions_news/upload_image_2', data);
        setIsLoadingImageMiddleSaveButton(false);
        alert('Imagem salva com sucesso');
      }
    } catch (err) {
      setIsLoadingImageMiddleSaveButton(false);
      alert('Ops! Não foi possível enviar a imagem, tente novamente');
    }
  }, [imageMiddle, socialAction]);

  useEffect(() => {
    document.title = 'Cadastrar ação social';
  }, []);

  return (
    <Container>
      <Header />

      <Content>
        <HeaderContent title="Cadastrar uma ação social" />

        <Box>
          <HeaderForm>
            <button
              type="button"
              className={isContentFocus ? 'active' : ''}
              onClick={handleText1Focus}
            >
              Conteúdo
            </button>

            <button
              type="button"
              className={isImageTopFocus ? 'active' : ''}
              disabled={!socialAction}
              onClick={handleImageTopFocus}
            >
              Imagem topo
            </button>

            <button
              type="button"
              className={isImageMiddleFocus ? 'active' : ''}
              disabled={!socialAction}
              onClick={handleImageMiddleFocus}
            >
              Imagem meio
            </button>
          </HeaderForm>

          {isContentFocus && (
            <ContentEditor>
              <p className="success" hidden={!socialAction}>
                Cadastro realizado com sucesso
              </p>

              <ContainerTitleInput>
                <input
                  type="text"
                  placeholder="Título"
                  value={title}
                  disabled={!!socialAction}
                  onChange={event => setTitle(event.target.value)}
                />
              </ContainerTitleInput>

              <div className="divisor" />

              <h1>Texto topo</h1>

              <BoxContent>
                <JoditEditor
                  ref={content1Ref}
                  value={content1}
                  config={config}
                  onBlur={content => setContent1(content)}
                />
              </BoxContent>

              <h1>Texto baixo</h1>

              <BoxContent>
                <JoditEditor
                  ref={content2Ref}
                  value={content2}
                  config={config}
                  onBlur={content => setContent2(content)}
                />
              </BoxContent>

              {!socialAction && (
                <Button
                  loading={isLoadingContentSaveButton}
                  onClick={handleSaveContent}
                >
                  Salvar conteúdo
                </Button>
              )}
            </ContentEditor>
          )}

          {isImageTopFocus && (
            <ContentImage>
              <label htmlFor="imageTop">
                <div className="image-container">
                  {previewImageTop && (
                    <img src={previewImageTop} alt="Maçom News" />
                  )}

                  {!previewImageTop && <p>Selecione uma imagem</p>}
                </div>
              </label>

              <input
                type="file"
                id="imageTop"
                onChange={handleSelectedImageTop}
              />

              <Button
                loading={isLoadingImageTopSaveButton}
                onClick={handleImageTopSave}
              >
                Salvar imagem
              </Button>
            </ContentImage>
          )}

          {isImageMiddleFocus && (
            <ContentImage>
              <label htmlFor="imageMiddle">
                <div className="image-container">
                  {previewImageMiddle && (
                    <img src={previewImageMiddle} alt="Maçom News" />
                  )}

                  {!previewImageMiddle && <p>Selecione uma imagem</p>}
                </div>
              </label>

              <input
                type="file"
                id="imageMiddle"
                onChange={handleSelectedImageMiddle}
              />

              <Button
                loading={isLoadingImageMiddleSaveButton}
                onClick={handleImageMiddleSave}
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

export { CreateSocialAction };
