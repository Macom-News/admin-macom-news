import React from 'react';
import { Switch } from 'react-router-dom';

import { Route } from './Route';

import { SignIn } from '../pages/SignIn';

import { Dashboard } from '../pages/Dashboard';
import { Configuration } from '../pages/Configuration';

// USERS
import { Users } from '../pages/User';
import { CreateUser } from '../pages/User/CreateUser';
import { EditUser } from '../pages/User/EditUser';

// WRITERS
import { Writers } from '../pages/Writer';
import { CreateWriter } from '../pages/Writer/CreateWriter';
import { EditWriter } from '../pages/Writer/EditWriter';

// COLUMNS
import { Columns } from '../pages/Columns';
import { CreateColumns } from '../pages/Columns/CreateColumn';

// CUSTOMERS
import { Customers } from '../pages/Customers';

// NEWS
import { News } from '../pages/News';
import { CreateNews } from '../pages/News/CreateNews';
import { EditNews } from '../pages/News/EditNews';
import { EditColumns } from '../pages/Columns/EditColumns';

// SOCIAL ACTION
import { SocialAction } from '../pages/SocialAction';
import { CreateSocialAction } from '../pages/SocialAction/CreateSocialAction';
import { EditSocialAction } from '../pages/SocialAction/EditSocialAction';

// INTERVIEWS
import { Interviews } from '../pages/Interviews';
import { CreateInterviews } from '../pages/Interviews/CreateInterviews';
import { EditInterviews } from '../pages/Interviews/EditInterviews';

// PLANS
import { Plans } from '../pages/Plans';
import { CreatePlan } from '../pages/Plans/CreatePlan';
import { EditPlan } from '../pages/Plans/EditPlan';

// ASSINATURAS
import { Subscriptions } from '../pages/Subscriptions';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />

    <Route path="/dashboard" component={Dashboard} isPrivate />
    <Route path="/configuracoes" component={Configuration} isPrivate />

    <Route path="/clientes" component={Customers} isPrivate />

    <Route path="/colunistas" component={Writers} exact isPrivate />
    <Route path="/colunistas/criar" component={CreateWriter} isPrivate />
    <Route
      path="/colunistas/editar/:writer_id+"
      component={EditWriter}
      isPrivate
    />

    <Route path="/colunas" exact component={Columns} isPrivate />
    <Route path="/colunas/criar" component={CreateColumns} isPrivate />
    <Route
      path="/colunas/editar/:columns_id+"
      component={EditColumns}
      isPrivate
    />

    <Route path="/usuarios" exact component={Users} isPrivate />
    <Route path="/usuarios/criar" component={CreateUser} isPrivate />
    <Route path="/usuarios/editar/:user_id+" component={EditUser} isPrivate />

    <Route path="/noticias" exact component={News} isPrivate />
    <Route path="/noticias/criar" component={CreateNews} isPrivate />
    <Route path="/noticias/editar/:news_id+" component={EditNews} isPrivate />

    <Route path="/acao_social" exact component={SocialAction} isPrivate />
    <Route path="/acao_social/criar" component={CreateSocialAction} isPrivate />
    <Route
      path="/acao_social/editar/:social_action_id+"
      component={EditSocialAction}
      isPrivate
    />

    <Route path="/entrevistas" exact component={Interviews} isPrivate />
    <Route path="/entrevistas/criar" component={CreateInterviews} isPrivate />
    <Route
      path="/entrevistas/editar/:interviews_id+"
      component={EditInterviews}
      isPrivate
    />

    <Route path="/planos" exact component={Plans} isPrivate />
    <Route path="/planos/criar" component={CreatePlan} isPrivate />
    <Route path="/planos/editar/:plan_id+" component={EditPlan} isPrivate />

    <Route
      path="/assinaturas/editar/:customer_id+"
      component={Subscriptions}
      isPrivate
    />
  </Switch>
);

export { Routes };