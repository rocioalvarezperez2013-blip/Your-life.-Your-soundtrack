const scene = document.getElementById("scene");
const description = document.getElementById("description");
const song = document.getElementById("song");


// 🕐 DETECTAR HORA + ESCENA

function detectScene(isMoving = false) {

    const hour = new Date().getHours();

    if (hour >= 6 && hour < 12) {

        if (isMoving) {
            scene.textContent = "Morning Adventure ☀️";
            description.textContent = "A new day is already moving.";
            song.textContent = "Energetic morning soundtrack";
        } else {
            scene.textContent = "Quiet Morning ☀️";
            description.textContent = "A slow start to the day.";
            song.textContent = "Soft morning soundtrack";
        }

    } else if (hour >= 12 && hour < 18) {

        if (isMoving) {
            scene.textContent = "Afternoon Walk 🚶";
            description.textContent = "The day keeps moving.";
            song.textContent = "Walking soundtrack";
        } else {
            scene.textContent = "Lazy Afternoon 🌤️";
            description.textContent = "A peaceful afternoon.";
            song.textContent = "Chill afternoon soundtrack";
        }

    } else if (hour >= 18 && hour < 23) {

        if (isMoving) {
            scene.textContent = "Night Walk 🌆";
            description.textContent = "Everything feels a little cinematic.";
            song.textContent = "Cinematic night soundtrack";
        } else {
            scene.textContent = "Quiet Evening 🌙";
            description.textContent = "The world is getting quieter.";
            song.textContent = "Evening soundtrack";
        }

    } else {

        scene.textContent = "Late Night 🌌";
        description.textContent = "The world is quiet.";
        song.textContent = "Late night soundtrack";
    }
}


// 📱 DETECTAR MOVIMIENTO

const motionStatus = document.getElementById("motionStatus");

if ("DeviceMotionEvent" in window) {

    window.addEventListener("devicemotion", function(event) {

        const x = event.acceleration?.x || 0;
        const y = event.acceleration?.y || 0;
        const z = event.acceleration?.z || 0;

        const movement =
            Math.abs(x) +
            Math.abs(y) +
            Math.abs(z);

        if (movement > 3) {

            motionStatus.textContent =
                "📱 Motion: MOVING 🚶";

            detectScene(true);

        } else {

            motionStatus.textContent =
                "📱 Motion: STILL 🧍";

            detectScene(false);
        }

    });

} else {

    motionStatus.textContent =
        "📱 Motion: unavailable";
}


// 🎤 MICROPHONE + SOUND DETECTION

const micButton = document.getElementById("micButton");
const microphoneStatus =
    document.getElementById("microphoneStatus");

micButton.addEventListener("click", async () => {

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({
                audio: true
            });

        microphoneStatus.textContent =
            "🎤 Microphone: LISTENING";

        micButton.textContent =
            "Microphone enabled";

        const audioContext =
            new AudioContext();

        const microphone =
            audioContext.createMediaStreamSource(stream);

        const analyser =
            audioContext.createAnalyser();

        microphone.connect(analyser);

        analyser.fftSize = 256;

        const data =
            new Uint8Array(analyser.fftSize);


        // 🧠 MEMORIA DEL SONIDO

        let currentEnvironment = "QUIET";

        let soundHistory = [];

        function detectSound() {

            analyser.getByteTimeDomainData(data);

            let total = 0;

            for (let i = 0; i < data.length; i++) {

                const value = data[i] - 128;

                total += value * value;
            }

            const volume =
                Math.sqrt(total / data.length);


            // Guardamos el nivel actual

            let level;

            if (volume > 15) {

                level = "LOUD";

            } else if (volume > 7) {

                level = "ACTIVE";

            } else {

                level = "QUIET";
            }


            // Guardamos las últimas mediciones

            soundHistory.push(level);


            // Solo conservamos las últimas 30 mediciones

            if (soundHistory.length > 30) {

                soundHistory.shift();
            }


            // 🧠 DECIDIR EL AMBIENTE

            const quiet =
                soundHistory.filter(x => x === "QUIET").length;

            const active =
                soundHistory.filter(x => x === "ACTIVE").length;

            const loud =
                soundHistory.filter(x => x === "LOUD").length;


            let detectedEnvironment;


            if (loud > active && loud > quiet) {

                detectedEnvironment = "LOUD";

            } else if (active > quiet) {

                detectedEnvironment = "ACTIVE";

            } else {

                detectedEnvironment = "QUIET";
            }


            // Solo cambiamos si realmente cambió

            if (detectedEnvironment !== currentEnvironment) {

                currentEnvironment =
                    detectedEnvironment;


                if (currentEnvironment === "LOUD") {

                    microphoneStatus.textContent =
                        "🎤 Environment: LOUD 🔊";

                } else if (currentEnvironment === "ACTIVE") {

                    microphoneStatus.textContent =
                        "🎤 Environment: ACTIVE 🗣️";

                } else {

                    microphoneStatus.textContent =
                        "🎤 Environment: QUIET 🔇";
                }
            }


            requestAnimationFrame(detectSound);
        }


        detectSound();


    } catch (error) {

        microphoneStatus.textContent =
            "🎤 Microphone: DENIED";

        console.log(error);
    }

});

// 🎧 PERFIL MUSICAL

const artistButtons = document.querySelectorAll(".artist");

let favoriteArtists = [];

artistButtons.forEach(button => {

    button.addEventListener("click", () => {

        const artist = button.textContent;

        if (favoriteArtists.includes(artist)) {

            favoriteArtists =
                favoriteArtists.filter(
                    name => name !== artist
                );

            button.classList.remove("selected");

        } else {

            favoriteArtists.push(artist);

            button.classList.add("selected");
        }

        console.log("Favorite artists:", favoriteArtists);

    });

});