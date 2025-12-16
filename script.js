fetch("pincode.csv")
  .then(response => response.text())
  .then(text => {

    const data = text.trim().split("\n").slice(1).map(r => r.split(","));

    const stateSelect = document.getElementById("stateSelect");
    const districtSelect = document.getElementById("districtSelect");
    const searchInput = document.getElementById("searchInput");
    const tableBody = document.getElementById("tableBody");

    // Column index mapping
    const COL = {
      office: 0,
      pincode: 1,
      officetype: 2,
      delivery: 3,
      district: 4,
      state: 5
    };

    /* -------------------------
       Populate State Dropdown
    --------------------------*/
    const states = [...new Set(data.map(r => r[COL.state]))].sort();
    states.forEach(state => {
      stateSelect.innerHTML += `<option value="${state}">${state}</option>`;
    });

    /* -------------------------
       On State Change
    --------------------------*/
    stateSelect.addEventListener("change", () => {

      districtSelect.innerHTML = `<option value="">Select District</option>`;
      searchInput.value = "";
      tableBody.innerHTML = "";

      if (stateSelect.value === "") return;

      const districts = [...new Set(
        data
          .filter(r => r[COL.state] === stateSelect.value)
          .map(r => r[COL.district])
      )].sort();

      districts.forEach(d => {
        districtSelect.innerHTML += `<option value="${d}">${d}</option>`;
      });

      renderResults();
    });

    /* -------------------------
       On District Change
    --------------------------*/
    districtSelect.addEventListener("change", () => {
      renderResults();
    });

    /* -------------------------
       On Search Input
    --------------------------*/
    let timer;
    searchInput.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(renderResults, 300);
    });

    /* -------------------------
       Render Table
    --------------------------*/
    function renderResults() {

      tableBody.innerHTML = "";
      let count = 0;

      const keyword = searchInput.value.toLowerCase();

      data.forEach(r => {

        if (
          (stateSelect.value === "" || r[COL.state] === stateSelect.value) &&
          (districtSelect.value === "" || r[COL.district] === districtSelect.value) &&
          r.join(" ").toLowerCase().includes(keyword)
        ) {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${r[COL.office]}</td>
            <td>${r[COL.pincode]}</td>
            <td>${r[COL.officetype]}</td>
            <td>${r[COL.delivery]}</td>
            <td>${r[COL.district]}</td>
            <td>${r[COL.state]}</td>
          `;
          tableBody.appendChild(tr);

          count++;
          if (count >= 100) return;
        }
      });
    }

  })
  .catch(err => {
    console.error("Error loading CSV:", err);
  });
