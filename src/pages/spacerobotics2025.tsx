// import React, { useState, useEffect } from "react";
import * as React from "react";

import { graphql, Link } from "gatsby";
import { Section, SubSection } from "../components/text-helpers";

import PageWrapper from "../components/page-wrapper";

import color from "../components/color";
import { Challenges } from "../components/page-header";
import { Table, Steps, Timeline, Alert } from "antd";
import LaunchIcon from "@material-ui/icons/Launch";
import ReceiptIcon from "@material-ui/icons/Receipt";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { PlayCircleFilled } from "@ant-design/icons";
import moment from "moment-timezone";
import Img, { FixedObject, FluidObject } from "gatsby-image";
import { GithubFilled, LinkedinFilled } from "@ant-design/icons";

import bannerImage from '../../static/images/spacerobotics2025/srw25-banner-3.png';
import NVIDIA from "../../static/images/sponsors/nvidia.svg";
import SOFTSERVE from "../../static/images/sponsors/softserve-logo-big.png";
import laCompaniesMap from "../../static/images/location/la_companies_map.png";

import SlackLogo from "../../static/icons/slack.svg";

const { Step } = Steps;

// import { Speaker, LiveSession, Video } from "./cvpr2020";

// import { OrganizerPics } from "./cvpr2020";
import { css } from "@emotion/react";

import "@allenai/varnish/theme.css";
import * as style from "./spacerobotics2025.module.scss";

// These are for each organizer pic. They encompass the image,
// name, organizations, and external URL when clicked.
export const OrganizerPics = function (props: { organizers: any; data: any }) {
  return (
    <div className={style.organizerContainer}>
      {props.organizers.map(organizer => {
        // Add "Org" suffix to match GraphQL query names
        const imageKey = organizer.imageId + "Org";
        const hasImage = props.data[imageKey] && 
                         props.data[imageKey].childImageSharp && 
                         props.data[imageKey].childImageSharp.fluid;
        
        return (
          <div className={style.organizer} key={organizer.imageId}>
            <div className={style.organizerPic}>
              <a href={organizer.site} target="_blank">
                {hasImage ? (
                  <Img fluid={props.data[imageKey].childImageSharp.fluid} />
                ) : (
                  <Img fluid={props.data["defaultOrg"].childImageSharp.fluid} />
                )}
              </a>
            </div>
            <b>{organizer.name}</b>
            <br />
            {organizer.organization}
          </div>
        );
      })}
    </div>
  );
};

// The speakers of the workshop are all displayed in a similar style,
// and this component encompasses that style.
export const Speaker = (props: {
  url?: string;
  fixedImg: FixedObject;
  name: string;
  organizations: string[];
  noMargin?: boolean;
}) => (
  <div className={props.noMargin ? style.speakerNoMargin : style.speaker}>
    <div
      css={css`
        vertical-align: middle;
        display: inline-block;
      `}
    >
      {props.url ? (
        <Video fontSize="45px" url={props.url}>
          <Img fixed={props.fixedImg} />
        </Video>
      ) : (
        <Img fixed={props.fixedImg} />
      )}
    </div>
    <div className={style.speakerInfo}>
      <b>{props.name}</b>
      {props.organizations.map(org => (
        <>
          <br />
          {org}
        </>
      ))}
    </div>
  </div>
);

// There were 2 live sessions, each with questions that could be
// submitted ahead of time, a zoom link, panelist info, topic info,
// and a reference to the recorded session.
export const LiveSession = (props: {
  videoURL: string;
  fluidImage: FluidObject;
  questionLink?: string;
  date?: string;
  panel?: string;
  topics?: string;
  rhs?: React.ReactNode;
}) => (
  <div
    className={style.liveSession}
    css={css`
      margin-bottom: ${props.rhs ? "40px" : "initial"};
    `}
  >
    <div className={style.liveSessionVideo}>
      {props.videoURL ? (
        <Video fontSize="70px" url={props.videoURL}>
          <Img fluid={props.fluidImage} />
        </Video>
      ) : (
        <Img fluid={props.fluidImage} />
      )}
    </div>
    {props.rhs ? (
      <div className={style.sessionBoxContainer}>{props.rhs}</div>
    ) : (
      <div className={style.sessionBoxContainer}>
        <a href={props.questionLink} target="_blank">
          <div className={style.liveSessionBox}>Submit Questions</div>
        </a>
        <div className={style.liveSessionBox}>
          <div>Join Zoom Meeting</div>
          <div>{props.date}</div>
        </div>
      </div>
    )}
    {props.panel && props.topics ? (
      <div className={style.liveSessionInfo}>
        <p>
          <b>Panel.</b> {props.panel}
        </p>
        <p>
          <b>Topics.</b> {props.topics}
        </p>
      </div>
    ) : (
      <></>
    )}
  </div>
);

// Wrapper for any generic video that is linked to an external page.
// Note that @fontSize sets the size of the play icon.
export function Video(props: {
  fontSize: string;
  url: string;
  children: React.ReactNode;
}) {
  const [videoHovered, setVideoHovered] = React.useState(false);
  return (
    <a href={props.url} target="_blank">
      <div className={style.videoWrapper}>
        <div
          onMouseOver={() => setVideoHovered(true)}
          onMouseOut={() => setVideoHovered(false)}
          className={style.video}
        >
          {props.children}
          <PlayCircleFilled
            style={{
              fontSize: props.fontSize,
              opacity: videoHovered ? 0.15 : 0.9,
            }}
            className={style.videoPlay}
          />
        </div>
      </div>
    </a>
  );
}
/**
 * Return true if an email is formatted correctly, otherwise false.
 * Taken from https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
 * @param email the input email
 */
function validateEmail(email: string) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function ChallengeVideo(props: {
  url: string;
  imageQuery: string;
  data: object;
}) {
  return (
    <Video fontSize="45px" url={props.url}>
      <Img fluid={props.data[props.imageQuery].childImageSharp.fluid} />
    </Video>
  );
}

function ChallengeSpotlight(props: {
  url: string;
  imageQuery: string;
  data: object;
  width?: string;
  playSize?: string;
  display?: string;
  rank: string;
}) {
  return (
    <div
      css={css`
        width: ${props.width ? props.width : "175px"};
        margin-bottom: 12px;
        display: ${props.display ? props.display : "inline-block"};
        text-align: center;
        margin-right: ${props.display === "block" ? "auto" : "4px"};
        margin-left: ${props.display === "block" ? "auto" : "4px"};
      `}
    >
      <Video
        fontSize={props.playSize ? props.playSize : "25px"}
        url={props.url}
      >
        <Img fluid={props.data[props.imageQuery].childImageSharp.fluid} />
      </Video>
      <div
        css={css`
          background-color: ${color.gray4};
          border-radius: 0px 0px 3px 3px;
          border-right: 1px solid ${color.gray6};
          border-left: 1px solid ${color.gray6};
          border-bottom: 1px solid ${color.gray6};
        `}
      >
        {props.rank}
      </div>
    </div>
  );
}

const challengePageMap = {
  CHALLENGE_TODO: (
    <a href="" target="_blank">
      Comming Soon
    </a>
  ),
};

function EmailSubscription(props: {
  actionIdentifier: string;
  entryNumber: number;
}) {
  const [submitted, setSubmitted] = React.useState(false),
    [emailFocused, setEmailFocused] = React.useState(false),
    [inputEmail, setInputEmail] = React.useState("");

  const emailIsValid = validateEmail(inputEmail);

  return (
    <div
      css={css`
        text-align: center;
        margin-top: 60px;
        margin-bottom: 60px;
      `}
    >
      <form
        encType="text/plain"
        action={
          emailIsValid
            ? `https://docs.google.com/forms/d/e/${props.actionIdentifier}/formResponse?usp=pp_url&entry.${props.entryNumber}=${inputEmail}`
            : ``
        }
        target={`hidden_iframe${props.actionIdentifier}`}
        onSubmit={() => (emailIsValid ? setSubmitted(true) : false)}
        method="post"
      >
        <div
          css={css`
            margin-bottom: 10px;
          `}
        >
          <div
            css={css`
              font-weight: bold;
              font-size: 25px;
              color: "#2b4acb";
              vertical-align: middle;
              display: inline-block;
            `}
          >
            Sign Up for Updates
          </div>
          <div
            css={css`
              vertical-align: middle;
              display: inline-block;
              margin-top: 6px;
              margin-left: 5px;
            `}
          ></div>
        </div>
        {submitted ? (
          <div>Thanks for signing up!</div>
        ) : (
          <>
            <div
              css={css`
                border-radius: 5px;
                box-shadow: 0px 0px 2px 0px #2b4acb;
                display: inline-block;
                margin: auto;
                * {
                  padding-top: 3px;
                  padding-bottom: 5px;
                }
              `}
            >
              <input
                type="email"
                autoComplete="off"
                placeholder="email"
                name={`entry.${props.entryNumber}`}
                id={`entry.${props.entryNumber}`}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setInputEmail(event.target.value)
                }
                value={inputEmail}
                css={css`
                  background-color: transparent;
                  transition-duration: 0.3s;
                  box-shadow: 0px 0px 1px 2px
                    ${!emailFocused && !emailIsValid && inputEmail != ""
                      ? "#ff7875"
                      : "transparent"};
                  border: none;
                  width: 350px;
                  @media (max-width: 500px) {
                    width: 55vw;
                  }
                  border-radius: 5px;
                  padding-left: 8px;
                `}
              />
              <input
                type={emailIsValid ? "submit" : "button"}
                value="Sign Up"
                onClick={() => (emailIsValid ? true : false)}
                css={css`
                  background-color: transparent;
                  border: none;
                  font-weight: 600;
                  transition-duration: 0.3s;
                  color: ${emailIsValid ? "#2b4acb" : "#2b4acb" + "88"};
                  padding-top: 3px;
                  padding-right: 12px;
                  padding-left: 10px;
                  &:hover {
                    cursor: ${emailIsValid ? "pointer" : "default"};
                  }
                `}
              />
            </div>
            <div
              css={css`
                margin-top: 5px;
                color: ${"#8c8c8c"};
              `}
            >
              You can unsubscribe at any time.
            </div>
          </>
        )}
      </form>
      <iframe
        name={`hidden_iframe${props.actionIdentifier}`}
        id={`hidden_iframe${props.actionIdentifier}`}
        css={css`
          display: none !important;
        `}
      />
    </div>
  );
}

