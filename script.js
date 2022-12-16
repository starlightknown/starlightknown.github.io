// CONTINUUM UI

$(function() {
	sWindowUI();
	AppFilesUpdateCurrentItem();
	// createWindow(data,content,width,height,tmp,bD)
	$(".enableTestPanel").mousedown(function() {
		$(".sPanelTest").toggleClass("disabled");
	});
	$(".testCreateW").click(function() {
		createWindow(
			"testImage",
			"Hi this is a test (also in dev, sorry 😔)",
			200,
			80,
			true,
			true
		);
	});
	$(".testCreateWi").click(function() {
		createWindow(
			"test",
			"<div class='img' style='background-image:url(https://i.imgur.com/8hnWJjq.jpg)'></div>",
			200,
			80,
			true,
			true
		);
	});
	$(".messages").animate({ scrollTop: $(".messages").prop("scrollHeight") }, 0);

	// Window size

	var zIndex = 1,
		fullHeight = $(window).height(),
		fullWidth = $(window).width();

	$(window).resize(function() {
		fullWidth = $(window).width();
		fullHeight = $(window).height();

		$(".window").draggable({
			containment: [
				-1 * $(".desktop").width(),
				22,
				$(".desktop").width(),
				$(".desktop").height()
			]
		});
	});

	// === Settings ===
	var sAnimateAppsIconOnOpen = $(".sAnimateAppsIconOnOpen").is(":checked");
	if (sAnimateAppsIconOnOpen) {
		$(".taskbar").addClass("animateOnOpen");
	} else {
		$(".taskbar").removeClass("animateOnOpen");
	}
	$(".canCheck").click(function() {
		// Make checking bidirectional between canCheck and checkable

		if (
			$(this)
				.find("input")
				.is(":checked")
		) {
			$(
				".checkable[data-trigger='" +
					$(this)
						.find("input")
						.attr("class") +
					"']"
			).attr("data-checked", "true");
			$(
				"[" +
					$(this)
						.find("input")
						.attr("class") +
					"]"
			).attr($(this)
						.find("input")
						.attr("class"), "true");
		} else {
			$(
				".checkable[data-trigger='" +
					$(this)
						.find("input")
						.attr("class") +
					"']"
			).attr("data-checked", "false");
			$(
				"[" +
					$(this)
						.find("input")
						.attr("class") +
					"]"
			).attr($(this)
						.find("input")
						.attr("class"), "false");
		}

		// Animations

		var sAnimateAppsIconOnOpen = $(".sAnimateAppsIconOnOpen").is(":checked");
		if (sAnimateAppsIconOnOpen) {
			$(".taskbar").addClass("animateOnOpen");
		} else {
			$(".taskbar").removeClass("animateOnOpen");
		}
	});
	$(".canCheck .status").click(function() {
		$(this).toggleClass("checked");
		if ($(this).hasClass("sEnergySaver")) {
			if ($(this).hasClass("sEnergySaver") & $(this).hasClass("checked")) {
				$(".powerIcon")
					.parent()
					.addClass("eco");
			} else {
				$(".powerIcon")
					.parent()
					.removeClass("eco");
			}
		}
	});

	// === Taskbar ===

	function appMenuToggle() {
		sActionbarBlur();
		$(".appMenu").toggleClass("open");
		if (!$(".appMenu").hasClass("open")) {
			setTimeout(function() {
				$(".appMenuSearch").val("");
				$(".app").removeClass("noMatch");
				$(".sep").removeClass("noMatch");
			}, 100);
		} else {
			$(".appMenuSearch").focus();
			$(".sPanel").removeClass("active");
		}
	}
	function appMenuClose() {
		$(".appMenu").removeClass("open");
		setTimeout(function() {
			$(".appMenuSearch").val("");
			$(".app").removeClass("noMatch");
			$(".sep").removeClass("noMatch");
			//$('.appMenuAppList').scrollTo(0,0);
		}, 100);
	}

	$("[data-trigger]").click(function() {
		var dataTrigger = $(this).data("trigger");
		switch (dataTrigger) {
			case "sAppsMenu":
				// Opens App Menu
				appMenuToggle();
				break;
			case "sPowerShowPercentage":
				break;
			default:
				// do nothing
				break;
		}
	});
	$(".closeAppsMenu").mousedown(function() {
		appMenuClose();
	});
	$(document).keydown(function(e) {
		if (e.keyCode === 27 && !$(".lockScreen").hasClass("locked")) {
			// 27 == ESC
			appMenuToggle();
		}
	});
	function sActionbarTriggered() {
		return $(".actionbar .leftActions .item").hasClass("active");
	}
	function sActionbarItemTrigger(item) {
		var trigger = item.attr("data-trigger"),
			sActionbarActiveL = 0,
			sActionbarActiveW = 0,
			sPanelW = 0,
			sDisplayW = 0;
		if (item.hasClass("active")) {
			item.removeClass("active");
			$("." + trigger).removeClass("active");
		} else {
			$(
				".actionbar .rightActions .item, .actionbar .leftActions .item"
			).removeClass("active");
			$(".sPanel").removeClass("active");
			item.addClass("active");
			$("." + trigger).addClass("active");
			if ($("." + trigger).find(".input").length !== 0) {
				$(".sPanel.active .input input")
					.val("")
					.focus();
			} else {
				$(".sPanel .input input").blur();
			}
		}
		sActionbarActiveL = item.offset().left; //Math.floor(item.offset().left)
		sActionbarActiveW = item.innerWidth(); //Math.floor(item.innerWidth())
		sPanelW = $(".sPanel.active").innerWidth(); //Math.floor($(".sPanel.active").innerWidth())
		sDisplayW = $(".desktop").width(); //Math.floor($(".desktop").width())

		$(".sPanel.sActionbarPanel").css({ left: 0 });
		if (sActionbarActiveL + sPanelW + 40 < sDisplayW) {
			$(".sPanel.sActionbarPanel").css({ left: sActionbarActiveL });
		} else {
			$(".sPanel.sActionbarPanel").css({
				left: sActionbarActiveL + sActionbarActiveW - sPanelW
			});
		}
		sActionbarActiveL = 0;
		sActionbarActiveW = 0;
		sPanelW = 0;
		sDisplayW = 0;
	}

	$(".actionbar .rightActions .item, .actionbar .leftActions .item").mousedown(
		function() {
			sActionbarItemTrigger($(this));
		}
	);

	$(".actionbar .leftActions .item").mouseover(function(e) {
		if (
			sActionbarTriggered() &&
			!$(".actionbar .leftActions .item.active").is($(e.target))
		) {
			sActionbarItemTrigger($(this));
		}
	});
	function sActionbarBlur() {
		$(
			".sPanel, .actionbar .rightActions .item, .actionbar .leftActions .item"
		).removeClass("active");
	}
	$(".sPanel .clickable, .sPanel .sPanelAux .clickable").click(function() {
		sActionbarBlur();
	});
	$(".sPanel .menu").mouseenter(function() {
		$(".sPanelAux")
			.html(
				$(this)
					.children(".submenu")
					.children()
					.clone()
			)
			.css({
				top: $(this).offset().top - 10,
				left: $(this).offset().left + $(this).innerWidth() + 22
			})
			.addClass("active");
	});

	$(".sPanel .menu").mouseleave(function() {
		if (!$(".sPanelAux").is(":hover")) {
			$(".sPanelAux")
				.removeClass("active")
				.html();
		}
	});

	$(".sPanel .checkable").click(function() {
		$("input." + $(this).data("trigger")).click();
	});

	$("[data-search]").on("keyup", function() {
		var searchVal = $(this).val();
		var filterItems = $("[data-filter-item], .sep");

		if (searchVal != "") {
			filterItems.addClass("noMatch");
			$(
				'[data-filter-item][data-filters*="' + searchVal.toLowerCase() + '"]'
			).removeClass("noMatch");
		} else {
			filterItems.removeClass("noMatch");
		}
	});

	$(".desktop").mousedown(function(e) {
		appMenuClose();
		sActionbarBlur();
		if ($(".desktop").has(e.target).length === 0) {
			$(".window").removeClass("window--active");
		}
	});

	// User logout
	function LockScreenCheckPass() {
		let password = $(".systemLockInput").val();
		$(".lockScreenLogIn").addClass("wait");
		$(".systemLockInput").blur();
		if (password === "123") {
			setTimeout(function() {
				$(".lockScreen").removeClass("locked");
				$(".lockScreenLogIn").removeClass("wait");
			}, 200);
		} else {
			setTimeout(function() {
				$(".lockScreenLogIn")
					.addClass("wrong")
					.removeClass("wait");
				$(".systemLockInput").focus();
			}, 2000);
		}
	}
	$('[data-trigger="sActionLogout"]').click(function() {
		$(".systemLockInput").val("");
		$(".lockScreenLogIn").removeClass("wait");
		$(".login").addClass("empty");
		setTimeout(function() {
			appMenuClose();
			$(".systemLockInput").focus();
		}, 200);
		$(".lockScreen").addClass("locked");
	});
	$(".login").click(function() {
		$(".lockScreenLogIn").removeClass("wrong");
		LockScreenCheckPass();
	});
	$(".systemLockInput").keyup(function(e) {
		if (e.keyCode === 13 || e.which == 13) {
			LockScreenCheckPass();
		} else {
			$(".lockScreenLogIn").removeClass("wrong");
			if (!($(".systemLockInput").val() == "")) {
				$(".login").removeClass("empty");
			} else {
				$(".login").addClass("empty");
			}
		}
	});

	// User inactivity procedure
	var idleTime = 0;
	var idleInterval = setInterval(timerIncrement, 60000);
	$('[data-tigger="sActionSleep"]').click(function() {
		sSleep();
	});
	function sSleep() {
		$("body").addClass("sleep");
	}
	function sWakeUp() {
		$("body").removeClass("sleep");
	}
	$(this).mousemove(function(e) {
		idleTime = 0;
		sWakeUp();
	});
	$(this).keypress(function(e) {
		idleTime = 0;
		sWakeUp();
	});
	function timerIncrement() {
		idleTime = idleTime + 1;
		if (idleTime > 59) {
			$(".logout").click();
		}
		if (idleTime > 60) {
			sSleep();
		}
		if (idleTime > 0 && $(".lockScreen").hasClass("locked")) {
			sSleep();
		}
	}

	// === Notifications system ===

	function sNotificationDiscard(n) {
		n.addClass("close");
		setTimeout(function() {
			n.remove();
			sNotificationFlag();
		}, 300);
	}
	function sNotificationFlag() {
		if (!$(".sPanelNotifications .item").length) {
			$(".sActionbarNotifications").removeClass("hasNotifications");
			$('[sSwitchId="notifications"]').addClass("empty");
		} else {
			$('[sSwitchId="notifications"]').removeClass("empty");
			$(".sActionbarNotifications").addClass("hasNotifications");
		}
	}
	$(".sPanelNotifications .item").draggable({
		axis: "x",
		scroll: false,
		containment: [fullWidth - 350, 0, fullWidth, 0],
		start: function() {
			$(this).css({ transition: "none" });
		},
		drag: function() {
			let opacity = (360 - $(this).position().left) / 360;
			$(this).css({ opacity: opacity });
		},
		stop: function() {
			let left = $(this).position().left;
			if (left > 80) {
				sNotificationDiscard($(this));
			} else {
				$(this).css({
					left: 0,
					transition: "all .15s cubic-bezier(.63,.92,.68,.98)",
					opacity: 1
				});
			}
		}
	});

	$("[sSwitch] .option").click(function() {
		var sSwitchShow = $(this).attr("sSwitchShow");
		$(this)
			.parent()
			.parent()
			.parent()
			.children("[sSwitchId]")
			.attr("sSwitchVisibility", "disabled");
		$(this)
			.parent()
			.children(".option")
			.removeClass("active");
		$(this)
			.parent()
			.parent()
			.parent()
			.children("[sSwitchId='" + sSwitchShow + "']")
			.attr("sSwitchVisibility", "enabled");
		$(this).addClass("active");
	});

	// Notification widget

	$("#nWtime").mousedown(function(e) {
		let w = e.pageX - $("#nWtime").offset().left;
		$("#nWtimeH").css({ width: w });
	});
	$("#nWtimeH").resizable({
		handles: "e",
		minWidth: 7
	});

	// === Right Click ===
	/*$(document).bind("contextmenu",function(event){
		event.preventDefault();
	});*/
	$(document).bind("contextmenu", function(event) {
		event.preventDefault();
		let target = $(event.target);
		let cm = $(".context"); // Context menu
		function show() {
			$(".context")
				.fadeIn(50)
				.css({ top: event.pageY - 5, left: event.pageX + 2 });
		}
		if (!target.closest(".window").hasClass("nocm")) {
			show();
		}
		
		//$(".context .background").css({top: y, left: x });
		let cmSep = '<div class="sep"></div>',
			cmFilesys =
				'<div class="item">Copy</div><div class="item">Cut</div><div class="sep"></div><div class="item more">Share</div><div class="item">Open</div><div class="sep"></div><div class="item sFilesysDelete">Delete</div>',
			cmFilesysGetInfo = '<div class="item sFilesysGetInfo">Get Info</div>',
			cmFilesysInfo =
				'<div class="icon" data-type="' +
				target.attr("data-type") +
				'" data-name="' +
				target.attr("data-name") +
				'"></div><div class="text">Type:<i>' +
				target.attr("data-type") +
				'</i></div><div class="text">Name:<i>' +
				target.attr("data-name") +
				'</i></div><div class="text">Created on:<i>' +
				target.attr("data-date") +
				'</i></div><div class="text">Disk usage:<i>' +
				target.attr("data-bytes") +
				' bytes</i></div><div class="sep"></div><div class="item center">Close</div>',
			cmFilesysDeletePrompt =
				'<div class="icon" data-type="' +
				target.attr("data-type") +
				'" data-name="' +
				target.attr("data-name") +
				'"></div><div class="text center">Are you sure that you want to delete "' +
				target.attr("data-name") +
				'"?</div><div class="sep"></div><div class="item center sFilesysDeleteYes">Delete</div>',
			cmMessageCard =
				'<div class="item">Call</div><div class="item">Videochat</div><div class="sep"></div><div class="item">Mute</div><div class="item">Block</div>',
			cmNotificationItem =
				'<div class="item">Configure app banners</div><div class="item">Mute app</div><div class="sep"></div><div class="item sNotificationDiscard">Discard</div>',
			cmNotificationWidget =
				'<div class="item">Configure widget</div><div class="sep"></div><div class="item">Close app</div>',
			cmNotDefined = '<div class="item">Work In Progress (Be patient)</div>';
		if (target.hasClass("folder") || target.hasClass("file")) {
			AppFilesDeselect();
			target.addClass("selected");
			cm.html(cmFilesysGetInfo + cmSep + cmFilesys);
		} else if (
			target.hasClass("folder selected") ||
			target.hasClass("file selected")
		) {
			cm.html(cmFilesysGetInfo + cmSep + cmFilesys);
		} else if (target.hasClass("card")) {
			cm.html(cmMessageCard);
			show();
		} else {
			/*else if (target.hasClass("notificationItem")) {
			cm.html(cmNotificationItem);
		}
		else if (target.hasClass("notificationWidget")) {
			cm.html(cmNotificationWidget);
		}*/
			cm.html(cmNotDefined);
		}
		cm.mousedown(function(event) {
			let target = $(event.target);
			if (target.hasClass("item")) {
				if (target.hasClass("sFilesysGetInfo")) {
					cm.html(cmFilesysInfo);
				}
				if (target.hasClass("sFilesysDelete")) {
					cm.html(cmFilesysDeletePrompt);
				}
				if (target.hasClass("sFilesysDeleteYes")) {
					let ObjectSelected = "";
					ObjectSelected = $(".filesys").find(".file.selected, .folder.selected");
					//ObjectSelected.addClass("itworks");
					ObjectSelected.remove();
				}
			}
		});
		// Setting position when knowing context dimensions
		let y = Math.floor($(".context").position().top * -1);
		let x = Math.floor($(".context").position().left * -1);
		let h = Math.floor($(".context").height());
		let w = Math.floor($(".context").width());
		let dH = Math.floor($(".desktop").height());
		let dW = Math.floor($(".desktop").width());
		if (y * -1 + h + 50 > dH) {
			h = h + 10;
			cm.css({ top: event.pageY - h + 6 });
		}
		if (x * -1 + w + 50 > dW) {
			cm.css({ left: event.pageX - w });
		}
	});

	$(document).mousedown(function() {
		isHovered = $(".context").is(":hover");
		if (isHovered == true) {
			$(".context .item").mousedown(function() {
				$(".context").fadeOut(50);
			});
		} else {
			$(".context").fadeOut(50);
		}
	});

	// === Window & Taskbar actions ===

	// Set taskbar app item to open on each app
	/*$(function() {
    $('.window:visible').each(function() {
      var appName = $(this).data('window');
      
      $('.taskbar__item[data-window="' + appName + '"]').addClass('taskbar__item--open');
    });
  });*/

	//activates the first window that shows on screen
	/*$(function() {
    var initialActive = $('.window').first();
    var appName = $(initialActive).data('window');
    
   $(initialActive).addClass('window--active').css({'z-index' : zIndex++});
   $('.taskbar__item[data-window="' + appName + '"]').addClass('taskbar__item--active');
  });*/

	// Function that creates a new window with the parameters:
	//		data -> Name on the window
	//		content -> The actual content that you want to show up on the window
	//		width -> Sets the window's width
	//		height -> Sets the window's height
	//		tmp -> "True" creates a temporal window, not static (When you click 'close' it is destroyed) / "False" creates a static window [r -> internally used to add 'tmp' class to the window]
	//		bD -> "True" makes the window background blur what's behind (cool right?)

	function createWindow(data, content, width, height, tmp, bD) {
		let c = content,
			b,
			d = data,
			r = "";
		if (tmp) {
			r = "tmp";
			b = '<a class="window__close"></a>';
		} else {
			b =
				'<a class="window__close"></a><a class="window__minimize"></a><a class="window__maximize"></a>';
		}
		let w =
			'<div class="window window--' +
			d +
			" window--active " +
			r +
			'" data-window="' +
			d +
			'" data-windowBackdrop="' +
			bD +
			'" style="width:' +
			width +
			"px;height:" +
			height +
			"px;top:calc(50% - " +
			height / 2 +
			"px);left: calc(50% - " +
			width / 2 +
			'px);"><div class="window__handler ui-draggable-handle"><div class="window__controls">' +
			b +
			'</div></div><div class="window__body solidHandler"><div class="window__main">' +
			c +
			"</div></div></div>";
		$(".desktop").append(w);
		setTimeout(function() {
			sWindowActive($(".window[data-window='" + d + "']"));
		}, 1);
		// Make window Draggable and Resizable (and debug others that are not)
		sWindowUI();
		// Setting "close" button actions
		$(".window[data-window='" + d + "']")
			.find(".window__close")
			.mousedown(function() {
				let parentWindow = $(".window[data-window='" + d + "']");
				$(parentWindow).addClass("window--closing");
				setTimeout(function() {
					$(parentWindow)
						.hide()
						.removeClass("window--closing");
					if (parentWindow.hasClass("tmp")) {
						$(".window[data-window='" + d + "']").remove();
					}
				}, 100);
			});
	}

	// Set window active when mousedown
	$(".desktop").mousedown(function(e) {
		sWindowUI();
		if ($(e.target).parents(".window").length) {
			sWindowActive($(e.target).parents(".window"));
		}
	});

	$(".window__actions a").click(function(e) {
		e.preventDefault();
	});
	
	function sWindowUI() {
		// Makes sure every window is draggable
		$(".desktop .window:not(.ui-draggable)").draggable({
			containment: [
				-1 * $(".desktop").width(),
				22,
				$(".desktop").width(),
				$(window).height()
			],
			handle: ".window__handler",
			start: function(event, ui) {
				sWindowActive($(this));
				$(".context").fadeOut(50);
			},
			stop: function() {
				var initialHeight = $(this).height(),
					initialWidth = $(this).width(),
					initialTop = $(this).position().top,
					initialLeft = $(this).position().left;
			}
		});
		// Makes sure every window is resizable
		$(".desktop .window:not(.ui-resizable)").resizable({
			handles: "all",
			stop: function() {
				var initialHeight = $(this).height(),
					initialWidth = $(this).width(),
					initialTop = $(this).position().top,
					initialLeft = $(this).position().left;
			}
		});
		// Makes sure every window responds to window controls

		// Creates a taskbar icon for the app window (IN DEVELOPMENT)
	}

	function sWindowActive(window) {
		$(".window").removeClass("window--active");
		var appName = window.data("window");
		var targetWindow = $('.window[data-window="' + appName + '"]');
		window.addClass("window--active");
		window.css({ "z-index": zIndex++ });
		$(".taskbar__item[data-window]").removeClass("taskbar__item--active");
		$('.taskbar__item[data-window="' + appName + '"]')
			.addClass("taskbar__item--active")
			.addClass("taskbar__item--open");
	}

	if ($(this).hasClass("window--maximized")) {
		$(this).removeClass("window--maximized");

		$(this).css({ height: initialHeight, width: initialWidth, top: 0, left: 50 });
	}

	function openApp(e) {
		// Open app from taskbar
		var appName = $(this).data("window");
		var targetWindow = $('.window[data-window="' + appName + '"]');
		var targetTaskbar = $('.taskbarApp[data-window="' + appName + '"]');

		if ($(this).data("trigger") !== null && targetWindow == null || $(this).data("trigger") == null && targetWindow !== null) { 
				appMenuClose();
	  }
		e.preventDefault();

		if (targetWindow.is(":visible")) {
			if (targetWindow.hasClass("window--active")) {
				$(targetWindow).removeClass("window--minimized");

				if (!targetWindow.hasClass("window--minimized")) {
					var initialHeight = $(targetWindow).height(),
						initialWidth = $(targetWindow).width(),
						initialTop = $(targetWindow).position().top,
						initialLeft = $(targetWindow).position().left;

					$(".window").removeClass("window--active");

					$(targetWindow)
						.removeClass("window--closed")
						.addClass("window--active")
						.css({ "z-index": zIndex++, "pointer-events": "all", opacity: 1 });

					$(targetTaskbar).addClass("open");
				}
			} else {
				$(".window").removeClass("window--active");
				$(targetWindow)
					.removeClass("window--closed")
					.addClass("window--active")
					.css({ "z-index": zIndex++, "pointer-events": "all", opacity: 1 });
				if (targetWindow.hasClass("window--minimized")) {
					$(targetWindow).removeClass("window--minimized");
				}
				$(targetTaskbar).addClass("open");
			}
		} else {
			$(".window").removeClass("window--active");

			$('.window[data-window="' + appName + '"]')
				.removeClass("window--closed")
				.addClass("window--active")
				.css({ "z-index": zIndex++, "pointer-events": "all", opacity: 1 });

			setTimeout(function() {
				$('.window[data-window="' + appName + '"]').removeClass("window--opening");
			}, 0);

			$(targetTaskbar).addClass("open");
		}
	}

	$('.taskbarApp, [data-trigger="window"]').click(openApp);

	function centerApp(e) {
		//var appName = $(this).data("window"), targetWindow = $('.window[data-window="' + appName + '"]');
		var targetWindow = $('.window[data-window="' + $(this).data("window") + '"]');
		var setTop =
			$(window).height() / 2 - targetWindow.height() / 2 < 22
				? 22
				: $(window).height() / 2 - targetWindow.height() / 2;
		targetWindow.css({
			top: setTop,
			left: $(window).width() / 2 - targetWindow.width() / 2
		});
	}

	$('.taskbarApp, [data-trigger="window"]').dblclick(centerApp);

	function appMenuOpenApp(e) {
		var appName = $(this).data("window");
		var targetWindow = $('.window[data-window="' + appName + '"]');
		var targetTaskbar = $('.taskbarApp[data-window="' + appName + '"]');
		// Closes start menu when app is clicked
		appMenuClose();
		//setTimeout(function() {appMenuClose();}, 5);

		e.preventDefault();

		if (targetWindow.is(":visible")) {
			if (targetWindow.hasClass("window--active")) {
				$(targetWindow).removeClass("window--minimized");

				if (!targetWindow.hasClass("window--minimized")) {
					var initialHeight = $(targetWindow).height(),
						initialWidth = $(targetWindow).width(),
						initialTop = $(targetWindow).position().top,
						initialLeft = $(targetWindow).position().left;

					$(".window").removeClass("window--active");

					$(targetWindow)
						.removeClass("window--closed")
						.addClass("window--active")
						.css({ "z-index": zIndex++, "pointer-events": "all", opacity: 1 });

					$(targetTaskbar).addClass("open");
				}
			} else {
				$(".window").removeClass("window--active");
				$(targetWindow)
					.removeClass("window--closed")
					.addClass("window--active")
					.css({ "z-index": zIndex++, "pointer-events": "all", opacity: 1 });
				if (targetWindow.hasClass("window--minimized")) {
					$(targetWindow).removeClass("window--minimized");
				}
				$(targetTaskbar).addClass("open");
			}
		} else {
			$(".window").removeClass("window--active");
			$('.window[data-window="' + appName + '"]')
				.removeClass("window--closed")
				.addClass("window--active")
				.css({ "z-index": zIndex++, "pointer-events": "all", opacity: 1 });

			$(targetTaskbar).addClass("open");
		}
	}

	$(".app .icon").click(appMenuOpenApp);

	// Window controls

	$(".window__controls").each(function() {
		var parentWindow = $(this).closest(".window");
		var appName = $(parentWindow).data("window");

		$(this)
			.find("a")
			.click(function(e) {
				e.preventDefault();
			});

		$(this)
			.find(".window__close")
			.click(function(e) {
				$(parentWindow)
					.addClass("window--closed")
					.css({ "pointer-events": "none", opacity: 0 });
				//.addClass("window--closing")

				setTimeout(function() {
					//$(parentWindow).removeClass("window--closing");
					$(parentWindow).removeClass("window--active");
					if (parentWindow.hasClass("tmp")) {
						parentWindow.remove();
					}
				}, 1000);

				setTimeout(function() {
					$('.taskbarApp[data-window="' + appName + '"]').removeClass("open");
					$('.taskbar__item[data-window="' + appName + '"]').removeClass(
						"taskbar__item--open taskbar__item--active"
					);
				}, 1);
			});

		$(this)
			.find(".window__minimize")
			.click(function(e) {
				$(parentWindow).addClass("window--minimized");
				//$(parentWindow).css({'left' : window.innerWidth/2 - $(parentWindow).width()/2 });
				setTimeout(function() {
					$('.taskbar__item[data-window="' + appName + '"]').removeClass(
						"taskbar__item--active"
					);
				}, 1);
			});

		$(this)
			.find(".window__maximize")
			.click(function(e) {
				$(parentWindow).toggleClass("window--maximized");

				if (!$(parentWindow).hasClass("window--maximized")) {
					$(parentWindow).css({
						height: initialHeight,
						width: initialWidth,
						top: initialTop,
						left: initialLeft
					});
				} else {
					initialHeight = $(parentWindow).height();
					initialWidth = $(parentWindow).width();
					initialTop = $(parentWindow).position().top;
					initialLeft = $(parentWindow).position().left;

					$(parentWindow).css({
						height: fullHeight - 34,
						width: fullWidth,
						top: 0,
						left: 0
					});
				}
			});
	});
});

