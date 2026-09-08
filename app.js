const tracks = [
  { name: "Return of the haggis/THE HAGGIS HORN", file: "audio/ZOOM0024 - THE HAGGIS HORN - Return of the haggis.mp3", duration: "3:16" },
  { name: "No breaks/DD's BROTHERS", file: "audio/ZOOM0025 - DD's BROTHERS - No Breaks.mp3", duration: "3:45" },
  { name: "He can only hold her/AMY WHINEHOUSE", file: "audio/ZOOM0028 - AMY WHINEHOUSE - He can only hold her.mp3", duration: "2:54" },
  { name: "Come/JAIN", file: "audio/ZOOM0029 - JAIN - Come.mp3", duration: "2:46" },
  { name: "You know i’m no good/AMY WHINEHOUSE", file: "audio/ZOOM0030 - AMY WHINEHOUSE - You know i’m no good.mp3", duration: "4:24" },  
  { name: "Soleil d'hiver/NIAGARA", file: "audio/ZOOM0033 - NIAGARA - Soleil d’hiver.mp3", duration: "3:49" },    
  { name: "Nuit d’ivresse/LES RITA MITSUKO", file: "audio/ZOOM0034 - LES RITA MITSUKO - Nuit d’ivresse.mp3", duration: "3:29" },  
  { name: "Singing in the shower/LES RITA MITSUKO", file: "audio/ZOOM0035 - LES RITA MITSUKO - Singing in the shower.mp3", duration: "3:29" },  
  { name: "Mr Big stuff/JEAN KNIGHT", file: "audio/ZOOM0036 - JEAN KNIGHT - Mr Big stuff.mp3", duration: "3:07" },  
  { name: "Flowers/deluxe", file: "audio/ZOOM0037 - DELUXE - Flowers.mp3", duration: "3:50" },  
  { name: "Smooth operator/SADE", file: "audio/ZOOM0039 - SADE - Smooth operator.mp3", duration: "4:16" },  
  { name: "Mustang Sally/WILSON PICKETT", file: "audio/WILSON PICKETT - Mustang Sally.mp3", duration: "3:05" },
  { name: "Toxic/THE BLUEBEATERS", file: "audio/ZOOM0044 - THE BLUEBEATERS - Toxic.mp3", duration: "3:12" },
  { name: "Knock on wood/EDDIE FLOYD", file: "audio/ZOOM0046 - EDDIE FLOYD - Knock on wood.mp3", duration: "3:04" },
  { name: "Shame and scandal/BLUES BUSTER", file: "audio/ZOOM0048 - BLUES BUSTER - Shame and scandal.mp3", duration: "2:26" },
  { name: "Valerie/RONSON-WHINEHOUSE", file: "audio/ZOOM0050 - RONSON-WHINEHOUSE - Valerie.mp3", duration: "3:47" },
  { name: "Pendant que les champs brûlent/NIAGARA", file: "audio/ZOOM0052 - NIAGARA - Pendant que les champs brûlent.mp3", duration: "3:48" },
  { name: "Out of time man/LE MAXIMUM KOUETTE", file: "audio/ZOOM0054 - LE MAXIMUM KOUETTE - Out of time man (nouvelle fin).mp3", duration: "3:16" },
  { name: "Bad guy/THE INTERRUPTORS", file: "audio/ZOOM0061 - THE INTERRUPTORS - Bad guy.mp3", duration: "2:40" },
  { name: "Take on me/Ha ha", file: "audio/Ha ha - Take on me(Fred).mp3", duration: "3:55" },
  { name: "Monkey man/AMY WHINEHOUSE", file: "audio/AMY WHINEHOUSE - Monkey Man.mp3", duration: "2:56" },
  { name: "I need a dollar/ALOE BLACC", file: "audio/ALOE BLACC - I need a dollar.mp3", duration: "2:56" },
 
   
];


let current = 0;
let repeatMode = false;

const audio = document.getElementById("audio");
const title = document.getElementById("title");
const playlistDiv = document.getElementById("playlist");
const searchInput = document.getElementById("search");
const progressBar = document.getElementById("progress-bar");
const progressContainer = document.getElementById("progress-container");
const progressHandle = document.getElementById("progress-handle");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

let isDragging = false;

/* -------------------------
   BUILD PLAYLIST SIDEBAR
--------------------------*/
tracks.forEach((t, i) => {
  const div = document.createElement("div");

  div.className = "track";
  div.innerText = t.name;

  div.onclick = () => playTrack(i);

  div.id = "track-" + i;

  playlistDiv.appendChild(div);
});

/* -------------------------
   PLAYER CONTROLS
--------------------------*/
function playTrack(i) {
  current = i;

  audio.src = tracks[i].file;

  title.innerText = tracks[i].name;

  // retire ancienne sélection
  document.querySelectorAll(".track").forEach(track => {
    track.classList.remove("active");
  });

  // sélection active
  const activeTrack = document.getElementById("track-" + i);

  activeTrack.classList.add("active");

  // scroll automatique
  activeTrack.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  audio.play();
}

