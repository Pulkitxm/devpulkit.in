export type Experience = {
  companyName: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  location: string;
  type: string;
  url?: string;
  slug: string;
  showOnHome?: boolean;
  desc: string;
};

export type Project = {
  name: string;
  image: string;
  url: string;
  tagline: string;
};

export type Certification = {
  name: string;
  issuedBy: {
    name: string;
    url: string;
  };
  verifyLink: string;
  image: string;
  optimize?: boolean;
  cover?: boolean;
};

export type PortfolioDesign = {
  link: string;
  image: string;
};

export type Profile = {
  name: string;
  caption: string;
  image: string;
  calendlyUrl: string;
  githubUserName: string;
  resumeLink: string;
  sourceCodeUrl: string;
  email: string;
  links: Readonly<Record<string, string>>;
  experience: readonly Experience[];
  projects: readonly Project[];
  skills: Readonly<Record<string, string[]>>;
  certifications: readonly Certification[];
  portfolioIndex: readonly PortfolioDesign[];
};
