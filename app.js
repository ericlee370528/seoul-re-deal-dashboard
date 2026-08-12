(function () {
  var STORAGE_KEY = "dealDashboard.deals";
  var SEED_VERSION_KEY = "dealDashboard.seedVersion";
  var SEED_VERSION = "2026-08-seoul-only";

  // ---------------------------------------------------------------
  // 실제 언론 보도·공시를 근거로 정리한 부동산 PF·실물 인수 딜 데이터.
  // 대상 지역은 서울로 제한한다(서울 외 지역 딜은 수집 대상에서 제외).
  // 각 딜의 referenceLinks는 실제 기사 URL이며, 확인되지 않은 값은
  // amountEok:null 또는 "미확인" 문자열로 표시한다. 절대 추측 값을
  // 채우지 않는다. 최초 실행 시 localStorage에 시드로 저장되고,
  // 이후에는 localStorage 값을 그대로 사용한다(SEED_VERSION이 바뀌면
  // 최신 시드로 다시 갱신한다).
  // ---------------------------------------------------------------
  var SEED_DEALS = [
    {
      id: "D-2026-R01",
      dealName: "여의도 하나증권빌딩 인수",
      dealType: "실물인수",
      assetType: "오피스",
      region: "영등포구",
      stage: "클로징",
      amountKrwRaw: 811200000000,
      amountEok: 8112,
      leadArrangers: ["하나증권(매수, 우선매수권 행사)"],
      participants: ["코람코자산신탁(매도)"],
      createdAt: "2026-01-16",
      updatedAt: "2026-06-30",
      summary: "코람코자산신탁이 보유하던 여의도 하나증권빌딩을 하나증권이 우선매수권을 행사해 인수. 2026년 1월 매각 절차 본격화가 보도됐고, 2026년 2분기 서울 오피스 매매 통계(부동산플래닛 빅데이터)에 8,112억원 거래로 집계·확인됨. 정확한 거래 일자는 개별 공개되지 않아 2분기말로 표기함.",
      progressNotes: [
        { date: "2026-01-16", note: "코람코자산신탁, 매각 절차 본격화 보도(하나증권 우선매수권 보유)" },
        { date: "2026-06-30", note: "2026년 2분기 서울 오피스 매매 통계에 8,112억원 거래로 집계·확인(정확한 일자 비공개)" }
      ],
      referenceLinks: [
        { label: "이투데이 - 조 단위 매물 줄줄이…서울 오피스 '큰 장' 섰다 (2026-01-16)", url: "https://www.etoday.co.kr/news/view/2546057" },
        { label: "스포츠경향 - 2분기 서울 오피스빌딩 매매거래금액 1.7조 돌파 (2026-08-12)", url: "https://sports.khan.co.kr/article/202608120321003/" }
      ]
    },
    {
      id: "D-2026-R02",
      dealName: "이마트타워(오렌지센터) 인수",
      dealType: "실물인수",
      assetType: "오피스",
      region: "중구",
      stage: "클로징",
      amountKrwRaw: 350000000000,
      amountEok: 3500,
      leadArrangers: ["한화리츠(한화위탁관리부동산투자회사)"],
      participants: ["NH-Amundi일반사모부동산투자신탁12호(매도)"],
      createdAt: "2026-03-12",
      updatedAt: "2026-06-05",
      summary: "한화리츠가 서울 중구 순화동 이마트타워(오렌지센터, 지하6층~지상19층, 연면적 약 3만4,173㎡)를 NH-Amundi일반사모부동산투자신탁12호로부터 3,500억원에 인수 완료. 이마트가 전체 면적 98%를 단일 임차 중이며 잔여 임대기간 7년.",
      progressNotes: [
        { date: "2026-03-12", note: "한화리츠, 매각 입찰 우선협상대상자 선정" },
        { date: "2026-05-20", note: "본계약 체결" },
        { date: "2026-06-05", note: "자산 양수도(인수) 완료" }
      ],
      referenceLinks: [
        { label: "디지털데일리 - 한화리츠, 순화동 '오렌지센터' 3500억원에 인수 완료 (2026-06-05)", url: "https://www.ddaily.co.kr/page/view/2026060516155117066" },
        { label: "이비엔뉴스 - 한화리츠, 이마트타워 본계약 체결…6월초 인수 완료 목표", url: "https://www.ebn.co.kr/news/articleView.html?idxno=1709560" }
      ]
    },
    {
      id: "D-2026-R03",
      dealName: "종로 하나손해보험빌딩 매매",
      dealType: "실물인수",
      assetType: "오피스",
      region: "종로구",
      stage: "클로징",
      amountKrwRaw: 136900000000,
      amountEok: 1369,
      leadArrangers: ["미확인(매수자 비공개)"],
      participants: ["미확인(매도자 비공개)"],
      createdAt: "2026-06-30",
      updatedAt: "2026-06-30",
      summary: "종로구 인의동 하나손해보험빌딩이 2026년 2분기 중 1,369억원에 거래된 것으로 부동산플래닛 빅데이터 집계에서 확인됨. 매수자·매도자와 정확한 거래 일자는 해당 통계에 공개되지 않아 미확인으로 표시함.",
      progressNotes: [
        { date: "2026-06-30", note: "2026년 2분기 서울 오피스 매매 통계에 1,369억원 거래로 집계·확인" }
      ],
      referenceLinks: [
        { label: "스포츠경향 - 2분기 서울 오피스빌딩 매매거래금액 1.7조 돌파 (2026-08-12)", url: "https://sports.khan.co.kr/article/202608120321003/" },
        { label: "아이뉴스24 - 서울 오피스빌딩 거래액 1.8조…직전 분기 대비 79%↑ (2026-08-11)", url: "http://inews24.com/view/1993917" }
      ]
    },
    {
      id: "D-2026-R04",
      dealName: "에이원타워 당산 인수",
      dealType: "실물인수",
      assetType: "오피스",
      region: "영등포구",
      stage: "계약체결",
      amountKrwRaw: 163000000000,
      amountEok: 1630,
      leadArrangers: ["삼성FN리츠(매수)"],
      participants: ["NH올원리츠(매도)"],
      createdAt: "2026-04-16",
      updatedAt: "2026-07-28",
      summary: "삼성FN리츠가 NH올원리츠 보유 에이원타워 당산(영등포구 국회대로 559)을 1,630억원에 인수 추진 중. 2026년 4월 우선협상대상자 선정 후 실사를 거쳐 8월 거래종결(잔금)을 목표로 진행 중이며, 실제 완료 여부는 본 데이터 갱신 시점(2026-08-12) 기준 아직 보도로 확인되지 않음. 임대율 100%, 삼성 금융계열사가 87.3% 임차.",
      progressNotes: [
        { date: "2026-04-16", note: "우선협상대상자 선정, 실사 착수" },
        { date: "2026-07-28", note: "거래금액 1,630억원 확인 보도, 8월 거래종결 목표로 진행 중" }
      ],
      referenceLinks: [
        { label: "네이트뉴스 - 삼성FN리츠, '에이원타워 당산' 우선협상대상자 선정 (2026-04-16)", url: "https://news.nate.com/view/20260416n29025" },
        { label: "이투데이 - 빌딩 팔아 배당하고 새 부동산 투자…리츠도 '리밸런싱' 승부수 (2026-07-28)", url: "https://www.etoday.co.kr/news/view/2608298" }
      ]
    },
    {
      id: "D-2026-R05",
      dealName: "청담동 복합개발 PF 브릿지론 연장",
      dealType: "PF",
      assetType: "복합(호텔·주거·오피스텔)",
      region: "강남구",
      stage: "브릿지",
      amountKrwRaw: 700000000000,
      amountEok: 7000,
      leadArrangers: ["KB증권(대주단 주관)"],
      participants: ["신세계청담PFV(시행)", "신세계프라퍼티(최대주주, 지분 50%)", "신세계건설(시공)"],
      createdAt: "2026-06-24",
      updatedAt: "2026-06-16",
      summary: "신세계청담PFV가 시행하는 강남구 청담동 복합개발사업(지상 38층, 5성급 호텔 74실·공동주택 29가구·오피스텔 20실 등)의 7,000억원 브릿지론 만기를 2026년 6월 24일에서 9월 22일로 연장. 2026년 9월 본PF 전환 예정, 준공 목표는 2030년.",
      progressNotes: [
        { date: "2026-06-16", note: "브릿지론 만기 2026-06-24 → 2026-09-22로 연장 보도, 9월 본PF 전환 예정 공개" }
      ],
      referenceLinks: [
        { label: "마켓인(이데일리) - 청담동 프리마호텔 부지, 랜드마크 개발 '속도'…브릿지론 9월로 연장 (2026-06-16)", url: "https://marketin.edaily.co.kr/News/Read?newsId=04086886645482376" }
      ]
    },
    {
      id: "D-2026-R07",
      dealName: "성수동 지식산업센터 PF 리파이낸싱",
      dealType: "PF",
      assetType: "지식산업센터",
      region: "성동구",
      stage: "본PF",
      amountKrwRaw: 90500000000,
      amountEok: 905,
      leadArrangers: ["기존 대주단(리파이낸싱)"],
      participants: ["성수초이앤손제2호PFV(시행)", "요진건설산업(시공)"],
      createdAt: "2025-07-01",
      updatedAt: "2026-06-08",
      summary: "2025년 7월 준공한 성수동 지식산업센터 개발 PF(성수초이앤손제2호PFV)를 기존 1,000억원(트렌치A 800억·B 200억)에서 905억원(트렌치A 750억·B 155억) 규모로 리파이낸싱하고 만기를 2027년 11월 28일로 연장. 개별 호실 분양 대신 선임차 후 통매각 전략을 취하고 있음.",
      progressNotes: [
        { date: "2025-07-01", note: "건물 준공" },
        { date: "2026-06-08", note: "905억원 규모로 리파이낸싱, 만기 2027-11-28로 연장 보도" }
      ],
      referenceLinks: [
        { label: "딜사이트 - \"성수동도 안돼\" 성수 지식산업센터, 선임차·통매각 추진 (2026-06-08)", url: "https://dealsite.co.kr/articles/162893" }
      ]
    }
  ];

  function loadDeals() {
    var storedVersion = localStorage.getItem(SEED_VERSION_KEY);
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw || storedVersion !== SEED_VERSION) {
      saveDeals(SEED_DEALS);
      localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);
      return SEED_DEALS;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      saveDeals(SEED_DEALS);
      localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);
      return SEED_DEALS;
    }
  }

  function saveDeals(deals) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
  }

  var DEALS = loadDeals();

  var state = {
    period: "2026",
    dealTypes: new Set(["PF", "실물인수"]),
    assetTypes: new Set(uniqueValues("assetType")),
    selectedGu: null, // null = 서울 전체(자치구 미선택)
    minAmount: 0,
    maxAmount: 9000,
    sortKey: "updatedAt"
  };

  function uniqueValues(field) {
    var seen = {}; var out = [];
    DEALS.forEach(function (d) { if (!seen[d[field]]) { seen[d[field]] = true; out.push(d[field]); } });
    return out;
  }

  function fmt0(n) { return Math.round(n).toLocaleString("ko-KR"); }

  function withinPeriod(deal) {
    if (state.period === "all") return true;
    // "2026": 2026년 1월 1일 이후 발생/업데이트된 딜 전체
    var updated = new Date(deal.updatedAt + "T00:00:00");
    var yearStart = new Date(state.period + "-01-01T00:00:00");
    return updated >= yearStart;
  }

  function applyFilters() {
    var result = DEALS.filter(function (d) {
      var amountOk = (d.amountEok === null || d.amountEok === undefined) ||
        (d.amountEok >= state.minAmount && d.amountEok <= state.maxAmount);
      return withinPeriod(d) &&
        state.dealTypes.has(d.dealType) &&
        state.assetTypes.has(d.assetType) &&
        (!state.selectedGu || d.region === state.selectedGu) &&
        amountOk;
    });
    result.sort(function (a, b) {
      if (state.sortKey === "amount") {
        var av = a.amountEok === null || a.amountEok === undefined ? -1 : a.amountEok;
        var bv = b.amountEok === null || b.amountEok === undefined ? -1 : b.amountEok;
        return bv - av;
      }
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
    return result;
  }

  function renderChips(containerId, values, activeSet) {
    var container = document.getElementById(containerId);
    container.innerHTML = "";
    values.forEach(function (v) {
      var chip = document.createElement("span");
      chip.className = "chip" + (activeSet.has(v) ? " active" : "");
      chip.textContent = v;
      chip.tabIndex = 0;
      chip.addEventListener("click", function () {
        if (activeSet.has(v)) { activeSet.delete(v); } else { activeSet.add(v); }
        chip.classList.toggle("active");
        refresh();
      });
      container.appendChild(chip);
    });
  }

  function renderKPI(deals) {
    var kpiRow = document.getElementById("kpiRow");
    kpiRow.innerHTML = "";

    var withAmount = deals.filter(function (d) { return d.amountEok !== null && d.amountEok !== undefined; });
    var totalEok = withAmount.reduce(function (sum, d) { return sum + d.amountEok; }, 0);
    var unconfirmedCount = deals.length - withAmount.length;
    var pfCount = deals.filter(function (d) { return d.dealType === "PF"; }).length;
    var acqCount = deals.length - pfCount;
    var pfPct = deals.length ? Math.round((pfCount / deals.length) * 100) : 0;
    var acqPct = deals.length ? 100 - pfPct : 0;

    var tile1 = document.createElement("div");
    tile1.className = "tile accent-1";
    tile1.innerHTML =
      '<div class="label">신규/업데이트 딜 건수</div>' +
      '<div class="value">' + deals.length + '건</div>' +
      '<div class="note">현재 필터 조건 기준</div>';
    kpiRow.appendChild(tile1);

    var tile2 = document.createElement("div");
    tile2.className = "tile accent-2";
    var note2 = fmt0(totalEok) + '억원 = 금액이 확인된 ' + withAmount.length + '건 딜규모(억원) 합계';
    if (unconfirmedCount > 0) note2 += ' (금액 미확인 ' + unconfirmedCount + '건 제외)';
    tile2.innerHTML =
      '<div class="label">총 딜 규모 합계</div>' +
      '<div class="value">' + fmt0(totalEok) + '억원</div>' +
      '<div class="note">' + note2 + '</div>';
    kpiRow.appendChild(tile2);

    var tile3 = document.createElement("div");
    tile3.className = "tile";
    tile3.innerHTML =
      '<div class="label">PF / 실물인수 비중</div>' +
      '<div class="value">' + pfPct + '% / ' + acqPct + '%</div>' +
      '<div class="split">' +
        '<span><span class="dot" style="background:var(--badge-pf)"></span>PF ' + pfCount + '건</span>' +
        '<span><span class="dot" style="background:var(--badge-acq)"></span>실물인수 ' + acqCount + '건</span>' +
      '</div>';
    kpiRow.appendChild(tile3);
  }

  function badgeHtml(dealType) {
    var cls = dealType === "PF" ? "pf" : "acq";
    return '<span class="badge ' + cls + '">' + dealType + '</span>';
  }

  function amountCellHtml(d) {
    if (d.amountEok === null || d.amountEok === undefined) {
      return '<td class="amount" title="금액 비공개">미확인</td>';
    }
    return '<td class="amount" title="' + fmt0(d.amountEok) + '억원 = ' + d.amountKrwRaw.toLocaleString("ko-KR") + '원 ÷ 100,000,000">' + fmt0(d.amountEok) + '</td>';
  }

  function renderList(deals) {
    var tbody = document.getElementById("listBody");
    tbody.innerHTML = "";
    document.getElementById("listCount").textContent = deals.length + "건 표시 중 (전체 " + DEALS.length + "건)";

    if (!deals.length) {
      var emptyTr = document.createElement("tr");
      emptyTr.className = "empty-row";
      emptyTr.innerHTML = '<td colspan="8">조건에 맞는 딜이 없습니다.</td>';
      tbody.appendChild(emptyTr);
      return;
    }

    deals.forEach(function (d) {
      var tr = document.createElement("tr");
      var partyText = d.leadArrangers.join(", ") + (d.participants.length ? " 외 " + d.participants.length + "곳" : "");
      tr.innerHTML =
        "<td>" + badgeHtml(d.dealType) + "</td>" +
        "<td>" + d.dealName + "</td>" +
        "<td>" + d.assetType + "</td>" +
        '<td class="region-col">' + d.region + "</td>" +
        amountCellHtml(d) +
        '<td class="stage-col">' + d.stage + "</td>" +
        "<td>" + partyText + "</td>" +
        "<td>" + d.updatedAt + "</td>";
      tr.addEventListener("click", function () { openDetail(d.id); });
      tbody.appendChild(tr);
    });
  }

  function openDetail(id) {
    var d = DEALS.filter(function (x) { return x.id === id; })[0];
    if (!d) return;
    var content = document.getElementById("detailContent");
    var timelineHtml = d.progressNotes.map(function (p) {
      return '<div class="timeline-item"><div class="tdate">' + p.date + '</div>' + p.note + '</div>';
    }).join("");
    var linksHtml = d.referenceLinks.map(function (l) {
      return '<a href="' + l.url + '" target="_blank" rel="noopener">' + l.label + '</a>';
    }).join("<br>");

    var amountBlock, amountCalc;
    if (d.amountEok === null || d.amountEok === undefined) {
      amountBlock = "미확인";
      amountCalc = "공개 자료에서 거래금액이 확인되지 않음";
    } else {
      amountBlock = fmt0(d.amountEok) + "억원";
      amountCalc = fmt0(d.amountEok) + "억원 = " + d.amountKrwRaw.toLocaleString("ko-KR") + "원 ÷ 100,000,000";
    }

    content.innerHTML =
      '<div class="badges">' + badgeHtml(d.dealType) +
        '<span class="badge tag">' + d.assetType + '</span>' +
        '<span class="badge tag">' + d.region + '</span>' +
        '<span class="badge stage">' + d.stage + '</span></div>' +
      '<h3>' + d.dealName + '</h3>' +
      '<div class="amount-block">' + amountBlock + '</div>' +
      '<div class="amount-calc">' + amountCalc + '</div>' +
      '<div class="field"><div class="flabel">딜 개요</div><div class="fval">' + d.summary + '</div></div>' +
      '<div class="field"><div class="flabel">주선사/매수측</div><div class="fval">' + d.leadArrangers.join(", ") + '</div></div>' +
      '<div class="field"><div class="flabel">참여사/매도측</div><div class="fval">' + d.participants.join(", ") + '</div></div>' +
      '<div class="field"><div class="flabel">진행 경과</div><div class="fval">' + timelineHtml + '</div></div>' +
      '<div class="field"><div class="flabel">등록일 / 업데이트일</div><div class="fval">' + d.createdAt + ' / ' + d.updatedAt + '</div></div>' +
      '<div class="field"><div class="flabel">출처(원문 링크)</div><div class="fval">' + linksHtml + '</div></div>';

    document.getElementById("overlay").classList.add("open");
    document.getElementById("detailPanel").classList.add("open");
  }

  function closeDetail() {
    document.getElementById("overlay").classList.remove("open");
    document.getElementById("detailPanel").classList.remove("open");
  }

  document.getElementById("overlay").addEventListener("click", closeDetail);
  document.getElementById("closeDetailBtn").addEventListener("click", closeDetail);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDetail(); });

  document.getElementById("periodSelect").addEventListener("change", function (e) {
    state.period = e.target.value;
    refresh();
  });
  document.getElementById("sortSelect").addEventListener("change", function (e) {
    state.sortKey = e.target.value;
    refresh();
  });
  document.getElementById("minAmount").addEventListener("input", function (e) {
    state.minAmount = Number(e.target.value) || 0;
    refresh();
  });
  document.getElementById("maxAmount").addEventListener("input", function (e) {
    state.maxAmount = Number(e.target.value) || 0;
    refresh();
  });
  document.getElementById("resetBtn").addEventListener("click", function () {
    state.period = "2026";
    state.dealTypes = new Set(["PF", "실물인수"]);
    state.assetTypes = new Set(uniqueValues("assetType"));
    state.selectedGu = null;
    state.minAmount = 0;
    state.maxAmount = 9000;
    state.sortKey = "updatedAt";
    document.getElementById("periodSelect").value = "2026";
    document.getElementById("sortSelect").value = "updatedAt";
    document.getElementById("minAmount").value = 0;
    document.getElementById("maxAmount").value = 9000;
    renderChips("dealTypeChips", ["PF", "실물인수"], state.dealTypes);
    renderChips("assetTypeChips", uniqueValues("assetType"), state.assetTypes);
    updateMapActiveClasses();
    updateMapStatus();
    refresh();
  });

  // ---------- Seoul district map ----------
  function guDealCounts() {
    var counts = {};
    DEALS.forEach(function (d) { counts[d.region] = (counts[d.region] || 0) + 1; });
    return counts;
  }

  function updateMapStatus() {
    var statusEl = document.getElementById("regionStatus");
    if (!state.selectedGu) {
      statusEl.textContent = "서울 전체 자치구 표시 중 (진하게 칠해진 구에 딜이 있습니다)";
    } else {
      var count = DEALS.filter(function (d) { return d.region === state.selectedGu; }).length;
      statusEl.textContent = state.selectedGu + " 선택됨 · 딜 " + count + "건";
    }
  }

  function updateMapActiveClasses() {
    var paths = document.querySelectorAll("#seoulMap .gu-path");
    paths.forEach(function (p) {
      p.classList.toggle("active", state.selectedGu === p.getAttribute("data-gu"));
    });
  }

  function initMap() {
    var counts = guDealCounts();
    var paths = document.querySelectorAll("#seoulMap .gu-path");
    var labelsGroup = document.getElementById("guLabels");
    paths.forEach(function (p) {
      var gu = p.getAttribute("data-gu");
      if (counts[gu]) p.classList.add("has-deals");
      p.addEventListener("click", function () {
        state.selectedGu = (state.selectedGu === gu) ? null : gu;
        updateMapActiveClasses();
        updateMapStatus();
        refresh();
      });
      var bbox = p.getBBox();
      var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", bbox.x + bbox.width / 2);
      text.setAttribute("y", bbox.y + bbox.height / 2);
      text.setAttribute("class", "gu-label");
      text.textContent = gu;
      labelsGroup.appendChild(text);
    });
    document.getElementById("mapResetBtn").addEventListener("click", function () {
      state.selectedGu = null;
      updateMapActiveClasses();
      updateMapStatus();
      refresh();
    });
    updateMapStatus();
  }

  function refresh() {
    var filtered = applyFilters();
    renderList(filtered);
    renderKPI(filtered);
  }

  renderChips("dealTypeChips", ["PF", "실물인수"], state.dealTypes);
  renderChips("assetTypeChips", uniqueValues("assetType"), state.assetTypes);
  initMap();
  refresh();
})();
