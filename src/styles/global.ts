import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`

* {
  margin: 0;
  padding: 0;
  outline: 0;
  box-sizing: border-box;
}

:root {
  font-size: 60%;

  --white: #ffffff;

  --red: #c53030;

  --orange: #ff9000;

  --gray-100: #e1e1e6;
  --gray-300: #a8a8b3;
  --gray-700: #323238;
  --gray-800: #29292e;
  --gray-850: #1f2729;
  --gray-900: #121214;
}

@media (max-width: 1080px) {
  html {
    font-size: 93.75%; // 15px
  }
}

@media (max-width: 720px) {
  html {
    font-size: 87.5%; // 14px
  }
}

body {
  background-color: var(--gray-850);

  font-family: Arial, Helvetica, sans-serif;
  color: var(--white);

  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6, strong {
  font-weight: 500;
}

a {
  text-decoration: none;
  color: var(--white);
}

button {
  cursor: pointer;
}

`;
