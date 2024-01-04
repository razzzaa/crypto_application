// ..........................................................................................................................................................................
// PRELOADER:
$(window).on("load", function () {
  setTimeout(removePreLoader, 500);

  function removePreLoader() {
    $(".loader-Wrapper").fadeOut("slow");
  }
  function setPreLoader() {
    $(".loader-Wrapper").fadeIn("slow");
  }

  //..........................................................................................................................................................................
  // STATIC ARR DECLARATION:
  let basicInfoId = [];
  let staticAdvancedInfo = [];
  let selectedCards = [];
  //..........................................................................................................................................................................
  //

  //..........................................................................................................................................................................
  // REFRESH STATIC ARR 2 MINUTES;
  const curTime = new Date();
  let lastUpdated = 0;

  if (localStorage.getItem("curTime")) {
    lastUpdated = localStorage.getItem("curTime");
  }

  if (curTime.getTime() - lastUpdated > 120000 || lastUpdated === 0) {
    mainStaticApiListCall();
    localStorage.setItem("curTime", curTime.getTime());
  }

  //..........................................................................................................................................................................
  // ARR SHUFFLE FUNCTION FOR RANDOM COINS API CALL;
  function shuffleRndCoins(coinsArr) {
    for (let i = coinsArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [coinsArr[i], coinsArr[j]] = [coinsArr[j], coinsArr[i]];
    }
    return coinsArr;
  }

  ////..........................................................................................................................................................................
  // LIVE GRAPH FUNCTION:
  function liveGraph(toggledCoinsData) {
    var dataPoints1 = [];
    var dataPoints2 = [];
    var dataPoints3 = [];
    var dataPoints4 = [];
    var dataPoints5 = [];

    console.log(dataPoints1);
    console.log(dataPoints2);
    console.log(dataPoints3);
    console.log(dataPoints4);
    console.log(dataPoints5);

    var chart = new CanvasJS.Chart("chartContainer", {
      zoomEnabled: true,
      height: 500,
      title: {
        text: "Share Value of Two Companies",
      },
      axisX: {},
      axisY: {
        prefix: "$",
        title: "Cryptocurrency Prices",
      },
      toolTip: {
        shared: true,
      },
      legend: {
        cursor: "pointer",
        verticalAlign: "top",
        fontSize: 20,
        fontColor: "dimGrey",
        itemclick: toggleDataSeries,
      },
      data: [
        {
          type: "line",
          xValueType: "dateTime",
          yValueFormatString: "$####.00",
          xValueFormatString: "hh:mm:ss TT",
          showInLegend: true,
          name: "Coin A",
          dataPoints: dataPoints1,
        },

        {
          type: "line",
          xValueType: "dateTime",
          yValueFormatString: "$####.00",
          xValueFormatString: "hh:mm:ss TT",
          showInLegend: true,
          name: "Coin B",
          dataPoints: dataPoints2,
        },

        {
          type: "line",
          xValueType: "dateTime",
          yValueFormatString: "$####.00",
          xValueFormatString: "hh:mm:ss TT",
          showInLegend: true,
          name: "Coin C",
          dataPoints: dataPoints3,
        },

        {
          type: "line",
          xValueType: "dateTime",
          yValueFormatString: "$####.00",
          xValueFormatString: "hh:mm:ss TT",
          showInLegend: true,
          name: "Coin D",
          dataPoints: dataPoints4,
        },

        {
          type: "line",
          xValueType: "dateTime",
          yValueFormatString: "$####.00",
          showInLegend: true,
          name: "Coin E",
          dataPoints: dataPoints5,
        },
      ],
    });

    function toggleDataSeries(e) {
      if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      } else {
        e.dataSeries.visible = true;
      }
      chart.render();
    }

    var updateInterval = 3000;
    // initial value
    var yValue1 = 10;
    var yValue2 = 10;
    var yValue3 = 10;
    var yValue4 = 10;
    var yValue5 = 10;

    var time = new Date();
    // starting at aurtime
    time.setHours(time.getHours());
    time.setMinutes(time.getMinutes());
    time.setSeconds(time.getSeconds());
    time.setMilliseconds(time.getMilliseconds());

    function updateChart(count) {
      count = count || 1;
      let cardSymbols = "";

      toggledCoinsData.forEach((crypto, index) => {
        cardSymbols += crypto.cardSymbol;
        if (index !== toggledCoinsData.length - 1) {
          cardSymbols += ",";
        }
        console.log(cardSymbols);
      });

      if (cardSymbols.length !== 0) {
        $.ajax({
          method: "GET",
          crossDomain: true,
          headers: {
            authorization:
              "521c5383500d5183ced0dab62d389bc2679ff66aff6ccce5152288acb3644a85",
          },
          url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${cardSymbols}&tsyms=USD&relaxedValidation=true`,
          success: function (oi) {
            console.log(oi);
            const keys = Object.keys(oi);
            usdValue = keys.map((key) => oi[key].USD);
            count = count || 1;
            console.log(usdValue);
            for (var i = 0; i < count; i++) {
              time.setTime(time.getTime() + updateInterval);

              yValue1 = usdValue[0];
              yValue2 = usdValue[1];
              yValue3 = usdValue[2];
              yValue4 = usdValue[3];
              yValue5 = usdValue[4];

              /* yValue4 = Math.round((newGraphArr[3])*100)/100;
                    yValue5 = Math.round((newGraphArr[4])*100)/100; */

              // pushing the new values
              dataPoints1.push({
                x: time.getTime(),
                y: yValue1,
              });
              dataPoints2.push({
                x: time.getTime(),
                y: yValue2,
              });
              dataPoints3.push({
                x: time.getTime(),
                y: yValue3,
              });
              dataPoints4.push({
                x: time.getTime(),
                y: yValue4,
              });
              dataPoints5.push({
                x: time.getTime(),
                y: yValue5,
              });
            }

            let stopper = Object.keys(oi).length;
            let counts = 0;
            while (counts < stopper) {
              chart.options.data[counts].legendText =
                `${toggledCoinsData[counts].cardSymbol} : $` + usdValue[counts];
              counts++;
            }
            chart.render();
          },
        });
      }
    }

    updateChart(10);
    setInterval(function () {
      updateChart();
    }, updateInterval);
  }
  ////..........................................................................................................................................................................
  // 20 RANDOMIZED COINS API APPEND;
  function rndmCryptoCall(fullCrptlist) {
    const randomizedCoins = shuffleRndCoins(fullCrptlist);
    const lessThanhndrd = randomizedCoins.slice(0, 8);
    console.log(lessThanhndrd);
    const numAjaxCalls = lessThanhndrd.length;
    console.log(numAjaxCalls);
    let numFailures = 0;
    lessThanhndrd.forEach((coins, index) => {
      const coinId = coins.id;
      $("#ytVid").remove();
      $.ajax({
        method: "GET",
        crossDomain: true,
        url: `https://api.coingecko.com/api/v3/coins/${coinId}`,
        dataType: "JSON",
        success: function (coinsInfo) {
          $("#mainCardsDiv").append(`
                <div class="card text-bg-dark rndCoinsCard">
                <div class="toggleImage">
                <div class="cryptoImg">
                <img src="${
                  coinsInfo.image.large
                }" class="card-img-top rndCardImg mt-3" alt="...">
                </div>
                </div>
                <div class="card-body">
                <h5 class="card-title">${coinsInfo.symbol}</h5>
                <div>
                <button type="button" class="btn btn-outline-success" data-bs-toggle="modal"
                data-bs-target="#exampleModal${index + 101}">
                <i class="fa-solid fa-circle-info">exchange rate</i>
                </button>
                <div class="modal fade" id="exampleModal${
                  index + 101
                }" tabindex="-1" aria-labelledby="exampleModalLabel2"
                aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content text-bg-dark">
                <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel2">Crypto Currency Price</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal"
                aria-label="Close"></button>
                </div>
                <div class="modal-body">
                <h3>ILS: &#8362; ${coinsInfo.market_data.current_price.ils}</h>
                <h3>USD: &#36; ${coinsInfo.market_data.current_price.usd}</h>
                <h3>EUR: &#128; ${coinsInfo.market_data.current_price.eur}</h>
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-secondary"
                data-bs-dismiss="modal">Close</button>
                </div>
                </div>
                </div>
                </div>

                <p class="card-text">${coinsInfo.name}</p>
                <button type="button" class="btn btn-success" data-bs-toggle="modal"
                data-bs-target="#exampleModal${index + 1}">
                More Info
                </button>
                <div class="modal fade" id="exampleModal${
                  index + 1
                }" tabindex="-1" aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content text-bg-dark">
                <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Coin Info</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal"
                aria-label="Close"></button>
                </div>
                <div class="modal-body">
                ${coinsInfo.description.en}
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-secondary"
                data-bs-dismiss="modal">Close</button>
                </div>
                </div>
                </div>
                </div>
                </div>
                </div> `);
        },
        error: function () {
          numFailures++;
        },
        complete: function () {
          if (numFailures === numAjaxCalls) {
            $("#mainCardsDiv")
              .append(`<iframe id='ytVid' width="560" height="560" src="https://www.youtube.com/embed/__bNjF-xR1U"
                    title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`);
            $("#fuckingCoinGeckoLimitationsNshit").modal("show");
            setTimeout(() => {
              rndmCryptoCall(fullCrptlist);
            }, 120000);
          }
        },
      });
    });
  }

  //..........................................................................................................................................................................
  // MAIN FULL LIST API CALL;

  //..........................................................................................................................................................................
  // MAIN FULL LIST STATIC API CALL;
  function mainStaticApiListCall() {
    $.ajax({
      method: "GET",
      crossDomain: true,
      url: "https://api.coingecko.com/api/v3/coins/list",
      dataType: "JSON",
      success: function (cryptoListStatic) {
        localStorage.setItem(
          "MainStaticInfoArr",
          JSON.stringify(cryptoListStatic)
        );
      },
    });
  }
  //..........................................................................................................................................................................
  // MAIN FULL LIST NOT STATIC API CALL;
  function mainApiListCall() {
    $.ajax({
      method: "GET",
      crossDomain: true,
      url: "https://api.coingecko.com/api/v3/coins/list",
      dataType: "JSON",
      success: function (cryptoList) {
        rndmCryptoCall(cryptoList);
      },
    });
  }
  //..........................................................................................................................................................................
  // PULL FROM LOCAL STORAGE/RUN AJAX CALLS AND SAVE TO LOCAL STORAGE:

  if (localStorage.getItem("MainStaticInfoArr")) {
    basicInfoId = JSON.parse(localStorage.getItem("MainStaticInfoArr"));
    rndmCryptoCall(basicInfoId);
  } else {
    mainStaticApiListCall();
    mainApiListCall();
  }

  //..........................................................................................................................................................................
  // FULL API CRYPTO LIST TABLE + INFO:
  const newShortList = basicInfoId.slice(0, 500);
  $("#contctBtn").on("click", function () {
    $(".searchFormInpt").removeClass("hide");
    $("#fullList").html("");
    setPreLoader();
    newShortList.forEach((crypt, index) => {
      const isChecked = toggleInputState[index + 201] || false;
      $("#fullList").append(`
            <div class="card text-bg-dark rndCoinsCard" data-id='${
              index + 201
            }'>
            <div class="toggleImage">
            <div class="form-check form-switch ">
            <input class="form-check-input fullToggleBtn" data-id='${
              index + 201
            }' type="checkbox" role="switch" id="flexSwitchCheckDefault" ${
        isChecked ? "checked" : ""
      }>
            </div>
            </div>
            <div class="card-body">
            <h4 class="card-title">${crypt.symbol}</h4>
            <div class="middleDiv">
            <div class="modal fade" id="exampleModal${
              index + 201
            }" tabindex="-1" aria-labelledby="exampleModalLabel2"
            aria-hidden="true">
            </div>
            <p class="card-text">${crypt.name}</p>
            <button data-id='${index + 2000}' data-idd='${
        crypt.id
      }' type="button" class="btn btn-success infoBtn" data-bs-toggle="modal"
            data-bs-target="#exampleModal${index + 2000}">
            More Info
            </button>
            <div class="modal fade" data-id='${index + 2000}' id="exampleModal${
        index + 2000
      }" tabindex="-1" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-bg-dark">
            <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Coin Info</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal"
            aria-label="Close"></button>
            </div>
            <div class="modal-body morInfBdy">
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-secondary"
            data-bs-dismiss="modal">Close</button>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            `);
      $("#fullList").ready(removePreLoader);
    });
  });

  //..........................................................................................................................................................................
  // FULL LIST MORE INFO BUTTON MODAL:
  $("#fullList").on("click", ".infoBtn", function () {
    const index = $(this).data("id");
    const idd = $(this).data("idd");
    $.ajax({
      method: "GET",
      crossDomain: true,
      url: `https://api.coingecko.com/api/v3/coins/${idd}`,
      dataType: "JSON",
      success: function (modalData) {
        $(`#exampleModal${index}`).find(".modal-body").html(`
                <p>${modalData.description.en}</p>
                <img src="${modalData.image.large}" class="card-img-top rndCardImg mt-3" alt="..."><br>
                <h3 class="text-success">ILS: &#8362; ${modalData.market_data.current_price.ils}</h3>
                <h3 class="text-success">USD: &#36; ${modalData.market_data.current_price.usd}</h3>
                <h3 class="text-success">EUR: &#128; ${modalData.market_data.current_price.eur}</h3>
                `);
      },
    });
  });

  //..........................................................................................................................................................................
  // REMOVE FROM ARRAY FUNCTION:
  function deleteCardFromToggledCards(cardIdd) {
    const index = toggledCards.findIndex((card) => card.cardId === cardIdd);

    if (index !== -1) {
      toggledCards.splice(index, 1);
      return console.log(index);
    }
  }
  //..........................................................................................................................................................................
  // SCROLL TOGGLE FULL LIST + CLONE CARDS TO LIVELIST + PUSH TO TOGGLE ARRAY FOR LIVE GRAPH:
  let toggleInputState = {};
  let maxToggles = 5; // Maximum number of toggles allowed
  let toggledCards = [];
  let count = 0;
  $("#fullList").on("change", ".fullToggleBtn", function () {
    const cardId = $(this).data("id");
    const isChecked = $(this).prop("checked");
    toggleInputState[cardId] = isChecked;
    const selectedToggles = Object.values(toggleInputState).filter(
      (state) => state
    ).length;
    //..........................................................................................................................................................................
    // IF MORE THAN 5 COINS CHOSEN BY TOGGLE:
    if (selectedToggles > maxToggles) {
      $(this).prop("checked", false);
      toggleInputState[cardId] = false;
      //..........................................................................................................................................................................
      // SHOW MODAL + DELETE FROM ARRAY FULLLIST LIVELIST:
      $("#modalCart").modal("show");
      $("#toggleModal").on("click", ".delete-btn", function () {
        const modalDltBtn = $(this).data("id");
        console.log(modalDltBtn);
        deleteCardFromToggledCards(modalDltBtn);
        const cardToRemoveLive = $("#liveList").find(
          `.rndCoinsCard[data-id='${modalDltBtn}']`
        );
        cardToRemoveLive.remove();
        const cardToRemoveFull = $("#fullList").find(
          `.rndCoinsCard[data-id='${modalDltBtn}']`
        );
        cardToRemoveFull.prop("checked", false);
        toggleInputState[modalDltBtn] = false;
        $("#contctBtn").click();
        const cardToRemoveModalRow = $("#toggleModal").find(
          `tr[data-id='${modalDltBtn}']`
        );
        cardToRemoveModalRow.remove();
      });
      return;
    }

    if (isChecked) {
      const closeCard = $(this).closest(".rndCoinsCard");
      const toggleCardTitle = closeCard.find(".card-title").text();
      const toggleCardName = closeCard.find(".card-text").text();

      $("#toggleModal").append(`
                <tr data-id="${cardId}">
                <td>${toggleCardTitle}</td>
                <td>${toggleCardName}</td>
                <td><button type='button' data-id="${cardId}" class="border-0 btn-transition btn btn-outline-danger delete-btn">
                <i class="fa fa-trash"></i></button></td>
                </tr>
                `);
      const cardClone = $(this).closest(".rndCoinsCard").clone()
        .append(`<button type='button' data-id="${cardId}" class="border-0 btn-transition btn btn-outline-danger delete-btn">
                <i class="fa fa-trash"></i></button>`);
      toggledCards.push({
        cardSymbol: toggleCardTitle,
        cardName: toggleCardName,
        cardId: cardId,
      });
      console.log(toggledCards);
      $("#liveList").append(cardClone);
      count++;
    }

    if (!isChecked) {
      const cardToRemove = $("#liveList").find(
        `.rndCoinsCard[data-id='${cardId}']`
      );
      const cardToRemoveModalRow = $("#toggleModal").find(
        `tr[data-id='${cardId}']`
      );
      cardToRemoveModalRow.remove();
      deleteCardFromToggledCards(cardId);
      cardToRemove.remove();
    }
  });

  // ......................................................................................................................................................
  // REMOVE FROM LIVELISTBIN:
  $("#liveList").on("click", ".delete-btn", function () {
    $(".searchFormInpt").addClass("turnSearchOff");
    const cardId = $(this).data("id");
    const cardToRemove = $("#liveList").find(
      `.rndCoinsCard[data-id='${cardId}']`
    );
    const toggleToRemove = $("#fullList").find(
      `.rndCoinsCard[data-id='${cardId}']`
    );
    const cardToRemoveModalRow = $("#toggleModal").find(
      `tr[data-id='${cardId}']`
    );
    cardToRemoveModalRow.remove();
    cardToRemove.remove();
    deleteCardFromToggledCards(cardId);
    toggleToRemove.prop("checked", false);
    toggleInputState[cardId] = false;
    liveGraph(toggledCards);

    if (toggledCards.length === 0) {
      setTimeout(() => {
        $("#emptyPop").modal("show");
        setTimeout(() => {
          $("#contctBtn").click();
        }, 2000);
      }, 500);
    }
  });

  // ......................................................................................................................................................
  // CLICKING ON LIVE REPORTS BUTTON AND GOING TO LIVE GRAPH:
  $("#pills-profile-tab").on("click", function () {
    if (toggledCards.length === 0) {
      setTimeout(() => {
        $("#emptyPop").modal("show");
        setTimeout(() => {
          $("#contctBtn").click();
        }, 2000);
      }, 500);
    }
    liveGraph(toggledCards);
    $(".searchFormInpt").addClass("hide");
  });

  // ......................................................................................................................................................
  // CANCEL TOGGLE MODAL BUTTON:
  $("#toggleCloseBtn").on("click", function () {
    $("#modalCart").modal("hide");
  });
  // ......................................................................................................................................................
  // SEARCH FILTER;
  $(document).ready(function () {
    $("#searchInpt").on("keyup", function () {
      const value = $(this).val().toLowerCase();
      $("#fullList .rndCoinsCard").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
      $("#mainCardsDiv .rndCoinsCard").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    });
  });
});
