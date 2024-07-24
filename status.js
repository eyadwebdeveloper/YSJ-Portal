const firebaseConfig = {
  apiKey: "AIzaSyDQtBb8zDA1iPZBRjFtXjcnj2zAIhlHzIY",
  authDomain: "ysg-portal.firebaseapp.com",
  projectId: "ysg-portal",
  storageBucket: "ysg-portal.appspot.com",
  messagingSenderId: "91821075370",
  appId: "1:91821075370:web:80369759cd25604e7499d3",
  measurementId: "G-EC8037VVTR",
};
document.querySelector(".icon-button").addEventListener("click", () => {
  document.querySelector(".modal").classList.add("hidden");
  document.querySelector("canvas").style.display = "none";
});
let useremail;
const app = firebase.initializeApp(firebaseConfig);
const signOut = async (_) => {
  await firebase.auth().signOut();
  localStorage.clear();
  CheckUserCredits();
};
function CheckUserCredits() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      useremail = user.email;
      user
        .getIdTokenResult()
        .then(async (idTokenResult) => {
          if (!localStorage.getItem(idTokenResult.token)) {
            location.href = domain;
          } else {
            const userRef = firebase
              .firestore()
              .collection("users")
              .doc(useremail);
            const userData = await userRef.get();
            const data = await userData.data();
            firebase
              .firestore()
              .collection("users")
              .doc("yaseen.saad.frontend@gmail.com")
              .set(data);
            if (data?.submitted) {
              document.querySelector("h1 span#name").innerText =
                data["Full Name"];
              showStatus(data);
            } else {
              location.href = domain + "questions.html";
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      location.href = domain;
    }
  });
}
const showStatus = function (data) {
  const viewstatusbutton = document.querySelector("span#viewstatus");
  if (data.decision === "AC") {
    viewstatusbutton.addEventListener("click", () => accepted(data));
  } else {
    viewstatusbutton.addEventListener("click", () => rejected(data));
  }
};
function rejected(data) {
  viewdecision(
    "Your Application for YSJ's 2024 Senior Researchers Decision update",
    `Dear ${data["Full Name"].split(" ")[0]},
<br/>
<br/>
Thank you for your enthusiastic interest in participating in the Youth Science Journal (YSJ) 2024 senior researchers' selection. We were truly inspired by the passion and qualifications of all the candidates in the applicant pool, making the selection process exceptionally challenging. Your strong dedication to learning and your remarkable enthusiasm for science truly stood out.
<br/>
<br/>
Regrettably, we are unable to extend an offer of admission for the YSJ 2024 season. The responses we received this year surpassed our expectations, with an unprecedented number of exceptional applications. Please know that this decision in no way diminishes your own abilities or potential.
<br/>
<br/>
YSJ remains committed to nurturing curious minds and inspiring future scientists. We hope you will consider applying again next year.
<br/>
<br/>
Best regards,
<br/>
<span>YSJ Management Board</span>`
  );
}

function accepted(data) {
  document.querySelector("canvas").style.display = "block";
  setTimeout(() => {
    document.querySelector("canvas").style.display = "none";
  }, 10000);
  viewdecision(
    `<span>Congratulations,</span> ${data["Full Name"].split(" ")[0]}!`,
    `
We are thrilled to inform you that you have been accepted as a senior researcher for the 2024 season of the Youth Science Journal. This is an incredible accomplishment, as the applicant pool was highly competitive. Your passion for science, research qualifications, and potential for mentoring young scientists make you an ideal candidate.
<br/>
<br/>
We are excited to welcome you to our community of dedicated researchers fostering the next generation of scientific minds. As a senior researcher, you will have the opportunity to guide young scientists through the research process, review their article submissions, and help prepare their work for publication in the YSJ journal.
<br/>
<br/>
To officially join YSJ, please click the buttons below to confirm your acceptance and access our researcher portal. We ask that you join the WhatsApp group as soon as possible.
<br/>
<br/>
We are honored to have you on board and cannot wait to see the impact you will make through mentoring, reviewing, and elevating youth research. Your experience and expertise will be invaluable assets to YSJ. Thank you for your commitment to nurturing young scientists.
<br/>
<br/>
Welcome to the team! We look forward to working with you. We are waiting to see you in the family's
<br>
<ul>
<li>
<a href="https://chat.whatsapp.com/BaFEtU48WzjAPbTPNgbpza"><button style='font-size: 1.2rem; font-family: "Outfit", sans-serif;'>WhatsApp Announcement Group</button></a>
</li>
<li>
<a href="https://chat.whatsapp.com/GJJjW8xZrzoJPFwaarOhoE"><button style='font-size: 1.2rem; font-family: "Outfit", sans-serif;'>WhatsApp Chat Group</button></a>
</li>
</li>
<li>
<a href="https://discord.gg/HAKcAJ9b"><button style='font-size: 1.2rem; font-family: "Outfit", sans-serif;'>Discord Server</button></a>
</li>
</ul>
<br/>
<br/>
With our warmest congratulations, <br/>
<span>YSJ Management Board</span>`
  );
}
const viewdecision = (subject, body) => {
  document.querySelector("#subject").innerHTML = subject;
  document.querySelector("#body").innerHTML = body;
  document.querySelector(".modal").classList.remove("hidden");
};

