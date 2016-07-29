var CityPickData = [];
var AreaPickData = [];

$.fn.CityPicker = function(_provence, _city, _dist, confirmcb) {
	var CityPickBlock = "";

	CityPickBlock += '<div class="citycontainer">';
	CityPickBlock += '<div id="cityblank" style="width: 100%; height: 60%;"></div>';
	CityPickBlock += '<div id="citycontent" style="width: 100%; height: 250px;">';
	CityPickBlock += '<div class="pick-toolbar">';
	CityPickBlock += '<div id="btn_citycancel">取消</div>';
	CityPickBlock += '<div id="btn_cityok">完成</div>';
	CityPickBlock += '<div id="txtTip">请选择</div>';
	CityPickBlock += '</div><div class="pick-content">';
	CityPickBlock += '<div class="highlightbar"></div> ';
	CityPickBlock += '<div id="picker-provence" class="picker-item">';
	CityPickBlock += '<div id="provenceitem">';
	CityPickBlock += '<div class="pickoneitem"></div>';
	CityPickBlock += '</div></div>';
	CityPickBlock += '<div id="picker-city" class="picker-item" >';
	CityPickBlock += '<div id="citysitem"><div class="pickoneitem"></div></div>';
	CityPickBlock += '</div><div id="picker-dist" class="picker-item" style="">';
	CityPickBlock += '<div id="distitem">';
	CityPickBlock += '<div class="pickoneitem"></div>';
	CityPickBlock += '</div></div></div></div></div>';
	$(this).click(function() {
		$("body").append(CityPickBlock);

		var CityConfig = {
			width: window.screen.width,
			height: window.screen.height,
			initTSTop: 0,
			initProvenceHeight: 0,
			ItemHeight: 30,
			StartY: 0,
			MoveDistance: 0,
			ProName: "",
			ProHeight: 0,
			ProTsY: 0,
			CityName: "",
			CityHeight: 0,
			CityTsY: 0,
			DistName: "",
			DistHeight: 0,
			DistTsY: 0,

		};

		$("#cityblank").height(CityConfig.height - 250).tap(function(e) {
			e.preventDefault();
			e.stopPropagation();
		})
		$("#btn_cityok").click(function(e) {
			e.preventDefault();
			e.stopPropagation();
			if(confirmcb != null) {
				confirmcb(CityConfig.ProName, CityConfig.CityName, CityConfig.DistName);
			}
			$(".citycontainer").remove();
		})
		$("#btn_citycancel").click(function(e) {
			e.preventDefault();
			e.stopPropagation();
			$(".citycontainer").remove();
		})
		$(".highlightbar").css("top", "90px");

		$("#provenceitem").unbind();
		CityConfig.ProTsY = 0;
		CityConfig.ProHeight = MSCitys.length * 30;
		$("#provenceitem").height(CityConfig.ProHeight + 180);
		var InnerHtml = "";
		InnerHtml += '<div class="pickoneitem"></div><div class="pickoneitem"></div><div class="pickoneitem"></div>';
		for(var i = 0; i < MSCitys.length; i++) {
			InnerHtml += '<div class="pickoneitem">' + MSCitys[i].name + '</div>';
		}
		InnerHtml += '<div class="pickoneitem"></div><div class="pickoneitem"></div><div class="pickoneitem"></div>';
		$("#provenceitem").css("transform", "translateY(" + CityConfig.initTSTop + "px)").html(InnerHtml);

		if(_provence != null && _city != null && _dist != null) {

			if(_provence != "") {
				CityConfig.ProName = _provence;
				CityConfig.CityName = _city;
				CityConfig.DistName = _dist;

				for(var i = 0; i < MSCitys.length; i++) {
					if(MSCitys[i].name == _provence) {

						CityPickData = MSCitys[i].city;

						for(var i = 0; i < MSCitys.length; i++) {

							if(MSCitys[i].name == _provence) {
								CityConfig.ProTsY = -i * 30;

								$("#provenceitem").css("transform", "translateY(" + CityConfig.ProTsY + "px)");

								break;
							}

						}

						for(var i = 0; i < CityPickData.length; i++) {
							if(CityPickData[i].name == _city) {
								AreaPickData = CityPickData[i].area;
								break;
							}

						}

						InitCity(_city);

						InitArea(_dist);
						break;

					}

				}

			}

		} else {

			CityPickData = MSCitys[0].city;
			AreaPickData = CityPickData[0].area;
			CityConfig.ProName = MSCitys[0].name;

			CityConfig.CityName = CityPickData[0].name;
			CityConfig.DistName = AreaPickData[0];

			InitCity();
			InitArea();

		}
		$("#provenceitem").on("touchstart", function(e) {
			e.preventDefault();
			e.stopPropagation();
			CityConfig.StartY = e.targetTouches[0].pageY;
		});
		$("#provenceitem").on("touchmove", function(e) {
			e.preventDefault();
			e.stopPropagation();
			var distance = e.targetTouches[0].pageY - CityConfig.StartY;

			CityConfig.MoveDistance = distance + CityConfig.ProTsY;
			if(CityConfig.MoveDistance > 0) {

			} else if(CityConfig.MoveDistance < -(CityConfig.ProHeight)) {

			} else {
				$("#provenceitem").css("transform", "translateY(" + CityConfig.MoveDistance + "px)")
			}

		});
		$("#provenceitem").on("touchend", function(e) {
			e.preventDefault();
			e.stopPropagation();
			CityConfig.ProTsY = CityConfig.MoveDistance;

			var idx = -Math.round(CityConfig.ProTsY / 30);

			if(idx >= MSCitys.length + 2) {
				idx = MSCitys.length - 1;
			} else if(idx <= 0) {
				idx = 0;
			}
			CityConfig.ProTsY = -idx * 30;
			$("#provenceitem").animate({
				translateY: -idx * 30 + "px"
			}, 400, "linear", function() {})

			CityConfig.ProName = $(".pickoneitem", "#provenceitem").eq(idx + 3).html();
			for(var i = 0; i < MSCitys.length; i++) {
				if(MSCitys[i].name == CityConfig.ProName) {

					CityPickData = MSCitys[i].city;
					AreaPickData = CityPickData[0].area;
					CityConfig.CityName = CityPickData[0].name;
					CityConfig.DistName = AreaPickData[0];

					InitCity();
					InitArea();
					break;

				}

			}

		});

		function InitCity(_city) {
			//加载所有城市
			$("#citysitem").unbind();
			CityConfig.CityTsY = 0;
			CityConfig.CityHeight = CityPickData.length * 30;
			$("#citysitem").height(CityConfig.CityHeight + 180);
			var InnerHtml = "";
			InnerHtml += '<div class="pickoneitem"></div><div class="pickoneitem"></div><div class="pickoneitem"></div>';
			for(var i = 0; i < CityPickData.length; i++) {
				InnerHtml += '<div class="pickoneitem">' + CityPickData[i].name + '</div>';
			}
			InnerHtml += '<div class="pickoneitem"></div><div class="pickoneitem"></div><div class="pickoneitem"></div>';

			$("#citysitem").css("transform", "translateY(" + CityConfig.initTSTop + "px)").html(InnerHtml);

			if(_city != null && _city != "") {

				for(var i = 0; i < CityPickData.length; i++) {

					if(CityPickData[i].name == _city) {
						CityConfig.CityTsY = -i * 30;
						$("#citysitem").css("transform", "translateY(" + CityConfig.CityTsY + "px)");

						break;
					}

				}
			}

			$("#citysitem").on("touchstart", function(e) {
				e.preventDefault();
				e.stopPropagation();
				CityConfig.StartY = e.targetTouches[0].pageY;
			});
			$("#citysitem").on("touchmove", function(e) {
				e.preventDefault();
				e.stopPropagation();
				var distance = e.targetTouches[0].pageY - CityConfig.StartY;

				CityConfig.MoveDistance = distance + CityConfig.CityTsY;
				if(CityConfig.MoveDistance > 0) {

				} else if(CityConfig.MoveDistance < -(CityConfig.CityHeight)) {

				} else {
					$("#citysitem").css("transform", "translateY(" + CityConfig.MoveDistance + "px)")
				}

			});

			$("#citysitem").on("touchend", function(e) {
				e.preventDefault();
				e.stopPropagation();
				CityConfig.CityTsY = CityConfig.MoveDistance;

				var idx = -Math.round(CityConfig.CityTsY / 30);

				if(idx >= CityPickData.length + 2) {
					idx = CityPickData.length - 1;
				} else if(idx <= 0) {
					idx = 0;
				}

				CityConfig.CityTsY = -idx * 30;
				$("#citysitem").animate({
					translateY: -idx * 30 + "px"
				}, 400, "linear", function() {})
				CityConfig.CityName = $(".pickoneitem", "#citysitem").eq(idx + 3).html();

				for(var i = 0; i < CityPickData.length; i++) {
					if(CityPickData[i].name == CityConfig.CityName) {
						AreaPickData = CityPickData[i].area;
						CityConfig.DistName = AreaPickData[0];
						InitArea();
						break;

					}

				}
			});

		}

		function InitArea(_dist) {
			$("#distitem").unbind();
			CityConfig.DistTsY = 0;
			//加载所有城市
			CityConfig.DistHeight = AreaPickData.length * 30;
			$("#distitem").height(CityConfig.DistHeight + 180);
			var InnerHtml = "";
			InnerHtml += '<div class="pickoneitem"></div><div class="pickoneitem"></div><div class="pickoneitem"></div>';
			for(var i = 0; i < AreaPickData.length; i++) {
				InnerHtml += '<div class="pickoneitem">' + AreaPickData[i] + '</div>';
			}
			InnerHtml += '<div class="pickoneitem"></div><div class="pickoneitem"></div><div class="pickoneitem"></div>';
			$("#distitem").css("transform", "translateY(" + CityConfig.initTSTop + "px)").html(InnerHtml);
			if(_dist != null && _dist != "") {

				for(var i = 0; i < AreaPickData.length; i++) {

					if(AreaPickData[i] == _dist) {

						CityConfig.DistTsY = -i * 30;

						$("#distitem").css("transform", "translateY(" + CityConfig.DistTsY + "px)");

						break;
					}

				}
			}

			$("#distitem").on("touchstart", function(e) {
				e.preventDefault();
				e.stopPropagation();
				CityConfig.StartY = e.targetTouches[0].pageY;
			});
			$("#distitem").on("touchmove", function(e) {
				e.preventDefault();
				e.stopPropagation();
				var distance = e.targetTouches[0].pageY - CityConfig.StartY;

				CityConfig.MoveDistance = distance + CityConfig.DistTsY;
				if(CityConfig.MoveDistance > 0) {

				} else if(CityConfig.MoveDistance < -(CityConfig.DistHeight)) {

				} else {
					$("#distitem").css("transform", "translateY(" + CityConfig.MoveDistance + "px)")
				}
			});
			$("#distitem").on("touchend", function(e) {
				e.preventDefault();
				e.stopPropagation();
				CityConfig.CityTsY = CityConfig.MoveDistance;

				var idx = -Math.round(CityConfig.CityTsY / 30);

				if(idx >= AreaPickData.length + 2) {
					idx = AreaPickData.length - 1;
				} else if(idx <= 0) {
					idx = 0;
				}

				CityConfig.DistTsY = -idx * 30;
				$("#distitem").animate({
					translateY: -idx * 30 + "px"
				}, 400, "linear", function() {

				})
				CityConfig.DistName = $(".pickoneitem", "#distitem").eq(idx + 3).html();

			});

		}

	})
}