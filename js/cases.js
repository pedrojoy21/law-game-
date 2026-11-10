'use strict';
// =====================================================================
//  CASES
//  Lines are [speaker, text, mood?]. Speakers: you, client, judge, opp,
//  narr, mentor, or any key in `people`.  **text** is highlighted.
// =====================================================================
const J_OAKES = { name: 'Judge Harriet Oakes', look: L(0, 'gray', 'bun', ROBE, null, { robe: true, glasses: true }), bg: '#3a2a20' };
const J_MBEKI = { name: 'Judge Leon Mbeki', look: L(4, 'gray', 'short', ROBE, null, { robe: true }), bg: '#3a2a20' };
const J_REYES = { name: 'Judge Carla Reyes', look: L(2, 'black', 'bob', ROBE, null, { robe: true }), bg: '#3a2a20' };
const J_WHIT = { name: 'Judge Amos Whitfield', look: L(1, 'white', 'bald', ROBE, null, { robe: true, beard: true }), bg: '#3a2a20' };
const ADA_KELL = { name: 'ADA Martin Kell', look: L(1, 'brown', 'short', '#3a3a5a', '#7a1a1a'), bg: '#4a2020' };

const CASES = [
// ---------------------------------------------------------------- 1
{
  id: 'watch', title: 'The Gem Mart Watch', kind: 'criminal', area: 'Theft', side: 'defense', rank: 0,
  fee: 1000, rep: 50, threshold: 55, jury: true, court: 'Riverside Municipal Court',
  summary: 'Danny Ruiz, 22, is charged with stealing a $299 watch from Gem Mart. He swears he paid for it.',
  people: {
    client: { name: 'Danny Ruiz', look: L(2, 'black', 'short', '#4a6b3a', null) },
    judge: J_OAKES, opp: ADA_KELL,
    clerk: { name: 'Marvin Pike', look: L(0, 'red', 'curly', '#c0392b', null), pitch: 1.2 },
    rosa: { name: 'Rosa Ruiz', look: L(2, 'black', 'long', '#8e44ad', null) },
    opal: { name: 'Opal Greer', look: L(3, 'gray', 'bun', '#2c8e5a', null, { glasses: true }) },
  },
  intro: [
    ['narr', 'A nervous young man shuffles into your office, clutching a crumpled court notice.'],
    ['client', 'Are you {name}? The public defender\'s office said you might take my case...', 'sad'],
    ['client', 'They say I stole a watch from Gem Mart. I didn\'t! I **bought** it. For my mom\'s birthday.', 'sweat'],
    ['you', 'Slow down. Have a seat, and let\'s start from the beginning.'],
  ],
  interview: [
    { q: 'What happened that morning?', a: [['client', 'I got to Gem Mart around 8. I picked out a silver watch and paid cash at **register #2**.'], ['client', 'Then around 8:30 a cop stops me at the bus stop. Says the clerk reported a theft.', 'sad']] },
    { q: 'Did you get a receipt?', a: [['client', 'Yeah! I stuck it in my jacket pocket. But the cops took my jacket as evidence...'], ['you', 'Then it may still be in the **police evidence locker**.']], flag: 'receipt_hint' },
    { q: 'Was anyone with you?', a: [['client', 'My sister Rosa. She waited outside by the window. She\'s probably at the **bus stop** — she catches the 14 every day.']], flag: 'rosa' },
    { q: 'Do you know the clerk?', a: [['client', 'Marvin Pike. We went to high school together. He\'s hated me since I beat him for class president.', 'angry'], ['client', 'Look — it\'s in our old yearbook. I keep it in my bag for... reasons.']], ev: 'yearbook' },
  ],
  evidence: {
    police_report: { name: 'Police Report', icon: 'doc', desc: 'Clerk Marvin Pike reported a watch stolen at 8:15 AM. Danny Ruiz detained at 8:32 AM wearing the watch.' },
    repair_note: { name: 'Repair Note', icon: 'doc', desc: 'Sticky note on register #2: "FIXED - Mon 7AM". The register worked the morning of the incident.' },
    sales_log: { name: 'Daily Sales Log', icon: 'chart', desc: 'Register #2, 8:04 AM: "Silver Classic watch - $299 - CASH." Operator: M. Pike.' },
    receipt: { name: 'Crumpled Receipt', icon: 'receipt', desc: 'Gem Mart receipt from register #2, 8:04 AM. Silver Classic watch, $299, paid in cash.' },
    yearbook: { name: 'Yearbook Page', icon: 'doc', desc: 'Riverside High: "Class President — Danny Ruiz. Runner-up — Marvin Pike (demanded a recount)."' },
    cctv: { name: 'Security Footage', icon: 'video', desc: 'Counter camera, 8:04 AM: Danny hands Marvin a stack of bills. Marvin rings it up and hands him a slip.' },
  },
  start: ['police_report'],
  locations: [
    { id: 'store', name: 'Gem Mart', bg: 'store', intro: [['narr', 'Gem Mart. Fluorescent lights hum over aisles of discount jewelry.']], spots: [
      { x: 228, y: 102, prop: 'register', label: 'Register #2', text: [['narr', 'Register #2. A yellow sticky note is stuck to the side: **"FIXED - Mon 7AM."**'], ['you', 'Monday... that\'s the day of the "theft." So it was working.']], ev: 'repair_note' },
      { x: 70, y: 30, prop: 'camera', label: 'Security camera', text: [['narr', 'A security camera points straight at the counter. Its red light blinks. It works.'], ['you', 'The prosecution never mentioned footage. I could ask the judge to **compel** them to turn it over.']], flag: 'cctv_hint' },
      { x: 110, y: 58, prop: 'shelf', label: 'Watch display', text: [['narr', 'A watch display. The tag reads: "Silver Classic — $299. **Only 1 left!**"'], ['you', 'Danny\'s wearing the only one. Either he bought it, or he stole it.']] },
      { x: 30, y: 110, prop: 'person', look: L(3, 'gray', 'bun', '#2c8e5a', null, { glasses: true }), who: 'opal', label: 'Opal Greer (Manager)', text: [['opal', 'You\'re the lawyer for the Ruiz boy? Hmph. Marvin opened register two himself that morning.'], ['opal', 'Why he\'d tell police it was broken, I can\'t imagine. Here — the daily **sales log**. I don\'t want trouble.']], ev: 'sales_log' },
    ] },
    { id: 'police', name: 'Police Evidence Room', bg: 'police', intro: [['narr', 'The evidence room smells like old cardboard and burnt coffee.']], spots: [
      { x: 40, y: 50, prop: 'locker', label: 'Evidence locker #31', needs: 'receipt_hint', text: [['narr', 'Locker #31: Danny\'s jacket, bagged and tagged.'], ['narr', 'In the inside pocket... a crumpled **receipt**!'], ['you', 'Timestamped 8:04 AM. Eleven minutes before the "theft."', 'happy']], ev: 'receipt', alt: [['narr', 'Locker #31 holds Danny\'s bagged jacket. Nothing jumps out.'], ['you', 'Maybe I should ask Danny what he had on him...']] },
      { x: 150, y: 110, prop: 'desk', label: 'Officer\'s desk', text: [['narr', 'Arrest notes: "Suspect cooperative. Claims he purchased item. Clerk insisted."'], ['you', 'Nobody even checked his pockets properly.']] },
      { x: 250, y: 60, prop: 'bulletin', label: 'Bulletin board', text: [['narr', 'A flyer: "Bowling Night — Thursday!" Someone drew a mustache on the chief.']] },
    ] },
    { id: 'bus', name: 'Bus Stop on 5th', bg: 'street', intro: [['narr', 'The bus stop across from Gem Mart. You can see the store\'s front window from here.']], spots: [
      { x: 120, y: 98, prop: 'bench', label: 'Bus bench', text: [['narr', 'From this bench there\'s a clear view through Gem Mart\'s window, right to the counter.']], flag: 'window_view' },
      { x: 190, y: 78, prop: 'person', look: L(2, 'black', 'long', '#8e44ad', null), who: 'rosa', label: 'Rosa Ruiz', needs: 'rosa', text: [['rosa', 'You\'re Danny\'s lawyer? Thank God.'], ['rosa', 'I watched him through the window. He **counted out cash** and handed it to the clerk. I\'ll swear to it.']], flag: 'rosa_ready', alt: [['narr', 'A young woman waits for the bus, scrolling her phone. She glances at you, then away.']] },
      { x: 260, y: 96, prop: 'sign', label: 'Bus schedule', text: [['narr', '"Route 14 — every 20 minutes." Someone\'s scratched "Marvin is a snitch" into the post.']] },
    ] },
  ],
  motions: [
    { name: 'Motion to Compel Discovery', desc: 'Force the prosecution to hand over the store\'s security footage.', needs: 'cctv_hint', gives: 'cctv', bonus: 4, win: [['judge', 'The store has a working camera and nobody pulled the tape? Granted. The People will produce the footage.']], lose: [['judge', 'What footage, counsel? You haven\'t shown me any exists. Denied.']] },
    { name: 'Motion to Dismiss', desc: 'Ask the judge to throw the case out for insufficient evidence.', lose: [['judge', 'An eyewitness and a recovered watch? That\'s enough to go to a jury. Denied.']] },
    { name: 'Motion in Limine: Character', desc: 'Bar the prosecution from attacking Danny\'s character without evidence.', always: true, bonus: 3, win: [['judge', 'Granted. No rumors or character attacks without a proper foundation.']] },
  ],
  offer: { text: 'Plead guilty to petty theft: $500 fine and a theft conviction on his record.', better: 'Plead to disorderly conduct: no theft on his record, $100 fine.' },
  oppOpening: [['opp', 'Ladies and gentlemen, the defendant was caught wearing a stolen watch. The clerk saw him take it. Simple as that.']],
  opening: [
    { t: 'Danny paid for that watch — and the store\'s own records will prove it.', s: 5 },
    { t: 'My client is a good kid who deserves a break.', s: 0 },
    { t: 'The police are always arresting the wrong people.', s: -5 },
  ],
  witnesses: [
    { who: 'clerk', side: 'opp', damage: 10, intro: [['opp', 'The People call Marvin Pike, clerk at Gem Mart.'], ['clerk', 'Yeah. I saw the whole thing, okay?']], testimony: [
      { t: 'I was working the counter that morning around 8:15.', press: [['you', 'Which register were you working?'], ['clerk', 'Register one. Two was broken. Everybody knows that.']] },
      { t: 'Register #2 was out of order all day. Nobody could buy anything there.', contra: ['repair_note', 'sales_log'], hit: [['you', 'Then explain this! Register #2 was **repaired at 7 AM** — and the store\'s own log shows a sale on it at 8:04!'], ['clerk', 'Wh— That log is... I mean...', 'sweat']], flag: 'reg_works' },
      { t: 'He slipped the watch into his jacket and walked right out without paying.', contra: ['receipt', 'cctv'], hit: [['you', 'Then why does the evidence show Danny **paying cash** for that exact watch at 8:04 AM?'], ['clerk', 'He... he must have faked it!', 'shock'], ['judge', 'Faked a store receipt? Hmm. The jury will weigh that.']], flag: 'paid' },
      { t: 'Everybody in the neighborhood says Danny\'s a thief.', obj: ['Hearsay', 'Improper Character'] },
      { t: 'I have no reason to lie about him. I barely know the guy.', press: [['clerk', 'We... maybe went to the same school. Whatever.', 'sweat']], contra: 'yearbook', hit: [['you', 'Barely know him? You two went to high school together — and he **beat you for class president**!'], ['clerk', 'That... that was a rigged election!', 'angry'], ['judge', 'The jury will note the witness\'s... enthusiasm.']], flag: 'motive' },
    ] },
    { who: 'rosa', side: 'own', intro: [['you', 'The defense calls Rosa Ruiz.'], ['rosa', 'I\'m Danny\'s sister. I was there that morning.']], rounds: [
      [{ q: 'Where were you at 8 AM that morning?', k: 'good', r: [['rosa', 'At the bus stop across the street. You can see right through Gem Mart\'s front window.']], needs: 'window_view' },
       { q: 'Isn\'t it true your brother would never steal anything?', k: 'lead' },
       { q: 'What\'s your favorite TV show?', k: 'off' }],
      [{ q: 'What did you see through the window?', k: 'good', needs: 'rosa_ready', r: [['rosa', 'Danny counted out bills and handed them to the clerk. The clerk put them in the register and gave him a slip.']] },
       { q: 'You saw him pay, didn\'t you?', k: 'lead' },
       { q: 'Why was Danny buying a watch?', k: 'good', r: [['rosa', 'For our mom\'s birthday. He saved for two months.']] }],
    ] },
  ],
  closing: [
    { t: 'Register #2 was working, and it recorded Danny\'s purchase.', needs: 'reg_works' },
    { t: 'Danny\'s receipt and the footage prove he paid.', needs: 'paid' },
    { t: 'Rosa watched her brother pay, through the window.', needs: 'rosa_ready' },
    { t: 'The clerk holds a grudge against Danny from high school.', needs: 'motive' },
    { t: 'Watches are overpriced anyway.', bad: true },
    { t: 'Danny has an honest face.', bad: true },
  ],
  win: [['client', 'Not guilty... NOT GUILTY! I can give Mom her present!', 'happy'], ['rosa', 'Thank you, {name}. Really.', 'happy']],
  lose: [['client', 'Guilty? But I paid... I PAID!', 'sad'], ['narr', 'Danny is led away. You can file an appeal later from the case board.']],
  deal: [['client', 'I guess it\'s better than a trial... Thanks, I think.', 'sad']],
},

// ---------------------------------------------------------------- 2
{
  id: 'slip', title: 'Wet Floor at FreshCo', kind: 'civil', area: 'Personal Injury', side: 'plaintiff', rank: 0,
  rep: 50, damages: 90000, threshold: 55, jury: true, court: 'County Civil Court',
  summary: 'Edna Marsh, 71, slipped on a puddle in FreshCo\'s frozen aisle and broke her hip. FreshCo says it was her own fault.',
  people: {
    client: { name: 'Edna Marsh', look: L(0, 'white', 'bun', '#6b8e9b', null, { glasses: true }), pitch: 1.2 },
    judge: J_MBEKI,
    opp: { name: 'Bradley Voss', look: L(1, 'blonde', 'short', '#2c2c2c', '#2a4a8a'), bg: '#20304a' },
    greg: { name: 'Greg Tully', look: L(1, 'brown', 'short', '#2e7d32', null, { beard: true }) },
    dr: { name: 'Dr. Anita Patel', look: L(2, 'black', 'long', '#ecf0f1', null) },
    kevin: { name: 'Kevin (Stock Clerk)', look: L(3, 'black', 'spiky', '#2e7d32', null), pitch: 1.3 },
  },
  intro: [
    ['narr', 'An elderly woman with a walker inches through your door.'],
    ['client', 'Oh, you\'re younger than I expected. That\'s fine, dear. My grandson says you\'re very good.', 'happy'],
    ['client', 'I fell at FreshCo. Broke my hip. And now they say it\'s **my fault**! Can you imagine?', 'angry'],
  ],
  interview: [
    { q: 'Tell me what happened.', a: [['client', 'I was reaching for frozen peas by **Freezer 6**. Next thing I knew I was on the floor. My dress was soaked — water everywhere.']] },
    { q: 'Was there a warning sign?', a: [['client', 'No sign! I\'d have seen it. My grandson took a picture right after — here, on my phone.']], ev: 'photo' },
    { q: 'How are your injuries?', a: [['client', 'Broken hip. Surgery, eight weeks of rehab. Dr. Patel says I may need a cane for good.', 'sad']], ev: 'med_bills' },
    { q: 'Were you using your phone when you fell?', a: [['client', 'Heavens, no. I don\'t even know how to text. My phone was in my purse.']], flag: 'no_phone' },
  ],
  evidence: {
    incident: { name: 'FreshCo Incident Report', icon: 'doc', desc: '"Customer fell in Aisle 6, 1:40 PM. Cause: customer inattention." Filed by G. Tully.' },
    photo: { name: 'Grandson\'s Photo', icon: 'photo', desc: 'Taken minutes after the fall: a wide puddle by Freezer 6. No wet floor sign anywhere in frame.' },
    med_bills: { name: 'Medical Bills', icon: 'medical', desc: '$62,000 in hospital and rehab bills. Diagnosis: displaced hip fracture.' },
    maint_log: { name: 'Maintenance Log', icon: 'doc', desc: 'Entry 3 days before the fall: "Freezer 6 leaking onto floor. Parts ordered." Signed: G. Tully.' },
    inspect_sheet: { name: 'Floor Inspection Sheet', icon: 'chart', desc: 'Hourly aisle checks. Initials stop at 9 AM — nothing from 9 AM to 2 PM. Edna fell at 1:40 PM.' },
    sign_stock: { name: 'Broken Wet Floor Sign', icon: 'photo', desc: 'The store\'s only wet floor sign: locked in a closet with a snapped leg. Tag: "Out of service since June."' },
  },
  start: ['incident'],
  locations: [
    { id: 'store', name: 'FreshCo Supermarket', bg: 'grocery', intro: [['narr', 'FreshCo. Aisle 6 still smells faintly of mop water.']], spots: [
      { x: 200, y: 112, prop: 'puddle', label: 'Floor by Freezer 6', text: [['narr', 'A slow drip runs from a cracked pipe under Freezer 6. There\'s a fresh puddle forming... again.']], flag: 'leak_seen' },
      { x: 30, y: 58, prop: 'cabinet', label: 'Supply closet', text: [['narr', 'Inside: mops, buckets, and the store\'s only **wet floor sign** — leg snapped clean off.'], ['narr', 'A tag reads: "Out of service since June."'], ['you', 'So there was no working sign to put out. I\'ll photograph this.']], ev: 'sign_stock' },
      { x: 76, y: 72, prop: 'clipboard', label: 'Clipboard by the restroom', text: [['narr', 'An hourly floor inspection sheet. Initials every hour... until **9 AM**. Then nothing until 2 PM.'], ['you', 'Edna fell at 1:40. Nobody had checked that floor in almost five hours.']], ev: 'inspect_sheet' },
      { x: 100, y: 112, prop: 'person', look: L(3, 'black', 'spiky', '#2e7d32', null), who: 'kevin', label: 'Kevin (Stock Clerk)', text: [['kevin', 'That freezer\'s been leaking for **days**, man. I told Greg like three times.'], ['kevin', 'He said "mop it when you get a chance." We\'re short-staffed. Nobody had a chance.']], flag: 'kevin' },
    ] },
    { id: 'office', name: 'FreshCo Back Office', bg: 'corporate', intro: [['narr', 'The manager\'s office. Greg is "out to lunch." The door was open.']], spots: [
      { x: 140, y: 82, prop: 'computer', label: 'Maintenance computer', text: [['narr', 'The maintenance system is still logged in. Three days before the fall:'], ['narr', '**"Freezer 6 leaking onto floor. Parts ordered." — G. Tully**'], ['you', 'He knew. He knew for three days.', 'angry']], ev: 'maint_log' },
      { x: 30, y: 100, prop: 'cabinet', label: 'Filing cabinet', text: [['narr', 'Old safety award certificates from 2015. Dusty.']] },
      { x: 260, y: 40, prop: 'camera', label: 'Security monitor feed', text: [['narr', 'A sticky note on the monitor: "Aisle 6 footage from the 14th — DELETED (accident?) - G."'], ['you', 'Footage from the day of the fall... "accidentally" deleted. A judge would love to hear about that.']], flag: 'deleted' },
    ] },
    { id: 'hospital', name: 'St. Mary\'s Hospital', bg: 'hospital', intro: [['narr', 'St. Mary\'s orthopedic wing.']], spots: [
      { x: 120, y: 100, prop: 'person', look: L(2, 'black', 'long', '#ecf0f1', null), who: 'dr', label: 'Dr. Anita Patel', text: [['dr', 'Mrs. Marsh? A displaced femoral neck fracture. It\'s exactly what we see after a **sudden slip on a wet surface**.'], ['dr', 'I\'ll testify, of course. She was a model patient.']], flag: 'dr_ready' },
      { x: 220, y: 120, prop: 'papers', label: 'Billing records', text: [['narr', 'Itemized bills: surgery, hospital stay, eight weeks of rehab. Total: $62,000.']], ev: 'med_bills' },
    ] },
  ],
  motions: [
    { name: 'Motion for Spoliation Sanctions', desc: 'Punish FreshCo for destroying the camera footage.', needs: 'deleted', bonus: 8, win: [['judge', 'Footage "accidentally" deleted the same day as the fall? The jury will be instructed they may assume it was **bad for FreshCo**.']], lose: [['judge', 'Destroyed footage? I see no evidence of that, counsel. Denied.']] },
    { name: 'Motion for Summary Judgment', desc: 'Ask the judge to rule for Edna without a trial.', lose: [['judge', 'There are disputed facts here. That\'s what juries are for. Denied.']] },
  ],
  oppOpening: [['opp', 'FreshCo runs a safe store. Mrs. Marsh simply wasn\'t watching where she was going. Accidents happen — they aren\'t always someone\'s fault.']],
  opening: [
    { t: 'FreshCo knew about the leak for days and did nothing. That\'s negligence.', s: 5 },
    { t: 'Mrs. Marsh is a sweet old lady. She deserves something.', s: 0 },
    { t: 'Big corporations never care about anyone.', s: -5 },
  ],
  witnesses: [
    { who: 'greg', side: 'opp', damage: 10, intro: [['opp', 'The defense calls Greg Tully, store manager.'], ['greg', 'I run a tight ship. Always have.']], testimony: [
      { t: 'FreshCo inspects every aisle once an hour, without fail.', contra: 'inspect_sheet', hit: [['you', 'Your own inspection sheet has **no initials from 9 AM to 2 PM**. Nobody checked that aisle for five hours!'], ['greg', 'We... were short-staffed that day.', 'sweat']], flag: 'no_checks' },
      { t: 'We had no idea Freezer 6 was leaking.', contra: 'maint_log', hit: [['you', 'Then why did you personally log "**Freezer 6 leaking onto floor**" three days before Mrs. Marsh fell?'], ['greg', 'I— that\'s— parts were ordered!', 'shock']], flag: 'knew' },
      { t: 'A bright yellow wet floor sign was right next to the spill.', contra: ['photo', 'sign_stock'], hit: [['you', 'Your only sign was **broken in a closet** since June — and the photo taken right after the fall shows no sign at all.'], ['greg', 'Uh...', 'sweat']], flag: 'no_sign' },
      { t: 'I\'m sure she was busy texting on her phone.', obj: 'Speculation' },
      { t: 'Our store won a safety award, you know.', obj: 'Relevance', press: [['greg', 'In 2015. But still!']] },
    ] },
    { who: 'dr', side: 'own', intro: [['you', 'The plaintiff calls Dr. Anita Patel.'], ['dr', 'Orthopedic surgeon, St. Mary\'s Hospital. Twenty years.']], rounds: [
      [{ q: 'Doctor, what injuries did Mrs. Marsh suffer?', k: 'good', r: [['dr', 'A displaced hip fracture requiring surgical repair and extended rehabilitation.']] },
       { q: 'Wouldn\'t you agree this was all FreshCo\'s fault?', k: 'lead' },
       { q: 'Where did you go to medical school?', k: 'off' }],
      [{ q: 'Is the injury consistent with slipping on a wet floor?', k: 'good', needs: 'dr_ready', r: [['dr', 'Entirely. The fracture pattern matches a sudden sideways slip.']] },
       { q: 'How much are her medical bills?', k: 'good', needs: 'med_bills', r: [['dr', 'About sixty-two thousand dollars so far, with more to come.']] },
       { q: 'Her injury was terrible, right?', k: 'lead' }],
    ] },
  ],
  closing: [
    { t: 'FreshCo knew about the leak three days before the fall.', needs: 'knew' },
    { t: 'No one inspected that aisle for nearly five hours.', needs: 'no_checks' },
    { t: 'There was no wet floor sign — the only one was broken.', needs: 'no_sign' },
    { t: 'Edna\'s injuries cost $62,000 and changed her life.', needs: 'med_bills' },
    { t: 'Everyone slips sometimes, so FreshCo should pay anyway.', bad: true },
    { t: 'The music in that store is far too loud.', bad: true },
  ],
  win: [['client', 'Oh my! Wait until I tell my bridge club!', 'happy']],
  lose: [['client', 'Well. I suppose I\'ll have to be more careful. Even when it isn\'t my fault.', 'sad']],
  deal: [['client', 'A settlement? That will pay my bills, at least. Thank you, dear.', 'happy']],
},

// ---------------------------------------------------------------- 3
{
  id: 'evict', title: 'Cold Comfort', kind: 'civil', area: 'Landlord-Tenant', side: 'defense', rank: 1,
  fee: 1800, rep: 60, threshold: 55, jury: false, court: 'Riverside Housing Court',
  summary: 'Landlord Victor Crane is evicting Maya Lin for unpaid rent. Maya says she withheld rent because the heat hasn\'t worked all winter.',
  people: {
    client: { name: 'Maya Lin', look: L(1, 'black', 'bob', '#d35400', null) },
    judge: J_REYES,
    opp: { name: 'Gloria Vance', look: L(3, 'black', 'bun', '#4a235a', '#c8a028'), bg: '#3a2040' },
    crane: { name: 'Victor Crane', look: L(0, 'gray', 'bald', '#5d4037', '#b8860b'), pitch: 0.8 },
    cho: { name: 'Raymond Cho', look: L(1, 'black', 'short', '#34495e', null, { glasses: true }) },
  },
  intro: [
    ['narr', 'A young mother bursts in, a toddler on her hip and an eviction notice in her hand.'],
    ['client', 'I have **ten days** to get out. With a two-year-old. In January.', 'sad'],
    ['client', 'I didn\'t stop paying because I\'m broke. I stopped because my landlord won\'t fix the heat!', 'angry'],
  ],
  interview: [
    { q: 'Why did you stop paying rent?', a: [['client', 'The heat\'s been broken since November. It\'s **50 degrees** in my apartment. My daughter sleeps in her snowsuit.', 'sad']] },
    { q: 'Did you tell the landlord?', a: [['client', 'Three times! I sent **certified letters**. Copies are in my desk drawer at home.']], flag: 'letters_hint' },
    { q: 'Where did the rent money go?', a: [['client', 'Legal aid told me to put it in an **escrow account**. Every penny is there. Here\'s the statement.']], ev: 'escrow' },
    { q: 'Has anyone official seen the apartment?', a: [['client', 'A city inspector, Mr. Cho, came by last month. He looked furious at the boiler.']], flag: 'cho' },
  ],
  evidence: {
    notice: { name: 'Eviction Notice', icon: 'doc', desc: 'Victor Crane: "Tenant has failed to pay rent for 3 months and refuses to communicate."' },
    escrow: { name: 'Escrow Statement', icon: 'bank', desc: '$4,500 deposited — three full months of rent, paid on time into a court-approved escrow account.' },
    letters: { name: 'Certified Letters', icon: 'letter', desc: 'Three letters to Victor Crane requesting heat repair, with signed postal return receipts.' },
    thermo: { name: 'Temperature Log', icon: 'thermometer', desc: 'Maya\'s daily log: indoor temperature between 48°F and 54°F every day in January.' },
    inspection: { name: 'City Inspection Report', icon: 'doc', desc: 'Inspector R. Cho: "Boiler non-functional. Serious code violation. Owner notified." 4 weeks ago.' },
    quote: { name: 'Declined Repair Quote', icon: 'receipt', desc: 'HeatPro boiler repair quote, $900 — stamped "DECLINED BY OWNER - V. Crane" in December.' },
  },
  start: ['notice'],
  locations: [
    { id: 'apt', name: 'Maya\'s Apartment', bg: 'apartment', intro: [['narr', 'You can see your breath inside Maya\'s apartment.']], spots: [
      { x: 200, y: 78, prop: 'radiator', label: 'Radiator', text: [['narr', 'Ice cold. There\'s frost on the INSIDE of the window above it.']] },
      { x: 270, y: 50, prop: 'thermostat', label: 'Thermometer', text: [['narr', 'The wall thermometer reads 51°F. Taped beside it: a handwritten **daily temperature log** for all of January.']], ev: 'thermo' },
      { x: 110, y: 112, prop: 'desk', label: 'Desk drawer', needs: 'letters_hint', text: [['narr', 'In the drawer: three **certified letters** to Victor Crane — with signed return receipts.'], ['you', 'Proof he got every single one.', 'happy']], ev: 'letters', alt: [['narr', 'A desk stuffed with papers, coloring books, and bills. You\'d need to know what you\'re looking for.']] },
    ] },
    { id: 'base', name: 'Building Basement', bg: 'warehouse', intro: [['narr', 'The basement boiler room. Water drips somewhere in the dark.']], spots: [
      { x: 140, y: 64, prop: 'boiler', label: 'Boiler', text: [['narr', 'A rusted boiler with a red tag: **"CONDEMNED — City of Riverside."**']], flag: 'tag' },
      { x: 240, y: 112, prop: 'clipboard', label: 'Clipboard on the wall', text: [['narr', 'A repair quote from HeatPro, $900. Stamped in red: **"DECLINED BY OWNER — V. Crane."** Dated December.'], ['you', 'He could have fixed it for nine hundred bucks.', 'angry']], ev: 'quote' },
    ] },
    { id: 'city', name: 'City Building Department', bg: 'corporate', intro: [['narr', 'The Building Department: beige walls, beige carpet, beige coffee.']], spots: [
      { x: 150, y: 100, prop: 'person', look: L(1, 'black', 'short', '#34495e', null, { glasses: true }), who: 'cho', label: 'Inspector Raymond Cho', text: [['cho', 'Crane\'s building on Elm? I wrote it up. **Non-functional boiler** in winter, with a child living there.'], ['cho', 'Sent him notice. He never called back. Here\'s my report — and yes, I\'ll testify.', 'angry']], ev: 'inspection', flag: 'cho_ready' },
      { x: 30, y: 100, prop: 'cabinet', label: 'Records cabinet', text: [['narr', 'Complaint files for Crane Properties. Thick ones. This isn\'t his first violation.']] },
    ] },
  ],
  motions: [
    { name: 'Motion to Dismiss: Retaliation', desc: 'Argue the eviction is illegal retaliation for a code complaint.', needs: 'inspection', bonus: 10, win: [['judge', 'An eviction filed right after the city cites the landlord? That smells like retaliation. I\'ll weigh that heavily.']], lose: [['judge', 'Retaliation for what, counsel? Show me a complaint or citation first. Denied.']] },
    { name: 'Motion for a Jury Trial', desc: 'Request a jury instead of a judge.', lose: [['judge', 'This is housing court, counsel. Bench trials only. Denied.']] },
  ],
  offer: { text: 'Crane offers: Maya moves out in 30 days and he drops the case.', better: 'Crane offers: he fixes the boiler, Maya stays, and the escrow pays the back rent.' },
  oppOpening: [['opp', 'Your Honor, this is simple. Ms. Lin hasn\'t paid rent in three months. Mr. Crane deserves his property back.']],
  opening: [
    { t: 'Maya didn\'t refuse to pay — she paid into escrow because Mr. Crane left her family freezing.', s: 5 },
    { t: 'Maya would just like more time to move.', s: -2 },
    { t: 'All landlords are greedy.', s: -5 },
  ],
  witnesses: [
    { who: 'crane', side: 'opp', damage: 10, intro: [['opp', 'We call Victor Crane.'], ['crane', 'Forty years a landlord. Never had a problem like this one.']], testimony: [
      { t: 'I keep all my buildings in perfect condition.', contra: 'inspection', hit: [['you', 'Perfect? The city found your boiler **completely non-functional** — a serious code violation!'], ['crane', 'That inspector has it out for me!', 'angry']], flag: 'violation' },
      { t: 'Ms. Lin never once complained to me about the heat.', contra: 'letters', hit: [['you', 'Three certified letters — and here are the **return receipts with your signature** on them.'], ['crane', 'I... don\'t read my mail very carefully.', 'sweat']], flag: 'notice' },
      { t: 'She hasn\'t paid a single dime in three months.', contra: 'escrow', hit: [['you', 'Every dollar — $4,500 — is sitting in a **court-approved escrow account**.'], ['judge', 'That\'s not "not paying," Mr. Crane. That\'s paying into escrow.']], flag: 'paid' },
      { t: 'Other tenants tell me she throws loud parties.', obj: 'Hearsay' },
      { t: 'I\'d have fixed any problem the moment I heard about it.', contra: 'quote', hit: [['you', 'Then why did you stamp a $900 boiler repair quote "**DECLINED BY OWNER**" in December?'], ['crane', 'Nine hundred dollars is a lot of money!', 'shock']], flag: 'declined' },
    ] },
    { who: 'cho', side: 'own', intro: [['you', 'The defense calls Inspector Raymond Cho.'], ['cho', 'Twelve years with the Building Department.']], rounds: [
      [{ q: 'What did you find when you inspected the building?', k: 'good', needs: 'cho_ready', r: [['cho', 'A non-functional boiler. In January. That\'s a serious code violation.']] },
       { q: 'The landlord is a bad guy, isn\'t he?', k: 'lead' },
       { q: 'Do you enjoy your job?', k: 'off' }],
      [{ q: 'What temperature does the housing code require?', k: 'good', needs: 'thermo', r: [['cho', 'At least 68 degrees. Ms. Lin\'s log shows it never got above 54.']] },
       { q: 'Did you notify the landlord?', k: 'good', r: [['cho', 'In writing. Certified. He never responded.']] },
       { q: 'You\'d agree Ms. Lin is a wonderful tenant?', k: 'lead' }],
    ] },
  ],
  closing: [
    { t: 'Maya paid every dollar of rent into escrow.', needs: 'paid' },
    { t: 'Crane received three certified letters about the heat.', needs: 'notice' },
    { t: 'The city cited the boiler as a serious code violation.', needs: 'violation' },
    { t: 'Crane declined a $900 repair to save money.', needs: 'declined' },
    { t: 'Maya just doesn\'t like Mr. Crane.', bad: true },
    { t: 'Rent is too high in this city anyway.', bad: true },
  ],
  win: [['judge', 'Eviction denied. Mr. Crane, you will repair that boiler within 7 days or face daily fines.'], ['client', 'We get to stay... and we get HEAT!', 'happy']],
  lose: [['client', 'Thirty days to find a new place... I don\'t know what we\'ll do.', 'sad']],
  deal: [['client', 'It\'s a deal. I just want this to be over.', 'sad']],
},

// ---------------------------------------------------------------- 4
{
  id: 'dui', title: 'The Midnight Stop', kind: 'criminal', area: 'DUI', side: 'defense', rank: 1,
  fee: 2500, rep: 60, threshold: 56, jury: true, court: 'Riverside Criminal Court',
  summary: 'Tom Becker blew a 0.09 on a breath test after a late-night traffic stop. He swears he only drank soda.',
  people: {
    client: { name: 'Tom Becker', look: L(0, 'brown', 'short', '#7f8c8d', null) },
    judge: J_OAKES,
    opp: { name: 'ADA Priya Shah', look: L(2, 'black', 'long', '#2c3e50', '#a8242a'), bg: '#4a2020' },
    brooks: { name: 'Officer Dale Brooks', look: L(1, 'black', 'short', '#1f3a93', '#15151c') },
    june: { name: 'June Okoro', look: L(4, 'black', 'curly', '#c0392b', null) },
  },
  intro: [
    ['narr', 'A man in a rumpled work shirt sits down heavily across from you.'],
    ['client', 'I\'m a school bus driver. If I\'m convicted of DUI, I **lose my job**.', 'sad'],
    ['client', 'And I wasn\'t drunk! I was the designated driver, for crying out loud!', 'angry'],
  ],
  interview: [
    { q: 'Tell me about that night.', a: [['client', 'My buddy\'s birthday at the Lucky Penny bar. I was the **designated driver**. I had three Cokes. That\'s it.']], flag: 'dd' },
    { q: 'Any health conditions?', a: [['client', 'I\'m a Type 1 diabetic. My blood sugar was all over the place that night — I skipped dinner.']], ev: 'diabetes' },
    { q: 'Why did the officer pull you over?', a: [['client', 'He said I swerved. I didn\'t! I signaled and changed lanes on Route 9. That\'s it.']], flag: 'route9' },
    { q: 'How did the breath test go?', a: [['client', 'He made me blow the second I got out of the car. Didn\'t wait or anything.']], flag: 'nowait' },
  ],
  evidence: {
    arrest: { name: 'Arrest Report', icon: 'doc', desc: 'Breath test: 0.09 BAC at 12:41 AM using Unit #7. Reason for stop: "erratic lane change."' },
    diabetes: { name: 'Medical Records', icon: 'medical', desc: 'Type 1 diabetes. Note: low blood sugar can cause ketosis, raising breath acetone — which some breath testers misread as alcohol.' },
    calib: { name: 'Calibration Log', icon: 'chart', desc: 'Breathalyzer Unit #7: last calibrated 14 months ago. State law requires every 6 months.' },
    tab: { name: 'Bar Tab', icon: 'receipt', desc: 'Lucky Penny, tab #112, Tom Becker: 3 Coca-Colas. $7.50. No alcohol.' },
    bodycam: { name: 'Body Cam Footage', icon: 'video', desc: 'Officer Brooks administers the breath test 2 minutes after the stop. Protocol requires 15 minutes of observation first.' },
    dashcam: { name: 'Dash Cam Footage', icon: 'video', desc: 'Tom\'s car signals and makes one smooth lane change. No swerving at any point.' },
  },
  start: ['arrest'],
  locations: [
    { id: 'bar', name: 'The Lucky Penny', bg: 'bar', intro: [['narr', 'The Lucky Penny. Sticky floors, loud jukebox, friendly bartender.']], spots: [
      { x: 180, y: 70, prop: 'register', label: 'Bar register', text: [['narr', 'The register keeps tabs on file. Tab #112, Tom Becker: **three Coca-Colas**, $7.50.']], ev: 'tab' },
      { x: 90, y: 92, prop: 'person', look: L(4, 'black', 'curly', '#c0392b', null), who: 'june', label: 'June Okoro (Bartender)', text: [['june', 'Tom? He\'s the designated driver every single time. Collects everyone\'s keys at the door.'], ['june', 'Coke all night. I\'d swear to it in front of God and everybody.', 'happy']], flag: 'june' },
      { x: 270, y: 110, prop: 'trash', label: 'Recycling bin', text: [['narr', 'Empty soda cans. And a few beer bottles. Not exactly a smoking gun either way.']] },
    ] },
    { id: 'station', name: 'Police Station', bg: 'police', intro: [['narr', 'The precinct\'s equipment room. A sergeant waves you in, bored.']], spots: [
      { x: 40, y: 60, prop: 'machine', label: 'Breathalyzer Unit #7', text: [['narr', 'Unit #7. A sticker on the side: "Last calibrated: 14 months ago."'], ['you', 'State law says every **six months**. This machine is way overdue.', 'happy']], ev: 'calib' },
      { x: 150, y: 100, prop: 'computer', label: 'Evidence terminal', text: [['narr', 'The body cam file from the stop is open. Officer Brooks tests Tom **two minutes** after pulling him over.'], ['you', 'Protocol requires a 15-minute observation period. He skipped it.']], ev: 'bodycam' },
      { x: 250, y: 60, prop: 'bulletin', label: 'Bulletin board', text: [['narr', '"DUI ARREST CONTEST — TOP OFFICER WINS A GRILL." Officer Brooks is in first place.'], ['you', 'Interesting incentive...']], flag: 'contest' },
    ] },
    { id: 'route', name: 'Route 9', bg: 'night', intro: [['narr', 'Route 9 at night. Wide, well-lit lanes.']], spots: [
      { x: 120, y: 132, prop: 'car', label: 'Your rental car', text: [['narr', 'You drive the stretch yourself. It\'s straight and wide — hard to "swerve" by accident.']] },
      { x: 250, y: 80, prop: 'camera', label: 'Traffic light', text: [['narr', 'A traffic light with a camera mount — but it only records red-light runners.'], ['you', 'The patrol car would\'ve had a **dash cam**, though. The prosecution never turned that over.']], flag: 'dash_hint' },
    ] },
  ],
  motions: [
    { name: 'Motion to Suppress Breath Test', desc: 'Argue the breath test result is unreliable and inadmissible.', needs: 'calib', bonus: 12, win: [['judge', 'A breathalyzer eight months overdue for calibration? The 0.09 result is **suppressed**. The officer may still testify to what he saw.']], lose: [['judge', 'On what grounds, counsel? You haven\'t shown me anything wrong with the machine. Denied.']] },
    { name: 'Motion to Compel Dash Cam', desc: 'Make the prosecution produce the patrol car\'s dash camera video.', needs: 'dash_hint', gives: 'dashcam', bonus: 3, win: [['judge', 'Granted. If it exists, the People will produce it.']], lose: [['judge', 'What dash cam? Be specific, counsel. Denied.']] },
    { name: 'Motion to Dismiss', desc: 'Ask the judge to throw the case out entirely.', lose: [['judge', 'An officer\'s observations alone can support a trial. Denied.']] },
  ],
  offer: { text: 'Plead guilty to DUI: license suspended 6 months, $1,000 fine. Tom loses his bus route.', better: 'Plead to reckless driving: no DUI on record, Tom keeps his job.' },
  oppOpening: [['opp', 'The defendant failed a breath test, smelled of alcohol, and swerved across lanes. The law is clear.']],
  opening: [
    { t: 'Tom was the designated driver. A broken machine and a rushed test made a sober man look drunk.', s: 5 },
    { t: 'The officer was out to get Tom.', s: 0 },
    { t: 'Everyone has a drink sometimes.', s: -5 },
  ],
  witnesses: [
    { who: 'brooks', side: 'opp', damage: 12, intro: [['opp', 'The People call Officer Dale Brooks.'], ['brooks', 'Eleven years on patrol. I know a drunk driver when I see one.']], testimony: [
      { t: 'I observed the vehicle swerving dangerously across two lanes.', contra: 'dashcam', hit: [['you', 'Your own dash cam shows Tom **signaling and making one smooth lane change**. Where\'s the swerving?'], ['brooks', 'It... looked worse in person.', 'sweat']], flag: 'noswerve' },
      { t: 'I observed the suspect for the required 15 minutes before testing.', contra: 'bodycam', hit: [['you', 'Your body cam shows you testing him **two minutes** after the stop!'], ['brooks', 'Two... fifteen... it was a busy night.', 'sweat']], flag: 'rushed' },
      { t: 'Unit #7 is a reliable, properly maintained device.', contra: 'calib', hit: [['you', 'Unit #7 hasn\'t been calibrated in **fourteen months**. The law requires every six!'], ['brooks', 'I just use them. I don\'t maintain them.', 'sweat']], flag: 'badmachine' },
      { t: 'His breath had a strong odor. Sort of fruity and sweet.', press: [['brooks', 'Fruity. Like... nail polish remover, maybe. Weird for beer, now that I think about it.']], contra: 'diabetes', hit: [['you', 'A fruity, sweet breath odor is a classic sign of **diabetic ketosis** — not alcohol. Tom is a Type 1 diabetic.'], ['brooks', 'I\'m not a doctor...', 'shock']], flag: 'ketosis' },
      { t: 'That bar has served plenty of drunk drivers before.', obj: ['Relevance', 'Improper Character'] },
    ] },
    { who: 'june', side: 'own', intro: [['you', 'The defense calls June Okoro.'], ['june', 'I\'ve tended bar at the Lucky Penny for nine years.']], rounds: [
      [{ q: 'What did Tom drink that night?', k: 'good', needs: 'june', r: [['june', 'Three Cokes. I rang them up myself.']] },
       { q: 'Tom didn\'t drink any alcohol, right?', k: 'lead' },
       { q: 'What\'s the best cocktail you make?', k: 'off' }],
      [{ q: 'Do you have a record of his order?', k: 'good', needs: 'tab', r: [['june', 'Tab one-twelve. Three Coca-Colas. Seven dollars fifty.']] },
       { q: 'How did you know he was the designated driver?', k: 'good', needs: 'dd', r: [['june', 'He collected everyone\'s car keys at the door. Does it every time.']] },
       { q: 'You would never let a drunk man drive, would you?', k: 'lead' }],
    ] },
  ],
  closing: [
    { t: 'The dash cam shows no swerving at all.', needs: 'noswerve' },
    { t: 'The officer skipped the 15-minute observation period.', needs: 'rushed' },
    { t: 'Unit #7 was 8 months overdue for calibration.', needs: 'badmachine' },
    { t: 'The "fruity" odor was diabetic ketosis, not alcohol.', needs: 'ketosis' },
    { t: 'The bar tab shows three Cokes and nothing else.', needs: 'tab' },
    { t: 'Drunk driving laws are too strict anyway.', bad: true },
  ],
  win: [['client', 'Not guilty! I get to keep my route. The kids would\'ve had a new driver...', 'happy']],
  lose: [['client', 'Guilty. Six months without a license. I\'ll lose everything.', 'sad']],
  deal: [['client', 'It\'s not perfect, but I can live with it.']],
},

// ---------------------------------------------------------------- 5
{
  id: 'flour', title: 'Flour Power', kind: 'civil', area: 'Breach of Contract', side: 'plaintiff', rank: 2,
  rep: 80, damages: 180000, threshold: 58, jury: true, court: 'State Superior Court',
  summary: 'Grand Mills broke its flour supply contract with Ortega\'s Bakery right before wedding season, blaming a storm. Luis lost dozens of orders.',
  people: {
    client: { name: 'Luis Ortega', look: L(2, 'black', 'short', '#ecf0f1', null, { beard: true }) },
    judge: J_MBEKI,
    opp: { name: 'Whitney Pell', look: L(0, 'blonde', 'bob', '#1c1c22', '#2a5aa8'), bg: '#20304a' },
    kole: { name: 'Sandra Kole', look: L(0, 'blonde', 'bun', '#2c3e50', '#a8242a') },
    bea: { name: 'Bea Santos', look: L(3, 'black', 'long', '#e91e63', null) },
    driver: { name: 'Hank (Truck Driver)', look: L(1, 'brown', 'short', '#e67e22', null, { beard: true }), pitch: 0.8 },
    dale: { name: 'Dale Moreno', look: L(2, 'gray', 'short', '#7f8c8d', null, { glasses: true }) },
  },
  intro: [
    ['narr', 'A baker walks in still dusted with flour, holding a folder thick with papers.'],
    ['client', 'Ortega\'s Bakery. Three generations. Best tres leches in the state.', 'happy'],
    ['client', 'And Grand Mills just... **stopped delivering**. Right before wedding season. I\'m being ruined.', 'angry'],
  ],
  interview: [
    { q: 'What did the contract promise?', a: [['client', 'Two tons of flour every month, fixed price, for two years. Signed and stamped.']], ev: 'contract' },
    { q: 'What happened in May?', a: [['client', 'They sent a letter saying a storm hit their mill. "Force majeure," whatever that is. Deliveries suspended.']] },
    { q: 'How much did you lose?', a: [['client', 'I cancelled forty wedding cakes. Bought emergency flour at triple price. My accountant says about **$180,000**.', 'sad']], ev: 'losses' },
    { q: 'Anything strange about it?', a: [['client', 'My cousin drives trucks. He saw Grand Mills trucks unloading at **MegaBread Corp** all through May.']], flag: 'megabread' },
  ],
  evidence: {
    letter: { name: 'Grand Mills Letter', icon: 'letter', desc: '"Due to the catastrophic May storm, we invoke force majeure and suspend all deliveries indefinitely."' },
    contract: { name: 'Supply Contract', icon: 'contract', desc: '2 tons/month for 2 years. Force majeure excuses performance ONLY if a disaster "makes performance impossible."' },
    losses: { name: 'Loss Statement', icon: 'chart', desc: 'Accountant\'s summary: $180,000 in lost orders and emergency flour purchases.' },
    weather: { name: 'Weather Records', icon: 'chart', desc: 'National Weather Service: the May storm hit the coast, 300 miles from Grand Mills\' inland mill. Mill area: sunny all month.' },
    shipping: { name: 'Shipping Manifests', icon: 'doc', desc: 'Grand Mills shipped 40 tons of flour to MegaBread Corp in May — at double the price Luis paid.' },
    email: { name: 'Internal Email', icon: 'email', desc: 'From S. Kole: "Redirect Ortega\'s allotment to MegaBread. Blame the storm. Small bakeries never sue."' },
    cancel: { name: 'Cancelled Orders', icon: 'doc', desc: '41 wedding cake cancellations in May and June, each with a signed note from the couple.' },
  },
  start: ['letter'],
  locations: [
    { id: 'bakery', name: 'Ortega\'s Bakery', bg: 'bakery', intro: [['narr', 'The ovens are cold. That\'s never a good sign in a bakery.']], spots: [
      { x: 30, y: 110, prop: 'book', label: 'Order book', text: [['narr', 'The order book. May and June are a sea of red ink: **41 cancelled wedding cakes**, each with a note.']], ev: 'cancel' },
      { x: 120, y: 112, prop: 'box', label: 'Empty flour sacks', text: [['narr', 'Empty Grand Mills flour sacks. Stamped: "Milled fresh at our inland facility, May 12."'], ['you', 'May 12th. Right in the middle of their supposed "shutdown."', 'happy']], flag: 'sack' },
    ] },
    { id: 'dock', name: 'Grand Mills Loading Dock', bg: 'warehouse', intro: [['narr', 'Grand Mills\' loading dock is busy. Very busy for a mill that was "shut down."']], spots: [
      { x: 140, y: 100, prop: 'crates', label: 'Pallets', text: [['narr', 'Pallets of flour shrink-wrapped and labeled: **"MEGABREAD CORP — PRIORITY."**']], flag: 'pallets' },
      { x: 250, y: 92, prop: 'clipboard', label: 'Shipping clipboard', text: [['narr', 'May shipping manifests. 40 tons to MegaBread Corp. Price per ton: **double** Luis\'s rate.']], ev: 'shipping' },
      { x: 50, y: 112, prop: 'person', look: L(1, 'brown', 'short', '#e67e22', null, { beard: true }), who: 'driver', label: 'Hank (Truck Driver)', text: [['driver', 'Storm? Ha! Mill never stopped. We worked **overtime** in May.'], ['driver', 'Word is the boss lady found a richer customer.']], flag: 'driver' },
    ] },
    { id: 'lib', name: 'Public Library', bg: 'library', intro: [['narr', 'The public library. Quiet, free Wi-Fi, and federal weather archives.']], spots: [
      { x: 150, y: 112, prop: 'computer', label: 'Public computer', text: [['narr', 'National Weather Service archives for May. The storm made landfall on the coast — **300 miles** from Grand Mills.'], ['narr', 'Grand Mills\' county: sunny and 75°F all month.']], ev: 'weather' },
    ] },
    { id: 'diner', name: 'Rosie\'s Diner', bg: 'diner', intro: [['narr', 'A former Grand Mills employee agreed to meet you here. He looks nervous.']], spots: [
      { x: 150, y: 96, prop: 'person', look: L(2, 'gray', 'short', '#7f8c8d', null, { glasses: true }), who: 'dale', label: 'Dale Moreno (ex-employee)', text: [['dale', 'I quit after what they did to Ortega. Sandra Kole sent an **email** to the whole logistics team.'], ['dale', 'Something like "blame the storm." I didn\'t save it, but it\'s on their servers. Make them **turn it over**.']], flag: 'email_hint' },
    ] },
  ],
  motions: [
    { name: 'Motion to Compel Internal Emails', desc: 'Force Grand Mills to produce its logistics emails from May.', needs: 'email_hint', gives: 'email', bonus: 4, win: [['judge', 'Granted. Grand Mills will produce the logistics team\'s May emails.']], lose: [['judge', 'Fishing expedition, counsel. Give me a specific reason. Denied.']] },
    { name: 'Partial Summary Judgment: Force Majeure', desc: 'Ask the judge to rule the storm excuse doesn\'t apply as a matter of law.', needs: 'weather', bonus: 8, win: [['judge', 'A storm 300 miles away doesn\'t make performance "impossible." Partial summary judgment **granted**. The force majeure defense is out.']], lose: [['judge', 'I need more than your say-so about the weather, counsel. Denied.']] },
  ],
  oppOpening: [['opp', 'Grand Mills faced a natural disaster. The contract excuses delays caused by acts of God. This lawsuit should never have been filed.']],
  opening: [
    { t: 'Grand Mills didn\'t suffer a disaster. They found a richer customer and broke their word.', s: 5 },
    { t: 'Luis makes the best croissants in town.', s: 0 },
    { t: 'Corporations like Grand Mills should be shut down.', s: -5 },
  ],
  witnesses: [
    { who: 'kole', side: 'opp', damage: 12, intro: [['opp', 'We call Sandra Kole, Vice President of Operations.'], ['kole', 'I have overseen Grand Mills logistics for a decade.']], testimony: [
      { t: 'A catastrophic storm shut down our mill in May.', contra: 'weather', hit: [['you', 'The storm hit **300 miles away**. Your mill\'s county was sunny all month!'], ['kole', 'The... regional supply chain was disrupted.', 'sweat']], flag: 'nostorm' },
      { t: 'We simply had no flour to deliver to anyone.', contra: 'shipping', hit: [['you', 'No flour? You shipped **forty tons** to MegaBread Corp in May — at double the price!'], ['kole', 'Those were... prior commitments.', 'sweat']], flag: 'shipped' },
      { t: 'Our contract lets us suspend deliveries for any bad weather.', contra: 'contract', hit: [['you', 'Read it again. Force majeure applies only if a disaster makes performance **impossible**. Not inconvenient. Impossible.'], ['kole', '...', 'sweat']], flag: 'clause' },
      { t: 'Frankly, I heard Mr. Ortega\'s bakery was failing anyway.', obj: 'Hearsay' },
      { t: 'This decision had absolutely nothing to do with MegaBread.', contra: 'email', hit: [['you', 'Then explain your email: "**Redirect Ortega\'s allotment to MegaBread. Blame the storm. Small bakeries never sue.**"'], ['kole', 'That was... taken out of context!', 'shock'], ['judge', 'It\'s fairly clear in context, Ms. Kole.']], flag: 'motive' },
    ] },
    { who: 'bea', side: 'own', intro: [['you', 'The plaintiff calls Bea Santos.'], ['bea', 'I\'m a wedding planner. I\'ve sent couples to Ortega\'s for fifteen years.']], rounds: [
      [{ q: 'How did the flour shortage affect your clients?', k: 'good', r: [['bea', 'Forty couples lost their wedding cakes. Some found out two days before the wedding.']] },
       { q: 'Luis is the best baker in the state, isn\'t he?', k: 'lead' },
       { q: 'What\'s your favorite wedding song?', k: 'off' }],
      [{ q: 'How many orders were cancelled?', k: 'good', needs: 'cancel', r: [['bea', 'Forty-one. I have every cancellation note.']] },
       { q: 'Will those customers come back?', k: 'good', r: [['bea', 'Brides don\'t forgive. That\'s business he\'ll never get back.']] },
       { q: 'Grand Mills ruined everything, right?', k: 'lead' }],
    ] },
  ],
  closing: [
    { t: 'There was no storm at Grand Mills\' mill.', needs: 'nostorm' },
    { t: 'Grand Mills shipped 40 tons of flour to MegaBread instead.', needs: 'shipped' },
    { t: 'Kole\'s own email shows they did it on purpose.', needs: 'motive' },
    { t: 'The contract only excuses truly impossible performance.', needs: 'clause' },
    { t: 'Luis lost $180,000 because of the breach.', needs: 'losses' },
    { t: 'Grand Mills is big, so they can afford to pay.', bad: true },
  ],
  win: [['client', 'We won? WE WON! The ovens are coming back on tonight!', 'happy']],
  lose: [['client', 'So big companies can just... do that. Huh.', 'sad']],
  deal: [['client', 'It\'s enough to keep the doors open. Gracias, {name}.', 'happy']],
},

// ---------------------------------------------------------------- 6
{
  id: 'brawl', title: 'Last Call at the Blue Note', kind: 'criminal', area: 'Assault / Self-Defense', side: 'defense', rank: 2,
  fee: 4000, rep: 80, threshold: 58, jury: true, court: 'Riverside Criminal Court',
  summary: 'Bouncer Marcus Hale broke a customer\'s nose in the alley behind the Blue Note jazz club. He says the man pulled a knife. Police found no knife.',
  people: {
    client: { name: 'Marcus Hale', look: L(4, 'black', 'bald', '#15151c', null, { beard: true }), pitch: 0.7 },
    judge: J_WHIT, opp: ADA_KELL,
    rick: { name: 'Rick Dorsey', look: L(0, 'blonde', 'spiky', '#95a5a6', null) },
    chad: { name: 'Chad Weller', look: L(1, 'brown', 'short', '#e67e22', null), pitch: 1.1 },
    nina: { name: 'Nina Park', look: L(1, 'black', 'long', '#16a085', null) },
  },
  intro: [
    ['narr', 'A huge man folds himself into your client chair. His forearm is bandaged.'],
    ['client', 'I\'ve been a bouncer eleven years. Never once threw the first punch.'],
    ['client', 'That guy came at me with a **blade**. I hit him once. Once. Now I\'m facing **aggravated assault**.', 'angry'],
  ],
  interview: [
    { q: 'What happened in the alley?', a: [['client', 'I cut Rick off at the bar — he was wasted. Later he jumped me by the dumpster with a knife. I hit him once to stop him.']] },
    { q: 'Where\'s the knife now?', a: [['client', 'He dropped it. I kicked it **under the dumpster** so he couldn\'t grab it. The cops never even looked.']], flag: 'knife_hint' },
    { q: 'Were you injured?', a: [['client', 'He got my forearm. Six stitches. ER report\'s right here.']], ev: 'er_report' },
    { q: 'Did anyone see it?', a: [['client', 'Nina, the bartender, was taking out trash. And Rick\'s buddy Chad — but he\'ll lie for Rick.']], flag: 'nina' },
  ],
  evidence: {
    complaint: { name: 'Criminal Complaint', icon: 'doc', desc: 'Marcus Hale charged with aggravated assault. Victim Rick Dorsey: broken nose. "No weapon recovered."' },
    er_report: { name: 'ER Report', icon: 'medical', desc: 'Marcus Hale: 3-inch laceration on the left forearm, consistent with a knife wound. 6 stitches, 12:20 AM.' },
    knife: { name: 'Folding Knife', icon: 'knife', desc: 'Found under the alley dumpster. Engraved on the handle: "R.D."' },
    video: { name: 'Alley Camera Footage', icon: 'video', desc: 'Grainy footage: Rick lunges first with something shiny in his hand. Marcus strikes once, then steps back.' },
    bar_log: { name: 'Incident Log', icon: 'doc', desc: '11:58 PM: "Cut off R. Dorsey — intoxicated, aggressive. Told bouncer: \'I\'ll cut you.\'" Signed: N. Park.' },
    text: { name: 'Chad\'s Text Message', icon: 'phone', desc: 'Chad to Rick, 12:30 AM: "ditch the knife bro. we tell cops he jumped u."' },
  },
  start: ['complaint'],
  locations: [
    { id: 'club', name: 'The Blue Note', bg: 'bar', intro: [['narr', 'The Blue Note, mid-afternoon. Chairs on tables. A saxophone case in the corner.']], spots: [
      { x: 190, y: 66, prop: 'book', label: 'Incident log', text: [['narr', 'The bar\'s incident log. 11:58 PM: "Cut off R. Dorsey — intoxicated, aggressive. Told bouncer: **\'I\'ll cut you.\'**"']], ev: 'bar_log' },
      { x: 90, y: 92, prop: 'person', look: L(1, 'black', 'long', '#16a085', null), who: 'nina', label: 'Nina Park (Bartender)', needs: 'nina', text: [['nina', 'I saw it. Rick lunged at Marcus with a knife. Marcus punched once and backed off.'], ['nina', 'And after? Chad was hissing at Rick: "**Get rid of it before the cops come.**"', 'angry']], flag: 'nina_ready', also: 'chad_hint', alt: [['narr', 'A bartender polishes glasses and ignores you. Maybe Marcus knows who saw what happened.']] },
    ] },
    { id: 'alley', name: 'The Alley', bg: 'alley', intro: [['narr', 'The alley behind the club. It smells like rain and garbage.']], spots: [
      { x: 180, y: 112, prop: 'dumpster', label: 'Dumpster', needs: 'knife_hint', text: [['narr', 'You get down on your hands and knees and reach under the dumpster...'], ['narr', 'A **folding knife**. Engraved on the handle: "R.D."'], ['you', 'Rick Dorsey. The police missed it completely.', 'happy']], ev: 'knife', alt: [['narr', 'A dumpster. It smells awful. Nothing obviously important... but you might be missing something.']] },
      { x: 270, y: 34, prop: 'camera', label: 'Security camera', text: [['narr', 'A camera over the club\'s back door, aimed right at the alley.'], ['you', 'The club would have the footage. I can **move to compel** it.']], flag: 'cam_hint' },
      { x: 60, y: 140, prop: 'puddle', label: 'Stain', text: [['narr', 'A faded rust-colored stain. Some of it might be Marcus\'s blood.']] },
    ] },
  ],
  motions: [
    { name: 'Motion to Compel Alley Footage', desc: 'Get the Blue Note\'s back-door camera footage.', needs: 'cam_hint', gives: 'video', bonus: 3, win: [['judge', 'Granted. The club will produce the footage.']], lose: [['judge', 'What footage? Denied.']] },
    { name: 'Subpoena Chad\'s Phone Records', desc: 'Get Chad Weller\'s texts from the night of the fight.', needs: 'chad_hint', gives: 'text', bonus: 3, win: [['judge', 'A witness heard him talking about getting rid of something? Granted, narrowly — texts from that night only.']], lose: [['judge', 'You\'d need a good-faith reason, counsel. Denied.']] },
    { name: 'Motion to Dismiss', desc: 'Ask for the case to be thrown out.', lose: [['judge', 'A man with a broken nose says your client attacked him. That\'s for a jury. Denied.']] },
  ],
  offer: { text: 'Plead guilty to simple assault: one year probation and anger management.', better: 'Plead to disorderly conduct: 30 days community service, no assault record.' },
  oppOpening: [['opp', 'The defendant is a trained fighter who lost his temper and shattered a man\'s face. There was no knife. There was only rage.']],
  opening: [
    { t: 'Marcus didn\'t start this fight — he ended it, after a drunk man came at him with a knife.', s: 5 },
    { t: 'Bouncers have a really tough job.', s: 0 },
    { t: 'Honestly, Rick deserved a punch.', s: -6 },
  ],
  witnesses: [
    { who: 'rick', side: 'opp', damage: 10, intro: [['opp', 'The People call Rick Dorsey.'], ['rick', 'Look at my nose. LOOK at it.', 'angry']], testimony: [
      { t: 'Marcus came out of nowhere and attacked me.', contra: 'video', hit: [['you', 'The alley camera shows **you lunging first**, with something shiny in your hand.'], ['rick', 'That\'s... that was my phone!', 'sweat']], flag: 'rick_first' },
      { t: 'I didn\'t even have a weapon.', contra: 'knife', hit: [['you', 'Then whose knife was under the dumpster — engraved "**R.D.**"?'], ['rick', 'Lots of people have those initials!', 'shock'], ['judge', 'Order. The jury can draw its own conclusions.']], flag: 'had_knife' },
      { t: 'I\'d only had a couple beers. I was totally calm.', contra: 'bar_log', hit: [['you', 'The bar cut you off for being **intoxicated and aggressive**, and you told Marcus, "I\'ll cut you."'], ['rick', 'It\'s an expression!', 'angry']], flag: 'aggressive' },
      { t: 'Marcus didn\'t get a single scratch on him.', contra: 'er_report', hit: [['you', 'Marcus needed **six stitches** for a knife wound on his forearm that same night.'], ['rick', '...', 'sweat']], flag: 'wounded' },
    ] },
    { who: 'chad', side: 'opp', damage: 8, intro: [['opp', 'The People call Chad Weller.'], ['chad', 'Rick\'s my boy. I saw everything.']], testimony: [
      { t: 'I saw the whole thing. Rick had his hands up.', press: [['chad', 'Up like... in a fighting stance. I mean, a PEACEFUL stance!', 'sweat']] },
      { t: 'There was definitely no knife. I\'d have seen it.', contra: ['knife', 'text'], hit: [['you', 'No knife? Then what was the knife engraved "R.D." doing under the dumpster — the one **you texted Rick about**?'], ['chad', 'I... uh...', 'sweat']], flag: 'coverup' },
      { t: 'Everyone knows Marcus has beaten up tons of people.', obj: ['Hearsay', 'Improper Character'] },
      { t: 'Afterwards, Rick and I went straight to the police.', contra: 'text', hit: [['you', 'Straight to the police? At 12:30 you texted Rick: "**ditch the knife bro. we tell cops he jumped u.**"'], ['chad', 'OBJECTION! Wait, can I do that?', 'shock'], ['judge', 'No, Mr. Weller, you cannot.']], flag: 'coverup' },
    ] },
    { who: 'nina', side: 'own', intro: [['you', 'The defense calls Nina Park.'], ['nina', 'Head bartender at the Blue Note.']], rounds: [
      [{ q: 'What did you see in the alley?', k: 'good', needs: 'nina_ready', r: [['nina', 'Rick lunged at Marcus with a knife. Marcus punched once and backed away.']] },
       { q: 'Marcus was defending himself, correct?', k: 'lead' },
       { q: 'How long have you been a bartender?', k: 'off' }],
      [{ q: 'Why did you cut Rick off that night?', k: 'good', needs: 'bar_log', r: [['nina', 'He was falling-down drunk and threatening people. He told Marcus, "I\'ll cut you." I wrote it in the log.']] },
       { q: 'What did you hear after the fight?', k: 'good', needs: 'chad_hint', r: [['nina', 'Chad telling Rick, "Get rid of it before the cops come."']] },
       { q: 'Rick is a dangerous man, isn\'t he?', k: 'lead' }],
    ] },
  ],
  closing: [
    { t: 'The video shows Rick lunging first.', needs: 'rick_first' },
    { t: 'Rick\'s own engraved knife was found at the scene.', needs: 'had_knife' },
    { t: 'Marcus suffered a knife wound needing six stitches.', needs: 'wounded' },
    { t: 'Chad\'s text proves they planned a cover-up.', needs: 'coverup' },
    { t: 'Rick was drunk and threatened Marcus beforehand.', needs: 'aggressive' },
    { t: 'Bouncers should be allowed to hit people.', bad: true },
  ],
  win: [['client', 'Not guilty. I... I need a minute.', 'happy'], ['narr', 'Outside the courthouse, police take Rick Dorsey in for questioning about the knife.']],
  lose: [['client', 'Eleven years. Never threw the first punch. Didn\'t matter.', 'sad']],
  deal: [['client', 'Community service. Fine. Better than a cell.']],
},

// ---------------------------------------------------------------- 7
{
  id: 'fired', title: 'Passed Over', kind: 'civil', area: 'Employment Discrimination', side: 'plaintiff', rank: 3,
  rep: 100, damages: 350000, threshold: 60, jury: true, court: 'Federal District Court',
  summary: 'Aisha Grant was fired from Apex Tech two weeks after telling her boss she was pregnant. Apex says it was poor performance.',
  people: {
    client: { name: 'Aisha Grant', look: L(3, 'black', 'bun', '#8e44ad', null) },
    judge: J_REYES,
    opp: { name: 'Gordon Ashby', look: L(0, 'gray', 'short', '#1c1c22', '#7a3aa8'), bg: '#20304a' },
    craig: { name: 'Craig Benson', look: L(0, 'brown', 'short', '#34495e', '#2a5aa8') },
    linda: { name: 'Linda Moss', look: L(1, 'red', 'long', '#7f8c8d', null) },
    jamal: { name: 'Jamal Price', look: L(4, 'black', 'short', '#27ae60', '#c8a028') },
    it: { name: 'Sid (IT Contractor)', look: L(1, 'blue', 'spiky', '#2c2c34', null, { glasses: true }), pitch: 1.2 },
  },
  intro: [
    ['narr', 'A woman in a sharp blazer sits down, one hand resting on her belly.'],
    ['client', 'Eight years at Apex Tech. Engineer of the Quarter in **January**.'],
    ['client', 'I told my manager I was pregnant on March 1st. On March 15th, I was fired for "performance."', 'angry'],
  ],
  interview: [
    { q: 'How were your performance reviews?', a: [['client', '"Exceeds Expectations," three years straight. All signed by Craig himself. Here are copies.']], ev: 'reviews' },
    { q: 'Who replaced you?', a: [['client', 'Trevor. Craig\'s golf buddy. One year at the company, no certification. I trained him!', 'angry']], flag: 'trevor' },
    { q: 'Did anyone mention your pregnancy?', a: [['client', 'My coworker **Jamal** overheard Craig say something. He won\'t tell me what — he\'s scared for his job.']], flag: 'jamal' },
    { q: 'Were you ever warned about performance?', a: [['client', 'Never! Then at my firing they showed me an "improvement plan" dated February 1st. I\'d **never seen it**.']], flag: 'pip_hint' },
  ],
  evidence: {
    term: { name: 'Termination Letter', icon: 'letter', desc: 'March 15: "Terminated for ongoing performance deficiencies documented since February."' },
    reviews: { name: 'Performance Reviews', icon: 'doc', desc: 'Last three annual reviews: "Exceeds Expectations." Signed by Craig Benson.' },
    award: { name: 'Engineer of the Quarter', icon: 'badge', desc: 'Apex Tech award plaque — Aisha Grant, Engineer of the Quarter, this January.' },
    pip: { name: 'Backdated PIP', icon: 'doc', desc: 'The "Performance Improvement Plan" is dated Feb 1 — but file metadata shows it was created March 10, after the pregnancy news.' },
    resume: { name: 'Trevor\'s Résumé', icon: 'doc', desc: 'Trevor: 1 year experience, no certification. Aisha: 8 years, senior certification.' },
    email: { name: 'Craig\'s Email', icon: 'email', desc: 'Craig to HR, March 3: "With the baby coming she\'ll be checked out. Let\'s find a reason to move on."' },
    hr_notes: { name: 'HR Meeting Notes', icon: 'doc', desc: 'L. Moss, March 4: "Craig wants Aisha out due to pregnancy. Advised him to document performance issues first."' },
  },
  start: ['term'],
  locations: [
    { id: 'home', name: 'Aisha\'s Home Office', bg: 'house', intro: [['narr', 'Aisha\'s home office. A crib, still in its box, leans against the wall.']], spots: [
      { x: 140, y: 40, prop: 'plaque', label: 'Award plaque', text: [['narr', '"**Engineer of the Quarter** — Aisha Grant." Dated this January. Two months before she was "underperforming."']], ev: 'award' },
      { x: 250, y: 112, prop: 'box', label: 'Crib box', text: [['narr', 'An unassembled crib. Aisha says she hasn\'t had the heart to build it yet.']] },
    ] },
    { id: 'apex', name: 'Apex Tech Office', bg: 'corporate', intro: [['narr', 'Apex Tech. Open-plan desks, kombucha on tap, and a lot of people pretending not to see you.']], spots: [
      { x: 60, y: 104, prop: 'person', look: L(4, 'black', 'short', '#27ae60', '#c8a028'), who: 'jamal', label: 'Jamal Price', needs: 'jamal', text: [['jamal', '...Okay. I\'ll say it. Craig said: "Pregnant? Great, there goes her productivity."', 'sad'], ['jamal', 'And he emailed HR about it. I saw it on his screen. Make them **produce those emails**.']], flag: 'jamal_ready', also: 'email_hint', alt: [['narr', 'An engineer hunches over his keyboard, refusing to make eye contact.']] },
      { x: 260, y: 100, prop: 'machine', label: 'Printer', text: [['narr', 'Someone left a printout in the tray: Trevor\'s résumé. **One year** of experience, no certification.'], ['you', 'Versus Aisha\'s eight years and a senior cert. Quite a "upgrade."']], ev: 'resume' },
      { x: 160, y: 104, prop: 'cabinet', label: 'HR filing cabinet', text: [['narr', 'Locked. A label reads "HR — CONFIDENTIAL — L. MOSS."'], ['you', 'I\'d need a **subpoena** to get at what\'s in there.']], flag: 'hr_hint' },
    ] },
    { id: 'cafe', name: 'Rosie\'s Diner', bg: 'diner', intro: [['narr', 'Aisha put you in touch with a contractor who used to run Apex\'s document servers.']], spots: [
      { x: 150, y: 96, prop: 'person', look: L(1, 'blue', 'spiky', '#2c2c34', null, { glasses: true }), who: 'it', label: 'Sid (IT Contractor)', needs: 'pip_hint', text: [['it', 'An "improvement plan" dated February? Send it to me.'], ['it', '...Yeah. File metadata says it was **created March 10th**. Someone typed in an old date. Classic.', 'happy']], ev: 'pip', alt: [['it', 'You want IT help? I\'d need to know what document you\'re looking at, friend.']] },
    ] },
  ],
  motions: [
    { name: 'Motion to Compel Email Records', desc: 'Force Apex to produce Craig Benson\'s emails to HR.', needs: 'email_hint', gives: 'email', bonus: 3, win: [['judge', 'Granted. Apex will produce Mr. Benson\'s March emails to HR.']], lose: [['judge', 'You need a specific basis for that request. Denied.']] },
    { name: 'Subpoena HR Files', desc: 'Get Linda Moss\'s HR notes about Aisha.', needs: 'hr_hint', gives: 'hr_notes', bonus: 3, win: [['judge', 'Granted. The HR file on Ms. Grant\'s termination will be produced.']], lose: [['judge', 'Which files, counsel? Denied.']] },
    { name: 'Motion for Summary Judgment', desc: 'Ask the judge to rule for Aisha without trial.', lose: [['judge', 'Intent is a question of fact for the jury. Denied.']] },
  ],
  oppOpening: [['opp', 'Apex Tech is an equal opportunity employer. Ms. Grant\'s performance declined. The timing is an unfortunate coincidence, nothing more.']],
  opening: [
    { t: 'Aisha had a perfect record until the day she announced her pregnancy. Two weeks later, she was gone.', s: 5 },
    { t: 'Aisha really needs this money for the baby.', s: 0 },
    { t: 'Apex Tech is a terrible place to work.', s: -5 },
  ],
  witnesses: [
    { who: 'craig', side: 'opp', damage: 12, intro: [['opp', 'We call Craig Benson, Engineering Manager.'], ['craig', 'I\'ve always been Aisha\'s biggest supporter. Until she stopped performing.']], testimony: [
      { t: 'Aisha had been struggling for a long time.', contra: ['reviews', 'award'], hit: [['you', 'A long time? You signed **three straight "Exceeds Expectations"** reviews — and she was Engineer of the Quarter in January!'], ['craig', 'Things changed... quickly.', 'sweat']], flag: 'excellent' },
      { t: 'We put her on an improvement plan back in February.', contra: 'pip', hit: [['you', 'That plan\'s metadata shows it was **created on March 10th** — after she told you she was pregnant. You backdated it!'], ['craig', 'I... the system must be wrong.', 'shock']], flag: 'backdated' },
      { t: 'Her pregnancy never came up in any decision.', contra: 'email', hit: [['you', 'Your email to HR: "**With the baby coming she\'ll be checked out. Let\'s find a reason to move on.**"'], ['craig', '...', 'sweat']], flag: 'motive' },
      { t: 'Trevor was simply the most qualified person for the role.', contra: 'resume', hit: [['you', 'Trevor has **one year** of experience and no certification. Aisha had eight years and trained him!'], ['craig', 'Trevor has... great energy.', 'sweat']], flag: 'unqualified' },
    ] },
    { who: 'linda', side: 'opp', damage: 8, intro: [['opp', 'We call Linda Moss, Director of HR.'], ['linda', 'HR follows the rules. Always.']], testimony: [
      { t: 'HR followed our standard termination procedure.', press: [['linda', 'Standard. Mostly. More or less.', 'sweat']] },
      { t: 'Craig never discussed Ms. Grant\'s pregnancy with me.', contra: ['email', 'hr_notes'], hit: [['you', 'Your own notes from March 4th: "**Craig wants Aisha out due to pregnancy. Advised him to document performance first.**"'], ['linda', 'Those notes were private!', 'shock']], flag: 'hr_knew' },
      { t: 'Honestly, I\'m sure she\'d have quit after having the baby anyway.', obj: 'Speculation' },
    ] },
    { who: 'jamal', side: 'own', intro: [['you', 'The plaintiff calls Jamal Price.'], ['jamal', 'Senior engineer. I sat next to Aisha for five years.']], rounds: [
      [{ q: 'What did you overhear Craig say?', k: 'good', needs: 'jamal_ready', r: [['jamal', '"Pregnant? Great, there goes her productivity. I need someone who\'ll actually be here."']] },
       { q: 'Craig is biased against mothers, isn\'t he?', k: 'lead' },
       { q: 'What projects are you working on?', k: 'off' }],
      [{ q: 'How would you describe Aisha\'s work?', k: 'good', r: [['jamal', 'Best engineer on the team. Everyone went to her when things broke.']] },
       { q: 'How is Trevor doing in her old role?', k: 'good', needs: 'trevor', r: [['jamal', 'He still asks Aisha\'s old team how to deploy code. Every week.']] },
       { q: 'You\'d say anything to help a friend, right?', k: 'lead' }],
    ] },
  ],
  closing: [
    { t: 'Aisha\'s reviews were excellent right up to the firing.', needs: 'excellent' },
    { t: 'The "improvement plan" was backdated after the pregnancy news.', needs: 'backdated' },
    { t: 'Craig\'s email shows the pregnancy was the real reason.', needs: 'motive' },
    { t: 'HR knew and helped build a paper trail.', needs: 'hr_knew' },
    { t: 'Her replacement was far less qualified.', needs: 'unqualified' },
    { t: 'All managers are biased, everyone knows that.', bad: true },
  ],
  win: [['client', 'They can\'t do this to the next woman. Not after today.', 'happy']],
  lose: [['client', 'I knew it would be hard. I didn\'t know it would be this hard.', 'sad']],
  deal: [['client', 'A settlement and a reference letter. I can start over. Thank you.']],
},

// ---------------------------------------------------------------- 8
{
  id: 'custody', title: 'For the Kids', kind: 'civil', area: 'Family / Custody', side: 'defense', rank: 3,
  fee: 6000, rep: 100, threshold: 58, jury: false, court: 'Riverside Family Court',
  summary: 'Sam Okafor\'s ex-wife wants sole custody and to move their two kids across the country. Sam wants them to stay. The court will decide what\'s best for the children.',
  people: {
    client: { name: 'Sam Okafor', look: L(4, 'black', 'short', '#2980b9', null) },
    judge: J_WHIT,
    opp: { name: 'Diane Frost', look: L(0, 'white', 'bob', '#2c3e50', '#a8242a'), bg: '#20304a' },
    jenna: { name: 'Jenna Wells', look: L(0, 'blonde', 'long', '#c0392b', null) },
    lyle: { name: 'Dr. Howard Lyle', look: L(1, 'gray', 'short', '#795548', '#15151c', { glasses: true }), pitch: 0.9 },
    teacher: { name: 'Ms. Rosa Gutierrez', look: L(2, 'brown', 'bun', '#f39c12', null) },
    parent: { name: 'Coach Beth', look: L(1, 'red', 'bob', '#27ae60', null) },
    recep: { name: 'Receptionist', look: L(3, 'black', 'bob', '#9b59b6', null) },
  },
  intro: [
    ['narr', 'A father sits in your office, turning a kid\'s soccer whistle over and over in his hands.'],
    ['client', 'Ellie\'s nine. Noah\'s six. Jenna wants to take them to Seattle and leave me with **two weeks a summer**.', 'sad'],
    ['client', 'I\'m not trying to hurt her. I just... I can\'t lose my kids.', 'sad'],
  ],
  interview: [
    { q: 'Tell me about your kids.', a: [['client', 'I coach Ellie\'s soccer team. Noah has a reading tutor — I drive him twice a week. He just hit grade level!', 'happy']], flag: 'tutor' },
    { q: 'Why does Jenna want to move?', a: [['client', 'She says she has a job offer in Seattle. But she\'s **never shown me** any offer letter.']], flag: 'job_hint' },
    { q: 'What does Jenna claim about you?', a: [['client', 'That I\'m "unreliable." That I miss pickups. I\'ve missed ONE in two years — I was in the **ER with Noah\'s broken arm**!', 'angry']], ev: 'er_record' },
    { q: 'How are the kids doing in school?', a: [['client', 'Great. Ms. Gutierrez, Noah\'s teacher, says he\'s blossoming.']], flag: 'teacher' },
  ],
  evidence: {
    petition: { name: 'Custody Petition', icon: 'doc', desc: 'Jenna Wells requests sole custody and relocation to Seattle. Claims Sam is "unreliable and uninvolved."' },
    er_record: { name: 'ER Record', icon: 'medical', desc: 'Noah Okafor, broken arm, treated 3:10–6:40 PM, accompanied by father Sam Okafor — the day of the "missed pickup."' },
    calendar: { name: 'Parenting App Log', icon: 'calendar', desc: 'Shared parenting app: Sam made 187 of 188 scheduled pickups over two years.' },
    report: { name: 'Noah\'s Report Card', icon: 'doc', desc: 'Reading: from 2 grades behind to grade level in one year. Teacher note: "Consistency has been key."' },
    soccer: { name: 'Team Roster', icon: 'doc', desc: 'Riverside Rockets U10 soccer. Head Coach: Sam Okafor. Player #7: Ellie Okafor.' },
    drawing: { name: 'Ellie\'s Drawing', icon: 'drawing', desc: 'Crayon: "My Famly" — Dad, Mom, Ellie, Noah, and the soccer team. Labeled "HOME = RIVERSIDE."' },
    psych: { name: 'Dr. Lyle\'s Billing Log', icon: 'doc', desc: 'One 30-minute session with both children. Paid in full by Jenna Wells.' },
    job: { name: 'Employer\'s Reply', icon: 'email', desc: 'Seattle company HR: "We have no record of an offer to anyone named Jenna Wells."' },
  },
  start: ['petition'],
  locations: [
    { id: 'house', name: 'Sam\'s House', bg: 'house', intro: [['narr', 'Sam\'s house. Cleats by the door, a half-finished puzzle on the table.']], spots: [
      { x: 200, y: 52, prop: 'fridge', label: 'Fridge', text: [['narr', 'Under a magnet: Ellie\'s crayon drawing. "My Famly." Everyone\'s there. At the bottom: **"HOME = RIVERSIDE."**'], ['you', 'Out of the mouths of babes.']], ev: 'drawing' },
      { x: 130, y: 112, prop: 'tablet', label: 'Tablet', text: [['narr', 'The shared parenting app. Pickups over two years: **187 of 188 completed** by Sam.'], ['narr', 'The one miss: the same afternoon as Noah\'s ER visit.']], ev: 'calendar' },
    ] },
    { id: 'school', name: 'Riverside Elementary', bg: 'school', intro: [['narr', 'Riverside Elementary. Tiny chairs, construction-paper suns, the smell of glue.']], spots: [
      { x: 150, y: 100, prop: 'person', look: L(2, 'brown', 'bun', '#f39c12', null), who: 'teacher', label: 'Ms. Rosa Gutierrez', needs: 'teacher', text: [['teacher', 'Noah? He went from two grades behind to **grade level** this year. Sam drives him to tutoring every week.', 'happy'], ['teacher', 'A big move right now could set him back. Here\'s his report card. I\'ll testify if it helps him.']], ev: 'report', flag: 'teacher_ready', alt: [['narr', 'A teacher grades papers at her desk. She gives you a polite but wary smile.']] },
    ] },
    { id: 'field', name: 'Soccer Field', bg: 'park', intro: [['narr', 'Saturday practice. Small children chase a ball like a swarm of bees.']], spots: [
      { x: 260, y: 112, prop: 'goal', label: 'Team board', text: [['narr', 'Riverside Rockets U10 roster, taped to the goalpost. **Head Coach: Sam Okafor.** Player #7: Ellie Okafor.']], ev: 'soccer' },
      { x: 80, y: 110, prop: 'person', look: L(1, 'red', 'bob', '#27ae60', null), who: 'parent', label: 'Coach Beth (Assistant Coach)', text: [['parent', 'Sam\'s at every game and every practice. Jenna? I\'ve seen her maybe twice this season.']], flag: 'parent' },
    ] },
    { id: 'clinic', name: 'Dr. Lyle\'s Clinic', bg: 'hospital', intro: [['narr', 'Dr. Lyle\'s clinic. The waiting room has exactly one toy.']], spots: [
      { x: 150, y: 104, prop: 'person', look: L(3, 'black', 'bob', '#9b59b6', null), who: 'recep', label: 'Receptionist', text: [['recep', 'The Okafor children? Let me check... **One session, thirty minutes.** Paid by Ms. Wells.'], ['recep', 'Oh — that\'s on the billing log. You can have a copy, it\'s already in the court file.']], ev: 'psych' },
    ] },
  ],
  motions: [
    { name: 'Motion to Compel Proof of Employment', desc: 'Make Jenna prove the Seattle job offer exists.', needs: 'job_hint', gives: 'job', bonus: 4, win: [['judge', 'If relocation depends on a job, the job should exist. Granted.']], lose: [['judge', 'On what basis, counsel? Denied.']] },
    { name: 'Appoint a Guardian ad Litem', desc: 'Ask for an independent advocate for the children.', always: true, bonus: 4, win: [['judge', 'An independent voice for Ellie and Noah is a good idea. Granted.']] },
    { name: 'Motion to Limit Expert Testimony', desc: 'Challenge Dr. Lyle\'s qualifications to evaluate the kids.', needs: 'psych', bonus: 5, win: [['judge', 'One thirty-minute session, paid for by one parent? I\'ll give Dr. Lyle\'s opinion very limited weight.']], lose: [['judge', 'You\'ll need a reason to question the doctor, counsel. Denied.']] },
  ],
  offer: { text: 'Jenna offers: she moves to Seattle with the kids; Sam gets two weeks each summer.', better: 'Jenna offers: the kids stay in Riverside for the school year; she gets summers and holidays.' },
  oppOpening: [['opp', 'Your Honor, Ms. Wells has a wonderful opportunity in Seattle. Mr. Okafor, frankly, has not been a reliable parent.']],
  opening: [
    { t: 'Ellie and Noah are thriving in Riverside — at school, on the field, and with their dad. Uprooting them doesn\'t serve them.', s: 5 },
    { t: 'Sam loves his kids more than Jenna does.', s: -2 },
    { t: 'Jenna is a bad mother.', s: -6 },
  ],
  witnesses: [
    { who: 'jenna', side: 'opp', damage: 10, intro: [['opp', 'We call Jenna Wells.'], ['jenna', 'I just want what\'s best for my children.', 'sad']], testimony: [
      { t: 'Sam is unreliable. He constantly misses pickups.', contra: 'calendar', hit: [['you', 'Your own parenting app shows Sam made **187 of 188 pickups** in two years.'], ['jenna', 'Well... "constantly" may be a strong word.', 'sweat']], flag: 'reliable' },
      { t: 'He left the kids stranded at school last spring.', contra: 'er_record', hit: [['you', 'That afternoon, Sam was **in the ER with Noah**, who had a broken arm. You know that.'], ['jenna', '...I forgot.', 'sad']], flag: 'er_day' },
      { t: 'I have a wonderful job waiting for me in Seattle.', contra: 'job', hit: [['you', 'The Seattle company says it has **no record of any offer** to you.'], ['jenna', 'It\'s... not finalized. Exactly.', 'shock']], flag: 'nojob' },
      { t: 'Sam isn\'t involved in their activities at all.', contra: ['soccer', 'report'], hit: [['you', 'He\'s the **head coach** of Ellie\'s soccer team, and he drives Noah to tutoring twice a week.'], ['jenna', '...', 'sweat']], flag: 'involved' },
    ] },
    { who: 'lyle', side: 'opp', damage: 8, intro: [['opp', 'We call Dr. Howard Lyle, child psychologist.'], ['lyle', 'I have evaluated many families in my career.']], testimony: [
      { t: 'I conducted a thorough evaluation of both children.', contra: 'psych', hit: [['you', 'Your billing log shows **one thirty-minute session** — for both kids together — paid for by Ms. Wells.'], ['lyle', 'I am very efficient.', 'sweat']], flag: 'shallow' },
      { t: 'It is my sense the children would prefer to live with their mother.', press: [['lyle', 'Well, they didn\'t SAY that, precisely. It was my impression.']], obj: 'Speculation' },
      { t: 'Moving would have no negative effect on the children.', contra: ['report', 'drawing'], hit: [['you', 'Noah just reached grade level after a year of steady tutoring here. His teacher says **consistency has been key**.'], ['lyle', 'Children are resilient...', 'sweat']], flag: 'stability' },
    ] },
    { who: 'teacher', side: 'own', intro: [['you', 'We call Ms. Rosa Gutierrez.'], ['teacher', 'I teach first grade at Riverside Elementary. Noah is in my class.']], rounds: [
      [{ q: 'How is Noah doing in school?', k: 'good', needs: 'teacher_ready', r: [['teacher', 'He\'s blossoming. He reads at grade level now, thanks to tutoring his dad drives him to every week.']] },
       { q: 'Noah should stay with his father, right?', k: 'lead' },
       { q: 'How big is your class?', k: 'off' }],
      [{ q: 'How involved is Mr. Okafor at school?', k: 'good', r: [['teacher', 'Every conference. Every field trip. He even came in costume for Book Day.']] },
       { q: 'What might a sudden move mean for Noah right now?', k: 'good', needs: 'report', r: [['teacher', 'Honestly? A big setback. He needs consistency right now.']] },
       { q: 'Is Jenna a bad parent?', k: 'lead' }],
    ] },
  ],
  closing: [
    { t: 'Sam made 187 of 188 pickups. He is reliable.', needs: 'reliable' },
    { t: 'There is no confirmed job in Seattle.', needs: 'nojob' },
    { t: 'Sam coaches, tutors, and shows up for his kids.', needs: 'involved' },
    { t: 'Noah\'s progress depends on stability.', needs: 'stability' },
    { t: 'Dr. Lyle met the kids for just 30 minutes.', needs: 'shallow' },
    { t: 'Seattle is way too rainy for children.', bad: true },
  ],
  win: [['judge', 'Primary custody to Mr. Okafor. The children stay in Riverside, with generous time for Ms. Wells. Both of you love these kids — act like it.'], ['client', 'I have to go pick them up. I\'m not going to be late.', 'happy']],
  lose: [['client', 'Two weeks a summer. I\'ll make every single day count.', 'sad']],
  deal: [['client', 'School year here, summers with Jenna. The kids get both of us. That\'s... good.', 'happy']],
},

// ---------------------------------------------------------------- 9
{
  id: 'heater', title: 'Burning Questions', kind: 'civil', area: 'Product Liability', side: 'plaintiff', rank: 4,
  rep: 130, damages: 900000, threshold: 62, jury: true, court: 'Federal District Court',
  summary: 'A Warmly WH-200 space heater burst into flames in the Alvarez home, destroying it and burning Carmen\'s son. Warmly blames "misuse."',
  people: {
    client: { name: 'Carmen Alvarez', look: L(2, 'brown', 'long', '#5d6d7e', null) },
    judge: J_MBEKI,
    opp: { name: 'Sterling Hayes', look: L(0, 'white', 'short', '#0b0b1f', '#8e1b1b'), bg: '#20304a', pitch: 0.85 },
    barrow: { name: 'Dr. Neil Barrow', look: L(0, 'brown', 'short', '#ecf0f1', null, { glasses: true }) },
    lowell: { name: 'Patricia Lowell (CEO)', look: L(1, 'gray', 'bun', '#4a235a', '#c8a028') },
    chief: { name: 'Chief Ken Adebayo', look: L(4, 'gray', 'short', '#c0392b', null) },
    lab: { name: 'Dr. Mia Torres', look: L(2, 'black', 'bun', '#ecf0f1', null, { glasses: true }) },
    whistle: { name: 'Former Warmly Engineer', look: L(1, 'brown', 'curly', '#5d6d7e', null) },
  },
  intro: [
    ['narr', 'A mother arrives with a binder of photographs. Most of them are of ashes.'],
    ['client', 'We lost the house. Everything. And Mateo... he has burns on both arms. He\'s **eight**.', 'sad'],
    ['client', 'Warmly says we "misused" their heater. We followed the manual to the letter.', 'angry'],
  ],
  interview: [
    { q: 'What happened that night?', a: [['client', 'The heater was on low in Mateo\'s room. At 2 AM the smoke alarm went off. The heater was **on fire**.', 'sad']] },
    { q: 'How were you using the heater?', a: [['client', 'Exactly like the manual said. Three feet from everything. Plugged straight into the wall. The manual said it was **safe overnight**.']], flag: 'proper_use' },
    { q: 'Has Warmly contacted you?', a: [['client', 'Two months after the fire they mailed a "voluntary safety notice." Like it was nothing.']], ev: 'notice' },
    { q: 'Have you heard of other fires?', a: [['client', 'There\'s an online group — "Warmly Burned Us." Dozens of families. One of them is a **former Warmly engineer**.']], flag: 'whistle' },
  ],
  evidence: {
    answer: { name: 'Warmly\'s Answer', icon: 'doc', desc: 'Warmly denies any defect and claims the fire was caused by "consumer misuse."' },
    notice: { name: 'Safety Notice', icon: 'letter', desc: 'Warmly "voluntary notice," mailed 2 months after the fire: "Do not leave model WH-200 unattended."' },
    manual: { name: 'Owner\'s Manual', icon: 'doc', desc: 'WH-200 manual, page 2: "Safe for overnight use! Automatic thermal shutoff prevents overheating."' },
    marshal: { name: 'Fire Marshal Report', icon: 'fire', desc: 'Origin: Warmly WH-200 heater. Cause: failure of the internal thermal cutoff switch. No evidence of misuse.' },
    test: { name: 'Lab Test Results', icon: 'chart', desc: 'Independent lab: 7 of 10 WH-200 thermal cutoffs failed to trip at their rated temperature.' },
    complaints: { name: 'Consumer Complaints', icon: 'doc', desc: '41 complaints sent to Warmly about WH-200 overheating — all before the Alvarez fire.' },
    memo: { name: 'Internal Memo', icon: 'email', desc: 'Engineering, 2 years before the fire: "WH-200 cutoff fails testing. Recommend recall. Cost: $14M." CEO reply: "Not in budget. Proceed with sales."' },
    burns: { name: 'Mateo\'s Medical Records', icon: 'medical', desc: 'Second-degree burns on both forearms. Skin grafts required. Ongoing treatment.' },
  },
  start: ['answer'],
  locations: [
    { id: 'house', name: 'The Alvarez House', bg: 'burned', intro: [['narr', 'What\'s left of the Alvarez home. The air still smells like smoke.']], spots: [
      { x: 150, y: 112, prop: 'heater', label: 'Heater remains', text: [['narr', 'The melted shell of the WH-200. It sat three feet from the bed — the scorch marks show exactly where.']], flag: 'melted' },
      { x: 260, y: 120, prop: 'book', label: 'Singed booklet', text: [['narr', 'The heater\'s manual, half burned. Page 2 survives: **"Safe for overnight use! Automatic thermal shutoff prevents overheating."**'], ['you', 'They advertised it as safe to leave on all night.', 'angry']], ev: 'manual' },
    ] },
    { id: 'fire', name: 'Fire Station 4', bg: 'firehouse', intro: [['narr', 'Fire Station 4. A dalmatian eyes you suspiciously.']], spots: [
      { x: 60, y: 96, prop: 'person', look: L(4, 'gray', 'short', '#c0392b', null), who: 'chief', label: 'Chief Ken Adebayo', text: [['chief', 'The Alvarez fire? Burn patterns radiate right out of that heater. The **thermal cutoff switch** failed.'], ['chief', 'No extension cord, no flammables nearby. They did everything right. Here\'s my report.']], ev: 'marshal', flag: 'chief_ready' },
    ] },
    { id: 'lab', name: 'Torres Testing Lab', bg: 'lab', intro: [['narr', 'An independent product-testing lab you hired. Expensive, but worth it.']], spots: [
      { x: 200, y: 104, prop: 'person', look: L(2, 'black', 'bun', '#ecf0f1', null, { glasses: true }), who: 'lab', label: 'Dr. Mia Torres', text: [['lab', 'We bought ten WH-200s off the shelf and tested the cutoff switches.'], ['lab', '**Seven out of ten** failed to trip at the rated temperature. That\'s not bad luck. That\'s a design defect.']], ev: 'test' },
    ] },
    { id: 'lib', name: 'Public Library', bg: 'library', intro: [['narr', 'Public records requests take time. Luckily, consumer complaints are public.']], spots: [
      { x: 150, y: 112, prop: 'computer', label: 'Public computer', text: [['narr', 'The Consumer Product Safety database: **41 complaints** about WH-200 overheating — all before the Alvarez fire.']], ev: 'complaints' },
    ] },
    { id: 'diner', name: 'Rosie\'s Diner', bg: 'diner', intro: [['narr', 'You found the former engineer through the online group. She chose a booth in the back.']], spots: [
      { x: 150, y: 96, prop: 'person', look: L(1, 'brown', 'curly', '#5d6d7e', null), who: 'whistle', label: 'Former Warmly Engineer', needs: 'whistle', text: [['whistle', 'Two years ago my team wrote a **memo**: the WH-200 cutoff fails. Recall it. Fourteen million dollars.'], ['whistle', 'The CEO wrote back three words: "Not in budget." Make them produce the engineering files. It\'s all there.', 'angry']], flag: 'memo_hint', alt: [['narr', 'An empty booth. You\'d need to know who you\'re meeting.']] },
    ] },
  ],
  motions: [
    { name: 'Motion to Compel Engineering Files', desc: 'Force Warmly to produce internal WH-200 test memos.', needs: 'memo_hint', gives: 'memo', bonus: 4, win: [['judge', 'Granted. Warmly will produce all WH-200 cutoff testing documents.']], lose: [['judge', 'Too broad without a basis, counsel. Denied.']] },
    { name: 'Motion in Limine: Exclude "Misuse"', desc: 'Block Warmly\'s misuse theory unless they have evidence.', needs: 'marshal', bonus: 8, win: [['judge', 'The fire marshal found no misuse. Warmly may not argue misuse without evidence. Granted.']], lose: [['judge', 'You need some evidence there was no misuse. Denied.']] },
    { name: 'Motion for Summary Judgment', desc: 'Ask the judge to rule for the Alvarez family now.', lose: [['judge', 'Causation is disputed. This goes to the jury. Denied.']] },
  ],
  oppOpening: [['opp', 'Warmly has sold millions of heaters safely. Tragedies happen — but this one was caused by misuse, not by any defect.']],
  opening: [
    { t: 'Warmly knew its heater was a fire hazard, did the math, and decided the Alvarez family was worth the risk.', s: 6 },
    { t: 'The Alvarez family lost everything they had.', s: 0 },
    { t: 'Space heaters are dangerous — everyone knows that.', s: -6 },
  ],
  witnesses: [
    { who: 'barrow', side: 'opp', damage: 12, intro: [['opp', 'We call Dr. Neil Barrow, Warmly\'s Chief Engineer.'], ['barrow', 'I designed the WH-200 myself.']], testimony: [
      { t: 'The WH-200 passed every safety test we ever ran.', contra: 'memo', hit: [['you', 'Your own team wrote that the cutoff **fails testing** and recommended a recall — two years before this fire.'], ['barrow', 'That memo was... preliminary.', 'sweat']], flag: 'failed_tests' },
      { t: 'The thermal cutoff switch is 100% reliable.', contra: 'test', hit: [['you', 'An independent lab found **7 of 10** cutoffs failed to trip. That\'s 70% failure!'], ['barrow', 'Their methodology—', 'sweat'], ['judge', 'Answer the question, Doctor.']], flag: 'unreliable' },
      { t: 'This fire was clearly caused by consumer misuse.', contra: 'marshal', hit: [['you', 'The fire marshal found **no evidence of misuse** — and identified the failed cutoff switch as the cause.'], ['barrow', '...', 'sweat']], flag: 'no_misuse' },
      { t: 'We received no complaints before this incident.', contra: 'complaints', hit: [['you', 'The federal database shows **41 complaints** about WH-200 overheating — before the Alvarez fire.'], ['barrow', 'I don\'t personally read complaints.', 'sweat']], flag: 'complaints' },
    ] },
    { who: 'lowell', side: 'opp', damage: 10, intro: [['opp', 'We call Patricia Lowell, CEO of Warmly.'], ['lowell', 'Safety is in our DNA.']], testimony: [
      { t: 'Safety is Warmly\'s number one priority.', press: [['lowell', 'It says so in our mission statement. Page one. In bold.']] },
      { t: 'I was never told about any problem with the cutoff switch.', contra: 'memo', hit: [['you', 'The recall memo has **your reply** on it: "Not in budget. Proceed with sales."'], ['lowell', 'I... sign a lot of things.', 'shock'], ['narr', 'The jury murmurs. One juror shakes her head slowly.']], flag: 'ceo_knew' },
      { t: 'Our manual warns customers never to leave the heater on overnight.', contra: 'manual', hit: [['you', 'Your manual says, word for word: "**Safe for overnight use!**"'], ['lowell', 'That\'s... the old manual.', 'sweat']], flag: 'manual' },
      { t: 'The family probably bought a cheap knockoff online.', obj: 'Speculation' },
    ] },
    { who: 'chief', side: 'own', intro: [['you', 'The plaintiff calls Fire Chief Ken Adebayo.'], ['chief', 'Twenty-six years fighting fires.']], rounds: [
      [{ q: 'Chief, where did the fire start?', k: 'good', needs: 'chief_ready', r: [['chief', 'At the WH-200 heater. Burn patterns radiate out from it.']] },
       { q: 'The heater was obviously defective, right?', k: 'lead' },
       { q: 'How long have you been a firefighter?', k: 'off' }],
      [{ q: 'Did you find any evidence of misuse?', k: 'good', needs: 'chief_ready', r: [['chief', 'None. No extension cord, no flammables nearby. It was placed properly.']] },
       { q: 'What failed inside the heater?', k: 'good', needs: 'marshal', r: [['chief', 'The thermal cutoff. It\'s supposed to shut the unit off before it overheats. It never tripped.']] },
       { q: 'Warmly should go out of business, shouldn\'t it?', k: 'lead' }],
    ] },
  ],
  closing: [
    { t: 'Warmly\'s own engineers said the heater failed testing.', needs: 'failed_tests' },
    { t: 'The CEO personally rejected the recall to save money.', needs: 'ceo_knew' },
    { t: 'Seven of ten cutoff switches fail.', needs: 'unreliable' },
    { t: 'The fire marshal found no misuse.', needs: 'no_misuse' },
    { t: 'Warmly ignored 41 complaints before this fire.', needs: 'complaints' },
    { t: 'Warmly told families it was safe overnight.', needs: 'manual' },
  ],
  win: [['narr', 'The jury awards full damages — and Warmly announces a nationwide recall of the WH-200 that afternoon.'], ['client', 'No other mother has to wake up to that alarm. That\'s what matters.', 'happy']],
  lose: [['client', 'So they get to keep selling them. I\'ll keep telling everyone I can.', 'sad']],
  deal: [['client', 'It\'s enough to rebuild. And Mateo\'s treatment is covered. Thank you.', 'happy']],
},

// ---------------------------------------------------------------- 10
{
  id: 'harbor', title: 'The Harbor Light Murder', kind: 'criminal', area: 'Homicide', side: 'defense', rank: 4,
  fee: 15000, rep: 160, threshold: 62, jury: true, court: 'State Superior Court',
  summary: 'Shipping executive Elena Voss is charged with murdering her business partner, Julian Grey, in his harbor office. Her fingerprints are on the murder weapon.',
  people: {
    client: { name: 'Elena Voss', look: L(0, 'red', 'long', '#1a5276', null) },
    judge: J_OAKES,
    opp: { name: 'DA Raymond Sloane', look: L(1, 'gray', 'short', '#1c1c1c', '#7b241c'), bg: '#4a2020', pitch: 0.8 },
    mosley: { name: 'Det. Frank Mosley', look: L(2, 'black', 'short', '#5d4037', '#333333', { beard: true }), pitch: 0.8 },
    finch: { name: 'Gerald Finch', look: L(0, 'brown', 'short', '#626567', '#1e8449', { glasses: true }) },
    lucia: { name: 'Lucia Voss', look: L(0, 'red', 'bob', '#a04000', null) },
    dock: { name: 'Dock Worker', look: L(3, 'black', 'short', '#f39c12', null, { beard: true }), pitch: 0.8 },
    guard: { name: 'Night Guard', look: L(1, 'brown', 'bald', '#1f3a93', null) },
  },
  intro: [
    ['narr', 'Your mentor calls you in. "This is the big one," she says. "Don\'t blink."'],
    ['narr', 'Elena Voss sits in the jail interview room, perfectly composed. Only her hands shake.'],
    ['client', 'They say I killed Julian. My partner. My **friend** of twenty years.', 'sad'],
    ['client', 'I didn\'t. And I think I know who did. But no one will listen.', 'angry'],
  ],
  interview: [
    { q: 'Why are your prints on the weapon?', a: [['client', 'It\'s MY letter opener. A gift from my father. It sat on my desk for ten years — of course my prints are on it.']], flag: 'own_opener' },
    { q: 'Where were you that night?', a: [['client', 'I left at 8:30 and drove across the river to my sister Lucia\'s. I got a **parking ticket** outside her building — 9:40 PM!']], ev: 'ticket' },
    { q: 'What were you and Julian fighting about?', a: [['client', 'Money was missing from the company. Millions. I suspected someone was skimming. Julian said he\'d look into it.']], flag: 'embezzle_hint' },
    { q: 'Who do you think did it?', a: [['client', 'Gerald Finch. Our accountant. He\'s the only one with access to all the accounts. And he\'s been **so** helpful to the police.', 'angry']], flag: 'finch_sus' },
  ],
  evidence: {
    autopsy: { name: 'Autopsy Report', icon: 'medical', desc: 'Time of death: between 9:30 and 10:00 PM. Cause: single stab wound. Weapon: brass letter opener.' },
    prints: { name: 'Fingerprint Report', icon: 'doc', desc: 'Elena Voss\'s prints on the letter opener handle — with an unidentified smudge layered OVER them.' },
    ticket: { name: 'Parking Ticket', icon: 'ticket', desc: 'Issued 9:40 PM on Bridge St., 25 minutes from the harbor. Vehicle: Elena Voss.' },
    keycard: { name: 'Keycard Log', icon: 'chart', desc: 'Building entries: E. Voss exits 8:31 PM. G. Finch badge enters 9:22 PM, exits 9:58 PM.' },
    email: { name: 'Julian\'s Last Email', icon: 'email', desc: 'Julian to Gerald Finch, 9:05 PM: "I found the second ledger. Come to my office tonight and explain, or I call the police."' },
    ledger: { name: 'Hidden Ledger', icon: 'doc', desc: 'A secret second set of books: $2.3 million moved to "Finch Consulting LLC" over 3 years.' },
    gloves: { name: 'Leather Gloves', icon: 'glove', desc: 'Found in a harbor trash can with a small bloodstain. Men\'s size large.' },
    bridge: { name: 'Toll Camera Photo', icon: 'camera', desc: 'Bridge toll camera: Elena\'s car crossing at 9:12 PM — heading AWAY from the harbor.' },
  },
  start: ['autopsy', 'prints'],
  locations: [
    { id: 'office', name: 'Harbor Light Offices', bg: 'corpnight', intro: [['narr', 'Julian Grey\'s office. The police tape is gone, but the chalk is not.']], spots: [
      { x: 150, y: 82, prop: 'computer', label: 'Julian\'s computer', needs: 'embezzle_hint', text: [['narr', 'Julian\'s sent folder. 9:05 PM, the night he died, to Gerald Finch:'], ['narr', '**"I found the second ledger. Come to my office tonight and explain, or I call the police."**'], ['you', 'He summoned his killer.', 'shock']], ev: 'email', alt: [['narr', 'Julian\'s computer. Thousands of files. You need to know what you\'re looking for first.']] },
      { x: 30, y: 98, prop: 'person', look: L(1, 'brown', 'bald', '#1f3a93', null), who: 'guard', label: 'Night Guard', text: [['guard', 'Police never asked for the keycard logs. Can you believe that? Here.'], ['guard', 'Ms. Voss left at 8:31. Mr. Finch badged in at **9:22** and out at **9:58**.']], ev: 'keycard' },
      { x: 260, y: 112, prop: 'trash', label: 'Wastebasket', text: [['narr', 'Shredded paper. One strip survives: "...INCH CONSULTING LL..."']], flag: 'shell_hint' },
    ] },
    { id: 'docks', name: 'Harbor Docks', bg: 'harbor', intro: [['narr', 'The docks at night. The old lighthouse sweeps its beam across black water.']], spots: [
      { x: 60, y: 124, prop: 'trash', label: 'Trash can', text: [['narr', 'Under some fish wrappers: a pair of men\'s **leather gloves**. One has a small, dark stain.'], ['you', 'Large men\'s gloves. Elena wears a women\'s small.']], ev: 'gloves' },
      { x: 200, y: 112, prop: 'person', look: L(3, 'black', 'short', '#f39c12', null, { beard: true }), who: 'dock', label: 'Dock Worker', text: [['dock', 'That night? Saw a guy in a gray suit, glasses, practically running from that building around ten.'], ['dock', 'Tossed something in the trash on his way. Cops never asked me nothin\'.']], flag: 'dockwitness' },
    ] },
    { id: 'shell', name: 'Finch Consulting LLC', bg: 'warehouse', intro: [['narr', 'The address for "Finch Consulting LLC." An empty unit in a storage complex.']], spots: [
      { x: 50, y: 100, prop: 'mailbox', label: 'Mailbox', text: [['narr', 'Overflowing with bank statements for "Finch Consulting LLC." No employees. No office. A **shell company**.']], flag: 'shell' },
      { x: 150, y: 112, prop: 'box', label: 'Storage box', needs: 'shell_hint', text: [['narr', 'A box of files. Inside: a **second set of books** for Harbor Light Shipping.'], ['narr', '$2.3 million, moved to Finch Consulting LLC over three years.'], ['you', 'There\'s the motive.', 'angry']], ev: 'ledger', alt: [['narr', 'Boxes of junk. Without knowing what you\'re after, it\'d take weeks to sort through.']] },
    ] },
    { id: 'bridge', name: 'Bridge Toll Office', bg: 'police', intro: [['narr', 'The bridge authority office. The clerk is surprisingly happy to help.']], spots: [
      { x: 150, y: 100, prop: 'computer', label: 'Toll camera archive', text: [['narr', 'Toll camera, eastbound, 9:12 PM: Elena Voss\'s car, clear as day — heading **away** from the harbor.']], ev: 'bridge' },
    ] },
    { id: 'sister', name: 'Lucia\'s Apartment', bg: 'apartment', intro: [['narr', 'Lucia Voss\'s apartment, across the river.']], spots: [
      { x: 200, y: 92, prop: 'person', look: L(0, 'red', 'bob', '#a04000', null), who: 'lucia', label: 'Lucia Voss', text: [['lucia', 'Elena got here around 9:45, furious about a parking ticket. She stayed the night on my couch.'], ['lucia', 'She kept saying, "Gerald\'s stealing from us. I can feel it."']], flag: 'sister' },
    ] },
  ],
  motions: [
    { name: 'Motion to Compel DNA Testing', desc: 'Have the lab test the bloody gloves from the docks.', needs: 'gloves', bonus: 6, setFlag: 'glove_dna', win: [['judge', 'Granted. The lab will test the gloves.'], ['narr', 'Results, two weeks later: the blood is Julian Grey\'s. The skin cells inside belong to an **unknown male**. Not Elena Voss.']], lose: [['judge', 'What gloves, counsel? Denied.']] },
    { name: 'Motion to Dismiss', desc: 'Ask for dismissal for lack of evidence.', lose: [['judge', 'Her prints are on the weapon. This goes to trial. Denied.']] },
    { name: 'Motion for Change of Venue', desc: 'Argue the press coverage makes a fair jury impossible.', lose: [['judge', 'I\'m confident we can find twelve fair people. Denied.']] },
  ],
  offer: { text: 'Plead guilty to second-degree murder: 20 years in prison.', better: 'Plead guilty to manslaughter: 8 years in prison.' },
  oppOpening: [['opp', 'The defendant fought with the victim over money. Her fingerprints are on the weapon. The evidence will show she is a killer.']],
  opening: [
    { t: 'Elena Voss was across the river when Julian Grey died — and the real killer had every reason to silence him.', s: 6 },
    { t: 'Elena is a respected businesswoman.', s: 0 },
    { t: 'The police botched this investigation, as usual.', s: -5 },
  ],
  witnesses: [
    { who: 'mosley', side: 'opp', damage: 12, intro: [['opp', 'The People call Detective Frank Mosley.'], ['mosley', 'Twenty years in Homicide. This one was open and shut.']], testimony: [
      { t: 'The victim was killed with Ms. Voss\'s letter opener, covered in her prints.', press: [['mosley', 'Well, there was a smudge over the prints, too. Probably nothing.']], contra: 'prints', hit: [['you', 'Your own report shows an **unidentified smudge over her prints**. Someone else held that weapon last!'], ['mosley', 'Could be anyone\'s. Could be nobody\'s.', 'sweat']], flag: 'smudge' },
      { t: 'Ms. Voss had no alibi for the time of death.', contra: ['ticket', 'bridge'], hit: [['you', 'At 9:12 she crossed the bridge **away** from the harbor, and at 9:40 she got a parking ticket 25 minutes away. The murder was between 9:30 and 10!'], ['mosley', 'Tickets can be... wrong.', 'sweat']], flag: 'alibi' },
      { t: 'No one else entered the building that night.', contra: 'keycard', hit: [['you', 'The keycard log shows **Gerald Finch** badged in at 9:22 and out at 9:58. Right in the window!'], ['mosley', 'We... didn\'t pull the keycard logs.', 'shock']], flag: 'finch_entered' },
      { t: 'She had motive. They argued about money all week.', press: [['mosley', 'Something about missing funds. Not my department.']] },
    ] },
    { who: 'finch', side: 'opp', damage: 8, intro: [['opp', 'The People call Gerald Finch, the company\'s accountant.'], ['finch', 'Julian was my dear friend. Anything I can do to help.', 'sad']],
      breakdown: { needs: ['finch_lied', 'embezzled', 'summoned'], bonus: 15, lines: [
        ['you', 'You were stealing. Julian found out. He summoned you that night — and you went.'],
        ['you', 'Your gloves were in the trash. Your badge was on the door. **Your** smudge is over Elena\'s prints.'],
        ['finch', 'I... he was going to call the police. Twenty years of my life, gone. I just wanted him to listen...', 'shock'],
        ['finch', 'I didn\'t mean to... I didn\'t...', 'sad'],
        ['judge', 'Bailiff, please escort Mr. Finch to a holding room. This court will take a short recess.'],
      ] },
      testimony: [
      { t: 'Julian and I were close friends. I\'d never hurt him.', press: [['finch', 'We golfed every Sunday. Well, most Sundays. Some Sundays.', 'sweat']] },
      { t: 'I went home at 6 PM that day and stayed in all night.', contra: 'keycard', hit: [['you', 'Then why does your badge show you **entering at 9:22 PM and leaving at 9:58** — during the murder window?'], ['finch', 'Someone... must have borrowed my badge!', 'sweat']], flag: 'finch_lied' },
      { t: 'The company\'s finances are perfectly clean.', contra: 'ledger', hit: [['you', 'Then explain this second ledger: **$2.3 million** moved to "Finch Consulting LLC." That\'s you, isn\'t it?'], ['finch', 'That is a... a legitimate consulting arrangement!', 'shock']], flag: 'embezzled' },
      { t: 'Julian never contacted me that night.', contra: 'email', hit: [['you', '9:05 PM, from Julian to you: "**I found the second ledger. Come to my office tonight and explain, or I call the police.**"'], ['finch', '...', 'shock']], flag: 'summoned' },
      { t: 'Everyone knows Elena has a terrible temper.', obj: ['Hearsay', 'Improper Character'] },
    ] },
    { who: 'lucia', side: 'own', intro: [['you', 'The defense calls Lucia Voss.'], ['lucia', 'I\'m Elena\'s younger sister.']], rounds: [
      [{ q: 'Where was Elena on the night of the murder?', k: 'good', needs: 'sister', r: [['lucia', 'With me. She arrived around 9:45 and stayed the night.']] },
       { q: 'Elena couldn\'t hurt a fly, could she?', k: 'lead' },
       { q: 'What did you two have for dinner?', k: 'off' }],
      [{ q: 'What did Elena tell you about the company that week?', k: 'good', needs: 'embezzle_hint', r: [['lucia', 'That money was disappearing and she thought Gerald Finch was behind it.']] },
       { q: 'Why was she upset when she arrived?', k: 'good', needs: 'ticket', r: [['lucia', 'She\'d just gotten a parking ticket outside my building. She was livid about it.']] },
       { q: 'You\'d lie for your sister, wouldn\'t you?', k: 'lead' }],
    ] },
  ],
  closing: [
    { t: 'Elena was across the river during the murder.', needs: 'alibi' },
    { t: 'Someone else\'s smudge covers Elena\'s prints.', needs: 'smudge' },
    { t: 'Gerald Finch was in the building during the murder.', needs: 'finch_entered' },
    { t: 'Finch stole $2.3 million, and Julian found out.', needs: 'embezzled' },
    { t: 'Julian summoned Finch to his office that very night.', needs: 'summoned' },
    { t: 'The bloody gloves belong to an unknown man, not Elena.', needs: 'glove_dna' },
  ],
  win: [['client', 'Not guilty. I... thank you. Julian would have liked you.', 'happy'], ['narr', 'Gerald Finch is arrested on the courthouse steps.']],
  lose: [['client', 'Guilty. And he\'s still out there.', 'sad'], ['narr', 'You can file an appeal from the case board.']],
  deal: [['client', 'I took a plea for something I didn\'t do. I\'ll never forgive myself. Or him.', 'sad']],
},
];