// Prevent "open" class on start
/*$(function() {
  $('.taskbar__item--start').click(function() {
    $(this).removeClass('taskbar__item--open taskbar__item--active');
  });
});*/

// === Apps ===
// --------------------
// MESSAGES
// --------------------

$(document).keydown(function(e) {
	let input = $(".window--messages").find(".chatbox input");
	if (
		e.keyCode === 13 &&
		input.is(":focus") &&
		input.val().replace(/^\s+|\s+$/g, "").length != 0
	) {
		// 39 == ENTER
		$(".messages").append(
			"<div class='message mine'><span>" + input.val() + "</span></div>"
		);
		input.val("");
		setTimeout(function() {
			$(".messages").animate(
				{ scrollTop: $(".messages").prop("scrollHeight") },
				250
			);
		}, 100);
	}
});
$(".audio .cancel").mousedown(function() {
	$(".audio")
		.removeClass("recorded")
		.removeClass("recording");
	$(".audioMargin").removeClass("recording");
	// Discard audio
});
$(".audio .trigger").mousedown(function() {
	let aD, aDs, aDm;
	if ($(".audio").hasClass("recorded")) {
		$(".audio").removeClass("recorded");
		$(".audioMargin").toggleClass("recording");
		// Send audio
		$(".messages").append(
			"<div class='message audio mine'><span data-duration='" +
				$(".audio .audioDuration").html() +
				"'><div class='controls'><div class='play'></div><div class='timeNav'><div class='handler'></div></div></div></span></div>"
		);
		setTimeout(function() {
			$(".messages").animate(
				{ scrollTop: $(".messages").prop("scrollHeight") },
				250
			);
		}, 100);
	} else {
		if ($(".audio").hasClass("recording")) {
			$(".audio").addClass("recorded");
			$(".audio").removeClass("recording");
			// Audio is recorded, waiting for accept
		} else {
			$(".audio")
				.addClass("recording")
				.addClass("minLen");
			$(".audioMargin").toggleClass("recording");
			// Audio is being recorded
			aD = 0;
			function printaD() {
				if (aD == 0) {
					$(".audio .audioDuration").html("00:00");
				} else {
					$(".audio .audioDuration").html(aDm + ":" + aDs);
				}
				setTimeout(function() {
					aD++;
					aDm = Math.floor(aD / 60);
					aDs = aD % 60;
					if (aDm < 10) {
						aDm = "0" + aDm;
					}
					if (aDs < 10) {
						aDs = "0" + aDs;
					}
					//$(".audio .audioDuration").html(aDm+":"+aDs);
					if ($(".audio").hasClass("recording")) {
						printaD();
					}
					if (aD >= 1) {
						$(".audio").removeClass("minLen");
					}
				}, 1000);
			}
			printaD();
		}
	}
});

