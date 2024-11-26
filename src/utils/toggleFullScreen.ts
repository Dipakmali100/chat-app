export default function toggleFullScreen() {
    const elem = document.documentElement; // `document.documentElement` refers to the entire page
  
    if (!document.fullscreenElement) {
      elem.requestFullscreen()
        .then(() => console.log("Entered full-screen mode"))
        .catch((err) => console.error(`Error entering full-screen mode: ${err.message}`));
    } else {
      document.exitFullscreen()
        .then(() => console.log("Exited full-screen mode"))
        .catch((err) => console.error(`Error exiting full-screen mode: ${err.message}`));
    }
  }