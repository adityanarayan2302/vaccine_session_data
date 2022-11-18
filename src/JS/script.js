var data = [];

$(document).ready(function () {
    //ajax call to display states
    $.ajax({
    type: "GET",
    url: "https://cdn-api.co-vin.in/api/v2/admin/location/states",
    dataType: "json",
    success: function (response) {
      $("#displayTable").html("");
      var str = `<option value="0" selected>Open this select State</option>`;
      response.states.forEach((element) => {
        str += `<option value="${element.state_id}">${element.state_name}</option>`;
      });
      $("#selectStates").html(str);
    },
  });
  //change function to display districts
  $(document).on("change", "#selectStates", function () {
    var state_id = $("#selectStates").val();
    $("#displayTable").html("");
    if (state_id != 0) {
        //ajax call fetching districts
      $.ajax({
        type: "GET",
        url: `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${state_id}`,
        dataType: "json",
        success: function (response) {
          var str = `<div class="form-floating mt-5">
                    <select class="form-select" id="selectDistrict" aria-label="Floating label select example">
                    <option value="0" selected>Open this select District</option>`;
          response.districts.forEach((element) => {
            str += `<option value="${element.district_id}">${element.district_name}</option>`;
          });
          str += `</select>
                <label for="selectDistrict">District</label>
            </div>`;
          $("#selectDistrictDiv").html(str);
        },
      });
    } else {
      $("#selectDistrictDiv").html("");
    }
  });
  //change function fetching vaccine sessions data
  $(document).on("change", "#selectDistrict", function () {
    var district_id = $("#selectDistrict").val();
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output =
      (day < 10 ? "0" : "") +
      day +
      "-" +
      (month < 10 ? "0" : "") +
      month +
      "-" +
      d.getFullYear();
      //ajax call fetching data
    if (district_id != 0) {
      $.ajax({
        type: "GET",
        url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district_id}&date=${output}`,
        dataType: "json",
        success: function (response) {
          data = response.sessions;
          displayTable(response.sessions);
        },
      });
    } else {
      $("#displayTable").html("");
    }
  });
  //change function to sort the data
  $(document).on("change", "#sortBy", function () {
    var sortBy = $("#sortBy").val();

    if (sortBy == "name") {
      data.sort((a, b) => {
        let fa = a.name.toLowerCase(),
          fb = b.name.toLowerCase();

        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });
      displayTable(data);
    } else if (sortBy == "fee") {
      data.sort((a, b) => {
        return a.fee - b.fee;
      });
      displayTable(data);
    } else if (sortBy == "capacity") {
      data.sort((a, b) => {
        return a.available_capacity - b.available_capacity;
      });
      displayTable(data);
    } else if (sortBy == "minAge") {
      data.sort((a, b) => {
        return a.min_age_limit - b.min_age_limit;
      });
      displayTable(data);
    } else if (sortBy == "vaccine") {
      data.sort((a, b) => {
        let fa = a.vaccine.toLowerCase(),
          fb = b.vaccine.toLowerCase();

        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });
      displayTable(data);
    }
  });
});
//displa function for the data table
function displayTable(response) {
  var d = new Date();
  var month = d.getMonth() + 1;
  var day = d.getDate();
  var output =
    (day < 10 ? "0" : "") +
    day +
    "-" +
    (month < 10 ? "0" : "") +
    month +
    "-" +
    d.getFullYear();
  if (response.length != 0) {
    str = `<table class="table table-striped">
        <tr>
            <th>Name</th>
            <th>Fee Type</th>
            <th>Fee</th>
            <th>Date</th>
            <th>Capacity</th>
            <th>Min Age</th>
            <th>Vaccine</th></tr>`;

    response.forEach((element) => {
      str += `<tr><td>${element.name}</td><td>${element.fee_type}</td><td>${element.fee}</td><td>${output}</td><td>${element.available_capacity}</td><td>${element.min_age_limit}</td><td>${element.vaccine}</td></tr>`;
    });
    str += `</table>`;
    $("#displayTable").html(str);
  } else {
    $("#displayTable").html("<h1 class='text-center'>No data</h1>");
  }
}
