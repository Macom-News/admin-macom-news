import React, {
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
  ContainerDateInput,
  ContainerLevelInput,
  BoxContent,
  ContentImage,
} from './styles';

interface INews {
  id: string;
  title: string;
  content_1: string;
  content_2: string;
  publication_schedule_date: Date;
  level: number;
  image_1_url: string;
  image_2_url: string;
}

interface IRouteMatchParams {
  news_id: string;
}

const EditNews: React.FC = () => {
  const { params } = useRouteMatch<IRouteMatchParams>();
  const { news_id } = params;

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

  const [news, setNews] = useState<INews>();

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
  const [publicationScheduleDate, setPublicationScheduleDate] = useState('');
  const [levelNews, setLevelNews] = useState('GERAL');
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
      const infoLevelData = levelNews.toUpperCase();

      if (title === '') {
        alert('Informe o título da matéria');
        setIsLoadingContentSaveButton(false);
      } else if (publicationScheduleDate === '') {
        alert('Informe a data de publicação');
        setIsLoadingContentSaveButton(false);
      } else if (infoLevelData !== 'GERAL') {
        if (Number.isNaN(infoLevelData)) {
          alert(
            'Nível da matéria incorreto. Informe Geral ou um número representando o nível',
          );
          setIsLoadingContentSaveButton(false);
        }
      } else if (content1 === '') {
        alert('Informe o conteúdo da matéria');
        setIsLoadingContentSaveButton(false);
      } else {
        const level = infoLevelData === 'GERAL' ? 0 : Number(infoLevelData);

        const data = {
          id: news_id,
          title,
          content_1: content1,
          content_2: content2 || null,
          user_id: user.id,
          publication_schedule_date: publicationScheduleDate,
          level,
        };

        const response = await api.put('/news', data);

        if (response.status === 200) {
          setNews(response.data);
          alert('Informações atualizadas');
        }

        setIsLoadingContentSaveButton(false);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setIsLoadingContentSaveButton(false);

        const errorAxios = err as AxiosError;

        if (errorAxios.response) {
          const statusCode = errorAxios.response.status;

          if (statusCode === 401) {
            const successRefreshToken = await updateToken();

            if (successRefreshToken) {
              await handleSaveContent();
            }
          } else if (statusCode === 400) {
            alert(
              'Não foi possível editar esta matéria, pois você não é o autor',
            );
          }
        }
      }
    }
  }, [
    content1,
    content2,
    updateToken,
    title,
    user.id,
    publicationScheduleDate,
    levelNews,
    news_id,
  ]);

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

      if (news) {
        const data = new FormData();
        data.append('id', news.id);
        data.append('image', imageTop);

        await api.patch('/news/upload_image_1', data);
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
  }, [imageTop, news, updateToken]);

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

      if (news) {
        const data = new FormData();
        data.append('id', news.id);
        data.append('image', imageMiddle);

        await api.patch('/news/upload_image_2', data);
        setIsLoadingImageMiddleSaveButton(false);
        alert('Imagem salva com sucesso');
      }
    } catch (err) {
      setIsLoadingImageMiddleSaveButton(false);
      alert('Ops! Não foi possível enviar a imagem, tente novamente');
    }
  }, [imageMiddle, news]);

  useEffect(() => {
    document.title = 'Editar matéria';
  }, []);

  useEffect(() => {
    async function loadNews() {
      try {
        const response = await api.get(`/news/show/${news_id}`);

        if (response.status === 200) {
          const newsData = response.data as INews;
          const levelFormatted =
            newsData.level === 0 ? 'GERAL' : String(newsData.level);

          setNews(newsData);

          setTitle(newsData.title);
          setPublicationScheduleDate(
            newsData.publication_schedule_date.toString(),
          );
          setLevelNews(levelFormatted);
          setContent1(newsData.content_1);
          setContent2(newsData.content_2);
          setPreviewImageTop(newsData.image_1_url);
          setPreviewImageMiddle(newsData.image_2_url);
        }
      } catch (err) {
        alert('Ops! Não conseguimos encontrar a matéria, tente novamente');
      }
    }

    loadNews();
  }, [news_id]);

  return (
    <Container>
      <Header />

      <Content>
        <HeaderContent title="Editar matéria" />

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
                  value={title}
                  onChange={event => setTitle(event.target.value)}
                />
              </ContainerTitleInput>

              <ContainerDateInput>
                <input
                  type="date"
                  value={publicationScheduleDate}
                  onChange={event =>
                    setPublicationScheduleDate(event.target.value)
                  }
                />
              </ContainerDateInput>

              <ContainerLevelInput>
                <input
                  type="text"
                  placeholder="Nível a qual a matéria se destina"
                  value={levelNews}
                  onChange={event => setLevelNews(event.target.value)}
                />
              </ContainerLevelInput>

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

export { EditNews };
