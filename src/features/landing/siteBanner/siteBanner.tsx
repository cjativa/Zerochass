import React, { useContext } from "react";

import { Button } from "../../../components/button/button";
import { AuthenticationContext } from "../../../components/contexts";

export const SiteBanner = () => {
  const { isAuthenticated, toggleAuthenticationModal } = useContext(
    AuthenticationContext
  );

  React.useEffect(() => {
    /** Callback that handles checking the keyboard event for Ctrl + AltKey + "L"
     * to render the authentication modal. Basic means of sign-in protection
     */
    const keyboardListenerCallback = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.altKey &&
        event.code === "KeyL"
      ) {
        toggleAuthenticationModal();
      }
    };
    document.addEventListener("keydown", keyboardListenerCallback);
    return () => {
      document.removeEventListener("keydown", keyboardListenerCallback);
    };
  }, []);

  return (
    <div className="site-banner">
      <div className="site-banner__inner">
        {/** Banner Heading */}
        <div className="site-banner__header">
          <p className="sb-header">learn. build. and write</p>
          <p className="sb-subheader">
            informative and practical posts on building software
          </p>
        </div>

        {/** Banner Buttons */}
        <div className="site-banner__buttons">
          <Button style="secondary" asLink={true} path="tutorials">
            Browse and Read
          </Button>

          {/** Display the wrting button */}
          {isAuthenticated ? (
            // When authenticated, it should link to the write page
            <Button style={"primary"} asLink={true} path="write">
              Create a Post
            </Button>
          ) : (
            ""
            /**
            // Otherwise, should display authentication modal
            <Button style={"primary"} onClick={toggleAuthenticationModal}>
              Start Writing
            </Button>
             */
          )}
        </div>
      </div>
    </div>
  );
};
