const db = firebase.firestore();
const auth = firebase.auth(app);
const storage = firebase.storage(app);
const data = {};
let useremail;
firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    useremail = user.email;
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
            // field.value = data[field.name];
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
  const data = {};
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
    console.log(slider);
    // Only include checked checkboxes with corresponding sliders
    if (checkbox.checked && slider) {
      const topic = topics[i];
      const value = slider.innerText;
      checkedTopics.push({ [topic]: value });
    }
  }
  data["fieldsOfInterest"] = checkedTopics;

  console.log(data);

  try {
    const userRef = db.collection("users").doc(useremail);
    await userRef.set(data);
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
    async function UploadFile(body, overlayer, resolve, reject) {
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
// // Handle file selection and upload to Firebase Storage
// async function handleFileSelect(event) {
//   const file = event.target.files[0];
//   if (!file) return 0;

//   const storageRef = storage.ref("uploads/" + file.name);
//   try {
//     const snapshot = await storageRef.put(file);
//     const downloadURL = await snapshot.ref.getDownloadURL();
//     console.log("File available at", downloadURL);

//     // Store the download URL in the hidden input for submission
//     document.getElementById("downloadURL").value = downloadURL;
//   } catch (error) {
//     console.error("Error uploading file:", error);
//   }
// }

// // Attach handleFileSelect to file input change event
// document.getElementById("pdf").addEventListener("change", handleFileSelect);

// // Form submission event listener
// document.getElementById("applicationForm").addEventListener("submit", async function (e) {
//   e.preventDefault();
//   try {
//     const formData = new FormData(e.target);
//     const data = {};

//     formData.forEach((value, key) => {
//       data[key] = value;
//     });

//     // Retrieve the values of checked topics and slider values
//     const topics = [
//       "Astronomy",
//       "Architecture",
//       "Biology",
//       "Business",
//       "Chemistry",
//       "Computer Science",
//       "Engineering",
//       "Environmental Studies",
//       "Mathematics",
//       "Neuroscience",
//       "Physics",
//       "Political Science",
//       "Psychology",
//     ];

//     // Initialize arrays to store checked topics and slider values
//     const checkedTopics = [];
//     const sliderValues = [];

//     // Loop through each checkbox and slider
//     for (let i = 0; i < topics.length; i++) {
//       const checkboxId = `checkbox-${i}`;
//       const sliderId = `slider-${i}`;
//       console.log(sliderId);

//       const checkbox = document.getElementById(checkboxId);
//       const slider = document.getElementById(sliderId).querySelector('.slider-value');
//       console.log(slider);

//       // Only include checked checkboxes with corresponding sliders
//       if (checkbox.checked && slider) {
//         const topic = topics[i];
//         const value = slider.innerText;
//         console.log(value);

//         checkedTopics.push(topic);
//         sliderValues.push(value);
//       }
//     }

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
