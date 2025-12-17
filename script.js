fetch("pincode.csv")
  .then(res => res.text())
  .then(text => {

    // IMPORTANT: TAB separated CSV
    const rows = text
      .trim()
      .split("\n")
      .slice(1)
      .map(r => r.split("\t").map(v => v.trim()));

    const stateSelect = document.getElementById("stateSelect");
    const districtSelect = document.getElementById("districtSelect");
    const officeSelect = document.getElementById("officeSelect");
    const tableBody = document.getElementById("tableBody");

    const COL = {
      office: 0,
      pincode: 1,
      officetype: 2,
      delivery: 3,
      district: 4,
      state: 5
    };

    /* ---------- Populate State ---------- */
    const states = [...new Set(rows.map(r => r[COL.state]))].sort();
    states.forEach(s => {
      stateSelect.innerHTML += `<option value="${s}">${s}</option>`;
    });

    /* ---------- State Change ---------- */
    stateSelect.addEventListener("change", () => {
      reset(districtSelect, "Select District");
      reset(officeSelect, "Select Post Office");
      tableBody.innerHTML = "";

      if (!stateSelect.value) return;

      const districts = [...new Set(
        rows
          .filter(r => r[COL.state] === stateSelect.value)
          .map(r => r[COL.district])
      )].sort();

      districts.forEach(d => {
        districtSelect.innerHTML += `<option value="${d}">${d}</option>`;
      });
    });

    /* ---------- District Change ---------- */
    districtSelect.addEventListener("change", () => {
      reset(officeSelect, "Select Post Office");
      tableBody.innerHTML = "";

      if (!districtSelect.value) return;

      rows
        .filter(r =>
          r[COL.state] === stateSelect.value &&
          r[COL.district] === districtSelect.value
        )
        .forEach(r => {
          officeSelect.innerHTML +=
            `<option value="${r[COL.office]}">${r[COL.office]}</option>`;
        });
    });

    /* ---------- Office Change ---------- */
    officeSelect.addEventListener("change", () => {
      tableBody.innerHTML = "";

      rows
        .filter(r =>
          r[COL.state] === stateSelect.value &&
          r[COL.district] === districtSelect.value &&
          r[COL.office] === officeSelect.value
        )
        .forEach(r => {
          tableBody.innerHTML += `
            <tr>
              <td>${r[COL.office]}</td>
              <td>${r[COL.pincode]}</td>
              <td>${r[COL.officetype]}</td>
              <td>${r[COL.delivery]}</td>
              <td>${r[COL.district]}</td>
              <td>${r[COL.state]}</td>
            </tr>
          `;
        });
    });

    function reset(select, text) {
      select.innerHTML = `<option value="">${text}</option>`;
    }
  })
  .catch(err => console.error("CSV load error:", err));
