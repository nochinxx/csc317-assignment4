Responsiveness & sizing

I use CSS variables for button size (--button-wh) and typography, and adjust them with media queries.

I use clamp(min, preferred, max) to bound font sizes so text scales fluidly without becoming too small or too large.

On phones, buttons scale from viewport width (--button-wh: min(22vw, 92px)) so they’re easy to tap; on larger screens I cap sizes to keep the layout tidy.

I added a special height-aware rule for short displays (e.g., Nest Hub) so the calculator always fits without scrolling.

Interaction model

The calculator supports chained operations (more than one operation before pressing =) because that’s more practical for quick calculations.

I implemented a +/− toggle that wraps the last number as (-n) and unwraps on toggle again. This makes sign changes explicit and avoids ambiguity with operator precedence.

% only converts to *.01 when it follows a number or ), not another operator. This prevents malformed expressions like +%.

Error handling

Divide by zero returns Error instead of 0 as in the Iphonce calculator. This is more mathematically honest and avoids implying a defined value where there isn’t one.

If evaluation produces NaN, Infinity, or undefined, I return Error.

Accessibility/Usability

Buttons are large on touch devices and have hover/active feedback.

The display uses a high-contrast background with right-aligned, large text for readability.

Implementation details

I normalized display symbols to JS operators (÷ → /, × → *) before evaluation.

I replaced repeated HTML id attributes with classes (e.g., r1, c4, and row) because IDs must be unique to pass validation. The styling and behavior remain the same; only the selector type changed.

I sanitize the percent substitution with a lookbehind so % only applies after a number/).

Styling choices

Colors are defined as CSS variables for consistency (dark background, light numeric buttons, orange operators).

For the result text size, I chose visually pleasing values using clamp and viewport units; there isn’t a standard set for calculator displays, so I tuned it by eye across device sizes.