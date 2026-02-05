document.addEventListener("DOMContentLoaded", () => {

    // ---------------------------------------------------------
    // CHECK IF THIS PAGE HAS PREDICTION FORM
    // If not, STOP RUNNING (prevents crashing on contact.html)
    // ---------------------------------------------------------
    const form = document.getElementById("prediction-form");
    if (!form) {
        console.log("Prediction script: No prediction form found on this page.");
        return; // ⛔ STOP — This page does not use prediction system
    }

    const fileInput = document.getElementById("file-input");
    const dataInput = document.getElementById("data-input");
    const generateBtn = document.getElementById("generate-json-btn");
    const predictionResults = document.getElementById("prediction-results");

    // Loader
    const loader = document.createElement("div");
    loader.classList.add("loader");
    document.body.appendChild(loader);


    // ---------------------------------------------------------
    // 1. REALISTIC 3-CHANNEL WAVEFORM GENERATOR
    // ---------------------------------------------------------
    function generateChannel(freq1Range, freq2Range, freq3Range, noiseFactor) {
        let ch = [];

        let f1 = Math.random() * (freq1Range[1] - freq1Range[0]) + freq1Range[0];
        let f2 = Math.random() * (freq2Range[1] - freq2Range[0]) + freq2Range[0];
        let f3 = Math.random() * (freq3Range[1] - freq3Range[0]) + freq3Range[0];

        let noise = Math.random() * noiseFactor;
        let phaseShift = Math.random() * Math.PI * 2;

        for (let i = 0; i < 300; i++) {
            let t = i / 100;
            let value =
                Math.sin(f1 * t + phaseShift) * 0.6 +
                Math.sin(f2 * t * 0.7 + phaseShift) * 0.3 +
                Math.sin(f3 * t * 0.25 + phaseShift) * 0.1 +
                (Math.random() * 2 - 1) * noise;

            value = Math.max(-1, Math.min(1, value));
            ch.push(Number(value.toFixed(5)));
        }
        return ch;
    }

    function generate3ChannelWaveform() {
        let Z = generateChannel([0.4, 1.2], [1, 4], [4, 12], 0.05);
        let N = generateChannel([0.6, 2.0], [1.5, 5], [5, 15], 0.08);
        let E = generateChannel([0.8, 3.0], [2, 7], [8, 20], 0.10);
        return [...Z, ...N, ...E]; // 900 features
    }


    // ---------------------------------------------------------
    // 2. AUTO-GENERATE WAVEFORM BUTTON
    // ---------------------------------------------------------
    generateBtn?.addEventListener("click", () => {
        let data = generate3ChannelWaveform();
        dataInput.value = data.join(", ");
        alert("900-feature realistic waveform generated!");
    });


    // ---------------------------------------------------------
    // 3. FILE UPLOAD FOR WAVEFORM DATA
    // ---------------------------------------------------------
    fileInput?.addEventListener("change", e => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = ev => {
            dataInput.value = ev.target.result;
        };
        reader.readAsText(file);
    });


    // ---------------------------------------------------------
    // 4. PARSE WAVEFORM INTO CHANNELS
    // ---------------------------------------------------------
    function parseWaveform(text) {
        let values = text.trim().split(/,|\n/).map(v => parseFloat(v)).filter(v => !isNaN(v));

        if (values.length < 300) {
            alert("Waveform must contain at least 300 values.");
            return null;
        }

        if (values.length === 300) return [values, values, values];
        if (values.length === 600) return [values.slice(0, 300), values.slice(300, 600), values.slice(300, 600)];
        if (values.length >= 900) return [
            values.slice(0, 300),
            values.slice(300, 600),
            values.slice(600, 900)
        ];
    }


    // ---------------------------------------------------------
    // 5. FEATURE EXTRACTION (300 PER CHANNEL)
    // ---------------------------------------------------------
    function extractFeatures(channel) {

        let features = [];

        const mean = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
        const std = arr => {
            const m = mean(arr);
            return Math.sqrt(arr.reduce((s, x) => s + (x - m) ** 2, 0) / arr.length);
        };
        const max = arr => Math.max(...arr);
        const min = arr => Math.min(...arr);
        const energy = arr => arr.reduce((s, x) => s + x * x, 0);
        const zcr = arr => arr.slice(1).filter((v, i) => arr[i] * v < 0).length;

        features.push(mean(channel));
        features.push(std(channel));
        features.push(max(channel));
        features.push(min(channel));
        features.push(energy(channel));
        features.push(zcr(channel));

        const m = mean(channel);
        const sd = std(channel) || 1;
        const normalized = channel.map(v => (v - m) / sd);

        const fft = normalized.map((v, i) => v * Math.sin(i));

        features.push(max(fft));
        features.push(min(fft));
        features.push(mean(fft));
        features.push(std(fft));
        features.push(energy(fft));

        // Sliding windows
        for (let i = 0; i < 30; i++) {
            let slice = normalized.slice(i * 10, i * 10 + 10);
            features.push(mean(slice));
            features.push(std(slice));
            features.push(energy(slice));
        }

        while (features.length < 300)
            features.push(Math.random().toFixed(5) * 1);

        return features.slice(0, 300);
    }


    // ---------------------------------------------------------
    // 6. FORM SUBMIT → SEND TO BACKEND
    // ---------------------------------------------------------
    form.addEventListener("submit", async e => {
        e.preventDefault();

        let text = dataInput.value.trim();
        if (!text) {
            alert("Please enter or upload waveform data.");
            return;
        }

        let values = text.split(/,|\n/).map(v => parseFloat(v)).filter(v => !isNaN(v));
        let finalFeatures = [];
        let channels = null;

        const smallNumbers = values.every(v => v >= -2 && v <= 2);

        if (values.length === 900 && smallNumbers) {
            finalFeatures = values;
        } else {
            channels = parseWaveform(text);
            if (!channels) return;

            finalFeatures = [
                ...extractFeatures(channels[0]),
                ...extractFeatures(channels[1]),
                ...extractFeatures(channels[2])
            ];
        }

        loader.style.display = "block";
        predictionResults.style.display = "none";

        try {
            const response = await fetch("http://127.0.0.1:5000/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ features: finalFeatures })
            });

            const result = await response.json();
            loader.style.display = "none";

            if (result.error) {
                alert(result.error);
                return;
            }

            predictionResults.style.display = "block";
            document.querySelector('[data-result="magnitude"]').textContent = result.magnitude;
            document.querySelector('[data-result="distance"]').textContent = result.distance;
            document.querySelector('[data-result="azimuth"]').textContent = result.azimuth;
            document.querySelector('[data-result="depth"]').textContent = result.depth;

        } catch (err) {
            loader.style.display = "none";
            alert("Prediction failed: " + err);
        }
    });


    // ---------------------------------------------------------
    // 7. DOWNLOAD RESULTS AS JSON
    // ---------------------------------------------------------
    const downloadBtn = document.getElementById("download-btn");
    downloadBtn?.addEventListener("click", () => {
        const data = {
            magnitude: document.querySelector('[data-result="magnitude"]').textContent,
            distance: document.querySelector('[data-result="distance"]').textContent,
            azimuth: document.querySelector('[data-result="azimuth"]').textContent,
            depth: document.querySelector('[data-result="depth"]').textContent
        };

        const blob = new Blob([JSON.stringify(data, null, 4)], {
            type: "application/json"
        });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "prediction.json";
        a.click();

        URL.revokeObjectURL(url);
    });

});
