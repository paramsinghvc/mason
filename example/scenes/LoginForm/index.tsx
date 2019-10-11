import React, { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { ReactConfigRenderer } from "../../../src";
import TextField from "~components/TextField";
import Button from "~components/Button";
import ButtonPanel from "~components/ButtonPanel";
import config from "./config.json";
import { IConfig } from "~../src/types";

const Holder = styled.main`
  border: 2px solid grey;
  border-radius: 3px;
  padding: 25px 25px;
  font-size: 16px;
  min-width: 300px;
  width: 30vw;
  margin: 100px auto;
`;

const LoginForm = () => {
  const [, setDoesFormHasErrors] = useState(false);
  const loginFormRenderer = useMemo(() => {
    return new ReactConfigRenderer(
      config as IConfig,
      new Map([["PAGE_LAYOUT", TextField], ["TEXTFIELD", TextField], ["BUTTON", Button], ["BUTTON_PANEL", ButtonPanel]]),
      {
        initialValues: new Map([["email", "paramsinghvc@gmail.com"]]),
        onErrorStateChange(hasErrors: boolean) {
          setDoesFormHasErrors(hasErrors);
        },
        resolvers: {
          isLoginDisabled({ hasErrors, isPristine, isInvalid }) {
            // eslint-disable-next-line no-console
            console.table({ hasErrors, isPristine, isInvalid });
            return isPristine || isInvalid;
          }
        }
      }
    );
  }, []);

  const LoginFormRendererEl = useMemo(() => {
    return loginFormRenderer.render();
  }, [loginFormRenderer]);

  return (
    <Holder>
      <h3
        css={css`
          margin-top: 0;
          font-weight: 400;
          font-size: 24px;
        `}
      >
        Login Form
      </h3>
      <LoginFormRendererEl />
    </Holder>
  );
};

export default LoginForm;
