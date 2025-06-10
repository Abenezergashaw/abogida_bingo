function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("audioCacheDB", 1);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("audios")) {
        db.createObjectStore("audios");
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function storeAudioBlob(db, key, blob) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("audios", "readwrite");
    const store = tx.objectStore("audios");
    const request = store.put(blob, key);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

function getAudioBlob(db, key) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("audios", "readonly");
    const store = tx.objectStore("audios");
    const request = store.get(key);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

const audioList = Array.from({ length: 76 }, (_, i) => ({
  url: `https://abogida.duckdns.org/assets/${i + 1}.m4a`,
  key: `sound${i + 1}`,
}));

// async function preloadAllAudios() {
//   const db = await openDB();

//   for (const { url, key } of audioList) {
//     const cachedBlob = await getAudioBlob(db, key);
//     if (!cachedBlob) {
//       try {
//         const response = await fetch(url);
//         if (!response.ok) throw new Error(`Failed to fetch ${url}`);
//         const blob = await response.blob();
//         await storeAudioBlob(db, key, blob);
//         console.log(`Cached: ${key}`);
//       } catch (e) {
//         console.warn(`Error caching ${key}:`, e);
//       }
//     } else {
//       console.log(`Already cached: ${key}`);
//       // document.getElementById(
//       //   "playButton"
//       // ).textContent = `Already cached: ${key}`;
//     }
//   }
// }

async function preloadAllAudios() {
  const modal = document.getElementById("loadingModal");
  const loadingText = document.getElementById("loadingText");
  const db = await openDB();

  // Check if all audios are already cached
  let allCached = true;
  for (const { key } of audioList) {
    const blob = await getAudioBlob(db, key);
    if (!blob) {
      allCached = false;
      break;
    }
  }

  if (!allCached) {
    modal.classList.remove("hidden");
    // loadingText.textContent = "Caching audio files...";
  }

  for (const { url, key } of audioList) {
    const cachedBlob = await getAudioBlob(db, key);
    if (!cachedBlob) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);
        const blob = await response.blob();
        await storeAudioBlob(db, key, blob);
        console.log(`Cached: ${key}`);
      } catch (e) {
        console.warn(`Error caching ${key}:`, e);
      }
    } else {
      console.log(`Already cached: ${key}`);
    }
  }

  // Hide modal when done
  modal.classList.add("hidden");
}



// async function playCachedAudio(key) {
//   const db = await openDB();
//   const blob = await getAudioBlob(db, key);

//   if (!blob) {
//     console.error("Audio not cached:", key);
//     return;
//   }

//   const audio = new Audio(URL.createObjectURL(blob));
//   try {
//     await audio.play();
//   } catch (e) {
//     console.warn(`Failed to autoplay ${key}:`, e);
//   }
// }

// function unlockAudioAutoplay() {
//   const emptyAudio = new Audio();
//   emptyAudio.play().catch(() => {});
// }

// let audioUnlocked = false;

// function unlockAudio() {
//   if (audioUnlocked) return;

//   const ctx = new (window.AudioContext || window.webkitAudioContext)();
//   const buffer = ctx.createBuffer(1, 1, 22050);
//   const source = ctx.createBufferSource();
//   source.buffer = buffer;
//   source.connect(ctx.destination);
//   source.start(0);
//   audioUnlocked = true;

//   console.log("✅ Audio unlocked");
// }

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

async function playCachedAudio(key) {
  const db = await openDB();
  const blob = await getAudioBlob(db, key);
  if (!blob) {
    console.error("Audio not cached:", key);
    return;
  }

  const arrayBuffer = await blob.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioCtx.destination);
  source.start(0);

  console.log(`Playing ${key} via Web Audio API`);
}

function unlockAudio() {
  audioCtx.resume().then(() => {
    console.log("AudioContext resumed");
  });
}