function getWindowWidth() {
  if (typeof window === "undefined") {
    // this only happens when statically building.
    return 800;
  }
  const { innerWidth: width } = window;
  return width;
}

function PaperButton(props: { text: string; url: string }) {
  return (
    <a
      href={props.url}
      target="_blank"
      css={css`
        margin-right: 10px;
      `}
    >
      <div
        css={css`
          display: inline-block;
          border: 1px solid ${color.gray5};
          background-color: ${color.gray2};
          padding-left: 7px;
          padding-right: 7px;
          border-radius: 5px;
          transition-duration: 0.15s;
          > span {
            vertical-align: middle;
          }

          &:hover {
            background-color: ${color.gray4};
            border: 1px solid ${color.gray6};
          }
        `}
      >
        <span
          css={css`
            margin-left: 5px;
            color: ${color.gray10};
          `}
        >
          {props.text}
        </span>
      </div>
    </a>
  );
}

function Abstract(props: { text: string }) {
  const [showFullText, setShowFullText] = React.useState(false);

  let text;
  if (props.text.indexOf(" ", 250) === -1) {
    text = <div>{props.text}</div>;
  } else {
    text = (
      <div>
        {showFullText
          ? props.text + " "
          : props.text.indexOf(". ") + 2 > 250
          ? props.text.slice(0, props.text.indexOf(". ") + 2)
          : props.text.slice(0, 250) + "... "}
        <span
          css={css`
            color: ${color.light.blue6};
            &:hover {
              cursor: pointer;
            }
          `}
          onClick={() => setShowFullText(prev => !prev)}
        >
          [{!showFullText ? "Expand" : "Collapse"}]
        </span>
      </div>
    );
  }

  return (
    <div
      css={css`
        padding: 20px;
        background: ${color.gray1};
        border: 1px solid ${color.gray5 + "cc"};
        box-shadow: 0px 0px 100px 0px ${color.gray4};
        border-radius: 0px;
        padding-bottom: 45px;
        text-align: left;
        vertical-align: top;
        display: inline-block;
        position: relative;
        @media (min-width: 601px) {
          min-height: 25px;
        }
      `}
    >
      {text}
    </div>
  );
}

