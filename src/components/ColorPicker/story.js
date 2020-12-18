import React from "react";
import { storiesOf } from "@storybook/react";
import { renderWithKnobs } from "../../../.storybook/report";
import SyncColorField from "../../../.storybook/SyncColorField";

import ColorPicker from "./ColorPicker";

storiesOf("Pickers", module).add("ColorPicker", () => (
  <SyncColorField component={ColorPicker}>
    {renderWithKnobs(ColorPicker, {}, null)}
  </SyncColorField>
));
