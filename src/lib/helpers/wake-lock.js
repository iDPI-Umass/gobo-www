let wakeLock;

const canWakeLock = function () {
  return navigator != null && "wakeLock" in navigator;
};

const createWakeLock = async function () {
  if ( canWakeLock() && wakeLock == null ) {
    try {
      wakeLock = await navigator.wakeLock.request();
    } catch (error) {
      console.error("unable to establish wakeLock", error);
    }
  }
};

const releaseWakeLock = function () {
  if ( wakeLock != null ) {
    wakeLock.release();
    wakeLock = null;
  }
};


export {
  createWakeLock,
  releaseWakeLock
}