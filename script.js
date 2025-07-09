  let clickCount = 0;
  const shareBtn = document.getElementById("shareBtn");
  const clickCounter = document.getElementById("clickCounter");
  const form = document.getElementById("registrationForm");
  const messageBox = document.getElementById("confirmationMessage");
  const submitBtn = document.getElementById("submitBtn");

  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzi4dkPUcMY4N2GfvEB23bl5SMxzftKuNdn0sy4VmYqEc2QyeNibAm74UFNWQHZbEzapA/exec";

  shareBtn.addEventListener("click", () => {
    if (clickCount < 5) {
      clickCount++;
      const message = encodeURIComponent("Hey Buddy, Join Tech Community");
      const whatsappUrl = `https://wa.me/?text=${message}`;
      window.open(whatsappUrl, "_blank");

      clickCounter.textContent = `Click count: ${clickCount}/5`;
    }
    if (clickCount === 5) {
      alert("Sharing complete. Please continue.");
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (clickCount < 5) {
      alert("Please complete WhatsApp sharing (5/5) before submitting.");
      return;
    }

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const college = document.getElementById("college").value;
    const file = document.getElementById("screenshot").files[0];

    if (file && file.size > 1024 * 1024) {
      alert("Please upload a file smaller than 1MB.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner"></span> Submitting...`;
    messageBox.textContent = "⏳ Uploading your data...";

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("college", college);
    formData.append("screenshot", file);

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        messageBox.textContent = "🎉 Your submission has been recorded. Thanks for being part of Tech for Girls!";
        form.reset();
        clickCount = 0;
        clickCounter.textContent = "Click count: 0/5";
        messageBox.scrollIntoView({ behavior: "smooth" });

        // Disable form and share button
        form.querySelectorAll("input, button, select, textarea").forEach((el) => (el.disabled = true));
        shareBtn.disabled = true;

        // Mark as submitted
        localStorage.setItem("hasSubmitted", "false");
      } else {
        messageBox.textContent = "❌ Something went wrong. Please try again.";
      }
    } catch (error) {
      messageBox.textContent = "❌ There was an error submitting your form. Please try again.";
      console.error(error);
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = "Submit";
  });

  window.onload = () => {
    if (localStorage.getItem("hasSubmitted") === "false") {
      form.querySelectorAll("input, button, select, textarea").forEach((el) => (el.disabled = true));
      shareBtn.disabled = true;
      messageBox.textContent = "🎉 Your submission has been recorded. Thanks for being part of Tech for Girls!";
    }
  };

