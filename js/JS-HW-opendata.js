// 全域變數設定
var openData1 = new XMLHttpRequest();
var openData2 = new XMLHttpRequest();
var openData3 = new XMLHttpRequest();
var travelData = [];
var showData = [];
var listArray = [];
var Zone = document.querySelector("#zoneId");
var popularZone = document.querySelector("#popularZoneId");
var selectZone = document.querySelector("#selectZoneId");
var dataBlock = document.querySelector("#showDataId");
var pageSwitch = document.querySelector(".page");
var scrolltopLink = document.querySelector(".scrolltop");


// 動作與監聽
updated(); 
Zone.addEventListener("change", zoneSelect, false);
popularZone.addEventListener("click", zoneSelect, false);
selectZone.addEventListener("click", showWindow, false);
dataBlock.addEventListener("click", closeWindow, false);
pageSwitch.addEventListener("click", switchPage, false);
scrolltopLink.addEventListener("click", scrolltop, false);


// 函式設定
	// 網頁載入時，讀取遠端資料 (前 100 筆)
function updated(e){ 
	openData1.open("get", "https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97", true);
	openData1.send(null);
	openData1.addEventListener("load", open1, false);
}
	// 前 100 筆資料讀取完畢後，讀取 101-200 筆資料
function open1(e){ 
	if(openData1.readyState === 4){
		if(openData1.status === 200){
			var Data = JSON.parse(openData1.responseText);
			var DataRecord = Data.result.records;
			var Len = DataRecord.length;
			for(var i = 0; i < Len; i++){
				travelData.push(DataRecord[i]);
			}
			openData2.open("get", "https://data.kcg.gov.tw/api/action/datastore_search?offset=100&resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97", true);
			openData2.send(null);
			openData2.addEventListener("load", open2, false);
		}
	}
}	
	// 前 200 筆資料讀取完畢後，讀取 201-300 筆資料
function open2(e){ 
	if(openData2.readyState === 4){
		if(openData2.status === 200){
			var Data = JSON.parse(openData2.responseText);
			var DataRecord = Data.result.records;
			var Len = DataRecord.length;
			for(var i = 0; i < Len; i++){
				travelData.push(DataRecord[i]);
			}
			openData3.open("get", "https://data.kcg.gov.tw/api/action/datastore_search?offset=200&resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97", true);
			openData3.send(null);
			openData3.addEventListener("load", open3, false);
		}
	}
}
	// 前 300 筆資料讀取完畢後，顯示行政區供選擇
function open3(e){ 
	if(openData3.readyState === 4){
		if(openData3.status === 200){
			var Data = JSON.parse(openData3.responseText);
			var DataRecord = Data.result.records;
			var Len = DataRecord.length;
			var zoneArray = [];
			var str = "";
			for(var i = 0; i < Len; i++){
				travelData.push(DataRecord[i]);
			}
			var LenData = travelData.length;
			for(var a = 0; a < LenData; a++){
				zoneArray.push(travelData[a].Zone);
			}
			// 篩選不重複的資料 (重複資料只保留一個，其餘剔除)
			var zoneData = zoneArray.filter(function(item, index, array){
				return array.indexOf(item) === index;
			});
			var LenZone = zoneData.length;
			for(var j = 0; j < LenZone; j++){
				str += "<option value='" + zoneData[j] + "'>" + zoneData[j] + "</option>"
			}
			Zone.innerHTML = "<option value='_'>- - 請選擇行政區- -</option>" + str;
		}
	}
}
	// 點擊選擇行政區時，列出該區前 8 個景點
function zoneSelect(e){
	if(e.target.nodeName !== "SELECT" && e.target.nodeName !== "INPUT"){
		return;
	}
	var Len = travelData.length;
	var select = e.target.value;
	var strArray = [];
	var showData1 = [];
	var pageNumStr = "";
	document.querySelector("#zoneNameId").innerHTML = select;
	for(var i = 0; i < Len; i++){
		if(select === travelData[i].Zone){
			showData1.push(travelData[i]);
		}
	}
	showData = showData1;
	var LenShow = Math.ceil(showData1.length / 8);
	for(var j = 0; j < LenShow; j++){
		var start = j * 8;
		var end = (j * 8) + 8;
		var str = "";
		for(var p = start; p < end; p++){
			if(typeof(showData1[p]) === "object"){
				str += "<li class='zoneListClass'><div class='Picture1'><img src='" + showData1[p].Picture1 + "'></div><div class='Picdescribe1'><h3>" + showData1[p].Name + "</h3><p>" + showData1[p].Zone + "</p></div><ul class='detailList'><li><span><img src='img/icons_clock.png'></span>" + showData1[p].Opentime + "</li><li><span><img src='img/icons_pin.png'></span>" + showData1[p].Add + "</li><li><span><img src='img/icons_phone.png'></span>" + showData1[p].Tel + "</li><li class='Ticketinfo'><span><img src='img/icons_tag.png'></span>" + showData1[p].Ticketinfo + "</li></ul><a href='#' data-num='" + p + "'></a></li>";
			}
		}
		strArray.push(str);
		pageNumStr += "<li><a href='#' data-page='" + j + "' class='pageNum'>" + (j + 1) + "</a></li>"
	}
	selectZone.innerHTML = strArray[0];
	listArray = strArray;
		// 顯示頁數 
	pageSwitch.innerHTML = "<li><a href='#' id='prevId' class='prev-nextPage'>&lt; prev</a></li>" + pageNumStr + "<li><a href='#' id='nextId' class='prev-nextPage'>next &gt;</a></li>";
	document.querySelector("a[data-page='0']").style.color = "#c41717";
		// 顯示回頁面頂部圖示
	scrolltopLink.style.display = "block";
}
	//返回頂部圖示的滾動效果
