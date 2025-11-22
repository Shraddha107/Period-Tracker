document.addEventListener('DOMContentLoaded', () => {
  // Load Header

  const dateInput = document.getElementById("startDate");
  if (dateInput) {
    const today = new Date();
    const pastLimit = new Date(today);
    pastLimit.setDate(today.getDate() - 90);

    function formatDateLocal(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    dateInput.max = formatDateLocal(today);
    dateInput.min = formatDateLocal(pastLimit);
  } else {
    console.warn("startDate input not found when setting min/max.");
  }

  // Form Handling
  const form = document.getElementById("periodForm");
  const nameFields = document.getElementById("nameFields"); // your container for first, last, phone
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const phoneInput = document.getElementById("phoneNumber");

  // Show/Hide name + phone fields for tracking mode
  document.querySelectorAll('input[name="mode"]').forEach(radio => {
    radio.addEventListener("change", () => {
      const show = radio.value === "track" && radio.checked;
      if(nameFields) {
        nameFields.style.display = show ? "block" : "none";
      }
      firstNameInput.required = show;
      lastNameInput.required = show;
      phoneInput.required = show;
      if (!show) {
        firstNameInput.value = "";
        lastNameInput.value = "";
        phoneInput.value = "";
      }
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const mode = document.querySelector('input[name="mode"]:checked').value;
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const phone = phoneInput.value.trim();
    const fullName = `${firstName} ${lastName}`.trim();
    const nameRegex = /^[A-Za-z\s]+$/; // only letters + spaces
    const phoneRegex = /^[0-9]{10}$/; // exactly 10 digits

    const lastPeriod = document.getElementById("startDate").value;
    const cycleType = document.getElementById("cycleType").value;
    const periodDuration = Number(document.getElementById("periodDuration").value);

    const errors = [];

    if (!lastPeriod) {
      errors.push("Start date is required.");
    }

    if (!cycleType) {
      errors.push("Please select a cycle type.");
    }

    if (isNaN(periodDuration) || periodDuration < 1 || periodDuration > 10) {
      errors.push("Period duration must be between 1–10 days.");
    }

    if (mode === "track") {
    if (!firstName) errors.push("First name is required for tracking.");
    else if (!nameRegex.test(firstName)) errors.push("First name can only have letters.");

    if (!lastName) errors.push("Last name is required for tracking.");
    else if (!nameRegex.test(lastName)) errors.push("Last name can only have letters.");

    if (!phone) errors.push("Phone number is required for tracking.");
    else if (!phoneRegex.test(phone)) errors.push("Phone must be exactly 10 digits.");
}

    if (errors.length > 0) {
      return Swal.fire({
        iconHtml: '❗',
        title: "Check your input!",
        html: errors.join("<br>"),
        confirmButtonText: "Okay!",
        customClass: {
          popup: 'rounded-swal',
          confirmButton: 'swal-button-custom'
        }
      });
    }

    if (mode === "track") {
      const url = "http://localhost:8000/submit";
      const payload = {
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
        start_date: lastPeriod,
        cycle_type: cycleType,
        period_duration: periodDuration
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("userName", fullName);
          localStorage.setItem("userPhone", phone);
          localStorage.setItem("predictions", JSON.stringify(data));

          Swal.fire({
            iconHtml: '🗓',
            title: "Tracked!",
            text: "Redirecting to calendar...",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: 'rounded-swal'
            }
          }).then(() => {
            window.location.href = "calendar.html";
          });
        } else {
          throw new Error("Tracking failed");
        }
      } catch (err) {
        Swal.fire({
          title: "Network issue",
          text: "Fix your connection and retry!",
          confirmButtonText: "Okay",
          customClass: {
            popup: 'rounded-swal',
            confirmButton: 'swal-button-custom'
          }
        });
      }

    } else {
      // QUICK PREDICTION MODE
      let cycleLength;
      if (cycleType === "short") cycleLength = 22;
      else if (cycleType === "normal") cycleLength = 28;
      else if (cycleType === "long") cycleLength = 36;

      const startDateObj = new Date(lastPeriod);
      const nextPeriodDate = new Date(startDateObj);
      nextPeriodDate.setDate(startDateObj.getDate() + cycleLength);

      Swal.fire({
        iconHtml: '🩸',
        title: "Quick Prediction",
        html: `Your next period is predicted to start on:<br><strong>${nextPeriodDate.toDateString()}</strong><br><br>Check out our guide on <a href="products.html">products</a> and <a href="suggestions.html">tips</a> while you wait!`,
        confirmButtonText: "Done",
        customClass: {
          popup: 'rounded-swal',
          confirmButton: 'swal-button-custom'
        }
      });
    }
  });
});