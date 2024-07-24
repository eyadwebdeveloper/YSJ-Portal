const db = firebase.firestore();
const auth = firebase.auth(app);
const storage = firebase.storage(app);
let data = {};
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
          .querySelectorAll("input:not([type=checkbox]):not([type=range])")
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
    location.href = domain;
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
    data.email = useremail;
    const userRef = db.collection("users").doc(useremail);
    await userRef.set(data, { merge: true });
    resolve();
    body.remove();
    overlayer.remove();
    return data;
  } catch (error) {
    reject();
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
    if (!value && key !== "Field Grade" && key !== "Additions") {
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
          "Please enter The Writing assessment " + " within the word limit",
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
    const userRef = db.collection("users").doc(useremail);
    await userRef.set(
      { submitted: true, secret_id: secret_id },
      { merge: true }
    );
    await giveAlert(" Your Application is now submitted", "#e43956", " ");
    location.href = domain + "status.html";
  }
});
const uid = function () {
  return (
    Date.now().toString(36) +
    (Math.random() ** Math.random()).toString(36).substr(2)
  );
};
async function submitGoogleForm(secret_id) {
console.log('submitted');
/*
*/
console.log(data);
console.log(data["Gender"]);
  const formURL =
    "https://docs.google.com/forms/d/e/1FAIpQLSeEEmU5fKIxLE_q9z4XI4pRlY8juKHoxhBb18T53X7x4MWoXQ/formResponse";
  // JavaScript code with names
  const formData = new URLSearchParams();
  formData.append("entry.1140876366", data["Gender"]); // Gender
  formData.append("entry.2006819519", data["Birthday"]); // Date of Birth
  formData.append("entry.1934188000", data["Grade"]); // Grade Year
  formData.append("entry.635480977", data["Nationality"]); // Country of Nationality
  formData.append(
    "entry.1926290846",
    data["fieldsOfInterest"]
      .map((field) => Object.entries(field))
      .flat()
      .join(" ")
  );
  formData.append("entry.1652991539", data["GPA"]); // GPA
  formData.append("entry.1018788432", data["Field Grade"]); // Field Grade
  formData.append("entry.305643536", data["The First Essay"]); // Qualification
  formData.append("entry.1645390855", data["The Second Essay"]); // Unfamiliar Achievement
  formData.append("entry.1372192977", data["The Third Essay"]); // Mentorship Analysis
  formData.append("entry.1934197111", data["Availability"]); // Time commitment
  formData.append("entry.486269580", data["Time Blocks"]); // Time blocks
  formData.append("entry.1843752743", data["how did this portal reach you"]); // How did this portal reach you
  formData.append("entry.493747616", data["Additions"]); // Additional Info
  // Newly created names for missing fields
  formData.append("entry.1165181263", useremail); // Personal Email Address
  formData.append("entry.504705542", data["Full Name"]); // Full Name
  formData.append("entry.929741563", data["Phone Number"]); // Phone Number
  formData.append("entry.1633552997", data["Institution"]); // Institution
  formData.append("entry.101552372", data["Address"]); // Address
  formData.append("entry.1699758998", data["Concept"]); // Assessment
  formData.append("entry.1684392433", data["The Fourth Essay"]); // Essay 4
  formData.append("entry.782441624", data["Other"]); // Essay 4
  formData.append("entry.1784949897", secret_id); //

  try {
    const response = await fetch(formURL, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.ok) {
      console.log("Form submitted successfully!");
    } else {
      console.error("Form submission failed:", response.statusText);
    }
  } catch (error) {
    console.error("Error submitting form:", error);
  }
}
