'use strict';

var DecipherDom = (function() {
  let createSummaryComponent = function(data) {
    if(!data) return false;

    let $cash = $('#summary_cash td')[1];
    let $profitMonth = $('#summary_profit_month td')[1];
    let $profitYear = $('#summary_profit_year td')[1];
    let $profitAllTime = $('#summary_profit_all_time td')[1];
    let $fees = $('#summary_fees td')[1];

    $($cash).text(formatNumber(data['cash_on_hand']));
    $($profitMonth).text(formatNumber(data['profit_this_month']));
    $($profitYear).text(formatNumber(data['profit_this_year']));
    $($profitAllTime).text(formatNumber(data['profit_all_time']));
    $($fees).text(formatNumber(data['fees']));
  }

	function formatNumber(number) {
		return Math.round(number).toLocaleString();
	}

  let createTimelineComponent = function(data) {
    // populate Date
    let $date = $('#date');
    const dateText = data['date_range']['beginning'] + ' to ' + data['date_range']['end'];
    $date.text(dateText);

    // populate Chart
    let $chart = $('#timelineChart');
    let dates = getArrayOfKey(data['data'], 'date');
    let realized = getArrayOfKey(data['data'], 'pnl_realized');
    let unrealized = getArrayOfKey(data['data'], 'pnl_unrealized');

    let myChart = new Chart($chart, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Realized',
            data: realized,
            fill: false,
            backgroundColor: "rgba(75, 255, 91, 0.5)",
            borderColor: "rgba(75, 255, 91, 1)",
            borderWidth: 0.5,
            pointBorderColor: "rgba(0, 0, 0, 0)",
            pointBackgroundColor: "rgba(0, 0, 0, 0)",
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBackgroundColor: "rgba(0, 0, 0, 0)",
            pointHoverBorderColor: "rgba(0, 0, 0, 0)",
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            pointHitRadius: 0
          },
          {
            label: 'Unrealized',
            data: unrealized,
            fill: false,
            backgroundColor: "rgba(22, 192, 255, 0.5)",
            borderColor: "rgba(22, 192, 255, 1)",
            borderWidth: 0.5,
            pointBorderColor: "rgba(0, 0, 0, 0)",
            pointBackgroundColor: "rgba(0, 0, 0, 0)",
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBackgroundColor: "rgba(0, 0, 0, 0)",
            pointHoverBorderColor: "rgba(0, 0, 0, 0)",
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            pointHitRadius: 0
          }
        ]
      }
    });
  }

  function getArrayOfKey(array, key) {
    return array.map(function(obj) {
      return obj[key];
    });
  }

  let createPositionComponent = function(data) {
    // populate Chart
    let $chart = $('#positionsChart');
    let ticker = getArrayOfKey(data, 'ticker');
    let value = getArrayOfKey(data, 'value');
    let colors = getChartColors(data.length);

    let myChart = new Chart($chart, {
      type: 'pie',
      data: {
        labels: ticker,
        datasets: [
          {
            data: value,
            backgroundColor: colors
          }
        ]
      }
    });

    // populate Table
    let $tbody = $('.positions tbody');
    for(let i = 0; i < data.length; i++) {
      let currentPosition = data[i];

      let newRow = '<tr><td>' + currentPosition['name'] + ' (' + currentPosition['ticker'] + ')</td>' +
        '<td>' + formatNumber(currentPosition['shares']) + '</td>' +
        '<td>' + formatNumber(currentPosition['value']) + '</td>' +
        '<td>' + formatNumber(currentPosition['realized']) + '</td>' +
        '<td>' + formatNumber(currentPosition['dividends']) + '</td>' +
        '<td>' + formatNumber(currentPosition['unrealized']) + '</td>' +
        '<td>' + formatNumber(currentPosition['shortterm']) + '</td>' +
        '<td>' + formatNumber(currentPosition['longterm']) + '</td>' +
        '</tr>';

      $($tbody).append(newRow);
    }
  }

  function getChartColors(number) {
    let myColors = [];

    for(let i = 0; i < number; i++) {
      myColors.push(generateRandomColor(255));
    }
    return myColors;
  }

  function generateRandomColor(range) {
    let rand1 = Math.floor(Math.random() * range);
    let rand2 = Math.floor(Math.random() * range);
    let rand3 = Math.floor(Math.random() * range);

    return 'rgb(' + rand1 + ',' + rand2 +',' + rand3 + ')';
  }

  return {
    createSummaryComponent: createSummaryComponent,
    createTimelineComponent: createTimelineComponent,
    createPositionComponent: createPositionComponent
  };
})();

