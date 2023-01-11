const fetchData = async () => {
  try {
    const data = await fetch(`/src/data.json`).then((res) => res.json());

    return data;
  } catch (err) {}
};

const render = async () => {
  const raw = await fetchData();
  if (!raw) {
    console.error("테이블 데이터가 없습니다.");
    return;
  }

  const table = document.querySelector("#table");
  const dropdownElement = document.querySelector("#dropdown");
  const paginationElement = document.querySelector("#pagination");

  let currentShowPageNum = 5;
  let currentPageIndex = 1;
  let getCurrentPageNum = () => Math.round(raw.length / currentShowPageNum);

  const getHead = () => Object.keys(raw[0]);
  const getBody = () => {
    const start = currentShowPageNum * (currentPageIndex - 1);
    const end = currentShowPageNum * currentPageIndex;
    // 5 10 15 20 25

    const body = raw.slice(start, end);

    return body;
  };

  const renderTableHead = () => {
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    thead.className = "table-head";

    const head = getHead();

    for (let title of head) {
      const th = document.createElement("th");
      th.innerText = title;
      tr.appendChild(th);
    }

    thead.appendChild(tr);

    return thead;
  };

  const renderTableBody = () => {
    const body = getBody();
    const tBody = document.createElement("tbody");

    for (let [index, row] of Object.entries(body)) {
      const tr = document.createElement("tr");
      for (let field of Object.values(row)) {
        const td = document.createElement("td");
        if (index % 2 === 1) tr.className = "odd";

        td.innerText = field;
        tr.appendChild(td);
      }
      tBody.appendChild(tr);
    }

    return tBody;
  };

  const pageControlRender = () => {
    const leftButtonElement = document.createElement("button");
    const rightButtonElement = document.createElement("button");

    leftButtonElement.innerText = "<<";
    leftButtonElement.className = "arrow";
    leftButtonElement.addEventListener("click", (e) => {
      updatePageNum(1);
    });
    rightButtonElement.innerText = ">>";
    rightButtonElement.className = "arrow";
    rightButtonElement.addEventListener("click", (e) => {
      updatePageNum(getCurrentPageNum());
    });

    paginationElement.appendChild(leftButtonElement);

    for (let i = 1; i <= getCurrentPageNum(); i++) {
      const buttonElement = document.createElement("button");
      buttonElement.addEventListener("click", () => {
        updatePageNum(i);
      });
      buttonElement.innerText = i;
      if (i === currentPageIndex) {
        buttonElement.style.color = "red";
      }

      // 현재 페이지 수와 매칭될 경우 color red
      // 현재 페이지 클릭할 경우 페이지 넘버 변경
      paginationElement.appendChild(buttonElement);
    }

    paginationElement.appendChild(rightButtonElement);

    return paginationElement;
  };

  const renderDropdown = () => {
    // 현재 페이지 수에 맞춰서
    // 즉, 현재 보여지는 페이지 수가 5이면, 5 10 15 20
    // 현재 보여지는 페이지 수가 10이면 10, 20, 30

    const selectElement = document.createElement("select");

    // 5, 15개씩
    for (let pageNum of [5, 15]) {
      const optionElement = document.createElement("option");
      optionElement.innerText = pageNum;
      optionElement.value = pageNum;
      if (pageNum === currentShowPageNum) optionElement.selected = true;
      selectElement.appendChild(optionElement);
    }

    selectElement.addEventListener("change", (e) => {
      updateShowPageNum(parseInt(e.target.value));
    });

    dropdownElement.appendChild(selectElement);
  };

  const renderTable = () => {
    const tableElement = document.createElement("table");
    for (const element of [renderTableHead(), renderTableBody()]) {
      tableElement.appendChild(element);
    }

    table.appendChild(tableElement);
  };

  const _render = () => {
    table.innerHTML = "";
    paginationElement.innerHTML = "";
    dropdownElement.innerHTML = "";
    renderTable();
    pageControlRender();
    renderDropdown();
  };

  const updatePageNum = (num) => {
    if (num > getCurrentPageNum()) {
      console.error(
        `지정 가능한 페이지 수를 넘었습니다. 현재 페이지 수 ${maximum}`
      );
      return;
    }

    console.log(`페이지가 변경됐습니다. ${num}`);
    currentPageIndex = num;
    _render();
  };

  const updateShowPageNum = (num) => {
    // 전체 데이터 길이를 넘어설 수 없음
    if (num > raw.length) {
      console.error(
        `최대 열람 가능한 수를 넘었습니다. 현재 데이터 수 ${raw.length}`
      );
      return;
    }
    console.log(`현재 보여질 필드 수가 바뀌었습니다. ${num}`);
    currentPageIndex = 1;
    currentShowPageNum = num;
    _render();
  };

  _render();
};

render();
