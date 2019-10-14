import * as React from "react";
import styled from "@emotion/styled";

import { ReactConfigRenderer, IConfig } from "@mollycule/mason";
import TextField from "~components/TextField";
import Button from "~components/Button";
import ButtonPanel from "~components/ButtonPanel";
import Checkbox from "~components/Checkbox";
import Card from "~components/Card";
import Select from "~components/Select";
import Header from "~components/Header";
import config from "./config.json";

const { useMemo } = React;

const DemoForm = () => {
  const demoFormRenderer = useMemo(() => {
    return new ReactConfigRenderer(
      config as IConfig,
      new Map([
        ["TEXTFIELD", TextField],
        ["BUTTON", Button],
        ["BUTTON_PANEL", ButtonPanel],
        ["CHECKBOX", Checkbox],
        ["SELECT", Select],
        ["CARD", Card],
        ["HEADER", Header]
      ]),
      {
        // initialValues: new Map([["email", "paramsinghvc@swiggy.com"]]),
        resolvers: {
          onSubmit() {
            // eslint-disable-next-line no-console
            console.log(demoFormRenderer.getCurrentValuesSnapshot());
          },
          onReset() {
            const currentValues = demoFormRenderer.getCurrentValuesSnapshot();
            const newValuesMap = new Map();

            for (const [key] of Object.entries(currentValues)) {
              newValuesMap.set(key, "");
            }
            demoFormRenderer && demoFormRenderer.setValue(newValuesMap);
          }
        }
      }
    );
  }, []);

  const DemoFormRendererEl = useMemo(() => {
    return demoFormRenderer.render();
  }, [demoFormRenderer]);

  return <DemoFormRendererEl />;
};

export default DemoForm;
