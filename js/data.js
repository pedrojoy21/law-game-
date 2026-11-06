'use strict';
// =====================================================================
//  DATA: looks, ranks, shop, study quiz, jurors, small-claims generator
// =====================================================================
const SKIN = ['#f5d0b0', '#e8b48a', '#c68c5a', '#8d5a3a', '#5c3a24'];
const HAIRC = { black: '#1e1a18', brown: '#5a3a22', blonde: '#d8b55a', red: '#a8442a', gray: '#9a9a9a', white: '#e8e8e8', blue: '#3a5a9a', pink: '#d46a9a' };
const HAIRSTYLES = ['short', 'long', 'bob', 'bun', 'curly', 'spiky', 'bald'];
const SUITS = { Navy: '#2c3e66', Charcoal: '#3a3a44', Black: '#1c1c22', Burgundy: '#6b1f2e', Forest: '#1f4a32', Tan: '#9a7a4a', Plum: '#4a2a5a', Gray: '#6a6a72' };
const TIES = { Red: '#a8242a', Gold: '#c8a028', Blue: '#2a5aa8', Green: '#2a8a4a', Purple: '#7a3aa8', Black: '#15151c', None: null };

// L(skinIndex, hairColor, style, top, tie, extras)
function L(sk, hr, st, top, tie, ex = {}) { return Object.assign({ skin: typeof sk === 'number' ? SKIN[sk] : sk, hair: HAIRC[hr] || hr, style: st, top, tie }, ex); }
const ROBE = '#15151c';

const MENTOR = { name: 'Margaret Steele', look: L(1, 'gray', 'bun', '#3a2a4a', '#c8a028', { glasses: true }), bg: '#3a2b40' };

const RANKS = [
  { name: 'Law Clerk', rep: 0 },
  { name: 'Junior Associate', rep: 80 },
  { name: 'Associate', rep: 200 },
  { name: 'Senior Associate', rep: 360 },
  { name: 'Partner', rep: 560 },
  { name: 'Name Partner', rep: 800 },
];

const SKILLS = {
  inv: { name: 'Investigation', desc: '+1 investigation day per level.' },
  per: { name: 'Persuasion', desc: '+3 starting jury support per level.' },
  crs: { name: 'Cross-Examination', desc: '+1 judge patience per level. Lv2+: flags suspicious statements.' },
  neg: { name: 'Negotiation', desc: 'Better plea & settlement offers; better odds when you counter.' },
};

const SHOP = [
  { id: 'suit1', name: 'Tailored Suit', price: 1500, desc: '+3 jury support at the start of every trial.' },
  { id: 'notes', name: 'Legal Research Database', price: 2500, desc: '+1 investigation day on every case.' },
  { id: 'suit2', name: 'Designer Suit', price: 6000, desc: '+4 more jury support. Juries notice.' },
  { id: 'para', name: 'Hire a Paralegal', price: 8000, desc: '+1 investigation day. The location list shows where unchecked clues remain.' },
  { id: 'office', name: 'Corner Office Remodel', price: 12000, desc: 'A swanky office. Clients pay 10% more.' },
];

