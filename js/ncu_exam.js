/**
 * 中央大學研究所（MA02 計算機概論）作業系統考題篩選暨期中範圍詳解模組
 */
const NCU_EXAM_DATA = {
  questions: [
  {
    "id": "105-2",
    "year": "105",
    "number": "第 2 題",
    "score": "10 分",
    "chapter": "CH1",
    "chapterName": "CH1 作業系統概論與硬體架構",
    "type": "問答題",
    "title": "快取記憶體概念與寫入策略（Cache Write Policy）",
    "questionHtml": "<p><strong>2. (1) 何謂 Cache？其功用為何？(5%)</strong><br>\n<strong>(2) 請比較下列兩種 cache write policy 的優缺點：write-through and write-back。(5%)</strong></p>",
    "hint": "利用程式局部性原理（時間與空間局部性）說明 Cache 角色；對比寫入時是否同步更新主記憶體之一致性與匯流排頻寬代價。",
    "derivationHtml": "<div class=\"derivation-step\">\n  <h4>(1) 快取記憶體（Cache）定義與核心功用</h4>\n  <ul>\n    <li><strong>定義</strong>：快取記憶體為配置於 CPU 暫存器與主記憶體（Main Memory）之間的微型、超高速靜態隨機存取記憶體（SRAM）。</li>\n    <li><strong>核心功用</strong>：依循「程式局部性原理（Principle of Locality）」——<strong>時間局部性</strong>（近期存取的資料短期內高機率再次存取）與<strong>空間局部性</strong>（鄰近位址的資料高機率接續存取），暫存處理器頻繁讀寫的資料與指令。</li>\n    <li><strong>系統價值</strong>：大幅消弭高速 CPU 與慢速 DRAM 之間的速度落差（Speed Gap），顯著降低平均記憶體存取延遲（AMAT），提升整體運算吞吐量。</li>\n  </ul>\n</div>\n<div class=\"derivation-step\">\n  <h4>(2) 寫入策略（Write Policy）深度對比</h4>\n  <table class=\"data-table\" style=\"width:100%; margin-top:0.5rem;\">\n    <thead>\n      <tr>\n        <th>比較維度</th>\n        <th>Write-through（直寫式）</th>\n        <th>Write-back（寫回式 / 回寫式）</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr>\n        <td><strong>更新時機</strong></td>\n        <td>寫入命中時，同時更新 Cache 與底層 Main Memory。</td>\n        <td>寫入命中時僅更新 Cache 並標記 Dirty bit=1；待該區塊被置換淘汰時才寫回 Main Memory。</td>\n      </tr>\n      <tr>\n        <td><strong>核心優點</strong></td>\n        <td>資料一致性極高，主記憶體隨時保有最新版本；系統當機或斷電復原成本低，控制邏輯簡單。</td>\n        <td>寫入延遲極低（維持 Cache 速度）；大幅減少主記憶體匯流排頻寬消耗與系統能耗。</td>\n      </tr>\n      <tr>\n        <td><strong>主要缺點</strong></td>\n        <td>寫入延遲受限於慢速主記憶體，頻繁霸佔記憶體匯流排頻寬（需藉由 Write Buffer 緩衝）。</td>\n        <td>資料一致性控制複雜；快取與主記憶體存在暫態不一致；若無預警斷電可能遺失最新更新。</td>\n      </tr>\n    </tbody>\n  </table>\n</div>",
    "answerHtml": "<p><strong>標準答案</strong>：(1) Cache 為 CPU 與主記憶體間的高速暫存，依據局部性原理縮小存取延遲；(2) Write-through 同步寫入主記憶體，一致性高但延遲大且耗頻寬；Write-back 僅寫快取並標記 Dirty，置換時才回寫，速度快省頻寬但控制複雜且有未回寫遺失風險。</p>"
  },
  {
    "id": "106-2",
    "year": "106",
    "number": "第 2 題",
    "score": "10 分",
    "chapter": "CH1/CH2",
    "chapterName": "CH1/CH2 作業系統核心架構",
    "type": "申論題",
    "title": "單核心架構 vs. 微核心架構（Kernel Architectures）",
    "questionHtml": "<p><strong>2. Monolithic kernel and microkernel are two main kernel architectures adopted by modern operating systems. Please describe their features and then explain their advantages and disadvantages respectively. (10%)</strong></p>",
    "hint": "從特權模式（Kernel Mode vs. User Mode）、位址空間隔離性、元件間通訊方式（函式呼叫 vs. IPC）與容錯邊界切入分析。",
    "derivationHtml": "<div class=\"derivation-step\">\n  <h4>1. Monolithic Kernel（單核心 / 巨集核心架構）</h4>\n  <ul>\n    <li><strong>架構特徵</strong>：所有系統核心服務（行程排程、記憶體管理、檔案系統、驅動程式、網路協定堆疊）全數整合於單一大型二進位核心，皆運行於最高特權之核心模式（Kernel Mode / Ring 0）與同一定址空間中，模組間直接藉由函式呼叫（Function Calls）通訊。代表系統：Linux、傳統 Unix。</li>\n    <li><strong>優點</strong>：執行效能卓越。模組間通訊無需跨位址空間 IPC，亦無使用者模式與核心模式間頻繁切換（Mode Switch）之開銷。</li>\n    <li><strong>缺點</strong>：容錯與安全性差。任何模組（如第三方驅動程式）出現記憶體溢位或崩潰，將直接引發全系統當機（Kernel Panic）；程式碼耦合度高，維護與擴充不易。</li>\n  </ul>\n</div>\n<div class=\"derivation-step\">\n  <h4>2. Microkernel（微核心架構）</h4>\n  <ul>\n    <li><strong>架構特徵</strong>：貫徹最小特權原則，核心模式僅保留最基礎機制（極簡行程排程、基礎記憶體映射與 IPC 原語）；將檔案系統、網路協定與裝置驅動等服務移出核心，改以使用者行程（Servers）形式運行於 User Mode。模組間完全透過微核心進行訊息傳遞（Message Passing）。代表系統：Mach、QNX、L4。</li>\n    <li><strong>優點</strong>：高可靠性與安全性。各服務處於獨立受保護定址空間，單一伺服行程崩潰不會拖垮作業系統核心且支援動態重啟；核心精簡易於移植與模組化擴展。</li>\n    <li><strong>缺點</strong>：效能開銷較大。應用程式請求服務時需頻繁透過微核心轉發訊息，伴隨大量模式切換與上下文切換（Context Switch）之效能損耗。</li>\n  </ul>\n</div>",
    "answerHtml": "<p><strong>標準答案</strong>：Monolithic Kernel 服務全置於 Kernel Mode，效能高但單點崩潰全域癱瘓；Microkernel 核心極簡僅留基礎 IPC，服務置於 User Mode，安全穩定易擴展但頻繁模式切換開銷大。</p>"
  },
  {
    "id": "108-7",
    "year": "108",
    "number": "第 7 題",
    "score": "8 分",
    "chapter": "CH5",
    "chapterName": "CH5 死結避免（Banker's Algorithm）",
    "type": "計算推導大題",
    "title": "銀行家演算法安全性推導與 Request 批准判定",
    "questionHtml": "<p><strong>7. (8 分) Consider the following snapshot of a system:</strong></p>\n<table class=\"data-table\" style=\"width:100%; margin:0.5rem 0;\">\n  <thead>\n    <tr><th>Process</th><th>Allocation (A B C D)</th><th>Max (A B C D)</th><th>Available (A B C D)</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>P0</td><td>2 0 0 1</td><td>4 2 1 2</td><td rowspan=\"5\" style=\"vertical-align:middle; font-weight:bold; color:var(--primary);\">3 3 2 1</td></tr>\n    <tr><td>P1</td><td>3 1 2 1</td><td>5 2 5 2</td></tr>\n    <tr><td>P2</td><td>2 1 0 3</td><td>2 3 1 6</td></tr>\n    <tr><td>P3</td><td>1 3 1 2</td><td>1 4 2 4</td></tr>\n    <tr><td>P4</td><td>1 4 3 2</td><td>3 6 6 5</td></tr>\n  </tbody>\n</table>\n<p><strong>Answer the following questions using the banker's algorithm:</strong><br>\n(a) If a request from process P1 arrives for (1, 1, 0, 0), can the request be granted immediately? Why?<br>\n(b) If a request from process P4 arrives for (0, 0, 2, 0), can the request be granted immediately? Why?</p>",
    "hint": "先求 Need = Max - Allocation；對各小題依序檢驗：(1) Request <= Need (2) Request <= Available (3) 試探配置更新 Work (4) 執行 Safety Algorithm 尋找安全序列。",
    "derivationHtml": "<div class=\"derivation-step\">\n  <h4>第一步：推導需求矩陣 Need = Max - Allocation</h4>\n  <ul>\n    <li>Need(P0) = (4,2,1,2) - (2,0,0,1) = (2, 2, 1, 1)</li>\n    <li>Need(P1) = (5,2,5,2) - (3,1,2,1) = (2, 1, 3, 1)</li>\n    <li>Need(P2) = (2,3,1,6) - (2,1,0,3) = (0, 2, 1, 3)</li>\n    <li>Need(P3) = (1,4,2,4) - (1,3,1,2) = (0, 1, 1, 2)</li>\n    <li>Need(P4) = (3,6,6,5) - (1,4,3,2) = (2, 2, 3, 3)</li>\n    <li>當前初始可用資源 Available = (3, 3, 2, 1)</li>\n  </ul>\n</div>\n<div class=\"derivation-step\">\n  <h4>小題 (a) 判定程序：Request_1 = (1, 1, 0, 0)</h4>\n  <ol>\n    <li>檢驗合法性：Request_1 (1, 1, 0, 0) &le; Need_1 (2, 1, 3, 1)，合法。</li>\n    <li>檢驗可用性：Request_1 (1, 1, 0, 0) &le; Available (3, 3, 2, 1)，充足。</li>\n    <li>試探性配置（Pretend Allocation）：\n      <ul>\n        <li>Available' = (3, 3, 2, 1) - (1, 1, 0, 0) = <strong>(2, 2, 2, 1)</strong></li>\n        <li>Allocation_1' = (3, 1, 2, 1) + (1, 1, 0, 0) = (4, 2, 2, 1)</li>\n        <li>Need_1' = (2, 1, 3, 1) - (1, 1, 0, 0) = (1, 0, 3, 1)</li>\n      </ul>\n    </li>\n    <li>執行安全性演算法（Work = (2, 2, 2, 1), Finish 全為 False）：\n      <ul>\n        <li>檢查 P0：Need_0 (2, 2, 1, 1) &le; Work (2, 2, 2, 1) &rarr; 滿足！P0 完成並釋放：Work = (2,2,2,1) + (2,0,0,1) = <strong>(4, 2, 2, 2)</strong>，Finish[0]=True。</li>\n        <li>檢查 P2：Need_2 (0, 2, 1, 3) &le; Work (4, 2, 2, 2) &rarr; D 資源 3 > 2，不滿足，跳過。</li>\n        <li>檢查 P3：Need_3 (0, 1, 1, 2) &le; Work (4, 2, 2, 2) &rarr; 滿足！P3 完成並釋放：Work = (4,2,2,2) + (1,3,1,2) = <strong>(5, 5, 3, 4)</strong>，Finish[3]=True。</li>\n        <li>檢查 P1：Need_1' (1, 0, 3, 1) &le; Work (5, 5, 3, 4) &rarr; 滿足！P1 完成並釋放：Work = (5,5,3,4) + (4,2,2,1) = <strong>(9, 7, 5, 5)</strong>，Finish[1]=True。</li>\n        <li>檢查 P2：Need_2 (0, 2, 1, 3) &le; Work (9, 7, 5, 5) &rarr; 滿足！P2 完成並釋放：Work = (9,7,5,5) + (2,1,0,3) = <strong>(11, 8, 5, 8)</strong>，Finish[2]=True。</li>\n        <li>檢查 P4：Need_4 (2, 2, 3, 3) &le; Work (11, 8, 5, 8) &rarr; 滿足！P4 完成並釋放，Finish[4]=True。</li>\n      </ul>\n    </li>\n    <li><strong>結論 (a)</strong>：全體 Finish 皆為 True，存在安全序列 <code>&lang;P0, P3, P1, P2, P4&rang;</code>，系統處於安全狀態（Safe State）。因此 <strong>P1 的請求可以立即被核准（Yes, granted immediately）</strong>。</li>\n  </ol>\n</div>\n<div class=\"derivation-step\">\n  <h4>小題 (b) 判定程序：Request_4 = (0, 0, 2, 0)</h4>\n  <ol>\n    <li>檢驗合法性與可用性：Request_4 (0, 0, 2, 0) &le; Need_4 (2, 2, 3, 3) 且 &le; Available (3, 3, 2, 1)，條件成立。</li>\n    <li>試探性配置：\n      <ul>\n        <li>Available'' = (3, 3, 2, 1) - (0, 0, 2, 0) = <strong>(3, 3, 0, 1)</strong></li>\n        <li>Allocation_4'' = (1, 4, 3, 2) + (0, 0, 2, 0) = (1, 4, 5, 2)</li>\n        <li>Need_4'' = (2, 2, 3, 3) - (0, 0, 2, 0) = (2, 2, 1, 3)</li>\n      </ul>\n    </li>\n    <li>執行安全性演算法（Work = (3, 3, 0, 1)）：\n      <ul>\n        <li>檢驗所有行程之 Need：\n          <ul>\n            <li>Need_0 = (2, 2, 1, 1)：需 C 資源至少 1 個，但 Work_C = 0，無法滿足！</li>\n            <li>Need_1 = (2, 1, 3, 1)：需 C 資源至少 3 個，無法滿足！</li>\n            <li>Need_2 = (0, 2, 1, 3)：需 C 資源至少 1 個且 D 需 3 個，無法滿足！</li>\n            <li>Need_3 = (0, 1, 1, 2)：需 C 資源至少 1 個且 D 需 2 個，無法滿足！</li>\n            <li>Need_4'' = (2, 2, 1, 3)：需 C 資源至少 1 個且 D 需 3 個，無法滿足！</li>\n          </ul>\n        </li>\n        <li><strong>結論 (b)</strong>：配置後全體行程皆因資源 C 不足而受阻，找不到任何安全序列，系統陷入<strong>不安全狀態（Unsafe State）</strong>。因此 <strong>P4 的請求不可立即被核准（No, cannot be granted immediately）</strong>，P4 必須等待。</li>\n      </ul>\n    </li>\n  </ol>\n</div>",
    "answerHtml": "<p><strong>標準答案</strong>：(a) 可以立即核准（Yes），存在安全序列 &lang;P0, P3, P1, P2, P4&rang;；(b) 不可立即核准（No），配置後 Work_C=0 無法滿足任何行程，系統陷入不安全狀態。</p>"
  },
  {
    "id": "109-5",
    "year": "109",
    "number": "第五題",
    "score": "5 分",
    "chapter": "CH2",
    "chapterName": "CH2 行程管理",
    "type": "問答繪圖題",
    "title": "行程五狀態轉換模型（Process State Diagram）",
    "questionHtml": "<p><strong>第五題: (5 分) Please draw the diagram of process state.</strong></p>",
    "hint": "繪製恐龍本五狀態轉換圖（New, Ready, Running, Waiting, Terminated）並標明轉移动態事件（admit, dispatch, interrupt, I/O wait, I/O completion, exit）。",
    "derivationHtml": "<div class=\"derivation-step\">\n  <h4>標準五狀態模型架構圖</h4>\n  <pre style=\"background:var(--bg-secondary); padding:1rem; border-radius:6px; color:var(--text-light); font-family:Consolas, monospace;\">\n               [Interrupt / Time Slice Exceeded]\n                      +-------------------+\n                      |                   |\n                      v                   |\n  +-------+  admit  +-------+  dispatch +---------+  exit  +------------+\n  |  New  | ------> | Ready | --------> | Running | -----> | Terminated |\n  +-------+         +-------+           +---------+        +------------+\n                      ^                   |\n                      |   I/O or Event    |\n                      |    Completion     |\n                      +-------------------+\n                                |\n                                v\n                        +---------------+\n                        | Waiting/Block |\n                        +---------------+\n  </pre>\n  <h4>五大狀態與轉移事件定義</h4>\n  <ul>\n    <li><strong>New（新建）&rarr; Ready（就緒）</strong>：行程被作業系統核准（Admitted）載入就緒佇列。</li>\n    <li><strong>Ready（就緒）&rarr; Running（執行）</strong>：CPU 排程器選定並分派處理器時間（Scheduler Dispatch）。</li>\n    <li><strong>Running（執行）&rarr; Ready（就緒）</strong>：時鐘中斷、時間配額用盡（Time Slice Expired）或遭更高優先權行程搶佔。</li>\n    <li><strong>Running（執行）&rarr; Waiting（等待/阻塞）</strong>：行程發起 I/O 系統呼叫或等待同步事件（I/O or Event Wait）。</li>\n    <li><strong>Waiting（等待）&rarr; Ready（就緒）</strong>：所等待之 I/O 作業完成或外部事件觸發（I/O or Event Completion）。</li>\n    <li><strong>Running（執行）&rarr; Terminated（終止）</strong>：行程正常 exit() 結束或發生嚴重執行時期錯誤被中止。</li>\n  </ul>\n</div>",
    "answerHtml": "<p><strong>標準答案</strong>：完整畫出包含 New、Ready、Running、Waiting、Terminated 五個狀態及其間 6 條具備事件標籤之單向轉換箭頭。</p>"
  },
  {
    "id": "109-6",
    "year": "109",
    "number": "第六題",
    "score": "4 分",
    "chapter": "CH5",
    "chapterName": "CH5 死結特性",
    "type": "簡答題",
    "title": "死結發生的四大必要條件（Coffman Conditions）",
    "questionHtml": "<p><strong>第六題: (4 分) What is four conditions of deadlock occurring?</strong></p>",
    "hint": "列出 Coffman 四大必要條件：Mutual Exclusion、Hold and Wait、No Preemption、Circular Wait，並說明需同時成立。",
    "derivationHtml": "<div class=\"derivation-step\">\n  <h4>死結四大必要條件（Coffman Conditions）深度剖析</h4>\n  <ol>\n    <li><strong>互斥條件（Mutual Exclusion）</strong>：至少有一項資源必須處於非共享模式，亦即一次只能由一個行程持有與使用；其他行程請求時必須排隊等待至其釋放。</li>\n    <li><strong>持有並等待（Hold and Wait）</strong>：行程必須至少持有一項資源，且同時正在等待獲取被其他行程持有的額外資源。</li>\n    <li><strong>不可搶佔（No Preemption）</strong>：資源不能被外力強制剝奪；資源只能由持有它的行程在完成任務後自願釋放。</li>\n    <li><strong>循環等待（Circular Wait）</strong>：存在一組封閉的等待行程集合 {P0, P1, ..., Pn}，P0 正等待 P1 持有的資源，P1 正等待 P2 持有的資源，...，Pn 正等待 P0 持有的資源，形成閉環相依等待鏈。</li>\n  </ol>\n  <p style=\"margin-top:0.5rem; color:var(--text-muted);\"><em>註：此四大條件必須「同時成立」死結才會發生；破壞其中任一條件即可達成死結預防（Deadlock Prevention）。</em></p>\n</div>",
    "answerHtml": "<p><strong>標準答案</strong>：1. Mutual Exclusion 2. Hold and Wait 3. No Preemption 4. Circular Wait。</p>"
  },
  {
    "id": "109-8",
    "year": "109",
    "number": "第八題",
    "score": "6 分",
    "chapter": "CH3",
    "chapterName": "CH3 即時 CPU 排程（RMS & EDF）",
    "type": "計算推導大題",
    "title": "即時排程演算法 RMS 與 EDF 充足性判定與推導",
    "questionHtml": "<p><strong>第八題: (6 分) Without any doubt, real-time scheduler must support preemptive and priority-based scheduling. For hard real-time scheduling must provide ability to meet deadlines. Given two processes P1 and P2, the periodic generated time of P1 and P2 are p1=50 and p2=80, respectively. And the processing time of P1 and P2 are t1=25 and t2=35, respectively.<br>\n(A) Can these two processes be scheduled using rate-monotonic scheduling? Why?<br>\n(B) Can these two processes be scheduled using earliest-deadline-first scheduling (EDF)? Why?</strong></p>",
    "hint": "計算各自利用率與總利用率；RMS 依週期分配靜態優先權，超過 Liu & Layland 限制需畫甘特圖檢驗 t=80 時刻；EDF 充要條件為總利用率 <= 1.0。",
    "derivationHtml": "<div class=\"derivation-step\">\n  <h4>系統基礎參數結算</h4>\n  <ul>\n    <li>任務 P1：週期 $p_1 = 50$，執行時間 $t_1 = 25$ &rarr; CPU 利用率 $U_1 = 25/50 = 0.5$</li>\n    <li>任務 P2：週期 $p_2 = 80$，執行時間 $t_2 = 35$ &rarr; CPU 利用率 $U_2 = 35/80 = 0.4375$</li>\n    <li>系統總利用率：$U = U_1 + U_2 = 0.5 + 0.4375 = 0.9375$（93.75%）</li>\n  </ul>\n</div>\n<div class=\"derivation-step\">\n  <h4>(A) Rate-Monotonic Scheduling (RMS) 分析</h4>\n  <ol>\n    <li><strong>優先權設定</strong>：RMS 採靜態優先權，週期越短優先權越高。因 $p_1 = 50 < p_2 = 80$，故優先權 $P_1 > P_2$。</li>\n    <li><strong>Liu & Layland 充分條件檢驗</strong>：\n      $$U_{\\text{bound}} = 2(2^{1/2} - 1) = 2(\\sqrt{2} - 1) \\approx 0.8284 \\quad (82.84\\%)$$\n      因總利用率 $U = 93.75\\% > 82.84\\%$，超出充分保證範圍，需透過甘特圖實證模擬。\n    </li>\n    <li><strong>甘特圖時間軸推演</strong>：\n      <ul>\n        <li>$t = 0 \\sim 25$：$P_1$ 優先執行完畢（其截止日為 50）。</li>\n        <li>$t = 25 \\sim 50$：$P_2$ 開始執行，執行了 $50 - 25 = 25$ 單位（剩餘 $35 - 25 = 10$ 單位）。</li>\n        <li>$t = 50$：$P_1$ 第二週期到達，因優先權高於 $P_2$，強制搶佔 CPU！</li>\n        <li>$t = 50 \\sim 75$：$P_1$ 執行第二週期並於 $t = 75$ 完成。</li>\n        <li>$t = 75$：CPU 交回 $P_2$，$P_2$ 尚需 10 單位運算，預計於 $t = 75 + 10 = 85$ 方能結束。</li>\n        <li><strong>逾時判定</strong>：$P_2$ 第一個週期的截止時間為 <strong>$t = 80$</strong>！因 $85 > 80$，$P_2$ 錯過了截止時間（Missed Deadline）！</li>\n      </ul>\n    </li>\n    <li><strong>結論 (A)</strong>：<strong>不可以（No）</strong>。總利用率超出 RMS 充分界限，且實際模擬顯示 $P_2$ 於 $t = 80$ 錯過截止時間。</li>\n  </ol>\n</div>\n<div class=\"derivation-step\">\n  <h4>(B) Earliest-Deadline-First Scheduling (EDF) 分析</h4>\n  <ol>\n    <li><strong>排程原理</strong>：EDF 採動態優先權，當前絕對截止時間（Absolute Deadline）越早者優先權越高。</li>\n    <li><strong>充要條件定理</strong>：對於週期性即時任務，EDF 的排程可行性<strong>充分且必要條件</strong>為總 CPU 利用率：\n      $$U = \\sum_{i=1}^{n} \\frac{t_i}{p_i} \\le 1.0 \\quad (100\\%)$$\n    </li>\n    <li><strong>代入檢驗</strong>：本系統總利用率 $U = 0.9375 \\le 1.0$，完全符合充要條件保證！</li>\n    <li><strong>動態驗證</strong>：$t=50$ 時 $P_1$ 第二週期到達（Deadline 為 100），而當前 $P_2$ 的 Deadline 為 80。因 $80 < 100$，$P_2$ 截止時間早於 $P_1$，故 $P_2$ <strong>不會被搶佔</strong>，能一路執行至 $t=60$ 準時完成！</li>\n    <li><strong>結論 (B)</strong>：<strong>可以（Yes）</strong>。總利用率 $93.75\\% \\le 100\\%$ 符合 EDF 充要條件，保證所有任務絕不違背截止時間。</li>\n  </ol>\n</div>",
    "answerHtml": "<p><strong>標準答案</strong>：(A) 不可以（No），總利用率 93.75% > 82.84%，甘特圖顯示 P2 需至 t=85 才完成，違反 t=80 截止時間；(B) 可以（Yes），EDF 充要條件為利用率 <= 1.0，本系統 93.75% <= 100% 保證可完美排程。</p>"
  },
  {
    "id": "110-6",
    "year": "110",
    "number": "第六題",
    "score": "10 分",
    "chapter": "CH2/CH6",
    "chapterName": "CH2/CH6 處理序同步（Peterson's Algorithm）",
    "type": "程式填空題",
    "title": "Peterson 演算法雙行程臨界區間程式碼填空",
    "questionHtml": "<p><strong>六、(10%) To use Peterson's solution to solve the critical-section problem between two processes Pi and Pj, please fill the blank (a), (b), (c), (d) and (e) in structure of Pi in Program 1.</strong></p>\n<pre style=\"background:var(--bg-secondary); padding:1rem; border-radius:6px; color:var(--text-light); font-family:Consolas, monospace;\">\ndo {\n    flag[i] = _(a)_ ;\n    turn = _(b)_ ;\n    while ( _(c)_ && _(d)_ );\n        critical section\n    flag[i] = _(e)_ ;\n        remainder section\n} while (true);\n</pre>",
    "hint": "flag[i] 表示 Pi 想進入；turn = j 表示主動禮讓對方；while 條件為對方想進且輪到對方時才忙碌等待；離開時重設 flag[i] = false。",
    "derivationHtml": "<div class=\"derivation-step\">\n  <h4>Peterson 演算法變數意義與互斥邏輯</h4>\n  <ul>\n    <li><code>boolean flag[2]</code>：意圖旗標。當行程 $P_i$ 欲進入臨界區間時，先設置 <code>flag[i] = true</code>，離開時重設為 <code>false</code>。</li>\n    <li><code>int turn</code>：禮讓指針。$P_i$ 主動宣告 <code>turn = j</code>，表示優先禮讓對方進入。</li>\n    <li><strong>自旋等待判定</strong>：<code>while (flag[j] && turn == j);</code>。唯有當對方「也想進入（flag[j]==true）」且「輪到對方（turn==j）」時，$P_i$ 才會在迴圈自旋等待；一旦對方離開或將 turn 設回 i，$P_i$ 即可推進至臨界區間。</li>\n  </ul>\n</div>",
    "answerHtml": "<p><strong>標準答案</strong>：(a) <code>true</code>、(b) <code>j</code>、(c) <code>flag[j]</code>（可與 d 對調）、(d) <code>turn == j</code>（可與 c 對調）、(e) <code>false</code>。</p>"
  },
  {
    "id": "111-3",
    "year": "111",
    "number": "第 3 題",
    "score": "5 分",
    "chapter": "CH5",
    "chapterName": "CH5 死結偵測演算法",
    "type": "計算推導大題",
    "title": "多重實例資源死結偵測演算法逐步矩陣推導",
    "questionHtml": "<p><strong>3. (5%) 假設一系統包含有四種硬體資源 A、B、C、D，現有五個行程(process) P1、P2、P3、P4、P5 在此系統中，假設系統目前資源分配狀態如下：</strong></p>\n<table class=\"data-table\" style=\"width:100%; margin:0.5rem 0;\">\n  <thead>\n    <tr><th>Process</th><th>Allocation (A B C D)</th><th>Request (A B C D)</th><th>Available (A B C D)</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>P1</td><td>1 0 0 1</td><td>1 0 0 1</td><td rowspan=\"5\" style=\"vertical-align:middle; font-weight:bold; color:var(--primary);\">1 1 0 1</td></tr>\n    <tr><td>P2</td><td>1 1 1 1</td><td>0 1 1 1</td></tr>\n    <tr><td>P3</td><td>1 1 0 1</td><td>1 0 1 0</td></tr>\n    <tr><td>P4</td><td>1 1 0 0</td><td>1 1 0 1</td></tr>\n    <tr><td>P5</td><td>1 1 1 1</td><td>0 1 1 0</td></tr>\n  </tbody>\n</table>\n<p>(a) 請問每種硬體資源分別有多少實體(instance)？<br>\n(b) 請解釋此系統目前是否存在死結(deadlock)？如有死結，是哪幾個行程所造成？</p>",
    "hint": "實體總數 = Available + 總 Allocation；死結偵測令 Work = Available，尋找 Request <= Work 者釋放資源，最後檢驗無法完成之行程集合。",
    "derivationHtml": "<div class=\"derivation-step\">\n  <h4>(a) 計算每種硬體資源實體總數（Total Instances）</h4>\n  <ul>\n    <li>公式：$\\text{Total} = \\text{Available} + \\sum_{i=1}^5 \\text{Allocation}_i$</li>\n    <li>配置加總：\n      <ul>\n        <li>A: $1 + 1 + 1 + 1 + 1 = 5$</li>\n        <li>B: $0 + 1 + 1 + 1 + 1 = 4$</li>\n        <li>C: $0 + 1 + 0 + 0 + 1 = 2$</li>\n        <li>D: $1 + 1 + 1 + 0 + 1 = 4$</li>\n      </ul>\n    </li>\n    <li>加回 Available = (1, 1, 0, 1)：\n      <ul>\n        <li><strong>A 實體數</strong> = 5 + 1 = <strong>6</strong></li>\n        <li><strong>B 實體數</strong> = 4 + 1 = <strong>5</strong></li>\n        <li><strong>C 實體數</strong> = 2 + 0 = <strong>2</strong></li>\n        <li><strong>D 實體數</strong> = 4 + 1 = <strong>5</strong></li>\n      </ul>\n    </li>\n  </ul>\n</div>\n<div class=\"derivation-step\">\n  <h4>(b) 死結偵測演算法推導歷程</h4>\n  <ol>\n    <li>初始化：$\\text{Work} = \\text{Available} = (1, 1, 0, 1)$，Finish 全為 False。</li>\n    <li>步驟 1：檢驗 P1 之 Request_1 (1, 0, 0, 1) &le; Work (1, 1, 0, 1) &rarr; 滿足！P1 釋放資源：\n      $$\\text{Work} = (1, 1, 0, 1) + (1, 0, 0, 1) = \\mathbf{(2, 1, 0, 2)}, \\quad \\text{Finish}[1] = \\text{True}$$\n    </li>\n    <li>步驟 2：比對剩餘行程之 Request：\n      <ul>\n        <li>P2 需 C=1（Work_C=0，跳過）</li>\n        <li>P3 需 C=1（Work_C=0，跳過）</li>\n        <li>P4: Request_4 (1, 1, 0, 1) &le; Work (2, 1, 0, 2) &rarr; 滿足！P4 釋放資源：\n          $$\\text{Work} = (2, 1, 0, 2) + (1, 1, 0, 0) = \\mathbf{(3, 2, 0, 2)}, \\quad \\text{Finish}[4] = \\text{True}$$\n        </li>\n      </ul>\n    </li>\n    <li>步驟 3：比對剩餘未完成行程 P2, P3, P5：\n      <ul>\n        <li>P2: Request_2 = (0, 1, 1, 1)，需 C=1（無法滿足）</li>\n        <li>P3: Request_3 = (1, 0, 1, 0)，需 C=1（無法滿足）</li>\n        <li>P5: Request_5 = (0, 1, 1, 0)，需 C=1（無法滿足）</li>\n      </ul>\n    </li>\n    <li><strong>推導結尾</strong>：系統中已無任何行程可釋放資源，但 P2、P3、P5 均等待資源 C 而卡死。</li>\n  </ol>\n</div>",
    "answerHtml": "<p><strong>標準答案</strong>：(a) A 資源有 6 個、B 資源有 5 個、C 資源有 2 個、D 資源有 5 個；(b) 系統「存在死結（Deadlock exists）」，陷入死結的行程為 <strong>P2、P3、P5</strong>。</p>"
  },
  {
    "id": "113-4",
    "year": "113",
    "number": "第 4 題",
    "score": "5 分",
    "chapter": "CH2/CH4",
    "chapterName": "CH2/CH4 行程建立與執行緒模型",
    "type": "計算推導題",
    "title": "fork() 與 thread_create() 行程與執行緒計數推導",
    "questionHtml": "<p><strong>4. (5%) 考慮一程式碼區段：</strong></p>\n<pre style=\"background:var(--bg-secondary); padding:1rem; border-radius:6px; color:var(--text-light); font-family:Consolas, monospace;\">\npid_t pid;\npid = fork();\nif (pid == 0) { /* child process */\n    fork();\n    thread_create( ... );\n}\nfork();\n</pre>\n<p>甲、請問會產生多少個獨立的行程(process)？(2%)<br>\n乙、請問會產生多少個獨立的執行緒(thread)？(3%)</p>",
    "hint": "畫出行程分裂樹；注意 if 區塊僅 child process (pid==0) 會進入；在 POSIX 規格中，多執行緒行程呼叫 fork() 時子行程僅複製呼叫端單一執行緒。",
    "derivationHtml": "<div class=\"derivation-step\">\n  <h4>甲、行程（Process）數量推導</h4>\n  <ol>\n    <li>起始：存在 1 個初始父行程 P0。</li>\n    <li><code>pid = fork();</code>：P0 分裂產生 P1。目前有 2 個行程（P0 父行程 pid>0，P1 子行程 pid==0）。</li>\n    <li><code>if (pid == 0)</code>：只有 P1 進入。P1 執行內部 <code>fork()</code> 產生 P2。此時系統共有 3 個行程（P0, P1, P2）。</li>\n    <li>末尾 <code>fork();</code>：現存的 3 個行程各自分裂一次，行程數量翻倍：$3 \\times 2 = 6$ 個行程。</li>\n    <li><strong>答案甲</strong>：共產生 <strong>6 個</strong> 獨立行程（若問新建立者為 5 個）。</li>\n  </ol>\n</div>\n<div class=\"derivation-step\">\n  <h4>乙、執行緒（Thread）數量推導</h4>\n  <ol>\n    <li>在 if 區塊內，P1 與 P2 各自呼叫一次 <code>thread_create(...)</code>，各建立 1 個新執行緒。離開 if 區塊時：\n      <ul>\n        <li>P0：1 個主執行緒</li>\n        <li>P1：1 主執行緒 + 1 新執行緒 = 2 執行緒</li>\n        <li>P2：1 主執行緒 + 1 新執行緒 = 2 執行緒</li>\n      </ul>\n    </li>\n    <li>執行末尾 <code>fork()</code> 時，依據 POSIX 規範，子行程僅繼承執行 fork 的該單一執行緒：\n      <ul>\n        <li>P0（1 執行緒）fork 產生 P0'（1 執行緒）</li>\n        <li>P1（2 執行緒）fork 產生 P1'（1 執行緒）</li>\n        <li>P2（2 執行緒）fork 產生 P2'（1 執行緒）</li>\n      </ul>\n    </li>\n    <li>全系統執行緒總數：$1(P_0) + 1(P_0') + 2(P_1) + 1(P_1') + 2(P_2) + 1(P_2') = 8$ 個。</li>\n    <li><strong>答案乙</strong>：共產生 <strong>8 個</strong> 獨立執行緒（若按簡化模型假設子行程複製所有執行緒則為 10 個，標準 POSIX 為 8 個）。</li>\n  </ol>\n</div>",
    "answerHtml": "<p><strong>標準答案</strong>：甲、產生 <strong>6 個</strong> 獨立行程；乙、標準 POSIX 下產生 <strong>8 個</strong> 獨立執行緒（抽象模型為 10 個）。</p>"
  },
  {
    "id": "114-12",
    "year": "114",
    "number": "第 12 題",
    "score": "2 分",
    "chapter": "CH3",
    "chapterName": "CH3 CPU 排程",
    "type": "單選題",
    "title": "多層佇列 vs. 多層反饋佇列核心差異",
    "questionHtml": "<p><strong>12. What is the main difference between the \"Multilevel Queue\" and \"Multilevel Feedback Queue\" scheduling algorithms?</strong><br>\n(A) process migration among queues<br>\n(B) number of queues<br>\n(C) time quantum<br>\n(D) level definition<br>\n(E) size of queue</p>",
    "hint": "Multilevel Queue 的行程永久固定於單一佇列；Multilevel Feedback Queue 允許行程依行為特徵在不同佇列間移動（Migration）。",
    "derivationHtml": "<div class=\"derivation-step\">\n  <h4>選項與觀念對比</h4>\n  <ul>\n    <li><strong>(A) 正確</strong>：Multilevel Queue 行程進入時即被永久指定佇列（不允許遷移）；Multilevel Feedback Queue（MLFQ）則明確允許行程在佇列間動態遷移（Process migration among queues），如 CPU-bound 行程降級、老化機制（Aging）升級。</li>\n    <li>(B)(C)(D)(E) 均為兩者皆可具備之組態參數，非本質區別。</li>\n  </ul>\n</div>",
    "answerHtml": "<p><strong>標準答案</strong>：<strong>(A) process migration among queues</strong></p>"
  },
  {
    "id": "114-14",
    "year": "114",
    "number": "第 14 題",
    "score": "2 分",
    "chapter": "CH2",
    "chapterName": "CH2 行程管理",
    "type": "單選題",
    "title": "巢狀 fork() 與 printf 輸出次數執行追蹤",
    "questionHtml": "<p><strong>14. How many times does the following program print hello?</strong></p>\n<pre style=\"background:var(--bg-secondary); padding:1rem; border-radius:6px; color:var(--text-light); font-family:Consolas, monospace;\">\n#include &lt;stdio.h&gt;\n#include &lt;unistd.h&gt;\nmain () {\n    if ( fork () == 0)\n        printf(\"hello\\n\");\n    else if ( fork () == 0)\n        printf(\"hello\\n\");\n    printf(\"hello\\n\");\n}\n</pre>\n<p>(A) 2  (B) 3  (C) 4  (D) 5  (E) 6</p>",
    "hint": "父行程若第一個 fork() 回傳非 0 才會進入 else if 執行第二個 fork()；各子行程與父行程執行末尾 printf 的次數加總。",
    "derivationHtml": "<div class=\"derivation-step\">\n  <h4>執行流程精細追蹤</h4>\n  <ol>\n    <li>設初始行程為 $P_0$。執行 <code>if (fork() == 0)</code> 分裂出子行程 $C_1$。</li>\n    <li>對於 $C_1$（回傳 0）：進入 if 內部印出第 1 次，跳過 else if，執行末尾 printf 印出第 2 次。<strong>($C_1$ 累計 2 次)</strong></li>\n    <li>對於 $P_0$（回傳非 0）：進入 <code>else if (fork() == 0)</code>，呼叫第二個 fork 分裂出 $C_2$。</li>\n    <li>對於 $C_2$（回傳 0）：進入 else if 內部印出第 3 次，執行末尾 printf 印出第 4 次。<strong>($C_2$ 累計 2 次)</strong></li>\n    <li>對於 $P_0$（回傳非 0）：跳出 else if，執行末尾 printf 印出第 5 次。<strong>($P_0$ 累計 1 次)</strong></li>\n    <li>總印出次數：$2 + 2 + 1 = 5$ 次。</li>\n  </ol>\n</div>",
    "answerHtml": "<p><strong>標準答案</strong>：<strong>(D) 5</strong></p>"
  },
  {
    "id": "114-29",
    "year": "114",
    "number": "第 29 題",
    "score": "2 分",
    "chapter": "CH2",
    "chapterName": "CH2 行程結構（PCB）",
    "type": "複選題",
    "title": "行程控制表（PCB）收錄資訊欄位",
    "questionHtml": "<p><strong>29. Which following information is stored in process control block (PCB) of a process? (複選)</strong><br>\n(A) scheduling information<br>\n(B) accounting information<br>\n(C) inter communication information<br>\n(D) I/O status information<br>\n(E) process state information</p>",
    "hint": "恐龍本 CH3 行程管理中，PCB 包含 Process state, Program counter, CPU registers, CPU scheduling, Memory-management, Accounting, I/O status 及 IPC 旗標。",
    "derivationHtml": "<div class=\"derivation-step\">\n  <h4>PCB 資料結構欄位檢視</h4>\n  <ul>\n    <li>(A) <strong>scheduling information</strong>：正確。紀錄優先權、排程指標。</li>\n    <li>(B) <strong>accounting information</strong>：正確。紀錄 CPU 使用時間、帳號與限制。</li>\n    <li>(C) <strong>inter communication information</strong>：正確。紀錄 IPC 旗標、訊號與訊息指標。</li>\n    <li>(D) <strong>I/O status information</strong>：正確。紀錄開啟檔案清單與 I/O 設備。</li>\n    <li>(E) <strong>process state information</strong>：正確。紀錄當前狀態（New, Ready, Running...）。</li>\n  </ul>\n</div>",
    "answerHtml": "<p><strong>標準答案</strong>：<strong>(A), (B), (C), (D), (E)（全選）</strong></p>"
  },
  {
    "id": "114-31",
    "year": "114",
    "number": "第 31 題",
    "score": "2 分",
    "chapter": "CH2/CH6",
    "chapterName": "CH2/CH6 處理序同步",
    "type": "複選題",
    "title": "臨界區間問題（Critical-Section Problem）三大要件",
    "questionHtml": "<p><strong>31. A solution to the critical-section problem must satisfy which requirements? (複選)</strong><br>\n(A) mutual exclusion<br>\n(B) circular wait<br>\n(C) progress<br>\n(D) no preemption<br>\n(E) bounded waiting</p>",
    "hint": "臨界區間解法三大公理：互斥（Mutual Exclusion）、進展（Progress）、有限等待（Bounded Waiting）。(B)(D) 為死結條件。",
    "derivationHtml": "<div class=\"derivation-step\">\n  <h4>三大準則解析</h4>\n  <ul>\n    <li>(A) <strong>Mutual Exclusion</strong>：確保任一時刻最多只有一個行程在臨界區間執行。</li>\n    <li>(C) <strong>Progress</strong>：無人執行時，僅不在剩餘區間的行程參與決定下一個進入者，決策不延遲。</li>\n    <li>(E) <strong>Bounded Waiting</strong>：請求進入後，其他行程獲准進入次數有上限，保證不飢餓。</li>\n    <li><em>(B) Circular wait 與 (D) No preemption 為死結之必要條件，非臨界區間解法要件。</em></li>\n  </ul>\n</div>",
    "answerHtml": "<p><strong>標準答案</strong>：<strong>(A), (C), (E)</strong></p>"
  },
  {
    "id": "114-33",
    "year": "114",
    "number": "第 33 題",
    "score": "2 分",
    "chapter": "CH5",
    "chapterName": "CH5 死結與活結",
    "type": "複選題",
    "title": "死結與活結特性分析及防範手段",
    "questionHtml": "<p><strong>33. What are the correct descriptions of deadlock and livelock? (複選)</strong><br>\n(A) Processes in deadlock can not proceed until the other processes releases the resource<br>\n(B) A livelock exists if the processes are changing their state infrequently and proceeding ineffectively.<br>\n(C) Processes in livelock constantly change their state in response to each other, but none of them can make any progress<br>\n(D) One way to prevent a deadlock is to use a resource ordering protocol for assigning a unique priority to each resource<br>\n(E) One way to detect a livelock is to monitor and reorder the states of the processes over time</p>",
    "hint": "死結行程處於 Waiting 狀態；活結行程處於頻繁（constantly）狀態變更卻無進展狀態；破壞循環等待可透過資源全序（Resource ordering）。",
    "derivationHtml": "<div class=\"derivation-step\">\n  <h4>選項正誤逐一辨析</h4>\n  <ul>\n    <li>(A) <strong>正確</strong>：死結行程卡死於資源等待，無人釋放則永久無法前進。</li>\n    <li>(B) <strong>錯誤</strong>：活結行程並非 infrequently 變更狀態，而是「極度頻繁（constantly）」變換。</li>\n    <li>(C) <strong>正確</strong>：活結標準定義為行程不斷對彼此狀態做出反應改變狀態，但無實質進展。</li>\n    <li>(D) <strong>正確</strong>：破壞循環等待的經典手段即為資源全序協議（Resource Ordering Protocol）。</li>\n    <li>(E) <strong>錯誤</strong>：活結行程 CPU 利用率活躍，難以由簡易狀態監控重排進行偵測。</li>\n  </ul>\n</div>",
    "answerHtml": "<p><strong>標準答案</strong>：<strong>(A), (C), (D)</strong></p>"
  },
  {
    "id": "115-21",
    "year": "115",
    "number": "第 21 題",
    "score": "2 分",
    "chapter": "CH5",
    "chapterName": "CH5 死結策略與代價",
    "type": "複選題",
    "title": "死結避免、活結代價與系統吞吐量全維度判斷",
    "questionHtml": "<p><strong>21. Which following statements are correct about deadlock and livelock? (複選)</strong><br>\n(A) Breaking the hold-and-wait condition could prevent deadlock, but may lead to livelock.<br>\n(B) The Banker's Algorithm could prevent livelock directly.<br>\n(C) Enforcing a strict resource ordering policy could reduce the risk of both deadlock and livelock occurrence.<br>\n(D) Aggressive deadlock avoidance strategies may reduce overall system throughput.<br>\n(E) Livelock is generally easier to detect than deadlock through system monitoring tools in OS.</p>",
    "hint": "打破 Hold-and-wait 若反覆重試可能震盪造成活結；銀行家演算法針對死結避免而非活結；過度保守避免會壓低吞吐量；活結遠比死結難偵測。",
    "derivationHtml": "<div class=\"derivation-step\">\n  <h4>選項正誤深度分析</h4>\n  <ul>\n    <li>(A) <strong>正確</strong>：釋放所有資源再重試可能導致多個行程同步釋放又爭搶，陷入活結震盪。</li>\n    <li>(B) <strong>錯誤</strong>：銀行家演算法專攻死結避免（安全性矩陣），無法防範行程邏輯的活結。</li>\n    <li>(C) <strong>正確</strong>：嚴格資源排序強制單向申請，徹底消除循環等待，並平息交叉讓步活結。</li>\n    <li>(D) <strong>正確</strong>：過度保守的避免策略推遲大量安全請求，造成資源閒置降低吞吐量。</li>\n    <li>(E) <strong>錯誤</strong>：活結行程處於運算態，OS 監控工具難以識別，故活結遠比死結更難偵測。</li>\n  </ul>\n</div>",
    "answerHtml": "<p><strong>標準答案</strong>：<strong>(A), (C), (D)</strong></p>"
  },
  {
    "id": "115-22",
    "year": "115",
    "number": "第 22 題",
    "score": "2 分",
    "chapter": "CH2/CH6",
    "chapterName": "CH2/CH6 處理序同步之硬體支援",
    "type": "複選題",
    "title": "硬體同步機制（關閉中斷、Test-and-Set、CAS）與互斥保證",
    "questionHtml": "<p><strong>22. Regarding hardware-based solutions to the Critical-Section Problem, which of the following statements are correct? (複選)</strong><br>\n(A) Hardware atomic instructions eliminate busy waiting.<br>\n(B) Disabling interrupts is suitable for multiprocessor systems.<br>\n(C) Disabling interrupts guarantees mutual exclusion on a uniprocessor system.<br>\n(D) Test-and-Set instructions can be used to implement spinlocks.<br>\n(E) Compare-and-Swap (CAS) can be used to build mutual exclusion primitives.</p>",
    "hint": "硬體原子指令建構自旋鎖仍有 busy waiting；多處理器關中斷開銷過大不可行；單處理器關中斷保證互斥；Test-and-Set 與 CAS 為標準同步原語。",
    "derivationHtml": "<div class=\"derivation-step\">\n  <h4>硬體同步機制深度辨析</h4>\n  <ul>\n    <li>(A) <strong>錯誤</strong>：原子指令實作自旋鎖（Spinlock）時，等待者仍處於 while 迴圈忙碌等待。</li>\n    <li>(B) <strong>錯誤</strong>：多處理器架構跨核心發送中斷遮罩開銷過大，破壞並行性，不合適。</li>\n    <li>(C) <strong>正確</strong>：單處理器關閉中斷後不會發生時鐘中斷與上下文切換，保證互斥。</li>\n    <li>(D) <strong>正確</strong>：test_and_set 為構建自旋鎖（Spinlock）之最經典硬體原子指令。</li>\n    <li>(E) <strong>正確</strong>：CAS（如 x86 CMPXCHG）為現代 OS 構建 Mutex 與 Lock-free 結構的核心原語。</li>\n  </ul>\n</div>",
    "answerHtml": "<p><strong>標準答案</strong>：<strong>(C), (D), (E)</strong></p>"
  },
  {
    "id": "115-25",
    "year": "115",
    "number": "第 25 題",
    "score": "2 分",
    "chapter": "CH3",
    "chapterName": "CH3 即時 CPU 排程",
    "type": "複選題",
    "title": "即時 CPU 排程（RMS 週期優先權、EDF 100% 利用率與軟硬即時）",
    "questionHtml": "<p><strong>25. Which of the following statements about Real-Time CPU Scheduling are correct? (複選)</strong><br>\n(A) Hard real-time systems cannot tolerate missed deadlines.<br>\n(B) Rate Monotonic Scheduling assigns priority based on period length.<br>\n(C) Soft real-time systems guarantee deadlines.<br>\n(D) Earliest Deadline First Scheduling dynamically adjusts priorities.<br>\n(E) Earliest Deadline First Scheduling could theoretically achieve 100% CPU utilization.</p>",
    "hint": "Hard real-time 絕不可錯過 deadline；RMS 為靜態週期優先權；Soft real-time 不保證 deadline；EDF 為動態絕對截止時間優先且理論利用率可達 100%。",
    "derivationHtml": "<div class=\"derivation-step\">\n  <h4>選項正誤剖析</h4>\n  <ul>\n    <li>(A) <strong>正確</strong>：硬即時系統逾時即全域失效（如醫療、飛控），不可容忍錯過。</li>\n    <li>(B) <strong>正確</strong>：RMS 採靜態優先權，週期越短優先權越高。</li>\n    <li>(C) <strong>錯誤</strong>：軟即時系統僅提供盡力保證（Best effort），不保證絕對不違約。</li>\n    <li>(D) <strong>正確</strong>：EDF 依當前最近之絕對截止時間動態調整優先權。</li>\n    <li>(E) <strong>正確</strong>：理論上只要週期任務利用率 &le; 100%，EDF 保證可滿足所有截止時間。</li>\n  </ul>\n</div>",
    "answerHtml": "<p><strong>標準答案</strong>：<strong>(A), (B), (D), (E)</strong></p>"
  },
  {
    "id": "115-27",
    "year": "115",
    "number": "第 27 題",
    "score": "2 分",
    "chapter": "CH2/CH4",
    "chapterName": "CH2/CH4 行程與多執行緒架構",
    "type": "複選題",
    "title": "行程與執行緒同步、記憶體共享與 IPC 開銷",
    "questionHtml": "<p><strong>27. To tackle the synchronization and communication of processes and threads, which of the following statements are correct? (複選)</strong><br>\n(A) Different processes could directly share each other's local (stack) variables by default.<br>\n(B) Threads within the same process could communicate through shared memory.<br>\n(C) Mutexes and semaphores could be used for thread synchronization.<br>\n(D) Inter-process communication (IPC) usually has higher overhead than communication between threads within the same process.<br>\n(E) Threads within the same process will not cause race conditions.</p>",
    "hint": "行程間位址空間隔離，不可預設共用堆疊；同一行程執行緒共用 Data 與 Heap，可走共享記憶體；IPC 涉及核心切換開銷大；多執行緒同時存取會引發競態條件。",
    "derivationHtml": "<div class=\"derivation-step\">\n  <h4>選項正誤深入剖析</h4>\n  <ul>\n    <li>(A) <strong>錯誤</strong>：不同行程定址空間相互隔離保護，無法直接存取對方的 Stack 區域變數。</li>\n    <li>(B) <strong>正確</strong>：同一行程之執行緒共享 Data 段與 Heap 段，可直接透過共享記憶體通訊。</li>\n    <li>(C) <strong>正確</strong>：Mutexes 與 Semaphores 是協調多執行緒同步之經典原語。</li>\n    <li>(D) <strong>正確</strong>：IPC 涉及核心模式切換與記憶體資料複製，開銷遠大於同行程執行緒記憶體讀寫。</li>\n    <li>(E) <strong>錯誤</strong>：正因執行緒共享記憶體，缺乏同步時極易引發競態條件（Race Conditions）。</li>\n  </ul>\n</div>",
    "answerHtml": "<p><strong>標準答案</strong>：<strong>(B), (C), (D)</strong></p>"
  }
],
  matrix: [
  [
    "105",
    "第 2 題",
    "快取記憶體概念與寫入策略 (Write policy)",
    "OS / 計算機架構",
    "是",
    "符合",
    "CH1 快取與儲存階層 (詳解)"
  ],
  [
    "106",
    "第 2 題",
    "單核心架構 vs. 微核心架構 (Kernel)",
    "作業系統核心",
    "是",
    "符合",
    "CH1/CH2 系統結構 (詳解)"
  ],
  [
    "107",
    "第 2 題",
    "存取控制機制 (ACL vs. Capability)",
    "作業系統防護",
    "是",
    "超出",
    "CH17 保護安全 (期末範圍)"
  ],
  [
    "107",
    "第 3 題",
    "雲端虛擬化 (Hypervisor vs. Container)",
    "作業系統虛擬化",
    "是",
    "超出",
    "CH18 虛擬化技術 (期末範圍)"
  ],
  [
    "108",
    "第 7 題",
    "銀行家演算法安全狀態與 Request 判定",
    "作業系統死結",
    "是",
    "符合",
    "CH5 死結避免 (詳解)"
  ],
  [
    "108",
    "第 8 題",
    "TLB 命中率與單/雙階層分頁表 EAT 計算",
    "記憶體管理",
    "是",
    "超出",
    "CH9 記憶體分頁 (期末範圍)"
  ],
  [
    "108",
    "第 9 題",
    "邏輯位址空間與實體位址位元數推算",
    "記憶體管理",
    "是",
    "超出",
    "CH8 主記憶體 (期末範圍)"
  ],
  [
    "108",
    "第 10 題",
    "二維陣列迴圈走訪之 LRU 分頁錯誤推算",
    "虛擬記憶體",
    "是",
    "超出",
    "CH10 虛擬記憶體 (期末範圍)"
  ],
  [
    "109",
    "第五題",
    "行程五狀態轉換模型 (Process State)",
    "行程管理",
    "是",
    "符合",
    "CH2 行程概念 (詳解)"
  ],
  [
    "109",
    "第六題",
    "死結發生四大必要條件 (Deadlock)",
    "作業系統死結",
    "是",
    "符合",
    "CH5 死結特性 (詳解)"
  ],
  [
    "109",
    "第七題",
    "Belady 異常現象與 FIFO 分頁置換",
    "虛擬記憶體",
    "是",
    "超出",
    "CH10 虛擬記憶體 (期末範圍)"
  ],
  [
    "109",
    "第八題",
    "即時 CPU 排程 (RMS 與 EDF 充足性判定)",
    "CPU 排程",
    "是",
    "符合",
    "CH3 即時排程 (詳解)"
  ],
  [
    "109",
    "第九題",
    "單階層與三階層分頁表 EAT 數值計算",
    "記憶體管理",
    "是",
    "超出",
    "CH9 記憶體分頁 (期末範圍)"
  ],
  [
    "110",
    "第六題",
    "Peterson 演算法雙行程臨界區間程式填空",
    "處理序同步",
    "是",
    "符合",
    "CH2/CH6 考點七同步 (詳解)"
  ],
  [
    "110",
    "第七題",
    "核心記憶體配置策略 (Buddy vs. Slab)",
    "核心記憶體",
    "是",
    "超出",
    "CH9 核心記憶體 (期末範圍)"
  ],
  [
    "110",
    "第八題",
    "TLB 觸及範圍 (TLB Reach) 項目數推算",
    "記憶體管理",
    "是",
    "超出",
    "CH9 記憶體架構 (期末範圍)"
  ],
  [
    "111",
    "第 2 題",
    "Linux 檔案屬性解讀與 chmod 755 變更",
    "Linux / 檔案權限",
    "是",
    "超出",
    "CH13 檔案系統 (系統維運)"
  ],
  [
    "111",
    "第 3 題",
    "多重實例資源死結偵測演算法推導",
    "作業系統死結",
    "是",
    "符合",
    "CH5 死結偵測 (詳解)"
  ],
  [
    "112",
    "第 1 題",
    "Linux crontab 定期排程備份指令設定",
    "Linux 系統管理",
    "廣義",
    "超出",
    "系統維運操作 (超出範圍)"
  ],
  [
    "112",
    "第 3 題",
    "64 位元電腦 32-bit 行程之分頁表大小 Byte",
    "記憶體管理",
    "是",
    "超出",
    "CH8 分頁架構 (期末範圍)"
  ],
  [
    "113",
    "第 3 題",
    "TLB Reach、實體位址空間與三階層 EAT",
    "記憶體管理",
    "是",
    "超出",
    "CH9 記憶體分頁 (期末範圍)"
  ],
  [
    "113",
    "第 4 題",
    "fork() 與 thread_create() 行程與執行緒計數",
    "行程與多執行緒",
    "是",
    "符合",
    "CH2/CH4 考點七 (詳解)"
  ],
  [
    "114",
    "第 11 題",
    "位元定址分頁系統頁數與實體位址位元",
    "記憶體管理",
    "是",
    "超出",
    "CH8 主記憶體 (期末範圍)"
  ],
  [
    "114",
    "第 12 題",
    "多層佇列 vs. 多層反饋佇列核心差異",
    "CPU 排程",
    "是",
    "符合",
    "CH3 CPU 排程 (詳解)"
  ],
  [
    "114",
    "第 13 題",
    "磁碟排程 C-SCAN 與 C-LOOK 移動距離",
    "次級儲存",
    "是",
    "超出",
    "CH11 磁碟排程 (期末範圍)"
  ],
  [
    "114",
    "第 14 題",
    "巢狀 fork() 與 printf 輸出次數執行追蹤",
    "行程管理",
    "是",
    "符合",
    "CH2 行程建立 (詳解)"
  ],
  [
    "114",
    "第 15 題",
    "6 顆硬碟 RAID 最小有效資料量評估",
    "次級儲存",
    "是",
    "超出",
    "CH11 磁碟陣列 (期末範圍)"
  ],
  [
    "114",
    "第 17 題",
    "作業系統開啟檔案內部表格維護機制",
    "檔案系統",
    "是",
    "超出",
    "CH13 檔案系統 (期末範圍)"
  ],
  [
    "114",
    "第 29 題",
    "行程控制表 (PCB) 收錄內部欄位資訊",
    "行程管理",
    "是",
    "符合",
    "CH2 行程結構 (詳解)"
  ],
  [
    "114",
    "第 30 題",
    "虛擬記憶體策略之系統優勢研判",
    "虛擬記憶體",
    "是",
    "超出",
    "CH10 虛擬記憶體 (期末範圍)"
  ],
  [
    "114",
    "第 31 題",
    "臨界區間問題三大必要滿足準則",
    "處理序同步",
    "是",
    "符合",
    "CH2/CH6 考點七 (詳解)"
  ],
  [
    "114",
    "第 33 題",
    "死結與活結特性、資源排序防範手段",
    "作業系統死結",
    "是",
    "符合",
    "CH5 死結與活結 (詳解)"
  ],
  [
    "115",
    "第 21 題",
    "死結預防打破條件之活結風險與避免代價",
    "作業系統死結",
    "是",
    "符合",
    "CH5 死結策略 (詳解)"
  ],
  [
    "115",
    "第 22 題",
    "硬體原子指令、關閉中斷與自旋鎖",
    "處理序同步",
    "是",
    "符合",
    "CH2/CH6 考點七 (詳解)"
  ],
  [
    "115",
    "第 23 題",
    "連續配置、分頁與分段之內部碎裂問題",
    "記憶體管理",
    "是",
    "超出",
    "CH8 記憶體配置 (期末範圍)"
  ],
  [
    "115",
    "第 24 題",
    "RAID 0, 1, 5, 6, 0+1 等級特性辨析",
    "次級儲存",
    "是",
    "超出",
    "CH11 儲存架構 (期末範圍)"
  ],
  [
    "115",
    "第 25 題",
    "即時 CPU 排程 (RMS 週期優先權與 EDF 100%)",
    "CPU 排程",
    "是",
    "符合",
    "CH3 即時排程 (詳解)"
  ],
  [
    "115",
    "第 27 題",
    "行程與執行緒同步、記憶體共享與 IPC 開銷",
    "行程與多執行緒",
    "是",
    "符合",
    "CH2/CH4 核心 (詳解)"
  ],
  [
    "115",
    "第 28 題",
    "2TB 磁碟點陣圖 (Bitmap) 管理 Free Space",
    "檔案系統",
    "是",
    "超出",
    "CH14 檔案實作 (期末範圍)"
  ],
  [
    "115",
    "問答 1 題",
    "TLB 搭配雜湊分頁表 (Hashed Table) 架構與 EAT",
    "記憶體管理",
    "是",
    "超出",
    "CH9 分頁架構 (期末範圍)"
  ]
]
};

