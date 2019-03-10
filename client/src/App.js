import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import jwt_decode from 'jwt-decode';

import store from './store/store';
import setAuthToken from './store/utils/setAuthToken';
import { setCurrentUser, logoutUser } from './store/actions/authActions';
import { clearCurrentProfile } from './store/actions/profileActions';

import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';
import Landing from './components/layouts/Landing';
import PrivateRoute from './components/common/PrivateRoute';
import NotFound from './components/not-found/NotFound';
import Spinner from './components/common/Spinner';
import './App.css';

const Login = lazy(() => import('./components/auth/Login'));
const Register = lazy(() => import('./components/auth/Register'));
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const CreateProfile = lazy(() =>
  import('./components/create-profile/CreateProfile')
);
const EditProfile = lazy(() => import('./components/edit-profile/EditProfile'));
const AddExperience = lazy(() =>
  import('./components/add-credentials/AddExperience')
);
const AddEducation = lazy(() =>
  import('./components/add-credentials/AddEducation')
);
const Profiles = lazy(() => import('./components/profiles/Profiles'));
const Profile = lazy(() => import('./components/profile/Profile'));
const Posts = lazy(() => import('./components/posts/Posts'));
const Post = lazy(() => import('./components/post/Post'));
const CreateMessage = lazy(() => import('./components/message/CreateMessage'));
const MessageFeed = lazy(() => import('./components/message/MessageFeed'));

// check for auth token
if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken);
  // set current user to logged in
  store.dispatch(setCurrentUser(decoded));

  // check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    store.dispatch(clearCurrentProfile());
    window.location.href = '/login';
  }
}

const App = () => (
  <Provider store={store}>
    <Suspense fallback={<Spinner />}>
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Switch>
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/profiles" component={Profiles} />
                <Route exact path="/profile/:handle" component={Profile} />

                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute
                  exact
                  path="/create-profile"
                  component={CreateProfile}
                />
                <PrivateRoute
                  exact
                  path="/edit-profile"
                  component={EditProfile}
                />
                <PrivateRoute
                  exact
                  path="/add-experience"
                  component={AddExperience}
                />
                <PrivateRoute
                  exact
                  path="/add-education"
                  component={AddEducation}
                />
                <PrivateRoute exact path="/feed" component={Posts} />
                <PrivateRoute exact path="/post/:id" component={Post} />
                <PrivateRoute
                  exact
                  path="/message/:receiver"
                  component={CreateMessage}
                />
                <PrivateRoute
                  exact
                  path="/message-history"
                  component={MessageFeed}
                />

                <Route component={NotFound} />
              </Switch>
            </div>
          </Switch>
          <Footer />
        </div>
      </BrowserRouter>
    </Suspense>
  </Provider>
);

export default App;
