$(function () {

    var viewinfostring="预览作业的文本输出内容（最大不超过100行）";
    
    $("#viewinfo").popover({
        trigger:'manual',
        placement : 'right',
        html: 'true',
        content : viewinfostring,
        animation: false
    }).on("mouseenter", function () {
        var _this = this;
        $(this).popover("show");
        $(this).siblings(".popover").on("mouseleave", function () {
            $(_this).popover('hide');
        });
    }).on("mouseleave", function () {
        var _this = this;
        setTimeout(function () {
            if (!$(".popover:hover").length) {
                $(_this).popover("hide")
            }
        }, 100);
    });	


	$(".view-file").click(function(){
        let name = this.dataset.filename;
        let task = this.dataset.taskid;

        $("#loading-file").css('display','block');
        $("#file-content").css('display','none');

        $('.modal-title').html("文件预览：" + name);
        $('#myModal').modal('show');

        $.get("/task/view/" + task + "?file=" + name, function (result) {

            if (result.result == "success") {
                $('#file-content').html(result.data);
                $("#href-to-download").click(function(){
                    window.location.href = "/task/download/" + task + "?file=" + name;
                });
            }else {
                $('#file-content').html("获取失败，请稍后重试");
            }
            $("#loading-file").css('display','none');
            $("#file-content").css('display','block');
        });
    });

});