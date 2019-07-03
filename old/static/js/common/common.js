function start() {
    $.ajax({
            url:'./start',
            type:'post',
            success:function(data){
                console.log(data);
                const myElem = document.getElementById('version_info');
                myElem.value = data;
            }
        });
}


function stop() {
    $.ajax({
            url:'./stop',
            type:'post',
            success:function(data){
                console.log(data);
                const myElem = document.getElementById('version_info');
                myElem.value = data;
            }
        });
}