// --------------------
// SAFARI
// --------------------

$(".tabs").mousedown(function(e) {
	var target = $(e.target).closest("li");
	if (target.hasClass("sAppSafariNewTab")) {
		// Creates new tab and sets focus
		target
			.parent()
			.children()
			.removeClass("active");
		target.before(
			"<li class='active' data-tabId='favorites'><a class='close'></a>Favorites</li>"
		);
		$(".content[data-tabId]").removeClass("visible");
		$(".content[data-tabId='favorites']").addClass("visible");
	} else {
		if (!target.find(".close").is(":hover")) {
			var tabId = target.attr("data-tabId"),
				content = $(".content[data-tabId]"),
				contentId = $(".content[data-tabId='" + tabId + "']");
			content.removeClass("visible");
			target
				.parent()
				.children()
				.removeClass("active");
			contentId.addClass("visible");
			target.addClass("active");
		}
	}
});

$(".tabs").click(function(e) {
	var target = $(e.target).closest("li");
	if (target.find(".close").is(":hover")) {
		if (target.hasClass("active")) {
			target
				.parent()
				.children()
				.removeClass("active");
			var tabId = target.attr("data-tabId"),
				content = $(".content[data-tabId]"),
				contentId = $(".content[data-tabId='" + tabId + "']"),
				nextTab;
			content.removeClass("visible");
			if (
				(!(target.next().length == 0) &&
					!target.next().hasClass("sAppSafariNewTab")) ||
				!(target.prev().length == 0)
			) {
				// If there is at least one more tab
				if (
					!(target.next().length == 0) &&
					!target.next().hasClass("sAppSafariNewTab")
				) {
					nextTab = target.next();
				} else {
					nextTab = target.prev();
				}
				// Activates next tab
				nextTab.addClass("active");
				var nextTabId = nextTab.attr("data-tabId");
				$(".content[data-tabId='" + nextTabId + "']").addClass("visible");
			}
		}
		target.remove();
		if (tabId == "favorites") {
			contentId.removeClass("visible");
		} else {
			contentId.remove();
		}
	}
});

