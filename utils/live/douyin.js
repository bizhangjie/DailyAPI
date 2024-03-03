const axios = require('axios');

async function getDouyinUrl(rid, stream) {
  const liveUrl = `https://live.douyin.com/${rid}`;
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    'Upgrade-Insecure-Requests': '1'
  };
  // Send initial request to obtain __ac_nonce
  const initialResponse = await axios.get(liveUrl, { headers });

  // Extract __ac_nonce from Set-Cookie header
  const setCookieOne = initialResponse.headers['set-cookie'][0];
  const acNonceMatch = setCookieOne.match(/__ac_nonce=(.*?);/i);
  const acNonce = acNonceMatch ? acNonceMatch[1] : null;
  // console.log(setCookieOne)
  // console.log(acNonce)
  if (!acNonce) return null;

  // Set __ac_nonce cookie and send another request
  const session = axios.create({ headers: { Cookie: `__ac_nonce=${acNonce}` } });
  const twoResponse = await session.get(liveUrl, { headers });

  // Extract ttwid from Set-Cookie header
  const setCookieOneTwo = twoResponse.headers['set-cookie'][0];
  const ttwidMatch = setCookieOneTwo.match(/ttwid=.*?;/i);
  const ttwid = ttwidMatch ? ttwidMatch[0] : null;
  // console.log(setCookieOneTwo)
  // console.log(ttwid)
  if (!ttwid) return null;

  // Build URL for final request
  const url = `https://live.douyin.com/webcast/room/web/enter/?aid=6383&app_name=douyin_web&live_id=1&device_platform=web&language=zh-CN&enter_from=web_live&cookie_enabled=true&screen_width=1728&screen_height=1117&browser_language=zh-CN&browser_platform=MacIntel&browser_name=Chrome&browser_version=116.0.0.0&web_rid=${rid}`;
  const finalHeaders = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    'Cookie': ttwid,
    'Accept': '*/*',
    'Host': 'live.douyin.com',
    'Connection': 'keep-alive'
  };

  // Send the final request
  const res = await axios.get(url, {headers:finalHeaders});
  // Parse the JSON response
  const data = res.data;
  const status = data.data?.data[0]?.status || 0;

  if (status !== 2) return null;

  let realUrl = "";
  const streamData = data.data?.data[0]?.stream_url?.live_core_sdk_data?.pull_data?.stream_data || null;

  if (streamData) {
    const value = JSON.parse(streamData);
    if (stream === "flv") {
      realUrl = value.data?.origin?.main?.flv || "";
    } else if (stream === "hls") {
      realUrl = value.data?.origin?.main?.hls || "";
    }
  }

  return realUrl;
}

async function douYinRid(rid) {
  // const rid = "936474225288";
  const stream = "flv"; // 或者根据需要设置hls
  const douyinUrl = await getDouyinUrl(rid, stream);
  console.log("抖音直播链接: ", douyinUrl);
  return douyinUrl;
}

module.exports = {
  douYinRid
}

// main();