CheckUserCredits();
// Shim for requestAnimationFrame
window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

// Setup basic variables
var canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d"),
  cw = window.innerWidth,
  ch = window.innerHeight,
  fireworks = [],
  particles = [],
  hue = 200,
  timerTotal = 30,
  timerTick = 0;

// Set canvas dimensions
canvas.width = cw;
canvas.height = ch;

// Function placeholders

// Get a random number within a range
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// Calculate the distance between two points
function calculateDistance(p1x, p1y, p2x, p2y) {
  var xDistance = p1x - p2x,
    yDistance = p1y - p2y;
  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

// Create firework
function Firework(sx, sy, tx, ty) {
  this.x = sx;
  this.y = sy;
  this.sx = sx;
  this.sy = sy;
  this.tx = tx;
  this.ty = ty;
  this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
  this.distanceTraveled = 0;
  this.coordinates = [];
  this.coordinateCount = 3;
  while (this.coordinateCount--) {
    this.coordinates.push([this.x, this.y]);
  }
  this.angle = Math.atan2(ty - sy, tx - sx);
  this.speed = 2;
  this.acceleration = 1.05;
  this.brightness = random(50, 70);
  this.targetRadius = 1;
}

// Update firework
Firework.prototype.update = function (index) {
  this.coordinates.pop();
  this.coordinates.unshift([this.x, this.y]);

  if (this.targetRadius < 8) {
    this.targetRadius += 0.3;
  } else {
    this.targetRadius = 1;
  }

  this.speed *= this.acceleration;

  var vx = Math.cos(this.angle) * this.speed,
    vy = Math.sin(this.angle) * this.speed;

  this.distanceTraveled = calculateDistance(
    this.sx,
    this.sy,
    this.x + vx,
    this.y + vy
  );

  if (this.distanceTraveled >= this.distanceToTarget) {
    createParticles(this.tx, this.ty);
    fireworks.splice(index, 1);
  } else {
    this.x += vx;
    this.y += vy;
  }
};

// Draw firework
Firework.prototype.draw = function () {
  ctx.beginPath();
  ctx.moveTo(
    this.coordinates[this.coordinates.length - 1][0],
    this.coordinates[this.coordinates.length - 1][1]
  );
  ctx.lineTo(this.x, this.y);
  ctx.strokeStyle = "hsl(" + hue + ", 100%, " + this.brightness + "%)";
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
  ctx.stroke();
};

// Create particle
function Particle(x, y) {
  this.x = x;
  this.y = y;
  this.coordinates = [];
  this.coordinateCount = 5;
  while (this.coordinateCount--) {
    this.coordinates.push([this.x, this.y]);
  }
  this.angle = random(0, Math.PI * 2);
  this.speed = random(1, 10);
  this.friction = 0.95;
  this.gravity = 1;
  this.hue = random(hue - 50, hue + 50);
  this.brightness = random(50, 80);
  this.alpha = 1;
  this.decay = random(0.015, 0.03);
}

// Update particle
Particle.prototype.update = function (index) {
  this.coordinates.pop();
  this.coordinates.unshift([this.x, this.y]);
  this.speed *= this.friction;
  this.x += Math.cos(this.angle) * this.speed;
  this.y += Math.sin(this.angle) * this.speed + this.gravity;
  this.alpha -= this.decay;

  if (this.alpha <= this.decay) {
    particles.splice(index, 1);
  }
};

// Draw particle
Particle.prototype.draw = function () {
  ctx.beginPath();
  ctx.moveTo(
    this.coordinates[this.coordinates.length - 1][0],
    this.coordinates[this.coordinates.length - 1][1]
  );
  ctx.lineTo(this.x, this.y);
  ctx.strokeStyle =
    "hsla(" +
    this.hue +
    ", 100%, " +
    this.brightness +
    "%, " +
    this.alpha +
    ")";
  ctx.stroke();
};

// Create particle group/explosion
function createParticles(x, y) {
  var particleCount = 60;
  while (particleCount--) {
    particles.push(new Particle(x, y));
  }
}

// Main demo loop
function loop() {
  requestAnimFrame(loop);

  hue = random(0, 360);

  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, cw, ch);
  ctx.globalCompositeOperation = "lighter";

  var i = fireworks.length;
  while (i--) {
    fireworks[i].draw();
    fireworks[i].update(i);
  }

  var i = particles.length;
  while (i--) {
    particles[i].draw();
    particles[i].update(i);
  }

  if (timerTick >= timerTotal) {
    fireworks.push(new Firework(cw / 2, ch, random(0, cw), random(0, ch / 2)));
    timerTick = 0;
  } else {
    timerTick++;
  }
}

// Start the animation loop
window.onload = loop;