// --------------------
// END APPS
// --------------------

// OSDrivenBehavior

let OSDrivenBehavior = "Unknown OS";
if (navigator.appVersion.indexOf("Win") != -1) OSDrivenBehavior = "Windows";
else if (navigator.appVersion.indexOf("Mac") != -1) OSDrivenBehavior = "MacOS";
else if (navigator.appVersion.indexOf("X11") != -1) OSDrivenBehavior = "UNIX";
else if (navigator.appVersion.indexOf("Linux") != -1)
	OSDrivenBehavior = "Linux";

// $(".sPanelTest").html("Your OS: "+OSDrivenBehavior);

// KeyDrivenBehavior

let KeyDrivenBehavior;
function printOsAndKey() {
	// $(".sPanelTest").html("OS: " + OSDrivenBehavior + ", and key: " + KeyDrivenBehavior);
}
$(document)
	.keydown(function(event) {
		KeyDrivenBehavior = event.keyCode ? event.keyCode : event.which;
		printOsAndKey();
	})
	.keyup(function(event) {
		KeyDrivenBehavior = undefined;
		printOsAndKey();
	});
//$(document).keyup(function(event) {
//		KeyDrivenBehavior = undefined;
//	});

// --------------------
// EXPLORER
// --------------------

/*
AppExplorerData is the file system of the computer
t_ -> Type of object
	a_ file
	f_ folder
	...
	
n_ -> Name of the object

w_ -> Weight of the object in bytes

c_ -> Content of the object
	If is a folder it will contain another array []
	If is a file it will contain:
		t_ type of content (image, video, text, etc.)
		out_ the actual content
	
*/
var AppExplorerData = {
	recents: [
		{ t: "f", n: "Test folder", w: "0", c: [] },
		{
			t: "a",
			n: "testFile.txt",
			w: "200",
			d: "7/12/2019",
			c: [{ t: "text", out: "hello world!" }]
		}
	],
	downloads: [
		{
			t: "a",
			n: "test.jpg",
			w: "3802175",
			c: [{ t: "img", out: "https://bit.ly/36aJMdU" }]
		},
		{
			t: "a",
			n: "log.txt",
			w: "1026",
			c: [{ t: "text", out: "Hi this is a test :)" }]
		}
	],
	documents: [
		{ t: "a", n: "Technical_Writing_samples.pdf", w: "2965", c: [ {t: "text", out: "Hi this is a test :)" }] },
		{ t: "f", n: "Talks", w: "4647639", c: [] },
		{ t: "f", n: "Projects", w: "87465934", c: [] },
		{
			t: "a",
			n: "IMG_0405.jpg",
			w: "94568",
			c: [{ t: "img", out: "74637789.png" }]
		},
		{
			t: "a",
			n: "IMG_0406.jpg",
			w: "89456",
			c: [{ t: "img", out: "karuna.png" }]
		}
	],
	desktop: [],
	images: [],
	music: [],
	videos: [],
	apps: []
};

var AppFilesSidebarItem = $(".window--files .sidebar .item");
var AppFilesWindowVisualization = $(
	".window--files .window__handler .window__actions a.visualization i"
);
var AppFilesContainer = $(".window--files .window__main.filesys");
var AppFilesObject = $(
	".window--files .window__main.filesys .folder, .window--files .window__main.filesys .file"
);
var AppFilesObjectContent = $(
	".window--files.window--active .window__main.filesys .folder .content, .window--files .window__main.filesys .file .content"
);
var AppFilesObjectFile = $(".window--files .window__main.filesys .file");
var AppFilesObjectFolder = $(".window--files .window__main.filesys .folder");
var AppFilesObjectSelected = $(".filesys").find(
	".file.selected, .folder.selected"
);
var AppFilesCurrentItem = $(".window--files .sidebar .item.active").data(
	"item"
);

