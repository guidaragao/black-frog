export const site = {
  name: "Black Frog",
  domain: "blackfrog.io",
  tagline: "Design & Digital Solutions",
  position: "The Leap Company",
  email: "hello@blackfrog.io",
};

export const nav = [
  { label: "The Leap", href: "#leap" },
  { label: "What We Do", href: "#work" },
  { label: "Point of View", href: "#pov" },
  { label: "Cases", href: "#cases" },
  { label: "About", href: "#about" },
];

export const hero = {
  eyebrow: "Black Frog is The Leap Company",
  headline: ["Standing still", "is the only", "real risk."],
  body: "Most brands optimize. They tweak a headline, add a channel, refresh a palette, and call it progress. That is motion, not movement. We build the jump: the brand, the product and the campaign that put you somewhere your competitors cannot follow by adding one more inch.",
  primaryCta: { label: "Start a project", href: "#contact" },
  secondaryCta: { label: "See how we think", href: "#leap" },
};

export const proof = {
  label: "Trusted by teams building the next thing",
  stats: [
    { value: "12yr", label: "Making film and brand work" },
    { value: "6", label: "Practices under one roof" },
    { value: "1", label: "Team, no handoffs, no middlemen" },
  ],
};

export const units = [
  {
    key: "build",
    name: "BUILD",
    line: "Sites, apps and platforms",
    body: "Next.js, TypeScript and Supabase. Marketing sites that load fast and rank, and real products with auth, data and billing behind them. Shipped by the same people who designed them.",
    services: ["Web platforms", "SaaS products", "Design systems in code", "Performance"],
  },
  {
    key: "reach",
    name: "REACH",
    line: "Found, then chosen",
    body: "Technical SEO, generative search optimization for AI answers, and paid media that reports in revenue rather than impressions. Built into the site from day one, not bolted on later.",
    services: ["SEO", "GEO for AI search", "Paid media", "CRO"],
  },
  {
    key: "flow",
    name: "FLOW",
    line: "CRM, automation and data",
    body: "Your pipeline, your handoffs, your reporting. We wire the tools you already pay for into one system that tells you the truth, and automate the work nobody should be doing by hand.",
    services: ["CRM architecture", "Automation", "Integrations", "Dashboards"],
  },
  {
    key: "frame",
    name: "FRAME",
    line: "Film, motion and photography",
    body: "Where Black Frog started, and still the fastest way to make people feel something. Commercials, brand films, product motion and social cuts, from board to final grade.",
    services: ["Commercials", "Brand film", "Motion design", "Photography"],
  },
  {
    key: "mark",
    name: "MARK",
    line: "Brand and identity",
    body: "Naming, positioning, identity and the system that keeps it consistent when twenty people start using it. Not a logo file. A brand that survives contact with reality.",
    services: ["Positioning", "Identity", "Brand systems", "Guidelines"],
  },
  {
    key: "pulse",
    name: "PULSE",
    line: "Content and social",
    body: "A point of view published on a schedule your audience can rely on. Editorial, social, community and the production engine that keeps it fed without burning your team out.",
    services: ["Editorial", "Social", "Community", "Content ops"],
  },
];

export const leap = {
  eyebrow: "The Method",
  headline: "The Leap",
  intro:
    "Every engagement runs through the same four moves. It is deliberately short, because the value is in the decision, not in the deck that explains the decision.",
  steps: [
    {
      n: "01",
      name: "Land",
      body: "We map where you actually are. Category, competitors, the numbers, and the uncomfortable parts nobody puts in the brief. No jump starts from a place you have not measured.",
    },
    {
      n: "02",
      name: "Load",
      body: "We find the tension worth betting on. One idea, sharp enough to say out loud and specific enough to build against. If it fits every brand in your category, it is not it.",
    },
    {
      n: "03",
      name: "Leap",
      body: "We build the thing. Brand, product, campaign or all three, made by one team so nothing gets lost in the handoff between strategy, design and code.",
    },
    {
      n: "04",
      name: "Land Again",
      body: "We measure, cut what did not work and compound what did. Then we set up the next jump. Brands that leap once are lucky. Brands that leap on a rhythm are dangerous.",
    },
  ],
};

export const featuredCase = {
  eyebrow: "Selected work",
  client: "Black Frog Film",
  headline: "Twelve years of commercial film, now the engine room of a full house.",
  body: "Black Frog started behind the camera, making commercials and brand films. That craft did not get replaced when we added product and platform work. It got a bigger job. Today the film team feeds the site, the campaign, the social engine and the product launch, from the same building.",
  metrics: [
    { value: "Film first", label: "Origin" },
    { value: "Six practices", label: "Today" },
    { value: "One team", label: "Always" },
  ],
};

export const pov = {
  eyebrow: "Point of View",
  headline: "What we are watching",
  body: "We publish what we see before it is obvious. No gated PDFs, no lead magnets.",
  posts: [
    {
      tag: "Search",
      title: "AI answers are the new homepage, and most brands are invisible in them",
      excerpt:
        "Generative search does not send traffic the way ten blue links did. What gets cited is structured, sourced and specific. Most sites are none of those things.",
      date: "Coming soon",
    },
    {
      tag: "Brand",
      title: "Your brand guidelines are a PDF nobody opens",
      excerpt:
        "A brand system that lives only in a document dies the first week a contractor touches it. The system has to exist in code, or it does not exist.",
      date: "Coming soon",
    },
    {
      tag: "Product",
      title: "The website is not the product, it is the door",
      excerpt:
        "Clients who spend on a launch site and stop there leave most of the value on the table. What comes after the build is where the compounding happens.",
      date: "Coming soon",
    },
  ],
};

export const about = {
  eyebrow: "About",
  headline: "One team, six practices, no handoffs.",
  body: "Black Frog is a design and technology company. We started in film and grew into brand, product and platform, because the work kept asking for it. Strategy, design and engineering sit in the same room, which is why nothing gets lost in translation and why we can move faster than the number of people would suggest.",
  // NOTA: aqui existia um bloco "Powered by Vanda Media Group".
  // Foi retirado de proposito. O motivo de a Black Frog existir e
  // NAO estar amarrada na VMG. Se o site declara a ligacao, o
  // desvinculo acaba na primeira leitura do cliente.
  principles: {
    label: "How we work",
    items: [
      {
        title: "One team, start to finish",
        body: "The people who scope the work are the people who make it. No account layer translating between you and whoever is actually building.",
      },
      {
        title: "We say no",
        body: "If the thing you are asking for will not move the number you care about, we will say so before you spend on it.",
      },
      {
        title: "You own everything",
        body: "Code, files, accounts and access, in your name from day one. Nothing is held hostage if you leave.",
      },
    ],
  },
};

export const contact = {
  eyebrow: "Contact",
  headline: "Tell us what you are trying to move.",
  body: "One email. No forms with eleven fields, no discovery call to book another discovery call. Tell us the problem and we will tell you honestly whether we are the right people for it.",
  cta: { label: "hello@blackfrog.io", href: "mailto:hello@blackfrog.io" },
};
