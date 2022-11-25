// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event

document.addEventListener("DOMContentLoaded", () => {
  console.log("peatch.io JS imported successfully!");

  proposalBtnStateChange();
});

// keeps add button disabled as long input field is empty
function proposalBtnStateChange() {
  const proposalInput = document.querySelector(".proposal-text");
  const proposalBtnAdd = document.querySelector(".proposal-btn-add");

  proposalBtnAdd.disabled = true;

  proposalInput.addEventListener("keyup", () => {
    if (document.querySelector(".proposal-text").value === "") {
      proposalBtnAdd.disabled = true;
    } else {
      proposalBtnAdd.disabled = false;
    }
  });
}
