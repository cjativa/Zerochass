import * as React from 'react';

import { LoginContainer } from 'containers/authentication/loginContainer';
import { SignUpContainer } from 'containers/authentication/signUpContainer';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ConnectedNavigationBarContainer } from 'containers/navigationBarContainer';
import { HomeContainer } from 'views/landing/homeContainer';
import { TutorialContainer } from 'containers/tutorialContainer';
import { InformationBannerContainer } from 'containers/informationBanner';
import { FooterContainer } from 'containers/footer';
import { AboutContainer } from 'containers/aboutContainer';
import { UserPageContainer } from 'containers/user/userPageContainer';

class Application extends React.Component {

  render() {
    return (
      <div className="App" id="App">
        <BrowserRouter>
          <>
            <Switch>

              {/* Routes that don't display the navigation bar, information banner, and footer */}
              {/* <Route path="/login" component={LoginContainer} /> */}
              {/* <Route path="/sign-up" component={SignUpContainer} /> */}

              {/* Routes that do display the normal navigation bar, information banner, and footer */}
              <Route path={'/'} children={() => {
                return (
                  <>
                    <ConnectedNavigationBarContainer />
                    <Switch>
                      <Route exact path="/" component={HomeContainer} />
                      <Route path="/tutorial/:slug" component={TutorialContainer} />
                      {/* <Route path="/user" component={UserPageContainer} /> */}
                      <Route path="/about" component={AboutContainer} />
                    </Switch>

                  </>
                );
              }} />
            </Switch>

            <InformationBannerContainer />
            <FooterContainer />
          </>
        </BrowserRouter>
      </div>
    );
  }
}

export { Application };