// ---------- Law Library quiz ----------
const QUIZ = [
  { q: 'What is the burden of proof in a criminal trial?', a: ['Beyond a reasonable doubt', 'Preponderance of the evidence', 'Clear and convincing evidence', 'Probable cause'], c: 0, why: 'The prosecution must prove guilt beyond a reasonable doubt — the highest standard in law.' },
  { q: 'What is the usual burden of proof in a civil lawsuit?', a: ['Preponderance of the evidence', 'Beyond a reasonable doubt', 'Absolute certainty', 'Reasonable suspicion'], c: 0, why: '"More likely than not" — just over 50%.' },
  { q: 'An out-of-court statement offered to prove the truth of what it says is called...', a: ['Hearsay', 'Perjury', 'Speculation', 'An affidavit'], c: 0, why: 'Hearsay is generally inadmissible, with many exceptions.' },
  { q: 'Which question is usually NOT allowed when questioning your OWN witness on direct examination?', a: ['A leading question', 'An open-ended question', 'A question about what they saw', 'A question about their job'], c: 0, why: 'Leading questions suggest the answer. They are generally allowed on cross, not direct.' },
  { q: 'What are the four elements of negligence?', a: ['Duty, breach, causation, damages', 'Intent, act, harm, motive', 'Offer, acceptance, consideration, capacity', 'Means, motive, opportunity, alibi'], c: 0, why: 'A plaintiff must prove all four to win a negligence claim.' },
  { q: 'What are the core elements of a valid contract?', a: ['Offer, acceptance, and consideration', 'A notary and two witnesses', 'A written signature only', 'Duty and breach'], c: 0, why: 'Consideration means each side gives something of value.' },
  { q: 'Evidence seized in an illegal search may be excluded under the...', a: ['Exclusionary rule', 'Parol evidence rule', 'Best evidence rule', 'Statute of frauds'], c: 0, why: 'The exclusionary rule enforces Fourth Amendment protections.' },
  { q: 'A "plea bargain" is...', a: ['A deal where the defendant pleads guilty, usually for a lesser charge or sentence', 'A request for a new judge', 'An appeal to a higher court', 'A type of jury'], c: 0, why: 'Most criminal cases in the U.S. end in plea bargains.' },
  { q: 'What does "voir dire" refer to?', a: ['Jury selection questioning', 'Closing arguments', 'The verdict reading', 'A sentencing hearing'], c: 0, why: 'Lawyers question potential jurors and may strike some of them.' },
  { q: 'In custody cases, courts decide based on the...', a: ['Best interests of the child', 'Wealthier parent', 'Parent who files first', 'Child\'s birth order'], c: 0, why: 'Stability, relationships and the child\'s needs all factor in.' },
  { q: 'A "force majeure" clause in a contract covers...', a: ['Unforeseeable events like natural disasters', 'Late payment fees', 'Who pays attorney fees', 'Non-compete terms'], c: 0, why: 'It can excuse performance when a true disaster makes it impossible.' },
  { q: 'Destroying evidence relevant to a lawsuit is called...', a: ['Spoliation', 'Subrogation', 'Indemnification', 'Remittitur'], c: 0, why: 'Courts can sanction spoliation, e.g. telling the jury to assume the evidence was harmful.' },
  { q: 'A court order requiring a person to appear or produce documents is a...', a: ['Subpoena', 'Writ of habeas corpus', 'Summons for jury duty', 'Lien'], c: 0, why: '"Subpoena duces tecum" is the version for documents.' },
  { q: 'Who decides questions of LAW in a jury trial?', a: ['The judge', 'The jury', 'The court reporter', 'The bailiff'], c: 0, why: 'Juries decide facts; judges decide law.' },
  { q: 'A "motion in limine" is filed...', a: ['Before trial, to exclude certain evidence', 'After the verdict, to appeal', 'To change the trial\'s location', 'To pick the jury'], c: 0, why: 'It heads off prejudicial evidence before the jury hears it.' },
  { q: 'Strict product liability means a manufacturer can be liable...', a: ['For a defective product even without proof of carelessness', 'Only if they intended harm', 'Only for products sold overseas', 'Never, if there was a warning label'], c: 0, why: 'Plaintiffs typically show a defect that caused the injury.' },
  { q: 'Firing an employee for being pregnant violates, in the U.S., the...', a: ['Pregnancy Discrimination Act', 'Sherman Antitrust Act', 'Clean Air Act', 'Patriot Act'], c: 0, why: 'It amended Title VII of the Civil Rights Act in 1978.' },
  { q: 'Self-defense generally requires that the force used was...', a: ['Reasonable and proportional to the threat', 'Greater than the attacker\'s', 'Used only after calling police', 'Planned in advance'], c: 0, why: 'Deadly force usually requires a threat of death or serious harm.' },
  { q: 'The "warranty of habitability" protects...', a: ['Tenants\' right to a livable home', 'Buyers of used cars', 'Employers from lawsuits', 'Landlords from late rent'], c: 0, why: 'Heat, water and safety are typical requirements.' },
  { q: 'What does "pro bono" mean?', a: ['Legal work done for free for the public good', 'A lawyer working for a big firm', 'A fee based on winning', 'A court-appointed judge'], c: 0, why: 'From Latin "pro bono publico" — for the public good.' },
  { q: 'A "contingency fee" means the lawyer is paid...', a: ['A percentage of what the client wins', 'A fixed hourly rate', 'Only by the government', 'In advance, regardless of outcome'], c: 0, why: 'Common in personal injury cases — often about one third.' },
  { q: 'Who carries the burden of proof in a criminal case?', a: ['The prosecution', 'The defense', 'The judge', 'The jury'], c: 0, why: 'The defendant is presumed innocent until proven guilty.' },
  { q: 'Defamation in written form is called...', a: ['Libel', 'Slander', 'Perjury', 'Fraud'], c: 0, why: 'Slander is spoken. Truth is a defense to both.' },
  { q: 'Asking a witness to guess about someone else\'s thoughts invites an objection for...', a: ['Speculation', 'Hearsay', 'Relevance', 'Asked and answered'], c: 0, why: 'Witnesses testify to what they know, not what they imagine.' },
];