function playPause() {
  if (!audio.src) {
    playTrack(current);
    return;
  }

  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

function nextTrack() {
  current = (current + 1) % tracks.length;
  playTrack(current);
}

function prevTrack() {
  current = (current - 1 + tracks.length) % tracks.length;
  playTrack(current);
}

function skip(seconds) {

  audio.currentTime += seconds;

  // sécurité
  if (audio.currentTime < 0) {
    audio.currentTime = 0;
  }

  if (audio.currentTime > audio.duration) {
    audio.currentTime = audio.duration;
  }
}

audio.addEventListener("ended", () => {

  if (repeatMode) {

    audio.currentTime = 0;
    audio.play();

  } else {

    nextTrack();

  }

});

function toggleRepeat() {

  repeatMode = !repeatMode;

  const btn = document.getElementById("repeat-btn");

  if (repeatMode) {
    btn.classList.add("active");
  } else {
    btn.classList.remove("active");
  }
}

/* -------------------------
   PLAYLIST DURATION
--------------------------*/
function calculatePlaylistDuration() {
  let totalSeconds = 0;

  tracks.forEach(track => {
    const [min, sec] = track.duration.split(":").map(Number);
    totalSeconds += min * 60 + sec;
  });

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  let text = "";
  if (hours > 0) text += hours + " h ";
  text += minutes + " min";

  document.getElementById("playlist-duration").innerText = text;
}

calculatePlaylistDuration();

/* -------------------------
   PROGRESS BAR
--------------------------*/
audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", updateProgress);

function updateProgress() {
  if (isDragging || !audio.duration) return;

  const percent = (audio.currentTime / audio.duration) * 100;

  progressBar.style.width = percent + "%";
  progressHandle.style.left = percent + "%";

  currentTimeEl.textContent = formatTime(audio.currentTime);
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return mins + ":" + (secs < 10 ? "0" : "") + secs;
}

/* -------------------------
   SEEK + DRAG
--------------------------*/
progressContainer.addEventListener("click", seek);

progressHandle.addEventListener("mousedown", () => {
  isDragging = true;
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

document.addEventListener("mousemove", drag);

function seek(e) {
  const rect = progressContainer.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;

  audio.currentTime = percent * audio.duration;
}

function drag(e) {
  if (!isDragging) return;

  const rect = progressContainer.getBoundingClientRect();
  let percent = (e.clientX - rect.left) / rect.width;

  percent = Math.max(0, Math.min(1, percent));

  progressBar.style.width = percent * 100 + "%";
  progressHandle.style.left = percent * 100 + "%";

  audio.currentTime = percent * audio.duration;
}

/* -------------------------
   MOBILE TOUCH SUPPORT
--------------------------*/
progressHandle.addEventListener("touchstart", () => {
  isDragging = true;
});

document.addEventListener("touchend", () => {
  isDragging = false;
});

document.addEventListener("touchmove", (e) => {
  if (!isDragging) return;

  const touch = e.touches[0];
  const rect = progressContainer.getBoundingClientRect();

  let percent = (touch.clientX - rect.left) / rect.width;
  percent = Math.max(0, Math.min(1, percent));

  progressBar.style.width = percent * 100 + "%";
  progressHandle.style.left = percent * 100 + "%";

  audio.currentTime = percent * audio.duration;
});

searchInput.addEventListener("keyup", filterTracks);

function filterTracks() {

  const value = searchInput.value.toLowerCase();

  const tracksElements = document.querySelectorAll(".track");

  tracksElements.forEach(track => {

    const text = track.textContent.toLowerCase();

    if (text.indexOf(value) > -1) {
      track.style.display = "";
    } else {
      track.style.display = "none";
    }

  });

}

function toggleFullscreen() {

  const container = document.querySelector(".container");

  if (!document.fullscreenElement) {

    container.requestFullscreen();

  } else {

    document.exitFullscreen();

  }
}
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

// Web Audio API
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const source = audioCtx.createMediaElementSource(audio);
const analyser = audioCtx.createAnalyser();

source.connect(analyser);
analyser.connect(audioCtx.destination);

analyser.fftSize = 64;

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// resize canvas
function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function draw() {

  requestAnimationFrame(draw);

  if (!analyser) return;

  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = canvas.width / bufferLength;

  // 🔊 calcul énergie globale
  let energy = 0;

  for (let i = 0; i < bufferLength; i++) {
    energy += dataArray[i];
  }

  energy = energy / bufferLength;

  // 🎨 couleur selon énergie
  let color = "#00ff88"; // 🟢 vert doux

  if (energy > 170) {
    color = "#ff3b3b"; // 🔴 rouge
  } else if (energy > 100) {
    color = "#ffb300"; // 🟠 orange
  }

  // 🎵 dessin des barres
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {

    const barHeight = dataArray[i] / 2;

    ctx.fillStyle = color;

    ctx.fillRect(
      x,
      canvas.height - barHeight,
      barWidth - 2,
      barHeight
    );

    x += barWidth;
  }
}

draw();

document.addEventListener("click", () => {
  audioCtx.resume();
}, { once: true });