function AppFilesUpdateCurrentItem() {
	let AppFilesCurrentItem = "";
	AppFilesCurrentItem = $(".window--files .sidebar .item.active").data("item");
	AppFilesLoad(AppFilesCurrentItem);
}
// Tab between diferent sidebar objects
AppFilesSidebarItem.click(function() {
	if (!$(this).hasClass("active")) {
		AppFilesSidebarItem.removeClass("active");
		$(this).addClass("active");
		AppFilesCurrentItem = $(this).data("item");
		AppFilesLoad(AppFilesCurrentItem);
	}
});

// Show active tab/folder content

// Scripts for inspiration
// document.getElementById("demo").innerHTML = AppExplorerData[c][i].n;

//for (i = 0; i < fLen; i++) {
//  text += "<li>" + AppExplorerData[c][i].n + "</li>";
//}
//AppFilesContainer.html(content);

function AppFilesLoad(c) {
	let content = "",
		fileType,
		fileContent;
	if (AppExplorerData[c].length < 1) {
		content += '<div class="empty"></div>';
	} else {
		for (i = 0; i < AppExplorerData[c].length; i++) {
			if (AppExplorerData[c][i].t == "a") {
				fileType = AppExplorerData[c][i]["c"][0].t;
				if (fileType == "img") {
					fileContent =
						'style="background-image:url(' + AppExplorerData[c][i].c[0].out + ');"';
				} else {
					fileContent = "";
				}
				content +=
					'<div class="file" data-tag="" data-name="' +
					AppExplorerData[c][i].n +
					'" data-type="' +
					fileType +
					'" data-date="' +
					AppExplorerData[c][i].d +
					'" data-bytes="' +
					AppExplorerData[c][i].w +
					'"><div class="content" ' +
					fileContent +
					"></div></div>";
			} else {
				content +=
					'<div class="folder" data-tag="" data-name="' +
					AppExplorerData[c][i].n +
					'" data-type="f" data-date="' +
					AppExplorerData[c][i].d +
					'" data-bytes="' +
					AppExplorerData[c][i].w +
					'"><div class="content"></div></div>';
			}
			//content += AppExplorerData[c][i].n;
			//<div class="folder" data-tag="" data-name="'+AppExplorerData[c][i].n+'" data-type="f" data-date="'+AppExplorerData[c][i].d+'" data-bytes="'+AppExplorerData[c][i].w+'"><div class="content"></div></div>
		}
	}
	AppFilesContainer.html(content);
	AppFilesContainer.click();
}

// File window actions
AppFilesWindowVisualization.click(function() {
	if (!$(this).hasClass("selected")) {
		AppFilesWindowVisualization.removeClass("selected");
		$(this).addClass("selected");
		let format = $(this).data("format");
		$(".filesys").attr("data-visualization", format);
	}
});

// Select/Deselect file/folder
function AppFilesDeselect() {
	var AppFilesObject = "";
	AppFilesObject = $(
		".window--files .window__main.filesys .folder, .window--files .window__main.filesys .file"
	);
	AppFilesObject.removeClass("selected");
}
function AppFilesSelect(object) {
	// #anchor.OSDrivenBehavior (Ctrl on Windows || Cmd on MacOS)
	if (
		(OSDrivenBehavior === "MacOS" &&
			(KeyDrivenBehavior === 91 || KeyDrivenBehavior === 93)) ||
		(OSDrivenBehavior === "Windows" && KeyDrivenBehavior === 17)
	) {
		object.addClass("selected");
	} else {
		AppFilesDeselect();
		object.addClass("selected");
	}
}
function AppFilesSelectObject(op, object) {
	if (op == "next") {
		object.next().addClass("objectSeeked");
	}
	if (op == "prev") {
		object.prev().addClass("objectSeeked");
	}
	if (op == "first") {
		AppFilesObject.first().addClass("objectSeeked");
	}
	if (op == "last") {
		AppFilesObject.last().addClass("objectSeeked");
	}
	let objectSeeked = $(
		".filesys .file.objectSeeked, .filesys .folder.objectSeeked"
	);
	if (objectSeeked.length > 0) {
		AppFilesDeselect();
	}
	AppFilesSelect(objectSeeked);
	objectSeeked.removeClass("objectSeeked");
}
AppFilesContainer.click(function(event) {
	AppFilesObject = "";
	AppFilesObject = $(
		".window--files .window__main.filesys .folder, .window--files .window__main.filesys .file"
	);
	let target = $(event.target);
	if (target.is(AppFilesObject)) {
		AppFilesSelect(target);
	} else {
		AppFilesDeselect();
	}
});
// Arrow navigagion & Space QuickView
$(document).keydown(function(e) {
	let object, objectContent, finderFocus;
	object = $(".filesys").find(".file.selected, .folder.selected");
	objectContent = $(".filesys").find(".file.selected .content");
	finderFocus = $(".window--finder").hasClass("window--active");
	if (e.keyCode === 39 && finderFocus) {
		// 39 == RIGHT ARROW
		if (object.next().length > 0) {
			AppFilesSelectObject("next", object);
		} else {
			// ONLY IF SELECTION LOOP IS ENABLED
			AppFilesSelectObject("first");
		}
	} else if (e.keyCode === 37 && finderFocus) {
		// 37 == LEFT ARROW
		if (object.prev().length > 0) {
			AppFilesSelectObject("prev", object);
		} else {
			// ONLY IF SELECTION LOOP IS ENABLED
			AppFilesSelectObject("last");
		}
	}
});

/* CONSOLE */

// Define system level

var syslvl = 0,
	syslvlNames = ["Root", "Admin", "User", "Guest"];

// Focus
$(".console-prompt-box").click(function() {
	$(".console-input").focus();
});

// Output to Console
function output(print) {
	var cmd = $(".console-input").val();
	if (cmd == "") {
		cmd = "<div class='err'>null</div>";
	}
	$("#outputs").append("<span class='output-cmd'>" + cmd + "</span>");

	$.each(print, function(index, value) {
		cmd = " >";
		if (value == "") {
			value = "&nbsp;";
			cmd = "&nbsp;";
		}
		$("#outputs").append("<span class='output-text'>" + value + "</span>");
	});

	$(".console-input").val("");
	$(".console-input").focus();
}

function sysIn(e) {
	return e ? ($(".console-input").val().split(" ").shift()) : ($(".console-input").val().split(" ").slice(1,$(".console-input").val().split(" ").length));
}

// Break Value
var newLine = "<br/> &nbsp;";

// User Commands

var helpInfo = [
	"clear",
	"help",
	"hist [-clear]",
	"syslvl [VALUE (0..3)]",
	"reload",
	"edit [-tab] [-debug]"
];

// "": function() {}
var cmds = {
	
	reload: function() {
		window.location.replace(location.href);
		output(["Reloading scripts ..."]);
	},

	edit: function(args) {
		var tab = (sysIn().indexOf("-tab") !== -1), debug = (sysIn().indexOf("-debug") !== -1);
		output(["Opening " + (debug ? "debug view " : "script ") + (tab ? "on a new tab" : "") + "..."]);
		window.open(debug ? "" : "", tab ? "_blank" : "_self");
	},
	
	test: function() {
		var str = "arguments given [" + sysIn() + "] and relevant are ";
		if (sysIn().indexOf("-ej") !== -1) {
			str += ", -ej";
		}
		if (sysIn().indexOf("-lol") !== -1) {
			str += ", -lol";
		}
		output([str]);
	},

	syslvl: function(a) {
		if (!(a == "")) {
			if (a > 3) {
				output(["<div class='err'>System Level Undefined</div>"]);
			} else {
				syslvl = a;
				output([syslvl + " - " + syslvlNames[syslvl]]);
			}
		} else {
			output([syslvl + " - " + syslvlNames[syslvl]]);
		}
	},

	clear: function() {
		output([""]);
		$("#outputs").html("");
	},

	hello: function() {
		output(["Hello there!"]);
	},

	hist: function(a) {
		if (a == "-clear") {
			prevCmd = [];
			output(["History successfully cleared"]);
		} else {
			output([prevCmd]);
		}
	},

	help: function(a) {
		if (a == "") {
			var print = ["Type 'help name' to find out more about the function 'name'.","Type 'help' to see this list."];
			print = $.merge(print, Object.values(helpInfo));
			output(print);
		} else {
			if (Object.keys(cmds).indexOf(sysIn().shift()) !== -1) {
				output(["'"+sysIn().shift()+"' is a command"]);
			} else {
				output(["<div class='err'>'"+sysIn().shift()+"' is not a command</div>"]);
			}
		}
	}
};

var prevCmd = [], prevCmdPointer = -1;

