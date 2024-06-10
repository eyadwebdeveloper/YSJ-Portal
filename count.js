let inputTextAreaw1 = document.getElementById("input-textareaw1");
let wordCountw1 = document.getElementById("word-countw1");

let inputTextAreaw2 = document.getElementById("input-textareaw2");
let wordCountw2 = document.getElementById("word-countw2");

let inputTextArear1 = document.getElementById("input-textarear1");
let wordCountr1 = document.getElementById("word-countr1");

let inputTextArear2 = document.getElementById("input-textarear2");
let wordCountr2 = document.getElementById("word-countr2");

let inputTextArear3 = document.getElementById("input-textarear3");
let wordCountr3 = document.getElementById("word-countr3");

document.addEventListener("DOMContentLoaded", function () {
  const topics = [
    "Astronomy",
    "Architecture",
    "Biology",
    "Business",
    "Chemistry",
    "Computer Science",
    "Engineering",
    "Environmental Studies",
    "Mathematics",
    "Neuroscience",
    "Physics",
    "Political Science",
    "Psychology",
  ];

  const checkboxesContainer = document.getElementById("checkboxes-container");

  // Create checkboxes, sliders, and textareas dynamically
  topics.forEach((topic, index) => {
    const checkboxId = `checkbox-${index}`;
    const sliderId = `slider-${index}`;

    // Create checkbox
    const checkboxLabel = document.createElement("label");
    checkboxLabel.classList.add("cl-checkbox");
    checkboxLabel.innerHTML = `
          <input type="checkbox" id="${checkboxId}" class="checkbox">
          <span>${topic}</span>
      `;
    checkboxesContainer.appendChild(checkboxLabel);

    // Create slider container
    const sliderContainer = document.createElement("div");
    sliderContainer.classList.add("slider-container");
    sliderContainer.id = sliderId;
    sliderContainer.innerHTML = `
          <input type="range" min="0" max="10" value="1" class="slider">
          <p>Rate: <span class="slider-value">1</span></p>
      `;
    checkboxesContainer.appendChild(sliderContainer);

    // Set initial state
    const checkbox = document.getElementById(checkboxId);
    const slider = sliderContainer.querySelector(".slider");
    sliderContainer.style.display = checkbox.checked ? "block" : "none";

    // Toggle slider container and textarea visibility based on checkbox state
    checkbox.addEventListener("change", function () {
      sliderContainer.style.display = checkbox.checked ? "block" : "none";
    });

    // Update slider value display
    const output = sliderContainer.querySelector(".slider-value");
    slider.addEventListener("input", function () {
      output.textContent = this.value;
    });
  });
});

inputTextAreaw1.addEventListener("input", () => {
  textAreaWordCount(inputTextAreaw1, "150-200", wordCountw1);
});
inputTextAreaw2.addEventListener("input", () => {
  textAreaWordCount(inputTextAreaw2, "150-300", wordCountw2);
});

inputTextArear1.addEventListener("input", () => {
  textAreaWordCount(inputTextArear1, "200-400", wordCountr1);
});

inputTextArear2.addEventListener("input", () => {
  textAreaWordCount(inputTextArear2, "150-300", wordCountr2);
});

inputTextArear3.addEventListener("input", () => {
  textAreaWordCount(inputTextArear3, "100-200", wordCountr3);
});

function textAreaAdjust(element) {
  element.style.height = "1px";
  element.style.height = 25 + element.scrollHeight + "px";
}

function textAreaWordCount(element, range, wordCounter) {
  let txt = element.value.trim();
  wordCounter.textContent =
    txt.split(/\s+/).filter((item) => item).length + " /" + range;
}