function scrolltop(e){
	e.preventDefault();
	var targetPos = document.querySelector("body").offsetTop;
	if(window.scroll){
		window.scroll({"behavior": "smooth", "top": targetPos});
	}
}
	// 點擊頁數切換顯示景點
function switchPage(e){
	e.preventDefault();
	var targetNode = e.target.nodeName;
	var targetPage = e.target.dataset.page;
	var selectAll = document.querySelectorAll(".page a");
	var select = document.querySelector("a[data-page='" + targetPage + "']");
	var Len = selectAll.length;
	var LenPage = Len - 2;
	if(targetNode === "A" && targetPage !== undefined){
		selectZone.innerHTML = listArray[targetPage];
		for(var i = 0; i < Len; i++){
			selectAll[i].style.color = "#4A4A4A";
		}
		select.style.color = "#c41717";	
		// 畫面滾動效果
		var targetPos = document.querySelector("#divideId").offsetTop;
		if(window.scroll){
			window.scroll({"behavior": "smooth", "top": targetPos});
		}
	}
	// 上下頁功能
	if(targetNode === "A" && targetPage == undefined){
		if(e.target.id == "prevId"){
			for(var j = 0; j < LenPage; j++){
				if(document.querySelector("a[data-page='" + j + "']").style.color == "rgb(196, 23, 23)"){
					if(j !== 0){
						selectZone.innerHTML = listArray[(j - 1)];
						document.querySelector("a[data-page='" + (j - 1) + "']").style.color = "#c41717";
						document.querySelector("a[data-page='" + j + "']").style.color = "#4A4A4A";
					}
				}
			}
		}else if(e.target.id == "nextId"){
			var lastPage = LenPage - 1;
			for(var k = lastPage; k > -1; k--){
				if(document.querySelector("a[data-page='" + k + "']").style.color == "rgb(196, 23, 23)"){
					if(k !== (LenPage - 1)){
						selectZone.innerHTML = listArray[(k + 1)];
						document.querySelector("a[data-page='" + (k + 1) + "']").style.color = "#c41717";
						document.querySelector("a[data-page='" + k + "']").style.color = "#4A4A4A";
					}
				}
			}
		}
		var targetPos = document.querySelector("#divideId").offsetTop;
		if(window.scroll){
			window.scroll({"behavior": "smooth", "top": targetPos});
		}
	}
}
	// 點擊選擇景點時，顯示該景點詳細資料
function showWindow(e){
	e.preventDefault();
	if(e.target.nodeName !== "A"){
		return;
	}
	var Num = e.target.dataset.num;
	// 網頁顯示視窗高度，不含滾動條
	var viewheight = document.documentElement.clientHeight;		
	var str = "<div class='showInfo'><div class='showImg'><div class='Picdescribe1-block'><h3>" + showData[Num].Name + "</h3><p>" + showData[Num].Zone + "</p></div></div><ul class='detailList'><li id='description'>" + showData[Num].Description + "</li><li><span><img src='img/icons_clock.png'></span>" + showData[Num].Opentime + "</li><li><span><img src='img/icons_pin.png'></span>" + showData[Num].Add + "</li><li><span><img src='img/icons_phone.png'></span>" + showData[Num].Tel + "</li><li class='Ticketinfo_block'><span><img src='img/icons_tag.png'></span>" + showData[Num].Ticketinfo + "</li></ul></div>";
	dataBlock.innerHTML = str;
	dataBlock.style.display = "block";
	document.querySelector(".showImg").style.backgroundImage = "url('" + showData[Num].Picture1 + "')";
	var showInfoHeight = document.querySelector(".showInfo").clientHeight;
	var shiftY = (viewheight - showInfoHeight) / 2; 
	document.querySelector(".showInfo").style.top = shiftY + "px";
}
	// 點擊景點詳細資料外的區域時，關閉景點詳細資料
function closeWindow(e){
	e.stopPropagation();
	if(e.target.id !== "showDataId"){
		return;
	}
	dataBlock.style.display = "none";
}