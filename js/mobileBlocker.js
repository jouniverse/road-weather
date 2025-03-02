// Mobile Blocker Script
document.addEventListener("DOMContentLoaded", function () {
  // Create mobile blocker elements
  const mobileBlocker = document.createElement("div");
  mobileBlocker.id = "mobile-blocker";

  const blockerMessage = document.createElement("div");
  blockerMessage.id = "blocker-message";

  // Add message content
  blockerMessage.innerHTML = `
    <h2>Desktop Version Only</h2>
    <p>This application is optimized for larger screens.</p>
    <p>Please use a device with a screen width of at least 1050px.</p>
  `;

  // Append elements to the body
  mobileBlocker.appendChild(blockerMessage);
  document.body.appendChild(mobileBlocker);

  // Function to check screen size and show/hide blocker
  function checkScreenSize() {
    if (window.innerWidth < 1050) {
      mobileBlocker.style.display = "flex";
      document.body.style.overflow = "hidden"; // Prevent scrolling
    } else {
      mobileBlocker.style.display = "none";
      document.body.style.overflow = ""; // Allow scrolling
    }
  }

  // Check on load and resize
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
});
