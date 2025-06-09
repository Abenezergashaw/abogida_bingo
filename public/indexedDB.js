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

async function preloadAllAudios() {
  const db = await openDB();

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
}

async function playCachedAudio(key) {
  const db = await openDB();
  const blob = await getAudioBlob(db, key);

  if (!blob) {
    console.error("Audio not cached:", key);
    return;
  }

  const audio = new Audio(URL.createObjectURL(blob));
  audio.play().catch((e) => {
    console.warn("Play failed:", e);
  });
}
