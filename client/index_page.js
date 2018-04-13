(()=>{
	"use strict";
	let now_id = "";
	let now_token = "";
	let now_wwa_id = ""
	// 右側のセーブリストを表示するためのもの
	function show_save_list(){
		console.log("ログイン済");
		console.log("ID:"+now_id);
		console.log("token:"+now_token);
		change_login();
		$("#save_list").html("");
		$("#save_list").append("ID:"+now_id+"でログインしています。<br>");
		$("#save_list").append("現在の選択ゲーム："+now_wwa_id+"<br><br>");
		console.log("WWA:"+now_wwa_id);
		// save listを取得
		$.ajax({
			url: '../server/index.php/save_list_get/',
			type: 'GET',
			headers: {
				'id': now_id,
				'token': now_token,
				'wwaid': now_wwa_id
			},
		}).done((data)=>{
			console.log(data);
			// セーブデータ一覧を出力
			let output_item = "";
			for(let i=0; i<data.length; i++){
				output_item += `<div id="save_${i + 1}" class="card">\n\t<div class="card-body">\n\t\t<h5 class="card-title">ID: ${i + 1}</h5>\n\t\t<h6 class="card-subtitle">${data[i]["save_time"]}</h6>\n`;
				output_item += `\t\t<p class="card-text">${data[i]["comment"]}</p>\n\t\t<a class="card-link save-play">遊ぶ</a>\n\t\t<a class="card-link save_remove">削除</a>\n\t</div>\n</div>`;
			}
			output_item += "</table>";
			output_item += "<hr>";
			output_item += "<h2>セーブデータ選択</h2>";
			output_item += '<select id="select_savedata" size="1">';
			for(let i=0; i<data.length; i++){
				output_item += '<option value="'+data[i]["id"]+'">'+(i+1)+'</option>';
			}
			output_item += '</select>';
			output_item += '<button id="submit_savedata_id">選択</button><br><br>';
			output_item += '<button id="submit_delete_savedata_id">セーブの削除</button><br><br>';
			output_item += '<button id="submit_newgame">NEW GAME</button>';
			$("#save_list").append(output_item);
		}).fail((xhr)=>{
			$("#save_list").append("エラーが発生しました。<br>");
		});
	}
	function update_alert(id, status, title, message) {
		$(id).removeClass();
		$(id).addClass("alert alert-" + status);
		$(id).children(".title").html("<strong>" + title + "</strong>");
		$(id).children(".message").text(message);
	}
	/**
	 * フォームの配置をログイン用に切り替えます。
	 */
	function change_login() {
		$("#logout").removeClass("is_hidden");
		$("#user_logged_in").removeClass("is_hidden");
		$("#submit_login").addClass("is_hidden");
		$("#user_regist").addClass("is_hidden");
	}
	/**
	 * フォームの配置を未ログイン用に切り替えます。
	 */
	function change_logout() {
		$("#submit_login").removeClass("is_hidden");
		$("#user_regist").removeClass("is_hidden");
		$("#logout").addClass("is_hidden");
		$("#user_logged_in").addClass("is_hidden");
	}
	// ウェブストレージをチェック
	window.onload = ()=>{
		now_id = window.localStorage.getItem('wwasave_id');
		now_token = window.localStorage.getItem('wwasave_token');
		now_wwa_id = $("#wwa_id").val();
		if(now_id && now_token && now_wwa_id){
			show_save_list();
		}
		console.log(wwamap_url);
	}
	// セーブデータの削除
	$(document).on("click","#submit_delete_savedata_id",()=>{
		let select_sevedata_id = $("#select_savedata").val();
		console.log("セーブデータ削除"+select_sevedata_id);
		$.ajax({
			url:'../server/index.php/seve_del/' + select_sevedata_id + "/",
			type:'DELETE',
			data:{
				user_id: now_id,
				token: now_token
			}
		}).done((data)=>{
			// 削除成功
			$("#create_user_result").append("セーブデータ"+select_sevedata_id+"番を削除しました。");
			show_save_list();
		}).fail((xhr)=>{
			// 削除失敗
			let output_str = "";
			switch(xhr.status){
				case 400:
					let fail_response = JSON.parse(xhr.responseText);
					switch(fail_response.code){
						case 1:
							output_str = "必要な要素をPOSTしていません。";
							break;
						case 2:
							output_str = "tokenが無効です";
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
			update_alert("#create_user_result", "danger", "Error:", output_str);
		});
	});
	// ゲームの選択
	$(document).on("click","#geme_select_button",()=>{
		now_wwa_id = $("#wwa_id").val();
		window.localStorage.setItem('wwa_id', now_wwa_id);
		show_save_list();
	});
	// WWAプレイページへの遷移
	$(document).on("click","#submit_savedata_id",()=>{
		// 選択中のセーブデータIDをローカルストレージへ保存
		let select_sevedata_id = $("#select_savedata").val();
		window.localStorage.setItem('wwasave_savedata_id', select_sevedata_id);
		window.localStorage.setItem('wwa_id', now_wwa_id);
		// ページ遷移
		window.location.href = wwamap_url[ now_wwa_id ];
	});
	// NEW GAMEで開始
	$(document).on("click","#submit_newgame",()=>{
		window.localStorage.setItem('wwasave_savedata_id', -1);
		window.localStorage.setItem('wwa_id', now_wwa_id);
		// ページ遷移
		window.location.href = wwamap_url[ now_wwa_id ];
	});
	// ログイン
	$(document).on("click","#submit_login",()=>{
		let submit_id = $('#login_user_id').val();
		let submit_password = $('#login_user_password').val();
		$.ajax({
			url:'../server/index.php/login/',
			type:'POST',
			data:{
				id: submit_id,
				password: submit_password
			}
		}).done((data)=>{
			// ログイン成功
			now_id = submit_id;
			now_token = data.token;
			update_alert("#create_user_result", "success", "", now_id + "でログインしました。")
			window.localStorage.setItem('wwasave_id', submit_id);
			window.localStorage.setItem('wwasave_token', data.token);
			
			show_save_list();
		}).fail((xhr)=>{
			// ログイン失敗
			let output_str = "";
			switch(xhr.status){
				case 400:
					let fail_response = JSON.parse(xhr.responseText);
					switch(fail_response.code){
						case 1:
							output_str = "必要な要素をPOSTしていません。";
							break;
						case 2:
							output_str = "そのIDは未登録です。";
							break;
						case 3:
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
			update_alert("#create_user_result", "danger", "Error", output_str);
		});
	});
	// ユーザ新規作成
	$(document).on("click","#submit_create_user",()=>{
		let submit_id = $('#create_user_id').val();
		let submit_password = $('#create_user_password').val();
		$.ajax({
			url:'../server/index.php/user_reg/',
			type:'POST',
			data:{
				id: submit_id,
				password: submit_password
			}
		}).done((data)=>{
			now_id = submit_id;
			now_token = data.token;
			$("#create_user_result").append(now_id+"でログインしました。");
		}).fail((xhr)=>{
			let output_str = "";
			switch(xhr.status){
				case 400:
					let fail_response = JSON.parse(xhr.responseText);
					switch(fail_response.code){
						case 1:
							output_str = "必要な要素をPOSTしていません。";
							break;
						case 2:
							output_str = "パスワードは6文字以上にしてください。";
							break;
						case 3:
							output_str = "そのIDはすでに登録されています。";
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
			update_alert("#create_user_result", "danger", "Error", output_str);
		});
	});
	// ログアウト
	$(document).on("click","#logout",()=>{
		now_id = "";
		now_token = "";
		update_alert("#create_user_result", "success", "", "ログアウトしました");
		change_logout();
		$("#save_list").html("");
		window.localStorage.removeItem('wwasave_id');
		window.localStorage.removeItem('wwasave_token');
		window.localStorage.removeItem('wwa_id');
		// TODO : '../server/index.php/logout/' にアクセスしてトークンを失効
	});
})();
