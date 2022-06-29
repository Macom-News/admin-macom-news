import React, { createContext, useContext, useState, useCallback } from 'react';

import axios, { AxiosError } from 'axios';
import { api } from '../services/api';

interface IUser {
  id: string;
  name: string;
  email: string;
  is_admin?: boolean;
  type: 'user' | 'writer';
  image_url: string;
}

interface IAuthState {
  user: IUser;
  token: string;
  refresh_token: string;
}

interface ISignInCredentials {
  email: string;
  password: string;
  type: 'user' | 'writer';
}

interface IAuthContextData {
  user: IUser;
  signIn({ email, password, type }: ISignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: IUser): void;
  updateToken(): Promise<boolean>;
}

const USER_KEY_LOCALSTORAGE = '@MaconNews:user';
const TOKEN_KEY_LOCALSTORAGE = '@MaconNews:token';
const REFRESH_TOKEN_KEY_LOCALSTORAGE = '@MaconNews:refresh_token';

const sessionProvider = {
  user: '/sessions_user',
  writer: '/sessions_writer',
};

const refreshTokenProvider = {
  user: '/sessions_user/refresh_token',
  writer: '/sessions_writer/refresh_token',
};

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<IAuthState>(() => {
    const user = localStorage.getItem(USER_KEY_LOCALSTORAGE);
    const token = localStorage.getItem(TOKEN_KEY_LOCALSTORAGE);
    const refresh_token = localStorage.getItem(REFRESH_TOKEN_KEY_LOCALSTORAGE);

    if (user && token && refresh_token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      return { user: JSON.parse(user), token, refresh_token };
    }

    return {} as IAuthState;
  });

  const signIn = useCallback(
    async ({ email, password, type }: ISignInCredentials) => {
      try {
        const response = await api.post(`${sessionProvider[type]}`, {
          email,
          password,
        });

        let user: IUser;
        if (type === 'user') {
          user = response.data.user;
          user = Object.assign(user, { type: 'user' });
        } else {
          user = response.data.writer;
          user = Object.assign(user, { type: 'writer' });
        }

        const { token, refresh_token } = response.data;

        localStorage.setItem(USER_KEY_LOCALSTORAGE, JSON.stringify(user));
        localStorage.setItem(TOKEN_KEY_LOCALSTORAGE, token);
        localStorage.setItem(REFRESH_TOKEN_KEY_LOCALSTORAGE, refresh_token);

        api.defaults.headers.common.Authorization = `Bearer ${token}`;

        setData({ user, token, refresh_token });
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError;

          if (axiosError.response) {
            alert(axiosError.response.data.error);
          }
        }
      }
    },
    [],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem(USER_KEY_LOCALSTORAGE);
    localStorage.removeItem(TOKEN_KEY_LOCALSTORAGE);
    localStorage.removeItem(REFRESH_TOKEN_KEY_LOCALSTORAGE);

    setData({} as IAuthState);
  }, []);

  const updateUser = useCallback(
    async (user: IUser) => {
      localStorage.setItem(USER_KEY_LOCALSTORAGE, JSON.stringify(user));

      setData({
        user,
        token: data.token,
        refresh_token: data.refresh_token,
      });
    },
    [data.token, data.refresh_token, setData],
  );

  const updateToken = useCallback(async () => {
    try {
      const response = await api.post(
        `${refreshTokenProvider[data.user.type]}`,
        { refresh_token: data.refresh_token },
      );

      const { token, refresh_token: refreshToken } = response.data;

      localStorage.setItem(TOKEN_KEY_LOCALSTORAGE, token);
      localStorage.setItem(REFRESH_TOKEN_KEY_LOCALSTORAGE, refreshToken);

      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      setData({
        user: data.user,
        token,
        refresh_token: refreshToken,
      });

      return true;
    } catch {
      return false;
    }
  }, [data.user, data.refresh_token]);

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser, updateToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): IAuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
