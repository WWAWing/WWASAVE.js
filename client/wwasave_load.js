(()=>{
	"use strict";
	// user id
	let now_id = "";
	let now_token = "";
	let wwasave_savedata = new Object();
	// 表示の更新
	function show_update(){
		$("#user_id").html(wwasave_savedata.user_id);
		$("#save_id").html(wwasave_savedata.id);
		$("#status_hp").html(wwasave_savedata.hp);
		$("#status_at").html(wwasave_savedata.at);
		$("#status_df").html(wwasave_savedata.df);
		$("#status_money").html(wwasave_savedata.money);
		$("#password_save").html(wwasave_savedata.long_password);
		$("#status_time").html(wwasave_savedata.save_time);
		$("#status_comment").html(wwasave_savedata.comment);
	}
	// LOAD
	function load_savedata(){
		$.ajax({
			url: '../server/index.php/save_get/' + wwasave_savedata.id + "/",
			type: 'GET',
			headers: {
				'id': now_id,
				'token': now_token,
			},
		}).done((data)=>{
			console.log(data);
			wwasave_savedata.id = data["id"];
			wwasave_savedata.user_id = data["user_id"];
			wwasave_savedata.hp = data["hp"];
			wwasave_savedata.at = data["at"];
			wwasave_savedata.df = data["df"];
			wwasave_savedata.money = data["money"];
			wwasave_savedata.player_x = data["player_x"];
			wwasave_savedata.player_y = data["player_y"];
			wwasave_savedata.long_password = data["long_password"];
			wwasave_savedata.save_time = data["save_time"];
			wwasave_savedata.comment = data["comment"];
			show_update();
			$("#password_save_info").html("");
			$("#password_save_info").append("ロードに成功しました。<br>");
		}).fail((xhr)=>{
			$("#password_save_info").html("");
			$("#password_save_info").append("ロード中にエラーが発生しました。<br>");
		});
	}
	// SAVE
	function save_savedata(){
		// ステータスの更新
		wwasave_savedata.long_password = $("#password_save").val();
		wwasave_savedata.comment = $("#save_comment").val();
		let submit_data = {
			'token': now_token,
			'user_id': wwasave_savedata.user_id,
			'hp': wwasave_savedata.hp,
			'at': wwasave_savedata.at,
			'df': wwasave_savedata.df,
			'money':wwasave_savedata.money,
			'player_x': wwasave_savedata.player_x,
			'player_y': wwasave_savedata.player_y,
			'long_password': wwasave_savedata.long_password,
			'comment': wwasave_savedata.comment
		};
		if(wwasave_savedata.id !== -1){
			submit_data.id = wwasave_savedata.id;
		}
		// SAVEを行う
		$.ajax({
			url:'../server/index.php/save_reg/',
			type:'POST',
			data:submit_data
		}).done((data)=>{
			// 成功
			$("#password_save_info").html("");
			$("#password_save_info").html("セーブ成功");
			show_update();
		}).fail((xhr)=>{
			// 失敗
			$("#password_save_info").html("");
			let output_str = "";
			switch(xhr.status){
				case 400:
					let fail_response = JSON.parse(xhr.responseText);
					switch(fail_response.code){
						case 1:
							output_str = "必要な要素をPOSTしていません。";
							break;
						case 2:
							output_str = "パスワードが違います。";
							break;
						default:
							output_str = "予期せぬエラーが発生しています。";
							break;
					}
					break;
				case 500:
					output_str = "サーバ側に障害が発生しています。";
					break;
				case 503:
					output_str = "サーバが混み合っています。少々お待ちください。";
					break;
				default:
					output_str = "予期せぬエラーが発生しています。";
					break;
				
			}
			$("#password_save_info").append(output_str);
		});
	}
	// セーブの新規作成
	function create_new_savedata(){
		wwasave_savedata.id = -1;
		wwasave_savedata.user_id = now_id;
		wwasave_savedata.hp = 1000;
		wwasave_savedata.at = 20;
		wwasave_savedata.df = 10;
		wwasave_savedata.money = 100;
		wwasave_savedata.player_x = 0;
		wwasave_savedata.player_y = 0;
		wwasave_savedata.long_password = "";
		wwasave_savedata.comment = "";
		save_savedata();
		show_update();
	}
	// ウェブストレージをチェック
	window.onload = ()=>{
		now_id = window.localStorage.getItem('wwasave_id');
		now_token = window.localStorage.getItem('wwasave_token');
		wwasave_savedata.id = Number( window.localStorage.getItem('wwasave_savedata_id') );
		console.log("wwasave_savedata.id:"+wwasave_savedata.id);
		if(now_id && now_token && wwasave_savedata.id){
			if(wwasave_savedata.id === -1){
				console.log("UNKO!!!!!!!!!");
				create_new_savedata();
			}
			else{
				load_savedata();
			}
			$("#user_id").html("");
			$("#user_id").append(now_id);
			$("#save_id").html("");
			$("#save_id").append(wwasave_savedata.id);
		}
	}
	
	// LOAD
	$(document).on("click","#savedata_load",()=>{
		load_savedata();
	});
	// SAVE
	$(document).on("click","#savedata_save",()=>{
		save_savedata();
	});
})();
