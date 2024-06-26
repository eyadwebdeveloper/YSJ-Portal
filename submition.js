const db = firebase.firestore();
const auth = firebase.auth(app);
const storage = firebase.storage(app);
let data = {};
let useremail;
let PaperFile;
firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    useremail = user.email;
    listFileNames(useremail);
    try {
      const userRef = db.collection("juniors").doc(useremail);
      const doc = await userRef.get();

      if (doc.exists) {
        const data = doc.data();
        document
          .querySelectorAll(
            "input:not([type=checkbox]):not([type=range]):not([type=file])"
          )
          .forEach((field) => {
            field.value = data[field.name];
          });
        document
          .querySelectorAll("input[type=checkbox]")
          .forEach((_, index) => {
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
            const checkbox = document.getElementById(`checkbox-${index}`);
            const slider = document.getElementById(`slider-${index}`);

            if (
              data["fieldsOfInterest"]
                .map((field) => Object.keys(field)[0])
                .includes(topics[index])
            ) {
              checkbox.click();
              slider.querySelector(".slider-value").innerText = data[
                "fieldsOfInterest"
              ]
                .map((field) => field[topics[index]])
                .filter((ele) => ele)[0];
              slider.querySelector("input").value = data["fieldsOfInterest"]
                .map((field) => field[topics[index]])
                .filter((ele) => ele)[0];
            }
          });

        document.querySelectorAll("select").forEach((select) => {
          select.value = data[select.name];
        });
        document.querySelectorAll("textarea").forEach((select) => {
          select.value = data[select.name];
        });
        textAreaWordCount(inputTextAreaw1, "200-400", wordCountw1);
        textAreaWordCount(inputTextAreaw2, "150-300", wordCountw2);
        textAreaWordCount(inputTextArear1, "200-400", wordCountr1);
        textAreaWordCount(inputTextArear2, "150-300", wordCountr2);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log("Error getting document:", error);
    }
  } else {
    giveAlert("No user is signed in.", "#e43956", " ");
    location.href = LoginURL;
  }
});

document
  .querySelector(".saveProgress")
  .addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      await giveAlert("Saving progress", "#e43956", " ", true, saveProgress);
      giveAlert("Progress Saved", "#e43956", " ");
    } catch {
      giveAlert("Unable to save progress", "#e43956", " ");
    }
  });
