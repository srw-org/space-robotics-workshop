export type WorkshopPerson = {
  name: string;
  affiliation?: string;
  url?: string;
  photo?: string;
};

export type WorkshopSponsor = {
  name: string;
  url?: string;
  logo?: string;
};

export type WorkshopAgendaItem = {
  time: string;
  title: string;
  description?: string;
};

export type WorkshopCallForPapers = {
  overview: string;
  tracks?: string[];
  submissionUrl?: string;
  formattingUrl?: string;
  importantDates?: { label: string; date: string }[];
  notes?: string[];
};

export type WorkshopKeyInfo = {
  conference: string;
  dates: string;
  location: string;
  timezone?: string;
  registrationUrl?: string;
  websiteUrl?: string;
};

export type WorkshopContact = {
  name?: string;
  email: string;
};

export type WorkshopData = {
  slug: string;
  title: string;
  subtitle?: string;
  overview: string[];
  keyInfo: WorkshopKeyInfo;
  callForPapers?: WorkshopCallForPapers;
  speakers?: WorkshopPerson[];
  organizers?: WorkshopPerson[];
  agenda?: WorkshopAgendaItem[];
  sponsors?: WorkshopSponsor[];
  contacts?: WorkshopContact[];
};
