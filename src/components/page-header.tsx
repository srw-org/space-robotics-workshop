import React from "react";
import { Link } from "gatsby";
import * as style from "./page-header.module.scss";
import { Popover, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { css } from "@emotion/react";

// Workshop selector for the header.
export const OtherYears = (props: { onConference: string }) => {
  const isSmc2025 = props.onConference.startsWith("IEEE SMC-IT/SCC 2025");
  const isSmc2024 = props.onConference === "IEEE SMC-IT/SCC 2024";

  return (
    <div className={style.left}>
      <Popover
        placement={"bottomLeft"}
        content={
          <div>
            <div>
              {props.onConference === "IROS 2026" ? (
                <>IROS 2026</>
              ) : (
                <Link to="/iros2026">IROS 2026</Link>
              )}
            </div>
          <div>
            {props.onConference === "ICRA 2026" ? (
              <>ICRA 2026</>
            ) : (
              <Link to="/icra2026">ICRA 2026</Link>
            )}
          </div>
          <div>
            {isSmc2025 ? (
              <>IEEE SMC-IT/SCC 2025</>
            ) : (
              <Link to="/spacerobotics2025">IEEE SMC-IT/SCC 2025</Link>
            )}
          </div>
            <div>
              {isSmc2024 ? (
                <>IEEE SMC-IT/SCC 2024</>
              ) : (
                <a
                  href="https://2024.smcit-scc.space/workshop-srw.html"
                  target="_blank"
                  rel="noreferrer"
                >
                  IEEE SMC-IT/SCC 2024
                </a>
              )}
            </div>
          </div>
        }
        trigger="hover"
      >
        <Button
          css={css`
            background: none !important;
            color: inherit;
            border: none;
            box-shadow: none;
            padding: 0px;
            font-size: 15px;
            &:hover {
              color: #1d3d7e !important;
            }
          `}
        >
          <DownOutlined style={{ fontSize: "14px" }} /> Space Robotics Workshops
        </Button>
      </Popover>
    </div>
  );
};

// Sets the page title and the dynamic header. Eventually, this will
// probably be modularized even further, when future versions come out.
// For now, were just using a single cover image.
export const Header = (props: {
  conference: string;
  rightSide: React.ReactNode;
  leftSide: React.ReactNode;
  imageContent: any;
  headerGradient: string;
  headerStyle: any;
  headerContainer: any;
}) => (
  <>
    <div
      css={css`
        background: ${props.headerGradient};
        ${props.headerStyle};
      `}
      className={style.header}
    >
      <div className={style.headerContent}>
        {props.leftSide}
        <div className={style.middle}>
          <div className={style.workshopTitle}>Space Robotics Workshop</div>
          <div className={style.conference}>{props.conference}</div>
        </div>
        {props.rightSide}
        <div id="headerContainer" {...props.headerContainer}>
          <div {...props.imageContent} />
        </div>
      </div>
    </div>
  </>
);

export default Header;
