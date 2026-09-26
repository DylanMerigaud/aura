# Tech Europe AI Gaming Hack, submission form read verbatim 2026-09-26

Source: https://hackathons.techeurope.io/dashboard/hackathons/tech-europe-ai-gaming-hack, the
"Submit your project" button on that dashboard page opens the form as a modal (no separate URL).
Read only, nothing submitted, Cancel was used to close it.

The form is open now: deadline 26 Sept 2026, 19:00 CEST, about 5 hours left at read time.

## Page context around the form

- Team: "Itchy & Scratchy", 2 of 5 members, Dylan Merigaud is captain
  (dylanmerigaud.pro@gmail.com), Dorian Poupard is the other member (d.poupard.d@gmail.com)
- Invite code: G28FMJ
- Track: "Build a Game by Voodoo"
- Partners: Cognition, Google DeepMind, Gradium, Voodoo
- Event window: 26 Sept 2026, 09:30 to 21:30 CEST. Schedule: 09:30 doors open and networking,
  10:00 opening and matchmaking, 13:00 lunch, 19:00 competition opt in deadline and dinner
  (also the submission deadline), 20:00 live demos, 20:30 award ceremony
- Banner right above the form: "On-site? Check in at the registration desk when you arrive, your
  captain needs to be checked in to submit." Dylan is the captain, so his own check in at the
  desk is what unlocks the submit gesture, not just filling the form.

## Fields, in order

1. **Team Code**: G28FMJ, read only, shown for reference.
2. **What are you building?**: textarea, 4 visible rows, resizable, no placeholder text, no
   character limit found in the markup, no name attribute (React controlled field). Required (the
   Submit button stays disabled while empty).
3. **Which track are you competing on?**: radio group, one option currently, "Build a Game",
   unchecked by default. Required.
4. **Which partner technologies did you use? (optional)**: 3 checkboxes, none checked by default.
   Cognition, Google DeepMind, Gradium. Optional.
5. **Which side challenges do you want to participate in? (optional)**: 1 checkbox, unchecked by
   default. Cognition. Optional. No Devin checkbox or Devin mention anywhere in this modal, on
   this page, or in the partner list (Cognition, Google DeepMind, Gradium, Voodoo); there is
   nothing to confirm for Devin as things stand.
6. **GitHub Repo (must be public)**: text input, placeholder "github.com/your/repo". Required.
7. **Hosted Version of the Game (link)**: text input, placeholder "any link". Required. This is
   the field for the itch.io page link (or any other hosted build), there is no field named
   "itch.io" specifically, just this generic hosted link.

No video field, no screenshot upload field, no separate description length counter anywhere in
the modal (scrollHeight equals clientHeight, nothing hidden below the buttons).

## Buttons

- **Submit project**: disabled while the required fields above are empty (confirmed live:
  `disabled: true` with the form blank).
- **Cancel**: closes the modal, used to back out of this read with nothing sent.

## Raw field order (no stable name/id attributes, everything is a React controlled input)

textarea (build description), radio "tracks" (Build a Game), checkbox x3 (partner tech: Cognition,
Google DeepMind, Gradium), checkbox x1 (side challenge: Cognition), text input (GitHub repo, must
be public), text input (hosted link).
