import * as React from "react";
import { css } from "@emotion/react";
import { Helmet } from "react-helmet";
import Header, { OtherYears } from "../components/page-header";
import WorkshopTemplate from "../components/workshop/WorkshopTemplate";
import icra2026 from "../content/workshops/icra2026";

const Icra2026Page = () => (
  <>
    <Helmet>
      <title>Space Robotics Workshop - ICRA 2026</title>
    </Helmet>
    <Header
      conference="ICRA 2026"
      rightSide={null}
      leftSide={<OtherYears onConference="ICRA 2026" />}
      headerGradient="linear-gradient(120deg, #0b1020, #2b4b7c)"
      headerStyle={css`
        color: #f5f6f8 !important;
        button {
          &:hover {
            color: #e3e8f5 !important;
          }
        }
      `}
      headerContainer={{ style: { display: "none" } }}
      imageContent={{}}
    />
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px" }}>
      <WorkshopTemplate data={icra2026} />

      {/* Post-workshop sections (enable after the event)
      <Section title="Recordings">
        <p>Links to recorded talks will be added here.</p>
      </Section>
      <Section title="Best Paper Awards">
        <p>Best paper awards will be announced here.</p>
      </Section>
      */}
    </div>
  </>
);

export default Icra2026Page;
