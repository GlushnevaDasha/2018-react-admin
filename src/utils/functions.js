import React from "react";
import { getVisibleSelectionRect } from "draft-js";
import {
  Instagram,
  Twiter,
  Youtube,
  Twitch,
  Google,
  VK,
  Facebook,
  Apple
} from "../content/Icons";
var moment = require("moment");

export function isEmpty(obj) {
  for (let key in obj) {
    return false;
  }
  return true;
}

export function getData(data, isSec = false) {
  require("moment/min/locales.min");
  moment.locale("ru");
  if (!data) {
    return moment().format("D MMMM");
  }
  let now = moment();
  let duration = isSec
    ? moment.duration(now.diff(moment(data * 1000)))
    : moment.duration(now.diff(moment(data)));
  let days = duration.asDays();
  if (days < 7) {
    return moment(isSec ? data * 1000 : data).fromNow();
  } else {
    if (days < 365) {
      return moment(isSec ? data * 1000 : data).format("D MMMM");
    } else {
      return moment(isSec ? data * 1000 : data).format("D MMMM YYYY");
    }
  }
}

export function isTimePassed(data) {
  let now = moment();
  let duration = moment.duration(now.diff(moment(data * 1000)));
  return duration.asMilliseconds() >= 0 ? true : false;
}

export function getDataTime(data) {
  require("moment/min/locales.min");
  moment.locale("ru");
  return moment(data * 1000).format("HH:mm:ss DD.MM.YYYY");
}

export function getDataBan(data) {
  require("moment/min/locales.min");
  moment.locale("ru");
  return moment(data).format("DD.MM.YYYY");
}

export function convertToDay(data) {
  require("moment/min/locales.min");
  moment.locale("ru");
  return moment(data * 1000).format("YYYY-MM-DD");
}

export function convertToTime(data) {
  require("moment/min/locales.min");
  moment.locale("ru");
  return moment(data * 1000).format("HH:mm");
}

export function dataString(data, time = false) {
  require("moment/min/locales.min");
  moment.locale("ru");
  return time
    ? moment(data * 1000).format("D MMMM в HH:mm")
    : moment(data * 1000).format("D MMMM");
}

export const getRole = role => {
  switch (role) {
    case "ADMIN":
      return "Администратор";
    case "PARTNER":
      return "Партнер";
    default:
      return "Укажите роль";
  }
};

export const getTheme = theme => {
  switch (theme) {
    case "DARK":
      return "Темный";
    case "LIGHT":
      return "Светлый";
    default:
      return "Темный";
  }
};

export const getStatus = (status, isDraft = false) => {
  switch (status) {
    case "DRAFT":
      return isDraft ? "Черновик" : "Ожидает публикации";
    case "PUBLISHED":
      return "Опубликованно";
    case "ARCHIVE":
      return "Архив";
    default:
      return "Ожидает публикации";
  }
};

export const getStatusCompetitions = (status, isDraft = false) => {
  switch (status) {
    case "DRAFT":
      return "Ожидает запуска";
    case "PUBLISHED":
      return "Опубликован";
    case "RESULTS_WAITING":
      return "Подведение итогов";
    case "FINISHED":
      return "Завершен";
    case "ARCHIVE":
      return "Архив";
    default:
      return "Ожидает публикации";
  }
};

export function isSubstring(text, substring) {
  const result =
    text != null && text.toUpperCase().indexOf(substring.toUpperCase()) >= 0
      ? true
      : false;
  return result;
}

export const getParameterFromUrl = param => {
  var url_string = window.location.href;
  var url = new URL(url_string);
  var vars = url.searchParams.get(param);
  return vars;
};

export const getActivePage = () => {
  var url_string = window.location.href;
  var url = new URL(url_string);
  var vars = url.searchParams.get("page");
  return vars;
};

export const getColorInt = color => {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  color = color.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  var red = parseInt(result[1], 16);
  var green = parseInt(result[2], 16);
  var blue = parseInt(result[3], 16);
  let rgbint = 256 * 256 * red + 256 * green + blue;
  return rgbint;
};