// ---------- Jurors ----------
// b: bias toward [criminal defense, civil plaintiff, civil defense]
const JURORS = [
  { job: 'Retired police officer', b: [-6, 0, 2], hint: 'Spent 30 years "keeping the streets safe."' },
  { job: 'Public defender\'s spouse', b: [6, 2, 0], hint: 'Hears about wrongful arrests at dinner.' },
  { job: 'Insurance claims adjuster', b: [0, -6, 5], hint: 'Thinks most lawsuits are "fishy."' },
  { job: 'Nurse', b: [2, 4, -1], hint: 'Sees injured people every shift.' },
  { job: 'Small business owner', b: [0, -2, 3], hint: 'Worries about being sued someday.' },
  { job: 'College student', b: [3, 3, -2], hint: 'Writes protest songs. Loves the underdog.' },
  { job: 'Corporate accountant', b: [-2, -3, 4], hint: '"Numbers don\'t lie. People do."' },
  { job: 'Union electrician', b: [2, 5, -3], hint: 'Has fought management before.' },
  { job: 'Crime-show superfan', b: [-4, 1, 0], hint: '"The guilty ones always look nervous."' },
  { job: 'Retired schoolteacher', b: [1, 2, 0], hint: 'Fair-minded. Takes careful notes.' },
  { job: 'Security guard', b: [-3, 0, 1], hint: 'Caught three shoplifters this year.' },
  { job: 'Single parent of three', b: [1, 4, -1], hint: 'Knows how hard life can get.' },
  { job: 'Bank manager', b: [-2, -4, 4], hint: '"Rules are rules."' },
  { job: 'Social worker', b: [5, 3, -2], hint: 'Believes in second chances.' },
];
const JUROR_LOOKS = () => L(Math.floor(Math.random() * 5), ['black', 'brown', 'blonde', 'red', 'gray', 'white'][Math.floor(Math.random() * 6)], ['short', 'long', 'bob', 'bun', 'curly', 'bald'][Math.floor(Math.random() * 6)], ['#8e44ad', '#16a085', '#d35400', '#2c3e50', '#c0392b', '#7f8c8d', '#2980b9', '#f39c12'][Math.floor(Math.random() * 8)], null, { glasses: Math.random() < 0.25 });

