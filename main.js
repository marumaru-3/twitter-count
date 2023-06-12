const defaultColor = document.querySelector(".default");
const darkColor = document.querySelector(".dark");
const colorMode = document.querySelector(".color-mode");
const textareaEl = document.querySelector("textarea");
const resetBtn = document.getElementById("reset");
const copyBtn = document.getElementById("copy");
const text = document.querySelector("#text");
// URL判定
const getUrlInText = () => {
  const matches = emoji2HTMLEntity(text.value).match(
    /((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g
  );

  const isValidUrl = (str) => {
    try {
      new URL(str);
      return true;
    } catch (err) {
      return false;
    }
  };

  const url = isValidUrl(matches);
  if (url) {
    return matches;
  }
};
// Twitter用(半角0.5文字・全角1文字)
const twitter = () => {
  let half = 0;
  let full = 0;
  let remaining = 140;
  let count = 0;

  let urlNone = emoji2HTMLEntity(text.value);
  if (getUrlInText()) {
    half += 11.5 * getUrlInText().length;

    getUrlInText().forEach((v) => {
      if (emoji2HTMLEntity(text.value).includes(v)) {
        urlNone = urlNone.replaceAll(v, "");
      }
    });
  }

  urlNone.split("").forEach((v, i) => {
    let char = urlNone.charCodeAt(i);
    if (char >= 0x0 && char <= 0x7f) {
      half += 0.5;
    } else {
      full += 1;
    }
  });

  // URL数
  const urlNum = getUrlInText() ? getUrlInText().length : 0;

  count += half + full;

  if (count >= 140) {
    document.querySelectorAll(".twitter_start").forEach((v) => {
      v.style.color = "#f4212e";
    });
    document.querySelector(".twitter_end").style.color = "#f4212e";
    document.querySelector(".border").style.borderColor = "#f4212e";
  } else if (count >= 130) {
    document.querySelectorAll(".twitter_start").forEach((v) => {
      v.style.color = "#fac002";
    });
    document.querySelector(".twitter_end").style.color = "#fac002";
    document.querySelector(".border").style.borderColor = "#fac002";
  } else {
    if (colorMode.classList.contains("dark")) {
      document.querySelectorAll(".twitter_start").forEach((v) => {
        v.style.color = "#fff";
      });
      document.querySelector(".dark .twitter_end").style.color = "#fff";
    } else {
      document.querySelectorAll(".twitter_start").forEach((v) => {
        v.style.color = "#000";
      });
      document.querySelector(".twitter_end").style.color = "#000";
    }
    document.querySelector(".border").style.borderColor = "#1d9bf0";
  }

  remaining -= half + full;

  document.querySelectorAll(".twitter_start").forEach((v) => {
    v.textContent = Math.floor(count);
  });
  document.querySelector(".twitter_end").textContent = Math.round(remaining);
  document.querySelector(".url").textContent = Math.floor(urlNum);
  document.querySelector(".half").textContent = Math.floor(half * 2);
  document.querySelector(".full").textContent = Math.floor(full);
};
// 行数
const row = () => {
  const row = emoji2HTMLEntity(text.value).match(/\r\n|\n/g);
  let rowLength = 1;

  if (row !== null) {
    rowLength = row.length + 1;
  }
  document.querySelector(".row").textContent = rowLength;
  return rowLength;
};
// テキストエリアの自動可変
const setTextareaHeight = () => {
  textareaEl.style.height = "auto";
  textareaEl.style.height = `${textareaEl.scrollHeight}px`;
};

document.addEventListener("input", () => {
  twitter();
  row();
  setTextareaHeight();
});
text.addEventListener("blur", () => {
  const row = emoji2HTMLEntity(text.value).match(/\r\n|\n/g);
  const countText = emoji2HTMLEntity(text.value).replace(/\r?\n/g, "").length;
  if (row === null && countText === 0) {
    document.querySelector(".row").textContent = 0;
  }
});

// リセットボタン
const reset = () => {
  if (!text.value == "") {
    text.value = "";
    document.querySelector(".row").textContent = 0;
    textareaEl.style.height = "auto";
  }
};
resetBtn.onclick = function () {
  reset();
  twitter();

  resetBtn.innerHTML = "リセットしました";
  setTimeout(() => (resetBtn.innerHTML = "リセットする"), 1000);
};

// コピーボタン
const copyToClipboard = (text) => {
  const pre = document.createElement("pre");

  pre.style.webkitUserSelect = "auto";
  pre.style.userSelect = "auto";
  pre.textContent = text;

  document.body.appendChild(pre);
  document.getSelection().selectAllChildren(pre);
  const result = document.execCommand("copy");

  document.body.removeChild(pre);

  return result;
};
copyBtn.addEventListener("click", () => {
  copyToClipboard(text.value);

  copyBtn.innerHTML = "コピーしました";
  setTimeout(() => (copyBtn.innerHTML = "コピーする"), 1000);
});

// 背景切り替え（いらないかもだから非表示）
// defaultColor.addEventListener("click", () => {
//   if (!defaultColor.classList.contains("active")) {
//     defaultColor.classList.add("active");
//     darkColor.classList.remove("active");
//     colorMode.classList.remove("dark");
//   }
//   twitter();
// });
// darkColor.addEventListener("click", () => {
//   if (defaultColor.classList.contains("active")) {
//     defaultColor.classList.remove("active");
//     darkColor.classList.add("active");
//     colorMode.classList.add("dark");
//   }
//   twitter();
// });

const spIcon = document.querySelector(".sp_icon");
const detail = document.querySelector(".detail");
const detailBg = document.querySelector(".detail_bg");
// カウントモーダル用
spIcon.addEventListener("click", (e) => {
  e.preventDefault();
  detail.classList.add("active");
  detailBg.classList.add("active");
});
detailBg.addEventListener("click", () => {
  if (detailBg.classList.contains("active")) {
    detail.classList.remove("active");
    detailBg.classList.remove("active");
  }
});

// アコーディオン
const exTitle = document.querySelector(".ex h4");

exTitle.addEventListener("click", function () {
  this.classList.toggle("active");
  const accCnt = this.nextElementSibling;
  accCnt.classList.toggle("active");
  if (accCnt.style.maxHeight) {
    accCnt.style.maxHeight = null;
  } else {
    accCnt.style.maxHeight = accCnt.scrollHeight + 20 + "px";
  }
});