var DecipherParser = (function() {

  let requestInfo = function(callback) {
    $.ajax({
      url: '/decipher/test',
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        callback(data);
      }
    });
  }

  let getPositionInfo = function(rawData) {
    let myPositions = [];

    for(let i = 0; i < rawData.length; i++) {
      const currentPosition = parsePositionInfo(rawData[i]);
      myPositions.push(currentPosition);
    }

    return myPositions;
  }

  function parsePositionInfo(positionInfo) {
    const myPosition = {};
    const gains = positionInfo['gains'];

    myPosition['unrealized'] = gains['unrealized_longterm'] + gains['unrealized_shortterm'];
    myPosition['realized'] = gains['realized_longterm'] + gains['realized_shortterm'];
    myPosition['shortterm'] = gains['unrealized_shortterm'] + gains['realized_shortterm'];
    myPosition['longterm'] = gains['unrealized_longterm'] + gains['realized_longterm'];
    myPosition['dividends'] = positionInfo['dividends']['total'];
    myPosition['shares'] = positionInfo['shares'];
    myPosition['value'] = positionInfo['value'];
    myPosition['name'] = positionInfo['security']['name'];
    myPosition['ticker'] = positionInfo['security']['ticker'];

    return myPosition;
  }

  let getDailyInfo = function(dailyInfo) {
    const myDailyInfo = {};
    myDailyInfo['data'] = [];
    myDailyInfo['total_pnl_unrealized'] = 0;
    myDailyInfo['total_pnl_realized'] = 0;

    myDailyInfo['date_range'] = { beginning: undefined, end: undefined };

    for(let i = 0; i < dailyInfo.length; i++) {
      const currentDay = dailyInfo[i];
      const currentDailyInfo = {};

      currentDailyInfo['pnl_unrealized'] = currentDay['pnl_unrealized'];
      currentDailyInfo['pnl_realized'] = currentDay['pnl_realized'];
      currentDailyInfo['date'] = currentDay['date'];

      myDailyInfo['total_pnl_unrealized'] += currentDailyInfo['pnl_unrealized'];
      myDailyInfo['total_pnl_realized'] += currentDailyInfo['pnl_realized'];
      myDailyInfo['data'].push(currentDailyInfo);

      if(myDailyInfo['date_range']['beginning'] === undefined) {
        myDailyInfo['date_range']['beginning'] = currentDailyInfo['date'];
        myDailyInfo['date_range']['end'] = currentDailyInfo['date'];
      }

      let dateIsEarlier = isDateIsGreater(myDailyInfo['date_range']['beginning'], currentDailyInfo['date']);
      let dateIsLater = isDateIsGreater(currentDailyInfo['date'], myDailyInfo['date_range']['end']);
      if(dateIsEarlier) {
        myDailyInfo['date_range']['beginning'] = currentDailyInfo['date'];
      } else if(dateIsLater) {
        myDailyInfo['date_range']['end'] = currentDailyInfo['date'];
      }
    }

    return myDailyInfo;
  }

  function isDateIsGreater(first, second) {
    return new Date(first) > new Date(second);
  }

  let getSummaryInfo = function(data) {
    const mySummary = {};
    const profit = data['profit']
    mySummary['profit_this_year'] = profit['this_year'];
    mySummary['profit_all_time'] = profit['all_time'];
    mySummary['profit_this_month'] = profit['this_month'];
    mySummary['fees'] = data['fees']['yearly_fund_expenses'];
    mySummary['cash_on_hand'] = data['cash_on_hand'];

    return mySummary;
  }

  return {
    requestInfo: requestInfo,
    getPositionInfo: getPositionInfo,
    getDailyInfo: getDailyInfo,
    getSummaryInfo: getSummaryInfo
  };
})();