async function saveProgress(body, overlayer, resolve, reject) {
  const formData = new FormData(document.forms[0]);
  formData.forEach((value, key) => {
    data[key] = value;
  });
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
  const checkedTopics = [];
  for (let i = 0; i < topics.length; i++) {
    const checkboxId = `checkbox-${i}`;
    const sliderId = `slider-${i}`;
    const checkbox = document.getElementById(checkboxId);
    const slider = document
      .getElementById(sliderId)
      .querySelector(".slider-value");
    // Only include checked checkboxes with corresponding sliders
    if (checkbox.checked && slider) {
      const topic = topics[i];
      const value = slider.innerText;
      checkedTopics.push({ [topic]: value });
    }
  }
  data["fieldsOfInterest"] = checkedTopics;

  try {
    if (PaperFile) {
      data = { ...data, ...(await uploadFile(PaperFile)), email: useremail };
    }
    const userRef = db.collection("juniors").doc(useremail);
    await userRef.set(data, { merge: true });
    resolve();
    body.remove();
    overlayer.remove();
    return data;
  } catch (error) {
    console.error("Error getting document:", error);
  }
}
function checkWordLimit(words, min, max) {
  return words.split(" ").length > min && words.split(" ").length <= max;
}
document.getElementById("submit").addEventListener("click", async (event) => {
  event.preventDefault();
  let isvalid = true;
  let count = 1;
  const formData = new FormData(document.forms[0]);
  formData.forEach(async (value, key) => {
    if (
      !value &&
      key !== "Field Grade" &&
      key !== "Additions"
    ) {
      if (count) {
        count--;
        giveAlert("Please enter a valid " + key, "#e43956", " ");
        isvalid = false;
      }
    } else if (
      key === "Birthday" &&
      !/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(value)
    ) {
      if (count) {
        count--;
        giveAlert("Please enter a valid " + key, "#e43956", " ");
        isvalid = false;
      }
    } else if (key === "The First Essay" && !checkWordLimit(value, 200, 400)) {
      if (count) {
        count--;
        giveAlert(
          "Please enter " + key + " within the word limit",
          "#e43956",
          " "
        );
        isvalid = false;
      }
    } else if (key === "The Second Essay" && !checkWordLimit(value, 100, 250)) {
      if (count) {
        count--;
        giveAlert(
          "Please enter " + key + " within the word limit",
          "#e43956",
          " "
        );
        isvalid = false;
      }
    } else if (key === "The Third Essay" && !checkWordLimit(value, 100, 250)) {
      if (count) {
        count--;
        giveAlert(
          "Please enter " + key + " within the word limit",
          "#e43956",
          " "
        );
        isvalid = false;
      }
    } else if (key === "The Fourth Essay" && !checkWordLimit(value, 200, 400)) {
      if (count) {
        count--;
        giveAlert(
          "Please enter " + key + " within the word limit",
          "#e43956",
          " "
        );
        isvalid = false;
      }
    }
  });

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

  const checkedTopics = [];
  const sliderValues = [];

  // Loop through each checkbox and slider
  for (let i = 0; i < topics.length; i++) {
    const checkboxId = `checkbox-${i}`;
    const sliderId = `slider-${i}`;

    const checkbox = document.getElementById(checkboxId);
    const slider = document
      .getElementById(sliderId)
      .querySelector(".slider-value");

    // Only include checked checkboxes with corresponding sliders
    if (checkbox.checked && slider) {
      const topic = topics[i];
      const value = slider.innerText;

      checkedTopics.push(topic);
      sliderValues.push(value);
    }
  }

  if (!checkedTopics.length) {
    await giveAlert("Please enter your fields of interest", "#e43956", " ");
    isvalid = false;
  }
  if (isvalid) {
    await giveAlert(
      "Are you sure you want to submit this application?",
      "#e43956",
      " ",
      false,
      () => {},
      true
    );
    const secret_id = uid();
    await giveAlert(
      "Submitting Your Application",
      "#e43956",
      " ",
      true,
      saveProgress
    ).then(submitGoogleForm(secret_id));
    const userRef = db.collection("juniors").doc(useremail);
    await userRef.set(
      { submitted: true, secret_id: secret_id },
      { merge: true }
    );
    await giveAlert(" Your Application is now submitted", "#e43956", " ");
    location.href = domain + "/status.html";
  }
});
const uid = function () {
  return (
    Date.now().toString(36) +
    (Math.random() ** Math.random()).toString(36).substr(2)
  );
};
// Function to submit the form
async function submitGoogleForm(secret_id) {
  // Form URL (action URL)
  const paper = await db.collection("juniors").doc(useremail).get();
  data["PaperUrl"] = paper.data().PaperUrl;

  const form2URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSdxMjwGQUvXS2D4-yCGXcSphvQfN5MczHkqYkL1gTwWTCcTwA/formResponse";
  const form2Data = new URLSearchParams();
  form2Data.append("entry.31478216", data["Gender"]); // Gender
  form2Data.append("entry.1375354379", data["Birthday"]); // Date of Birth
  form2Data.append("entry.84534494", data["Grade"]); // Grade Year
  form2Data.append("entry.868537336", data["Nationality"]); // Country of Nationality
  form2Data.append(
    "entry.864427989",
    data["fieldsOfInterest"]
      .map((field) => Object.entries(field))
      .flat()
      .join(" ")
  );
  form2Data.append("entry.429979606", data["GPA"]); // GPA
  form2Data.append("entry.85609365", data["Field Grade"]); // Field Grade
  form2Data.append("entry.1643765406", data["The First Essay"]); // Qualification
  form2Data.append("entry.1111295977", data["The Second Essay"]); // Unfamiliar Achievement
  form2Data.append("entry.1053895173", data["The Third Essay"]); // Mentorship Analysis
  form2Data.append("entry.290029710", data["The Fourth Essay"]); // Research Background
  form2Data.append("entry.1316712035", data["The Fifth Essay"]); // Communication
  form2Data.append("entry.392665132", data["PaperUrl"]); // Paper URL
  form2Data.append("entry.161671813", data["Availability"]); // Time commitment
  form2Data.append("entry.1953658492", data["Time Blocks"]); // Time blocks
  form2Data.append("entry.1526778532", data["how did this portal reach you"]); // How did this portal reach you
  form2Data.append("entry.809209439", data["Other"]); // Other
  form2Data.append("entry.508656515", data["Ambassador"]); // Ambassador
  form2Data.append("entry.345148640", data["Additions"]); // Additional Info
  form2Data.append("entry.681681029", secret_id); // Secret Id

  const form1Url =
    "https://docs.google.com/forms/d/e/1FAIpQLSfo5yvbge92ygJXwTQDiUfus3tSf3_p0ZZsOF8hKUd9pPNizA/formResponse";
  // Form data
  const form1Data = new URLSearchParams();
  form1Data.append("entry.1996114666", useremail); // Personal Email Address
  form1Data.append("entry.1861549469", data["Full Name"]); // Full Name
  form1Data.append("entry.1397348289", data["Phone Number"]); // Phone Number
  form1Data.append("entry.2064603247", data["Gender"]); // Gender
  form1Data.append("entry.1665944602", data["Birthday"]); // Date of Birth
  form1Data.append("entry.1095177893", data["Institution"]); // Institution
  form1Data.append("entry.1381235580", data["Grade"]); // Grade Year
  form1Data.append("entry.994176466", data["Nationality"]); // Country of Nationality
  form1Data.append(
    "entry.1119161873",
    data["fieldsOfInterest"]
      .map((field) => Object.entries(field))
      .flat()
      .join(" ")
  ); // Fields of Interest
  form1Data.append("entry.716018883", data["GPA"]); // GPA
  form1Data.append("entry.610012888", data["Field Grade"]); // Field Grade
  form1Data.append("entry.1015962206", data["The First Essay"]); // Qualification
  form1Data.append("entry.1382926679", data["The Second Essay"]); // Unfamiliar Achievement
  form1Data.append("entry.1650730143", data["The Third Essay"]); // Mentorship Analysis
  form1Data.append("entry.2126446586", data["The Fourth Essay"]); // Research Background
  form1Data.append("entry.292796388", data["The Fifth Essay"]); // Communication
  form1Data.append("entry.566376328", data["PaperUrl"]); // Paper URL
  form1Data.append("entry.1430288577", data["Availability"]); // Time commitment
  form1Data.append("entry.609641186", data["Time Blocks"]); // Time blocks
  form1Data.append("entry.1986455620", data["how did this portal reach you"]); // How did this portal reach you
  form1Data.append("entry.1328718830", data["Other"]); // Other
  form1Data.append("entry.646076180", data["Ambassador"]); // Ambassador
  form1Data.append("entry.398764479", data["Additions"]); // Additional Info
  form1Data.append("entry.505529661", secret_id); // Additional Info
  try {
    const response2 = await fetch(form2URL, {
      method: "POST",
      body: form2Data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response2.ok) {
      console.log("Form submitted successfully!");
    } else {
      console.error("Form submission failed:", response2.statusText);
    }
  } catch (error) {
    console.error("Error submitting form:", error);
  }
  try {
    const response1 = await fetch(form1Url, {
      method: "POST",
      body: form1Data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response1.ok) {
      console.log("Form submitted successfully!");
    } else {
      console.error("Form submission failed:", response1.statusText);
    }
  } catch (error) {
    console.error("Error submitting form:", error);
  }
}

// Call the function to submit the form

const fileInput = document.getElementById("pdf");
async function listFileNames(useremail) {
  const folderRef = storage.ref().child(useremail);
  try {
    const res = await folderRef.listAll();
    if (res.items.length) {
      displayFile(res.items[0].name);
    }
  } catch (error) {
    giveAlert(error.message);
  }
}
var currentFileName = null;
fileInput.addEventListener("change", function (event) {
  if (event.target.files.length) {
    PaperFile = event.target.files[0];
    displayFile(event.target.files[0].name);
  }
});
function displayFile(file) {
  document.querySelector("div.file-upload #filedisplay").innerText = file;
}

async function deleteFolder(folderPath) {
  const folderRef = storage.ref().child(folderPath);
  try {
    const res = await folderRef.listAll();
    const deletePromises = res.items.map((itemRef) => {
      return itemRef.delete().catch((error) => {
        giveAlert(error.message);
      });
    });
    await Promise.all(deletePromises);
  } catch (error) {
    giveAlert(error.message);
  }
}
async function uploadFile(file) {
  await deleteFolder(useremail);
  const fileRef = storage.ref(useremail + "/" + file.name);
  let functionReturnValue;
  await fileRef
    .put(file)
    .then((snapshot) => {
      return snapshot.ref.getDownloadURL();
    })
    .then((downloadURL) => {
      functionReturnValue = { PaperName: file.name, PaperUrl: downloadURL };
    })
    .catch((error) => {
      console.error("Error uploading file:", error);
    });
  return functionReturnValue;
}

document
  .querySelector("div.file-upload button")
  .addEventListener("click", (e) => {
    e.preventDefault();
    fileInput.click();
  });

//     console.log("Checked topics:", checkedTopics); // Debug: Log checked topics
//     console.log("Slider values:", sliderValues); // Debug: Log slider values
//     // Store checked topics and slider values in the data object
//     Object.keys(checkedTopics).forEach((topic) => {
//       if (typeof checkedTopics[topic] === "undefined") {
//         delete checkedTopics[topic];
//       }
//     });
//     data["checkedTopics"] = checkedTopics;
//     data["sliderValues"] = sliderValues;

//     console.log("Form data:", data); // Debug: Log form data
//     // Store the form data including the download URL in Firestore
//     const userRef = db.collection("juniors").doc(data.name);
//     await userRef.set(data);

//     window.location.href = "portal_submitted.html";
//   } catch (error) {
//     console.error("Error submitting form:", error);
//   }
// });
