fetch("pincode.csv")
  .then(response => response.text())
  .then(data => {

    const rows = data.trim().split("\n").slice(1);
    const tableBody = document.getElementById("tableBody");
    const searchInput = document.getElementById("searchInput");

    function showResults(keyword = "") {
      tableBody.innerHTML = "";

      rows.forEach(row => {
        const cols = row.split(",");

        if (cols.join(" ").toLowerCase().includes(keyword.toLowerCase())) {
          const tr = document.createElement("tr");

          for (let i = 0; i < 4; i++) {
            const td = document.createElement("td");
            td.textContent = cols[i];
            tr.appendChild(td);
          }

          tableBody.appendChild(tr);
        }
      });
    }

    showResults();

    searchInput.addEventListener("input", function () {
      showResults(this.value);
    });

  });
