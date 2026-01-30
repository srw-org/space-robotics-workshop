import React from "react";
import { Section, SubSection } from "../text-helpers";
import type {
  WorkshopAgendaItem,
  WorkshopData,
  WorkshopPerson,
  WorkshopSponsor,
} from "../../content/workshops/types";
import * as style from "./workshop-template.module.scss";

const renderPerson = (person: WorkshopPerson) => (
  <div key={person.name} className={style.personCard}>
    {person.photo ? (
      <img className={style.personPhoto} src={person.photo} alt={person.name} />
    ) : null}
    <div className={style.personName}>
      {person.url ? (
        <a href={person.url} target="_blank" rel="noopener noreferrer">
          {person.name}
        </a>
      ) : (
        person.name
      )}
    </div>
    {person.affiliation ? (
      <div className={style.personAffiliation}>{person.affiliation}</div>
    ) : null}
  </div>
);

const renderAgendaItem = (item: WorkshopAgendaItem) => (
  <div key={`${item.time}-${item.title}`} className={style.agendaItem}>
    <div className={style.agendaTime}>{item.time}</div>
    <div className={style.agendaContent}>
      <div className={style.agendaTitle}>{item.title}</div>
      {item.description ? (
        <div className={style.agendaDescription}>{item.description}</div>
      ) : null}
    </div>
  </div>
);

const renderSponsor = (sponsor: WorkshopSponsor) => (
  <div key={sponsor.name} className={style.sponsorCard}>
    {sponsor.url ? (
      <a href={sponsor.url} target="_blank" rel="noopener noreferrer">
        {sponsor.logo ? (
          <img src={sponsor.logo} alt={sponsor.name} />
        ) : (
          sponsor.name
        )}
      </a>
    ) : sponsor.logo ? (
      <img src={sponsor.logo} alt={sponsor.name} />
    ) : (
      sponsor.name
    )}
  </div>
);

const WorkshopTemplate = ({ data }: { data: WorkshopData }) => (
  <>
    <Section title="Overview">
      {data.subtitle ? <p className={style.subtitle}>{data.subtitle}</p> : null}
      {data.overview.map((paragraph, index) => (
        <p key={`${data.slug}-overview-${index}`}>{paragraph}</p>
      ))}
    </Section>

    <Section title="Key Info">
      <div className={style.infoGrid}>
        <div>
          <div className={style.infoLabel}>Conference</div>
          <div className={style.infoValue}>{data.keyInfo.conference}</div>
        </div>
        <div>
          <div className={style.infoLabel}>Dates</div>
          <div className={style.infoValue}>{data.keyInfo.dates}</div>
        </div>
        <div>
          <div className={style.infoLabel}>Location</div>
          <div className={style.infoValue}>{data.keyInfo.location}</div>
        </div>
        {data.keyInfo.timezone ? (
          <div>
            <div className={style.infoLabel}>Timezone</div>
            <div className={style.infoValue}>{data.keyInfo.timezone}</div>
          </div>
        ) : null}
        {data.keyInfo.registrationUrl ? (
          <div>
            <div className={style.infoLabel}>Registration</div>
            <div className={style.infoValue}>
              <a
                href={data.keyInfo.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Register here
              </a>
            </div>
          </div>
        ) : null}
        {data.keyInfo.websiteUrl ? (
          <div>
            <div className={style.infoLabel}>Conference Site</div>
            <div className={style.infoValue}>
              <a
                href={data.keyInfo.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit site
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </Section>

    {data.callForPapers ? (
      <Section title="Call for Papers">
        <p>{data.callForPapers.overview}</p>
        {data.callForPapers.tracks && data.callForPapers.tracks.length ? (
          <SubSection title="Tracks">
            <ul>
              {data.callForPapers.tracks.map(track => (
                <li key={track}>{track}</li>
              ))}
            </ul>
          </SubSection>
        ) : null}
        {data.callForPapers.submissionUrl ||
        data.callForPapers.formattingUrl ? (
          <SubSection title="Submission Details">
            <ul>
              {data.callForPapers.submissionUrl ? (
                <li>
                  Submission site:{" "}
                  <a
                    href={data.callForPapers.submissionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {data.callForPapers.submissionUrl}
                  </a>
                </li>
              ) : null}
              {data.callForPapers.formattingUrl ? (
                <li>
                  Formatting guide:{" "}
                  <a
                    href={data.callForPapers.formattingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {data.callForPapers.formattingUrl}
                  </a>
                </li>
              ) : null}
            </ul>
          </SubSection>
        ) : null}
        {data.callForPapers.importantDates &&
        data.callForPapers.importantDates.length ? (
          <SubSection title="Important Dates">
            <ul>
              {data.callForPapers.importantDates.map(date => (
                <li key={`${date.label}-${date.date}`}>
                  <strong>{date.label}:</strong> {date.date}
                </li>
              ))}
            </ul>
          </SubSection>
        ) : null}
        {data.callForPapers.notes && data.callForPapers.notes.length ? (
          <SubSection title="Notes">
            <ul>
              {data.callForPapers.notes.map(note => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </SubSection>
        ) : null}
      </Section>
    ) : null}

    {data.speakers && data.speakers.length ? (
      <Section title="Speakers">
        <div className={style.peopleGrid}>
          {data.speakers.map(renderPerson)}
        </div>
      </Section>
    ) : null}

    {data.organizers && data.organizers.length ? (
      <Section title="Organizers">
        <div className={style.peopleGrid}>
          {data.organizers.map(renderPerson)}
        </div>
      </Section>
    ) : null}

    {data.agenda && data.agenda.length ? (
      <Section title="Agenda">
        <div className={style.agendaList}>
          {data.agenda.map(renderAgendaItem)}
        </div>
      </Section>
    ) : null}

    {data.sponsors && data.sponsors.length ? (
      <Section title="Sponsors">
        <div className={style.sponsorGrid}>
          {data.sponsors.map(renderSponsor)}
        </div>
      </Section>
    ) : null}

    {data.contacts && data.contacts.length ? (
      <Section title="Contact">
        <ul>
          {data.contacts.map(contact => (
            <li key={contact.email}>
              {contact.name ? `${contact.name} — ` : ""}
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
          ))}
        </ul>
      </Section>
    ) : null}
  </>
);

export default WorkshopTemplate;
