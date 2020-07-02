import React from "react";
import { storiesOf } from "@storybook/react";

// import Spine from "../src/ui";
import RaptorSpine from "../src/ui/raptor";
import PowerUpSpine from "../src/ui/powerup";

// PROJECT-CONTEXT
import initMockup, { Provider as MockupProvider } from "../src/@mockup/project";

const mockup = initMockup();
const stories = storiesOf("korayturk-stories", module);

stories.add("Raptor", () => (
  <MockupProvider>
    <RaptorSpine />
  </MockupProvider>
));


stories.add("Power Up", () => (
  <MockupProvider>
    <PowerUpSpine />
  </MockupProvider>
));