class NCUExamModule {
  constructor() {
    this.container = document.getElementById('tab-ncu-exam');
    this.currentYear = 'all';
    this.currentChapter = 'all';
    this.searchKeyword = '';
  }

  init() {
    if (!this.container) return;
    this.renderLayout();
    this.bindEvents();
    this.renderQuestions();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="page-header" style="flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 class="page-title">中央大學研究所歷年考題篩選暨期中範圍詳解</h1>
          <p class="page-subtitle">精選 105 ~ 115 學年度資管所 MA02 試題，深度篩選符合作業系統期中考（CH1 ~ CH5 及同步考點）之試題與完整推導</p>
        </div>
        <div class="btn-group">
          <a href="./中央大學研究所_作業系統歷年考題篩選與期中範圍詳解.docx" download="中央大學研究所_作業系統歷年考題篩選與期中範圍詳解.docx" class="btn btn-primary" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem; padding:0.6rem 1.25rem; font-weight:bold; box-shadow:0 4px 12px rgba(56,189,248,0.3);">
            <span>📥 下載精裝版 Word 手冊 (.docx)</span>
          </a>
        </div>
      </div>

      <!-- 下載引導橫幅 -->
      <div class="card" style="background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(36, 50, 72, 0.95)); border: 1px solid rgba(56, 189, 248, 0.4); margin-bottom: 1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div>
            <h3 style="color:var(--primary); font-size:1.15rem; margin-bottom:0.4rem;">📄 離線複習 Word 手冊已就緒</h3>
            <p style="color:var(--text-light); font-size:0.95rem; margin-bottom:0.5rem;">
              完整收錄 18 道期中核心試題演算歷程、甘特圖時間軸推演、銀行家演算法安全狀態推導、Peterson 程式碼填空與 11 年全真試卷分類總表。
            </p>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              <span class="badge" style="background:rgba(56,189,248,0.15); color:var(--primary);">18 道期中核心試題</span>
              <span class="badge" style="background:rgba(16,185,129,0.15); color:var(--accent-emerald);">105 ~ 115 年全量試題分類表</span>
              <span class="badge" style="background:rgba(245,158,11,0.15); color:var(--accent-amber);">恐龍本 10th CH1 ~ CH5 對齊</span>
              <span class="badge" style="background:rgba(99,102,241,0.15); color:var(--accent-indigo);">微軟正黑體專業排版</span>
            </div>
          </div>
          <a href="./中央大學研究所_作業系統歷年考題篩選與期中範圍詳解.docx" download="中央大學研究所_作業系統歷年考題篩選與期中範圍詳解.docx" class="btn btn-primary" style="text-decoration:none; padding:0.6rem 1.25rem;">
            下載 Word 檔 (.docx)
          </a>
        </div>
      </div>

      <!-- 篩選與搜尋列 -->
      <div class="card" style="margin-bottom: 1.5rem;">
        <div style="display:flex; flex-direction:column; gap:0.85rem;">
          <div>
            <span style="font-weight:bold; color:var(--text-light); margin-right:0.5rem; font-size:0.9rem;">年度篩選：</span>
            <div class="btn-group" id="ncu-year-filters" style="display:inline-flex; flex-wrap:wrap; gap:0.35rem;">
              <button class="btn btn-sm active" data-year="all">全部年度</button>
              <button class="btn btn-sm" data-year="105">105</button>
              <button class="btn btn-sm" data-year="106">106</button>
              <button class="btn btn-sm" data-year="108">108</button>
              <button class="btn btn-sm" data-year="109">109</button>
              <button class="btn btn-sm" data-year="110">110</button>
              <button class="btn btn-sm" data-year="111">111</button>
              <button class="btn btn-sm" data-year="113">113</button>
              <button class="btn btn-sm" data-year="114">114</button>
              <button class="btn btn-sm" data-year="115">115</button>
            </div>
          </div>

          <div>
            <span style="font-weight:bold; color:var(--text-light); margin-right:0.5rem; font-size:0.9rem;">單元分類：</span>
            <div class="btn-group" id="ncu-chapter-filters" style="display:inline-flex; flex-wrap:wrap; gap:0.35rem;">
              <button class="btn btn-sm active" data-chapter="all">全部單元</button>
              <button class="btn btn-sm" data-chapter="CH1">CH1 概論架構</button>
              <button class="btn btn-sm" data-chapter="CH2">CH2 行程與 IPC</button>
              <button class="btn btn-sm" data-chapter="CH3">CH3 CPU 排程</button>
              <button class="btn btn-sm" data-chapter="CH4">CH4 多執行緒</button>
              <button class="btn btn-sm" data-chapter="CH5">CH5 死結與活結</button>
              <button class="btn btn-sm" data-chapter="CH6">處理序同步考點</button>
            </div>
          </div>

          <div class="search-box-wrap" style="margin-top:0.25rem;">
            <input type="text" id="ncu-search-input" class="search-input" placeholder="搜尋關鍵字（例如：銀行家、fork、EDF、Peterson、死結、Cache、RMS）..." />
          </div>
        </div>
      </div>

      <!-- 試題列表區域 -->
      <div id="ncu-questions-container" style="display:flex; flex-direction:column; gap:1.25rem;"></div>

      <!-- 歷年全量分類矩陣折疊區 -->
      <div class="card" style="margin-top: 2rem;">
        <div class="card-title" style="cursor:pointer; display:flex; justify-content:space-between; align-items:center;" id="btn-toggle-matrix">
          <span>📊 105 ~ 115 學年度中央碩士班入學考題全量分類矩陣（點擊展開/收合）</span>
          <span id="matrix-toggle-icon" style="color:var(--primary); font-size:1.1rem;">▼</span>
        </div>
        <div id="matrix-container" style="display:none; margin-top:1rem; overflow-x:auto;">
          <table class="data-table" style="width:100%; font-size:0.9rem;">
            <thead>
              <tr>
                <th>學年度</th>
                <th>題號</th>
                <th>試題核心主題</th>
                <th>領域分類</th>
                <th>屬於 OS</th>
                <th>期中範圍</th>
                <th>章節與處置說明</th>
              </tr>
            </thead>
            <tbody id="matrix-tbody"></tbody>
          </table>
        </div>
      </div>
    `;

    // 渲染矩陣表格
    const tbody = document.getElementById('matrix-tbody');
    tbody.innerHTML = NCU_EXAM_DATA.matrix.map(row => `
      <tr>
        <td style="text-align:center; font-weight:bold;">${row[0]}</td>
        <td style="text-align:center;">${row[1]}</td>
        <td>${row[2]}</td>
        <td style="text-align:center;"><span class="badge" style="background:rgba(148,163,184,0.15);">${row[3]}</span></td>
        <td style="text-align:center;"><span class="badge" style="background:${row[4]==='是'?'rgba(16,185,129,0.2)':'rgba(244,63,94,0.2)'}; color:${row[4]==='是'?'#10b981':'#f43f5e'};">${row[4]}</span></td>
        <td style="text-align:center;"><span class="badge" style="background:${row[5]==='符合'?'rgba(56,189,248,0.2)':'rgba(148,163,184,0.2)'}; color:${row[5]==='符合'?'#38bdf8':'#94a3b8'};">${row[5]}</span></td>
        <td>${row[6]}</td>
      </tr>
    `).join('');
  }

  bindEvents() {
    // 年度篩選
    const yearBtns = document.querySelectorAll('#ncu-year-filters button');
    yearBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        yearBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentYear = btn.getAttribute('data-year');
        this.renderQuestions();
      });
    });

    // 章節篩選
    const chBtns = document.querySelectorAll('#ncu-chapter-filters button');
    chBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        chBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentChapter = btn.getAttribute('data-chapter');
        this.renderQuestions();
      });
    });

    // 搜尋輸入
    const searchInput = document.getElementById('ncu-search-input');
    searchInput?.addEventListener('input', (e) => {
      this.searchKeyword = e.target.value.trim().toLowerCase();
      this.renderQuestions();
    });

    // 矩陣展開/收合
    const toggleMatrixBtn = document.getElementById('btn-toggle-matrix');
    const matrixContainer = document.getElementById('matrix-container');
    const matrixIcon = document.getElementById('matrix-toggle-icon');
    toggleMatrixBtn?.addEventListener('click', () => {
      if (matrixContainer.style.display === 'none') {
        matrixContainer.style.display = 'block';
        matrixIcon.textContent = '▲';
      } else {
        matrixContainer.style.display = 'none';
        matrixIcon.textContent = '▼';
      }
    });
  }

  renderQuestions() {
    const container = document.getElementById('ncu-questions-container');
    if (!container) return;

    let filtered = NCU_EXAM_DATA.questions.filter(q => {
      // 年度過濾
      if (this.currentYear !== 'all' && q.year !== this.currentYear) return false;
      // 章節過濾
      if (this.currentChapter !== 'all') {
        if (!q.chapter.includes(this.currentChapter)) return false;
      }
      // 關鍵字搜尋
      if (this.searchKeyword) {
        const text = (q.year + ' ' + q.number + ' ' + q.title + ' ' + q.questionHtml + ' ' + q.hint + ' ' + q.answerHtml).toLowerCase();
        if (!text.includes(this.searchKeyword)) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="card" style="text-align:center; padding:2.5rem; color:var(--text-muted);">
          <p style="font-size:1.1rem; margin-bottom:0.5rem;">無符合篩選條件的試題</p>
          <p style="font-size:0.9rem;">請調整上方年度、單元分類或清空搜尋關鍵字。</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map((q) => `
      <div class="card" id="ncu-card-${q.id}" style="border-left: 4px solid var(--primary);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.75rem;">
          <div>
            <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap; margin-bottom:0.35rem;">
              <span class="badge" style="background:var(--primary); color:#0f172a; font-weight:bold;">${q.year} 學年度</span>
              <span class="badge" style="background:rgba(56,189,248,0.15); color:var(--primary);">${q.number}</span>
              <span class="badge" style="background:rgba(16,185,129,0.15); color:var(--accent-emerald);">${q.score}</span>
              <span class="badge" style="background:rgba(99,102,241,0.15); color:var(--accent-indigo);">${q.chapterName}</span>
              <span class="badge" style="background:rgba(245,158,11,0.15); color:var(--accent-amber);">${q.type}</span>
            </div>
            <h3 style="color:var(--text-main); font-size:1.15rem;">${q.title}</h3>
          </div>
          <button class="btn btn-sm btn-outline btn-toggle-sol" data-id="${q.id}">
            展開完整題解與推導 ▼
          </button>
        </div>

        <!-- 原始題目內容 -->
        <div class="alert-box" style="background:rgba(15,23,42,0.6); border:1px solid var(--border-color); color:var(--text-light); margin-bottom:0.75rem;">
          ${q.questionHtml}
        </div>

        <!-- 破題關鍵提示 -->
        <div style="font-size:0.9rem; color:var(--accent-cyan); margin-bottom:0.5rem;">
          <strong>💡 破題思維：</strong> ${q.hint}
        </div>

        <!-- 折疊之逐步演算與解答 -->
        <div class="solution-panel" id="sol-${q.id}" style="display:none; margin-top:1rem; border-top:1px dashed var(--border-color); padding-top:1rem;">
          <h4 style="color:var(--primary); font-size:1.05rem; margin-bottom:0.5rem;">📐 完整推導與演算步驟：</h4>
          <div style="line-height:1.6; color:var(--text-light); font-size:0.95rem;">
            ${q.derivationHtml}
          </div>

          <div class="alert-box" style="background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); color:#10b981; margin-top:1rem;">
            ${q.answerHtml}
          </div>
        </div>
      </div>
    `).join('');

    // 綁定解答折疊
    const solBtns = container.querySelectorAll('.btn-toggle-sol');
    solBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.getAttribute('data-id');
        const solPanel = document.getElementById(`sol-${qid}`);
        if (solPanel.style.display === 'none') {
          solPanel.style.display = 'block';
          btn.textContent = '收合詳細題解 ▲';
          btn.classList.add('btn-primary');
          btn.classList.remove('btn-outline');
          if (window.renderMathInElement) {
            window.renderMathInElement(solPanel, {
              delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false }
              ],
              throwOnError: false
            });
          }
        } else {
          solPanel.style.display = 'none';
          btn.textContent = '展開完整題解與推導 ▼';
          btn.classList.remove('btn-primary');
          btn.classList.add('btn-outline');
        }
      });
    });

    // 渲染數學公式
    if (window.renderMathInElement) {
      window.renderMathInElement(container, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    }
  }
}

// 實例化並全域掛載
window.NCUExamApp = new NCUExamModule();
document.addEventListener('DOMContentLoaded', () => {
  window.NCUExamApp.init();
});
