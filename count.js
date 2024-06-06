let inputTextAreaw1 = document.getElementById("input-textareaw1");
let wordCountw1 = document.getElementById("word-countw1");

let inputTextAreaw2 = document.getElementById("input-textareaw2");
let wordCountw2 = document.getElementById("word-countw2");

let inputTextArear1 = document.getElementById("input-textarear1");
let wordCountr1 = document.getElementById("word-countr1")

let inputTextArear2 = document.getElementById("input-textarear2");
let wordCountr2 = document.getElementById("word-countr2")

let inputTextArear3 = document.getElementById("input-textarear3");
let wordCountr3 = document.getElementById("word-countr3");

inputTextAreaw1.addEventListener("input", () => {
  let txt = inputTextAreaw1.value.trim();
  wordCountw1.textContent = txt.split(/\s+/).filter((item) => item).length + ' /150';
});

inputTextAreaw2.addEventListener("input", () => {
  let txt = inputTextAreaw2.value.trim();
  wordCountw2.textContent = txt.split(/\s+/).filter((item) => item).length + ' /300';
});

inputTextArear1.addEventListener("input", () => {
  let txt = inputTextArear1.value.trim();
  wordCountr1.textContent =
    txt.split(/\s+/).filter((item) => item).length + " /200-400";
});

inputTextArear2.addEventListener("input", () => {
  let txt = inputTextArear2.value.trim();
  wordCountr2.textContent =
    txt.split(/\s+/).filter((item) => item).length + " /150-300";
});

inputTextArear3.addEventListener("input", () => {
  let txt = inputTextArear3.value.trim();
  wordCountr3.textContent =
    txt.split(/\s+/).filter((item) => item).length + " /100-200";
});

function textAreaAdjust(element) {
    element.style.height = "1px";
    element.style.height = (25+element.scrollHeight)+"px";
    }
