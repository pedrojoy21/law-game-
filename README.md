# Pixel Counsel

A 2D pixel-art lawyer career game. You start as a **Law Clerk** at Steele & Associates and work your way up to **Name Partner** by taking criminal and civil cases all the way through the legal process.

## How to play

There's nothing to install. Open `index.html` in any modern browser (desktop or mobile).

You can also host it on GitHub Pages: go to **Settings → Pages**, pick this branch and the `/ (root)` folder, and open the URL it gives you.

**Controls**
- In the office, move with **WASD** or the **arrow keys**, or click where you want to go. Press **E** (or click an object) to use it.
- Press **Space**, **Enter** or click to advance dialogue. Number keys pick menu options.
- Press **C** during a case to open your case file. Press **Esc** to leave a location.

## Every case runs the full process

1. **Client intake.** Interview your client. Clients hand over evidence and point you to leads, and some clues only make sense after you've asked the right question.
2. **Investigation.** You have a limited number of days. Visit locations and click the sparkling objects and people to collect evidence.
3. **Pretrial motions.** File up to two motions (compel discovery, suppress evidence, spoliation sanctions, summary judgment...). A motion backed by evidence can win you new evidence or strengthen your case. A baseless one irritates the judge.
4. **Plea deal or settlement.** Take the guaranteed outcome, counter-offer (a Negotiation check), or go to trial.
5. **Trial.**
   - *Jury selection:* read the juror backgrounds and strike the ones who might be biased.
   - *Opening statement:* pick the theme of your case.
   - *Cross-examination:* step through the opposing witness's statements. **Press** for details, **Present** evidence that contradicts a lie, or **Object** to hearsay, speculation, irrelevant claims and character attacks.
   - *Direct examination:* ask your own witness open questions. Leading or off-topic questions backfire.
   - *Closing argument:* pick your three strongest points. Only what you actually proved in court lands.
6. **Verdict.** If the jury (or judge) meter ends past the gold line, you win.

## Career

- **Ranks:** Law Clerk → Junior Associate → Associate → Senior Associate → Partner → Name Partner. Each promotion unlocks bigger cases and gives you skill points.
- **Skills** (trained in the Law Library): Investigation, Persuasion, Cross-Examination and Negotiation.
- **Law Library:** answer real law questions (burdens of proof, hearsay, negligence, contracts...) to earn reputation and skill points.
- **Wardrobe:** spend your fees on suits, a research database, a paralegal or an office remodel, and change your look.
- **Appeals:** a lost case can be retried from the Case Board.
- **Small Claims Court:** quick, repeatable cases that are always available.
- Progress saves automatically in your browser.

## The cases

| # | Case | Type | Area of law |
|---|------|------|-------------|
| 1 | The Gem Mart Watch | Criminal defense | Theft |
| 2 | Wet Floor at FreshCo | Civil (plaintiff) | Personal injury / negligence |
| 3 | Cold Comfort | Civil (tenant defense) | Landlord-tenant / habitability |
| 4 | The Midnight Stop | Criminal defense | DUI |
| 5 | Flour Power | Civil (plaintiff) | Breach of contract |
| 6 | Last Call at the Blue Note | Criminal defense | Assault / self-defense |
| 7 | Passed Over | Civil (plaintiff) | Employment discrimination |
| 8 | For the Kids | Civil (parent) | Family law / custody |
| 9 | Burning Questions | Civil (plaintiff) | Product liability |
| 10 | The Harbor Light Murder | Criminal defense | Homicide |

Small claims cases also cover security deposits, property line disputes, consumer repair fraud, unpaid invoices and dog bites.

## Project layout

```
index.html     page shell and UI layers
style.css      UI styling
js/art.js      all pixel art, drawn in code (characters, portraits, scenes, props, icons)
js/engine.js   render loop, input, sound effects, dialogue, menus and panels
js/data.js     ranks, skills, shop, law quiz, jurors, small-claims templates
js/cases.js    the 10 handcrafted cases
js/main.js     office hub, the case pipeline, trial logic and career progression
```

All the art and sound are generated in code, so there are no image or audio files. The game is educational fiction. It isn't legal advice.