function Paper(props: {
  title: string;
  abstract: string;
  authors: object;
  affiliations: string[];
  pdf: string;
  poster?: string;
}) {
  const [showFullAbstract, setShowFullAbstract] = React.useState(false);

  let abs;
  if (props.abstract.indexOf(" ", 250) === -1) {
    abs = <div>{props.abstract}</div>;
  } else {
    abs = (
      <div>
        {showFullAbstract
          ? props.abstract + " "
          : props.abstract.slice(0, props.abstract.indexOf(". ") + 2)}
        <span
          css={css`
            color: ${color.light.blue6};
            &:hover {
              cursor: pointer;
            }
          `}
          onClick={() => setShowFullAbstract(prev => !prev)}
        >
          [{!showFullAbstract ? "Expand" : "Collapse"}]
        </span>
      </div>
    );
  }

  return (
    <div
      css={css`
        padding: 20px;
        background: ${color.gray1};
        border: 1px solid ${color.gray5 + "cc"};
        box-shadow: 0px 0px 100px 0px ${color.gray4};
        border-radius: 0px;
        padding-bottom: 45px;
        text-align: left;
        vertical-align: top;
        display: inline-block;
        position: relative;
        @media (min-width: 601px) {
          min-height: 250px;
        }
      `}
    >
      <a href={props.pdf} target="_blank">
        <div
          css={css`
            font-weight: 600;
            line-height: 20px;
            color: ${color.light.blue7};
            font-size: 15px;
            transition-duration: 0.15s;
            &:hover {
              color: ${color.light.blue6};
            }
          `}
        >
          {props.title}
        </div>
      </a>
      <div
        css={css`
          margin-bottom: 8px;
          color: ${color.gray8};
          line-height: 20px;
          font-size: 13px;
          /* margin-top: 5px; */
        `}
      >
        {Object.keys(props.authors).map((name: string, i: number) => (
          <>
            <span>{name}</span>
            <sup></sup>
            {i !== Object.keys(props.authors).length - 1 ? ", " : ""}
          </>
        ))}
      </div>
      {abs}
      <div
        css={css`
          position: absolute;
          bottom: 10px;
          width: calc(100% - 40px);
          padding-top: 5px;
        `}
      >
        <PaperButton text="PDF" url={props.pdf} />
        {props.poster ? (
          <PaperButton text="Poster" url={props.poster} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

let acceptedPapers = [];

const Time = (props: { time: string }) => (
  <span
    css={css`
      color: ${color.gray7};
    `}
  >
    {props.time}
  </span>
);

const paperOrder = shuffle([...Array(acceptedPapers.length).keys()]);

// taken from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function InlineSlack() {
  return (
    <div>
      <a
        href="//join.slack.com/t/embodied-aiworkshop/shared_invite/zt-s6amdv5c-gBZQZ7YSktrD_tMhQDjDfg"
        target="_blank"
      >
        <div
          css={css`
            display: inline-block;
            /* border: 1px solid ${color.gray6}; */
            border-radius: 0px 10px 0px 10px;
            padding-left: 10px;
            padding-right: 10px;
            margin-top: 3px;
            padding-top: 3px;
            padding-bottom: 4px;
            background-color: #4a154b;
            transition-duration: 0.15s;
            color: white;
            &:hover {
              cursor: pointer;
              filter: contrast(1.25);
            }
            > span,
            > img {
              vertical-align: middle;
            }
          `}
        >
          <img
            src={SlackLogo}
            css={css`
              width: 15px;
              margin-right: 5px;
            `}
          />{" "}
          <span>
            Ask questions on <b>Slack</b>
          </span>
        </div>
      </a>
    </div>
  );
}

function Slack() {
  return (
    <a
      href="//join.slack.com/t/embodied-aiworkshop/shared_invite/zt-s6amdv5c-gBZQZ7YSktrD_tMhQDjDfg"
      target="_blank"
    >
      <div
        css={css`
          background-color: #4a154b;
          color: white;
          padding: 15px 15px;
          border-radius: 10px 0px 10px 0px;
          transition-duration: 0.15s;

          &:hover {
            cursor: pointer;
            filter: contrast(1.25);
            box-shadow: 0px 0px 15px 0px ${color.gray6};
          }
        `}
      >
        <img
          src={SlackLogo}
          css={css`
            height: 20px;
            vertical-align: middle;
            margin-right: 7px;
          `}
        />
        <div
          css={css`
            display: inline-block;
            vertical-align: middle;
          `}
        >
          Ask Questions on <b>Slack</b>
        </div>
        <div
          css={css`
            background-color: white;
            color: black;
            padding: 5px;
            padding-top: 6px;
            padding-bottom: 3px;
            padding-left: 5px;
            margin-top: 12px;
            border-radius: 10px 0px 10px 0px;
          `}
        >
          Questions can be asked <b>anonymously</b>.
        </div>
      </div>
    </a>
  );
}

// First, let's add a function to determine upcoming deadlines
// Add this near the top of your SpaceRobotics2025Page component
const isUpcomingDeadline = (deadlineDate) => {
  const today = new Date();
  const deadline = new Date(deadlineDate);
  return deadline > today;
};

// Function to determine current timeline step based on today's date
const getCurrentTimelineStep = () => {
  const today = new Date();
  const deadlines = [
    { date: "2025-04-01", step: 0 }, // Workshop Announced
    { date: "2025-05-23", step: 1 }, // Paper Submission - Archival
    { date: "2025-06-13", step: 2 }, // Paper Submission - Non-Archival
    { date: "2025-06-13", step: 3 }, // Paper Notification - Archival
    { date: "2025-06-20", step: 4 }, // Paper Notification - Non-Archival
    { date: "2025-06-20", step: 5 }, // Camera-Ready - Archival
    { date: "2025-07-07", step: 6 }, // Camera-Ready - Non-Archival
    { date: "2025-07-28", step: 7 }, // Workshop
  ];

  // Find the current step - the last deadline that has passed
  let currentStep = 0;
  for (const deadline of deadlines) {
    const deadlineDate = new Date(deadline.date);
    if (today >= deadlineDate) {
      currentStep = deadline.step;
    } else {
      break;
    }
  }
  
  // If we're between steps, show the next upcoming step as current
  if (currentStep < deadlines.length - 1) {
    return currentStep + 1;
  }
  
  return currentStep;
};

// Function to determine if a step should be highlighted
const isCurrentStep = (stepIndex) => {
  return getCurrentTimelineStep() === stepIndex;
};

// Add this component before the main export function
function VenueSection({ data }) {
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '30px', flexWrap: 'wrap' }}>
        <img 
          src={laCompaniesMap} 
          alt="LA Companies Map" 
          style={{ 
            maxWidth: '800px', 
            width: '100%', 
            height: 'auto', 
            borderRadius: '8px', 
            marginBottom: '20px',
            cursor: 'pointer',
            transition: 'transform 0.2s ease-in-out'
          }}
          onClick={() => setModalVisible(true)}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        />
        <div style={{ flex: 1, minWidth: '250px' }}>
          <p>
            The <a href="https://californiasciencecenter.org/" target="_blank" rel="noopener noreferrer">California Science Center</a> offers a uniquely inspiring venue for the 2nd Space Robotics Workshop. As the permanent home of the Space Shuttle Endeavour, and soon the world's only vertical launch display complete with external tank and solid rocket boosters, it grounds our discussions in the tangible legacy and future of spaceflight. Situated in the heart of Los Angeles, the Center links us to a vibrant ecosystem of innovation, science, and exploration.
          </p>
          <p>
            This map is intended to solely show the density of players in the aerospace, robotics, and defense sector and where the workshop will take place. It's not meant to be exhaustive and our organization is not responsible for any missing organizations or misplaced locations.
          </p>
          <p style={{ fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
            Click on the map to view it in full size.
          </p>
        </div>
      </div>

      {/* Modal for full-size image */}
      {modalVisible && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            cursor: 'pointer'
          }}
          onClick={() => setModalVisible(false)}
        >
          <div style={{ position: 'relative', maxWidth: '95%', maxHeight: '95%' }}>
            <img 
              src={laCompaniesMap} 
              alt="LA Companies Map - Full Size"
              style={{ 
                width: '100%', 
                height: 'auto',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => setModalVisible(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// And finally, we add all the content into their respective sections.
export default function Home({ data }) {
  const [windowWidth, setWindowWidth] = React.useState(getWindowWidth());

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(getWindowWidth());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const challengeData = [
    {
      challenge: challengePageMap["CHALLENGE_TODO"],
      key: "CHALLENGE_TODO",
      task: "",
      interactiveActions: "",
      simulationPlatform: "",
      sceneDataset: "",
      observations: "",
      actionSpace: "",
      stochasticAcuation: "",
      winner: "",
    },
  ];

  // using 4:59 since PST is 5 hours behind AoE.
  const paperDeadline = moment.tz("2022-05-17 04:59", "America/Los_Angeles");
  const currentTime = moment();
  const duration = moment.duration(paperDeadline.diff(currentTime));

  const hoursLeft = Math.ceil(duration.asHours() % 24);
  const daysLeft = Math.floor(duration.asDays());

  return (
    <PageWrapper
      // Prior variant
      // headerGradient="radial-gradient(#090617, #090617)"
      // 2023 variant
      // headerGradient="linear-gradient(0deg, #1f2f3f, #100b0f)"
      // 2024 variant
      // headerGradient="radial-gradient(#330066, #ff9933)"
      //headerGradient="linear-gradient(0deg, rgb(255, 255, 255), rgb(112, 143, 228))"
      headerGradient=" radial-gradient(at top left, rgb(51, 52, 53), transparent 50%), 
                radial-gradient(at top right, rgb(67, 83, 86), transparent 50%), 
                radial-gradient(at bottom left, rgb(149, 140, 124), transparent 50%), 
                radial-gradient(at bottom right, rgb(160, 201, 206), transparent 50%)"
      headerStyle={css`
        color: ${color.dark.gold10} !important;
        button {
          &:hover {
            color: ${color.dark.gold9} !important;
          }
        }
      `}
      imageContent={{
        css: css`
          width: 130%;
          background-repeat: no-repeat;
          padding-top: 70.25%;
          margin-top: 5px;
          margin-left: -15%;
          margin-bottom: -15px;
          background-image: url(${bannerImage});
          background-size: cover;
          background-position: center;
        `,
      }}
      conference="IEEE SMC-IT/SCC 2025 - Los Angeles"
      rightSide={
        <Challenges
          conference="IEEE SMC-IT/SCC 2025"
          challengeData={Object.values(challengePageMap)}
        />
      }
    >
      <Alert
        message={
          <>
            <strong>Registration is now open!</strong> Secure your spot at the 2nd Space Robotics Workshop. <strong>A full SMC-IT/SCC conference registration is required to participate in the workshop.</strong> <a href="https://cvent.me/vAOdOx" target="_blank" rel="noopener noreferrer">Register here</a>.
          </>
        }
        type="success"
        showIcon={false}
        style={{ marginBottom: '1em', marginTop: '1em' }}
      />
      <Section title="Overview">
        <p>
          The <strong>2nd Space Robotics Workshop (SRW)</strong> will be held in conjunction with the <strong><a href="https://2025.smcit-scc.space/" target="_blank" rel="noopener noreferrer">IEEE SMC-IT/SCC</a></strong> from <strong>July 28-29, 2025</strong>, at the <strong><a href="https://californiasciencecenter.org/" target="_blank" rel="noopener noreferrer">California Science Center</a></strong> in <strong>Los Angeles, CA</strong>. The workshop will bring together experts in robotics, autonomy, AI, and aerospace to shape the next era of innovation driving our return to the Moon, the sustainable exploration of Mars and beyond, and the expansion of commercial activity beyond Earth orbit.
        </p>
        <p>
          As national space agencies and commercial ventures capitalize on next-generation robotics, we stand at a critical juncture. Increasing mission complexity, evolving space architectures, expanding commercial services, and the rapid progress in AI present both unprecedented opportunities and new challenges in how we explore, operate, and build a sustainable space economy. Rapid advances in terrestrial robotics are directly influencing the development of space robotics and are poised to play a central role in enabling more autonomous, resilient, and ambitious missions, while also laying the groundwork for future off-world economic activities.
        </p>
        <p>
          Building on the foundation laid during our <a href="https://2024.smcit-scc.space/workshop-srw.html" target="_blank" rel="noopener noreferrer">inaugural event</a>, this year's workshop will focus on the recent breakthroughs in the field of robotics, the current state of space robotics, the rise of the commercial space sector supporting the lunar economy, and emerging concepts aimed at enabling more capable, adaptable, and cost-effective missions.
        </p>
        <p>
          The program will be organized around a set of focused technical sessions, with keynote talks, spotlight presentations, panels, and a poster session.
        </p>
        {/* <Alert
          type="warning" // This makes the background yellow
            message={
              <>
                💡 Also of interest for the community: The{" "}
                <a
                  href="https://albee.github.io/space-robotics-rss/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  RSS'25 Space Robotics Workshop
                </a>{" "}
                (June 21, Los Angeles) is accepting submissions through May 2.
                We encourage the community to explore both workshops.
              </>
            }
            style={{ marginTop: "20px", marginBottom: "20px" }} // Add some spacing
          /> */}
      </Section>

      <Section title="Timeline">
        <Steps progressDot current={getCurrentTimelineStep()} direction="vertical">
          <Step title="Workshop Announced" description="April 1st, 2025" />
          <Step
            title={
              <span style={{ 
                fontWeight: isCurrentStep(1) ? "bold" : "normal",
                color: isCurrentStep(1) ? "#1890ff" : "inherit"
              }}>
                Paper Submission Deadline - Archival Track
              </span>
            }
            description="May 23rd, 2025"
          />
          <Step
            title={
              <span style={{ 
                fontWeight: isCurrentStep(2) ? "bold" : "normal",
                color: isCurrentStep(2) ? "#1890ff" : "inherit"
              }}>
                Paper Submission Deadline - Non-Archival Track (Extended)
              </span>
            }
            description="June 13th, 2025"
          />
          <Step
            title={
              <span style={{ 
                fontWeight: isCurrentStep(3) ? "bold" : "normal",
                color: isCurrentStep(3) ? "#1890ff" : "inherit"
              }}>
                Paper Notification - Archival Track (Extended)
              </span>
            }
            description="June 13th, 2025"
          />
          <Step
            title={
              <span style={{ 
                fontWeight: isCurrentStep(4) ? "bold" : "normal",
                color: isCurrentStep(4) ? "#1890ff" : "inherit"
              }}>
                Paper Notification - Non-Archival Track
              </span>
            }
            description="June 20th, 2025"
          />
          <Step
            title={
              <span style={{ 
                fontWeight: isCurrentStep(5) ? "bold" : "normal",
                color: isCurrentStep(5) ? "#1890ff" : "inherit"
              }}>
                Final Camera-Ready Deadline - Archival Track
              </span>
            }
            description="June 20th, 2025"
          />
          <Step
            title={
              <span style={{ 
                fontWeight: isCurrentStep(6) ? "bold" : "normal",
                color: isCurrentStep(6) ? "#1890ff" : "inherit"
              }}>
                Final Camera-Ready Deadline - Non-Archival Track
              </span>
            }
            description="July 7th, 2025"
          />
          <Step
            title={
              <span style={{ 
                fontWeight: isCurrentStep(7) ? "bold" : "normal",
                color: isCurrentStep(7) ? "#1890ff" : "inherit"
              }}>
                Second Annual Space Robotics Workshop at IEEE SMC-IT/SCC
              </span>
            }
            description={
              <>
                <a
                  href="https://californiasciencecenter.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  California Science Center
                </a>{" "}
                <br />
                Los Angeles, California
                <br />
                July 28-29, 2025
                <br />
                <span
                  css={css`
                    color: ${color.gray7};
                  `}
                ></span>
              </>
            }
          ></Step>
        </Steps>
      </Section>

      <Section title="Venue">
        <VenueSection data={data} />
      </Section>

      <Section title="Confirmed Speakers">
        <p>
          We are pleased to announce our confirmed speakers for the 2nd Space Robotics Workshop:
        </p>
        <div className={style.speakersGrid} style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px', 
          marginTop: '30px' 
        }}>
          <Speaker
            organizations={["University of Texas at Austin"]}
            name="Maruthi R. Akella"
            fixedImg={data.maruthiAkella.childImageSharp.fixed}
            noMargin={true}
          />
          <Speaker
            organizations={["UC Berkeley"]}
            name="Lindy Elkins-Tanton"
            fixedImg={data.lindyElkinsTanton.childImageSharp.fixed}
            noMargin={true}
          />
          <Speaker
            organizations={["UCLA"]}
            name="Dennis Hong"
            fixedImg={data.dennisHong.childImageSharp.fixed}
            noMargin={true}
          />
          <Speaker
            organizations={["Honeybee Robotics (Blue Origin)"]}
            name="Dean Bergman"
            fixedImg={data.deanBergman.childImageSharp.fixed}
            noMargin={true}
          />
          <Speaker
            organizations={["Stanford"]}
            name="Grace Gao"
            fixedImg={data.graceGao.childImageSharp.fixed}
            noMargin={true}
          />
          <Speaker
            organizations={["SETI Institute / Mars Institute"]}
            name="Pascal Lee"
            fixedImg={data.pascalLee.childImageSharp.fixed}
            noMargin={true}
          />
          <Speaker
            organizations={["NASA"]}
            name="Ignacio López-Francos"
            fixedImg={data.ignacioGLopezFrancos.childImageSharp.fixed}
            noMargin={true}
          />
          <Speaker
            organizations={["NASA"]}
            name="Rob Mueller"
            fixedImg={data.robMueller.childImageSharp.fixed}
            noMargin={true}
          />
          <Speaker
            organizations={["University of Wisconsin-Madison"]}
            name="Dan Negrut"
            fixedImg={data.danNegrut.childImageSharp.fixed}
            noMargin={true}
          />
          <Speaker
            organizations={["Sentric Solutions"]}
            name="Brice Howard"
            fixedImg={data.briceHoward.childImageSharp.fixed}
            noMargin={true}
          />
          <Speaker
            organizations={["NASA JPL"]}
            name="Hiro Ono"
            fixedImg={data.hiroOno.childImageSharp.fixed}
            noMargin={true}
          />
          <Speaker
            organizations={["USC"]}
            name="Feifei Qian"
            fixedImg={data.feifeiQian.childImageSharp.fixed}
            noMargin={true}
          />
          <Speaker
            organizations={["SoftServe"]}
            name="Lutz Richter"
            fixedImg={data.lutzRichter.childImageSharp.fixed}
            noMargin={true}
          />
          <Speaker
            organizations={["Aurelia Institute"]}
            name="Annika Rollock"
            fixedImg={data.annikaRollock.childImageSharp.fixed}
            noMargin={true}
          />
          <Speaker
            organizations={["University of Texas at Austin"]}
            name="Luis Sentis"
            fixedImg={data.luisSentis.childImageSharp.fixed}
            noMargin={true}
          />
          <Speaker
            organizations={["USC", "NVIDIA"]}
            name="Yue Wang"
            fixedImg={data.yueWang.childImageSharp.fixed}
            noMargin={true}
          />
          <Speaker
            organizations={["Skycorp"]}
            name="Dennis Wingo"
            fixedImg={data.dennisWingo.childImageSharp.fixed}
            noMargin={true}
          />
          <Speaker
            organizations={["Starpath Robotics"]}
            name="Brian Yamauchi"
            fixedImg={data.brianYamauchi.childImageSharp.fixed}
            noMargin={true}
          />

        </div>
      </Section>

      <Section title="Workshop Agenda">
        <p><strong>All sessions will be held in Room CR4</strong></p>
        
        <h2>Day 1 - Monday, July 28</h2>
        <Timeline>
          <Timeline.Item>
            <b>Opening Remarks</b>
            <br/>
            <Time time="10:30 - 10:35 AM PT" />
            <br/>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', marginBottom: '15px' }}>
              <div style={{ marginRight: '10px' }}>
                <Img 
                  fixed={data.ignacioGLopezFrancos.childImageSharp.fixed} 
                  style={{ borderRadius: '50%', width: '40px', height: '40px' }}
                />
              </div>
              <div>
                <strong>Speaker:</strong> Ignacio López-Francos (NASA)
              </div>
            </div>
          </Timeline.Item>

          <Timeline.Item>
            <b>Unlocking the Offworld Economy with Robotic Technologies</b>
            <br/>
            <Time time="10:35 AM - 12:00 PM PT" />
            <br/>
            <div style={{ marginBottom: '15px', marginTop: '15px' }}>
              <strong>Speakers:</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Img 
                    fixed={data.maggieWang.childImageSharp.fixed} 
                    style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '8px' }}
                  />
                  <span>Maggie Wang (Stanford) <em>(Session Chair)</em></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Img 
                    fixed={data.dennisWingo.childImageSharp.fixed} 
                    style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '8px' }}
                  />
                  <span>Dennis Wingo (Skycorp)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Img 
                    fixed={data.graceGao.childImageSharp.fixed} 
                    style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '8px' }}
                  />
                  <span>Grace Gao (Stanford)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Img 
                    fixed={data.robMueller.childImageSharp.fixed} 
                    style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '8px' }}
                  />
                  <span>Rob Mueller (NASA)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Img 
                    fixed={data.briceHoward.childImageSharp.fixed} 
                    style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '8px' }}
                  />
                  <span>Brice Howard (Sentric Solutions)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Img 
                    fixed={data.brianYamauchi.childImageSharp.fixed} 
                    style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '8px' }}
                  />
                  <span>Brian Yamauchi (Starpath Robotics)</span>
                </div>
              </div>
            </div>
            <Abstract
              text="The mineral resource map of our solar system is still largely blank, leaving the scientific, economic, and strategic value of lunar terrain—and of nearby asteroids—uncertain. This uncertainty is especially critical for New Space companies pursuing high-value offworld resources such as volatiles, He-3, and other exotic materials. Unlocking that potential and avoiding scarcity-driven competition will require advanced robotic automation and autonomy—not only to detect, assess, and extract these resources but also to build the infrastructure needed to operate at economic scale. The technologies pioneered for lunar and asteroid exploration are poised to reshape terrestrial workflows as well, fostering innovation and abundance both on Earth and beyond. This session surveys prioritized lunar resource models alongside the enabling robotic technologies that can realize a sustainable offworld economy."
            />
          </Timeline.Item>

          <Timeline.Item>
            <b>Lunch Break</b>
            <br/>
            <Time time="12:00 - 1:00 PM PT" />
          </Timeline.Item>

          <Timeline.Item>
            <b>Mars Settlement Starts with Autonomy and Robotics</b>
            <br/>
            <Time time="1:00 - 2:30 PM PT" />
            <br/>
            <div style={{ marginBottom: '15px', marginTop: '15px' }}>
              <strong>Speakers:</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Img 
                    fixed={data.luisSentis.childImageSharp.fixed} 
                    style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '8px' }}
                  />
                  <span>Luis Sentis (University of Texas at Austin / Apptronik) <em>(Session Chair)</em></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Img 
                    fixed={data.ignacioGLopezFrancos.childImageSharp.fixed} 
                    style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '8px' }}
                  />
                  <span>Ignacio López-Francos (NASA)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Img 
                    fixed={data.maruthiAkella.childImageSharp.fixed} 
                    style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '8px' }}
                  />
                  <span>Maruthi R. Akella (University of Texas at Austin)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Img 
                    fixed={data.pascalLee.childImageSharp.fixed} 
                    style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '8px' }}
                  />
                  <span>Pascal Lee (SETI Institute / Mars Institute)</span>
                </div>
              </div>
            </div>
            <Abstract
              text="As we extend robotic exploration to Mars and lay the groundwork for crewed missions and sustained human presence, increasing levels of autonomy become essential. Far from Earth and constrained by communication delays, robotic systems must perceive their environment, make decisions, and act independently to achieve science and mission objectives. This session will explore the robotics and autonomy technologies NASA and its partners must develop or mature—not only to support the Moon-to-Mars architecture but also to accelerate the transition from initial sorties to a self-sufficient Martian outpost. We will examine how recent advances in AI can drive resilient, adaptable, and intelligent systems that move us closer to this long-term vision."
            />
          </Timeline.Item>

          <Timeline.Item>
            <b>One-Shot Interplanetary Exploration With Software-Defined Robotic Systems (Part 1)</b>
            <br/>
            <Time time="2:30 - 3:00 PM PT" />
            <br/>
            <div style={{ marginBottom: '15px', marginTop: '15px' }}>
              <strong>Speakers:</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Img 
                    fixed={data.hiroOno.childImageSharp.fixed} 
                    style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '8px' }}
                  />
                  <span>Hiro Ono (NASA JPL) <em>(Session Chair)</em></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Img 
                    fixed={data.annikaRollock.childImageSharp.fixed} 
                    style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '8px' }}
                  />
                  <span>Annika Rollock (Aurelia Institute)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Img 
                    fixed={data.lindyElkinsTanton.childImageSharp.fixed} 
                    style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '8px' }}
                  />
                  <span>Lindy Elkins-Tanton (UC Berkeley)</span>
                </div>
              </div>
            </div>
            <Abstract
              text="As we look beyond Mars toward the outer Solar System, the traditional model of incremental mission development becomes infeasible. This session will explore emerging concepts for adaptive, autonomous robotic systems capable of operating in unknown and extreme environments with minimal prior knowledge or ground intervention. Discussions will center on architectural principles, enabling technologies, and cross-disciplinary insights—from robotics and AI to planetary science and evolutionary biology—that could support one-shot missions to unvisited worlds."
            />
          </Timeline.Item>

          <Timeline.Item>
            <b>Coffee Break</b>
            <br/>
            <Time time="3:00 - 3:30 PM PT" />
          </Timeline.Item>

          <Timeline.Item>
            <b>One-Shot Interplanetary Exploration With Software-Defined Robotic Systems (Part 2)</b>
            <br/>
            <Time time="3:30 - 5:00 PM PT" />
            <br/>
            <div style={{ marginBottom: '15px', marginTop: '15px' }}>
              <strong>Speakers:</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Img 
                    fixed={data.hiroOno.childImageSharp.fixed} 
                    style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '8px' }}
                  />
                  <span>Hiro Ono (NASA JPL) <em>(Session Chair)</em></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Img 
                    fixed={data.deanBergman.childImageSharp.fixed} 
                    style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '8px' }}
                  />
                  <span>Dean Bergman (Honeybee Robotics / Blue Origin)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Img 
                    fixed={data.feifeiQian.childImageSharp.fixed} 
                    style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '8px' }}
                  />
                  <span>Feifei Qian (USC)</span>
                </div>
              </div>
            </div>
            <Abstract
              text="As we look beyond Mars toward the outer Solar System, the traditional model of incremental mission development becomes infeasible. This session will explore emerging concepts for adaptive, autonomous robotic systems capable of operating in unknown and extreme environments with minimal prior knowledge or ground intervention. Discussions will center on architectural principles, enabling technologies, and cross-disciplinary insights—from robotics and AI to planetary science and evolutionary biology—that could support one-shot missions to unvisited worlds."
            />
          </Timeline.Item>
        </Timeline>

        <h2>Day 2 - Tuesday, July 29</h2>
        <Timeline>
          <Timeline.Item>
            <b>High-Fidelity Simulation and Digital Twins for Space Robotics</b>
            <br/>
            <Time time="10:30 AM - 12:00 PM PT" />
            <br/>
            <div style={{ marginBottom: '15px', marginTop: '15px' }}>
              <strong>Speakers:</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Img 
                    fixed={data.lutzRichter.childImageSharp.fixed} 
                    style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '8px' }}
                  />
                  <span>Lutz Richter (SoftServe) <em>(Session Chair)</em></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Img 
                    fixed={data.danNegrut.childImageSharp.fixed} 
                    style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '8px' }}
                  />
                  <span>Dan Negrut (University of Wisconsin-Madison)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Img 
                    fixed={data.yueWang.childImageSharp.fixed} 
                    style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '8px' }}
                  />
                  <span>Yue Wang (USC, NVIDIA)</span>
                </div>
              </div>
            </div>
            <Abstract
              text="High-fidelity simulation is playing an increasingly critical role in the development, testing, and validation of autonomous robotic systems for space exploration. This session will focus on the state of the art in simulation tools and digital twin frameworks used to model lunar, Martian, and other planetary environments. Topics will include terrain and lighting realism, physics-based simulation, sim-to-real transfer, virtual sensing, and integration of autonomy stacks."
            />
          </Timeline.Item>

          <Timeline.Item>
            <b>Lunch Break</b>
            <br/>
            <Time time="12:00 - 1:00 PM PT" />
          </Timeline.Item>

          <Timeline.Item>
            <b>Special Session: Earth and Beyond: The State of Robotics</b>
            <br/>
            <Time time="1:00 - 2:00 PM PT" />
            <br/>
            <div style={{ marginBottom: '15px', marginTop: '15px' }}>
              <strong>Speakers:</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Img 
                    fixed={data.ignacioGLopezFrancos.childImageSharp.fixed} 
                    style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '8px' }}
                  />
                  <span>Ignacio López-Francos (NASA) <em>(Session Chair)</em></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Img 
                    fixed={data.briceHoward.childImageSharp.fixed} 
                    style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '8px' }}
                  />
                  <span>Brice Howard (Sentric Solutions)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Img 
                    fixed={data.hiroOno.childImageSharp.fixed} 
                    style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '8px' }}
                  />
                  <span>Hiro Ono (NASA JPL)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Img 
                    fixed={data.luisSentis.childImageSharp.fixed} 
                    style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '8px' }}
                  />
                  <span>Luis Sentis (University of Texas at Austin)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Img 
                    fixed={data.yueWang.childImageSharp.fixed} 
                    style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '8px' }}
                  />
                  <span>Yue Wang (USC, NVIDIA)</span>
                </div>
              </div>
            </div>
            <Abstract
              text="Robotics is advancing rapidly on Earth, driven by breakthroughs in artificial intelligence and increasingly capable, compact, and cost-effective hardware, including advanced sensors, actuators, and onboard computing. Translating these capabilities into space missions, however, remains challenging due to extreme thermal cycles, radiation, vacuum, abrasive dust, launch and landing stresses, and partial or microgravity conditions. Additionally, space robotics must operate within strict mass, power, and volume constraints; handle significant communication delays and limited bandwidth; and adhere to rigorous reliability standards in environments lacking opportunities for in-situ repair. This session examines terrestrial and space robotics to identify technology gaps and propose strategic directions to accelerate robotic integration into future space exploration."
            />
          </Timeline.Item>

          <Timeline.Item>
            <b>Spotlight Talks (Part 1)</b>
            <br/>
            <Time time="2:00 - 3:00 PM PT" />
            <br/>
            <div style={{ marginTop: '15px', marginLeft: '20px' }}>
              <div style={{ marginBottom: '10px' }}>
                <Time time="2:00 PM" /> – <strong>"Experimental Study of Magnetically-Actuated Satellite Swarm: Controllability Extension via Time-Integrated Control with Geometry Learning"</strong> – Yuta Takahashi
              </div>
              <div style={{ marginBottom: '10px' }}>
                <Time time="2:15 PM" /> – <strong>"Validation and Verification of Safety-Critical Aspects of Autonomy in Orbital Robotics"</strong> – Roberto Lampariello
              </div>
              <div style={{ marginBottom: '10px' }}>
                <Time time="2:30 PM" /> – <strong>"Learning Surface and Vertical Mobility for Enceladus Direct Ocean Access"</strong> – Jack Naish
              </div>
              <div style={{ marginBottom: '10px' }}>
                <Time time="2:45 PM" /> – <strong>"Adaptive Science Operations in Deep Space Missions Using Offline Belief State Planning"</strong> – Hailey Warner
              </div>
            </div>
          </Timeline.Item>

          <Timeline.Item>
            <b>Coffee Break</b>
            <br/>
            <Time time="3:00 - 3:30 PM PT" />
          </Timeline.Item>

          <Timeline.Item>
            <b>Spotlight Talks (Part 2)</b>
            <br/>
            <Time time="3:30 - 4:30 PM PT" />
            <br/>
            <div style={{ marginTop: '15px', marginLeft: '20px' }}>
              <div style={{ marginBottom: '10px' }}>
                <Time time="3:30 PM" /> – <strong>"Drift-Free Visual Compass Leveraging Digital Twins for Cluttered Environments"</strong> – Jungil Ham
              </div>
              <div style={{ marginBottom: '10px' }}>
                <Time time="3:45 PM" /> – <strong>"A Rigid-Soft Underactuated Tendon-Driven Gripper Prototype for Free-Flying Manipulation"</strong> – Brian Coltin
              </div>
              <div style={{ marginBottom: '10px' }}>
                <Time time="4:00 PM" /> – <strong>"RA-SR: A 16–32-Channel Low-Power FPGA Multi-Protocol ESC Controller for Space Robotics"</strong> – Mohamed El-Hadedy
              </div>
              <div style={{ marginBottom: '10px' }}>
                <Time time="4:15 PM" /> – <strong>"Free-Flying Intra-Vehicular Robots: A Review"</strong> – Jordan Kam
              </div>
            </div>
          </Timeline.Item>

          <Timeline.Item>
            <b>Best Paper Award + Closing Remarks</b>
            <br/>
            <Time time="4:30 - 5:00 PM PT" />
          </Timeline.Item>
        </Timeline>

        <h2>Day 3 - Wednesday, July 30 (Optional)</h2>
        <Timeline>
          <Timeline.Item>
            <b>Tours (limited capacity & pre-registration required)</b>
            <br/>
            <Time time="Morning - Afternoon" />
          </Timeline.Item>
        </Timeline>
      </Section>

      <Section title="Call for Papers">
        <Alert
          message={
            <>
              <strong>Our Call for Papers is now closed!</strong> A huge thanks to everyone who submitted their work. We've begun sending out acceptance notifications to authors and we'll be announcing the selected spotlight presentations soon!
            </>
          }
          type="success"
          showIcon={false}
          style={{ marginBottom: '1em' }}
        />
        <p>
          We invite submissions on research and development at the intersection of robotics, autonomy, and space applications. Contributions should highlight innovative methods, systems, and technologies for exploration, in-space services, or science operations beyond Earth.
        </p>
        <p><strong>Relevant topics:</strong></p>
        <ul>
          <li>
            Autonomous navigation and mobility for planetary and orbital environments, including terrain-relative localization, path planning, and novel locomotion systems (e.g., rovers, drones, subsurface robots).
          </li>
          <li>
            Manipulation in space and planetary environments, including dexterous handling, microgravity operations, and contact dynamics in ISAM or EVA contexts.
          </li>
          <li>
            In-space Servicing, Assembly, and Manufacturing (ISAM) and In-situ Resource Utilization (ISRU) enabled by robotic autonomy.
          </li>
          <li>
            AI agents for perception, decision-making, task planning, and multi-robot coordination in space environments.
          </li>
          <li>
            Foundation models and multimodal learning (vision-language-action) for general-purpose space robotic systems.
          </li>
          <li>
            Photogrammetry, Neural Radiance Fields (NeRFs), 3D Gaussian Splatting (3DGS), and other volumetric representation techniques for environment modeling and scene understanding, particularly under challenging illumination conditions.
          </li>
          <li>
            Human-robot teaming strategies for crewed and uncrewed missions, including shared autonomy, intent recognition, and adaptive interfaces.
          </li>
          <li>
            Sim-to-real transfer, domain adaptation, and policy generalization for space-deployed systems.
          </li>
          <li>
            High-fidelity simulation and digital twins for development, integration, testing, and mission rehearsal.
          </li>
          <li>
            Long-duration autonomy and adaptive learning in unstructured, dynamic, or high-latency environments.
          </li>
          <li>
            Autonomous surface operations, including science-driven exploration, sample collection, and real-time decision-making under resource constraints.
          </li>
          <li>
            Spacecraft swarms and distributed robotic systems, including satellite formation flying, multi-agent planning, and inter-agent communication.
          </li>
          <li>
            Space logistics, infrastructure deployment, and robotic construction, supporting scalable off-world operations.
          </li>
          <li>
            System integration, testing, and field validation of space robotic platforms in analog or operational environments.
          </li>
          <li>
            Mission concepts, technology demonstrations, and commercial initiatives accelerating the adoption of space robotics.
          </li>
          <li>
            Trust, verification, and validation frameworks to ensure robust, explainable, and resilient autonomous behavior.
          </li>
        </ul>

        <SubSection title="Submission Guidelines">
          <ul>
            <li>
              Full papers can be up to <strong>10 pages</strong>, not including references. Paper templates are available here: 
              <a href="https://www.ieee.org/conferences/publishing/templates.html" target="_blank" rel="noopener noreferrer">IEEE Templates</a>.
            </li>
            <li>
              Submissions must be made through the 
              <a href="https://easychair.org/conferences/?conf=smcitscc2025" target="_blank" rel="noopener noreferrer">EasyChair portal</a>. 
              Please select the <strong>"Space Robotics Workshop"</strong> track.
            </li>
            <li>
              Authors may choose between two submission options:
              <ul>
                <li>
                  <strong>Archival Track (IEEE Proceedings):</strong> Papers will be included in the official IEEE conference proceedings (indexed in IEEE Xplore).
                </li>
                <li>
                  <strong>Non-Archival Track:</strong> For authors who wish to present without publication, preserving eligibility for future archival venues.
                </li>
              </ul>
            </li>
            <li>
              Papers selected for IEEE publication must be presented <strong>in person</strong> to comply with IEEE's "Podium and Publish" policy.
            </li>
            <li>
              Authors who opt out of IEEE publication may still present at the workshop and are encouraged to contribute to discussions and community-building.
            </li>
            <li>
              All submissions will be <strong>peer reviewed</strong> for quality and relevance.
            </li>
            <li>
              At least <strong>one author of each accepted paper</strong> must register for IEEE SMC-IT/SCC with an <strong>in-person registration</strong> and attend the workshop.
            </li>
            <li>
              All accepted papers will be presented as <strong>posters</strong> during the workshop. A select number of top submissions will be invited for <strong>spotlight presentations</strong>, based on reviewer feedback and program needs.
            </li>
            <li>
              Selected papers may be invited to appear in a <strong>special issue of a journal</strong>. More details will be shared later.
            </li>
          </ul>
        </SubSection>

        <SubSection title="Important Dates">
          <table style={{ borderCollapse: "collapse", width: "100%", marginTop: "15px", marginBottom: "20px" }}>
            <thead>
              <tr>
                <th style={{ padding: "8px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Milestone</th>
                <th style={{ padding: "8px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Archival Track (IEEE)</th>
                <th style={{ padding: "8px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Non-Archival Track</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>Paper Submission deadline</td>
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}><strong>May 23</strong></td>
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}><strong>June 13</strong> June 6</td>
              </tr>
              <tr>
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>Acceptance Notification</td>
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}><strong>June 13</strong> June 6</td>
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>June 20</td>
              </tr>
              <tr>
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>Camera-ready deadline</td>
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>June 20</td>
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>July 7</td>
              </tr>
            </tbody>
          </table>
        </SubSection>

        <div style={{ marginTop: "30px", marginBottom: "20px" }}>
          <hr style={{ border: "1px solid #eee" }} />
          <p style={{ marginTop: "20px" }}>
            For any questions, please feel free to reach out to:<br />
            📩 <a href="mailto:ignacio.lopez-francos@nasa.gov">ignacio.lopez-francos@nasa.gov</a><br />
            📩 <a href="mailto:marcel.kaufmann@jpl.nasa.gov">marcel.kaufmann@jpl.nasa.gov</a>
          </p>
        </div>
      </Section>

      <Section title="Accepted Papers">
        <p>
          <strong>Congratulations to all the authors whose work was selected!</strong> Thank you to everyone who submitted, and to our reviewers for their valuable feedback and dedication to maintaining the quality of the workshop.
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '20px', 
          marginTop: '30px' 
        }}>
          {/* Best Paper Award Winner */}
          <div style={{ 
            position: 'relative',
            background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
            padding: '4px',
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
          }}>
            <div style={{
              position: 'absolute',
              top: '-10px',
              left: '20px',
              background: '#d4af37',
              color: 'white',
              padding: '5px 15px',
              borderRadius: '15px',
              fontSize: '12px',
              fontWeight: 'bold',
              zIndex: 1,
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}>
              🏆 BEST PAPER AWARD
            </div>
            <Paper
              title="Learning Surface and Vertical Mobility for Enceladus Direct Ocean Access"
              abstract="Of the places in our solar system that may support life, Enceladus stands out due to the presence of complex organic molecules and possible hydrothermal vent activity in its subsurface ocean, with direct access theorized via fissure vents at its icy south pole. However, robotic exploration of the lunar interior requires first negotiating complex, undulatory surface terrain before transitioning into a vertical descent mode once inside the fissure system. Such a mission profile demands advances in multi-modal robotic locomotion which to-date are yet to be realized. In this work, we take a step towards enabling this vision by contributing a learning-based hierarchical reinforcement learning controller capable of robust surface locomotion and vertical fissure mobility with a snake-like morphology. Simulation experiments provide a proof-of-concept validation of our method. Our work takes a small step towards the broader idea of Robotic Exploration 3.0 [51] - intelligent robots capable of adapting at mission-time, enabling one-shot exploration of celestial bodies."
              authors={{"Jack Naish": ""}}
              affiliations={[]}
              pdf="/papers/SMC-ITSCC_2025_paper_134.pdf"
            />
          </div>

          {/* Best Paper Nominees */}
          <div style={{ 
            position: 'relative',
            background: 'linear-gradient(135deg, #c0c0c0, #e8e8e8)',
            padding: '4px',
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(192, 192, 192, 0.3)'
          }}>
            <div style={{
              position: 'absolute',
              top: '-10px',
              left: '20px',
              background: '#8c8c8c',
              color: 'white',
              padding: '5px 15px',
              borderRadius: '15px',
              fontSize: '12px',
              fontWeight: 'bold',
              zIndex: 1,
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}>
              🥈 BEST PAPER NOMINEE
            </div>
            <Paper
              title="Experimental Study of Magnetically-Actuated Satellite Swarm: Controllability Extension via Time-Integrated Control with Geometry Learning"
              abstract="This study aims to experimentally validate the principle of large-scale satellite swarm control using magnetic field interactions generated by satellite-mounted magnetorquers. This actuation is an attractive solution for the long-term formation maintenance of multiple satellites, and has mainly been demonstrated for the two-satellite position control in a ground testbed. However, when the number of satellites N increases to more than three, this system contains fundamental challenges: 1) underactuation, 2) nonholonomic constraints, 3) scalability issues, and 4) high computational burden. To overcome these constraints, one practical solution is time-integrated current control, where the actuator outputs are time-varying, ensuring that the average acceleration matches the commanded value. We numerically and experimentally investigate two key aspects via time-varying magnetic actuation: (1) enhanced controllability on averaged dynamics with the theoretically guaranteed error bound, and (2) decentralized current management. Our primary application is the distributed space antennas through the integration of autonomous robotics technology and phased-array antenna systems. To emulate the orbital dynamics as equivalently as possible, we designed a ground-based experimental setup using an air-bearing platform, where position control experiments were conducted with custom-designed coils. This study can work as a proof of concept along with the tutorial paper on electromagnetic spacecraft control."
              authors={{"Yuta Takahashi": "", "Seang Shim": "", "Yusuke Sawanishi": "", "Hideki Yoshikado": "", "Masaru Ishida": "", "Noritsuna Imamura": "", "Sumio Morioka": "", "Shin-Ichiro Sakai": "", "Takahiro Inagawa": ""}}
              affiliations={[]}
              pdf="/papers/SMC-ITSCC_2025_paper_123.pdf"
            />
          </div>

          <div style={{ 
            position: 'relative',
            background: 'linear-gradient(135deg, #c0c0c0, #e8e8e8)',
            padding: '4px',
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(192, 192, 192, 0.3)'
          }}>
            <div style={{
              position: 'absolute',
              top: '-10px',
              left: '20px',
              background: '#8c8c8c',
              color: 'white',
              padding: '5px 15px',
              borderRadius: '15px',
              fontSize: '12px',
              fontWeight: 'bold',
              zIndex: 1,
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}>
              🥈 BEST PAPER NOMINEE
            </div>
            <Paper
              title="Validation and Verification of Safety-Critical Aspects of Autonomy in Orbital Robotics"
              abstract="The validation and verification (V&V) of safety-critical functionalities of space robots engaged in autonomous task-execution is facing new challenges. The recognized advantage of optimal control and machine learning for providing planning and perception capabilities onboard a robotic spacecraft calls for the development of new V&V techniques to ensure robust, explainable, and resilient autonomous behavior. This paper presents V&V techniques and developments at DLR of safety-critical aspects specifically for the autonomous robotic capture of a target satellite. The paper first addresses optimal control for robustly planning the robot arm's interception with a predefined grasping point on the tumbling target satellite, as well as for providing the means of performing mission planning in view of operational and motion constraints. Deep-learning based perception algorithms are then addressed, underlining the advantage of these with respect to classical approaches and presenting new methods for their V&V. Finally, a novel model-based design approach is presented for rapid prototyping and simulation of orbital robotic spacecraft engaged in the close proximity operations of interest."
              authors={{"Roberto Lampariello": "", "Caroline Specht": "", "Margherita Piccinin": "", "Hrishik Mishra": "", "Marco De Stefano": "", "Martin Stelzer": ""}}
              affiliations={[]}
              pdf="/papers/SMC-ITSCC_2025_paper_129.pdf"
            />
          </div>

          {/* Other Papers */}
          <Paper
            title="RA-SR: A 16–32-Channel Low-Power FPGA Multi-Protocol ESC Controller for Space Robotics"
            abstract="Future space-robotics missions—ranging from urban eVTOL air taxis with 36 ducted fans to 16+-rotor Martian drones and free-flying in-orbit servicers—demand highly reliable, low-latency, and energy-efficient motor control across large thruster arrays. To address these challenges, we present Reliable Architecture for Space Robotics (RA-SR), a fully hardware-only FPGA ESC controller implemented on the Xilinx Zynq PYNQ-Z2. RA-SR scales from 16 to 32 channels, supports PWM, PPM, and DShot via dedicated IP cores and dynamic protocol selection, and offloads timing into FPGA fabric to achieve < 50 ns jitter and zero CPU overhead. On MicroBlaze-V, RA-SR drives 16 ESCs at 0.8 W, while on the ARM Cortex-A9 it manages 32 ESCs at 1.9 W. We characterize resource usage (3.24 % LUTs, 1.79 % FFs for 4 channels; 11.08 % LUTs, 5.39 % FFs for 32 channels), validate performance with 8-ESC bench tests and 32-stream synthetic loop-backs, and compare energy efficiency against commercial controllers such as Pixhawk 4. Finally, we outline future work on telemetry feedback integration, optimized power distribution, and AI-driven flight control for extended space-robotics applications."
            authors={{"Mohamed El-Hadedy": "", "Landry Reynard": "", "Andrea Guerrieri": "", "Benny Cheng": "", "Wen-Mei Hwu": ""}}
            affiliations={[]}
            pdf="/papers/SMC-ITSCC_2025_paper_119.pdf"
          />

          <Paper
            title="Drift-Free Visual Compass Leveraging Digital Twins for Cluttered Environments"
            abstract="Drift-free and accurate rotational motion tracking is one of the most critical components for visual navigation of free-flying robots operating in microgravity environments, such as the International Space Station (ISS), where unrestricted 360-degree rotational motion is intrinsic. Traditional methods based on the Manhattan world (MW) assumption struggle in such environments due to occlusions and excessive outlier features. To address these issues, we present a novel digital twin-based outlier rejection method that leverages the ISS 3D CAD model to improve the robustness of Manhattan world detection and drift-free 3-DoF rotational motion estimation. By matching observed line features against the digital twin, our approach effectively filters out clutter-induced outliers and extracts reliable structural features. The proposed method requires only a single line and plane to estimate absolute and drift-free orientation, enabling lightweight and efficient computation. Experimental evaluations on the Astrobee dataset demonstrate that our method achieves state-of-the-art performance with significantly lower rotation errors in highly cluttered environments."
            authors={{"Jungil Ham": "", "Ryan Soussan": "", "Brian Coltin": "", "Hoyeong Chun": "", "Pyojin Kim": ""}}
            affiliations={[]}
            pdf="/papers/SMC-ITSCC_2025_paper_121.pdf"
          />

          <Paper
            title="Adaptive Science Operations in Deep Space Missions using Robust Precomputed Autonomy"
            abstract="Robust autonomy in deep space science mission operations is essential where communication delays prevent real-time ground control from addressing challenges of environmental uncertainty. This is problematic for astrobiological missions, which must navigate strict contamination constraints while coordinating multi-instrument measurements to interpret transient, time-sensitive biosignatures. To address these challenges, we present an offline autonomy framework that performs adaptive, resource-aware sequencing of scientific instruments under uncertainty. It integrates a Bayesian network, which probabilistically models the likelihood of observing different biotic signatures from a sample, with a risk-sensitive partially observable Markov decision process (POMDP) to produce adaptive instrument sequences. As a case study, we apply our methodology to the Enceladus Orbilander's proposed Life Detection Suite (LDS) of science instruments. We demonstrate how to design Bayesian networks that accurately model the likelihood of detecting biological signatures in collected samples and display how POMDP reward function tuning can be used to optimize competing objectives such as reducing sample state uncertainty and maximizing detection sensitivity. Our method's performance is evaluated against the recorded Enceladus Orbilander Concept of Operations (ConOps) for binary classifier accuracy and efficiency. These results establish our method as a significant step toward realizing robust deep space autonomy."
            authors={{"Grace Kim": "", "Hailey Warner": "", "Duncan Eddy": "", "Mykel Kochenderfer": "", "Evan Astle": "", "Zachary Booth": "", "Edward Balaban": ""}}
            affiliations={[]}
            pdf="/papers/SMC-ITSCC_2025_paper_130.pdf"
          />

          <Paper
            title="A Rigid-Soft End-Effector Mechanism for Microgravity Free-Flying Manipulation"
            abstract="Compliant robotic mechanisms offer a novel approach to grasping complex geometries through contact-rich manipulation. In extreme uncertain environments such as space, a contact-rich compliant grasp could offer a mechanism for robust manipulation under conditions such as microgravity. This article presents the design and fabrication of an rigid-soft end-effector mechanism prototype for conforming manipulation. The end-effector is a prototype of the three-finger underactuated tendon-driven gripper with rigid claw-shaped joints and inflatable compliant fabricated padding surrounding the grasping region. These pads can be pneumatically inflated to conform around an object within the gripper's claw-like grasp. This rigid-soft mechanism could allow for increased surface area and contact-rich manipulation with less reliance on actuating the gripper's motors. This article presents the design, mechanism, and material selection of the gripper. This prototype could be attached to an intra-vehicular free-flying robot like Astrobee to perform a variety of free-flying manipulation tasks in space."
            authors={{"Jordan Kam": "", "Andres Mora Vargas": "", "Stephanie Woodman": "", "Brian Coltin": ""}}
            affiliations={[]}
            pdf="/papers/SMC-ITSCC_2025_paper_135.pdf"
          />

          <Paper
            title="Free-Flying Intra-Vehicular Robots: A Review"
            abstract="Intra-vehicular free-flying robots have been operating inside the International Space Station (ISS) for over two decades. With the launching of the Synchronized Position Hold, Engage, Reorient, Experimental Satellites (SPHERES) free-flyer in 2003, there have been a total of six free-flying robots aboard ISS. These free-flyers include SPHERES, the Internal Ball Camera (Int-Ball), Crew Interactive MObile companioN (CIMON), Astrobee, Crew Interactive MObile companioN-2 (CIMON-2) and Internal Ball Camera 2 (Int-Ball2). Intra-vehicular free-flyers have expanded space robot capabilities in habitat inspection, terrestrial K-12 education outreach, microgravity research and development (R&D), and other intra-vehicular activities (IVA) in microgravity. This survey paper provides a comprehensive review of these six ISS intra-vehicular free-flying robots including their initial development details, intended Concept of Operation (ConOps), high-level system overview, microgravity R&D efforts, and contribution to the space robotics state-of-the-art. This paper will then cover some of the unanswered research questions for the development of future free-flyers. As future space stations emerge into new on-orbit destinations, the next-generation of free-flyers will build on the capabilities of these six ISS intra-vehicular free-flying robots and expand into novel areas of IVA."
            authors={{"Jordan Kam": "", "Kathryn Hamilton": "", "Brian Coltin": "", "Trey Smith": ""}}
            affiliations={[]}
            pdf="/papers/SMC-ITSCC_2025_paper_136.pdf"
          />
        </div>
      </Section>

      <Section title="Organizers">
        <p>
          The 2nd Space Robotics Workshop is a volunteer led effort by researchers and practitioners in the field of robotics, autonomy, and AI from multiple organizations. We are grateful to be supported by a Scientific Committee composed of leading experts across academia, industry, and government, who help ensure the quality, relevance, and impact of the program.
        </p>
        <SubSection title="Organizing Committee">
          <OrganizerPics
            organizers={data.allSite.nodes[0].siteMetadata.spacerobotics2025.organizers
              .filter((organizer: any) => organizer.oc === true)
              .sort((a, b) => {
                if (a.name === "Ignacio G. López-Francos") return -1;
                if (b.name === "Ignacio G. López-Francos") return 1;
                return a.name.localeCompare(b.name);
              })}
            data={data}
          />
        </SubSection>
        <SubSection title="Scientific Committee">
          <OrganizerPics
            organizers={data.allSite.nodes[0].siteMetadata.spacerobotics2025.organizers
              .filter((organizer: any) => organizer.sc === true)
              .sort((a, b) => a.name.localeCompare(b.name))}
            data={data}
          />
        </SubSection>
      </Section>

      <Section title="Sponsors">
        <p>
          The Space Robotics 2025 Workshop is sponsored by the following
          organizations:
        </p>
        <p>
          <center>
            <div className={style.sponsorContainer} style={{ textAlign: "center" }}>
              {/* <a href="https://www.nvidia.com/" target="_blank">
                <img src={NVIDIA} alt="NVIDIA" className={style.nvidia} />
              </a> */}

              <a href="https://www.softserveinc.com/" target="_blank">
                <img src={SOFTSERVE} alt="SOFTSERVE" className={style.softserve} />
              </a>
            </div>
          </center>
        </p>
      </Section>

      <footer>
        <a href="//github.com/ricard-inho/space-robotics-workshop" target="_blank">
          <GithubFilled className={style.footerIcon} />
        </a>
        <a href="//linkedin.com/company/spacerobots" target="_blank">
          <LinkedinFilled className={style.footerIcon} />
        </a>
      </footer>
    </PageWrapper>
  );
}

// This helps the images load immediately, among other things
export const query = graphql`
  fragment VideoThumbnail on File {
    childImageSharp {
      fixed(width: 320, height: 180) {
        ...GatsbyImageSharpFixed
      }
    }
  }

  fragment FaceThumbnail on File {
    childImageSharp {
      fixed(width: 100, height: 100) {
        ...GatsbyImageSharpFixed
      }
    }
  }

  fragment FluidImage on File {
    childImageSharp {
      fluid(quality: 100) {
        ...GatsbyImageSharpFluid
      }
    }
  }

  query {
    # get data for each organizer from the siteMetadata
    allSite {
      nodes {
        siteMetadata {
          spacerobotics2025 {
            organizers {
              name
              imageId
              organization
              site
              sc
              oc
              challenge
            }
          }
        }
      }
    }

    # speaker pictures
    default: file(relativePath: { eq: "spacerobotics2025/default.jpeg" }) {
      ...FaceThumbnail
    }
    maggieWang: file(relativePath: { eq: "organizers/maggieWang.jpg" }) {
      ...FaceThumbnail
    }
    luisSentis: file(relativePath: { eq: "scientific-committee/luisSentis.png" }) {
      ...FaceThumbnail
    }
    ignacioGLopezFrancos: file(relativePath: { eq: "organizers/ignacioGLopezFrancos.png" }) {
      ...FaceThumbnail
    }
    hiroOno: file(relativePath: { eq: "scientific-committee/hiroOno.jpg" }) {
      ...FaceThumbnail
    }
    robMueller: file(relativePath: { eq: "speakers/robMueller.png" }) {
      ...FaceThumbnail
    }
    dennisWingo: file(relativePath: { eq: "speakers/dennisWingo.png" }) {
      ...FaceThumbnail
    }
    maruthiAkella: file(relativePath: { eq: "speakers/maruthiAkella.png" }) {
      ...FaceThumbnail
    }
    feifeiQian: file(relativePath: { eq: "speakers/feifeiQian.png" }) {
      ...FaceThumbnail
    }
    antoineRichard: file(relativePath: { eq: "speakers/antoineRichard.jpg" }) {
      ...FaceThumbnail
    }
    danNegrut: file(relativePath: { eq: "speakers/danNegrut.jpg" }) {
      ...FaceThumbnail
    }
    

    # organizer pictures
    ignacioGLopezFrancosOrg: file(relativePath: { eq: "organizers/ignacioGLopezFrancos.png" }) {
      ...FluidImage
    }
    brianColtinOrg: file(relativePath: { eq: "organizers/brianColtin.jpg" }) {
      ...FluidImage
    }
    alexSowellOrg: file(relativePath: { eq: "organizers/alexSowell.jpg" }) {
      ...FluidImage
    }
    robRoyceOrg: file(relativePath: { eq: "organizers/robRoyce.jpeg" }) {
      ...FluidImage
    }
    marcelKaufmannOrg: file(relativePath: { eq: "organizers/marcelKaufmann.jpeg" }) {
      ...FluidImage
    }
    kuldeepRambhaiOrg: file(relativePath: { eq: "organizers/kuldeepRambhai.jpeg" }) {
      ...FluidImage
    }
    ricardMarsalOrg: file(relativePath: { eq: "organizers/ricardMarsal.jpeg" }) {
      ...FluidImage
    }
    roshanKalghatgiOrg: file(relativePath: { eq: "organizers/roshanKalghatgi.png" }) {
      ...FluidImage
    }
    maggieWangOrg: file(relativePath: { eq: "organizers/maggieWang.jpg" }) {
      ...FluidImage
    }

    # Scientific committee pictures
    edwardBalabanOrg: file(relativePath: { eq: "scientific-committee/edwardBalaban.jpeg" }) {
      ...FluidImage
    }
    jenniferBlankOrg: file(relativePath: { eq: "scientific-committee/jenniferBlank.jpeg" }) {
      ...FluidImage
    }
    giuseppeCataldoOrg: file(relativePath: { eq: "scientific-committee/giuseppeCataldo.jpeg" }) {
      ...FluidImage
    }
    jeanPierreDeLaCroixOrg: file(relativePath: { eq: "scientific-committee/jeanPierreDeLaCroix.jpg" }) {
      ...FluidImage
    }
    animeshGarg: file(relativePath: { eq: "scientific-committee/animeshGarg.jpg" }) {
      ...FaceThumbnail
    }
    animeshGargOrg: file(relativePath: { eq: "scientific-committee/animeshGarg.jpg" }) {
      ...FluidImage
    }
    keerthanaGopalakrishnanOrg: file(relativePath: { eq: "scientific-committee/keerthanaGopalakrishnan.jpg" }) {
      ...FluidImage
    }
    jenniferHeldmannOrg: file(relativePath: { eq: "scientific-committee/jenniferHeldmann.jpeg" }) {
      ...FluidImage
    }
    pyojinKimOrg: file(relativePath: { eq: "scientific-committee/pyojinKim.jpeg" }) {
      ...FluidImage
    }
    jonathanKnowlesOrg: file(relativePath: { eq: "scientific-committee/jonathanKnowles.jpeg" }) {
      ...FluidImage
    }
    robertoLamparielloOrg: file(relativePath: { eq: "scientific-committee/robertoLampariello.jpeg" }) {
      ...FluidImage
    }
    alisonLowndesOrg: file(relativePath: { eq: "scientific-committee/alisonLowndes.jpg" }) {
      ...FluidImage
    }
    luisMerinoOrg: file(relativePath: { eq: "scientific-committee/luisMerino.jpeg" }) {
      ...FluidImage
    }
    hiroOnoOrg: file(relativePath: { eq: "scientific-committee/hiroOno.jpg" }) {
      ...FluidImage
    }
    katherineScottOrg: file(relativePath: { eq: "scientific-committee/katherineScott.jpg" }) {
      ...FluidImage
    }
    luisSentisOrg: file(relativePath: { eq: "scientific-committee/luisSentis.png" }) {
      ...FluidImage
    }
    treySmithOrg: file(relativePath: { eq: "scientific-committee/treySmith.jpg" }) {
      ...FluidImage
    }
    jonathanStockOrg: file(relativePath: { eq: "scientific-committee/jonathanStock.png" }) {
      ...FluidImage
    }
    kentaroUnoOrg: file(relativePath: { eq: "scientific-committee/kentaroUno.png" }) {
      ...FluidImage
    }
    rodrigoVenturaOrg: file(relativePath: { eq: "scientific-committee/rodrigoVentura.jpg" }) {
      ...FluidImage
    }

    # Other pictures
    ariaDemo: file(relativePath: { eq: "cvpr2024/aria-demo.jpg" }) {
      ...FluidImage
    }
    workshopLocation: file(
      relativePath: { eq: "cvpr2024/workshop-location.png" }
    ) {
      ...FluidImage
    }
    defaultOrg: file(relativePath: { eq: "spacerobotics2025/default.jpeg" }) {
      ...FluidImage
    }
    lutzRichter: file(relativePath: { eq: "speakers/lutzRichter.png" }) {
      ...FaceThumbnail
    }
    dennisHong: file(relativePath: { eq: "speakers/dennisHong.jpg" }) {
      ...FaceThumbnail
    }
    deanBergman: file(relativePath: { eq: "speakers/deanBergman.jpg" }) {
      ...FaceThumbnail
    }
    graceGao: file(relativePath: { eq: "speakers/graceGao.jpg" }) {
      ...FaceThumbnail
    }
    yueWang: file(relativePath: { eq: "speakers/yueWang.png" }) {
      ...FaceThumbnail
    }
    annikaRollock: file(relativePath: { eq: "speakers/annikaRollock.png" }) {
      ...FaceThumbnail
    }
    lindyElkinsTanton: file(relativePath: { eq: "speakers/lindyElkinsTanton.png" }) {
      ...FaceThumbnail
    }
    pascalLee: file(relativePath: { eq: "speakers/pascalLee.jpg" }) {
      ...FaceThumbnail
    }
    briceHoward: file(relativePath: { eq: "speakers/briceHoward.jpeg" }) {
      ...FaceThumbnail
    }
    brianYamauchi: file(relativePath: { eq: "speakers/brianYamauchi.jpg" }) {
      ...FaceThumbnail
    }

    # Scientific committee pictures
    andyHockOrg: file(relativePath: { eq: "scientific-committee/andyHock.jpg" }) {
      ...FluidImage
    }
    edwardBalabanOrg: file(relativePath: { eq: "scientific-committee/edwardBalaban.jpeg" }) {
      ...FluidImage
    }
  }
`;
