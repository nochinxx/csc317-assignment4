document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll('input[type="button"]');
  const resultElement = document.getElementById("result");
  let evaluated = false; // global variable to make sure that after an expression is evaluated we clear the calculator
  console.log("Result Element:", resultElement);

  // Helper to handle the toggle +/-
  function toggleSign(expression) {
    if (!expression) return "0";

    // Keep '%' output of the token we toggle
    let hadPercent = false;
    if (expression.endsWith("%")) {
      hadPercent = true;
      expression = expression.slice(0, -1);
    }

    let end = expression.length - 1;

    // If the expression ends with "(-number)"
    if (expression[end] === ")") {
      // Walk left over the digits/decimal
      let j = end - 1;
      // used Ai to research regex for digit and decimal check (gpt-5)
      while (j >= 0 && /[0-9.]/.test(expression[j])) j--;
      const numStart = j + 1;

      // Check for "(-" immediately before the number and an operator (or start) before "("
      if (
        expression[numStart - 1] === "-" &&
        expression[numStart - 2] === "("
      ) {
        const prev = numStart - 3 >= 0 ? expression[numStart - 3] : null;
        // used ai to research regex for operator check (gpt-5)
        if (prev === null || /[+\-×÷*/]/.test(prev)) {
          // unwrap: "...(-123)" -> "...123"
          const output =
            expression.slice(0, numStart - 2) + expression.slice(numStart, end);
          return hadPercent ? output + "%" : output;
        }
      }
    }

    // Not wrapped: find the last number token
    let i = end;
    while (i >= 0 && /[0-9.]/.test(expression[i])) i--;
    const start = i + 1;
    const number = expression.slice(start, end + 1);
    // ternary to handle empty number case
    if (!number) return hadPercent ? expression + "%" : expression;

    // If there's a unary minus directly before the number, remove it (…+-123 -> …+123)
    let hasUnaryMinus = false;
    if (start > 0 && expression[start - 1] === "-") {
      const prev = start - 2 >= 0 ? expression[start - 2] : null;
      if (prev === null || /[+\-×÷*/]/.test(prev)) hasUnaryMinus = true;
    }

    let output;
    if (hasUnaryMinus) {
      output =
        expression.slice(0, start - 1) + number + expression.slice(end + 1);
    } else {
      // Wrap positive: "...123" -> "...(-123)"
      output =
        expression.slice(0, start) +
        "(-" +
        number +
        ")" +
        expression.slice(end + 1);
    }

    return hadPercent ? output + "%" : output;
  }

  // Function to update the display
  let display = (value) => {
    if (resultElement) {
      console.log("Current Result:", value);
      console.log("Evaluated: ", evaluated);
      if (evaluated) {
        resultElement.value = "0";
        evaluated = false;
      }
      // Clear all
      if (value == "AC") {
        resultElement.value = "0";
        return;
      }
      // Delete last char
      if (value == "⌫") {
        console.log("Delete Last Character");
        if (resultElement.value.length > 1) {
          // Pop the last char
          resultElement.value = resultElement.value.slice(0, -1);
          return;
        }
        // If only one char left, reset to 0
        else if (resultElement.value.length <= 1) {
          resultElement.value = "0";
          return;
        }
      }
      // Toggle +/-
      if (value == "+/-") {
        resultElement.value = toggleSign(resultElement.value);
        return;
      }
      // Evaluate expression
      if (value == "=") {
        console.log("Evaluate Expression");
        let result = evaluateExpression(resultElement.value);
        console.log("Evaluation Result:", result);
        resultElement.value = result;
        return;
      }
      resultElement.value == "0"
        ? (resultElement.value = value)
        : (resultElement.value += value);
      //   console.log("Updated Result:", resultElement.value);
    }
  };

  // Function to evaluate the expression
  let evaluateExpression = (expression) => {
    try {
      if (!expression) return "0";
      // division and percentage handling
      //Replace division symbol
      let sanitizedExpression = expression.replace(/÷/g, "/");

      // Safely replace % only when preceded by a number or ')'
      // used Ai to research lookbehind regex (gpt-5)
      sanitizedExpression = sanitizedExpression.replace(
        /(?<=\d|\))%/g,
        " *.01"
      );
      console.log("Sanitized Expressionnn:", sanitizedExpression);
      const result = eval(sanitizedExpression);
      // Check for invalid results
      if( result === undefined || isNaN(result) || !isFinite(result)) {
        return "Error";
      }
      evaluated = true;
      return result;
    } catch (error) {
      console.error("Error evaluating expression:", error);
      return "Error";
    }
  };
  // Add event listeners to all buttons and pass their value to display function
  buttons.forEach((button) => {
    button.addEventListener("click", () => display(button.value));
  });

  // Add keydown event listener for keyboard input
  document.addEventListener("keydown", (event) => {
    const key = event.key;
    // Allow only valid keys (numbers, operators, etc.)
    if (
      (key >= "0" && key <= "9") || // Numbers
      ["+", "-", "*", "/", ".", "=", "%", "Enter", "Backspace"].includes(key)
    ) {
      if (key === "Enter" || key === "=") {
        result = evaluateExpression(resultElement.value);
        resultElement.value = result;
        console.log("Evaluation Result:", result);
      } else if (key === "Backspace") {
        display("⌫"); // Map Backspace key to "⌫"
      } else if (key === "/") {
        display("÷");
      } else {
        display(key); // Pass the key directly
      }
    }
  });
});
