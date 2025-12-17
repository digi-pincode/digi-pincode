fetch("pincode.csv")
  .then(res => res.text())
  .then(text => {

    const rows = text.trim().split("\n").slice(1).map(r => r.split(","));

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

    /* Populate State */
    [...new Set(rows.map(r => r[COL.state]))].sort()
      .forEach(state => {
        stateSelect.innerHTML += `<option value="${state}">${state}</option>`;
      });

    /* On State Change */
    stateSelect.addEventListener("change", () => {
      reset(districtSelect, "Select District");
      reset(officeSelect, "Select Post Office");
      tableBody.innerHTML = "";

      if (!stateSelect.value) return;

      [...new Set(
        rows.filter(r => r[COL.state] === stateSelect.value)
            .map(r => r[COL.district])
      )].sort().forEach(d =>
        districtSelect.innerHTML += `<option value="${d}">${d}</option>`
      );
    });

    /* On District Change */
    districtSelect.addEventListener("change", () => {
      reset(officeSelect, "Select Post Office");
      tableBody.innerHTML = "";

      if (!districtSelect.value) return;

      rows.filter(r =>
        r[COL.state] === stateSelect.value &&
        r[COL.district] === districtSelect.value
      ).forEach(r =>
        officeSelect.innerHTML += `<option value="${r[COL.office]}">${r[COL.office]}</option>`
      );
    });

    /* On Office Change */
    officeSelect.addEventListener("change", () => {
      tableBody.innerHTML = "";

      rows.filter(r =>
        r[COL.state] === stateSelect.value &&
        r[COL.district] === districtSelect.value &&
        r[COL.office] === officeSelect.value
      ).forEach(r => {
        tableBody.innerHTML += `
          <tr>
            <td>${r[COL.office]}</td>
            <td>${r[COL.pincode]}</td>
            <td>${r[COL.officetype]}</td>
            <td>${r[COL.delivery]}</td>
            <td>${r[COL.district]}</td>
            <td>${r[COL.state]}</td>
          </tr>`;
      });
    });

    function reset(select, text) {
      select.innerHTML = `<option value="">${text}</option>`;
    }
  });
