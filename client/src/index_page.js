import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import 'bootstrap';

(() => {
	"use strict";
	let $ = require('jquery');
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
		$("#login_status").html("ID:"+now_id+"でログインしています。");
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
				output_item += `<div id="save_${i + 1}" class="card">\n`;
				output_item += `\t<div class="card-body">\n`;
				output_item += `\t\t<h5 class="card-title">ID: ${i + 1}</h5>\n`;
				output_item += `\t\t<h6 class="card-subtitle">生命力: ${data[i]["hp"]} 攻撃力: ${data[i]["at"]} 防御力: ${data[i]["df"]} 所持金: ${data[i]["money"]}</h6>\n`;
				output_item += `\t\t<p class="card-text">${data[i]["comment"]}</p>\n`;
				output_item += `\t\t<p class="card-text"><small class="text-muted">${data[i]["save_time"]}</small></p>\n`;
				output_item += `\t\t<a href="#" class="card-link save_play" value="${data[i]["id"]}">遊ぶ</a>\n`;
				output_item += `\t\t<a href="#" class="card-link save_remove" value="${data[i]["id"]}">削除</a>\n`;
				output_item += `\t</div>\n</div>`;
			}
			output_item += '<button class="btn btn-primary" id="submit_newgame">NEW GAME</button>';
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

		$("#login_user_id").addClass("is_hidden");
		$("#login_user_password").addClass("is_hidden");
		$("#submit_login").addClass("is_hidden");
		$("#user_regist").addClass("is_hidden");
	}
	/**
	 * フォームの配置を未ログイン用に切り替えます。
	 */
	function change_logout() {
		$("#login_user_id").removeClass("is_hidden");
		$("#login_user_password").removeClass("is_hidden");
		$("#submit_login").removeClass("is_hidden");
		$("#user_regist").removeClass("is_hidden");

		$("#logout").addClass("is_hidden");
		$("#user_logged_in").addClass("is_hidden");
	}

	/**
	 * 引数で指定したセーブデータをプレイします。
	 * @param {number} id セーブデータのID
	 */
	function playSavedata(id) {
		// 選択中のセーブデータIDをローカルストレージへ保存
		window.localStorage.setItem('wwasave_savedata_id', id);
		window.localStorage.setItem('wwa_id', now_wwa_id);
		// ページ遷移
		window.location.href = wwamap_url[ now_wwa_id ];
	}
	/**
	 * 引数で指定したセーブデータを削除します。
	 * @param {number} id セーブデータのID
	 */
	function removeSavedata(id) {
		console.log("セーブデータ削除" + id);
		$.ajax({
			url: '../server/index.php/seve_del/' + id + "/",
			type: 'DELETE',
			data: {
				user_id: now_id,
				token: now_token
			}
		}).done((data)=>{
			// 削除成功
			$("#create_user_result").append("セーブデータ" + id + "番を削除しました。");
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
	}

	// ウェブストレージをチェック
	window.onload = () => {
		now_id = window.localStorage.getItem('wwasave_id');
		now_token = window.localStorage.getItem('wwasave_token');
		now_wwa_id = $("#wwa_id").val();
		if(now_id && now_token && now_wwa_id){
			show_save_list();
		}
		console.log(wwamap_url);
	}
	$(document).on("click", ".save_play", (event) => {
		let wwaId = $(event.target).attr("value");
		playSavedata(wwaId);
	})
	$(document).on("click", ".save_remove", (event) => {
		let wwaId = $(event.target).attr("value");
		removeSavedata(wwaId);
	})

	// ゲームの選択
	$(document).on("click", "#geme_select_button", () => {
		now_wwa_id = $("#wwa_id").val();
		window.localStorage.setItem('wwa_id', now_wwa_id);
		show_save_list();
	});
	// NEW GAMEで開始
	$(document).on("click", "#submit_newgame", () => {
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
		$("#login_status").html("");
		$("#save_list").html("");
		window.localStorage.removeItem('wwasave_id');
		window.localStorage.removeItem('wwasave_token');
		window.localStorage.removeItem('wwa_id');
		// TODO : '../server/index.php/logout/' にアクセスしてトークンを失効
	});
})();