// Get User Command
$(".console-input").keydown(function(event) {
	
	function prevCmdAdd() {
		prevCmd.unshift($(".console-input").val());
	}

	if (
		(event.key === "Enter" || event.code == "Enter") &&
		!(
			$(this)
				.val()
				.replace(/ /g, "").length == 0
		)
	) {
		var str = $(this).val();
		var data = str.split(" ");
		data.shift();
		data = data.join(" ");
		var cmd = str.split(" ")[0];
		
		// Adds actual command to previous command list
		prevCmdAdd();
		
		if (typeof cmds[cmd] == "function") {
			if (cmds[cmd].length > 0) {
				cmds[cmd](data);
			} else {
				cmds[cmd]();
			}
		} else {
			output(["<div class='err'>Command not found: '" + cmd + "'</div>","Type 'help' for list of commands"]);
		}
		
		prevCmdPointer = -1;
		//$(this).val("");
		
	}
	else if (event.key === "ArrowUp" || event.code == "ArrowUp" || event.keyCode === 38) {
		event.preventDefault();
		if (prevCmdPointer < prevCmd.length) {
			prevCmdPointer++;
			$(".console-input").val(prevCmd[prevCmdPointer]);
		}
	}
	else if (event.key === "ArrowDown" || event.code == "ArrowDown" || event.keyCode === 40) {
		event.preventDefault();
		if (prevCmdPointer >= 0) {
			prevCmdPointer--;
			$(".console-input").val(prevCmd[prevCmdPointer]);
		}
	}
});

/* CLOCK & DATE*/

var clockVar = {};
renderTime();
function renderTime() {
	currentTime = new Date();
	clockVar.y = currentTime.getFullYear();
	clockVar.mth = currentTime.getMonth();
	clockVar.dt = currentTime.getDate();
	clockVar.d = currentTime.getDay();
	clockVar.h = currentTime.getHours();
	clockVar.m = currentTime.getMinutes();
	clockVar.s = currentTime.getSeconds();
	setTimeout("renderTime()", 100); //1000
	if (clockVar.h < 10) {
		clockVar.h = "0" + clockVar.h;
	}
	if (clockVar.m < 10) {
		clockVar.m = "0" + clockVar.m;
	}
	if (clockVar.s < 10) {
		clockVar.s = "0" + clockVar.s;
	}
	var months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];
	var monthsMin = [
		"jan",
		"feb",
		"mar",
		"apr",
		"may",
		"jun",
		"jul",
		"aug",
		"sep",
		"oct",
		"nov",
		"dec"
	];
	var days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday"
	];
	var daysMin = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	//let sTimeShowDate = $('.sTimeShowDate').hasClass('checked'), sTimeShowSeconds = $('.sTimeShowSeconds').hasClass('checked');
	let sTimeShowDate = $(".sTimeShowDate").is(":checked"),
		sTimeShowSeconds = $(".sTimeShowSeconds").is(":checked"),
		sDynamicWallpaper = $(".sDynamicWallpaper").is(":checked");

	var time = clockVar.h + ":" + clockVar.m;
	if (sTimeShowDate) {
		time =
			daysMin[clockVar.d] +
			" " +
			clockVar.dt +
			" " +
			monthsMin[clockVar.mth] +
			" " +
			time;
	}
	if (sTimeShowSeconds) {
		time = time + ":" + clockVar.s;
	}
	if (sDynamicWallpaper) {
		if (clockVar.h < 7 || clockVar.h > 18) {
			$("body").addClass("night");
		} else {
			$("body").removeClass("night");
		}
	}
	if (!sDynamicWallpaper) {
		$("body").addClass("night");
	}
	//$('.fullTime').html(clockVar.h + ":" + clockVar.m + ":" + clockVar.s);
	//$('.date').html(daysMin[clockVar.d] + " " + clockVar.dt + ", " + months[clockVar.mth] + " of " + clockVar.y);
	//$('.time').html(clockVar.h + ":" + clockVar.m);

	// Ordinal numbers function
	function nth(n) {
		return ["st", "nd", "rd"][((((n + 90) % 100) - 10) % 10) - 1] || "th";
	}
	// Clocks
	$(".time").html(time);
	$(".sActionbarTime").html(time);
	$(".currentTime").html(clockVar.h + ":" + clockVar.m + ":" + clockVar.s);
	$(".day").html(daysMin[clockVar.d]);
	$(".dayNumber").html(clockVar.dt);
	$(".month").html(months[clockVar.mth]);
	$(".year").html(clockVar.y);
	$(".sPanelNotifications .date .today").html(
		days[clockVar.d] +
			",<br>" +
			months[clockVar.mth] +
			" " +
			clockVar.dt +
			"<div class='ordinal'>" +
			nth(clockVar.dt) +
			"</div>"
	);
	$('[data-sGet="fullDate"]').html(
		days[clockVar.d] +
			", " +
			months[clockVar.mth] +
			" " +
			clockVar.dt +
			", " +
			clockVar.y
	);
}
$(document).ready(function() {
	$(".calendar").datepicker({
		inline: true,
		firstDay: 1,
		showOtherMonths: true,
		dayNamesMin: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
	});
});


