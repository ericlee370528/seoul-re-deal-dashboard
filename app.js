(function () {
  var SUPABASE_URL = "https://zxapqqgjoizgsqirojfz.supabase.co";
  var SUPABASE_KEY = "sb_publishable_e1Tz8GaLsMCx_ImYfr_Cgw_lrPmweVN";
  var supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  // ---------------------------------------------------------------
  // 부동산 PF·실물 인수 딜 데이터는 Supabase의 public.deals 테이블에서
  // 조회한다(실제 언론 보도·공시 근거). DB 컬럼(snake_case)을 화면
  // 렌더링에 쓰는 camelCase 필드로 변환해 사용한다.
  // ---------------------------------------------------------------
  function dealFromRow(row) {
    return {
      id: row.id,
      dealName: row.deal_name,
      dealType: row.deal_type,
      assetType: row.asset_type,
      region: row.region,
      stage: row.stage,
      amountKrwRaw: row.amount_krw_raw === null ? null : Number(row.amount_krw_raw),
      amountEok: row.amount_eok === null ? null : Number(row.amount_eok),
      leadArrangers: row.lead_arrangers || [],
      participants: row.participants || [],
      summary: row.summary,
      progressNotes: row.progress_notes || [],
      referenceLinks: row.reference_links || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  async function fetchDeals() {
    var res = await supabaseClient.from("deals").select("*");
    if (res.error) {
      console.error("딜 데이터 조회 실패:", res.error);
      return [];
    }
    return res.data.map(dealFromRow);
  }

  // 관심 딜(즐겨찾기)은 public.watchlist 테이블에 deal_id로 저장한다.
  async function fetchWatchlist() {
    var res = await supabaseClient.from("watchlist").select("deal_id");
    if (res.error) {
      console.error("관심 딜 조회 실패:", res.error);
      return new Set();
    }
    return new Set(res.data.map(function (r) { return r.deal_id; }));
  }

  async function toggleWatchlist(dealId) {
    if (watchlistIds.has(dealId)) {
      watchlistIds.delete(dealId);
      var delRes = await supabaseClient.from("watchlist").delete().eq("deal_id", dealId);
      if (delRes.error) { console.error("관심 딜 해제 실패:", delRes.error); watchlistIds.add(dealId); }
    } else {
      watchlistIds.add(dealId);
      var insRes = await supabaseClient.from("watchlist").insert({ deal_id: dealId });
      if (insRes.error) { console.error("관심 딜 등록 실패:", insRes.error); watchlistIds.delete(dealId); }
    }
    refresh();
    if (currentDetailId === dealId) openDetail(dealId);
  }

  var GYEONGGI_PATHS = {"viewBox":"0 0 600 600","features":[{"region":"양평군","d":"M420.5,285.7 427.1,283.8 434.4,276.4 442.4,280.0 450.7,288.1 464.5,297.0 468.2,302.6 482.8,300.3 486.7,304.0 495.2,303.1 501.6,311.4 513.3,316.0 511.1,321.7 499.6,323.4 489.2,335.0 489.4,340.9 496.3,352.3 498.1,363.6 490.3,389.4 484.6,391.1 466.0,388.4 468.3,373.7 455.2,373.1 448.6,375.9 444.9,372.4 434.6,369.8 413.4,373.3 408.9,363.8 404.2,361.8 395.1,368.3 377.0,361.9 369.9,369.2 366.4,366.3 361.0,354.5 365.9,346.8 363.5,335.8 358.2,325.4 346.0,323.7 340.0,330.9 340.2,322.1 351.0,300.5 354.4,285.9 360.4,277.7 369.5,276.6 377.7,270.7 384.0,277.9 393.2,294.0 393.6,306.3 401.1,308.5 408.1,302.9 421.3,302.4 424.3,291.6 420.5,285.7Z"},{"d":"M384.3,115.2 388.2,129.3 392.7,133.4 402.1,136.0 414.3,135.3 415.8,148.7 434.6,153.9 438.0,160.3 439.3,173.5 434.0,186.4 428.6,185.9 421.6,194.1 412.0,199.6 409.8,207.1 413.1,212.8 408.5,220.0 415.9,232.5 404.1,244.4 414.7,249.1 420.8,245.3 417.7,262.7 418.5,272.3 413.5,279.8 420.5,285.7 424.3,291.6 421.3,302.4 408.1,302.9 401.1,308.5 393.6,306.3 393.2,294.0 384.0,277.9 377.7,270.7 369.5,276.6 360.4,277.7 363.0,267.1 354.8,255.3 355.4,247.3 351.4,244.9 343.7,229.7 327.0,224.4 331.1,209.9 329.4,205.7 333.9,188.3 341.6,189.8 345.3,186.8 347.0,167.3 355.6,167.4 364.7,158.6 362.1,151.3 366.4,142.8 373.8,136.7 375.5,129.9 384.3,115.2Z","region":"가평군"},{"region":"연천군","d":"M276.8,18.0 278.3,28.8 277.0,38.1 283.5,42.0 289.3,38.0 293.8,42.1 295.0,55.3 299.2,61.3 297.1,78.7 303.3,102.5 301.5,109.7 289.4,112.5 286.9,106.5 277.7,115.2 288.3,129.5 289.0,137.1 280.2,144.1 270.8,140.9 271.1,147.3 259.0,143.5 250.6,158.7 245.0,165.0 233.3,159.2 246.7,138.9 239.3,134.4 232.1,134.5 221.8,143.2 209.3,137.0 208.4,147.5 200.9,147.4 196.0,141.4 190.8,143.5 189.7,150.0 179.3,147.6 178.2,139.0 187.4,138.6 185.3,131.0 188.1,122.2 195.0,123.1 201.1,128.3 207.6,115.1 207.7,105.8 199.3,103.4 194.0,97.5 176.7,102.7 173.1,95.9 161.3,84.2 168.2,73.4 186.1,55.8 201.2,45.8 208.4,53.3 218.1,53.7 226.6,50.9 230.6,56.0 236.7,50.2 233.9,41.4 238.9,40.3 250.1,32.0 264.3,26.6 276.8,18.0Z"},{"d":"M369.9,369.2 377.0,361.9 395.1,368.3 404.2,361.8 408.9,363.8 413.4,373.3 434.6,369.8 444.9,372.4 448.6,375.9 455.2,373.1 468.3,373.7 466.0,388.4 484.6,391.1 484.7,406.0 487.5,415.0 483.1,419.0 484.2,435.1 481.2,439.3 480.9,451.8 477.3,454.5 464.3,477.8 464.1,482.5 452.9,482.8 442.8,477.1 432.9,463.2 426.0,462.9 419.6,467.9 410.2,469.2 407.2,464.7 411.6,458.5 409.8,442.2 413.6,439.7 410.9,428.7 416.5,417.6 406.0,402.3 398.3,401.1 392.2,393.3 383.2,394.6 383.4,383.0 375.2,382.1 369.9,369.2Z","region":"여주시"},{"d":"M299.2,61.3 302.6,71.0 313.2,76.6 323.6,70.0 328.5,62.5 334.3,64.4 333.6,74.4 330.0,80.4 332.3,88.8 341.3,89.0 344.5,97.4 364.4,89.7 379.4,89.3 383.8,96.3 384.3,115.2 375.5,129.9 373.8,136.7 366.4,142.8 362.1,151.3 364.7,158.6 355.6,167.4 347.0,167.3 345.3,186.8 341.6,189.8 333.9,188.3 329.4,205.7 331.1,209.9 327.0,224.4 324.8,229.2 313.8,235.3 309.9,232.0 300.5,230.7 297.2,234.7 288.7,234.7 286.5,231.0 275.2,224.7 280.8,211.6 280.8,205.1 276.7,192.3 282.9,186.7 288.8,185.8 291.6,177.9 288.5,171.4 280.8,169.5 271.1,147.3 270.8,140.9 280.2,144.1 289.0,137.1 288.3,129.5 277.7,115.2 286.9,106.5 289.4,112.5 301.5,109.7 303.3,102.5 297.1,78.7 299.2,61.3Z","region":"포천시"},{"region":"양주시","d":"M233.3,159.2 245.0,165.0 245.3,174.3 256.6,178.6 261.1,188.5 271.5,187.8 276.7,192.3 280.8,205.1 280.8,211.6 275.2,224.7 258.1,232.2 247.8,229.1 242.6,231.5 242.5,240.4 245.9,246.5 246.9,256.4 244.5,263.0 239.2,265.1 230.7,259.8 224.2,262.8 222.6,268.6 216.5,268.2 217.1,243.9 219.4,237.2 221.5,226.9 211.5,219.2 214.3,199.9 220.9,197.8 224.7,189.5 224.8,176.3 233.3,159.2Z"},{"region":"광주시","d":"M340.0,330.9 346.0,323.7 358.2,325.4 363.5,335.8 365.9,346.8 361.0,354.5 366.4,366.3 369.9,369.2 375.2,382.1 383.4,383.0 383.2,394.6 376.3,402.8 365.5,410.5 362.1,409.8 350.5,423.0 350.1,430.0 343.9,428.2 331.9,430.8 330.5,414.3 332.4,399.9 326.5,400.9 314.9,394.4 308.4,405.7 303.1,399.1 287.2,403.5 285.4,402.2 284.6,394.6 290.7,392.5 297.5,375.6 303.8,368.1 304.5,360.1 299.7,348.3 310.8,344.6 317.5,347.5 324.5,341.7 322.8,336.2 333.7,332.0 340.0,330.9Z"},{"d":"M218.6,426.7 219.1,432.8 225.9,436.2 233.1,446.9 249.1,448.4 254.5,440.9 263.1,442.3 270.3,451.9 290.3,451.0 293.2,466.3 284.2,471.2 281.0,480.9 275.0,481.3 271.8,474.9 265.5,473.1 262.4,459.0 250.5,458.2 241.8,467.5 250.8,473.4 253.1,484.2 243.1,488.0 241.5,501.8 236.9,510.3 226.1,511.6 222.8,514.6 210.1,510.9 204.3,514.6 196.2,529.1 190.1,533.7 176.9,534.3 174.4,527.4 162.2,527.4 161.4,519.4 165.5,511.7 168.4,497.7 164.8,494.6 167.9,487.6 176.3,487.1 179.3,478.1 174.8,468.4 170.9,472.7 160.8,472.4 154.9,483.2 142.3,492.3 137.3,483.5 140.4,479.1 133.4,473.8 135.1,455.0 138.7,449.0 134.6,443.7 141.7,433.2 156.8,438.2 164.2,436.3 174.5,440.6 174.7,431.3 181.2,426.0 192.1,431.4 214.3,421.6 218.6,426.7Z","region":"화성시"},{"region":"김포시","d":"M138.4,256.8 136.8,266.3 159.0,281.4 169.6,288.2 179.5,295.5 175.9,304.6 159.9,299.8 154.0,300.4 145.5,290.1 132.2,281.8 125.6,285.9 122.8,294.4 116.7,295.6 105.2,302.1 99.3,293.4 97.9,286.2 91.3,275.8 89.4,266.3 90.7,255.5 87.9,251.7 90.3,241.4 86.7,229.8 99.6,229.0 103.4,234.2 117.0,235.5 126.4,225.2 135.4,222.7 141.1,246.5 138.4,256.8Z"},{"region":"안성시","d":"M398.4,517.9 388.1,521.6 388.2,530.9 384.6,534.7 379.2,538.4 367.8,540.0 364.9,545.5 370.3,552.2 362.8,558.7 353.6,558.3 340.6,567.8 334.5,582.0 328.2,574.2 319.8,572.5 312.2,567.3 306.4,558.5 287.9,550.7 280.0,551.6 285.2,541.9 290.7,540.1 288.3,532.4 290.7,527.3 275.5,524.8 282.5,518.0 281.2,502.3 294.9,504.2 304.2,503.2 308.5,497.1 317.2,490.2 322.1,489.6 321.8,480.6 333.9,486.2 341.1,496.7 346.3,491.0 351.6,497.2 356.3,495.9 369.4,500.7 377.4,499.0 376.4,488.3 379.2,479.6 386.5,484.5 402.6,491.5 406.8,503.7 403.2,514.8 398.4,517.9Z"},{"d":"M383.2,394.6 392.2,393.3 398.3,401.1 406.0,402.3 416.5,417.6 410.9,428.7 413.6,439.7 409.8,442.2 411.6,458.5 407.2,464.7 410.2,469.2 419.6,467.9 426.0,462.9 432.9,463.2 442.8,477.1 445.7,482.3 443.5,500.3 433.9,504.7 422.8,513.8 418.5,521.3 411.4,516.7 398.4,517.9 403.2,514.8 406.8,503.7 402.6,491.5 386.5,484.5 379.2,479.6 373.6,476.6 374.2,469.3 364.0,465.5 362.7,460.3 353.1,456.7 347.2,449.8 350.1,430.0 350.5,423.0 362.1,409.8 365.5,410.5 376.3,402.8 383.2,394.6Z","region":"이천시"},{"d":"M178.2,139.0 179.3,147.6 189.7,150.0 190.8,143.5 196.0,141.4 200.9,147.4 208.4,147.5 209.3,137.0 221.8,143.2 232.1,134.5 239.3,134.4 246.7,138.9 233.3,159.2 224.8,176.3 224.7,189.5 220.9,197.8 214.3,199.9 211.5,219.2 221.5,226.9 219.4,237.2 212.7,237.9 210.6,245.3 204.5,248.8 196.0,242.9 189.3,245.5 182.5,247.3 176.5,243.3 169.7,254.9 153.9,255.0 143.3,260.8 138.4,256.8 141.1,246.5 135.4,222.7 133.8,220.4 137.6,203.9 133.2,200.8 143.2,189.4 136.9,181.5 138.7,177.1 134.9,167.6 137.3,153.8 142.9,158.4 150.5,160.0 160.2,155.2 158.7,146.8 166.1,141.8 171.6,142.7 178.2,139.0Z","region":"파주시"},{"region":"용인시수지구","d":"M250.8,389.1 264.5,394.9 279.2,404.7 285.4,402.2 287.2,403.5 285.7,408.3 274.4,409.2 270.6,418.8 261.2,419.5 261.3,414.6 254.6,409.6 252.5,400.1 247.8,397.4 250.8,389.1Z"},{"d":"M270.6,418.8 274.4,409.2 285.7,408.3 298.4,424.2 297.8,435.0 289.5,442.1 290.3,451.0 270.3,451.9 263.1,442.3 268.9,435.7 262.6,429.7 270.3,423.3 270.6,418.8Z","region":"용인시기흥구"},{"region":"용인시처인구","d":"M350.1,430.0 347.2,449.8 353.1,456.7 362.7,460.3 364.0,465.5 374.2,469.3 373.6,476.6 379.2,479.6 376.4,488.3 377.4,499.0 369.4,500.7 356.3,495.9 351.6,497.2 346.3,491.0 341.1,496.7 333.9,486.2 321.8,480.6 322.1,489.6 317.2,490.2 308.5,497.1 304.2,503.2 294.9,504.2 281.2,502.3 276.7,488.1 281.0,480.9 284.2,471.2 293.2,466.3 290.3,451.0 289.5,442.1 297.8,435.0 298.4,424.2 285.7,408.3 287.2,403.5 303.1,399.1 308.4,405.7 314.9,394.4 326.5,400.9 332.4,399.9 330.5,414.3 331.9,430.8 343.9,428.2 350.1,430.0Z"},{"region":"하남시","d":"M294.5,305.4 305.5,300.7 316.7,314.2 316.9,317.7 331.0,326.9 333.7,332.0 322.8,336.2 324.5,341.7 317.5,347.5 310.8,344.6 299.7,348.3 298.1,348.7 286.6,348.1 293.4,337.4 288.0,330.6 294.0,319.3 300.0,312.9 294.5,305.4Z"},{"d":"M255.1,371.5 255.8,376.1 250.8,389.1 247.8,397.4 235.7,407.4 230.4,417.1 220.4,416.9 219.6,415.3 224.8,408.5 229.7,393.3 236.3,377.5 246.1,372.2 255.1,371.5Z","region":"의왕시"},{"d":"M229.7,393.3 224.8,408.5 219.6,415.3 212.2,409.5 202.9,410.2 209.0,394.7 214.4,387.8 222.9,386.2 229.7,393.3Z","region":"군포시"},{"region":"시흥시","d":"M170.9,348.9 186.2,353.9 192.7,372.8 196.3,377.2 202.5,377.0 204.1,387.4 198.6,393.3 190.9,392.5 185.5,392.7 174.4,402.1 165.6,401.4 158.3,406.2 153.2,412.7 143.5,404.5 146.2,396.0 157.6,379.7 162.9,368.7 168.0,366.8 171.0,357.3 170.9,348.9Z"},{"region":"오산시","d":"M275.0,481.3 270.3,486.1 254.9,487.1 253.1,484.2 250.8,473.4 241.8,467.5 250.5,458.2 262.4,459.0 265.5,473.1 271.8,474.9 275.0,481.3Z"},{"region":"남양주시","d":"M327.0,224.4 343.7,229.7 351.4,244.9 355.4,247.3 354.8,255.3 363.0,267.1 360.4,277.7 354.4,285.9 351.0,300.5 340.2,322.1 340.0,330.9 333.7,332.0 331.0,326.9 316.9,317.7 316.7,314.2 305.5,300.7 294.5,305.4 287.7,288.8 289.9,281.2 277.4,280.0 271.3,277.0 272.2,261.2 268.0,258.3 282.0,245.7 282.9,237.5 288.7,234.7 297.2,234.7 300.5,230.7 309.9,232.0 313.8,235.3 324.8,229.2 327.0,224.4Z"},{"d":"M277.4,280.0 289.9,281.2 287.7,288.8 294.5,305.4 278.0,313.1 274.1,307.8 279.5,295.3 275.6,288.7 277.4,280.0Z","region":"구리시"},{"d":"M238.2,354.4 253.6,355.0 257.0,365.4 255.1,371.5 246.1,372.2 236.3,377.5 229.5,367.4 230.0,361.3 238.2,354.4Z","region":"과천시"},{"d":"M138.4,256.8 143.3,260.8 153.9,255.0 169.7,254.9 170.9,264.4 168.3,269.7 159.0,275.4 159.0,281.4 136.8,266.3 138.4,256.8Z","region":"고양시일산서구"},{"d":"M169.7,254.9 176.5,243.3 182.5,247.3 189.3,245.5 195.5,260.0 188.5,263.7 176.3,281.0 169.6,288.2 159.0,281.4 159.0,275.4 168.3,269.7 170.9,264.4 169.7,254.9Z","region":"고양시일산동구"},{"region":"고양시덕양구","d":"M189.3,245.5 196.0,242.9 204.5,248.8 210.6,245.3 212.7,237.9 219.4,237.2 217.1,243.9 216.5,268.2 222.6,268.6 224.2,262.8 230.7,259.8 239.2,265.1 235.3,275.0 236.9,282.4 233.9,284.5 232.8,284.1 227.2,274.9 213.8,279.3 210.2,292.0 210.5,299.1 204.2,300.8 196.4,307.4 184.4,300.8 179.5,295.5 169.6,288.2 176.3,281.0 188.5,263.7 195.5,260.0 189.3,245.5Z"},{"d":"M116.5,414.5 104.5,426.3 113.0,433.3 116.8,433.1 121.2,443.7 130.1,448.2 128.9,454.2 109.2,450.2 103.9,456.8 96.2,455.9 95.3,448.4 101.4,441.5 102.2,435.8 97.6,426.2 103.7,425.7 107.3,419.8 116.5,414.5Z M190.9,392.5 191.2,415.9 183.1,419.0 169.1,422.4 154.1,417.2 153.2,412.7 158.3,406.2 165.6,401.4 174.4,402.1 185.5,392.7 190.9,392.5Z","region":"안산시단원구"},{"region":"안산시상록구","d":"M190.9,392.5 198.6,393.3 204.1,387.4 209.0,394.7 202.9,410.2 212.2,409.5 219.6,415.3 220.4,416.9 218.6,426.7 214.3,421.6 192.1,431.4 183.1,419.0 191.2,415.9 190.9,392.5Z"},{"d":"M245.0,165.0 250.6,158.7 259.0,143.5 271.1,147.3 280.8,169.5 288.5,171.4 291.6,177.9 288.8,185.8 282.9,186.7 276.7,192.3 271.5,187.8 261.1,188.5 256.6,178.6 245.3,174.3 245.0,165.0Z","region":"동두천시"},{"d":"M275.0,481.3 281.0,480.9 276.7,488.1 281.2,502.3 282.5,518.0 275.5,524.8 290.7,527.3 288.3,532.4 290.7,540.1 285.2,541.9 280.0,551.6 278.1,550.2 265.5,564.0 252.0,568.1 240.4,565.2 212.7,577.5 211.3,569.0 205.7,564.9 198.4,566.3 197.8,559.8 192.7,555.5 186.0,544.4 175.4,537.1 176.9,534.3 190.1,533.7 196.2,529.1 204.3,514.6 210.1,510.9 222.8,514.6 226.1,511.6 236.9,510.3 241.5,501.8 243.1,488.0 253.1,484.2 254.9,487.1 270.3,486.1 275.0,481.3Z","region":"평택시"},{"d":"M188.6,346.8 192.5,347.9 201.8,343.4 210.0,362.8 202.5,377.0 196.3,377.2 192.7,372.8 186.2,353.9 188.6,346.8Z","region":"광명시"},{"region":"부천시오정구","d":"M167.6,315.6 168.7,317.8 185.0,321.1 185.8,334.1 185.2,335.1 177.1,335.2 165.2,330.2 165.2,327.8 167.6,315.6Z"},{"region":"부천시소사구","d":"M184.5,341.3 188.6,346.8 186.2,353.9 170.9,348.9 167.6,348.9 159.5,342.1 178.9,344.6 184.5,341.3Z"},{"d":"M165.2,330.2 177.1,335.2 185.2,335.1 184.5,341.3 178.9,344.6 159.5,342.1 160.4,331.8 165.2,330.2Z","region":"부천시원미구"},{"region":"안양시동안구","d":"M225.2,362.1 230.0,361.3 229.5,367.4 236.3,377.5 229.7,393.3 222.9,386.2 218.5,371.6 225.0,369.0 225.2,362.1Z"},{"d":"M219.1,357.6 225.2,362.1 225.0,369.0 218.5,371.6 222.9,386.2 214.4,387.8 209.0,394.7 204.1,387.4 202.5,377.0 210.0,362.8 219.1,357.6Z","region":"안양시만안구"},{"region":"의정부시","d":"M275.2,224.7 286.5,231.0 288.7,234.7 282.9,237.5 282.0,245.7 268.0,258.3 258.1,262.0 246.9,256.4 245.9,246.5 242.5,240.4 242.6,231.5 247.8,229.1 258.1,232.2 275.2,224.7Z"},{"region":"성남시분당구","d":"M297.5,375.6 290.7,392.5 284.6,394.6 285.4,402.2 279.2,404.7 264.5,394.9 250.8,389.1 255.8,376.1 268.8,379.0 279.5,371.7 284.8,370.9 297.5,375.6Z"},{"d":"M298.1,348.7 299.7,348.3 304.5,360.1 303.8,368.1 297.5,375.6 284.8,370.9 279.5,371.7 279.7,364.8 291.7,359.9 298.1,348.7Z","region":"성남시중원구"},{"region":"성남시수정구","d":"M298.1,348.7 291.7,359.9 279.7,364.8 279.5,371.7 268.8,379.0 255.8,376.1 255.1,371.5 257.0,365.4 262.8,366.1 270.1,359.4 272.6,353.0 280.9,351.5 286.6,348.1 298.1,348.7Z"},{"region":"수원시영통구","d":"M270.6,418.8 270.3,423.3 262.6,429.7 268.9,435.7 263.1,442.3 254.5,440.9 253.5,435.7 255.9,428.4 252.7,420.9 254.6,409.6 261.3,414.6 261.2,419.5 270.6,418.8Z"},{"region":"수원시팔달구","d":"M252.7,420.9 255.9,428.4 253.5,435.7 235.0,423.6 244.8,424.0 252.7,420.9Z"},{"region":"수원시권선구","d":"M230.4,417.1 235.0,423.6 253.5,435.7 254.5,440.9 249.1,448.4 233.1,446.9 225.9,436.2 219.1,432.8 218.6,426.7 220.4,416.9 230.4,417.1Z"},{"d":"M247.8,397.4 252.5,400.1 254.6,409.6 252.7,420.9 244.8,424.0 235.0,423.6 230.4,417.1 235.7,407.4 247.8,397.4Z","region":"수원시장안구"}]};

  var GYEONGGI_NAME_MAP = {
    "수원시영통구":"수원시","수원시팔달구":"수원시","수원시권선구":"수원시","수원시장안구":"수원시",
    "성남시분당구":"성남시","성남시중원구":"성남시","성남시수정구":"성남시",
    "고양시일산서구":"고양시","고양시일산동구":"고양시","고양시덕양구":"고양시",
    "안양시동안구":"안양시","안양시만안구":"안양시",
    "부천시오정구":"부천시","부천시소사구":"부천시","부천시원미구":"부천시",
    "안산시단원구":"안산시","안산시상록구":"안산시",
    "용인시수지구":"용인시","용인시기흥구":"용인시","용인시처인구":"용인시"
  };

  var INCHEON_PATHS = {"features":[{"d":"M331.2,365.2 333.2,368.8 330.1,372.0 327.0,368.5 331.2,365.2Z M337.2,320.5 345.2,329.8 344.7,336.4 339.3,337.8 338.3,334.2 333.7,332.2 333.3,327.5 337.2,320.5Z M415.5,316.5 419.4,317.7 422.1,324.5 417.8,326.7 412.8,333.3 406.9,330.9 408.4,320.5 415.5,316.5Z M413.4,246.8 416.1,248.6 414.6,255.8 407.0,251.9 413.4,246.8Z M380.5,242.4 391.7,250.5 384.7,251.4 384.9,247.7 380.5,242.4Z M252.9,209.9 251.7,213.7 245.8,217.1 245.9,209.6 252.9,209.9Z M35.5,164.6 38.7,164.7 38.5,172.9 36.6,175.4 30.6,175.9 29.6,171.3 35.5,164.6Z M31.0,128.0 40.4,128.9 40.7,135.6 35.8,138.2 33.1,145.8 20.5,143.8 15.0,133.7 15.7,129.3 20.8,131.4 31.0,128.0Z","region":"옹진군"},{"region":"강화군","d":"M364.2,216.3 368.7,216.9 367.0,223.3 362.6,218.4 364.2,216.3Z M356.1,207.5 359.6,213.5 358.2,216.4 352.2,212.8 356.1,207.5Z M384.9,190.9 383.1,200.1 388.7,204.7 394.2,205.8 395.2,213.2 387.9,219.8 382.4,209.5 372.2,202.3 375.4,199.7 376.3,192.6 384.9,190.9Z M371.3,173.1 377.1,176.2 386.3,177.6 382.3,184.3 377.0,187.0 372.5,185.5 367.4,186.7 362.9,190.1 358.7,185.9 365.1,172.9 371.3,173.1Z M427.4,194.2 425.7,201.1 427.6,203.7 426.7,210.9 428.0,217.3 428.3,221.2 432.0,230.4 417.5,236.1 416.0,232.4 407.9,233.7 401.0,233.3 395.4,229.1 394.2,222.7 401.3,217.9 397.4,207.2 390.0,202.9 388.0,198.9 387.6,191.4 390.5,188.6 389.2,179.5 398.9,170.4 408.1,168.9 414.2,176.0 423.5,181.9 427.4,194.2Z"},{"d":"M470.2,233.8 468.3,237.3 463.2,236.7 467.2,244.5 461.5,249.2 462.8,252.4 463.2,258.4 461.4,266.1 458.5,265.1 452.1,260.0 444.2,259.7 444.6,244.1 441.9,242.7 437.4,235.0 445.1,230.6 449.3,229.8 451.1,224.1 455.6,221.3 464.5,226.9 470.2,233.8Z","region":"서구"},{"region":"계양구","d":"M485.0,236.7 479.4,244.1 477.8,252.3 462.8,252.4 461.5,249.2 467.2,244.5 463.2,236.7 468.3,237.3 470.2,233.8 474.2,233.5 485.0,236.7Z"},{"d":"M462.8,252.4 477.8,252.3 477.8,253.9 474.5,255.0 474.0,262.0 479.4,266.5 476.2,268.3 467.1,264.6 461.8,266.4 461.4,266.1 463.2,258.4 462.8,252.4Z","region":"부평구"},{"d":"M481.7,266.5 481.7,272.2 479.7,278.6 476.3,279.8 472.7,287.2 468.6,291.1 459.3,288.9 465.7,279.2 465.3,275.4 464.2,269.3 461.8,266.4 467.1,264.6 476.2,268.3 479.4,266.5 481.7,266.5Z","region":"남동구"},{"region":"연수구","d":"M465.3,275.4 465.7,279.2 459.3,288.9 468.6,291.1 456.4,301.4 447.0,301.5 445.8,293.1 442.9,290.1 442.9,278.3 445.6,277.9 450.8,277.6 456.3,276.3 459.6,277.7 465.3,275.4Z"},{"d":"M458.5,265.1 461.4,266.1 461.8,266.4 464.2,269.3 465.3,275.4 459.6,277.7 456.3,276.3 450.8,277.6 449.7,271.6 452.5,267.4 455.1,263.2 458.5,265.1Z","region":"남구"},{"d":"M458.5,265.1 455.1,263.2 452.5,267.4 446.9,263.3 452.1,260.0 458.5,265.1Z","region":"동구"},{"d":"M402.7,282.9 409.1,289.9 407.7,294.0 403.1,295.2 400.1,285.7 402.7,282.9Z M446.9,263.3 452.5,267.4 449.7,271.6 450.8,277.6 445.6,277.9 441.8,274.8 443.4,263.8 446.9,263.3Z M438.7,258.5 436.2,264.2 430.9,264.8 423.3,268.1 420.9,272.9 409.2,280.3 404.4,280.1 399.2,273.5 394.2,273.1 390.7,267.7 394.5,266.4 407.1,257.8 414.1,259.0 418.1,257.7 421.4,250.2 435.9,254.9 438.7,258.5Z","region":"중구"}],"viewBox":"0 0 500 500"};

  var INCHEON_NAME_MAP = { "남구": "미추홀구" };

  var DEALS = [];
  var watchlistIds = new Set();
  var currentDetailId = null;

  var state = {
    period: "2026",
    dealTypes: new Set(["PF", "실물인수"]),
    assetTypes: new Set(),
    selectedGu: null, // null = 서울 전체(자치구 미선택)
    minAmount: 0,
    maxAmount: 13000,
    sortKey: "updatedAt",
    onlyWatched: false
  };

  function uniqueValues(field) {
    var seen = {}; var out = [];
    DEALS.forEach(function (d) { if (!seen[d[field]]) { seen[d[field]] = true; out.push(d[field]); } });
    return out;
  }

  function fmt0(n) { return Math.round(n).toLocaleString("ko-KR"); }

  function withinPeriod(deal) {
    if (state.period === "all") return true;
    // "2026": 2026년 1월 1일 이후 발생/업데이트된 딜 전체
    var updated = new Date(deal.updatedAt + "T00:00:00");
    var yearStart = new Date(state.period + "-01-01T00:00:00");
    return updated >= yearStart;
  }

  function applyFilters() {
    var result = DEALS.filter(function (d) {
      var amountOk = (d.amountEok === null || d.amountEok === undefined) ||
        (d.amountEok >= state.minAmount && d.amountEok <= state.maxAmount);
      return withinPeriod(d) &&
        state.dealTypes.has(d.dealType) &&
        state.assetTypes.has(d.assetType) &&
        (!state.selectedGu || d.region === state.selectedGu) &&
        (!state.onlyWatched || watchlistIds.has(d.id)) &&
        amountOk;
    });
    result.sort(function (a, b) {
      if (state.sortKey === "amount") {
        var av = a.amountEok === null || a.amountEok === undefined ? -1 : a.amountEok;
        var bv = b.amountEok === null || b.amountEok === undefined ? -1 : b.amountEok;
        return bv - av;
      }
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
    return result;
  }

  function renderChips(containerId, values, activeSet) {
    var container = document.getElementById(containerId);
    container.innerHTML = "";
    values.forEach(function (v) {
      var chip = document.createElement("span");
      chip.className = "chip" + (activeSet.has(v) ? " active" : "");
      chip.textContent = v;
      chip.tabIndex = 0;
      chip.addEventListener("click", function () {
        if (activeSet.has(v)) { activeSet.delete(v); } else { activeSet.add(v); }
        chip.classList.toggle("active");
        refresh();
      });
      container.appendChild(chip);
    });
  }

  function renderKPI(deals) {
    var kpiRow = document.getElementById("kpiRow");
    kpiRow.innerHTML = "";

    var withAmount = deals.filter(function (d) { return d.amountEok !== null && d.amountEok !== undefined; });
    var totalEok = withAmount.reduce(function (sum, d) { return sum + d.amountEok; }, 0);
    var unconfirmedCount = deals.length - withAmount.length;
    var pfCount = deals.filter(function (d) { return d.dealType === "PF"; }).length;
    var acqCount = deals.length - pfCount;
    var pfPct = deals.length ? Math.round((pfCount / deals.length) * 100) : 0;
    var acqPct = deals.length ? 100 - pfPct : 0;

    var tile1 = document.createElement("div");
    tile1.className = "tile accent-1";
    tile1.innerHTML =
      '<div class="label">신규/업데이트 딜 건수</div>' +
      '<div class="value">' + deals.length + '건</div>' +
      '<div class="note">현재 필터 조건 기준</div>';
    kpiRow.appendChild(tile1);

    var tile2 = document.createElement("div");
    tile2.className = "tile accent-2";
    var note2 = fmt0(totalEok) + '억원 = 금액이 확인된 ' + withAmount.length + '건 딜규모(억원) 합계';
    if (unconfirmedCount > 0) note2 += ' (금액 미확인 ' + unconfirmedCount + '건 제외)';
    tile2.innerHTML =
      '<div class="label">총 딜 규모 합계</div>' +
      '<div class="value">' + fmt0(totalEok) + '억원</div>' +
      '<div class="note">' + note2 + '</div>';
    kpiRow.appendChild(tile2);

    var tile3 = document.createElement("div");
    tile3.className = "tile";
    tile3.innerHTML =
      '<div class="label">PF / 실물인수 비중</div>' +
      '<div class="value">' + pfPct + '% / ' + acqPct + '%</div>' +
      '<div class="split">' +
        '<span><span class="dot" style="background:var(--badge-pf)"></span>PF ' + pfCount + '건</span>' +
        '<span><span class="dot" style="background:var(--badge-acq)"></span>실물인수 ' + acqCount + '건</span>' +
      '</div>';
    kpiRow.appendChild(tile3);
  }

  function badgeHtml(dealType) {
    var cls = dealType === "PF" ? "pf" : "acq";
    return '<span class="badge ' + cls + '">' + dealType + '</span>';
  }

  function amountCellHtml(d) {
    if (d.amountEok === null || d.amountEok === undefined) {
      return '<td class="amount" title="금액 비공개">미확인</td>';
    }
    return '<td class="amount" title="' + fmt0(d.amountEok) + '억원 = ' + d.amountKrwRaw.toLocaleString("ko-KR") + '원 ÷ 100,000,000">' + fmt0(d.amountEok) + '</td>';
  }

  function renderList(deals) {
    var tbody = document.getElementById("listBody");
    tbody.innerHTML = "";
    document.getElementById("listCount").textContent = deals.length + "건 표시 중 (전체 " + DEALS.length + "건)";

    if (!deals.length) {
      var emptyTr = document.createElement("tr");
      emptyTr.className = "empty-row";
      emptyTr.innerHTML = '<td colspan="9">조건에 맞는 딜이 없습니다.</td>';
      tbody.appendChild(emptyTr);
      return;
    }

    deals.forEach(function (d) {
      var tr = document.createElement("tr");
      var watched = watchlistIds.has(d.id);
      var partyText = d.leadArrangers.join(", ") + (d.participants.length ? " 외 " + d.participants.length + "곳" : "");
      tr.innerHTML =
        '<td class="watch-col"><button type="button" class="watch-btn' + (watched ? " active" : "") + '" aria-label="관심 딜 토글">' + (watched ? "★" : "☆") + "</button></td>" +
        "<td>" + badgeHtml(d.dealType) + "</td>" +
        "<td>" + d.dealName + "</td>" +
        "<td>" + d.assetType + "</td>" +
        '<td class="region-col">' + d.region + "</td>" +
        amountCellHtml(d) +
        '<td class="stage-col">' + d.stage + "</td>" +
        "<td>" + partyText + "</td>" +
        "<td>" + d.updatedAt + "</td>";
      tr.querySelector(".watch-btn").addEventListener("click", function (e) {
        e.stopPropagation();
        toggleWatchlist(d.id);
      });
      tr.addEventListener("click", function () { openDetail(d.id); });
      tbody.appendChild(tr);
    });
  }

  function openDetail(id) {
    var d = DEALS.filter(function (x) { return x.id === id; })[0];
    if (!d) return;
    currentDetailId = id;
    var content = document.getElementById("detailContent");
    var timelineHtml = d.progressNotes.map(function (p) {
      return '<div class="timeline-item"><div class="tdate">' + p.date + '</div>' + p.note + '</div>';
    }).join("");
    var linksHtml = d.referenceLinks.map(function (l) {
      return '<a href="' + l.url + '" target="_blank" rel="noopener">' + l.label + '</a>';
    }).join("<br>");

    var amountBlock, amountCalc;
    if (d.amountEok === null || d.amountEok === undefined) {
      amountBlock = "미확인";
      amountCalc = "공개 자료에서 거래금액이 확인되지 않음";
    } else {
      amountBlock = fmt0(d.amountEok) + "억원";
      amountCalc = fmt0(d.amountEok) + "억원 = " + d.amountKrwRaw.toLocaleString("ko-KR") + "원 ÷ 100,000,000";
    }

    var watched = watchlistIds.has(d.id);
    content.innerHTML =
      '<div class="badges">' + badgeHtml(d.dealType) +
        '<span class="badge tag">' + d.assetType + '</span>' +
        '<span class="badge tag">' + d.region + '</span>' +
        '<span class="badge stage">' + d.stage + '</span></div>' +
      '<h3>' + d.dealName + '</h3>' +
      '<button type="button" class="watch-toggle' + (watched ? " active" : "") + '" id="watchToggleBtn">' +
        (watched ? "★ 관심 딜 해제" : "☆ 관심 딜로 등록") + '</button>' +
      '<div class="amount-block">' + amountBlock + '</div>' +
      '<div class="amount-calc">' + amountCalc + '</div>' +
      '<div class="field"><div class="flabel">딜 개요</div><div class="fval">' + d.summary + '</div></div>' +
      '<div class="field"><div class="flabel">주선사/매수측</div><div class="fval">' + d.leadArrangers.join(", ") + '</div></div>' +
      '<div class="field"><div class="flabel">참여사/매도측</div><div class="fval">' + d.participants.join(", ") + '</div></div>' +
      '<div class="field"><div class="flabel">진행 경과</div><div class="fval">' + timelineHtml + '</div></div>' +
      '<div class="field"><div class="flabel">등록일 / 업데이트일</div><div class="fval">' + d.createdAt + ' / ' + d.updatedAt + '</div></div>' +
      '<div class="field"><div class="flabel">출처(원문 링크)</div><div class="fval">' + linksHtml + '</div></div>';

    document.getElementById("watchToggleBtn").addEventListener("click", function () { toggleWatchlist(d.id); });

    document.getElementById("overlay").classList.add("open");
    document.getElementById("detailPanel").classList.add("open");
  }

  function closeDetail() {
    currentDetailId = null;
    document.getElementById("overlay").classList.remove("open");
    document.getElementById("detailPanel").classList.remove("open");
  }

  document.getElementById("overlay").addEventListener("click", closeDetail);
  document.getElementById("closeDetailBtn").addEventListener("click", closeDetail);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDetail(); });

  document.getElementById("periodSelect").addEventListener("change", function (e) {
    state.period = e.target.value;
    refresh();
  });
  document.getElementById("sortSelect").addEventListener("change", function (e) {
    state.sortKey = e.target.value;
    refresh();
  });
  document.getElementById("minAmount").addEventListener("input", function (e) {
    state.minAmount = Number(e.target.value) || 0;
    refresh();
  });
  document.getElementById("maxAmount").addEventListener("input", function (e) {
    state.maxAmount = Number(e.target.value) || 0;
    refresh();
  });
  document.getElementById("resetBtn").addEventListener("click", function () {
    state.period = "2026";
    state.dealTypes = new Set(["PF", "실물인수"]);
    state.assetTypes = new Set(uniqueValues("assetType"));
    state.selectedGu = null;
    state.minAmount = 0;
    state.maxAmount = 13000;
    state.sortKey = "updatedAt";
    state.onlyWatched = false;
    document.getElementById("periodSelect").value = "2026";
    document.getElementById("sortSelect").value = "updatedAt";
    document.getElementById("minAmount").value = 0;
    document.getElementById("maxAmount").value = 13000;
    document.getElementById("watchOnlyBtn").classList.remove("active");
    renderChips("dealTypeChips", ["PF", "실물인수"], state.dealTypes);
    renderChips("assetTypeChips", uniqueValues("assetType"), state.assetTypes);
    updateMapActiveClasses();
    updateMapStatus();
    refresh();
  });

  document.getElementById("watchOnlyBtn").addEventListener("click", function () {
    state.onlyWatched = !state.onlyWatched;
    this.classList.toggle("active", state.onlyWatched);
    refresh();
  });

  // ---------- Region map (서울 + 경기) ----------
  var SVGNS = "http://www.w3.org/2000/svg";

  function guDealCounts() {
    var counts = {};
    DEALS.forEach(function (d) { counts[d.region] = (counts[d.region] || 0) + 1; });
    return counts;
  }

  function updateMapStatus() {
    var statusEl = document.getElementById("regionStatus");
    if (!state.selectedGu) {
      statusEl.textContent = "전체 지역 표시 중 (진하게 칠해진 지역에 딜이 있습니다)";
    } else {
      var count = DEALS.filter(function (d) { return d.region === state.selectedGu; }).length;
      statusEl.textContent = state.selectedGu + " 선택됨 · 딜 " + count + "건";
    }
  }

  function updateMapActiveClasses() {
    var paths = document.querySelectorAll(".gu-path");
    paths.forEach(function (p) {
      p.classList.toggle("active", state.selectedGu === p.getAttribute("data-gu"));
    });
  }

  function buildPathsInto(containerId, pathsData, nameMap) {
    var container = document.getElementById(containerId);
    pathsData.features.forEach(function (f) {
      var region = (nameMap && nameMap[f.region]) || f.region;
      var path = document.createElementNS(SVGNS, "path");
      path.setAttribute("class", "gu-path");
      path.setAttribute("data-gu", region);
      path.setAttribute("d", f.d);
      container.appendChild(path);
    });
  }

  function wireDistrictPaths() {
    var counts = guDealCounts();
    var paths = document.querySelectorAll(".gu-path");
    paths.forEach(function (p) {
      var gu = p.getAttribute("data-gu");
      if (counts[gu]) p.classList.add("has-deals");
      p.addEventListener("click", function () {
        state.selectedGu = (state.selectedGu === gu) ? null : gu;
        updateMapActiveClasses();
        updateMapStatus();
        refresh();
      });
      var svg = p.closest("svg");
      var labelsGroup = svg.querySelector(".map-labels");
      var bbox = p.getBBox();
      var text = document.createElementNS(SVGNS, "text");
      text.setAttribute("x", bbox.x + bbox.width / 2);
      text.setAttribute("y", bbox.y + bbox.height / 2);
      text.setAttribute("class", "gu-label");
      text.textContent = gu;
      labelsGroup.appendChild(text);
    });
  }

  var PROVINCE_PANE_ID = { seoul: "paneSeoul", gyeonggi: "paneGyeonggi", incheon: "paneIncheon" };

  function wireMapTabs() {
    var tabs = document.querySelectorAll(".tab-btn");
    tabs.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var province = btn.getAttribute("data-province");
        tabs.forEach(function (b) { b.classList.toggle("active", b === btn); });
        Object.keys(PROVINCE_PANE_ID).forEach(function (key) {
          document.getElementById(PROVINCE_PANE_ID[key]).classList.toggle("active", key === province);
        });
      });
    });
  }

  function initMap() {
    buildPathsInto("gyeonggiPaths", GYEONGGI_PATHS, GYEONGGI_NAME_MAP);
    buildPathsInto("incheonPaths", INCHEON_PATHS, INCHEON_NAME_MAP);
    wireDistrictPaths();
    wireMapTabs();
    document.getElementById("mapResetBtn").addEventListener("click", function () {
      state.selectedGu = null;
      updateMapActiveClasses();
      updateMapStatus();
      refresh();
    });
    updateMapStatus();
  }

  function refresh() {
    var filtered = applyFilters();
    renderList(filtered);
    renderKPI(filtered);
  }

  async function init() {
    DEALS = await fetchDeals();
    watchlistIds = await fetchWatchlist();
    state.assetTypes = new Set(uniqueValues("assetType"));
    renderChips("dealTypeChips", ["PF", "실물인수"], state.dealTypes);
    renderChips("assetTypeChips", uniqueValues("assetType"), state.assetTypes);
    initMap();
    refresh();
  }

  init();
})();
