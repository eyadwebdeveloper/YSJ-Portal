let inputTextAreaw1 = document.getElementById("input-textareaw1");
let wordCountw1 = document.getElementById("word-countw1");

let inputTextAreaw2 = document.getElementById("input-textareaw2");
let wordCountw2 = document.getElementById("word-countw2");


inputTextAreaw1.addEventListener("input", () => {
  let txt = inputTextAreaw1.value.trim();
  wordCountw1.textContent = txt.split(/\s+/).filter((item) => item).length + ' /150';
});

inputTextAreaw2.addEventListener("input", () => {
  let txt = inputTextAreaw2.value.trim();
  wordCountw2.textContent = txt.split(/\s+/).filter((item) => item).length + ' /300';
});

if(wordCountw1.textContent < 150){
  wordCountw1.style.color = red;
}

function textAreaAdjust(element) {
    element.style.height = "1px";
    element.style.height = (25+element.scrollHeight)+"px";
    }
