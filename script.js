fetch("pincode.csv")
  .then(res => res.text())
  .then(text => {

    // Remove BOM and split lines
    const lines = text.replace(/\ufeff/g, "").trim().split("\n");

    // Parse TSV safely and ignore bad rows
    const rows = lines
      .slice(1)
      .map(line => line.split("\t").map(v => v.trim()))
      .filter(r => r.length >= 6 && r[5]); // state must exist

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
    const states = [...new Set(rows.map(r => r[COL.state]))]
      .filter(s => s && s !== "undefined")
      .sort();

    states.forEach(state => {
      const opt = document.createElement("option");
      opt.value = state;
      opt.textContent = state;
      stateSelect.appendChild(opt);
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
          .filter(Boolean)
      )].sort();

      districts.forEach(d => {
        districtSelect.appendChild(new Option(d, d));
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
          officeSelect.appendChild(
            new Option(r[COL.office], r[COL.office])
          );
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
          tableBody.insertAdjacentHTML("beforeend", `
            <tr>
              <td>${r[COL.office]}</td>
              <td>${r[COL.pincode]}</td>
              <td>${r[COL.officetype]}</td>
              <td>${r[COL.delivery]}</td>
              <td>${r[COL.district]}</td>
              <td>${r[COL.state]}</td>
            </tr>
          `);
        });
    });

    function reset(select, label) {
      select.innerHTML = `<option value="">${label}</option>`;
    }
  })
  .catch(err => console.error("CSV error:", err));
