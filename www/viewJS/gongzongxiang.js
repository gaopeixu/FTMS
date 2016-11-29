$(document).ready(function() {
	$.ajax({
		type: 'post',
		contentType: 'application/json',
		url: 'http://192.168.0.47:81/WebService1.asmx/HelloWorld',
		data: "{}",
		dataType: 'json',
		cache: false,
		timeout: "30000",
		success: function(data) {
			var model = eval("("+data.d+")");
			
			document.addEventListener("deviceready", onDeviceReady, false);

			function onDeviceReady() {
				console.log("加载数据库");
				var db = window.sqlitePlugin.openDatabase({
					name: 'demo.db',
					location: 'default'
				});
				var msg;
				db.transaction(function(tx) {
					tx.executeSql('DROP TABLE IF EXISTS test_table');
					tx.executeSql('CREATE TABLE IF NOT EXISTS test_table (id integer primary key, data text, data_num integer)');
					tx.executeSql("INSERT INTO test_table (data, data_num) VALUES (?,?)", ["test", model.a]);
					tx.executeSql("INSERT INTO test_table (data, data_num) VALUES (?,?)", ["hello", 200]);
					tx.executeSql("INSERT INTO test_table (data, data_num) VALUES (?,?)", ["friend", 300], function(tx, res) {}, function(e) {
						alert("ERROR: " + e.message);
					});
					tx.executeSql("select * from test_table", [], function(tx, res) {
						//JSON打印
//						alert(JSON.stringify(res.rows));
						//数据个数
						var le = res.rows.length;
						//第一行
						var row = res.rows.item(0);
						//打印数据库数据
						for(var i = 0; i < le; i++) {
							for(var j in res.rows.item(i)) {
								var rows = res.rows.item(i);
								console.log(j + "=" + rows[j] + "; ");
							}
							console.log("<br />");
						}
						//取第一行数据中元素
						var countValue = row.data_num;
                                  
                        var dayValue = row.data_num;
                                  
                        console.log("dayValue="+ dayValue);
                                  
                        document.getElementById("day").innerHTML= dayValue;
                                
						msg = "<p>countValue " + countValue + "</p>";
						//赋值
						chartLoad(countValue);
					});
				});
			}
           
        
			function chartLoad(countValue) {
				var myChart = echarts.init(document.getElementById('myChart'));
				option = {
					backgroundColor: 'white',
					tooltip: {
						formatter: "{a} <br/>{b} : {c}%"
					},
					series: [{
						name: '业务指标',
						type: 'gauge',
						detail: {
							formatter: '{value}%'
						},
						//仪表盘显示数据  
						axisLine: {
							//仪表盘轴线样式  
							lineStyle: {
								width: 15,
								color: [
									[1, 'green']
								]
							}
						},
						splitLine: {
							//分割线样式  
							length: 10
						},
						data: [{
							value: countValue,
							name: '商谈'
						}]
					}]
				};
				myChart.setOption(option, true);
			}
			
        
					},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert(errorThrown);
			alert(XMLHttpRequest.readyState);
			alert(textStatus);
		}
	});
});