const Terminal = ({ theme, setTheme }) => {
	const [maximized, setMaximized] = React.useState(false);
	const [title, setTitle] = React.useState('React Terminal');
	const handleClose = () => window.location.href = 'https://codepen.io/HuntingHawk';
	const handleMinMax = () => {
	  setMaximized(!maximized);
	  document.querySelector('#field').focus();
	};
  
	return /*#__PURE__*/React.createElement("div", { id: "terminal", style: maximized ? { height: '100vh', width: '100vw', maxWidth: '100vw' } : theme.terminal }, /*#__PURE__*/
	React.createElement("div", { id: "window", style: theme.window }, /*#__PURE__*/
	React.createElement("button", { className: "btn red", onClick: handleClose }), /*#__PURE__*/
	React.createElement("button", { id: "useless-btn", className: "btn yellow" }), /*#__PURE__*/
	React.createElement("button", { className: "btn green", onClick: handleMinMax }), /*#__PURE__*/
	React.createElement("span", { id: "title", style: { color: theme.window.color } }, title)), /*#__PURE__*/
  
	React.createElement(Field, { theme: theme, setTheme: setTheme, setTitle: setTitle }));
  
  };
  class Field extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = {
		commandHistory: [],
		commandHistoryIndex: 0,
		fieldHistory: [{ text: 'React Terminal' }, { text: 'Type HELP to see the full list of commands.', hasBuffer: true }],
		userInput: '',
		isMobile: false };
  
	  this.recognizedCommands = [{
		command: 'help',
		purpose: 'Provides help information for React Terminal commands.' },
	  {
		command: 'date',
		purpose: 'Displays the current date.' },
	  {
		command: 'start',
		purpose: 'Launches a specified URL in a new tab or separate window.',
		help: [
		'START <URL>',
		'Launches a specified URL in a new tab or separate window.',
		'',
		'URL......................The website you want to open.'] },
  
	  {
		command: 'cls',
		purpose: 'Clears the screen.' },
	  {
		command: 'cmd',
		purpose: 'Starts a new instance of the React Terminal.' },
	  {
		command: 'theme',
		purpose: 'Sets the color scheme of the React Terminal.',
		help: [
		'THEME <L|LIGHT|D|DARK> [-s, -save]',
		'Sets the color scheme of the React Terminal.',
		'',
		'L, LIGHT.................Sets the color scheme to light mode.',
		'D, DARK..................Sets the color scheme to dark mode.',
		'',
		'-s, -save................Saves the setting to localStorage.'] },
  
	  {
		command: 'exit',
		purpose: 'Quits the React Terminal and returns to Jacob\'s portfolio page.' },
	  {
		command: 'time',
		purpose: 'Displays the current time.' },
	  {
		command: 'about',
		isMain: true,
		purpose: 'Displays basic information about Jacob.' },
	  {
		command: 'experience',
		isMain: true,
		purpose: 'Displays information about Jacob\'s experience.' },
	  {
		command: 'skills',
		isMain: true,
		purpose: 'Displays information about Jacob\'s skills as a developer.' },
	  {
		command: 'contact',
		isMain: true,
		purpose: 'Displays contact information for Jacob.' },
	  {
		command: 'projects',
		isMain: true,
		purpose: 'Displays information about what projects Jacob has done in the past.' },
	  {
		command: 'project',
		isMain: true,
		purpose: 'Launches a specified project in a new tab or separate window.',
		help: [
		'PROJECT <TITLE>',
		'Launches a specified project in a new tab or separate window.',
		'List of projects currently include:',
		'Minesweeper',
		'PuniUrl',
		'Taggen',
		'Forum',
		'Simon',
		'',
		'TITLE....................The title of the project you want to view.'] },
  
	  {
		command: 'title',
		purpose: 'Sets the window title for the React Terminal.',
		help: [
		'TITLE <INPUT>',
		'Sets the window title for the React Terminal.',
		'',
		'INPUT....................The title you want to use for the React Terminal window.'] },
  
	  ...['google', 'duckduckgo', 'bing'].map(cmd => {
		const properCase = cmd === 'google' ? 'Google' : cmd === 'duckduckgo' ? 'DuckDuckGo' : 'Bing';
  
		return {
		  command: cmd,
		  purpose: `Searches a given query using ${properCase}.`,
		  help: [
		  `${cmd.toUpperCase()} <QUERY>`,
		  `Searches a given query using ${properCase}. If no query is provided, simply launches ${properCase}.`,
		  '',
		  `QUERY....................It\'s the same as if you were to type inside the ${properCase} search bar.`] };
  
  
	  })];
	  this.handleTyping = this.handleTyping.bind(this);
	  this.handleInputEvaluation = this.handleInputEvaluation.bind(this);
	  this.handleInputExecution = this.handleInputExecution.bind(this);
	  this.handleContextMenuPaste = this.handleContextMenuPaste.bind(this);
	}
	componentDidMount() {
	  if (typeof window.orientation !== "undefined" || navigator.userAgent.indexOf('IEMobile') !== -1) {
		this.setState(state => ({
		  isMobile: true,
		  fieldHistory: [...state.fieldHistory, { isCommand: true }, {
			text: `Unfortunately due to this application being an 'input-less' environment, mobile is not supported. I'm working on figuring out how to get around this, so please bear with me! In the meantime, come on back if you're ever on a desktop.`,
			isError: true,
			hasBuffer: true }] }));
  
  
	  } else {
		const userElem = document.querySelector('#field');
		const themePref = window.localStorage.getItem('reactTerminalThemePref');
  
		// Disable this if you're working on a fork with auto run enabled... trust me.
		userElem.focus();
  
		document.querySelector('#useless-btn').addEventListener('click', () => this.setState(state => ({
		  fieldHistory: [...state.fieldHistory, { isCommand: true }, { text: 'SYS >> That button doesn\'t do anything.', hasBuffer: true }] })));
  
  
		if (themePref) {
		  this.props.setTheme(themePref);
		}
	  }
	}
	componentDidUpdate() {
	  const userElem = document.querySelector('#field');
  
	  userElem.scrollTop = userElem.scrollHeight;
	}
	handleTyping(e) {
	  e.preventDefault();
  
	  const { key, ctrlKey, altKey } = e;
	  const forbidden = [
	  ...Array.from({ length: 12 }, (x, y) => `F${y + 1}`),
	  'ContextMenu', 'Meta', 'NumLock', 'Shift', 'Control', 'Alt',
	  'CapsLock', 'Tab', 'ScrollLock', 'Pause', 'Insert', 'Home',
	  'PageUp', 'Delete', 'End', 'PageDown'];
  
  
	  if (!forbidden.some(s => s === key) && !ctrlKey && !altKey) {
		if (key === 'Backspace') {
		  this.setState(state => state.userInput = state.userInput.slice(0, -1));
		} else if (key === 'Escape') {
		  this.setState({ userInput: '' });
		} else if (key === 'ArrowUp' || key === 'ArrowLeft') {
		  const { commandHistory, commandHistoryIndex } = this.state;
		  const upperLimit = commandHistoryIndex >= commandHistory.length;
  
		  if (!upperLimit) {
			this.setState(state => ({
			  commandHistoryIndex: state.commandHistoryIndex += 1,
			  userInput: state.commandHistory[state.commandHistoryIndex - 1] }));
  
		  }
		} else if (key === 'ArrowDown' || key === 'ArrowRight') {
		  const { commandHistory, commandHistoryIndex } = this.state;
		  const lowerLimit = commandHistoryIndex === 0;
  
		  if (!lowerLimit) {
			this.setState(state => ({
			  commandHistoryIndex: state.commandHistoryIndex -= 1,
			  userInput: state.commandHistory[state.commandHistoryIndex - 1] || '' }));
  
		  }
		} else if (key === 'Enter') {
		  const { userInput } = this.state;
  
		  if (userInput.length) {
			this.setState(state => ({
			  commandHistory: userInput === '' ? state.commandHistory : [userInput, ...state.commandHistory],
			  commandHistoryIndex: 0,
			  fieldHistory: [...state.fieldHistory, { text: userInput, isCommand: true }],
			  userInput: '' }),
			() => this.handleInputEvaluation(userInput));
		  } else {
			this.setState(state => ({
			  fieldHistory: [...state.fieldHistory, { isCommand: true }] }));
  
		  }
		} else {
		  this.setState(state => ({
			commandHistoryIndex: 0,
			userInput: state.userInput += key }));
  
		}
	  }
	}
	handleInputEvaluation(input) {
	  try {
		const evaluatedForArithmetic = math.evaluate(input);
  
		if (!isNaN(evaluatedForArithmetic)) {
		  return this.setState(state => ({ fieldHistory: [...state.fieldHistory, { text: evaluatedForArithmetic }] }));
		}
  
		throw Error;
	  } catch (err) {
		const { recognizedCommands, giveError, handleInputExecution } = this;
		const cleanedInput = input.toLowerCase().trim();
		const dividedInput = cleanedInput.split(' ');
		const parsedCmd = dividedInput[0];
		const parsedParams = dividedInput.slice(1).filter(s => s[0] !== '-');
		const parsedFlags = dividedInput.slice(1).filter(s => s[0] === '-');
		const isError = !recognizedCommands.some(s => s.command === parsedCmd);
  
		if (isError) {
		  return this.setState(state => ({ fieldHistory: [...state.fieldHistory, giveError('nr', input)] }));
		}
  
		return handleInputExecution(parsedCmd, parsedParams, parsedFlags);
	  }
	}
	handleInputExecution(cmd, params = [], flags = []) {
	  if (cmd === 'help') {
		if (params.length) {
		  if (params.length > 1) {
			return this.setState(state => ({
			  fieldHistory: [...state.fieldHistory, this.giveError('bp', { cmd: 'HELP', noAccepted: 1 })] }));
  
		  }
  
		  const cmdsWithHelp = this.recognizedCommands.filter(s => s.help);
  
		  if (cmdsWithHelp.filter(s => s.command === params[0]).length) {
			return this.setState(state => ({
			  fieldHistory: [...state.fieldHistory, {
				text: cmdsWithHelp.filter(s => s.command === params[0])[0].help,
				hasBuffer: true }] }));
  
  
		  } else if (this.recognizedCommands.filter(s => s.command === params[0]).length) {
			return this.setState(state => ({
			  fieldHistory: [...state.fieldHistory, {
				text: [
				`No additional help needed for ${this.recognizedCommands.filter(s => s.command === params[0])[0].command.toUpperCase()}`,
				this.recognizedCommands.filter(s => s.command === params[0])[0].purpose],
  
				hasBuffer: true }] }));
  
  
		  }
  
		  return this.setState(state => ({
			fieldHistory: [...state.fieldHistory, this.giveError('up', params[0].toUpperCase())] }));
  
		}
  
		return this.setState(state => ({
		  fieldHistory: [...state.fieldHistory, {
			text: [
			'Main commands:',
			...this.recognizedCommands.
			sort((a, b) => a.command.localeCompare(b.command)).
			filter(({ isMain }) => isMain).
			map(({ command, purpose }) => `${command.toUpperCase()}${Array.from({ length: 15 - command.length }, x => '.').join('')}${purpose}`),
			'',
			'All commands:',
			...this.recognizedCommands.
			sort((a, b) => a.command.localeCompare(b.command)).
			map(({ command, purpose }) => `${command.toUpperCase()}${Array.from({ length: 15 - command.length }, x => '.').join('')}${purpose}`),
			'',
			'For help about a specific command, type HELP <CMD>, e.g. HELP PROJECT.'],
  
			hasBuffer: true }] }));
  
  
	  } else if (cmd === 'cls') {
		return this.setState({ fieldHistory: [] });
	  } else if (cmd === 'start') {
		if (params.length === 1) {
		  return this.setState(state => ({
			fieldHistory: [...state.fieldHistory, { text: `Launching ${params[0]}...`, hasBuffer: true }] }),
		  () => window.open(/http/i.test(params[0]) ? params[0] : `https://${params[0]}`));
		}
  
		return this.setState(state => ({
		  fieldHistory: [...state.fieldHistory, this.giveError('bp', { cmd: 'START', noAccepted: 1 })] }));
  
	  } else if (cmd === 'date') {
		return this.setState(state => ({
		  fieldHistory: [...state.fieldHistory, { text: `The current date is: ${new Date(Date.now()).toLocaleDateString()}`, hasBuffer: true }] }));
  
	  } else if (cmd === 'cmd') {
		return this.setState(state => ({
		  fieldHistory: [...state.fieldHistory, { text: 'Launching new instance of the React Terminal...', hasBuffer: true }] }),
		() => window.open('https://codepen.io/HuntingHawk/full/rNaEZxW'));
	  } else if (cmd === 'theme') {
		const { setTheme } = this.props;
		const validParams = params.length === 1 && ['d', 'dark', 'l', 'light'].some(s => s === params[0]);
		const validFlags = flags.length ? flags.length === 1 && (flags[0] === '-s' || flags[0] === '-save') ? true : false : true;
  
		if (validParams && validFlags) {
		  const themeToSet = params[0] === 'd' || params[0] === 'dark' ? 'dark' : 'light';
  
		  return this.setState(state => ({
			fieldHistory: [...state.fieldHistory, { text: `Set the theme to ${themeToSet.toUpperCase()} mode`, hasBuffer: true }] }),
		  () => {
			if (flags.length === 1 && (flags[0] === '-s' || flags[0] === '-save')) {
			  window.localStorage.setItem('reactTerminalThemePref', themeToSet);
			}
  
			setTheme(themeToSet);
		  });
		}
  
		return this.setState(state => ({
		  fieldHistory: [...state.fieldHistory, this.giveError(!validParams ? 'bp' : 'bf', !validParams ? { cmd: 'THEME', noAccepted: 1 } : 'THEME')] }));
  
	  } else if (cmd === 'exit') {
		return window.location.href = 'https://codepen.io/HuntingHawk';
	  } else if (cmd === 'time') {
		return this.setState(state => ({
		  fieldHistory: [...state.fieldHistory, { text: `The current time is: ${new Date(Date.now()).toLocaleTimeString()}`, hasBuffer: true }] }));
  
	  } else if (cmd === 'about') {
		return this.setState(state => ({
		  fieldHistory: [...state.fieldHistory, { text: [
			'Hey there!',
			`My name is Jacob. I'm a software developer based around Washington, DC, specializing in the JavaScript ecosystem. I love programming and developing interesting things for both regular folks and developers alike!`,
			`Type CONTACT if you'd like to get in touch - otherwise I hope you enjoy using the rest of the app!`],
			hasBuffer: true }] }));
  
	  } else if (cmd === 'experience') {
		return this.setState(state => ({
		  fieldHistory: [...state.fieldHistory, { text: [
			'Certificates:',
			'ReactJS...............................Udacity',
			'Front-end Development.................freeCodeCamp',
			'JS Algorithms and Data Structures.....freeCodeCamp',
			'Front-end Libraries...................freeCodeCamp',
			'Responsive Web Design.................freeCodeCamp',
			'',
			'Work:',
			'Shugoll Research',
			'Database Technician',
			'June 2015 - Present'],
			hasBuffer: true }] }));
  
	  } else if (cmd === 'skills') {
		return this.setState(state => ({
		  fieldHistory: [...state.fieldHistory, { text: [
			'Languages:',
			'HTML',
			'CSS',
			'JavaScript',
			'',
			'Libraries/Frameworks:',
			'Node',
			'Express',
			'React',
			'Next',
			'React Native',
			'Redux',
			'jQuery',
			'',
			'Other:',
			'Git',
			'GitHub',
			'Heroku',
			'CodePen',
			'CodeSandBox',
			'Firebase',
			'NeDB'],
			hasBuffer: true }] }));
  
	  } else if (cmd === 'contact') {
		return this.setState(state => ({
		  fieldHistory: [...state.fieldHistory, { text: [
			'Email: contact@jacoblockett.com',
			'Website: jacoblockett.com',
			'LinkedIn: @jacoblockett',
			'GitHub: @jacoblockett',
			'CodePen: @HuntingHawk'],
			hasBuffer: true }] }));
  
	  } else if (cmd === 'projects') {
		return this.setState(state => ({
		  fieldHistory: [...state.fieldHistory, { text: [
			'To view any of these projects live or their source files, type PROJECT <TITLE>, e.g. PROJECT Minesweeper.',
			'',
			'Minesweeper',
			'Built with React',
			`Some time ago I became increasingly addicted to minesweeper, specifically the version offered by Google. In fact, I was so addicted that I decided to build the damn thing.`,
			'',
			'PuniUrl',
			'Built with Express, Firebase',
			'Ever heard of TinyUrl? Ever been to their website? Atrocious. So I made my own version of it.',
			'',
			'Taggen',
			'Built with Node',
			`I was building an MS Excel spreadsheet parser (haven't finished it, imagine my stove has 10 rows of backburners) and needed a way to generate non-opinionated XML files. There were projects out there that came close, but I decided it would be fun to build it on my own.`,
			'',
			'Forum',
			'Built with React, Redux, Bootstrap',
			`This was a project I had to build for my final while taking Udacity's React Nanodegree certification course. It's an app that tracks posts and comments, likes, etc. Nothing too complicated, except for Redux... God I hate Redux.`,
			'',
			'Simon',
			'Built with vanilla ice cream',
			'The classic Simon memory game. I originally built this for the freeCodeCamp legacy certification, but later came back to it because I hated how bad I was with JavaScript at the time. I also wanted to see how well I could build it during a speed-coding session. Just over an hour.'],
			hasBuffer: true }] }));
  
	  } else if (cmd === 'project') {
		if (params.length === 1) {
		  const projects = [{
			title: 'minesweeper',
			live: 'https://codepen.io/HuntingHawk/full/GRgLWKV' },
		  {
			title: 'puniurl',
			live: 'http://www.puniurl.com/' },
		  {
			title: 'taggen',
			live: 'https://github.com/huntinghawk1415/Taggen' },
		  {
			title: 'forum',
			live: 'https://github.com/huntinghawk1415/ReactND-Readable' },
		  {
			title: 'simon',
			live: 'https://codepen.io/HuntingHawk/full/mNPVgj' }];
  
  
		  return this.setState(state => ({
			fieldHistory: [...state.fieldHistory, { text: `Launching ${params[0]}...`, hasBuffer: true }] }),
		  () => window.open(projects.filter(s => s.title === params[0])[0].live));
		}
  
		return this.setState(state => ({
		  fieldHistory: [...state.fieldHistory, this.giveError('bp', { cmd: 'PROJECT', noAccepted: 1 })] }));
  
	  } else if (cmd === 'title') {
		return this.setState(state => ({
		  fieldHistory: [...state.fieldHistory, {
			text: `Set the React Terminal title to ${params.length > 0 ? params.join(' ') : '<BLANK>'}`,
			hasBuffer: true }] }),
  
		() => this.props.setTitle(params.length > 0 ? params.join(' ') : ''));
	  } else if (['google', 'duckduckgo', 'bing'].some(s => s === cmd)) {
		return this.setState(state => ({
		  fieldHistory: [...state.fieldHistory, {
			text: params.length ? `Searching ${cmd.toUpperCase()} for ${params.join(' ')}...` : `Launching ${cmd.toUpperCase()}...`,
			hasBuffer: true }] }),
  
		() => window.open(params.length ? `https://www.${cmd}.com/${cmd === 'google' ? 'search' : ''}?q=${params.join('+')}` : `https://${cmd}.com/`, '_blank'));
	  }
	}
	handleContextMenuPaste(e) {
	  e.preventDefault();
  
	  if ('clipboard' in navigator) {
		navigator.clipboard.readText().then(clipboard => this.setState(state => ({
		  userInput: `${state.userInput}${clipboard}` })));
  
	  }
	}
	giveError(type, extra) {
	  const err = { text: '', isError: true, hasBuffer: true };
  
	  if (type === 'nr') {
		err.text = `${extra} : The term or expression '${extra}' is not recognized. Check the spelling and try again. If you don't know what commands are recognized, type HELP.`;
	  } else if (type === 'nf') {
		err.text = `The ${extra} command requires the use of flags. If you don't know what flags can be used, type HELP ${extra}.`;
	  } else if (type === 'bf') {
		err.text = `The flags you provided for ${extra} are not valid. If you don't know what flags can be used, type HELP ${extra}.`;
	  } else if (type === 'bp') {
		err.text = `The ${extra.cmd} command requires ${extra.noAccepted} parameter(s). If you don't know what parameter(s) to use, type HELP ${extra.cmd}.`;
	  } else if (type === 'up') {
		err.text = `The command ${extra} is not supported by the HELP utility.`;
	  }
  
	  return err;
	}
	render() {
	  const { theme } = this.props;
	  const { fieldHistory, userInput } = this.state;
  
	  return /*#__PURE__*/React.createElement("div", {
		id: "field",
		className: theme.app.backgroundColor === '#333444' ? 'dark' : 'light',
		style: theme.field,
		onKeyDown: e => this.handleTyping(e),
		tabIndex: 0,
		onContextMenu: e => this.handleContextMenuPaste(e) },
  
	  fieldHistory.map(({ text, isCommand, isError, hasBuffer }) => {
		if (Array.isArray(text)) {
		  return /*#__PURE__*/React.createElement(MultiText, { input: text, isError: isError, hasBuffer: hasBuffer });
		}
  
		return /*#__PURE__*/React.createElement(Text, { input: text, isCommand: isCommand, isError: isError, hasBuffer: hasBuffer });
	  }), /*#__PURE__*/
	  React.createElement(UserText, { input: userInput, theme: theme.cursor }));
  
	}}
  
  const Text = ({ input, isCommand, isError, hasBuffer }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/
  React.createElement("div", null,
  isCommand && /*#__PURE__*/React.createElement("div", { id: "query" }, "RT C:\\Users\\Guest>"), /*#__PURE__*/
  React.createElement("span", { className: !isCommand && isError ? 'error' : '' }, input)),
  
  hasBuffer && /*#__PURE__*/React.createElement("div", null));
  
  const MultiText = ({ input, isError, hasBuffer }) => /*#__PURE__*/React.createElement(React.Fragment, null,
  input.map(s => /*#__PURE__*/React.createElement(Text, { input: s, isError: isError })),
  hasBuffer && /*#__PURE__*/React.createElement("div", null));
  
  const UserText = ({ input, theme }) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/
  React.createElement("div", { id: "query" }, "RT C:\\Users\\Guest>"), /*#__PURE__*/
  React.createElement("span", null, input), /*#__PURE__*/
  React.createElement("div", { id: "cursor", style: theme }));
  
  
  ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.querySelector('#root'));