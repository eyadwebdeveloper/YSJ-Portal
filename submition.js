const db = firebase.firestore();
const auth = firebase.auth(app);
const storage = firebase.storage(app);
const data = {};
let useremail;
let PaperFile;
firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    useremail = user.email;
    listFileNames(useremail);
    try {
      const userRef = db.collection("users").doc(useremail);
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
  let data = {};
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
      data = { ...data, ...(await uploadFile(PaperFile)) };
    }
    const userRef = db.collection("users").doc(useremail);
    await userRef.set(data, { merge: true });
    resolve();
    body.remove();
    overlayer.remove();
  } catch (error) {
    console.error("Error getting document:", error);
  }
}
async function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  const storageRef = storage.ref("uploads/" + useremail);
  try {
    await giveAlert("Uploading Your File", "#e43956", " ", true, UploadFile);
    async function UploadFile(body, overlayer, resolve) {
      try {
        const snapshot = await storageRef.put(file);
        const downloadURL = await snapshot.ref.getDownloadURL();
        document.getElementById("downloadURL").value = downloadURL;
      } catch {
        giveAlert(
          "An Error Occurred While Uploading Your File",
          "#e43956",
          " "
        );
      }
      resolve();
      body.remove();
      overlayer.remove();
    }
  } catch (error) {
    console.error("Error uploading file:", error);
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
      key !== "downloadURL" &&
      key !== "Other" &&
      key !== "Ambassador" &&
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
    } else if (key === "The First Essay" && !checkWordLimit(value, 150, 200)) {
      if (count) {
        count--;
        giveAlert(
          "Please enter " + key + " within the word limit",
          "#e43956",
          " "
        );
        isvalid = false;
      }
    } else if (key === "The Second Essay" && !checkWordLimit(value, 150, 300)) {
      if (count) {
        count--;
        giveAlert(
          "Please enter " + key + " within the word limit",
          "#e43956",
          " "
        );
        isvalid = false;
      }
    } else if (key === "The Third Essay" && !checkWordLimit(value, 200, 400)) {
      if (count) {
        count--;
        giveAlert(
          "Please enter " + key + " within the word limit",
          "#e43956",
          " "
        );
        isvalid = false;
      }
    } else if (key === "The Fourth Essay" && !checkWordLimit(value, 150, 300)) {
      if (count) {
        count--;
        giveAlert(
          "Please enter " + key + " within the word limit",
          "#e43956",
          " "
        );
        isvalid = false;
      }
    } else if (key === "The Fifth Essay" && !checkWordLimit(value, 100, 200)) {
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
    await giveAlert(
      "Submitting Your Application",
      "#e43956",
      " ",
      true,
      saveProgress
    );
    // submitGoogleForm(data);
    const userRef = db.collection("users").doc(useremail);
    await userRef.set({ submitted: true, secret_id: uid() }, { merge: true });
    await giveAlert(" Your Application is now submitted", "#e43956", " ");
    location.href = domain + "/status.html";
  }
});
const uid = function () {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
// Function to submit the form
async function submitGoogleForm(data) {
  // Form URL (action URL)
  const formUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLScx22hzWiCXswH0YszYxjrIdWKPbG3Ql9hVGcdOdcayg_nZKQ/formResponse";

  // Form data
  console.log(data);

  const formData = new URLSearchParams();
  formData.append("entry.1227768184", data.email); // Personal Email Address
  formData.append("entry.1129145430", "John Doe"); // Full Name
  formData.append("entry.465321940", "123-456-7890"); // Phone Number
  formData.append("entry.1913890174", "Male"); // Gender
  formData.append("entry.1504118737", "01/01/1990"); // Date of Birth
  formData.append("entry.1724730552", "Example Institution"); // Institution
  formData.append("entry.1198287875", "Sophomore"); // Grade Year
  formData.append("entry.1128845160", "USA"); // Country of Nationality
  formData.append("entry.892981149", "Computer Science, Mathematics"); // Fields of Interest
  formData.append("entry.732946676", "4.0"); // GPA
  formData.append("entry.1751678190", "A"); // Field Grade
  formData.append("entry.1649879170", "Example qualification..."); // Qualification
  formData.append("entry.1942324246", "Example achievement..."); // Unfamiliar Achievement
  formData.append("entry.1524507595", "Example mentorship analysis..."); // Mentorship Analysis
  formData.append("entry.25080122", "Research background..."); // Research Background
  formData.append("entry.268433779", "Effective communication..."); // Communication
  formData.append("entry.592898438", "http://example.com/paper"); // Paper URL
  formData.append("entry.520574173", "20"); // Time commitment
  formData.append("entry.268327327", "June: 9am-5pm; July: 10am-6pm;..."); // Time blocks
  formData.append("entry.1775075619", "Friend"); // How did this portal reach you
  formData.append("entry.367863443", "Other response"); // Other
  formData.append("entry.578921601", "Ambassador"); // Ambassador
  formData.append("entry.92442692", "Additional info..."); // Additional Info

  // Submit the form
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
  //   if (!file) {
  //     giveAlert("No file selected");
  //     return;
  //   }
  await deleteFolder(useremail);
  const fileRef = storage.ref(useremail + "/" + file.name);
  let functionReturnValue;
  await fileRef
    .put(file)
    .then((snapshot) => {
      return snapshot.ref.getDownloadURL();
    })
    .then((downloadURL) => {
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      functionReturnValue = { PaperName: file.name, PaperUrl: downloadURL };
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
//     const userRef = db.collection("users").doc(data.name);
//     await userRef.set(data);

//     window.location.href = "portal_submitted.html";
//   } catch (error) {
//     console.error("Error submitting form:", error);
//   }
// });