// ---------- Small claims generator (repeatable quick cases) ----------
const SMALL_CLAIMS = [
  {
    title: 'The Security Deposit', area: 'Landlord-Tenant', client: ['Priya Nair', L(2, 'black', 'long', '#16a085', null)],
    wit: ['Mr. Doyle (Landlord)', L(0, 'gray', 'bald', '#5d4037', '#7a1a1a')],
    summary: 'Your client\'s landlord kept her entire $1,200 security deposit, claiming she wrecked the apartment.',
    ev: { photos: ['Move-out Photos', 'photo', 'Timestamped photos from move-out day: spotless floors and walls.'], lease: ['Lease', 'contract', 'Deposit must be returned within 30 days with an itemized list of deductions.'], texts: ['Text Messages', 'phone', 'Landlord, last month: "Place looks great, thanks for everything!"'] },
    test: [
      { t: 'The carpets were ruined with stains everywhere.', contra: 'photos' },
      { t: 'I sent her an itemized list of damages, like the law requires.', contra: 'lease', alt: 'No itemized list was ever sent — and the lease requires one within 30 days.' },
      { t: 'My buddy down the hall says she threw wild parties every weekend.', obj: 'Hearsay' },
      { t: 'I was shocked when I first saw the state of the place.', contra: 'texts' },
    ],
  },
  {
    title: 'The Fence Feud', area: 'Property', client: ['Gus Olsen', L(0, 'blonde', 'short', '#7f8c8d', null, { beard: true })],
    wit: ['Linda Park (Neighbor)', L(1, 'brown', 'bob', '#c0392b', null)],
    summary: 'A neighbor says your client\'s fence is on her land and demands he pay $3,000 to tear it down.',
    ev: { survey: ['Property Survey', 'chart', 'Licensed survey from 2019: the fence sits 1 foot INSIDE your client\'s property line.'], permit: ['Fence Permit', 'doc', 'City permit approved for the fence, signed off by a city inspector.'], email: ['Old Email', 'email', 'Linda, 2019: "Love the new fence! Can you paint my side green?"'] },
    test: [
      { t: 'His fence is a full foot over the line onto my land.', contra: 'survey' },
      { t: 'He built it without any permit.', contra: 'permit' },
      { t: 'I objected to that fence from day one.', contra: 'email' },
      { t: 'My cousin says he\'s done this to other neighbors.', obj: 'Hearsay' },
    ],
  },
  {
    title: 'The Botched Repair', area: 'Consumer', client: ['Dee Washington', L(4, 'black', 'curly', '#f39c12', null)],
    wit: ['Vince Malone (Mechanic)', L(1, 'brown', 'short', '#2c3e50', null, { beard: true })],
    summary: 'A mechanic charged your client $2,400 for a transmission repair. The car broke down a day later.',
    ev: { invoice: ['Repair Invoice', 'receipt', '"Transmission rebuilt — new parts." Charged: $2,400.'], report: ['Second Opinion', 'doc', 'Another shop found the original, worn-out parts still inside. No new parts installed.'], warranty: ['Shop Warranty Sign', 'photo', 'Photo of sign at the shop: "ALL REPAIRS GUARANTEED 90 DAYS."'] },
    test: [
      { t: 'I installed brand-new parts in that transmission.', contra: 'report' },
      { t: 'We don\'t offer any warranty on repairs.', contra: 'warranty' },
      { t: 'She probably drove it like a maniac.', obj: 'Speculation' },
      { t: 'She only paid a couple hundred bucks anyway.', contra: 'invoice' },
    ],
  },
  {
    title: 'The Unpaid Invoice', area: 'Contract', client: ['Marco Bellini', L(1, 'black', 'spiky', '#2980b9', null)],
    wit: ['Tasha Grey (Client)', L(3, 'black', 'bun', '#8e44ad', '#c8a028')],
    summary: 'Your client, a freelance designer, built a website and was never paid the $2,000 agreed fee.',
    ev: { contract: ['Signed Agreement', 'contract', 'Website design for $2,000, due on delivery. Signed by both parties.'], email: ['Approval Email', 'email', 'Tasha: "The site is perfect! Launching it today!"'], site: ['Live Website', 'photo', 'Screenshot: Tasha\'s business site, live, with "Design by Bellini" in the footer.'] },
    test: [
      { t: 'We never agreed on any price.', contra: 'contract' },
      { t: 'The work was terrible, so I didn\'t use it.', contra: ['site', 'email'] },
      { t: 'Everyone knows freelancers are flaky.', obj: 'Improper Character' },
      { t: 'I told him right away I wasn\'t happy.', contra: 'email' },
    ],
  },
  {
    title: 'The Dog Bite', area: 'Personal Injury', client: ['Hal Brenner', L(0, 'white', 'short', '#27ae60', null, { glasses: true })],
    wit: ['Kyle Ross (Dog Owner)', L(2, 'brown', 'short', '#e67e22', null)],
    summary: 'A neighbor\'s dog bit your client on the sidewalk. The owner refuses to pay the $1,800 medical bill.',
    ev: { bill: ['ER Bill', 'medical', 'Dog bite to the left calf, 6 stitches. $1,800.'], leash: ['Leash Ordinance', 'doc', 'City code: dogs must be leashed on public sidewalks.'], video: ['Doorbell Video', 'video', 'Neighbor\'s doorbell camera: the dog runs off-leash out of an open gate and bites Hal on the sidewalk.'] },
    test: [
      { t: 'My dog was on a leash the whole time.', contra: 'video' },
      { t: 'It happened on my property — he was trespassing.', contra: 'video' },
      { t: 'It was barely a scratch. He didn\'t need a doctor.', contra: 'bill' },
      { t: 'I bet he provoked my dog.', obj: 'Speculation' },
    ],
  },
];
