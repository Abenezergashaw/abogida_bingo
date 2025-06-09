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

async function loadAndPlayAudio(audioUrl, audioKey) {
  const db = await openDB();
  let blob = await getAudioBlob(db, audioKey);

  if (!blob) {
    console.log("Fetching and caching audio:", audioUrl);
    const response = await fetch(audioUrl);
    blob = await response.blob();
    await storeAudioBlob(db, audioKey, blob);
  } else {
    console.log("Using cached audio:", audioKey);
  }

  const audio = new Audio(URL.createObjectURL(blob));
  audio.play();
}
