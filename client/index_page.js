(()=>{
	"use strict";
	let now_id = "";
	let now_token = "";
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
			now_id = submit_id;
			now_token = data.token;
			$("#create_user_result").html("");
			$("#create_user_result").append(now_id+"でログインしました。");
		}).fail((xhr)=>{
			$("#create_user_result").html("");
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
			$("#create_user_result").append(output_str);
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
			$("#create_user_result").html("");
			$("#create_user_result").append(now_id+"でログインしました。");
		}).fail((xhr)=>{
			$("#create_user_result").html("");
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
			$("#create_user_result").append(output_str);
		});
	});
	$(document).on("click","#now_token",()=>{
		$("#create_user_result").html("");
		$("#create_user_result").append("ID:"+now_id+"<br>token:"+now_token);
	});
})();