export const getColorHex = color => {
  let newColor = (color >>> 0).toString(16).slice(-6);
  if (newColor.length < 6) {
    newColor = "00" + newColor;
  }
  return "#" + newColor;
};

export const getIcon = type => {
  if (isSubstring(type, "Instagram")) {
    return <Instagram />;
  }
  if (isSubstring(type, "Twiter")) {
    return <Twiter />;
  }
  if (isSubstring(type, "Youtube")) {
    return <Youtube />;
  }
  if (isSubstring(type, "Twitch")) {
    return <Twitch />;
  }
  if (isSubstring(type, "Google")) {
    return <Google />;
  }
  if (isSubstring(type, "Facebook")) {
    return <Facebook />;
  }
  if (isSubstring(type, "VK")) {
    return <VK />;
  }
};

export const getIconAccaunt = type => {
  switch (type) {
    case "GOOGLE":
      return <Google />;
    case "TWITTER":
      return <Twiter />;
    case "VK":
      return <VK />;
    case "FACEBOOK":
      return <Facebook />;
    case "APPLE":
      return <Apple />;
    default:
      return null;
  }
};

export const getTwitchURL = url => {
  let result = url.replace("%{width}", "75");
  result = result.replace("%{height}", "45");
  return result;
};

export const getError = code => {
  switch (code) {
    case 401:
      return {
        header: "Ошибка авторизации",
        body:
          "Необходимо попробовать авторизоваться еще раз, заполнив поля логин и пароль заново. Проверьте правильность данных еще раз. Это и должно решить вашу проблему. Если ошибка никуда не исчезла, вам нужно написать администрации ресурса, на который вас не пускают."
      };
    case 500:
      return {
        header: "Внутренняя ошибка сервера",
        body: "Вам нужно написать администрации ресурса"
      };
    default:
      return {
        header: "Ресурс не найден",
        body: "Что-то пошло не так... Нет данных"
      };
  }
};

export function getSelectionCoords(editor, toolbar) {
  const editorBounds = editor.getBoundingClientRect();
  const win = editor.ownerDocument.defaultView || window;
  const rangeBounds = getVisibleSelectionRect(win);
  if (!rangeBounds || !toolbar) {
    return null;
  }
  const toolbarHeight = toolbar.offsetHeight;
  const toolbarWidth = toolbar.offsetWidth;

  const minOffsetLeft = 5;
  const minOffsetRight = 5;
  const minOffsetTop = 5;

  const rangeWidth = rangeBounds.right - rangeBounds.left;
  const arrowStyle = {};

  let offsetLeft = rangeBounds.left - editorBounds.left + rangeWidth / 2;
  arrowStyle.left = "50%";
  if (offsetLeft - toolbarWidth / 2 + editorBounds.left < minOffsetLeft) {
    offsetLeft = toolbarWidth / 2 - editorBounds.left + minOffsetLeft;
    arrowStyle.left =
      (rangeBounds.left + rangeBounds.right) / 2 - minOffsetLeft;
  }
  if (
    offsetLeft + toolbarWidth / 2 + editorBounds.left >
    win.innerWidth - minOffsetRight
  ) {
    arrowStyle.left =
      rangeBounds.left -
      (win.innerWidth - minOffsetRight - toolbarWidth) +
      (rangeBounds.right - rangeBounds.left) / 2;
    offsetLeft =
      win.innerWidth - editorBounds.left - toolbarWidth / 2 - minOffsetRight;
  }
  let offsetTop = rangeBounds.top - editorBounds.top - 14;
  arrowStyle.top = "100%";
  if (offsetTop - minOffsetTop - toolbarHeight + editorBounds.top < 0) {
    if (rangeBounds.bottom && !Number.isNaN(rangeBounds.bottom)) {
      offsetTop = rangeBounds.bottom - editorBounds.top + toolbarHeight + 14;
      arrowStyle.top = "-14px";
      arrowStyle.transform = "rotate(180deg)";
    }
  }

  return { offsetLeft, offsetTop, arrowStyle };
}
