// 全域變數設定
var xhr = new XMLHttpRequest();
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
	// 網頁載入時，讀取遠端資料
function updated(e){ 
	xhr.open("get", "json/data.JSON", true);
	xhr.send(null);
	xhr.onload = function(){
		if (xhr.readyState === 4){
			if (xhr.status === 200){
				let zoneArray = [];
				let str = "";
				travelData = JSON.parse(xhr.responseText);
				const LenData = travelData.length;
				for (let i = 0; i < LenData; i++){
					zoneArray.push(travelData[i].Zone);
				}
				// 篩選不重複的資料 (重複資料只保留一個，其餘剔除)
				const zoneData = zoneArray.filter(function(item, index, array){
					return array.indexOf(item) === index;
				});
				const LenZone = zoneData.length;
				for (let j = 0; j < LenZone; j++){
					str += `<option value='${zoneData[j]}'>${zoneData[j]}</option>`;
				}
				Zone.innerHTML = `<option value='_'>- - 請選擇行政區- -</option>${str}`;
			}
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