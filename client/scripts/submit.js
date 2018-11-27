window.queue_list =["batch","Another_queue1","Another_queue2"];
window.selection__name = 'BatchSelection';

function getJobname() {
    var jobname = $('input[name="jobname"]').val();
    if (check_string(jobname)) {
        $('#jobname_ee').popover('hide');
        return jobname;
    } else { 
        $('#jobname_ee').popover('show');
        return "";
    }
}	

function compose() {

    var jobname = getJobname();
    var exportEnv = $('input[name="exportEnv"]').val();
    var HFaultToll = $('input[name="HFaultToll"]').val();
    var RerunJob = $('input[name="RerunJob"]').val();
/*M*/	var ResList_Nodes = $('input[name="ResList_Nodes"]').val();
/*M*/	var ResList_Cores = $('input[name="ResList_Cores"]').val();
/*M*/	var RequireGPUS = $('input[name="RequireGPUS"]').val();
/*M*/	var BatchSelection = $("#BatchSelection").val();
/*M*/	var priority = $('input[name="priority"]').val();
/*M*/	var ResList_HH = $('input[name="ResList_HH"]').val();
/*M*/	var ResList_MM = $('input[name="ResList_MM"]').val();
/*M*/	var ResList_SS = $('input[name="ResList_SS"]').val();
/*M*/	var Submission_HH = $('input[name="submission_HH"]').val();
/*M*/	var Submission_MM = $('input[name="submission_MM"]').val();
/*M*/	var output_path = $('input[name="output_path"]').val();
/*M*/	var RequireOutput = $('input[name="RequireOutput"]').prop("checked");
/*M*/	var RequireError = $('input[name="RequireError"]').prop("checked");
    var MergeOutput = $('input[name="MergeOutput"]').val();
/*M*/	var MailBegin = $('input[name="MailBegin"]').prop("checked");
/*M*/	var MailEnd = $('input[name="MailEnd"]').prop("checked");
/*M*/	var MailAbort = $('input[name="MailAbort"]').prop("checked");
/*M*/	var mail_addr = $('input[name="mail_addr"]').val();
    var bash_body = $("#bash_body").val();
    var rc = "\n";
                
    var output ="#!/bin/sh" + rc;
    
    output += ("### General Options ###" + rc);
                
    // Job name
    if (check_string(jobname)) {
        output += ('#PBS -N ' + jobname + rc);
    }
        
    // Export envvars
    if (exportEnv !== "") {
        output += (exportEnv + rc);
    }
    
    // High Fault tollerance
    if (HFaultToll !== "") {
        output += (HFaultToll + rc);
    }
    
    // Rerun Job
    if (RerunJob !== "") {
        output += (RerunJob + rc);
    }
    
    output += ("### Resource Handling ###" + rc);
    
    // Resource Nodes + Cores
    if (check_number(ResList_Nodes) && check_number(ResList_Cores)) {
        output += '#PBS -l ' + ResList_Nodes + ':' + ResList_Cores + rc;
    }
    
    // Require Gpus
    if (RequireGPUS === "true" ) { 
        output += ("#PBS -W \"-x GRES:gpu\"" + rc);
    }
    
    // Queue
    output += ('#PBS -q ' + BatchSelection + rc);
    
    // Priority
    if (priority === "") {}
    else if (Number(priority) > -1024 && Number(priority) < 1023) {
        output += ("#PBS -p " + priority + rc);
    }
    
    // Walltime <-- Questa parte deve essere implementata meglio
    var time;
    if (ResList_HH === "") { ResList_HH = "00"; }
    if (ResList_MM === "") { ResList_MM = "00"; }
    if (ResList_SS === "") { ResList_SS = "00"; }
    if ( Number(ResList_HH) >= 0 && Number(ResList_MM) >= 0 && Number(ResList_SS) >= 0) {
        if ( Number(ResList_HH) <= 99 && Number(ResList_MM) <= 59 && Number(ResList_SS) <= 59) {
            time = ResList_HH + ":" + ResList_MM + ":" + ResList_SS;
        }
    }
    if ( time !== "00:00:00" ) { 
        output += ('#PBS -l ' + time + rc);
    }
    
    // Submission Time <-- Questa parte deve essere implementata meglio
    time = "";
    if (Submission_HH !== "" && Submission_MM !== "") {
        if ( Number(Submission_HH) >= 0 && Number(Submission_HH) <= 24 && Number(Submission_MM) >= 0 && Number(Submission_MM) <= 59) {
            time = Submission_HH + ":" + Submission_MM;
            output += ('#PBS -a ' + time + rc);
        }
    }
    
    output += "### Output Stream Options ###" + rc;
    
    // Output path <-- check se la path esiste, se non esiste deve crearla, o per lo meno farlo notare al nostro caro amico che sottomette il job!
    if (output_path !== "") {
        output += ('#PBS -o ' + output_path + rc);
        output += ('#PBS -e ' + output_path + rc);
    }
    
    // Stream requested
    var temp = "#PBS -k ";
    if (RequireOutput && RequireError) { temp =""; }
    else if (!RequireOutput && RequireError) { temp += 'e'; }
    else if (RequireOutput && !RequireError) { temp += 'o'; }
    else if (!RequireOutput && !RequireError) { temp += 'n'; }
    if (temp !== "") { output += (temp + rc); }
    
    // Merge stream
    if (MergeOutput !== "") {
        output += MergeOutput + rc;
    }
    
    output += "### Mail Options ###" + rc;
    
    // Mail Requested
    temp = "#PBS -m ";
    if (!MailBegin && !MailEnd && !MailAbort) { temp =""; }
    else {
        if (MailBegin) { temp += 'b'; }
        if (MailEnd) { temp += 'e'; }
        if (MailAbort) { temp += 'a'; }
        temp += rc;
    }
    output += temp;
    
    // Mail address <-- forse dovrei fare un check sull'inserimento delle mail
    if (mail_addr !== "") {
        output += '#PBS -M ' + mail_addr + rc;
    }
    
    output += (rc + "### Bash script ###" + rc + bash_body + rc + "exit 0" + rc);

    $("#results_code").replaceWith('<pre id="results_code" class="input-bloc-level">' + output + '</pre>');
    stylePreview();
    $("#results_code ol li").css("list-style-type", "decimal")
    $('#result_script').html(output);
    
}

