const axios = require('axios');
const fs = require('fs');
const CryptoJS = require('crypto-js');

const media_key = CryptoJS[String.fromCharCode(101) + String.fromCharCode(110) + String.fromCharCode(99)][String.fromCharCode(85) + String.fromCharCode(116) + String.fromCharCode(102) + String.fromCharCode(56)][`${String.fromCharCode(112)}arse`]("102_53_100_57_54_53_100_102_55_53_51_51_54_50_55_48"
    .split("_")
    .map((a) => String.fromCharCode(parseInt(a)))
    .join(""));

const media_iv = CryptoJS[String.fromCharCode(101) + String.fromCharCode(110) + String.fromCharCode(99)][String.fromCharCode(85) + String.fromCharCode(116) + String.fromCharCode(102) + String.fromCharCode(56)][`${String.fromCharCode(112)}arse`]("57_55_98_54_48_51_57_52_97_98_99_50_102_98_101_49"
    .split("_")
    .map((a) => String.fromCharCode(parseInt(a)))
    .join(""));

async function loadImg(url) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    });
    const data = Buffer.from(response.data, 'binary');
    const ext = getExtension(url);
    const rs = decryptImage(data.toString('base64'));
    // console.log(`data:image/${ext};base64,${rs}`)
    return Promise.resolve(`data:image/${ext};base64,${rs}`);
  } catch (error) {
    console.error(error);
  }
}

function getExtension(url) {
  if (url.endsWith('.png')) {
    return 'png';
  } else if (url.endsWith('.gif')) {
    return 'gif';
  } else if (url.endsWith('.jpg') || url.endsWith('.jpeg')) {
    return 'jpeg';
  } else {
    return 'jpeg'; // Default extension
  }
}

function decryptImage(word) {
  const decrypt = CryptoJS.AES.decrypt(word, media_key, {
    iv: media_iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.NoPadding,
  });
  return decrypt.toString(CryptoJS.enc.Base64);
}

module.exports = {
  loadImg
}

// Example usage
// loadImg('https://pic.sbimcr.cn/upload/upload/20240118/2024011811205518534.jpeg', 1);