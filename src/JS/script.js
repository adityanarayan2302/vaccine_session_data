var data = [];
$(document).ready(function () {
    
    $.ajax({
        type: "GET",
        url: "https://cdn-api.co-vin.in/api/v2/admin/location/states",
        dataType: "json",
        success: function (response) {
            $("#displayTable").html("");
            // console.log(response);
            var str = `<option value="0" selected>Open this select State</option>`;
            response.states.forEach(element => {
                str += `<option value="${element.state_id}">${element.state_name}</option>`;
            });
            $("#selectStates").html(str);
        }
    });

    $(document).on('change','#selectStates', function(){
        var state_id = $("#selectStates").val();
        $("#displayTable").html("");
        // console.log(state_id);
        if(state_id != 0){
            $.ajax({
                type: "GET",
                url: `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${state_id}`,
                dataType: "json",
                success: function (response) {
                    var str = `<div class="form-floating mt-5">
                    <select class="form-select" id="selectDistrict" aria-label="Floating label select example">
                    <option value="0" selected>Open this select District</option>`;
                response.districts.forEach(element => {
                    str += `<option value="${element.district_id}">${element.district_name}</option>`;
                });
                str += `</select>
                <label for="selectDistrict">District</label>
            </div>`;
                $("#selectDistrictDiv").html(str);
                }
            });
        } else{
            $("#selectDistrictDiv").html("");
        }
    });
    $(document).on('change','#selectDistrict', function(){
        var district_id = $("#selectDistrict").val();
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        var output = (day<10 ? '0' : '') + day + '-' + (month<10 ? '0' : '') + month + '-' + d.getFullYear();
        // console.log(output);
        // console.log(district_id);
        if(district_id != 0){
            $.ajax({
                type: "GET",
                url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district_id}&date=${output}`,
                dataType: "json",
                success: function (response) {
                    // console.log(response);
                    displayTable(response);
                }
            });
        } else{
            $("#displayTable").html("");
        }
    });
});


function displayTable(response){
    var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();
    var output = (day<10 ? '0' : '') + day + '-' + (month<10 ? '0' : '') + month + '-' + d.getFullYear();
    if(response.sessions.length != 0){
        
        str = `<table class="table table-striped">
        <tr>
            <th>Name</th>
            <th>Fee Type</th>
            <th>Fee</th>
            <th>Date</th>
            <th>Capacity</th>
            <th>Min Age</th>
            <th>Vaccine</th></tr>`;

        response.sessions.forEach(element => {
            str += `<tr><td>${element.name}</td><td>${element.fee_type}</td><td>${element.fee}</td><td>${output}</td><td>${element.available_capacity}</td><td>${element.min_age_limit}</td><td>${element.vaccine}</td></tr>`;
        });
        str += `</table>`;
        $("#displayTable").html(str);
        data = response.sessions;
    }else{
        $("#displayTable").html("<h1 class='text-center'>No data</h1>");
    }
}