// Check se nella stringa ci sono caratteri che non sono validi
// Caratteri validi: a-z, A-Z, 0-9, _, -
function check_string(input) {
    var re = new RegExp('[^a-zA-Z0-9-_]+');
    if (input.match(re)) { return false; }
    else { return true; }
}

// Check se nella stringa ci sono 2 numeri
function check_number(input) {
    var re = new RegExp('^[0-9]{1,2}$');
    if (input.match(re)) { return true; }
    else { return false; }
}

function stylePreview() {
    $("#results_code").addClass("prettyprint");
    $("#results_code").addClass("linenums");
    $("#results_code").html(prettyPrint($("#results_code").html()));
}	

function create_list(arrayin=queue_list, name=selection__name) 
{
	var selection = "";
	selection = "<select name=\"" + name + "\" id=\"" + name + "\"  onchange=\"compose();\">";
	
	for (let i = 0; i < arrayin.length; i++) {
		selection += "\n" + "<option>" + arrayin[i] + "</option>";
	}
	selection += "\n</select>";
	$('#queue_select').html(selection);
}


$(function () {
    // make code pretty
    //window.prettyPrint && prettyPrint()

    create_list();
    $("#btn_submit_script").addClass("disabled").prop("disabled", true);
    $("#jobname").change(function(e){
        var jobname = getJobname();
        if(jobname) {
            $("#btn_submit_script").removeClass("disabled").prop("disabled", false);
        }
    })

    /*    
    $("a[data-toggle=popover]").popover().click(function(e) {
        console.log(e)
        e.preventDefault()
    })
    */
    
    $("#jobname_ee").popover({
        trigger:'hover',
        placement : 'top',
        html: 'true',
        animation: false,
        delay: {hide: 100}
    }) 

    $("a[data-toggle=popover]").popover({
        trigger:'hover',
        placement : 'left',
        html: 'true',
        animation: false,
        delay: {hide: 100}
    }) 

    $('.btn-radio').click(function(){
        $(this).addClass("active").siblings().removeClass("active");
    });

    $('.btn-checkbox').click(function(){
        if($(this).hasClass("active")) {
            $(this).removeClass("active");
        }else {
            $(this).addClass("active")
        }
    });

    $("#myTab-tabs-above li").click(function(event){
        if ($(this).hasClass('disabled')) {
            return false;
        }
    });

    $("#btn_submit_script").click(function () {
        
        const scriptInfo = {
            scriptContent : $("#result_script").text(),
        }

        if($("#scriptname").val() != '') {
            scriptInfo.scriptName = $("#scriptname").val();
        }
		var l = Ladda.create(this);
		l.start();
		$.post("/save", scriptInfo,
			function (result) {
				if (result.result == "success") {
                    window.folderName = result.path;
                    $("#job_script_name").val(result.scriptName);
                    if(result.scriptName.split('.')[0] == result.path) {
                        $("#alert_info3").show();
                    }
					l.stop();
                    $('#myTab-tabs-above li:first').removeClass('active');
                    $('#myTab-tabs-above li:first').addClass('disabled');
                    $('#myTab-tabs-above li:nth-child(2)').removeClass('disabled');
                    $('#myTab-tabs-above li:nth-child(2)').addClass('active');
                    $('#home-tabs-above').removeClass('in active');
                    $('#profile-tabs-above').addClass('in active');
				}
				else {
					$("#war_caption").text("Save Failed! Please try again!");
					$("#alert_info").show();
					l.stop();
				}
		});
    });

    $("#inputData").fileinput({
        uploadUrl: "/upload", // server upload action
        uploadAsync: true,
        //maxFileCount: 1,
        //previewFileType:'text',
        showPreview: true,
        //browseLabel: '浏览...', 'removeLabel': '删除',
        //uploadLabel: '上传',
        initialPreviewShowDelete: false,
        
        uploadExtraData: function () {
            var info = {folderName: window.folderName};
            return info;
          }
        //allowedFileExtensions: ['txt'],
        //msgFilesTooMany: '只能选择一个输入文件!',
        //msgValidationError: ' 输入文件应为.txt'
    });
    
    $('#inputData').on('fileerror', function (event, data, msg) {
        console.log(data.id);
        console.log(data.index);
        console.log(data.file);
        console.log(data.reader);
        console.log(data.files);
    });
    
    $('#inputData').on('fileuploaderror', function (event, data, msg) {
        var form = data.form, files = data.files, extra = data.extra,
            response = data.response, reader = data.reader;
        console.log('File upload error');
        // get message
    });
    
    $('#inputData').on('filebatchuploaderror', function (event, data, msg) {
        var form = data.form, files = data.files, extra = data.extra,
            response = data.response, reader = data.reader;
        console.log('File batch upload error');
        // get message
    });
    
    $('#inputData').on('fileuploaded', function (event, data, previewId, index) {
        $("#selectfiles").text("文件已上传");
    });
    
    $('#inputData').on('filecleared', function (event, data, previewId, index) {
        $("#selectfiles").text(" ");
    });	

    $("#btn_launch").click(function () {

        const taskInfo = {
            folderName : window.folderName,
            scriptName: $("#job_script_name").val()
        }

		var l = Ladda.create(this);
        l.start();
        
		$.post("/launch", taskInfo,
			function (result) {
				if (result.result == "success") {
					l.stop();

				}
				else {
					$("#war_caption2").text("Launch Failed! Please try again later!");
					$("#alert_info2").show();
					l.stop();
				}
		});
    });

});

