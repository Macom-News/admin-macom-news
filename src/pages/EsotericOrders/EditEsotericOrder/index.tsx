import {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
  ChangeEvent,
} from 'react';
import { useRouteMatch } from 'react-router-dom';

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
  ContainerVideoInput,
  BoxContent,
  ContentImage,
} from './styles';

interface IEsotericOrder {
  id: string;
  title: string;
  content_1: string;
  content_2: string;
  image_1_url: string;
  image_2_url: string;
  video: string;
}

interface IRouteMatchParams {
  ordem_id: string;
}

const EditEsotericOrder = () => {
  const { params } = useRouteMatch<IRouteMatchParams>();
  const { ordem_id } = params;

  const { user, updateToken } = useAuth();

  const content1Ref = useRef(null);
  const content2Ref = useRef(null);

  const [esotericOrder, setEsotericOrder] = useState<IEsotericOrder>();

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
  const [video, setVideo] = useState('');

  const [imageTop, setImageTop] = useState<File>();
  const [imageMiddle, setImageMiddle] = useState<File>();
  const [previewImageTop, setPreviewImageTop] = useState('');
  const [previewImageMiddle, setPreviewImageMiddle] = useState('');

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
        alert('Informe o título da ordem esotérica');
        setIsLoadingContentSaveButton(false);
      } else if (video === '') {
        alert('Informe o link do vídeo da ordem esotérica');
        setIsLoadingContentSaveButton(false);
      } else if (content1 !== '') {
        const data = {
          id: ordem_id,
          title,
          content_1: content1,
          content_2: content2 || null,
          user_id: user.id,
          video,
        };

        const response = await api.put('/esoteric_orders/update', data);

        if (response.status === 200) {
          setEsotericOrder(response.data);
        }

        setIsLoadingContentSaveButton(false);
        alert('Texto salvo com sucesso');
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

      setIsLoadingContentSaveButton(false);
      alert('Ops! Ocorreu um erro, tente novamente');
    }
  }, [content1, content2, ordem_id, title, updateToken, user.id, video]);

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

      if (esotericOrder) {
        const data = new FormData();
        data.append('id', esotericOrder.id);
        data.append('image', imageTop);

        await api.patch('/esoteric_orders/upload_image_1', data);
        setIsLoadingImageTopSaveButton(false);
        alert('Imagem salva com sucesso');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;

        if (axiosError.response) {
          const statusCode = axiosError.response.status;

          if (statusCode === 401) {
            const successRefreshToken = await updateToken();

            if (successRefreshToken) {
              await handleImageTopSave();
            }
          }
        }

        return;
      }

      setIsLoadingImageTopSaveButton(false);
      alert('Ops! Não foi possível enviar a imagem, tente novamente');
    }
  }, [imageTop, esotericOrder, updateToken]);

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

      if (esotericOrder) {
        const data = new FormData();
        data.append('id', esotericOrder.id);
        data.append('image', imageMiddle);

        await api.patch('/esoteric_orders/upload_image_2', data);
        setIsLoadingImageMiddleSaveButton(false);
        alert('Imagem salva com sucesso');
      }
    } catch (err) {
      setIsLoadingImageMiddleSaveButton(false);
      alert('Ops! Não foi possível enviar a imagem, tente novamente');
    }
  }, [imageMiddle, esotericOrder]);

  useEffect(() => {
    document.title = 'Editar ordem esotérica';
  }, []);

  useEffect(() => {
    async function loadEsotericOrders() {
      try {
        const response = await api.get(`/esoteric_orders/show/${ordem_id}`);

        if (response.status === 200) {
          const esotericOrdersData = response.data as IEsotericOrder;

          setEsotericOrder(esotericOrdersData);

          setTitle(esotericOrdersData.title);
          setVideo(esotericOrdersData.video);
          setContent1(esotericOrdersData.content_1);
          setContent2(esotericOrdersData.content_2);
          setPreviewImageTop(esotericOrdersData.image_1_url);
          setPreviewImageMiddle(esotericOrdersData.image_2_url);
        }
      } catch (err) {
        alert('Ops! Não conseguimos encontrar a notícia, tente novamente');
      }
    }

    loadEsotericOrders();
  }, [ordem_id]);

  return (
    <Container>
      <Header />

      <Content>
        <HeaderContent title="Editar ordem esotérica" />

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
              onClick={handleImageTopFocus}
            >
              Imagem topo
            </button>

            <button
              type="button"
              className={isImageMiddleFocus ? 'active' : ''}
              onClick={handleImageMiddleFocus}
            >
              Imagem meio
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

              <ContainerTitleInput>
                <input
                  type="text"
                  placeholder="Vídeo"
                  defaultValue={video}
                  onChange={event => setVideo(event.target.value)}
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

              <Button
                loading={isLoadingContentSaveButton}
                onClick={handleSaveContent}
              >
                Salvar conteúdo
              </Button>
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

export { EditEsotericOrder };
