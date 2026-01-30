import * as React from "react";

import { Link } from "gatsby";
import { css } from "@emotion/react";
import PageWrapper from "../components/page-wrapper";
import { Section } from "../components/text-helpers";
import { OtherYears } from "../components/page-header";
import * as style from "./index.module.scss";

const workshops = [
  {
    title: "Space Robotics 2025",
    conference: "IEEE SMC-IT/SCC 2025",
    location: "Los Angeles, CA",
    dates: "July 28-29, 2025",
    path: "/spacerobotics2025/",
  },
  {
    title: "ICRA 2026",
    conference: "IEEE International Conference on Robotics and Automation",
    location: "TBD",
    dates: "2026",
    path: "/icra2026/",
  },
  {
    title: "IROS 2026",
    conference: "IEEE/RSJ International Conference on Intelligent Robots and Systems",
    location: "TBD",
    dates: "2026",
    path: "/iros2026/",
  },
];

const IndexPage = () => (
  <PageWrapper
    conference="Workshop Hub"
    rightSide={null}
    leftSide={<OtherYears onConference="Workshop Hub" />}
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
  >
    <Section title="Welcome">
      <p>
        This site is the home for Space Robotics Workshops across conferences.
        Select a workshop below to view details, calls for papers, schedules,
        and organizing information.
      </p>
    </Section>

    <Section title="Workshops">
      <div className={style.cardGrid}>
        {workshops.map(workshop => (
          <Link key={workshop.path} to={workshop.path} className={style.card}>
            <div className={style.cardTitle}>{workshop.title}</div>
            <div className={style.cardMeta}>{workshop.conference}</div>
            <div className={style.cardMeta}>{workshop.location}</div>
            <div className={style.cardMeta}>{workshop.dates}</div>
            <div className={style.cardLink}>View workshop</div>
          </Link>
        ))}
      </div>
    </Section>
  </PageWrapper>
);

export default IndexPage;
