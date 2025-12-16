fetch("pincode.csv")
  .then(res => res.text())
  .then(text => {

    const rows = text.trim().split("\n").slice(1).map(r => r.split(","));
    const tbody = document.getElementById("tableBody");
    const stateSelect = document.getElementById("stateSelect");
    const districtSelect = document.getElementById("districtSelect");
    const searchInput = document.getElementById("searchInput");

    // Index mapping
    const IDX = {
      office: 0,
      pincode: 1,
      type: 2,
      delivery: 3,
      district: 4,
      state: 5
    };

    // Populate States
    [...new Set(rows.map(r => r[IDX.state]))].sort().forEach(state => {
      stateSelect.innerHTML += `<option value="${state}">${state}</option>`;
    });

    stateSelect.addEventListener("change", () => {
      districtSelect.innerHTML = `<option value="">Select District</option>`;
      [...new Set(
        rows.filter(r => r[IDX.state] === stateSelect.value)
            .map(r => r[IDX.district])
      )].sort().forEach(d => {
        districtSelect.innerHTML += `<option value="${d}">${d}</option>`;
      });
      render();
    });

    districtSelect.addEventListener("change", render);
    searchInput.addEventListener("input", debounce(render, 300));

    function render() {
      tbody.innerHTML = "";
      let count = 0;

      rows.forEach(r => {
        if (
          (stateSelect.value === "" || r[IDX.state] === stateSelect.value) &&
          (districtSelect.value === "" || r[IDX.district] === districtSelect.value) &&
          (r.join(" ").toLowerCase().includes(searchInput.value.toLowerCase()))
        ) {
          tbody.innerHTML += `
            <tr>
              <td>${r[IDX.office]}</td>
              <td>${r[IDX.pincode]}</td>
              <td>${r[IDX.type]}</td>
              <td>${r[IDX.delivery]}</td>
              <td>${r[IDX.district]}</td>
              <td>${r[IDX.state]}</td>
            </tr>`;
          if (++count >= 100) return;
        }
      });
    }

    function debounce(fn, delay) {
      let t;
      return () => {
        clearTimeout(t);
        t = setTimeout(fn, delay);
      };
    }
  });
