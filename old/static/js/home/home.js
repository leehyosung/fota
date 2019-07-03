const socket = io.connect('http://127.0.0.1:5000');

socket.on('connect', function(msg){
    console.log('connect : ' + msg);
});

socket.on('update', function (msg) {
});

socket.on('process', function (msg) {
    const processElement = document.getElementById('process_info');
    // on data retrieved
    let total = ((processElement.value
        ? processElement.value + "\n"
        : "")
        + msg).split("\n");

    if (total.length > 10)
        total = total.slice(total.length - 10);

    processElement.value = total.join("\n");
});

$(document).ready(function() {
    $.ajax({
            url:'./version',
            type:'get',
            success:function(data){
                console.log(data);

                const updateInfo = document.getElementById('update_date');
                const myElem = document.getElementById('version_info');
                updateInfo.value  = "2019-06-14 22:00:00";
                myElem.value = data;
            }
        });
});

function clean() {
    const processElement = document.getElementById('process_info');
    processElement.value = '';
}