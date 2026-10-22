/**
 * 作業系統期中考複習系統 - 核心資料模組 (Data Module)
 * 支援動態擴充：可透過管理新增章節、單元、抽認卡、題庫與非選問答大題。
 */
const OS_DEFAULT_DATA = {
  "chapters": [
    {
      "id": "ch1",
      "title": "CH1 作業系統概論與系統架構",
      "examTips": "記憶體階層圖（必考填空）、Multiprogramming 核心精神、三種排程器差別（Long/Medium/Short-term）、DMA 與中斷機制、雙模式與 Trap、字組 Word 定義、Linux 核心資料結構搜尋複雜度",
      "sections": [
        {
          "id": "ch1-1",
          "title": "一、 作業系統的作用（What Operating Systems Do）",
          "summary": "作業系統是介於使用者與硬體之間的中介程式，具備資源分配者與控制程式雙重角色。",
          "items": [
            {
              "term": "系統三大目標",
              "desc": "執行使用者程式並讓問題更易解決；使電腦系統方便易用；高效率地利用硬體資源。"
            },
            {
              "term": "電腦系統四大組成元件",
              "desc": "1. 硬體（Hardware）：提供基本計算資源（CPU、記憶體、I/O 裝置）。\n2. 作業系統（Operating System）：控制並協調硬體資源在各應用程式與使用者之間的運用。\n3. 應用程式（Application Programs）：定義如何運用系統資源解決計算問題（文書處理器、編譯器、資料庫、瀏覽器等）。\n4. 使用者（Users）：包含人類、其他機器或電腦。"
            },
            {
              "term": "使用者觀點 vs. 電腦觀點",
              "desc": "使用者觀點（User View）：追求便利與易用性，通常不關注資源利用率；工作站著重個人效能；手持裝置受限於電源與硬體。\n電腦觀點（Computer View）：OS 是「資源分配者（Resource Allocator）」，在衝突請求中做出高效且公平的決定；同時也是「控制程式（Control Program）」，控制程式執行以防錯誤與不當存取。"
            },
            {
              "term": "核心（Kernel）與開機引導（Bootstrap Program）",
              "desc": "核心：電腦開機後唯一時刻都在執行的程式。其餘程式劃分為系統程式或應用程式。\n引導程式（Bootstrap Program）：儲存於 ROM 或 EPROM（韌體 Firmware / BIOS），負責初始化硬體（暫存器、裝置控制器、記憶體內容），並載入作業系統核心後開始執行。"
            }
          ]
        },
        {
          "id": "ch1-2",
          "title": "二、 電腦系統組織（Computer-System Organization）",
          "summary": "探討 CPU、匯流排、I/O 裝置控制器、中斷機制、直接記憶體存取（DMA）與儲存階層架構。",
          "items": [
            {
              "term": "系統架構與併行運作",
              "desc": "由一個或多個 CPU 與多個裝置控制器透過公共匯流排（Common Bus）連接共享記憶體。CPU 與裝置控制器可併行執行並競爭記憶體週期。"
            },
            {
              "term": "I/O 運作與中斷機制（Interrupt）",
              "desc": "各裝置控制器具備區域緩衝區（Local Buffer）。CPU 在主記憶體與區域緩衝區間搬移資料，I/O 操作則在裝置與緩衝區間進行。\n完成後由裝置控制器引發中斷通知 CPU。OS 儲存暫存器與程式計數器（PC），透過輪詢（Polling）或向量中斷（Vectored Interrupt）跳轉至對應中斷服務常式（ISR）處理。"
            },
            {
              "term": "直接記憶體存取（DMA, Direct Memory Access）",
              "desc": "專為傳輸速度接近主記憶體的高速 I/O 裝置設計。\n裝置控制器直接將整塊資料（Block）於緩衝區與主記憶體間傳輸，完全不需要 CPU 介入。\n顯著降低中斷頻率：每傳輸一個完整資料區塊（Block）才產生一次中斷，而非每個位元組（Byte）中斷一次，大幅釋放 CPU 運算資源。"
            },
            {
              "term": "儲存階層與快取（Storage Hierarchy & Caching）",
              "desc": "三大劃分指標：速度（Speed）、成本（Cost）、揮發性（Volatility）。\n金字塔由頂至底（速度最快至最慢、成本最高至最低、容量最小至最大）：\n1. Registers（暫存器）\n2. Cache（快取記憶體）\n3. Main memory（主記憶體）\n4. Solid-state disk（固態硬碟）\n5. Magnetic disk（傳統磁碟）\n6. Optical disk（光碟）\n7. Magnetic tapes（磁帶）\n快取原理：將暫時頻繁使用的資料從慢速區複製至快速區。存取時先檢查快取，命中則直接使用；未命中則載入快取。替換策略（Replacement Policy）是設計核心。"
            },
            {
              "term": "儲存單位與字組大小（Storage Units & Word Size）",
              "desc": "基本儲存單位為位元（Bit，0 或 1）；8 個位元構成一個位元組（Byte），為大多數位址定址的最小單位。\n字組（Word）為電腦架構之原生資料單位，由一個或多個位元組組成。例如 64 位元暫存器與 64 位元定址架構之電腦，其字組長度為 64 位元（即 8 個位元組，8-Byte Word）。電腦通常以原生字組大小執行運算，而非單一位元組逐一操作。"
            }
          ]
        },
        {
          "id": "ch1-3",
          "title": "三、 電腦系統架構（Computer-System Architecture）",
          "summary": "單處理器、多處理器系統（SMP、雙核心、NUMA）、刀鋒伺服器與叢集系統。",
          "items": [
            {
              "term": "多處理器系統三大優點",
              "desc": "1. 提高吞吐量（Increased Throughput）：在更短時間內完成更多運算。\n2. 規模經濟（Economy of Scale）：共享週邊、儲存設備與電源，成本低於多台獨立電腦。\n3. 提高可靠性（Increased Reliability）：支援優雅降級（Graceful Degradation）與容錯（Fault Tolerance），單一處理器損壞系統仍可維持運作。"
            },
            {
              "term": "多處理器架構分類（SMP vs. NUMA）",
              "desc": "非對稱多處理（Asymmetric）：主從架構，主處理器調度工作。\n對稱多處理（SMP）：每個處理器皆具備自我調度能力，共享同一主記憶體。\nUMA vs. NUMA：UMA 各處理器存取記憶體時間均勻；NUMA 存取本機記憶體速度快於遠端記憶體模組。"
            },
            {
              "term": "叢集系統（Clustered Systems）",
              "desc": "多個獨立系統透過區域網路或儲存區域網路（SAN）結合，提供高可用性（High-Availability）。\n非對稱叢集：一台處於熱備援（Hot-Standby），故障時接手。\n對稱叢集：多個節點同時執行任務並互相監控。\n高效能計算（HPC）需搭配分散式鎖定管理員（DLM）避免存取衝突。"
            }
          ]
        },
        {
          "id": "ch1-4",
          "title": "四、 作業系統結構（Operating-System Structure）",
          "summary": "多道程式設計（Multiprogramming）與分時系統（Timesharing / Multitasking）之演進與關鍵對比。",
          "items": [
            {
              "term": "多道程式設計（Multiprogramming）",
              "desc": "目的：單一使用者無法讓 CPU 與 I/O 裝置同時保持忙碌，因此系統將多個作業保留於記憶體中。\n運作機制：當目前執行的作業需要等待 I/O 時，作業系統立即切換 CPU 去執行另一個作業，最大化 CPU 利用率（CPU Utilization）。\n排程依賴：作業排程（Job Scheduling）。"
            },
            {
              "term": "分時系統／多元任務（Timesharing / Multitasking）",
              "desc": "定義：為多道程式設計的邏輯延伸。CPU 切換作業頻率極高（毫秒級），創造使用者與程式互動的「互動式運算（Interactive Computing）」環境。\n指標：回應時間（Response Time）通常要求小於 1 秒。\n機制：當記憶體不足時透過調換（Swapping）在記憶體與磁碟間搬移行程；利用虛擬記憶體（Virtual Memory）允許部分載入即可執行。"
            }
          ]
        },
        {
          "id": "ch1-5",
          "title": "五、 作業系統運作機制（Operating-System Operations）",
          "summary": "中斷驅動、陷阱（Trap）、雙模式運作（Dual-Mode）與定時器機制。",
          "items": [
            {
              "term": "中斷驅動與陷阱（Trap / Exception）",
              "desc": "作業系統為事件驅動（中斷驅動）。\n硬體中斷由外部裝置觸發；陷阱／異常（Trap / Exception）則由軟體錯誤（如除以零、非法記憶體存取）或系統服務請求（系統呼叫 System Call）產生。"
            },
            {
              "term": "雙模式運作（Dual-Mode Operation）",
              "desc": "硬體提供 Mode Bit 區分：\n- 使用者模式（User Mode，Mode Bit = 1）\n- 核心模式（Kernel Mode / Supervisor Mode / Monitor Mode，Mode Bit = 0）\n目的：保護作業系統與其他關鍵元件不受錯誤使用者程式破壞。\n特權指令（Privileged Instructions）：只能在核心模式下執行。使用者程式執行系統呼叫時，透過 Trap 切換為 Mode Bit 0，完成後設回 1 並返回使用者模式。"
            },
            {
              "term": "定時器機制（Timer）",
              "desc": "防止使用者程式陷入無窮迴圈或獨占 CPU 資源。\n作業系統在分配 CPU 前設定定時器，倒數歸零時發出中斷，強制將控制權奪回交給作業系統重新排程。"
            }
          ]
        },
        {
          "id": "ch1-6",
          "title": "六、 行程、記憶體與核心資料結構概要",
          "summary": "OS 核心管理職責，包含記憶體管理、快取一致性與 Linux 核心關鍵資料結構。",
          "items": [
            {
              "term": "程式（Program）vs. 行程（Process）",
              "desc": "程式是被動實體（Passive Entity，儲存於磁碟的檔案）；行程是執行中的程式，屬於主動實體（Active Entity）。\n行程具備程式計數器（PC）、堆疊、堆積等狀態。多執行緒則每個執行緒各有獨立 PC。"
            },
            {
              "term": "檔案系統抽象化與快取一致性（Cache Coherency）",
              "desc": "將物理儲存抽象化為邏輯單位「檔案（File）」，提供目錄與權限存取控制。\n快取一致性（Cache Coherency）：多處理器環境下，資料會由磁碟依序移入主記憶體、快取與暫存器，硬體必須保證所有 CPU 快取中的共用資料版本維持最新一致。"
            },
            {
              "term": "核心關鍵資料結構與搜尋複雜度（Kernel Data Structures）",
              "desc": "Linux 核心實作廣泛採用標準資料結構（定義於標頭檔如 <linux/list.h>、<linux/rbtree.h>）：\n1. 鏈結串列（Linked Lists）：包含單向、雙向與環狀鏈結串列。\n2. 搜尋樹（Search Trees）：一般二元搜尋樹在最糟情況下退化為單向串列，搜尋時間複雜度為 O(n)；平衡二元搜尋樹（Balanced BST，如 Linux rbtree 紅黑樹）保證樹高平衡，搜尋時間複雜度提升為 O(log n)。\n3. 雜湊圖（Hash Map）與位元圖（Bitmap）：位元圖由 n 個二進位位元組成，高效記錄 n 個項目的狀態（例如磁碟區塊或資源配置狀態）。"
            }
          ]
        }
      ]
    },
    {
      "id": "ch2",
      "title": "CH2 行程概念與處理序間通訊（IPC）",
      "examTips": "三種排程器比較（Long-term 控制 Multiprogramming 程度、Medium-term 負責 Swapping、Short-term 高頻切換 CPU）、PCB 欄位、五大狀態轉換、fork()/exec()/wait()/exit()、IPC 共享記憶體（in/out 滿空公式）vs. 訊息傳遞（Rendezvous 會合、緩衝區容量模型）、Chrome 多行程架構、管道 Pipes",
      "sections": [
        {
          "id": "ch2-1",
          "title": "一、 行程概念（Process Concept）",
          "summary": "行程定義、記憶體配置結構、五大狀態機與行程控制區塊（PCB）。",
          "items": [
            {
              "term": "行程的記憶體配置結構（4 大區段）",
              "desc": "1. Text Section：儲存編譯後的機器程式碼。\n2. Data Section：存放全域變數與靜態變數。\n3. Heap（堆積）：程式執行期間動態配置的記憶體（例如 malloc / new）。\n4. Stack（堆疊）：存放暫存資料，包括函式參數、區域變數、返回位址。"
            },
            {
              "term": "五大行程狀態（Process States）",
              "desc": "new：行程正在建立。\nready：行程已進入主記憶體，等待被分配 CPU。\nrunning：指令正在由 CPU 執行中。\nwaiting：行程等待特定事件發生（如等待 I/O 或信號）。\nterminated：行程執行完畢結束。"
            },
            {
              "term": "行程控制區塊（PCB, Process Control Block）",
              "desc": "又稱 Task Control Block，記錄特定行程所有資訊的資料結構。\n包含欄位：行程狀態、程式計數器（PC）、CPU 暫存器、CPU 排程資訊（優先權、佇列指標）、記憶體管理資訊（Base/Limit 暫存器、頁表）、會計資訊（CPU 使用量、運行時間限制）、I/O 狀態資訊（配置的 I/O 裝置、開啟檔案清單）。\nLinux 以 C 語言 task_struct 結構體表示。"
            }
          ]
        },
        {
          "id": "ch2-2",
          "title": "二、 行程排程（Process Scheduling）與三大排程器",
          "summary": "長期、中期與短期排程器之觸發頻率、主控目標與調換機制。",
          "items": [
            {
              "term": "三大排程器深度剖析（考試重點）",
              "desc": "1. 長期排程器（Long-term Scheduler / Job Scheduler）：從磁碟挑選行程載入主記憶體的 Ready queue。執行頻率低（數秒至數分鐘一次），主要控制「多道程式設計的程度（Degree of Multiprogramming）」，維持 I/O-bound 與 CPU-bound 行程之良好平衡。\n2. 短期排程器（Short-term Scheduler / CPU Scheduler）：從 Ready queue 中挑選下一個配置 CPU 的行程。執行頻率極高（毫秒級，10~100 ms），直接決定系統回應時間。\n3. 中期排程器（Medium-term Scheduler）：當記憶體負載過高時引入，透過「調換（Swapping）」機制將行程從主記憶體移出至次級儲存，之後再移回，藉此暫時降低多道程式設計程度以減緩記憶體爭奪。"
            },
            {
              "term": "排程佇列（Scheduling Queues）",
              "desc": "Job queue：系統中所有行程的集合。\nReady queue：存放於主記憶體中，準備就緒且等待分配 CPU 的行程。\nDevice queues：等待特定 I/O 裝置服務的行程集合。"
            },
            {
              "term": "上下文切換（Context Switch）",
              "desc": "CPU 切換至另一個行程執行時，OS 必須儲存舊行程狀態至其 PCB，並載入新行程已儲存的狀態。\n切換期間 CPU 無法進行實質運算，此時間屬於系統純開銷（Overhead）。"
            }
          ]
        },
        {
          "id": "ch2-3",
          "title": "三、 行程操作（Operations on Processes）",
          "summary": "行程樹狀階層、fork()、exec()、wait()、exit() 系統呼叫生命週期。",
          "items": [
            {
              "term": "行程樹與 PID",
              "desc": "行程由父行程（Parent）創建子行程（Children），層層遞迴建立行程樹。行程透過唯一的整數 PID（Process Identifier）識別管理。\nUNIX 第一個行程為 systemd（或 init），PID 為 1。"
            },
            {
              "term": "UNIX 系統呼叫四部曲",
              "desc": "1. fork()：建立子行程。子行程為父行程位址空間的完整副本（複製記憶體內容）。傳回值：對父行程傳回子行程 PID（> 0）；對子行程傳回 0；若失敗傳回負值。\n2. exec()：通常緊隨 fork() 後呼叫，以新程式的代碼、資料與堆疊徹底覆蓋當前行程並開始執行。\n3. wait()：父行程呼叫 wait(&status) 暫停自身，直到任一子行程終止，並回收子行程終止狀態碼。\n4. exit()：行程執行完畢發起，釋放所有配置資源；若父行程未呼叫 wait()，終止的子行程會暫時成為殭屍行程（Zombie）；若父行程先終止，子行程會變成孤兒行程（Orphan），由 init/systemd 收養並回收。"
            }
          ]
        },
        {
          "id": "ch2-4",
          "title": "四、 行程間通訊（Interprocess Communication, IPC）",
          "summary": "共享記憶體與訊息傳遞兩大模型，有界限緩衝區計算與同步會合機制。",
          "items": [
            {
              "term": "IPC 兩大模型核心對比",
              "desc": "1. 共享記憶體（Shared Memory）：在行程間建立一塊共同存取的實體記憶體區域。優點：通訊速度極快（僅在建立時呼叫系統呼叫，後續直接讀寫記憶體）；缺點：必須由程式設計師自行維護行程間的同步與互斥。\n2. 訊息傳遞（Message Passing）：透過作業系統核心原語 send() 與 receive() 傳遞訊息。優點：無需共享變數，天生支援跨網路分散式系統；缺點：每次訊息傳遞均需陷入核心，速度較慢。"
            },
            {
              "term": "有界限緩衝區（Bounded-Buffer）判斷式（必考）",
              "desc": "採用環狀陣列 item buffer[BUFFER_SIZE]，搭配 in（寫入索引）與 out（讀取索引）：\n- 緩衝區為空條件：in == out\n- 緩衝區已滿條件：(in + 1) % BUFFER_SIZE == out\n- 空間利用限制：容量為 BUFFER_SIZE 時，最多僅能同時存放 BUFFER_SIZE - 1 個項目（保留一格以區分全空與全滿）。"
            },
            {
              "term": "訊息傳遞同步機制與會合（Synchronization & Rendezvous）",
              "desc": "訊息傳遞具備阻塞（Blocking / Synchronous）與非阻塞（Non-blocking / Asynchronous）兩大型態：\n- Blocking send：傳送端暫停，直到訊息被接收端或郵箱接收。\n- Non-blocking send：傳送端發送訊息後立即繼續執行。\n- Blocking receive：接收端暫停，直到有訊息可讀取。\n- Non-blocking receive：接收端立即返回有效訊息或 Null。\n會合（Rendezvous）：當 send() 與 receive() 同時為 Blocking 狀態時，傳送端與接收端在通訊連結處嚴格同步對齊，稱之為 Rendezvous。"
            },
            {
              "term": "訊息佇列緩衝區容量模型（Buffering Capacities）",
              "desc": "通訊連結附帶之訊息佇列依容量劃分為三種實作方式：\n1. 零容量（Zero Capacity）：佇列長度為 0。連結無法暫存任何訊息，傳送端發送後必須強制等待接收端取走（即 Rendezvous 會合）。\n2. 有限容量（Bounded Capacity）：佇列長度為固定值 n。最多暫存 n 個訊息；若佇列未滿傳送者不需等待，滿了則傳送者必須阻塞等待。\n3. 無限容量（Unbounded Capacity）：佇列長度無限。傳送端發送訊息時永遠無須等待。"
            },
            {
              "term": "郵箱共享與競爭問題（Mailbox Sharing Dilemma）",
              "desc": "在間接通訊中，若行程 P1 發送訊息至共享郵箱 A，而 P2 與 P3 同時發起 receive()，由誰獲得訊息？\n系統常見解決策略：\n1. 限制一個連結最多僅能關聯兩個行程。\n2. 一次只允許最多一個行程執行 receive() 操作。\n3. 由系統任意挑選一個接收者，並通知傳送者實際接收的行程是誰。"
            }
          ]
        },
        {
          "id": "ch2-5",
          "title": "五、 主從式系統通訊與架構實例",
          "summary": "管道（Pipes）、Google Chrome 多行程架構、Socket 與 RPC。",
          "items": [
            {
              "term": "管道（Pipes）兩大型態",
              "desc": "普通管道（Ordinary / Anonymous Pipes）：單向通訊（半雙工），通訊行程間必須具有父子或親屬血緣關係，行程終止後管道即銷毀。一端寫入（Write-end），另一端讀取（Read-end）。\n具名管道（Named Pipes / FIFOs）：雙向通訊，無須親屬關係，多個行程可共享，且在檔案系統中具備實體節點，行程結束後仍留存。"
            },
            {
              "term": "Google Chrome 多行程與沙盒架構",
              "desc": "傳統單行程瀏覽器若某個分頁崩潰會導致整個瀏覽器當機。Chrome 採用獨立多行程架構：\n1. Browser Process（主行程）：管理 UI 介面、磁碟與網路 I/O。\n2. Renderer Process（渲染行程）：負責解析與繪製 HTML/CSS/JavaScript。為確保安全，Renderer 行程被嚴格隔離在沙盒（Sandbox）中執行，限制直接存取磁碟與硬體，隔離惡意程式碼；每個新分頁（Tab）通常啟動獨立的 Renderer 行程。\n3. Plug-in Process（外掛行程）：針對 Flash 等第三方套件獨立運行。"
            },
            {
              "term": "Socket 與 RPC（遠端程序呼叫）",
              "desc": "Socket：網路通訊端點，由 IP 位址與連接埠號碼（Port Number）組成（例如 192.168.1.1:80）。知名埠號（< 1024）保留給專屬服務（如 HTTP Port 80、SSH Port 22）。\nRPC（Remote Procedure Calls）：將網路通訊抽象化，使呼叫遠端主機函式如同本地呼叫。由客戶端 Stub 進行參數編包（Marshalling），伺服器端 Stub 進行解包（Unmarshalling），透過外部資料表示法（XDR）消除大小端順序（Endianness）差異。"
            }
          ]
        }
      ]
    },
    {
      "id": "ch3",
      "title": "CH3 CPU 排程（CPU Scheduling）與甘特圖演算法",
      "examTips": "甘特圖繪製與 Waiting Time 計算（100% 必考！）、五大排程指標、搶占（Preemptive）vs. 非搶占時機、FCFS（護衛效應）、SJF/SRTF（理論最佳、指數平均法）、Priority（飢餓與老化 Aging）、Round Robin（時間量子 q 影響、80% 經驗法則）、多層回饋佇列（MFQ）、即時 CPU 排程（RMS 速率單調 vs. EDF 最早截止時間）",
      "sections": [
        {
          "id": "ch3-1",
          "title": "一、 基本概念、時機與分派器",
          "summary": "CPU–I/O Burst Cycle、排程發起的 4 個時機點、搶占與分派器。",
          "items": [
            {
              "term": "CPU–I/O 突發週期（CPU–I/O Burst Cycle）",
              "desc": "行程的執行是由 CPU 計算（CPU burst）與 I/O 等待（I/O burst）交替循環構成。統計上呈現大量「短 CPU burst」與極少數「長 CPU burst」特徵。"
            },
            {
              "term": "發起排程的 4 個時機點與搶占判定（必考）",
              "desc": "1. 行程從 Running 轉為 Waiting 狀態（例如發起 I/O 或等待子行程）。\n2. 行程從 Running 轉為 Ready 狀態（例如時間片到期或發生中斷）。\n3. 行程從 Waiting 轉為 Ready 狀態（例如 I/O 操作完成）。\n4. 行程終止（Terminates）。\n非搶占式（Nonpreemptive）：僅在時機 1 與時機 4 進行排程，行程一旦取得 CPU 就執行到釋放為止。\n搶占式（Preemptive）：包含時機 2 與時機 3，OS 可強行中斷執行中行程奪回 CPU。"
            },
            {
              "term": "分派器（Dispatcher）與分派延遲（Dispatch Latency）",
              "desc": "分派器是將 CPU 實際控制權交給短期排程器選出之行程的核心模組。\n三大任務：上下文切換、切換至使用者模式、跳轉至程式正確位址重啟。\n分派延遲：停止目前行程並啟動新行程所耗費的時間，純屬系統開銷（Overhead）。"
            }
          ]
        },
        {
          "id": "ch3-2",
          "title": "二、 五大核心排程指標（Scheduling Criteria）",
          "summary": "排程演算法評估與最佳化指標定義與權衡。",
          "items": [
            {
              "term": "五大指標定義與目標",
              "desc": "1. CPU 利用率（CPU Utilization）：保持 CPU 處於忙碌狀態的時間百分比（目標：最大化 Maximize）。\n2. 吞吐量（Throughput）：單位時間內完成執行的行程數量（目標：最大化 Maximize）。\n3. 轉向時間／週轉時間（Turnaround Time）：行程從提交（Submission）到完全執行完畢（Completion）的總時間（目標：最小化 Minimize）。\n4. 等待時間（Waiting Time）：行程在 Ready queue 中累積等待 CPU 的總時間（目標：最小化 Minimize）。排程演算法主要影響等待時間！\n5. 回應時間（Response Time）：從提交請求到系統產生「第一個回應」的時間（目標：最小化 Minimize，分時系統最關鍵）。"
            }
          ]
        },
        {
          "id": "ch3-3",
          "title": "三、 核心排程演算法深度剖析與甘特圖",
          "summary": "FCFS、SJF、SRTF、Priority、Round Robin 與多層回饋佇列（MFQ）。",
          "items": [
            {
              "term": "1. 先來先服務（FCFS, First-Come First-Served）",
              "desc": "非搶占式。依照到達 Ready queue 先後順序分配 CPU。\n缺點：平均等待時間通常很長；容易引發「護衛效應（Convoy Effect）」——當長 CPU-bound 行程排在前方時，後方多個短 I/O-bound 行程被迫長時間等待，導致 CPU 與裝置利用率低落。"
            },
            {
              "term": "2. 最短工作優先（SJF）與最短剩餘時間（SRTF）",
              "desc": "SJF（非搶占）：挑選下一次 CPU burst 最短的行程執行。理論證明 SJF 具備「最小平均等待時間（Optimal）」！\nSRTF（搶占式 SJF）：當新行程到達時，若其 CPU burst 小於當前行程的「剩餘時間」，立即搶占 CPU。\n實作瓶頸：未來 CPU burst 無法事先確知，實務採用「指數平滑法（Exponential Smoothing）」預測：\n$$\tau_{n+1} = \u0007lpha t_n + (1 - \u0007lpha)\tau_n$$\n其中 $t_n$ 為第 n 次實際觀測值，$\tau_n$ 為第 n 次預測值，$\u0007lpha$ 為平滑係數（通常取 0.5）。"
            },
            {
              "term": "3. 優先權排程（Priority Scheduling）與老化技術",
              "desc": "每個行程分配一個優先權數值（通常數字愈小代表優先權愈高）。可為搶占式或非搶占式。\n致命問題：飢餓現象（Starvation / Indefinite Blocking），低優先權行程可能永無出頭之日。\n解決方案：老化技術（Aging），隨著行程在 Ready queue 等待時間增加，逐步遞增其優先權數值，保證最終一定能被執行。"
            },
            {
              "term": "4. 輪轉排程（Round Robin, RR）",
              "desc": "專為分時系統設計的搶占式演算法。將 Ready queue 當作環狀佇列，每個行程分配一個時間切片（Time Quantum q，通常 10~100 ms）。時間到期觸發 Timer 中斷奪回 CPU。\n等待時間上限：n 個行程時，任何行程等待時間不會超過 (n - 1) * q。\n量子選擇權衡：\n- q 極大：退化為 FCFS。\n- q 極小：雖然接近處理器共享，但頻繁上下文切換（Context Switch）引發嚴重系統開銷！\n經驗法則：時間切片 q 必須遠大於上下文切換時間，且約 80% 的 CPU burst 應該小於 q。"
            },
            {
              "term": "5. 多層回饋佇列排程（Multilevel Feedback Queue, MFQ）",
              "desc": "最通用且最複雜的 CPU 排程演算法。允許行程在不同優先權佇列之間動態移動。\n機制：佔用 CPU 過長的行程會被「降級」至低優先權佇列；在底層等待過久的行程透過老化「升級」至高優先權佇列。\n經典範例：Q0（RR，q=8 ms）-> Q1（RR，q=16 ms）-> Q2（FCFS）。短運算行程迅速在 Q0 結束，長運算自動下沉，兼顧回應性與吞吐量。"
            }
          ]
        },
        {
          "id": "ch3-4",
          "title": "四、 多處理器排程（Multiple-Processor Scheduling）",
          "summary": "對稱多處理（SMP）、處理器親和性（Processor Affinity）與負載平衡。",
          "items": [
            {
              "term": "SMP 與處理器親和性（Processor Affinity）",
              "desc": "對稱多處理（SMP）每個處理器自主排程。\n處理器親和性：行程在某 CPU 執行時，快取（Cache）已充滿其資料。若搬移至其他 CPU 執行將引發快取失效與重新載入之巨大開銷。因此排程器傾向讓行程留在同一 CPU 上執行。分為軟親和性（盡量維持）與硬親和性（透過系統呼叫綁定 CPU 核心）。\nNUMA 架構下，排程器需配合記憶體配置器，將行程排程在離其記憶體最近的 CPU 上。"
            },
            {
              "term": "負載平衡（Load Balancing）",
              "desc": "在私有佇列 SMP 系統中均勻分配工作量。\n推式遷移（Push Migration）：特定任務定期檢查各 CPU 負載，將行程從繁忙 CPU「推」至空閒 CPU。\n拉式遷移（Pull Migration）：空閒 CPU 主動從繁忙 CPU 佇列中「拉」取等待中行程。\n權衡：負載平衡會破壞處理器親和性，需折衷兼顧。"
            },
            {
              "term": "記憶體停頓（Memory Stall）與硬體多執行緒",
              "desc": "當 CPU 遭遇快取未命中（Cache Miss）存取記憶體時會產生長時間等待（Memory Stall）。\n多核心處理器採用超執行緒／硬體多執行緒（Multithreaded Multicore），單一核心擁有兩組或多組硬體暫存器與 PC，當一個執行緒停頓時瞬間切換至另一個執行緒執行，有效隱藏延遲。"
            }
          ]
        },
        {
          "id": "ch3-5",
          "title": "五、 即時 CPU 排程（Real-Time CPU Scheduling）",
          "summary": "軟即時、硬即時、速率單調排程（RMS）、最早截止時間優先（EDF）與比例份額排程。",
          "items": [
            {
              "term": "軟即時（Soft Real-Time）vs. 硬即時（Hard Real-Time）",
              "desc": "即時系統要求任務必須在嚴格的時間限制內完成：\n1. 軟即時（Soft Real-Time）：僅保證關鍵即時任務擁有最高優先權優先排程，但不保證一定能在截止時間（Deadline）前完成。\n2. 硬即時（Hard Real-Time）：任務必須絕對在截止時間前完成，錯過截止時間即視為重大系統失敗。系統必須具備優先權搶占（Preemptive, priority-based）排程支援。"
            },
            {
              "term": "速率單調排程（Rate Monotonic Scheduling, RMS）",
              "desc": "靜態優先權週期性排程演算法（Static Priority Algorithm）：\n- 優先權指派準則：依據週期的倒數（Inverse of period）指派優先權。週期愈短（Period p 愈小），代表執行頻率愈高，指派愈高的優先權；週期愈長，指派愈低優先權。\n- 排程可行性與 CPU 利用率上限：對於 N 個週期性行程，保證可完全滿足所有截止時間的充分條件為 CPU 利用率總和滿足：\n$$\\sum_{i=1}^N \\frac{C_i}{T_i} \\le N(2^{1/N} - 1)$$\n其中 $C_i$ 為執行時間（Burst），$T_i$ 為週期。\n當 $N=1$ 時上限為 100%；$N=2$ 時上限為 $2(2^{1/2}-1) \\approx 82.8\\%$；當 $N \\to \\infty$ 時極限逼近 $\\ln 2 \\approx 69.3\\%$。\n- 限制：若 CPU 利用率超過該上限，RMS 可能無法保證所有行程均準時完成，可能發生 Missed Deadlines。"
            },
            {
              "term": "最早截止時間優先（Earliest Deadline First, EDF）",
              "desc": "動態優先權排程演算法（Dynamic Priority Algorithm）：\n- 優先權指派準則：依照行程下一次的截止時間（Deadline）指派優先權。截止時間愈早，優先權愈高；截止時間愈晚，優先權愈低。\n- 動態調整：當新週期到達或行程就緒時，優先權會隨當前時間與截止時間動態調整，不局限於週期長短。\n- 理論利用率優勢：理論上 EDF 的 CPU 利用率最高可達 100%（$\\sum \\frac{C_i}{T_i} \\le 1$），且能保證所有行程皆在截止時間前完成執行，克服了 RMS 靜態優先權利用率受限的缺點。"
            },
            {
              "term": "比例份額排程（Proportional Share Scheduling）",
              "desc": "系統總共配置 $T$ 個份額（Shares）。若某行程被配置 $N$ 個份額（其中 $N < T$），則保證該行程在任意時間區間內能分得全部 CPU 時間的 $N/T$ 比例。\n準入控制（Admission Controller）：若新行程請求的份額加入後會使總需求超過 $T$，系統將拒絕該行程進入，以確保既有行程的份額承諾。"
            }
          ]
        }
      ]
    },
    {
      "id": "ch4",
      "title": "CH4 多執行緒程式設計（Multithreaded Programming）",
      "examTips": "執行緒四大效益（Responsiveness, Resource Sharing, Economy, Scalability）、行程 vs. 執行緒記憶體資源劃分（共享 Code/Data/Heap/Files；私有 Thread ID/PC/Registers/Stack）、併行（Concurrency）vs. 平行（Parallelism）、資料平行 vs. 任務平行、阿姆達爾定律（Amdahl's Law）公式與極限推導、三大多執行緒模型（Many-to-One / One-to-One / Many-to-Many）、隱式執行緒技術（Thread Pools, OpenMP, Grand Central Dispatch）",
      "sections": [
        {
          "id": "ch4-1",
          "title": "一、 執行緒動機與核心效益（Motivation & Thread Benefits）",
          "summary": "探討多執行緒架構動機、行程與執行緒內部記憶體配置劃分，以及多執行緒四大核心效益。",
          "items": [
            {
              "term": "多執行緒動機與伺服器架構",
              "desc": "現代應用程式大多為多執行緒架構。單一應用程式可將多項獨立子任務分配給不同執行緒運作（例如更新顯示介面、擷取網路資料、背景拼字檢查、回應客戶端請求）。\n建立新行程屬於高成本（Heavy-weight）開銷，而建立新執行緒則屬於輕量級（Light-weight）開銷。\n多執行緒伺服器架構（Multithreaded Server）：伺服器行程監聽請求，當收到客戶端請求時，不是建立一個全新行程，而是由執行緒池中指派或建立一個輕量執行緒專責處理該請求，伺服器主執行緒立即恢復監聽，大幅提升系統吞吐量與反應速度。"
            },
            {
              "term": "行程與執行緒內部資源劃分（共享 vs. 私有）",
              "desc": "同一行程內部之所有執行緒共享下列資源：\n- 程式碼區段（Code / Text Section）\n- 資料區段（Data Section / 全域與靜態變數）\n- 堆積區段（Heap Section / 動態配置記憶體 malloc/new）\n- 作業系統資源（開啟的檔案清單 Open Files、信號處置 Signals、網路連線）\n各執行緒各自獨立擁有之私有資源（Private Resources）：\n- 執行緒識別碼（Thread ID）\n- 程式計數器（Program Counter, PC）：記錄各自當前執行的指令位址\n- 暫存器集合（Register Set）：保存各自執行時的 CPU 暫存器狀態\n- 堆疊區段（Stack）：保存各自的函式呼叫框架、區域變數與返回位址"
            },
            {
              "term": "多執行緒四大核心效益（Four Major Benefits，必考）",
              "desc": "1. 回應性（Responsiveness）：即使應用程式中的某個執行緒遭遇長時間運算或阻塞（Blocked，如等待 I/O），其他執行緒仍可繼續執行，對使用者介面（UI）維持互動回應至關重要。\n2. 資源共享（Resource Sharing）：同一行程之所有執行緒天生共享記憶體與檔案資源，無須像 IPC 一樣由程式設計師手動設定複雜的共享記憶體或訊息傳遞機制。\n3. 經濟性（Economy）：建立執行緒所需的記憶體配置與時間開銷遠小於建立行程；且執行緒之間的上下文切換（Thread Context Switch）無需置換記憶體頁表或刷新快取，開銷遠低於行程上下文切換。\n4. 可擴展性（Scalability）：多執行緒行程能充分利用多處理器／多核心硬體架構，讓多個執行緒在不同核心上真正實現平行運算（Parallelism）。"
            }
          ]
        },
        {
          "id": "ch4-2",
          "title": "二、 多核心程式設計與阿姆達爾定律（Multicore Programming & Amdahl's Law）",
          "summary": "剖析併行與平行的本質區別、資料平行與任務平行、多核心五大設計挑戰，以及阿姆達爾定律計算。",
          "items": [
            {
              "term": "併行（Concurrency）vs. 平行（Parallelism）",
              "desc": "本質區別為作業系統考試高頻核心問答：\n- 併行（Concurrency）：系統支援「多個任務同時向前推進（making progress）」。在單一處理器／單核心架構下，CPU 排程器透過極高頻率在任務間交替切換，營造出同時進行的假象。\n- 平行（Parallelism）：系統能夠「在同一瞬間同時（simultaneously）執行多個任務」。必須仰賴實體多核心或多處理器硬體支援。\n結論：沒有平行性（Parallelism）的系統依然可以具備併行性（Concurrency）。"
            },
            {
              "term": "平行化兩大類型：資料平行 vs. 任務平行",
              "desc": "1. 資料平行（Data Parallelism）：將同一份龐大資料集切分為多個子集，分散到不同核心上，每個核心對其分配到的資料子集執行「完全相同」的運算操作（例如 GPU 向量陣列相加）。\n2. 任務平行（Task Parallelism）：將不同的執行緒分散到多個核心上，每個執行緒執行「各自獨特、彼此不同」的操作或函式，但各執行緒可能存取同一份共享資料。"
            },
            {
              "term": "多核心程式設計五大挑戰（Five Challenges）",
              "desc": "程式設計師在多核心系統上面臨之五大設計挑戰：\n1. 活動劃分（Dividing activities）：將應用程式拆解為可獨立執行的併行任務單元。\n2. 負載平衡（Balance）：確保各任務分配的工作量均勻，避免特定核心過載而其他核心閒置。\n3. 資料分割（Data splitting）：將任務運算之資料適當切分至各核心。\n4. 資料相依性（Data dependency）：同步具有相依關係的資料存取，防範競態條件（Race Condition）。\n5. 測試與除錯（Testing and debugging）：多執行緒執行路徑具非確定性（Non-deterministic），競態與死結除錯難度極高。"
            },
            {
              "term": "阿姆達爾定律（Amdahl's Law）公式與極限推導（計算必考）",
              "desc": "評估為應用程式增加額外處理器核心時所能獲得的效能加速比（Speedup）：\n核心公式：\n$$\\text{Speedup} \\le \\frac{1}{S + \\frac{1 - S}{N}}$$\n其中 $S$ 為應用程式中必須「循序執行（Serial portion）」的比例（$0 \\le S \\le 1$），$1 - S$ 為可「平行化（Parallel portion）」的比例，$N$ 為處理器核心數。\n經典範例：\n若程式有 75% 平行化，25% 必須循序執行（$S = 0.25$）：\n- 擴充至 2 核心：$$\\text{Speedup} = \\frac{1}{0.25 + \\frac{0.75}{2}} = \\frac{1}{0.625} = 1.6\\text{ 倍}$$\n- 擴充至 4 核心：$$\\text{Speedup} = \\frac{1}{0.25 + \\frac{0.75}{4}} = \\frac{1}{0.4375} \\approx 2.286\\text{ 倍}$$\n理論極限（Asymptotic Limit）：\n當核心數趨近於無窮大時（$N \\to \\infty$），$\\frac{1-S}{N} \\to 0$，加速比極限為：\n$$\\lim_{N \\to \\infty} \\text{Speedup} = \\frac{1}{S}$$\n若 $S = 0.25$，則極限最大加速比僅為 4 倍；若 $S = 0.1$（10% 循序），最大加速比僅為 10 倍。\n啟示：程式中的循序執行部分（Serial Portion）構成了多核心硬體擴充效益的根本瓶頸，增加核心數之邊際加速效益迅速遞減。"
            }
          ]
        },
        {
          "id": "ch4-3",
          "title": "三、 執行緒模型與層級（Threading Models & Levels）",
          "summary": "使用者執行緒與核心執行緒之對應關係，剖析多對一、一對一與多對多三大模型。",
          "items": [
            {
              "term": "使用者執行緒 vs. 核心執行緒",
              "desc": "1. 使用者執行緒（User Threads）：由使用者空間的執行緒函式庫進行管理，核心完全無感（Kernel-unaware）。執行緒的建立與排程極快，無須核心介入（無 System Call 開銷）。常見函式庫：POSIX Pthreads、Win32 Threads、Java Threads。\n2. 核心執行緒（Kernel Threads）：由作業系統核心直接支援與管理。幾乎所有通用作業系統（Windows、Linux、Solaris、macOS）皆原生支援核心執行緒。"
            },
            {
              "term": "多對一模型（Many-to-One Model）",
              "desc": "將多個使用者層級執行緒映射至「單一核心執行緒」。\n- 優點：執行緒管理於使用者空間完成，效率極高。\n- 致命缺點：\n  1. 若任一使用者執行緒發起阻塞式系統呼叫（Blocking System Call），整個行程的所有執行緒將全部被迫阻塞。\n  2. 由於核心一次只能排程一個核心執行緒，即使在多核心系統上也「無法平行執行」。\n- 代表系統：Solaris Green Threads、GNU Portable Threads。目前極少通用系統採用。"
            },
            {
              "term": "一對一模型（One-to-One Model，現代主流）",
              "desc": "將每個使用者層級執行緒映射至一個「專屬的核心執行緒」。\n- 優點：\n  1. 具備高併行度：一個執行緒發起阻塞呼叫時，其他執行緒仍能繼續執行。\n  2. 支援真平行運算：多個執行緒可在多核心處理器上同時平行執行。\n- 缺點：每建立一個使用者執行緒就必須建立一個核心執行緒，核心開銷較大；系統通常會限制行程能建立的執行緒數量上限。\n- 代表系統：Linux、Windows（NT/2000/XP/7/10/11）、Solaris 9 及更新版本。為現代通用作業系統之絕對主流！"
            },
            {
              "term": "多對多模型與雙層模型（Many-to-Many & Two-Level Model）",
              "desc": "多對多模型（Many-to-Many）：將許多使用者執行緒多工映射至「相同或較少數量」的核心執行緒。\n- 優點：結合兩者優點，程式設計師可依需求建立大量使用者執行緒，核心依硬體架構建立合適數量的核心執行緒；阻斷時核心可調度其他核心執行緒。\n雙層模型（Two-Level Model）：多對多模型的變形，在允許 M:M 映射的同時，亦允許將特定關鍵使用者執行緒永久「綁定（Bound）」至專屬核心執行緒。\n- 代表系統：Solaris 8 以前版本、IRIX、HP-UX、Tru64 UNIX。"
            }
          ]
        },
        {
          "id": "ch4-4",
          "title": "四、 執行緒函式庫（Thread Libraries）",
          "summary": "POSIX Pthreads、Win32 Threads 與 Java Threads 的標準規範與實作方式。",
          "items": [
            {
              "term": "執行緒函式庫實作途徑",
              "desc": "執行緒函式庫提供 API 供程式設計師建立與管理執行緒，兩大實作途徑：\n1. 純使用者空間函式庫（User-Space Library）：函式呼叫全在使用者空間進行，無系統呼叫開銷。\n2. 核心層級函式庫（Kernel-Level Library）：函式呼叫直接轉發為作業系統系統呼叫，由核心提供支援。"
            },
            {
              "term": "POSIX Pthreads 標準與 API 概念",
              "desc": "Pthreads 為 IEEE 1003.1c 針對執行緒建立與同步所制定的 POSIX 標準規範。\n核心考點：Pthreads 是「規範／規格（Specification）」，而非單一特定實作。API 定義了函式行為與簽章，具體實作交由各函式庫或作業系統開發者完成。\n在 UNIX 體系（Linux、macOS、Solaris）中極為普及。\n基本 C 語言原語：\n- pthread_create(&tid, &attr, runner, argv)：建立新執行緒並指定執行函式 runner\n- pthread_join(tid, NULL)：呼叫端阻塞等待指定執行緒結束執行（類似 wait()）"
            }
          ]
        },
        {
          "id": "ch4-5",
          "title": "五、 隱式執行緒技術（Implicit Threading）",
          "summary": "隨著執行緒數量激增，探討執行緒池（Thread Pools）、OpenMP 編譯器指令與 Grand Central Dispatch（GCD）。",
          "items": [
            {
              "term": "隱式執行緒動機（Implicit Threading Motivation）",
              "desc": "當多核心系統規模擴大至數十甚至數百核心時，由程式設計師手動顯式建立（Explicit threading）、管理數千個執行緒將導致程式正確性維護極度困難（易引發競爭、死結）。\n隱式執行緒將執行緒的創建、排程與生命週期管理交由「編譯器（Compilers）」與「執行期函式庫（Run-time Libraries）」負責，程式設計師僅需標註「並行任務（Tasks）」即可。"
            },
            {
              "term": "執行緒池（Thread Pools）三大優勢",
              "desc": "架構概念：系統在開機或行程啟動時預先建立一定數量的執行緒放入「池（Pool）」中待命。當有新任務到達時，從池中取出一個空閒執行緒執行；任務完成後執行緒不銷毀，而是歸還給池中等待下次工作。\n三大關鍵優點：\n1. 服務請求速度快：利用既有執行緒服務請求，通常比動態建立新執行緒更快。\n2. 綁定資源邊界：限制系統中的執行緒總數，防止突發大量請求耗盡 CPU 與記憶體資源。\n3. 解耦機制與任務：將任務本身的邏輯與建立執行的機制完全分離，便於實作定期排程或延遲執行策略。"
            },
            {
              "term": "OpenMP 平行程式設計",
              "desc": "一組支援 C、C++、Fortran 的編譯器指令（Compiler Directives）與 API，專為「共享記憶體環境」打造。\n核心用法：\n- #pragma omp parallel：通知編譯器將隨後的程式碼區塊宣告為「平行區段（Parallel Region）」，自動依系統可用核心數建立對應數量的執行緒同時執行。\n- #pragma omp parallel for：自動將隨後的 for 迴圈迭代次數均勻切分給多個執行緒平行運算，大幅簡化平行程式碼撰寫。"
            },
            {
              "term": "Apple Grand Central Dispatch (GCD)",
              "desc": "Apple 針對 macOS 與 iOS 開發之系統級隱式執行緒技術，結合語言擴充、API 與執行期函式庫：\n- 語法擴充：定義「區塊（Blocks）」，以 ^{ } 標註並行任務單元，例如 ^{ printf(\"Task running\"); }。\n- 派遣佇列（Dispatch Queues）：任務被提交至佇列中，由系統後台從執行緒池調度執行緒執行。\n兩大佇列型態：\n1. 序列佇列（Serial Queue）：依先進先出（FIFO）順序取出執行，同一時間只有一個任務執行。每個行程具備唯一的「Main Queue（主佇列）」，使用者亦可自訂額外的序列佇列。\n2. 並發佇列（Concurrent Queue）：依 FIFO 順序取出，但系統可「同時取出多個任務」並分派給多個執行緒平行執行。系統提供三組全域優先權佇列：Low、Default、High。"
            }
          ]
        }
      ]
    },
    {
      "id": "ch5",
      "title": "CH5 死結（Deadlocks）",
      "examTips": "四大必要條件（名詞必考）、資源配置圖判定（單一實例必然、多實例不一定）、銀行家演算法安全狀態推導（計算大題）、預防破壞循環等待（全域遞增編號排序）、避免要求最大需求量（Max Demand）、現代 OS 採鴕鳥策略（忽視）、宣告邊虛線轉換、死結復原資源搶佔防飢餓",
      "sections": [
        {
          "id": "ch5-1",
          "title": "一、 系統模型（System Model）",
          "summary": "在作業系統中，系統是由有限的資源（Resources）與競爭這些資源的行程（Processes）所組成。",
          "items": [
            {
              "term": "資源類型與實例（Resource Types & Instances）",
              "desc": "1. 系統包含多種不同的資源類型 $R_1, R_2, \\dots, R_m$（例如：CPU 週期、記憶體空間、I/O 裝置）。\n2. 每種資源類型 $R_i$ 可以包含 $W_i$ 個相同的實例（Instances）。若系統配置 2 台相同的印表機，則印表機資源類型擁有 2 個實例。"
            },
            {
              "term": "行程使用資源三階段（Three Phases of Resource Utilization）",
              "desc": "行程在存取任何系統資源時，必須嚴格遵守固定順序流程：\n1. 請求（Request）：行程向系統申請所需資源。若該資源無法立即分配，行程進入等待狀態。\n2. 使用（Use）：行程獲得資源後，對資源進行操作（例如：對印表機進行輸出列印、讀寫磁碟檔案）。\n3. 釋放（Release）：行程使用完畢後，將資源歸還給作業系統，以供其他等待行程使用。"
            }
          ]
        },
        {
          "id": "ch5-2",
          "title": "二、 死結特徵（Deadlock Characterization）",
          "summary": "定義死結發生的四個必要條件、資源配置圖（Resource-Allocation Graph, RAG）表示法、宣告邊與判斷準則。",
          "items": [
            {
              "term": "死結發生的四個必要條件（Four Necessary Conditions，必背）",
              "desc": "當且僅當以下四個條件同時成立時，系統才有可能陷入死結狀態（缺一不可）：\n1. 互斥（Mutual Exclusion）：一次只能有一個行程使用該資源；若其他行程請求該資源，必須等待直到資源被釋放。\n2. 持有並等待（Hold and Wait）：行程至少持有一項資源的實例，同時又在等待取得其他已被其他行程持有的資源。\n3. 不可搶佔（No Preemption）：資源不能被強制搶佔，只能由持有該資源的行程在完成任務後自願釋放。\n4. 循環等待（Circular Wait）：存在一個等待行程集合 {P0, P1, ..., Pn}，其中 P0 正等待 P1 持有的資源，P1 正等待 P2 持有的資源，...，Pn 正等待 P0 持有的資源，形成一個封閉的環狀等待鏈。"
            },
            {
              "term": "資源配置圖（Resource-Allocation Graph, RAG）表示法",
              "desc": "由頂點集合 V 與有向邊集合 E 組成的有向圖：\n1. 頂點種類：\n   - 行程節點 P = {P1, P2, ..., Pn}：以圓形節點表示。\n   - 資源節點 R = {R1, R2, ..., Rm}：以矩形節點表示，矩形內部的小圓點代表該資源的實例數量。\n2. 有向邊種類：\n   - 請求邊（Request Edge）：由行程指向資源（Pi -> Rj），代表行程 Pi 正在請求資源 Rj 的一個實例。\n   - 分配邊（Assignment Edge）：由資源指向行程（Rj -> Pi），代表資源 Rj 的一個實例已經分配給行程 Pi。"
            },
            {
              "term": "資源配置圖（RAG）宣告邊與轉換流程",
              "desc": "在死結避免演算法中，資源配置圖引入宣告邊（Claim Edge，記為 Pi -> Rj），在圖中以「虛線（Dashed Line）」表示，代表行程 Pi 在未來執行過程中「可能會」請求資源 Rj。\n轉換流程：\n1. 行程在開始執行前必須事先宣告所有未來可能需要的宣告邊。\n2. 當行程真正提出資源請求時，宣告邊轉為實線的「請求邊（Request Edge）」。\n3. 系統評估分配後，若將請求邊轉為「分配邊（Assignment Edge）」不會在圖中產生任何環路（Cycle），則批准分配；否則行程必須等待。\n4. 當行程釋放資源時，分配邊重新轉回虛線的「宣告邊」。"
            },
            {
              "term": "死結與環路的判斷規則（Basic Facts，必考）",
              "desc": "利用資源配置圖判定死結的核心定理：\n1. 若圖中無環路（No Cycle）=> 系統絕對不會發生死結！\n2. 若圖中存在環路（Cycle）：\n   - 單一實例（Single Instance）：環路是死結發生的「充分必要條件」，必然發生死結！\n   - 多重實例（Several Instances）：環路只是死結發生的「必要非充分條件」，可能發生死結，但環路並不保證一定死結（需動態執行矩陣演算法判定）。"
            }
          ]
        },
        {
          "id": "ch5-3",
          "title": "三、 死結處理方法（Methods for Handling Deadlocks）",
          "summary": "死結處理三大策略：確保絕不進入死結、允許進入後偵測復原、完全忽視死結（鴕鳥策略）。",
          "items": [
            {
              "term": "死結處理三大策略概要",
              "desc": "1. 確保系統絕不進入死結狀態：\n   - 死結預防（Prevention）：規範請求協定，強制破壞四個必要條件之一。\n   - 死結避免（Avoidance）：行程需事先宣告最大需求（Max Demand），動態評估分配請求，確保系統永保在安全狀態（Safe State）。\n2. 允許進入死結隨後偵測並復原：平時不限制分配，定期執行死結偵測演算法，發現死結後進行行程終止或資源搶佔。\n3. 完全忽視死結問題（鴕鳥策略 Ostrich Algorithm）：假裝死結永遠不會發生。在通用作業系統中死結極少發生，而預防與避免開銷極高，因此 UNIX、Linux、Windows 皆採此策略，交由使用者手動終止凍結程式。"
            }
          ]
        },
        {
          "id": "ch5-4",
          "title": "四、 死結預防（Deadlock Prevention）",
          "summary": "深入剖析破壞四個必要條件的具體手段與所伴隨之系統代價。",
          "items": [
            {
              "term": "破壞「互斥（Mutual Exclusion）」",
              "desc": "將資源改為完全可共用模式（例如唯讀檔案）。\n代價與可行性：極難實施。大多數硬體設備（如印表機、磁帶機）本質上具有不可共用性，無法同時給多個行程寫入。"
            },
            {
              "term": "破壞「持有並等待（Hold and Wait）」",
              "desc": "保證行程請求新資源時不能同時持有其他資源。\n實作協定：\n- 協定一：行程在開始執行前，必須一次性申請並獲配其所需的所有資源。\n- 協定二：行程僅在未持有任何資源時，才可提出新的資源請求。\n代價：資源利用率極為低下（未用資源被長期鎖定），且需要多種資源的大型行程極易面臨「飢餓（Starvation）」。"
            },
            {
              "term": "破壞「不可搶佔（No Preemption）」",
              "desc": "若行程持有部分資源並申請新資源被拒，則該行程目前持有的所有資源強制被系統釋放（搶佔），加入等待清單。\n代價：只適用於狀態容易保存與恢復的資源（如 CPU 暫存器、主記憶體）；對印表機、磁帶機等有狀態實體裝置難以實作。"
            },
            {
              "term": "破壞「循環等待（Circular Wait，最標準作法）」",
              "desc": "對系統所有資源類型賦予全域嚴格遞增的編號序列 F: R -> N。\n規定所有行程必須嚴格按照資源編號的「遞增順序（Increasing Order）」提出資源請求。數學上已證明此規定徹底杜絕封閉環狀等待鏈之形成。\n代價：程式編寫受到限制，且編號順序難以完美滿足所有應用場景需求。"
            }
          ]
        },
        {
          "id": "ch5-5",
          "title": "五、 死結避免（Deadlock Avoidance）",
          "summary": "安全狀態（Safe State）、銀行家演算法（Banker's Algorithm）資料結構與演算法推導步驟。",
          "items": [
            {
              "term": "先驗資訊與安全狀態（Safe State）",
              "desc": "死結避免要求系統具備額外先驗資訊：每個行程必須事先宣告其可能需要的每種資源之「最大需求量（Maximum Demand）」。\n安全狀態定義：若系統能找到一組行程之安全序列 <P0, P1, ..., Pn-1>，使得對於每個 Pi，其未來仍可能申請的資源（Need_i）皆可由「目前可用資源 + 前方所有行程目前持有資源」滿足，則稱系統處於安全狀態。\n定理：安全狀態絕不死結；不安全狀態可能引發死結；避免的本質就是確保系統永遠不踏入不安全狀態！"
            },
            {
              "term": "銀行家演算法四大核心資料結構",
              "desc": "設 n 為行程數，m 為資源種類數：\n1. Available（長度 m 向量）：Available[j] = k 代表資源 Rj 目前剩餘 k 個可用實例。\n2. Max（n x m 矩陣）：Max[i, j] = k 代表行程 Pi 對資源 Rj 的最大需求量。\n3. Allocation（n x m 矩陣）：Allocation[i, j] = k 代表行程 Pi 目前已獲配的資源實例數。\n4. Need（n x m 矩陣）：Need[i, j] 代表行程 Pi 尚需要的資源量，計算公式為：\n$$\\text{Need}[i, j] = \\text{Max}[i, j] - \\text{Allocation}[i, j]$$"
            },
            {
              "term": "安全演算法（Safety Algorithm）步驟",
              "desc": "1. 初始化 Work = Available（長度 m），Finish[i] = false（i = 0, ..., n-1）。\n2. 尋找符合 Finish[i] == false 且 Need_i <= Work 的行程 Pi。若找不到則跳至步驟 4。\n3. 模擬 Pi 執行完畢釋放資源：\n$$\\text{Work} = \\text{Work} + \\text{Allocation}_i, \\quad \\text{Finish}[i] = \\text{true}$$\n返回步驟 2 繼續尋找下一個行程。\n4. 若所有行程的 Finish[i] 皆為 true，則系統處於安全狀態，找到安全序列；否則處於不安全狀態。"
            },
            {
              "term": "資源請求演算法（Resource-Request Algorithm）",
              "desc": "當行程 Pi 提出資源請求 Request_i 時：\n1. 若 Request_i <= Need_i，進入步驟 2；否則報錯（超出原先宣告的最大需求）。\n2. 若 Request_i <= Available，進入步驟 3；否則 Pi 必須等待（系統當前資源不足）。\n3. 系統「假裝分配」資源並試探性修改狀態：\n   Available = Available - Request_i\n   Allocation_i = Allocation_i + Request_i\n   Need_i = Need_i - Request_i\n4. 執行安全演算法：若結果為安全狀態，正式批准分配；若為不安全狀態，復原舊狀態並強制 Pi 暫時等待。"
            }
          ]
        },
        {
          "id": "ch5-6",
          "title": "六、 死結偵測（Deadlock Detection）",
          "summary": "等待圖（Wait-for Graph）、多實例偵測演算法矩陣更新步驟與調度頻率。",
          "items": [
            {
              "term": "單一資源實例：等待圖（Wait-for Graph）",
              "desc": "若每種資源類型都只有一個實例，可自資源配置圖中移除資源節點，將邊簡化為行程間的有向邊：Pi -> Pj 代表行程 Pi 正在等待 Pj 所持有的資源。\n定理：在等待圖中，死結存在的充分必要條件為「圖中存在環路（Cycle）」。系統定期執行環路搜尋演算法（時間複雜度為 O(n^2)）。"
            },
            {
              "term": "多重資源實例死結偵測演算法",
              "desc": "資料結構包含 Available、Allocation 與 Request（實際當前請求矩陣）：\n1. 初始化 Work = Available；對於所有 i，若 Allocation_i != 0 則 Finish[i] = false，否則 Finish[i] = true（未持有任何資源者直接視為已完成）。\n2. 尋找符合 Finish[i] == false 且 Request_i <= Work 的行程 Pi。若找不到跳至步驟 4。\n3. Work = Work + Allocation_i，Finish[i] = true，返回步驟 2。\n4. 若存在任一行程之 Finish[i] == false，則系統處於死結狀態，且該行程即為陷入死結的行程之一。"
            },
            {
              "term": "死結偵測演算法調度頻率考量",
              "desc": "何時觸發死結偵測取決於兩大因素：\n1. 死結發生的可能性頻率多高？\n2. 死結發生時牽連的行程數量多大？\n極端作法：每次分配請求無法立即滿足時觸發（開銷過高）；實務作法：固定時間間隔（如每小時）或當 CPU 利用率異常暴跌（例如低於 40%）時才啟動偵測。"
            }
          ]
        },
        {
          "id": "ch5-7",
          "title": "七、 死結復原（Recovery from Deadlock）",
          "summary": "行程終止與資源搶佔兩大復原途徑，犧牲者選擇、回滾與防飢餓機制。",
          "items": [
            {
              "term": "途徑一：行程終止（Process Termination）",
              "desc": "1. 終止所有死結行程（Abort all deadlocked processes）：代價最高，所有已計算成果皆報銷。\n2. 逐一終止行程直到死結環路消除（Abort one process at a time）：每終止一個行程就重新執行一次偵測演算法確認是否仍有死結。\n終止優先順序依行程優先權、已執行時間、已佔用資源量、剩餘所需資源量與行程型態（互動式 vs. 批次）綜合評估。"
            },
            {
              "term": "途徑二：資源搶佔三大核心議題（Resource Preemption）",
              "desc": "1. 選擇犧牲者（Selecting a Victim）：決定搶佔哪些行程的資源以最小化系統代價。\n2. 回滾（Rollback）：將被搶佔資源的行程回滾至安全狀態並重新啟動。完全回滾（Total Rollback）是直接終止並重頭開始；部分回滾（Partial Rollback）需維護檢查點（Checkpoint）。\n3. 飢餓現象與防止（Starvation）：若單純以最小代價為考量，同一個行程可能屢次被選為犧牲者而永遠無法執行完成（飢餓）。\n防範機制：在代價計算函式中納入「回滾次數（Number of Rollbacks）」權重，回滾次數愈多的行程，其被選為犧牲者的代價大幅提升，確保所有行程最終都能完成執行。"
            }
          ]
        }
      ]
    }
  ],
  "memoryHierarchy": [
    {
      "level": 1,
      "name": "Registers（暫存器）",
      "speed": "< 1 ns",
      "capacity": "< 1 KB",
      "cost": "最高",
      "volatility": "揮發性（Volatile）"
    },
    {
      "level": 2,
      "name": "Cache（快取記憶體）",
      "speed": "1 ~ 10 ns",
      "capacity": "< 16 MB",
      "cost": "極高",
      "volatility": "揮發性（Volatile）"
    },
    {
      "level": 3,
      "name": "Main memory（主記憶體）",
      "speed": "50 ~ 100 ns",
      "capacity": "< 64 GB",
      "cost": "高",
      "volatility": "揮發性（Volatile）"
    },
    {
      "level": 4,
      "name": "Solid-state disk（固態硬碟）",
      "speed": "10 ~ 100 μs",
      "capacity": "< 1 TB",
      "cost": "中等",
      "volatility": "非揮發性（Nonvolatile）"
    },
    {
      "level": 5,
      "name": "Magnetic disk（傳統磁碟）",
      "speed": "5 ~ 10 ms",
      "capacity": "< 10 TB",
      "cost": "低",
      "volatility": "非揮發性（Nonvolatile）"
    },
    {
      "level": 6,
      "name": "Optical disk（光碟）",
      "speed": "100 ms 級",
      "capacity": "數 GB 至數十 GB",
      "cost": "極低",
      "volatility": "非揮發性（Nonvolatile）"
    },
    {
      "level": 7,
      "name": "Magnetic tapes（磁帶）",
      "speed": "數秒至數分鐘",
      "capacity": "數十 TB 級",
      "cost": "最低",
      "volatility": "非揮發性（Nonvolatile）"
    }
  ],
  "flashcards": [
    {
      "id": "fc-1",
      "chapter": "ch1",
      "front": "作業系統的雙模式運作（Dual-Mode Operation）目的是什麼？如何切換模式？",
      "back": "目的：保護作業系統與其他關鍵系統元件不受錯誤的使用者程式破壞。\n機制：硬體提供 Mode Bit（0 代表核心模式，1 代表使用者模式）。使用者程式發起系統呼叫（System Call）時觸發軟體中斷（Trap），將 Mode Bit 切換為 0 進入核心模式；核心處理完畢後將 Mode Bit 設回 1 並返回使用者模式。特權指令（Privileged Instructions）僅能在核心模式下執行。"
    },
    {
      "id": "fc-2",
      "chapter": "ch1",
      "front": "直接記憶體存取（DMA）為何能大幅降低 CPU 負擔？",
      "back": "專為高速 I/O 裝置設計。裝置控制器直接在自身區域緩衝區與主記憶體之間搬移整個資料區塊（Block），全程無需 CPU 介入。傳統方式每傳輸 1 個 Byte 就會中斷 CPU 一次，DMA 改為每傳輸一個完整區塊（Block）才產生一次中斷，顯著釋放 CPU 運算資源。"
    },
    {
      "id": "fc-3",
      "chapter": "ch1",
      "front": "多道程式設計（Multiprogramming）的核心精神與達成目的為何？",
      "back": "核心精神：單一使用者無法讓 CPU 與所有 I/O 裝置隨時保持忙碌，因此系統將多個作業保留在記憶體中。\n達成目的：當目前執行的作業需要等待 I/O 完成時，作業系統立即切換 CPU 去執行另一個準備就緒的作業，從而消除 CPU 閒置時間，最大化 CPU 利用率（CPU Utilization）。"
    },
    {
      "id": "fc-4",
      "chapter": "ch1",
      "front": "儲存階層架構由頂端至底端的變化趨勢為何？（三大指標）",
      "back": "由頂端（暫存器 Registers）至底端（磁帶 Magnetic tapes）：\n1. 存取速度：由極快變為極慢。\n2. 每單位儲存成本：由最高變為最低。\n3. 儲存容量：由最小（數百 Byte）變為最大（數十 TB）。\n（頂端三層 Registers、Cache、Main memory 為揮發性；SSD 以下為非揮發性）。"
    },
    {
      "id": "fc-5",
      "chapter": "ch2",
      "front": "三種排程器（長期、中期、短期排程器）的頻率、職責與目標？",
      "back": "1. 長期排程器（Job Scheduler）：低頻（數秒至數分鐘）。從磁碟挑選行程載入 Ready queue，控制多道程式設計程度（Degree of Multiprogramming）。\n2. 中期排程器：中頻。記憶體不足時將行程移出至磁碟（Swapping 調換），暫時降低多道程式設計程度。\n3. 短期排程器（CPU Scheduler）：極高頻（毫秒級）。從 Ready queue 挑選下一個配置 CPU 的行程，決定系統回應時間。"
    },
    {
      "id": "fc-6",
      "chapter": "ch2",
      "front": "有界限緩衝區（Bounded-Buffer）的為空條件、已滿條件與空間利用限制？",
      "back": "共享變數：item buffer[BUFFER_SIZE]，in 為寫入指標，out 為讀取指標。\n- 為空條件：in == out\n- 已滿條件：(in + 1) % BUFFER_SIZE == out\n- 空間利用限制：容量為 BUFFER_SIZE 時，最多只能同時存放 BUFFER_SIZE - 1 個項目（必須保留一格空位以區隔全空與全滿）。"
    },
    {
      "id": "fc-7",
      "chapter": "ch2",
      "front": "fork() 系統呼叫創建子行程時，其記憶體空間與傳回值有何特性？",
      "back": "特性：子行程的記憶體位址空間是父行程的完整複製副本（Duplicate）。\n傳回值判定：\n- 對父行程：傳回新建立之子行程的 PID（正整數）。\n- 對子行程：傳回 0。\n- 若建立失敗：傳回負值（-1）。"
    },
    {
      "id": "fc-8",
      "chapter": "ch2",
      "front": "行程間通訊（IPC）中，共享記憶體與訊息傳遞的根本差異？",
      "back": "共享記憶體（Shared Memory）：在記憶體中建立共用區塊，通訊速度極快（無需每次呼叫系統呼叫），但同步與互斥責任完全由程式設計師自行承擔。\n訊息傳遞（Message Passing）：透過核心 send() 與 receive() 原語傳遞，速度較慢，但由核心統一管理同步，且天生支援跨網路分散式系統。"
    },
    {
      "id": "fc-9",
      "chapter": "ch3",
      "front": "最短工作優先（SJF）排程演算法為何具備理論最佳性？其實務難題為何？",
      "back": "理論最佳性：在所有排程演算法中，SJF 能夠證明給出「最小的平均等待時間（Minimum Average Waiting Time）」。\n實務難題：在通用作業系統中無法事先得知行程下一次 CPU burst 的精確時間長度。通常必須依賴歷史紀錄透過「指數平滑法」進行估算預測。"
    },
    {
      "id": "fc-10",
      "chapter": "ch3",
      "front": "優先權排程中的「飢餓現象（Starvation）」是什麼？如何透過「老化（Aging）」解決？",
      "back": "飢餓現象：低優先權的行程因為系統中源源不絕湧入的高優先權行程，導致永遠無法取得 CPU 執行的困境。\n老化（Aging）技術：系統隨時間推移，逐步提高在 Ready queue 中滯留等待過久的行程之優先權（例如每等待一定時間就提升其優先權階層），保證所有行程最終都能獲得 CPU 執行。"
    },
    {
      "id": "fc-11",
      "chapter": "ch3",
      "front": "輪轉排程（Round Robin）中，時間量子（Time Quantum q）的大小選擇有何權衡？",
      "back": "若 q 極大：RR 演算法退化為先來先服務（FCFS）。\n若 q 極小：雖然接近理想處理器共享，但上下文切換（Context Switch）次數急遽增加，龐大的切換開銷將大幅拖垮 CPU 有效運算效能。\n經驗法則：時間量子 q 必須遠大於上下文切換時間，且建議約 80% 的 CPU burst 長度應小於 q。"
    },
    {
      "id": "fc-12",
      "chapter": "ch3",
      "front": "排程時機中的「搶占式（Preemptive）」與「非搶占式（Nonpreemptive）」如何界定？",
      "back": "排程發生在以下四個時機：\n1. Running -> Waiting\n2. Running -> Ready\n3. Waiting -> Ready\n4. 行程終止（Terminates）\n非搶占式：僅在情況 1 與情況 4 進行排程，行程一旦佔有 CPU 就不會被剝奪。\n搶占式：包含情況 2 與情況 3，作業系統可強行中斷執行中行程奪回 CPU 分配給他人。"
    },
    {
      "id": "fc-13",
      "chapter": "ch3",
      "front": "護衛效應（Convoy Effect）是什麼？在哪種演算法中最容易發生？",
      "back": "現象描述：當一個大型長 CPU-bound 行程排在隊伍前方時，後方許多短 I/O-bound 的行程被迫在 Ready queue 中長時間等待，導致系統整體平均等待時間暴增，且 I/O 裝置大量閒置。\n最常發生於：先來先服務（FCFS）排程演算法。"
    },
    {
      "id": "fc-14",
      "chapter": "ch5",
      "front": "死結發生的四個必要條件為何？",
      "back": "1. 互斥（Mutual Exclusion）：資源一次只能由一個行程佔用。\n2. 持有並等待（Hold and Wait）：行程持有一項資源，同時等待其他被佔用的資源。\n3. 不可搶佔（No Preemption）：資源不能被強制剝奪，只能自願釋放。\n4. 循環等待（Circular Wait）：行程間存在封閉環狀的資源等待鏈（P0 等 P1，P1 等 P2，...，Pn 等 P0）。\n（四者同時成立系統才可能死結）。"
    },
    {
      "id": "fc-15",
      "chapter": "ch5",
      "front": "資源配置圖（RAG）中，環路（Cycle）與死結（Deadlock）的關係為何？",
      "back": "1. 若圖中無環路：保證絕無死結！\n2. 若圖中存在環路：\n   - 若所有資源類型皆為「單一實例（Single Instance）」：環路是死結的充分必要條件，必然發生死結！\n   - 若資源包含「多重實例（Multiple Instances）」：環路只是必要條件，可能死結也可能不死結（需進一步演算法驗證）。"
    },
    {
      "id": "fc-16",
      "chapter": "ch5",
      "front": "死結避免中，安全狀態（Safe State）與死結（Deadlock）的關係是什麼？",
      "back": "安全狀態（Safe State）保證絕對不會發生死結（存在至少一組安全序列）。\n不安全狀態（Unsafe State）代表系統「可能」會陷入死結，但並不等同於已經死結。不安全狀態是死結發生的必要非充分條件。死結避免的本質就是動態確保系統永遠維持在安全狀態。"
    },
    {
      "id": "fc-17",
      "chapter": "ch5",
      "front": "銀行家演算法中，Need 矩陣的計算公式為何？安全序列代表什麼？",
      "back": "計算公式：Need[i, j] = Max[i, j] - Allocation[i, j]（尚需要的資源 = 宣告最大需求 - 目前已獲配資源）。\n安全序列 <P1, P2, ..., Pn> 代表在此執行順序下，每個行程 Pi 仍可能請求的最大資源（Need_i），皆可由「目前可用資源 + 前方所有已完成行程歸還的資源」得到滿足。"
    },
    {
      "id": "fc-18",
      "chapter": "ch5",
      "front": "死結預防（Deadlock Prevention）破壞「循環等待」最標準的實作作法為何？",
      "back": "全域資源遞增編號排序（Total Ordering of Resources）：為系統所有資源類型編列全域唯一的遞增整數編號 F: R -> N，並強制規定所有行程必須嚴格按照資源編號的「遞增順序」提出請求。若持有 Ri，則只能請求編號 Rj > Ri 的資源，數學上徹底阻斷環狀等待鏈之形成。"
    },
    {
      "id": "fc-19",
      "chapter": "ch5",
      "front": "資源配置圖演算法（RAG Scheme）中的「宣告邊（Claim Edge）」是什麼？",
      "back": "以虛線（Dashed Line）Pi -> Rj 表示。代表行程 Pi 在未來執行過程中「可能會請求」資源 Rj。在死結避免中，只有當將宣告邊轉為實線請求邊再轉為分配邊後，整張圖仍「不包含任何環路」時，系統才批准該次資源分配。"
    },
    {
      "id": "fc-20",
      "chapter": "ch5",
      "front": "主流現代通用作業系統（如 Windows, Linux）為何大多採用「鴕鳥策略（忽視死結）」？",
      "back": "因為在實際通用桌面與伺服器環境中，死結發生的頻率極低，但死結預防（限制資源請求規則）與避免（每次分配皆需計算安全狀態）會帶來極為高昂的運算開銷並大幅降低資源利用率。因此作業系統選擇假裝死結不會發生，將極少數卡死問題交由使用者或管理員手動終止處理。"
    },
    {
      "id": "fc-21",
      "chapter": "ch5",
      "front": "等待圖（Wait-for Graph）適用於何種系統？其節點與邊代表什麼？",
      "back": "適用於「所有資源皆為單一實例（Single Instance）」的系統。\n節點：僅包含行程節點（P1, P2, ...），已將資源節點折疊消除。\n邊：Pi -> Pj 代表行程 Pi 正在等待行程 Pj 釋放資源。\n判定定理：等待圖中存在環路（Cycle）當且僅當系統發生死結！"
    },
    {
      "id": "fc-22",
      "chapter": "ch5",
      "front": "以資源搶佔（Resource Preemption）復原死結時，如何防止特定行程陷入「飢餓（Starvation）」？",
      "back": "若單純以最小代價為考量，特定行程可能會屢次被選為犧牲者（Victim）回滾而永遠無法完成。\n防範作法：在犧牲者代價評估公式中納入「回滾次數（Number of Rollbacks）」權重因子，行程被回滾的次數愈多，其作為犧牲者的代價就大幅提升，確保所有行程最終都能完成。"
    },
    {
      "id": "fc-23",
      "chapter": "ch5",
      "front": "死結避免（Avoidance）與死結預防（Prevention）最核心的差別為何？",
      "back": "先驗資訊與動態評估：\n死結預防（Prevention）：無需事先宣告最大資源需求，而是透過靜態施加嚴格的請求協定，強制破壞四個必要條件之一（代價是資源利用率低）。\n死結避免（Avoidance）：行程必須事先宣告最大資源需求量（Max Demand），作業系統在每次分配時動態評估分配後的系統狀態，確保系統永保在安全狀態（Safe State）。"
    },
    {
      "id": "fc-24",
      "chapter": "ch4",
      "front": "多執行緒行程中，執行緒之間共享哪些資源？各自獨立擁有什麼？",
      "back": "共享資源：程式碼區段（Code / Text）、資料區段（Data / 全域與靜態變數）、堆積區段（Heap / 動態記憶體）、開啟的檔案清單（Open Files）與信號處置。\n各自私有獨立資源：執行緒識別碼（Thread ID）、程式計數器（Program Counter, PC）、暫存器集合（Register Set）、堆疊區段（Stack / 區域變數與函式呼叫框架）。"
    },
    {
      "id": "fc-25",
      "chapter": "ch4",
      "front": "併行（Concurrency）與平行（Parallelism）的本質差異為何？",
      "back": "併行（Concurrency）：系統支援「多個任務同時向前推進（making progress）」。在單一核心上，CPU 透過高頻交替切換排程達成。\n平行（Parallelism）：系統能夠「在同一瞬間同時（simultaneously）執行多個任務」。必須仰賴實體多核心或多處理器硬體支援。\n結論：單核系統能有併行性，但唯有多核心系統才能具備真正的平行性！"
    },
    {
      "id": "fc-26",
      "chapter": "ch4",
      "front": "阿姆達爾定律（Amdahl's Law）的核心公式與啟示為何？",
      "back": "核心公式：$$\\text{Speedup} \\le \\frac{1}{S + \\frac{1 - S}{N}}$$\n$S$ 為循序比例（$0 \\le S \\le 1$），$N$ 為處理器核心數。\n當 $N \\to \\infty$ 時，最大理論加速比極限為 $1/S$。\n啟示：程式中的循序執行部分（Serial Portion）是多核心硬體擴充加速的根本瓶頸，增加核心數之邊際加速效益迅速遞減。"
    },
    {
      "id": "fc-27",
      "chapter": "ch4",
      "front": "三大多執行緒模型（Many-to-One, One-to-One, Many-to-Many）的核心差異與主流系統為何？",
      "back": "1. 多對一（Many-to-One）：多個使用者執行緒對應 1 個核心執行緒。管理極快，但任一執行緒 blocking 導致全體凍結，且多核心無法真平行。代表：Green Threads。\n2. 一對一（One-to-One）：每個使用者執行緒對應專屬核心執行緒。高併行、多核心真平行，但核心開銷較大。代表：Linux, Windows（現代絕對主流！）。\n3. 多對多（Many-to-Many）：多個使用者執行緒映射至相同或較少核心執行緒。兼顧彈性與核心負載。代表：Solaris 8 以前。"
    },
    {
      "id": "fc-28",
      "chapter": "ch4",
      "front": "隱式執行緒（Implicit Threading）中「執行緒池（Thread Pool）」的主要優勢是什麼？",
      "back": "1. 服務請求速度快：直接利用池中已建立待命的既有執行緒，比動態建立新執行緒更迅速。\n2. 綁定資源邊界：限制系統中的執行緒總數上限，防止突發爆量請求耗盡記憶體與 CPU 資源。\n3. 解耦機制與任務：將任務邏輯與執行緒創建排程機制分離，便於實作靈活的排程策略。"
    },
    {
      "id": "fc-29",
      "chapter": "ch3",
      "front": "速率單調排程（RMS）與最早截止時間優先（EDF）的優先權判定準則各為何？",
      "back": "速率單調排程（RMS）：靜態優先權。依週期的倒數（1/p）指派，週期愈短優先權愈高。2 個行程理論利用率上限約 82.8%，無限行程極限約 69.3%。\n最早截止時間優先（EDF）：動態優先權。依下一次截止時間（Deadline）指派，截止時間愈早優先權愈高。理論 CPU 利用率最高可達 100%。"
    }
  ],
  "quizQuestions": [
    {
      "id": "q1",
      "chapter": "ch1",
      "type": "single",
      "question": "下列關於作業系統「多道程式設計（Multiprogramming）」的敘述，何者最為正確？",
      "options": [
        "目標是創造回應時間小於 1 秒的使用者互動體驗",
        "核心目的在於讓 CPU 與 I/O 裝置保持忙碌，以最大化 CPU 利用率",
        "必須在多個 CPU 核心的架構下才能實現",
        "行程在記憶體不足時會被永久終止"
      ],
      "answer": 1,
      "explanation": "多道程式設計（Multiprogramming）的核心目的是最大化 CPU 利用率（CPU Utilization）。當前作業等待 I/O 時，OS 切換執行另一作業。選項 A 是分時系統（Timesharing）的特徵；多道程式設計在單一 CPU 上即可實施。",
      "category": "concept"
    },
    {
      "id": "q2",
      "chapter": "ch1",
      "type": "single",
      "question": "在儲存階層金字塔（Storage Hierarchy）中，由最快到最慢的排列順序何者正確？",
      "options": [
        "Registers -> Cache -> Main memory -> Solid-state disk -> Magnetic disk",
        "Cache -> Registers -> Main memory -> Magnetic disk -> Solid-state disk",
        "Registers -> Main memory -> Cache -> Solid-state disk -> Magnetic disk",
        "Main memory -> Registers -> Cache -> Solid-state disk -> Optical disk"
      ],
      "answer": 0,
      "explanation": "標準階層順序由頂至底：Registers（暫存器）-> Cache（快取）-> Main memory（主記憶體）-> Solid-state disk（固態硬碟）-> Magnetic disk（傳統磁碟）-> Optical disk -> Magnetic tapes。",
      "category": "concept"
    },
    {
      "id": "q3",
      "chapter": "ch1",
      "type": "single",
      "question": "使用直接記憶體存取（DMA, Direct Memory Access）機制時，中斷發生的時機為何？",
      "options": [
        "每傳輸完成 1 個 Byte 就產生一次中斷",
        "由 CPU 每隔固定週期主動查詢，不產生中斷",
        "整塊資料區塊（Block）傳輸完成後才產生一次中斷",
        "僅在傳輸發生錯誤時才引發中斷"
      ],
      "answer": 2,
      "explanation": "DMA 專為高速 I/O 設計，控制器直接於緩衝區與主記憶體間傳遞資料區塊，每傳輸完整個 Block 才引發一次中斷，大幅減少 CPU 中斷次數。",
      "category": "concept"
    },
    {
      "id": "q4",
      "chapter": "ch1",
      "type": "single",
      "question": "當使用者程式執行「特權指令（Privileged Instruction）」時，若當前處於使用者模式（User Mode），系統會如何反應？",
      "options": [
        "硬體直接忽視該指令並繼續執行下一行",
        "硬體會將該指令視為非法，引發陷阱（Trap / Exception）交給 OS 處理",
        "CPU 會自動無條件切換為核心模式並直接執行該指令",
        "系統直接將主機強制重開機"
      ],
      "answer": 1,
      "explanation": "特權指令僅能在核心模式下執行。在使用者模式下嘗試執行特權指令會被硬體阻擋，並引發陷阱（Trap/Exception），OS 會接管並通常終止該違規程式。",
      "category": "concept"
    },
    {
      "id": "q5",
      "chapter": "ch1",
      "type": "single",
      "question": "多處理器系統（Multiprocessor Systems）具備容錯與優雅降級（Graceful Degradation）能力，這是指下列哪項優點？",
      "options": [
        "提高吞吐量（Increased Throughput）",
        "規模經濟（Economy of Scale）",
        "提高可靠性（Increased Reliability）",
        "降低存取延遲（Lower Latency）"
      ],
      "answer": 2,
      "explanation": "當系統中部分處理器故障，剩餘處理器仍能支撐系統繼續運轉，此能力即為可靠性（Reliability）與優雅降級。",
      "category": "concept"
    },
    {
      "id": "q6",
      "chapter": "ch2",
      "type": "single",
      "question": "在三種排程器中，哪一個排程器負責控制「多道程式設計的程度（Degree of Multiprogramming）」？",
      "options": [
        "短期排程器（Short-term scheduler）",
        "長期排程器（Long-term scheduler）",
        "中期排程器（Medium-term scheduler）",
        "分派器（Dispatcher）"
      ],
      "answer": 1,
      "explanation": "長期排程器（Job scheduler）執行頻率較低，負責從磁碟決定挑選多少作業載入主記憶體，因此直接控制多道程式設計的程度。",
      "category": "concept"
    },
    {
      "id": "q7",
      "chapter": "ch2",
      "type": "single",
      "question": "在有界限緩衝區（Bounded-Buffer）實作中，若緩衝區大小為 BUFFER_SIZE = 8，in 與 out 均為整數指標，當滿足下列何種條件時判定緩衝區已滿？",
      "options": [
        "in == out",
        "(in + 1) % 8 == out",
        "(in + 8) % 8 == out",
        "in - out == 8"
      ],
      "answer": 1,
      "explanation": "有界限緩衝區滿的條件為 ((in + 1) % BUFFER_SIZE) == out。此時保留一格空位以避免與 in == out（緩衝區為空）混淆。",
      "category": "concept"
    },
    {
      "id": "q8",
      "chapter": "ch2",
      "type": "single",
      "question": "當父行程在 UNIX 系統中執行 fork() 建立子行程後，下列何者敘述正確？",
      "options": [
        "子行程與父行程共用相同的 Stack 與 Heap 記憶體位址內容，不會複製",
        "子行程獲得父行程位址空間的完整獨立複製副本（Duplicate）",
        "父行程會自動被系統刪除",
        "fork() 對父行程與子行程均傳回整數 0"
      ],
      "answer": 1,
      "explanation": "fork() 建立的子行程擁有父行程位址空間的完整副本。fork() 在父行程中傳回子行程的 PID，在子行程中傳回 0。",
      "category": "concept"
    },
    {
      "id": "q9",
      "chapter": "ch2",
      "type": "single",
      "question": "關於普通管道（Ordinary Pipes）與具名管道（Named Pipes）的比較，下列何者錯誤？",
      "options": [
        "普通管道是單向通訊（Unidirectional）",
        "普通管道通訊的兩行程之間必須具有父子或親屬關係",
        "具名管道在建立它的行程終止後會立刻被系統銷毀",
        "具名管道支援雙向通訊（Bi-directional）且無須親屬關係"
      ],
      "answer": 2,
      "explanation": "選項 C 錯誤。具名管道（Named Pipes / FIFOs）在行程終止後仍會留存在檔案系統中，直到被顯式刪除。",
      "category": "concept"
    },
    {
      "id": "q10",
      "chapter": "ch2",
      "type": "single",
      "question": "Google Chrome 瀏覽器為每個網頁標籤（Tab）獨立配置一個 Renderer 行程，其主要設計目的為何？",
      "options": [
        "減少記憶體使用量",
        "單一分頁崩潰時不影響整個瀏覽器，並透過沙盒提升安全性",
        "使所有分頁能共享同一個 JavaScript 執行緒",
        "降低 CPU 快取未命中率"
      ],
      "answer": 1,
      "explanation": "Chrome 的多行程架構讓渲染引擎獨立於沙盒中運行，即使某分頁崩潰或含有惡意程式碼，也不會導致主瀏覽器崩潰或侵害主機系統。",
      "category": "concept"
    },
    {
      "id": "q11",
      "chapter": "ch3",
      "type": "single",
      "question": "下列哪一種排程情況「不屬於」非搶占式（Nonpreemptive）排程的時機點？",
      "options": [
        "行程由 Running 狀態轉為 Waiting 狀態（例如要求 I/O）",
        "行程終止（Terminates）",
        "行程由 Running 狀態因時間片到期而轉為 Ready 狀態",
        "行程主動呼叫 wait() 等待子行程"
      ],
      "answer": 2,
      "explanation": "當行程由 Running 轉為 Ready（如時間片到期或高優先權中斷）屬於搶占式（Preemptive）排程。非搶占式只在 Running -> Waiting 或 Terminate 時才進行排程。",
      "category": "concept"
    },
    {
      "id": "q12",
      "chapter": "ch3",
      "type": "single",
      "question": "三個行程 P1(24 ms), P2(3 ms), P3(3 ms) 均在時間 0 到達 Ready queue。若採用 FCFS 且到達順序為 P1 -> P2 -> P3，其平均等待時間（Average Waiting Time）為多少？",
      "options": [
        "3 ms",
        "17 ms",
        "27 ms",
        "9 ms"
      ],
      "answer": 1,
      "explanation": "各行程等待時間：P1 = 0 ms；P2 等待 P1 完成 = 24 ms；P3 等待 P1+P2 完成 = 24 + 3 = 27 ms。平均等待時間 = (0 + 24 + 27) / 3 = 51 / 3 = 17 ms（典型護衛效應）。",
      "category": "calc"
    },
    {
      "id": "q13",
      "chapter": "ch3",
      "type": "single",
      "question": "承上題，若改採最短工作優先（SJF，順序 P2 -> P3 -> P1），其平均等待時間為多少？",
      "options": [
        "3 ms",
        "6 ms",
        "17 ms",
        "2 ms"
      ],
      "answer": 0,
      "explanation": "順序 P2 -> P3 -> P1。等待時間：P2 = 0 ms；P3 等待 P2 = 3 ms；P1 等待 P2+P3 = 3 + 3 = 6 ms。平均等待時間 = (0 + 3 + 6) / 3 = 9 / 3 = 3 ms。大幅優於 FCFS 的 17 ms！",
      "category": "calc"
    },
    {
      "id": "q14",
      "chapter": "ch3",
      "type": "single",
      "question": "在 Round Robin（RR）排程中，若就緒佇列有 n 個行程，時間量子為 q，則任何行程每次等待 CPU 的時間上限不超過多少？",
      "options": [
        "n * q",
        "(n - 1) * q",
        "q / n",
        "(n + 1) * q"
      ],
      "answer": 1,
      "explanation": "在包含 n 個行程的環狀佇列中，每個行程最多執行 q 時間單位，因此任一行程至多等待其餘 (n - 1) 個行程各執行完一次，即等待上限為 (n - 1) * q。",
      "category": "calc"
    },
    {
      "id": "q15",
      "chapter": "ch3",
      "type": "single",
      "question": "在多層回饋佇列排程（MFQ）中，防止行程發生飢餓（Starvation）的核心機制為何？",
      "options": [
        "將時間量子設定為無窮大",
        "使用老化技術（Aging），將長時間等待的行程向上升級至較高優先權佇列",
        "強制所有佇列一律改採 FCFS",
        "限制系統中的行程總數不超過 3 個"
      ],
      "answer": 1,
      "explanation": "多層回饋佇列透過老化技術（Aging / Promotion），讓低層佇列中長時間等待的行程逐步升級至高優先權佇列，徹底防止飢餓。",
      "category": "concept"
    },
    {
      "id": "q16",
      "chapter": "ch3",
      "type": "single",
      "question": "下列關於「分派延遲（Dispatch Latency）」的定義，何者最精確？",
      "options": [
        "行程從就緒佇列進入執行狀態所經過的總等待時間",
        "分派器停止一個行程並啟動另一個行程所需花費的系統時間",
        "CPU 發生快取未命中等待記憶體載入的時間",
        "定時器中斷倒數一個時間量子所需的時間"
      ],
      "answer": 1,
      "explanation": "分派延遲（Dispatch Latency）是分派器停止當前行程、保存其上下文、載入新行程上下文並跳轉至該行程執行的時間開銷。",
      "category": "concept"
    },
    {
      "id": "q17",
      "chapter": "ch1",
      "type": "single",
      "question": "開機引導程式（Bootstrap Program）通常儲存在哪一種儲存媒體中？",
      "options": [
        "隨機存取記憶體（RAM）",
        "唯讀記憶體或 EPROM（ROM / 韌體 Firmware）",
        "傳統磁碟（HDD）的最後一個磁區",
        "高速 CPU L1 快取"
      ],
      "answer": 1,
      "explanation": "Bootstrap 程式必須在斷電後仍能保存，因此存放於非揮發性的 ROM 或 EPROM（韌體 Firmware / BIOS / UEFI）。",
      "category": "concept"
    },
    {
      "id": "q18",
      "chapter": "ch3",
      "type": "single",
      "question": "在指數平均法預測下次 CPU burst 時間公式 τ[n+1] = α * t[n] + (1 - α) * τ[n] 中，若設定 α = 1，代表什麼意義？",
      "options": [
        "完全忽視最近一次的實際歷史，只保留歷史預測",
        "僅採用最近一次實際的 CPU burst 時間，完全不考慮更早的歷史預測",
        "預測時間恆等於 0",
        "演算法退化為 Round Robin"
      ],
      "answer": 1,
      "explanation": "當 α = 1 時，τ[n+1] = 1 * t[n] + 0 = t[n]，代表完全採計最近一次的實際執行時間 t[n] 作為下一次預測。",
      "category": "concept"
    },
    {
      "id": "q19",
      "chapter": "ch1",
      "type": "single",
      "question": "從電腦觀點（Computer View）來看，作業系統在系統架構中主要扮演哪兩大關鍵角色？",
      "options": [
        "繪圖加速者與文字編輯器",
        "資源分配者（Resource Allocator）與控制程式（Control Program）",
        "唯讀記憶體與匯流排仲裁者",
        "編譯器優化者與網路交換器"
      ],
      "answer": 1,
      "explanation": "電腦觀點下，OS 是資源分配者（在衝突請求中做出高效公平決定）以及控制程式（控制程式執行以防錯誤與不當使用）。",
      "category": "concept"
    },
    {
      "id": "q20",
      "chapter": "ch1",
      "type": "single",
      "question": "在叢集系統（Clustered Systems）中，關於非對稱叢集（Asymmetric Clustering）的敘述何者正確？",
      "options": [
        "所有伺服器節點同時執行使用者應用程式並互相監視",
        "有一台機器處於熱備援模式（Hot-Standby Mode），僅監視活動伺服器，故障時才接手",
        "各節點之間完全不共享任何儲存設備",
        "不需要任何網路連結即可維持高可用性"
      ],
      "answer": 1,
      "explanation": "非對稱叢集中有一台機器處於熱備援（Hot-Standby）模式，僅監控主伺服器；對稱叢集則是多個節點同時執行任務。",
      "category": "concept"
    },
    {
      "id": "q21",
      "chapter": "ch1",
      "type": "single",
      "question": "在 Linux 核心常見資料結構中，平衡二元搜尋樹（Balanced Binary Search Tree，如紅黑樹）的搜尋時間複雜度為何？",
      "options": [
        "O(1)",
        "O(n)",
        "O(log n)",
        "O(n log n)"
      ],
      "answer": 2,
      "explanation": "一般二元樹在最糟情況搜尋為 O(n)，而平衡二元搜尋樹（Balanced BST，如 Linux rbtree）保證樹高平衡，搜尋效能提升為 O(log n)。",
      "category": "concept"
    },
    {
      "id": "q22",
      "chapter": "ch2",
      "type": "single",
      "question": "行程在主記憶體結構中劃分為四大區段，程式在執行期間由程式設計師動態配置的記憶體（例如 malloc 或 new）屬於哪一區段？",
      "options": [
        "Text Section",
        "Data Section",
        "Stack Section",
        "Heap Section（堆積）"
      ],
      "answer": 3,
      "explanation": "Heap（堆積）負責動態記憶體配置；Stack 負責區域變數與函式呼叫暫存；Data 存放全域變數；Text 存放程式碼。",
      "category": "concept"
    },
    {
      "id": "q23",
      "chapter": "ch2",
      "type": "single",
      "question": "在行程五大狀態模型中，當正在執行的行程（Running）發起 I/O 請求以等待裝置資料時，該行程會轉換為何種狀態？",
      "options": [
        "Ready 狀態",
        "Waiting 狀態",
        "Terminated 狀態",
        "New 狀態"
      ],
      "answer": 1,
      "explanation": "當行程等待特定事件發生（如 I/O 操作完成或接收信號）時，會進入 Waiting 狀態；等到 I/O 完成後才轉入 Ready 狀態。",
      "category": "concept"
    },
    {
      "id": "q24",
      "chapter": "ch2",
      "type": "single",
      "question": "中期排程器（Medium-term scheduler）的主要運作機制為下列何者？",
      "options": [
        "從磁碟挑選作業進主記憶體，控制多道程式設計程度",
        "每毫秒高頻切換 CPU 分派給 Ready queue 的行程",
        "透過調換（Swapping）將行程從記憶體移出至磁碟，降低系統多道程式設計程度",
        "負責在父子行程間建立具名管道"
      ],
      "answer": 2,
      "explanation": "中期排程器的核心機制是 Swapping（調換），在記憶體吃緊時將行程移出至磁碟（Swap out），之後再載入（Swap in）。",
      "category": "concept"
    },
    {
      "id": "q25",
      "chapter": "ch2",
      "type": "single",
      "question": "在 UNIX 系統呼叫中，exec() 系統呼叫的主要功用為何？",
      "options": [
        "建立一個完整的子行程副本",
        "用新程式的記憶體位址空間與二進位內容覆蓋當前行程並開始執行",
        "暫停父行程直到子行程終止",
        "釋放行程所有記憶體並向系統發出結束通知"
      ],
      "answer": 1,
      "explanation": "fork() 用於複製建立子行程，而 exec() 則用新二進位程式碼覆蓋當前行程空間開始執行新任務。",
      "category": "concept"
    },
    {
      "id": "q26",
      "chapter": "ch2",
      "type": "single",
      "question": "在行程間訊息傳遞（Message Passing）機制中，若通訊鏈結容量為「零容量（Zero capacity）」，則傳送者必須如何反應？",
      "options": [
        "發送訊息後立即返回，不管接收者狀態",
        "傳送者必須原地阻塞等待，直到接收者接收該訊息為止（稱為會合 Rendezvous）",
        "訊息會被儲存至磁碟暫存區",
        "系統會自動引發 Mode Bit 切換錯誤中斷"
      ],
      "answer": 1,
      "explanation": "零容量（Zero capacity）代表佇列長度為 0，傳送端與接收端必須同時就位完成交遞，此機制稱為會合（Rendezvous）。",
      "category": "concept"
    },
    {
      "id": "q27",
      "chapter": "ch2",
      "type": "single",
      "question": "Windows 系統內部採用的高級本地程序呼叫（ALPC）機制中，針對大型訊息（Large messages）採用何種策略傳送？",
      "options": [
        "在核心訊息佇列中直接逐字元複製傳送",
        "透過共享記憶體區段（Section Object）傳送以避免資料搬移開銷",
        "強制切割為 1024 個封包透過 RPC 傳輸",
        "直接寫入傳統磁碟的虛擬分頁檔"
      ],
      "answer": 1,
      "explanation": "Windows ALPC 小訊息直接在佇列中複製，大訊息則透過共享記憶體區段（Section Object）避免大規模複製的高昂負擔。",
      "category": "concept"
    },
    {
      "id": "q28",
      "chapter": "ch2",
      "type": "single",
      "question": "遠端程序呼叫（RPC）中，為了解決不同主機硬體架構間位元組順序（Big-endian 與 Little-endian）的格式差異，採用了何種技術？",
      "options": [
        "外部資料表示法（XDR, External Data Representation）",
        "先進先出管道（FIFO）",
        "微核心埠口（Microkernel Ports）",
        "輪詢暫存器機制（Polling Register）"
      ],
      "answer": 0,
      "explanation": "RPC 使用外部資料表示法（XDR）統一位元組編碼格式，確保不同架構機器相互通訊時資料能正確解譯。",
      "category": "concept"
    },
    {
      "id": "q29",
      "chapter": "ch3",
      "type": "single",
      "question": "在五大排程效能指標中，理想的排程演算法通常追求哪兩個指標的「最大化（Maximize）」？",
      "options": [
        "等待時間與轉向時間",
        "CPU 利用率（CPU Utilization）與吞吐量（Throughput）",
        "回應時間與分派延遲",
        "上下文切換時間與護衛效應"
      ],
      "answer": 1,
      "explanation": "最佳化目標：最大化 CPU 利用率與吞吐量；最小化轉向時間、等待時間與回應時間。",
      "category": "concept"
    },
    {
      "id": "q30",
      "chapter": "ch3",
      "type": "single",
      "question": "優先權排程（Priority Scheduling）中，解決低優先權行程可能永久飢餓（Starvation）的核心方法為何？",
      "options": [
        "老化技術（Aging），隨著等待時間增加動態逐步提升其優先權",
        "直接將所有低優先權行程強制刪除",
        "將時間量子設為 0",
        "禁止使用搶占式排程"
      ],
      "answer": 0,
      "explanation": "老化技術（Aging）是解決飢餓的標準做法，系統隨著行程在就緒佇列等待時間增加，動態逐步調高其優先權，保證最終一定會被執行。",
      "category": "concept"
    },
    {
      "id": "q31",
      "chapter": "ch3",
      "type": "single",
      "question": "多處理器排程中的「處理器親和性（Processor Affinity）」特性，其主要考量為何？",
      "options": [
        "避免行程在切換至其他 CPU 時，產生快取資料失效（Cache Invalidation）與重新載入的高額負擔",
        "確保每個 CPU 的運作頻率完全相等",
        "防止系統執行任何 I/O 密集型工作",
        "強制所有行程都必須以多執行緒執行"
      ],
      "answer": 0,
      "explanation": "當行程在某 CPU 上運作時快取會填入其資料。若遷移至其他 CPU，原快取失效且需重新暖機載入，帶來沉重負擔。親和性即儘量讓行程維持在同 CPU。",
      "category": "concept"
    },
    {
      "id": "q32",
      "chapter": "ch3",
      "type": "single",
      "question": "在對稱多處理（SMP）負載平衡中，「推式遷移（Push Migration）」的具體運作方式為何？",
      "options": [
        "當某 CPU 閒置時，該 CPU 主動由其他繁忙 CPU 佇列拉取行程",
        "由獨立的監控任務定期檢查負載，主動將行程從繁忙 CPU 推往閒置或低負載 CPU",
        "強制將所有行程集中於 Core 0 執行",
        "由使用者手動發出特權指令指定遷移"
      ],
      "answer": 1,
      "explanation": "推式遷移（Push Migration）由系統定期排程任務檢查，發現不均衡時將任務從繁忙 CPU 推往閒置 CPU；拉式遷移（Pull Migration）則是閒置 CPU 主動去拉取。",
      "category": "concept"
    },
    {
      "id": "q33",
      "chapter": "ch3",
      "type": "single",
      "question": "當 CPU 發生快取未命中（Cache Miss）需要等待從主記憶體讀取資料時，所產生的長時間硬體等待延遲稱為什麼？",
      "options": [
        "護衛效應（Convoy Effect）",
        "記憶體停頓（Memory Stall）",
        "死鎖（Deadlock）",
        "分派延遲（Dispatch Latency）"
      ],
      "answer": 1,
      "explanation": "當存取記憶體需耗費數百個 CPU 週期等待時稱為 Memory Stall。現代晶片利用硬體多執行緒（如超執行緒）切換執行緒來隱藏此延遲。",
      "category": "concept"
    },
    {
      "id": "q34",
      "chapter": "ch3",
      "type": "single",
      "question": "多層佇列排程（Multilevel Queue）與多層回饋佇列（Multilevel Feedback Queue, MFQ）的最核心差異為何？",
      "options": [
        "多層佇列不支援 Round Robin",
        "多層佇列的行程被永久固定於特定子佇列中，而 MFQ 允許行程在不同佇列間升降級流動",
        "MFQ 只能使用在單核心單晶片架構",
        "多層佇列完全不會發生飢餓現象"
      ],
      "answer": 1,
      "explanation": "固定多層佇列（Multilevel Queue）中行程被永久指派於特定佇列；MFQ 則允許行程依執行時間長短動態在佇列間降級或透過老化升級。",
      "category": "concept"
    },
    {
      "id": "q35",
      "chapter": "ch3",
      "type": "single",
      "question": "在指數平均法預測 CPU burst 時間公式 τ[n+1] = α * t[n] + (1 - α) * τ[n] 中，若設定 α = 0，代表何種涵義？",
      "options": [
        "完全忽視最近一次的實際執行時間，預測值完全沿用上一輪的歷史預測 τ[n]",
        "預測時間直接歸零",
        "只採計最近一次實際執行時間",
        "系統強行搶占目前行程"
      ],
      "answer": 0,
      "explanation": "當 α = 0 時，τ[n+1] = 0 + 1 * τ[n] = τ[n]，代表完全無視最近一次的實際時間 t[n]，預測值維持原狀。",
      "category": "concept"
    },
    {
      "id": "q36",
      "chapter": "ch3",
      "type": "single",
      "question": "Round Robin 排程演算法中，選擇時間量子（Time Quantum q）的一般經驗法則是下列何者？",
      "options": [
        "時間量子應大於 1000 秒",
        "約 80% 的 CPU burst 長度應小於時間量子 q",
        "時間量子必須等於上下文切換時間",
        "時間量子必須隨行程數量線性遞減"
      ],
      "answer": 1,
      "explanation": "教材經典準則：時間量子相較於 Context switch 必須足夠大，且約 80% 的 CPU burst 應該小於 q，如此能讓多數短行程一次完成，減少切換開銷。",
      "category": "calc"
    },
    {
      "id": "q37",
      "chapter": "ch5",
      "type": "single",
      "question": "【教材經典計算題】假設系統中有 5 個行程（P0~P4）與 3 種資源（A: 10, B: 5, C: 7）。在時間點 T0 時 Allocation[P1]=(2, 0, 0)，Max[P1]=(3, 2, 2)，Allocation[P3]=(2, 1, 1)，Max[P3]=(2, 2, 2)。請推導 P1 與 P3 的尚需資源向量 Need1 與 Need3 分別為何？",
      "options": [
        "Need1 = (1, 2, 2)，Need3 = (0, 1, 1)",
        "Need1 = (5, 2, 2)，Need3 = (4, 3, 3)",
        "Need1 = (1, 0, 2)，Need3 = (2, 1, 1)",
        "Need1 = (3, 2, 2)，Need3 = (2, 2, 2)"
      ],
      "answer": 0,
      "explanation": "依據銀行家演算法公式 Need = Max - Allocation：\nNeed1 = (3, 2, 2) - (2, 0, 0) = (1, 2, 2)\nNeed3 = (2, 2, 2) - (2, 1, 1) = (0, 1, 1)。",
      "category": "calc"
    },
    {
      "id": "q38",
      "chapter": "ch5",
      "type": "single",
      "question": "【教材經典計算題】承上題，在時間點 T0 時系統可用資源 Available = (3, 3, 2)，各行程 Need 分別為：P0:(7,4,3), P1:(1,2,2), P2:(6,0,0), P3:(0,1,1), P4:(4,3,1)。依據安全演算法（Safety Algorithm），下列何者為一組滿足系統安全狀態之合法安全序列？",
      "options": [
        "<P0, P1, P2, P3, P4>",
        "<P1, P3, P4, P2, P0>",
        "<P2, P1, P3, P4, P0>",
        "<P4, P3, P2, P1, P0>"
      ],
      "answer": 1,
      "explanation": "Work=(3,3,2)。\n1. Need1(1,2,2) ≤ (3,3,2) ⇒ P1 執行後釋放 Allocation1(2,0,0)，Work變為 (5,3,2)；\n2. Need3(0,1,1) ≤ (5,3,2) ⇒ P3 釋放 Allocation3(2,1,1)，Work變為 (7,4,3)；\n3. Need4(4,3,1) ≤ (7,4,3) ⇒ P4 釋放 Allocation4(0,0,2)，Work變為 (7,4,5)；\n4. Need2(6,0,0) ≤ (7,4,5) ⇒ P2 釋放 Allocation2(3,0,2)，Work變為 (10,4,7)；\n5. Need0(7,4,3) ≤ (10,4,7) ⇒ P0 執行完畢。\n合法安全序列為 <P1, P3, P4, P2, P0>。",
      "category": "calc"
    },
    {
      "id": "q39",
      "chapter": "ch5",
      "type": "single",
      "question": "【教材經典計算題】在 T0 狀態下（Available=(3,3,2)），若行程 P1 提出了資源請求 Request1 = (1, 0, 2)，系統能否立即批准分配？其推導依據為何？",
      "options": [
        "不能批准，因為 Request1 超出了 P1 宣告的 Need1",
        "不能批准，因為系統可用資源 Available 不足",
        "可以立即批准，因為 Request1 ≤ Need1 且 Request1 ≤ Available，假裝分配後可找到安全序列 <P1, P3, P4, P0, P2> 維持安全狀態",
        "不能批准，因為分配後系統會立即陷入死結"
      ],
      "answer": 2,
      "explanation": "依資源請求演算法：\n1. Request1(1,0,2) ≤ Need1(1,2,2)（符合）\n2. Request1(1,0,2) ≤ Available(3,3,2)（符合）\n3. 假裝分配後新 Available = (3,3,2) - (1,0,2) = (2,3,0)，Allocation1 變 (3,0,2)，Need1 變 (0,2,0)。\n執行安全演算法可推導出安全序列 <P1, P3, P4, P0, P2>，系統仍處於安全狀態，故可立即批准。",
      "category": "calc"
    },
    {
      "id": "q40",
      "chapter": "ch5",
      "type": "single",
      "question": "【教材經典計算題】在 P1 的請求獲批後（此時可用資源 Available = (2, 3, 0)），若行程 P4 提出 Request4 = (3, 3, 0)，系統將如何處置？",
      "options": [
        "立即批准分配，因為 P4 是高優先權行程",
        "無法批准分配，P4 必須等待，因為對資源 A 的需求 3 大於目前可用實例數 2",
        "直接強制終止 P4 行程並回收其資源",
        "立即批准分配，並強行搶佔 P1 的資源 A"
      ],
      "answer": 1,
      "explanation": "此時 Available = (2, 3, 0)，Request4 = (3, 3, 0)。檢查條件 Request4 ≤ Available 時，資源 A 需要 3 個但目前僅剩 2 個（3 > 2），不符合分配條件，故 P4 必須進入等待狀態。",
      "category": "calc"
    },
    {
      "id": "q41",
      "chapter": "ch5",
      "type": "single",
      "question": "【教材經典計算題】在 P1 請求獲批且 P4 等待的狀態下（Available = (2, 3, 0)），若行程 P0 提出 Request0 = (0, 2, 0)，系統能否批准？",
      "options": [
        "可以批准，因為 Request0 ≤ Need0 且 Request0 ≤ Available，經安全性演算法驗證後系統仍可維持安全狀態",
        "不能批准，因為 Request0 超過了 P0 宣告的 Need0",
        "不能批准，因為資源 B 目前已被完全鎖定",
        "不能批准，因為系統 Available 向量中資源 C 為 0"
      ],
      "answer": 0,
      "explanation": "依講義與經典考題解析：Request0(0,2,0) ≤ Need0(7,4,3) 且 Request0(0,2,0) ≤ Available(2,3,0)，經安全演算法測試判定可維持系統安全狀態，故可以批准分配。",
      "category": "calc"
    },
    {
      "id": "q42",
      "chapter": "ch5",
      "type": "single",
      "question": "【教材經典計算題】在多重實例死結偵測題目中，5 個行程（P0~P4）與 3 種資源（A=7, B=2, C=6），時間點 T0 時 Available = (0, 0, 0)，Allocation 分別為 P0:(0,1,0), P1:(2,0,0), P2:(3,0,3), P3:(2,1,1), P4:(0,0,2)；當前 Request 為 P0:(0,0,0), P1:(2,0,2), P2:(0,0,0), P3:(1,0,0), P4:(0,0,2)。請問 T0 時系統狀態為何？",
      "options": [
        "系統已陷入死結，陷入死結的行程為 {P1, P4}",
        "系統處於死結，陷入死結的行程為 {P1, P2, P3, P4}",
        "系統未發生死結，所有行程皆可順利執行完畢，一組執行序列為 <P0, P2, P3, P1, P4>",
        "系統已死結，因為 Available 初始全為 0"
      ],
      "answer": 2,
      "explanation": "Work 初始為 (0,0,0)：\n1. P0 之 Request0=(0,0,0) ≤ Work ⇒ P0 完成釋放 (0,1,0)，Work=(0,1,0)；\n2. P2 之 Request2=(0,0,0) ≤ Work ⇒ P2 完成釋放 (3,0,3)，Work=(3,1,3)；\n3. P3 之 Request3=(1,0,0) ≤ Work ⇒ P3 完成釋放 (2,1,1)，Work=(5,2,4)；\n4. P1 之 Request1=(2,0,2) ≤ Work ⇒ P1 完成釋放 (2,0,0)，Work=(7,2,4)；\n5. P4 之 Request4=(0,0,2) ≤ Work ⇒ P4 完成釋放 (0,0,2)，Work=(7,2,6)。\n所有行程 Finish[i]=true，系統未發生死結，序列為 <P0, P2, P3, P1, P4>。",
      "category": "calc"
    },
    {
      "id": "q43",
      "chapter": "ch5",
      "type": "single",
      "question": "【教材經典計算題】承上題，若此時行程 P2 額外提出了一個資源請求 Request2 = (0, 0, 1)，此時系統將發生何種變化？",
      "options": [
        "系統仍未死結，所有行程依然能順利完成",
        "系統將陷入死結狀態，陷入死結的行程集合為 {P1, P2, P3, P4}",
        "僅有行程 P2 陷入死結，其餘行程不受影響",
        "系統立即自動終止 P0 行程"
      ],
      "answer": 1,
      "explanation": "當 P2 提出 (0,0,1) 後，P2 的請求不再為 (0,0,0)。此時系統中唯一 Request ≤ Work(0,0,0) 的行程僅剩 P0。\nP0 完成後釋放資源使 Work 變為 (0,1,0)。\n但 Work=(0,1,0) 無法滿足任何其餘行程之請求（P1需要A=2,C=2；P2需要C=1；P3需要A=1；P4需要C=2）。\n因此演算法終止，Finish 為 false 的行程為 P1, P2, P3, P4，系統陷入死結，陷入集合為 {P1, P2, P3, P4}。",
      "category": "calc"
    },
    {
      "id": "q44",
      "chapter": "ch5",
      "type": "single",
      "question": "關於資源配置圖（Resource-Allocation Graph, RAG）與死結之關係，下列敘述何者完全正確？",
      "options": [
        "若資源配置圖中存在環路（Cycle），則系統必定處於死結狀態",
        "若資源配置圖中沒有環路，則系統絕對不會發生死結；若存在環路，僅在每種資源皆為單一實例時才必然死結",
        "只要每種資源類型有多個實例，即使有環路也絕不可能發生死結",
        "資源配置圖中的邊只能由資源指向行程，不能由行程指向資源"
      ],
      "answer": 1,
      "explanation": "無環路（No Cycle）是系統絕不死結的充分條件。若有環路，在單一實例下必然死結；在多實例下僅代表可能死結，需透過演算法進一步判定。",
      "category": "concept"
    },
    {
      "id": "q45",
      "chapter": "ch5",
      "type": "single",
      "question": "在死結預防（Deadlock Prevention）策略中，若採用「要求行程在開始執行前必須一次申請並獲配所有資源」之協定，主要是在破壞哪一個必要條件？其主要缺點為何？",
      "options": [
        "破壞互斥條件；缺點為造成 CPU 頻繁中斷",
        "破壞持有並等待（Hold and Wait）條件；缺點為資源利用率低下且易引發飢餓（Starvation）",
        "破壞不可搶佔條件；缺點為排程演算法退化為 FCFS",
        "破壞循環等待條件；缺點為需要動態維護優先權佇列"
      ],
      "answer": 1,
      "explanation": "規定一次性獲配全部資源，或無資源時才能提出申請，是破壞「持有並等待」條件。其主要代價是資源被閒置佔用導致利用率極低，且需求多項資源的行程容易長時間等待而陷入飢餓。",
      "category": "concept"
    },
    {
      "id": "q46",
      "chapter": "ch5",
      "type": "single",
      "question": "在死結預防中，破壞「循環等待（Circular Wait）」條件最標準且最常使用的實作策略為何？",
      "options": [
        "要求所有行程每隔 10 毫秒自願釋放所有持有的資源",
        "對所有資源類型給予全域的總排序編號，規定所有行程必須依編號遞增順序申請資源",
        "將所有資源全部設定為唯讀共用",
        "強制系統僅允許執行單一行程"
      ],
      "answer": 1,
      "explanation": "破壞循環等待的標準方式是對所有資源進行全域總排序（Total Ordering），並要求行程嚴格按照遞增順序提出申請，數學上可證明此規則下無法形成環狀等待鏈。",
      "category": "concept"
    },
    {
      "id": "q47",
      "chapter": "ch5",
      "type": "single",
      "question": "在死結三大處置策略（預防 Prevention、避免 Avoidance、偵測 Detection）的比較中，何者必須要求行程事先宣告「最大資源需求量（Max Demand）」之先驗資訊？",
      "options": [
        "死結預防（Prevention）",
        "死結避免（Avoidance）",
        "死結偵測（Detection）",
        "忽視死結（Ostrich）"
      ],
      "answer": 1,
      "explanation": "死結避免（如銀行家演算法）的核心在於動態判斷分配後是否能維持在安全狀態，這必須以各行程事先宣告的最大需求量（Max Demand）作為先驗資訊。",
      "category": "concept"
    },
    {
      "id": "q48",
      "chapter": "ch5",
      "type": "single",
      "question": "當系統陷入死結並決定採用「逐一終止行程（Abort one process at a time）」來打破死結時，下列何者不是挑選受害行程（Victim）的合理評估指標？",
      "options": [
        "行程的優先權（Priority）高低",
        "行程已計算的時間與距離完成還需要的時間",
        "行程名稱英文字母之 ASCII 碼排序",
        "行程目前已佔用的資源數量與類型，以及打破循環總共需要終止的行程數量"
      ],
      "answer": 2,
      "explanation": "評估終止行程的 6 大因素為：優先權、已計算與剩餘時間、已佔用資源量、剩餘所需資源量、需終止行程數、互動式或批次。行程名稱的字母排序與系統代價完全無關。",
      "category": "concept"
    },
    {
      "id": "q49",
      "chapter": "ch5",
      "type": "single",
      "question": "採用「資源搶佔（Resource Preemption）」復原死結時，若僅以最小成本為挑選標準，容易導致同一個行程反覆被剝奪資源而永遠無法完成（飢餓 Starvation）。系統通常如何解決此問題？",
      "options": [
        "直接將陷入飢餓的行程優先權降至最低",
        "在計算搶佔成本時，將行程被回滾（Rollback）的次數納入加權，回滾次數越多者越不易被挑選為受害者",
        "強制關閉系統電源重啟",
        "禁止任何批次行程使用系統資源"
      ],
      "answer": 1,
      "explanation": "為避免飢餓，成本函數必須計入回滾次數（Number of rollbacks）。一個行程若已被回滾多次，其代價大幅提高，使系統轉而選擇其他行程作為受害者。",
      "category": "concept"
    },
    {
      "id": "q50",
      "chapter": "ch5",
      "type": "single",
      "question": "大多數現代通用作業系統（如 UNIX、Linux 與 Windows）面對死結問題時，在實務上採取何種處理策略？",
      "options": [
        "完全採用死結預防，強制行程一次獲配全部資源",
        "在核心內部全面執行銀行家演算法，拒絕任何不安全狀態",
        "完全忽視死結問題（假裝死結永遠不會發生，留待管理員或使用者處置）",
        "每秒鐘執行一次多實例死結偵測矩陣演算法"
      ],
      "answer": 2,
      "explanation": "現代主流作業系統普遍採用「忽視死結（鴕鳥策略）」，因為死結機率較低，但預防與避免的開銷與對資源利用率的限制過於沉重，因此選擇交由人工排解。",
      "category": "concept"
    },
    {
      "id": "q51",
      "chapter": "ch5",
      "type": "single",
      "question": "在單一資源實例的系統中，死結偵測可以透過維護「等待圖（Wait-for Graph）」來達成。在包含 n 個行程的圖中，週期性檢查環路的演算法時間複雜度為何？",
      "options": [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n²)"
      ],
      "answer": 3,
      "explanation": "在包含 n 個頂點的有向圖中，使用深度優先搜尋（DFS）等演算法尋找環路的時間複雜度為 O(n²)。",
      "category": "concept"
    },
    {
      "id": "q52",
      "chapter": "ch5",
      "type": "single",
      "question": "在資源配置圖演算法（死結避免）中，若行程 Pi 未來可能會請求資源 Rj，該關係在圖中以何種方式表示？何時才能轉為分配邊？",
      "options": [
        "以實線箭頭表示；只要行程請求就直接轉為分配邊",
        "以虛線表示之「宣告邊（Claim Edge，Pi → Rj）」；僅在轉為分配邊後「圖中不會形成任何環路」時才可批准分配",
        "以雙箭頭表示；僅在系統處於 CPU 閒置時才可分配",
        "以波浪線表示；只要資源實例大於 1 即可分配"
      ],
      "answer": 1,
      "explanation": "宣告邊（Claim Edge）以虛線箭頭 Pi → Rj 表示未來可能請求。當真正請求時轉為實線請求邊；只有將其轉為分配邊 Rj → Pi 且整個圖中不產生環路時，系統才可批准分配。",
      "category": "concept"
    },
    {
      "id": "q53",
      "chapter": "ch4",
      "type": "single",
      "question": "在多執行緒（Multithreaded）行程架構中，下列何者屬於每個執行緒各自獨立擁有之「私有資源（Private Resources）」，而不與同行程的其他執行緒共享？",
      "options": [
        "程式碼區段（Code / Text Section）",
        "堆疊區段（Stack）與程式計數器（Program Counter, PC）",
        "全域變數與資料區段（Data Section）",
        "開啟的檔案清單（Open Files）與堆積空間（Heap）"
      ],
      "answer": 1,
      "explanation": "同一行程的所有執行緒共享程式碼區段（Code）、資料區段（Data）、堆積（Heap）與開啟檔案等 OS 資源；但各執行緒各自獨立擁有專屬的執行緒 ID、程式計數器（PC）、暫存器集合（Register Set）與堆疊區段（Stack）。",
      "category": "concept"
    },
    {
      "id": "q54",
      "chapter": "ch4",
      "type": "single",
      "question": "多執行緒程式設計具備四大核心效益（Benefits）。當應用程式中的某個執行緒遭遇耗時的 I/O 操作而阻塞時，其他執行緒仍能繼續執行以維持使用者介面的互動性，此特性稱為？",
      "options": [
        "資源共享（Resource Sharing）",
        "經濟性（Economy）",
        "回應性（Responsiveness）",
        "可擴展性（Scalability）"
      ],
      "answer": 2,
      "explanation": "「回應性（Responsiveness）」指應用程式即使部分被阻塞或進行耗時運算，其他執行緒仍能繼續執行，這對維持使用者介面（UI）的即時互動特別重要。",
      "category": "concept"
    },
    {
      "id": "q55",
      "chapter": "ch4",
      "type": "single",
      "question": "關於「併行（Concurrency）」與「平行（Parallelism）」的本質區別，下列敘述何者最為精確？",
      "options": [
        "併行必須依賴實體多核心硬體同時執行指令；平行則可以在單一核心上透過排程切換完成",
        "併行支援多個任務同時向前推進（making progress）；平行則指系統能在同一時間瞬間同時（simultaneously）執行多個任務",
        "併行與平行在作業系統中為同義詞，沒有實質技術差別",
        "具備平行的系統不一定具備併行；但具備併行的系統必然具備平行"
      ],
      "answer": 1,
      "explanation": "併行（Concurrency）指多個任務同時向前推進（單核心透過排程快速交替切換即可達成）；平行（Parallelism）指多個任務在同一瞬間同時（simultaneously）執行，必須具備實體多核心或多處理器硬體支援。",
      "category": "concept"
    },
    {
      "id": "q56",
      "chapter": "ch4",
      "type": "single",
      "question": "在多核心程式設計中，將同一份龐大資料集（如大型矩陣）切分為多個子集，分散至各核心並對各子集執行「完全相同的運算操作」，屬於何種平行化型態？",
      "options": [
        "任務平行（Task Parallelism）",
        "資料平行（Data Parallelism）",
        "管道平行（Pipeline Parallelism）",
        "投機平行（Speculative Parallelism）"
      ],
      "answer": 1,
      "explanation": "資料平行（Data Parallelism）著重於將資料分割並分配到多個核心，各核心對其資料子集執行相同操作；任務平行（Task Parallelism）則是將不同執行緒分配到各核心，各執行緒執行各自相異的任務。",
      "category": "concept"
    },
    {
      "id": "q57",
      "chapter": "ch4",
      "type": "single",
      "question": "根據阿姆達爾定律（Amdahl's Law），若某應用程式有 75% 的部分可以平行化處理，另外 25% 必須循序執行（S = 0.25）。當硬體從 1 顆核心擴充為 4 顆處理器核心時，系統所能獲得的效能加速比（Speedup）約為多少倍？",
      "options": [
        "1.60 倍",
        "2.29 倍（約 2.286 倍）",
        "3.00 倍",
        "4.00 倍"
      ],
      "answer": 1,
      "explanation": "代入阿姆達爾定律公式：Speedup <= 1 / (S + (1 - S) / N) = 1 / (0.25 + 0.75 / 4) = 1 / (0.25 + 0.1875) = 1 / 0.4375 ≈ 2.2857 ≈ 2.29 倍。",
      "category": "calc"
    },
    {
      "id": "q58",
      "chapter": "ch4",
      "type": "single",
      "question": "承上題概念，若某程式中有 20% 的程式碼必須嚴格循序執行（S = 0.20），則無論我們在系統中增加多少處理器核心（N -> ∞），該程式所能達到的理論加速比極限上限為何？",
      "options": [
        "4 倍",
        "5 倍",
        "10 倍",
        "20 倍"
      ],
      "answer": 1,
      "explanation": "當核心數趨近無窮大（N -> ∞）時，(1 - S) / N -> 0，加速比極限為 lim (Speedup) = 1 / S = 1 / 0.20 = 5 倍。循序執行部分構成了擴充加速的根本天花板。",
      "category": "concept"
    },
    {
      "id": "q59",
      "chapter": "ch4",
      "type": "single",
      "question": "在三大多執行緒模型中，關於「多對一模型（Many-to-One Model）」的缺點，下列敘述何者正確？",
      "options": [
        "建立使用者執行緒時會引發龐大的核心系統呼叫開銷",
        "若任一使用者執行緒發起阻塞式系統呼叫（Blocking System Call），整個行程的所有執行緒將全部被迫阻塞，且在多核心系統上無法平行執行",
        "核心會強制限制每個行程只能建立最多 10 個執行緒",
        "無法在使用者空間進行快速的執行緒排程"
      ],
      "answer": 1,
      "explanation": "多對一模型將多個使用者執行緒對應到單一核心執行緒。由於核心只看見一個執行緒，一旦某個執行緒阻塞，核心會將整個行程掛起；且多核心處理器一次也只能排程該單一核心執行緒，無法實現硬體平行。",
      "category": "concept"
    },
    {
      "id": "q60",
      "chapter": "ch4",
      "type": "single",
      "question": "現代通用作業系統（如 Linux、Windows 7/10/11、macOS）大多採用「一對一模型（One-to-One Model）」，其最關鍵的優勢為何？",
      "options": [
        "建立執行緒時完全無需核心介入，開銷為零",
        "提供更高的併行度（一個執行緒阻塞不影響其他執行緒），且能充分利用多處理器多核心進行真正平行運算",
        "行程可以無限制建立數十萬個執行緒而完全不消耗核心記憶體",
        "完全不需要任何執行緒同步或鎖定機制"
      ],
      "answer": 1,
      "explanation": "一對一模型為每個使用者執行緒配置專屬的核心執行緒，具備高併行性，且能在多核心硬體上實現真平行執行；其主要考量是建立開銷較大，因此 OS 通常會對單一行程的執行緒上限施加限制。",
      "category": "concept"
    },
    {
      "id": "q61",
      "chapter": "ch4",
      "type": "single",
      "question": "關於 POSIX Pthreads（IEEE 1003.1c）標準，下列何者敘述正確？",
      "options": [
        "Pthreads 是一套由單一廠商獨家實作的二進位可執行程式",
        "Pthreads 是針對執行緒建立與同步所定義的「API 標準規範（Specification）」，而非單一特定實作",
        "Pthreads 只能實作為純使用者空間函式庫，無法實作為核心層級",
        "Pthreads 僅能在 Windows 作業系統上運作"
      ],
      "answer": 1,
      "explanation": "Pthreads 是一套 IEEE 1003.1c 標準規範（Specification），定義了執行緒函式庫的行為與介面，具體實作交由各系統開發者完成（在 Linux、macOS 等 UNIX 系統普遍存在）。",
      "category": "concept"
    },
    {
      "id": "q62",
      "chapter": "ch4",
      "type": "single",
      "question": "隱式執行緒（Implicit Threading）中廣泛採用「執行緒池（Thread Pools）」技術，下列何者「不是」執行緒池所帶來的主要優點？",
      "options": [
        "以既有待命執行緒服務請求，通常比動態建立新執行緒更迅速",
        "能夠將系統中的執行緒總數約束在池的大小範圍內，防止突發請求耗盡系統資源",
        "將任務本身的邏輯與執行任務的機制解耦，便於設定排程策略",
        "保證執行緒內部運算永遠不需要互斥鎖定且絕不發生競態條件"
      ],
      "answer": 3,
      "explanation": "執行緒池無法自動消除共享資料的競爭條件（Race Condition），程式設計師仍需對共享變數進行同步與互斥保護。選項 3 敘述錯誤，故為正確答案。",
      "category": "concept"
    },
    {
      "id": "q63",
      "chapter": "ch4",
      "type": "single",
      "question": "在 OpenMP 平行程式設計中，若欲指示編譯器將 C 語言中的 for 迴圈自動均勻切分給多個執行緒平行執行，應使用下列哪一項編譯器指令？",
      "options": [
        "#pragma omp parallel for",
        "#pragma omp task wait",
        "#pragma omp single",
        "#pragma omp critical section"
      ],
      "answer": 0,
      "explanation": "OpenMP 使用 #pragma omp parallel for 指令，告知編譯器隨後的 for 迴圈之迭代可由執行期建立的執行緒群平行分配運算。",
      "category": "concept"
    },
    {
      "id": "q64",
      "chapter": "ch4",
      "type": "single",
      "question": "Apple Grand Central Dispatch (GCD) 技術中，關於「序列佇列（Serial Queue）」的敘述何者正確？",
      "options": [
        "任務會同時自佇列中取出並分派給多個執行緒平行執行",
        "任務依先進先出（FIFO）順序取出，同一時間只有一個任務執行，每個行程都有一個專屬的主佇列（Main Queue）",
        "序列佇列不保證任務執行順序",
        "系統只允許使用全域預設佇列，程式設計師無法建立自訂序列佇列"
      ],
      "answer": 1,
      "explanation": "GCD 的 Serial Queue 依 FIFO 順序取出並逐一執行，一次僅執行一個任務；每個行程都具有一個系統提供的 Main Queue，程式設計師亦可建立自訂序列佇列。",
      "category": "concept"
    },
    {
      "id": "q65",
      "chapter": "ch1",
      "type": "single",
      "question": "在現代 64 位元（64-bit）電腦架構中，CPU 暫存器與記憶體定址通常以原生「字組（Word）」為單位。一個 64 位元的字組大小相當於多少個位元組（Bytes）？",
      "options": [
        "2 Bytes",
        "4 Bytes",
        "8 Bytes",
        "16 Bytes"
      ],
      "answer": 2,
      "explanation": "1 Byte = 8 bits，因此 64 位元的原生字組（Word）大小為 64 / 8 = 8 個位元組（8 Bytes）。",
      "category": "calc"
    },
    {
      "id": "q66",
      "chapter": "ch1",
      "type": "single",
      "question": "在 Linux 核心實作中（例如 <linux/rbtree.h>），核心廣泛採用紅黑樹等「平衡二元搜尋樹（Balanced BST）」而非一般二元搜尋樹，最主要的原因為何？",
      "options": [
        "平衡二元樹保證在最差情況下的搜尋時間複雜度仍維持為 O(log n)，避免一般二元樹退化為 O(n)",
        "平衡二元樹完全不佔用任何指標記憶體空間",
        "平衡二元樹可以直接取代雜湊圖且搜尋複雜度為 O(1)",
        "一般二元搜尋樹無法儲存整數型態資料"
      ],
      "answer": 0,
      "explanation": "一般二元搜尋樹若插入順序傾斜，最差情況會退化為單向鏈結串列，搜尋時間為 O(n)；平衡二元搜尋樹（如紅黑樹 rbtree）透過旋轉維護樹高平衡，保證最差搜尋時間維持在 O(log n)。",
      "category": "concept"
    },
    {
      "id": "q67",
      "chapter": "ch2",
      "type": "single",
      "question": "在行程間通訊（IPC）之訊息傳遞模型中，若傳送端呼叫 send() 與接收端呼叫 receive() 兩者皆為阻塞式（Blocking），這種傳送與接收雙方在端點處嚴格對齊同步的機制稱為？",
      "options": [
        "忙碌等待（Busy Waiting）",
        "會合（Rendezvous）",
        "調換（Swapping）",
        "管道傳送（Piping）"
      ],
      "answer": 1,
      "explanation": "當 send() 與 receive() 同時為 Blocking 狀態時，傳送端與接收端必須同時到達通訊點完成交會，傳送者方可繼續執行，此嚴格同步機制稱為會合（Rendezvous）。",
      "category": "concept"
    },
    {
      "id": "q68",
      "chapter": "ch2",
      "type": "single",
      "question": "在 IPC 訊息佇列容量模型中，若通訊連結採用「零容量（Zero Capacity）」佇列，下列敘述何者正確？",
      "options": [
        "訊息連結最多可同時暫存 1 個訊息",
        "傳送端發送訊息後永遠不會被阻塞",
        "佇列無法保留任何訊息，傳送端發送訊息後必須強制阻塞等待接收端取走訊息（即 Rendezvous）",
        "接收端呼叫 receive() 永遠只會得到 Null"
      ],
      "answer": 2,
      "explanation": "零容量（Zero capacity）佇列長度為 0，無法保留任何訊息，因此傳送端發出訊息後必須等待接收端接收，兩者形成會合（Rendezvous）。",
      "category": "concept"
    },
    {
      "id": "q69",
      "chapter": "ch3",
      "type": "single",
      "question": "在即時 CPU 排程中，「速率單調排程（Rate Monotonic Scheduling, RMS）」採用靜態優先權機制，其指派優先權的依據準則為何？",
      "options": [
        "週期的倒數（週期愈短，優先權愈高）",
        "週期的長短（週期愈長，優先權愈高）",
        "剩餘 CPU burst 時間最短者優先權最高",
        "行程到達系統的先後順序"
      ],
      "answer": 0,
      "explanation": "RMS 演算法依據週期（Period p）指派優先權，週期愈短（頻率愈高）指派愈高的優先權；週期愈長指派愈低的優先權。",
      "category": "concept"
    },
    {
      "id": "q70",
      "chapter": "ch3",
      "type": "single",
      "question": "關於「最早截止時間優先（Earliest Deadline First, EDF）」即時排程演算法，下列敘述何者正確？",
      "options": [
        "EDF 採用靜態優先權，優先權一旦指定在整個執行期間不再改變",
        "EDF 優先權依照行程下一次截止時間動態指派（截止時間愈早優先權愈高），且理論上 CPU 利用率最高可達 100%",
        "EDF 只能應用於所有行程週期皆完全相同的情境",
        "2 個行程時 EDF 的 CPU 利用率上限僅為 82.8%"
      ],
      "answer": 1,
      "explanation": "EDF 是動態優先權演算法，依照截止時間（Deadline）動態調整優先權（愈接近截止時間優先權愈高），且理論利用率可達 100%（RMS 的 2 行程利用率上限約為 82.8%）。",
      "category": "concept"
    },
    {
      "id": "q71",
      "chapter": "ch5",
      "type": "single",
      "question": "在死結避免之資源配置圖（RAG）演算法中，關於「宣告邊（Claim Edge）」的表示與轉換，下列敘述何者正確？",
      "options": [
        "以實線箭頭表示，且由資源指向行程",
        "以虛線箭頭（Pi -> Rj）表示，當行程真正提出請求時轉為實線請求邊；只有分配後圖中不產生環路時才批准轉換為分配邊",
        "宣告邊代表該資源已經被該行程永久佔用",
        "宣告邊只適用於每種資源有多個實例的系統"
      ],
      "answer": 1,
      "explanation": "宣告邊以虛線 Pi -> Rj 表示，代表未來可能會請求該資源；提出請求時轉為實線請求邊，若分配後無環路則批准轉為分配邊，釋放後轉回虛線宣告邊。",
      "category": "concept"
    },
    {
      "id": "q72",
      "chapter": "ch5",
      "type": "single",
      "question": "當作業系統採用「資源搶佔（Resource Preemption）」從死結狀態復原時，若單純以最小代價為考量，容易導致特定行程頻繁被選為犧牲者而陷入「飢餓（Starvation）」。最有效的防範機制為何？",
      "options": [
        "強制將所有行程的優先權設定為完全相同",
        "在犧牲者代價評估公式中納入「回滾次數（Number of Rollbacks）」因子，被回滾次數愈多的行程其代價愈高",
        "永遠只搶佔 CPU-bound 行程的資源",
        "一旦發生死結立即重新啟動作業系統"
      ],
      "answer": 1,
      "explanation": "為防止同一行程反覆被選為犧牲者而飢餓，系統在代價計算中加入回滾次數（Rollback count），被回滾愈多次代價愈高，從而使系統轉向挑選其他行程作為犧牲者。",
      "category": "concept"
    },
    {
      "id": "q73",
      "chapter": "ch1",
      "type": "single",
      "question": "在雙層記憶體階層中，快取（Cache）存取時間為 2 ns，主記憶體存取時間為 100 ns。若快取命中率為 98%，則系統的有效存取時間（Effective Access Time, EAT）約為多少？",
      "options": [
        "2.00 ns",
        "4.00 ns",
        "10.00 ns",
        "98.00 ns"
      ],
      "answer": 1,
      "explanation": "代入有效存取時間公式：EAT = 2 + (1 - 0.98) * 100 = 2 + 0.02 * 100 = 2 + 2 = 4.00 ns。",
      "category": "calc"
    },
    {
      "id": "q74",
      "chapter": "ch1",
      "type": "single",
      "question": "在作業系統雙模式保護架構中，下列哪一項操作「不屬於」特權指令（Privileged Instruction），允許直接在使用者模式下執行？",
      "options": [
        "設定計時器（Timer）之倒數計數值",
        "清除記憶體頁表指標暫存器",
        "執行兩個整數變數相加的算術運算指令",
        "關閉所有硬體外部中斷（Disable Interrupts）"
      ],
      "answer": 2,
      "explanation": "整數運算為一般的 ALU 運算指令，任何使用者程式皆可自由執行；而修改計時器、修改記憶體配置與關閉中斷均屬於特權指令，僅限核心模式執行。",
      "category": "concept"
    },
    {
      "id": "q75",
      "chapter": "ch2",
      "type": "single",
      "question": "在 UNIX 系統中執行下列程式片段：for (int i = 0; i < 4; i++) { fork(); }。假設所有 fork() 呼叫均成功，則系統總共「新建立了」多少個子行程？",
      "options": [
        "4 個",
        "8 個",
        "15 個",
        "16 個"
      ],
      "answer": 2,
      "explanation": "迴圈執行 4 次產生 2^4 = 16 個行程（包含原本的初始父行程），因此新建立的子行程數為 16 - 1 = 15 個。",
      "category": "calc"
    },
    {
      "id": "q76",
      "chapter": "ch2",
      "type": "single",
      "question": "在生產者-消費者問題的有界限緩衝區實作中，若緩衝區大小定義為 #define BUFFER_SIZE 16，採用 (in + 1) % BUFFER_SIZE == out 判斷已滿，則該緩衝區最多可同時容納多少個元素？",
      "options": [
        "14 個",
        "15 個",
        "16 個",
        "32 個"
      ],
      "answer": 1,
      "explanation": "此演算法保留一個空位以區隔「全空（in == out）」與「全滿」，因此最多可存放 BUFFER_SIZE - 1 個元素，即 16 - 1 = 15 個。",
      "category": "calc"
    },
    {
      "id": "q77",
      "chapter": "ch2",
      "type": "single",
      "question": "關於 UNIX 系統中的「孤兒行程（Orphan Process）」與「殭屍行程（Zombie Process）」，下列敘述何者正確？",
      "options": [
        "孤兒行程是指子行程已經執行完 exit()，但父行程尚未呼叫 wait() 回收其狀態碼",
        "殭屍行程是指父行程先行終止，留下仍在運行的子行程",
        "孤兒行程會由系統根行程（init 或 systemd，PID=1）收養，並由其負責呼叫 wait() 回收",
        "殭屍行程在主記憶體中仍佔用龐大的代碼與資料段記憶體"
      ],
      "answer": 2,
      "explanation": "父行程先行終止時，留下的子行程成為孤兒行程，由 init/systemd（PID=1）收養並代為回收；子行程終止而父行程未 wait() 時則為殭屍行程（僅殘留 PCB 條目）。",
      "category": "concept"
    },
    {
      "id": "q78",
      "chapter": "ch3",
      "type": "single",
      "question": "在輪轉排程（Round Robin）演算法中，若就緒佇列中有 n 個行程，時間量子為 q，則任何一個行程從被搶占到下一次重新獲得 CPU 運行的最長等待時間不會超過多少？",
      "options": [
        "q",
        "n * q",
        "(n - 1) * q",
        "(n + 1) * q"
      ],
      "answer": 2,
      "explanation": "佇列中有 n 個行程，當前行程被移至隊尾後，前方最多有 n - 1 個行程各執行至多 q 時間單位，因此最長等待時間為 (n - 1) * q。",
      "category": "calc"
    },
    {
      "id": "q79",
      "chapter": "ch3",
      "type": "single",
      "question": "即時排程演算法中，速率單調排程（RMS）針對 3 個週期性行程（N = 3）所提供的充分保證 CPU 利用率界限公式為 3 * (2^(1/3) - 1)，該理論利用率數值約為多少？",
      "options": [
        "69.3%",
        "77.9%",
        "82.8%",
        "100%"
      ],
      "answer": 1,
      "explanation": "代入 N=3 計算：3 * (2^(1/3) - 1) ≈ 3 * (1.2599 - 1) = 3 * 0.2599 ≈ 0.7797，即約 77.9%（N=1 為 100%，N=2 為 82.8%，N 無限大逼近 ln 2 ≈ 69.3%）。",
      "category": "calc"
    },
    {
      "id": "q80",
      "chapter": "ch3",
      "type": "single",
      "question": "關於最早截止時間優先（Earliest Deadline First, EDF）即時排程演算法，下列敘述何者錯誤？",
      "options": [
        "EDF 的優先權是動態指派的，依照截止時間動態調整",
        "截止時間愈早的行程，其指派的優先權愈高",
        "EDF 要求所有行程的週期長度必須完全一致才能運作",
        "在理論上，只要所有行程之 CPU 利用率總和不大於 100%，EDF 保證所有行程皆能滿足截止時間"
      ],
      "answer": 2,
      "explanation": "EDF 不需要所有行程週期一致，它可動態依每次到達行程之下一次 Deadline 進行優先權調整，且理論利用率可達 100%。選項 2 敘述錯誤。",
      "category": "concept"
    },
    {
      "id": "q81",
      "chapter": "ch4",
      "type": "single",
      "question": "某程式經效能分析有 90% 可完全平行化運算，10% 必須循序執行（S = 0.10）。依據阿姆達爾定律，若配置 8 顆處理器核心，加速比約為多少倍？",
      "options": [
        "4.71 倍",
        "6.40 倍",
        "8.00 倍",
        "10.00 倍"
      ],
      "answer": 0,
      "explanation": "代入公式：Speedup = 1 / (0.10 + 0.90 / 8) = 1 / (0.10 + 0.1125) = 1 / 0.2125 ≈ 4.7058 ≈ 4.71 倍。",
      "category": "calc"
    },
    {
      "id": "q82",
      "chapter": "ch4",
      "type": "single",
      "question": "在多執行緒程式設計中，關於「執行緒專用儲存區（Thread-Local Storage, TLS）」的敘述何者正確？",
      "options": [
        "TLS 是所有執行緒共享存取的全域記憶體堆積空間",
        "TLS 允許每個執行緒各自擁有一份獨立的靜態資料複本，同行程內其他執行緒無法存取",
        "TLS 的生命週期僅限於單一函式呼叫，函式返回即銷毀",
        "TLS 等同於行程的程式碼區段（Code Section）"
      ],
      "answer": 1,
      "explanation": "Thread-Local Storage（TLS）允許每個執行緒各自擁有專屬的靜態變數複本，跨函式呼叫持續存在且執行緒之間互不干擾。",
      "category": "concept"
    },
    {
      "id": "q83",
      "chapter": "ch4",
      "type": "single",
      "question": "在三大多執行緒模型中，雙層模型（Two-Level Model）相較於純粹多對多模型（Many-to-Many）的核心差異為何？",
      "options": [
        "雙層模型不支援任何使用者空間執行緒函式庫",
        "雙層模型在允許多對多映射的同時，亦允許將特定關鍵使用者執行緒永久綁定至專屬核心執行緒",
        "雙層模型完全不允許在多核心系統上平行執行",
        "雙層模型每個行程最多只能建立 2 個執行緒"
      ],
      "answer": 1,
      "explanation": "雙層模型（Two-Level Model，如 Solaris 8、IRIX）結合了 M:M 與 1:1，既允許多對多映射，又支援將特定重要執行緒永久綁定（Bound）至專屬核心執行緒。",
      "category": "concept"
    },
    {
      "id": "q84",
      "chapter": "ch5",
      "type": "single",
      "question": "某作業系統擁有同種類型資源實例共 18 個。若每個行程的最大資源需求量均為 4 個實例，依據鴿籠原理臨界條件，該系統最多能同時支援幾個行程安全執行而保證絕不發生死結？",
      "options": [
        "4 個行程",
        "5 個行程",
        "6 個行程",
        "7 個行程"
      ],
      "answer": 1,
      "explanation": "保證不死結條件為 M >= n * (m - 1) + 1。代入 M=18, m=4：18 >= n * (4 - 1) + 1 => 18 >= 3n + 1 => 3n <= 17 => n <= 5.66，因此最多允許 5 個行程。",
      "category": "concept"
    },
    {
      "id": "q85",
      "chapter": "ch5",
      "type": "single",
      "question": "在銀行家演算法安全狀態推導中，若目前可用資源向量 Work = (2, 1, 1)，而四個候選行程的 Need 向量分別如下，系統下一步只能優先挑選哪一個行程？",
      "options": [
        "P0 之 Need = (3, 1, 0)",
        "P1 之 Need = (2, 2, 1)",
        "P2 之 Need = (1, 1, 1)",
        "P3 之 Need = (2, 1, 2)"
      ],
      "answer": 2,
      "explanation": "安全演算法要求 Need_i <= Work。Work 為 (2, 1, 1)：P0 的 A(3)>2 不行；P1 的 B(2)>1 不行；P3 的 C(2)>1 不行；只有 P2 的 (1, 1, 1) <= (2, 1, 1) 完全符合！",
      "category": "calc"
    },
    {
      "id": "q86",
      "chapter": "ch5",
      "type": "single",
      "question": "在處理死結的各策略中，「死結避免（Deadlock Avoidance）」與「死結偵測（Deadlock Detection）」最核心的先驗資訊需求差異為何？",
      "options": [
        "死結避免無需任何先驗資訊，死結偵測必須事先宣告最大需求量",
        "死結避免必須事先知道每個行程的「最大資源需求量（Max Demand）」，死結偵測則無需事先宣告，僅需當前 Allocation 與實際 Request 矩陣",
        "兩者皆要求行程在開始前一次性申請所有資源",
        "兩者皆無法在多重實例資源系統中運作"
      ],
      "answer": 1,
      "explanation": "死結避免（如銀行家演算法）必須在執行前取得行程的 Max Demand；死結偵測則平時不施加限制，僅在執行偵測演算法時檢查當前 Allocation 與實際當前發出的 Request 矩陣。",
      "category": "concept"
    }
  ],
  "ganttPresets": [
    {
      "id": "convoy_demo",
      "title": "CH3 經典考題：護衛效應（Convoy Effect）對比",
      "description": "展示長計算行程排在最前面時引發的護衛效應，以及 SJF 如何大幅降低平均等待時間。",
      "processes": [
        {
          "id": "P1",
          "arrival": 0,
          "burst": 24,
          "priority": 3
        },
        {
          "id": "P2",
          "arrival": 0,
          "burst": 3,
          "priority": 1
        },
        {
          "id": "P3",
          "arrival": 0,
          "burst": 3,
          "priority": 2
        }
      ],
      "algorithm": "FCFS",
      "quantum": 4
    },
    {
      "id": "srtf_classic",
      "title": "CH3 經典搶占式 SRTF 題目",
      "description": "四個不同時間到達的行程，體現新行程剩餘時間更短時發生的搶占行為。",
      "processes": [
        {
          "id": "P1",
          "arrival": 0,
          "burst": 8,
          "priority": 1
        },
        {
          "id": "P2",
          "arrival": 1,
          "burst": 4,
          "priority": 1
        },
        {
          "id": "P3",
          "arrival": 2,
          "burst": 9,
          "priority": 1
        },
        {
          "id": "P4",
          "arrival": 3,
          "burst": 5,
          "priority": 1
        }
      ],
      "algorithm": "SRTF",
      "quantum": 2
    },
    {
      "id": "rr_quantum_demo",
      "title": "CH3 輪轉排程 Round Robin（q = 4）",
      "description": "觀察時間量子 q = 4 下行程輪流執行的甘特圖切換與完成時間計算。",
      "processes": [
        {
          "id": "P1",
          "arrival": 0,
          "burst": 24,
          "priority": 1
        },
        {
          "id": "P2",
          "arrival": 0,
          "burst": 3,
          "priority": 1
        },
        {
          "id": "P3",
          "arrival": 0,
          "burst": 3,
          "priority": 1
        }
      ],
      "algorithm": "RR",
      "quantum": 4
    },
    {
      "id": "nonpreempt_sjf",
      "title": "CH3 非搶占式 SJF 題目",
      "description": "不同到達時間下的非搶占式 SJF，一旦開始執行就不被搶占。",
      "processes": [
        {
          "id": "P1",
          "arrival": 0,
          "burst": 7,
          "priority": 1
        },
        {
          "id": "P2",
          "arrival": 2,
          "burst": 4,
          "priority": 1
        },
        {
          "id": "P3",
          "arrival": 4,
          "burst": 1,
          "priority": 1
        },
        {
          "id": "P4",
          "arrival": 5,
          "burst": 4,
          "priority": 1
        }
      ],
      "algorithm": "SJF",
      "quantum": 2
    }
  ],
  "essayQuestions": [
    {
      "id": "essay-1",
      "chapter": "ch5",
      "category": "calc",
      "title": "銀行家演算法綜合分析大題：安全狀態判定與動態資源請求審查",
      "points": "15 分",
      "question": "考慮一多道程式系統包含 5 個行程（$P_0$ 至 $P_4$）與 3 種資源類型（$A$ 共有 10 個實例、$B$ 共有 5 個實例、$C$ 共有 7 個實例）。在時間點 $T_0$ 之系統資源分配快照如下：\n<br/>\n<table class=\"comparison-table\" style=\"margin: 0.75rem 0; width: 100%;\">\n  <thead>\n    <tr>\n      <th>行程</th>\n      <th>Allocation ($A, B, C$)</th>\n      <th>Max ($A, B, C$)</th>\n      <th>Available ($A, B, C$)</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr><td>$P_0$</td><td>$(0, 1, 0)$</td><td>$(7, 5, 3)$</td><td rowspan=\"5\" style=\"vertical-align: middle; text-align: center; font-weight: 700; color: var(--accent-emerald);\">$(3, 3, 2)$</td></tr>\n    <tr><td>$P_1$</td><td>$(2, 0, 0)$</td><td>$(3, 2, 2)$</td></tr>\n    <tr><td>$P_2$</td><td>$(3, 0, 2)$</td><td>$(9, 0, 2)$</td></tr>\n    <tr><td>$P_3$</td><td>$(2, 1, 1)$</td><td>$(2, 2, 2)$</td></tr>\n    <tr><td>$P_4$</td><td>$(0, 0, 2)$</td><td>$(4, 3, 3)$</td></tr>\n  </tbody>\n</table>\n請回答下列問題並列出完整推導運算步驟：\n<br/>\n1. 計算並寫出各行程之尚需要資源矩陣 $\\text{Need}$。<br/>\n2. 依安全演算法（Safety Algorithm），詳細寫出各步驟之 $\\text{Work}$ 向量更新歷程，判斷系統在 $T_0$ 是否處於安全狀態？若是，請列出一組完整的安全序列（Safe Sequence）。<br/>\n3. 在 $T_0$ 狀態下，若行程 $P_1$ 提出資源請求 $Request_1 = (1, 0, 2)$，系統是否可以立即批准該請求？請依資源請求演算法進行完整驗證推導。",
      "hint": "記住公式 $\\text{Need}[i] = \\text{Max}[i] - \\text{Allocation}[i]$。處理 $Request_1$ 時，先確認 $Request_1 \\le Need_1$ 與 $Request_1 \\le Available$，再假裝分配並更新狀態，最後重新執行安全演算法驗證是否仍存在安全序列。",
      "answer": "<p><strong>【題解第一部分：Need 矩陣計算】</strong></p>\n<p>依據公式 $\\text{Need}[i] = \\text{Max}[i] - \\text{Allocation}[i]$，計算各行程尚需要的資源量：</p>\n<ul>\n  <li>$\\text{Need}_0 = (7, 5, 3) - (0, 1, 0) = \\mathbf{(7, 4, 3)}$</li>\n  <li>$\\text{Need}_1 = (3, 2, 2) - (2, 0, 0) = \\mathbf{(1, 2, 2)}$</li>\n  <li>$\\text{Need}_2 = (9, 0, 2) - (3, 0, 2) = \\mathbf{(6, 0, 0)}$</li>\n  <li>$\\text{Need}_3 = (2, 2, 2) - (2, 1, 1) = \\mathbf{(0, 1, 1)}$</li>\n  <li>$\\text{Need}_4 = (4, 3, 3) - (0, 0, 2) = \\mathbf{(4, 3, 1)}$</li>\n</ul>\n\n<p><strong>【題解第二部分：安全狀態判定與安全序列推導】</strong></p>\n<p>初始狀態：$\\text{Work} = \\text{Available} = (3, 3, 2)$，$\\text{Finish} = [\\text{false}, \\text{false}, \\text{false}, \\text{false}, \\text{false}]$。</p>\n<ol style=\"margin-left: 1.5rem; line-height: 1.8;\">\n  <li><strong>檢查行程 $P_1$：</strong> $\\text{Need}_1 = (1, 2, 2) \\le \\text{Work}(3, 3, 2)$ 成立。\n    <br/>模擬 $P_1$ 執行完成並釋放資源：$\\text{Work} = (3, 3, 2) + \\text{Allocation}_1(2, 0, 0) = \\mathbf{(5, 3, 2)}$，$\\text{Finish}[1] = \\text{true}$。</li>\n  <li><strong>檢查行程 $P_3$：</strong> $\\text{Need}_3 = (0, 1, 1) \\le \\text{Work}(5, 3, 2)$ 成立。\n    <br/>模擬 $P_3$ 執行完成並釋放資源：$\\text{Work} = (5, 3, 2) + \\text{Allocation}_3(2, 1, 1) = \\mathbf{(7, 4, 3)}$，$\\text{Finish}[3] = \\text{true}$。</li>\n  <li><strong>檢查行程 $P_4$：</strong> $\\text{Need}_4 = (4, 3, 1) \\le \\text{Work}(7, 4, 3)$ 成立。\n    <br/>模擬 $P_4$ 執行完成並釋放資源：$\\text{Work} = (7, 4, 3) + \\text{Allocation}_4(0, 0, 2) = \\mathbf{(7, 4, 5)}$，$\\text{Finish}[4] = \\text{true}$。</li>\n  <li><strong>檢查行程 $P_0$：</strong> $\\text{Need}_0 = (7, 4, 3) \\le \\text{Work}(7, 4, 5)$ 成立。\n    <br/>模擬 $P_0$ 執行完成並釋放資源：$\\text{Work} = (7, 4, 5) + \\text{Allocation}_0(0, 1, 0) = \\mathbf{(7, 5, 5)}$，$\\text{Finish}[0] = \\text{true}$。</li>\n  <li><strong>檢查行程 $P_2$：</strong> $\\text{Need}_2 = (6, 0, 0) \\le \\text{Work}(7, 5, 5)$ 成立。\n    <br/>模擬 $P_2$ 執行完成並釋放資源：$\\text{Work} = (7, 5, 5) + \\text{Allocation}_2(3, 0, 2) = \\mathbf{(10, 5, 7)}$，$\\text{Finish}[2] = \\text{true}$。</li>\n</ol>\n<p>所有行程之 $\\text{Finish}$ 皆為 $\\text{true}$，因此系統處於<strong>安全狀態（Safe State）</strong>，一組安全序列為：$\\mathbf{\\langle P_1, P_3, P_4, P_0, P_2 \\rangle}$。</p>\n\n<p><strong>【題解第三部分：$P_1$ 提出 $Request_1 = (1, 0, 2)$ 之核准審查】</strong></p>\n<ol style=\"margin-left: 1.5rem; line-height: 1.8;\">\n  <li>檢查 $Request_1 \\le \\text{Need}_1$：$(1, 0, 2) \\le (1, 2, 2)$，條件符合。</li>\n  <li>檢查 $Request_1 \\le \\text{Available}$：$(1, 0, 2) \\le (3, 3, 2)$，條件符合。</li>\n  <li>假裝批准分配，試探性更新系統狀態：\n    <ul>\n      <li>$\\text{Available} = (3, 3, 2) - (1, 0, 2) = \\mathbf{(2, 3, 0)}$</li>\n      <li>$\\text{Allocation}_1 = (2, 0, 0) + (1, 0, 2) = \\mathbf{(3, 0, 2)}$</li>\n      <li>$\\text{Need}_1 = (1, 2, 2) - (1, 0, 2) = \\mathbf{(0, 2, 0)}$</li>\n    </ul>\n  </li>\n  <li>對新狀態執行安全演算法：\n    <ul>\n      <li>初始 $\\text{Work} = (2, 3, 0)$。</li>\n      <li>尋找可滿足之行程：此時只有 $\\text{Need}_1 = (0, 2, 0) \\le (2, 3, 0)$ 與 $\\text{Need}_3 = (0, 1, 1) \\le (2, 3, 0)$？注意 $\\text{Need}_3$ 的 $C$ 為 1，但 $\\text{Work}$ 的 $C$ 為 0，因此 $P_3$ 無法滿足；只有 $P_1$ 符合！</li>\n      <li>$P_1$ 完成釋放：$\\text{Work} = (2, 3, 0) + (3, 0, 2) = \\mathbf{(5, 3, 2)}$。</li>\n      <li>此時 $\\text{Need}_3(0, 1, 1) \\le (5, 3, 2)$，可接續排程 $P_3$，釋放後 $\\text{Work} = (5, 3, 2) + (2, 1, 1) = \\mathbf{(7, 4, 3)}$。</li>\n      <li>接續可排程 $P_4 \\to P_0 \\to P_2$。</li>\n    </ul>\n    找到安全序列 $\\mathbf{\\langle P_1, P_3, P_4, P_0, P_2 \\rangle}$，系統仍處於安全狀態！\n  </li>\n</ol>\n<p style=\"color: var(--accent-emerald); font-weight: 700;\">結論：系統可以立即批准 $P_1$ 的資源請求！</p>",
      "rubric": [
        "Need 矩陣計算全對（4 分，錯一個扣 1 分）",
        "安全序列推導詳細且列出每步 Work 向量更新歷程（6 分）",
        "Request 請求三階段檢查完整、假裝分配數值正確且安全驗證邏輯完整（5 分）"
      ]
    },
    {
      "id": "essay-2",
      "chapter": "ch3",
      "category": "calc",
      "title": "CPU 排程演算法全指標綜合對比：甘特圖、等待時間與週轉時間推導",
      "points": "20 分",
      "question": "現有 4 個行程 $P_1, P_2, P_3, P_4$，其到達時間（Arrival Time）、CPU Burst 時間與優先權（數字愈小代表優先權愈高）如下表所示：\n<br/>\n<table class=\"comparison-table\" style=\"margin: 0.75rem 0; width: 100%;\">\n  <thead>\n    <tr>\n      <th>行程</th>\n      <th>到達時間（Arrival Time）</th>\n      <th>CPU Burst 時間</th>\n      <th>優先權（Priority）</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr><td>$P_1$</td><td>0 ms</td><td>8 ms</td><td>3</td></tr>\n    <tr><td>$P_2$</td><td>1 ms</td><td>4 ms</td><td>1（最高）</td></tr>\n    <tr><td>$P_3$</td><td>2 ms</td><td>9 ms</td><td>4（最低）</td></tr>\n    <tr><td>$P_4$</td><td>3 ms</td><td>5 ms</td><td>2</td></tr>\n  </tbody>\n</table>\n請針對以下四種排程演算法：\n<br/>\n1. 先來先服務（FCFS，非搶占）<br/>\n2. 最短工作優先（SJF，非搶占）<br/>\n3. 最短剩餘時間優先（SRTF，搶占式 SJF）<br/>\n4. 輪轉排程（Round Robin，時間量子 $q = 3\\,\\text{ms}$）<br/>\n<br/>\n(a) 分別畫出四種演算法的甘特圖（標明行程編號與各切換點時間刻度）。<br/>\n(b) 依據各演算法推導各行程的完成時間（Completion Time）、週轉時間（Turnaround Time）與等待時間（Waiting Time）。<br/>\n(c) 計算各排程演算法之「平均等待時間（Average Waiting Time）」與「平均週轉時間」，並從演算法特性簡評何者表現最佳。",
      "hint": "注意 SRTF 在時間點 1、2、3 有新行程到達時需比較「剩餘時間」；Round Robin 排程在量子用盡時若剛好有新行程到達，通常新到達行程先入隊，被搶占行程排在其後。",
      "answer": "<p><strong>【演算法一：FCFS（先來先服務，非搶占）】</strong></p>\n<p>甘特圖：$[P_1: 0 \\to 8] \\; [P_2: 8 \\to 12] \\; [P_3: 12 \\to 21] \\; [P_4: 21 \\to 26]$</p>\n<ul>\n  <li>$P_1$: 完成時間 8，週轉時間 $8 - 0 = 8$，等待時間 $8 - 8 = 0\\,\\text{ms}$</li>\n  <li>$P_2$: 完成時間 12，週轉時間 $12 - 1 = 11$，等待時間 $11 - 4 = 7\\,\\text{ms}$</li>\n  <li>$P_3$: 完成時間 21，週轉時間 $21 - 2 = 19$，等待時間 $19 - 9 = 10\\,\\text{ms}$</li>\n  <li>$P_4$: 完成時間 26，週轉時間 $26 - 3 = 23$，等待時間 $23 - 5 = 18\\,\\text{ms}$</li>\n</ul>\n<p><strong>平均等待時間：</strong> $(0 + 7 + 10 + 18) / 4 = \\mathbf{8.75\\,\\text{ms}}$；<strong>平均週轉時間：</strong> $(8 + 11 + 19 + 23) / 4 = \\mathbf{15.25\\,\\text{ms}}$。</p>\n\n<p><strong>【演算法二：非搶占式 SJF】</strong></p>\n<p>時間 0 時只有 $P_1$ 到達，先執行 $P_1$ 直到完成（時間 8）。時間 8 時，$P_2(4), P_3(9), P_4(5)$ 皆已到達，依 Burst 長度排序：$P_2 \\to P_4 \\to P_3$。</p>\n<p>甘特圖：$[P_1: 0 \\to 8] \\; [P_2: 8 \\to 12] \\; [P_4: 12 \\to 17] \\; [P_3: 17 \\to 26]$</p>\n<ul>\n  <li>$P_1$: 完成 8，週轉 $8 - 0 = 8$，等待 $8 - 8 = 0\\,\\text{ms}$</li>\n  <li>$P_2$: 完成 12，週轉 $12 - 1 = 11$，等待 $11 - 4 = 7\\,\\text{ms}$</li>\n  <li>$P_4$: 完成 17，週轉 $17 - 3 = 14$，等待 $14 - 5 = 9\\,\\text{ms}$</li>\n  <li>$P_3$: 完成 26，週轉 $26 - 2 = 24$，等待 $24 - 9 = 15\\,\\text{ms}$</li>\n</ul>\n<p><strong>平均等待時間：</strong> $(0 + 7 + 9 + 15) / 4 = \\mathbf{7.75\\,\\text{ms}}$；<strong>平均週轉時間：</strong> $(8 + 11 + 14 + 24) / 4 = \\mathbf{14.25\\,\\text{ms}}$。</p>\n\n<p><strong>【演算法三：搶占式 SJF（SRTF）】</strong></p>\n<ul>\n  <li>時間 0: $P_1$ 開始執行。</li>\n  <li>時間 1: $P_2$ 到達（Burst 4），此時 $P_1$ 剩餘 $7 > 4$，$P_2$ 搶占 CPU！</li>\n  <li>時間 2: $P_3$ 到達（Burst 9），$P_2$ 剩餘 $3 < 9$，$P_2$ 繼續。</li>\n  <li>時間 3: $P_4$ 到達（Burst 5），$P_2$ 剩餘 $2 < 5$，$P_2$ 繼續至時間 5 完成。</li>\n  <li>時間 5: 剩餘佇列有 $P_1(7), P_4(5), P_3(9)$，最小為 $P_4(5)$，執行至時間 10 完成。</li>\n  <li>時間 10: 剩餘 $P_1(7), P_3(9)$，執行 $P_1$ 至時間 17 完成。</li>\n  <li>時間 17: 執行 $P_3(9)$ 至時間 26 完成。</li>\n</ul>\n<p>甘特圖：$[P_1: 0 \\to 1] \\; [P_2: 1 \\to 5] \\; [P_4: 5 \\to 10] \\; [P_1: 10 \\to 17] \\; [P_3: 17 \\to 26]$</p>\n<ul>\n  <li>$P_1$: 完成 17，週轉 $17 - 0 = 17$，等待 $17 - 8 = 9\\,\\text{ms}$</li>\n  <li>$P_2$: 完成 5，週轉 $5 - 1 = 4$，等待 $4 - 4 = 0\\,\\text{ms}$</li>\n  <li>$P_4$: 完成 10，週轉 $10 - 3 = 7$，等待 $7 - 5 = 2\\,\\text{ms}$</li>\n  <li>$P_3$: 完成 26，週轉 $26 - 2 = 24$，等待 $24 - 9 = 15\\,\\text{ms}$</li>\n</ul>\n<p><strong>平均等待時間：</strong> $(9 + 0 + 2 + 15) / 4 = \\mathbf{6.50\\,\\text{ms}}$（理論最佳！）；<strong>平均週轉時間：</strong> $(17 + 4 + 7 + 24) / 4 = \\mathbf{13.00\\,\\text{ms}}$。</p>\n\n<p><strong>【演算法四：Round Robin（$q = 3\\,\\text{ms}$）】</strong></p>\n<p>追蹤 Ready Queue：</p>\n<ul>\n  <li>0~3: $P_1$ 執行 3 ms（剩 5）。期間 $P_2, P_3, P_4$ 到達。佇列變為：$P_2, P_3, P_4, P_1$。</li>\n  <li>3~6: $P_2$ 執行 3 ms（剩 1）。佇列變為：$P_3, P_4, P_1, P_2$。</li>\n  <li>6~9: $P_3$ 執行 3 ms（剩 6）。佇列變為：$P_4, P_1, P_2, P_3$。</li>\n  <li>9~12: $P_4$ 執行 3 ms（剩 2）。佇列變為：$P_1, P_2, P_3, P_4$。</li>\n  <li>12~15: $P_1$ 執行 3 ms（剩 2）。佇列變為：$P_2, P_3, P_4, P_1$。</li>\n  <li>15~16: $P_2$ 執行 1 ms 完成（完成時間 16）。佇列：$P_3, P_4, P_1$。</li>\n  <li>16~19: $P_3$ 執行 3 ms（剩 3）。佇列：$P_4, P_1, P_3$。</li>\n  <li>19~21: $P_4$ 執行 2 ms 完成（完成時間 21）。佇列：$P_1, P_3$。</li>\n  <li>21~23: $P_1$ 執行 2 ms 完成（完成時間 23）。佇列：$P_3$。</li>\n  <li>23~26: $P_3$ 執行 3 ms 完成（完成時間 26）。</li>\n</ul>\n<p>甘特圖：$[P_1: 0 \\to 3][P_2: 3 \\to 6][P_3: 6 \\to 9][P_4: 9 \\to 12][P_1: 12 \\to 15][P_2: 15 \\to 16][P_3: 16 \\to 19][P_4: 19 \\to 21][P_1: 21 \\to 23][P_3: 23 \\to 26]$</p>\n<ul>\n  <li>$P_1$: 完成 23，週轉 $23 - 0 = 23$，等待 $23 - 8 = 15\\,\\text{ms}$</li>\n  <li>$P_2$: 完成 16，週轉 $16 - 1 = 15$，等待 $15 - 4 = 11\\,\\text{ms}$</li>\n  <li>$P_3$: 完成 26，週轉 $26 - 2 = 24$，等待 $24 - 9 = 15\\,\\text{ms}$</li>\n  <li>$P_4$: 完成 21，週轉 $21 - 3 = 18$，等待 $18 - 5 = 13\\,\\text{ms}$</li>\n</ul>\n<p><strong>平均等待時間：</strong> $(15 + 11 + 15 + 13) / 4 = \\mathbf{13.50\\,\\text{ms}}$；<strong>平均週轉時間：</strong> $(23 + 15 + 24 + 18) / 4 = \\mathbf{20.00\\,\\text{ms}}$。</p>\n<p style=\"color: var(--accent-emerald); font-weight: 700;\">演算法評析：SRTF（搶占式 SJF）具備最低的平均等待時間（6.5 ms），理論表現最佳；Round Robin 雖然平均等待時間較長（13.5 ms），但能給予每個行程最公平的回應時間（Response Time）。</p>",
      "rubric": [
        "FCFS 甘特圖與指標計算完全正確（5 分）",
        "非搶占式 SJF 執行順序與平均時間推導正確（5 分）",
        "SRTF 搶占時機精確判定、甘特圖與數值計算正確（5 分）",
        "Round Robin 佇列輪轉與時間片切割推導精確（5 分）"
      ]
    },
    {
      "id": "essay-3",
      "chapter": "ch4",
      "category": "calc",
      "title": "阿姆達爾定律（Amdahl's Law）多核心加速比極限與瓶頸分析",
      "points": "15 分",
      "question": "某軟體工程師開發了一套影像特徵比對程式，經系統分析工具（Profiling Tool）量測，該程式在單核心處理器上的整體運算時間中，有 80% 的工作具備完全資料獨立性可平行化處理，其餘 20% 因檔案讀取與全域直方圖合併必須嚴格循序執行（$S = 0.20$）。\n<br/>\n1. 請寫出阿姆達爾定律（Amdahl's Law）的核心數學公式，並定義式中各項參數意義。<br/>\n2. 若將系統硬體由單核心 CPU 升級為 4 核心 CPU，該程式所能獲得的理論加速比（Speedup）為多少倍？<br/>\n3. 若進一步將硬體升級為 16 核心 CPU，加速比提升為多少倍？相較於 4 核心，處理器增加為 4 倍，加速比是否也提升為 4 倍？請評析其邊際效益。<br/>\n4. 若該工程師向主管宣稱：「只要公司採購配備 1024 顆核心的高效能運算叢集，該程式的執行速度必能提升 20 倍以上。」此說法是否正確？請以阿姆達爾定律的極限公式進行嚴格數學證明。",
      "hint": "阿姆達爾定律公式為 $\\text{Speedup} \\le \\frac{1}{S + \\frac{1 - S}{N}}$。當 $N \\to \\infty$ 時，$\\frac{1 - S}{N} \\to 0$，加速比極限為 $\\frac{1}{S}$。",
      "answer": "<p><strong>【題解第一部分：阿姆達爾定律公式定義】</strong></p>\n<p>核心數學公式：</p>\n<p>$$\\text{Speedup} \\le \\frac{1}{S + \\frac{1 - S}{N}}$$</p>\n<ul>\n  <li>$S$：程式中必須「循序執行（Serial portion）」的比例（$0 \\le S \\le 1$）。</li>\n  <li>$1 - S$：程式中可以「平行化執行（Parallel portion）」的比例。</li>\n  <li>$N$：系統中配置的處理器核心數量（Processing Cores）。</li>\n</ul>\n\n<p><strong>【題解第二部分：4 核心加速比計算】</strong></p>\n<p>已知 $S = 0.20$，$1 - S = 0.80$，$N = 4$：</p>\n<p>$$\\text{Speedup} = \\frac{1}{0.20 + \\frac{0.80}{4}} = \\frac{1}{0.20 + 0.20} = \\frac{1}{0.40} = \\mathbf{2.5\\,\\text{倍}}$$</p>\n\n<p><strong>【題解第三部分：16 核心加速比與邊際效益評析】</strong></p>\n<p>代入 $N = 16$：</p>\n<p>$$\\text{Speedup} = \\frac{1}{0.20 + \\frac{0.80}{16}} = \\frac{1}{0.20 + 0.05} = \\frac{1}{0.25} = \\mathbf{4.0\\,\\text{倍}}$$</p>\n<p><strong>邊際效益評析：</strong> 處理器核心數由 4 核心增加至 16 核心（硬體增加為 4 倍），但加速比僅由 2.5 倍微幅提升至 4.0 倍（僅成長 1.6 倍），未達線性增長。這證實了增加核心數所帶來的效能加速比呈現<strong>邊際效益遞減（Diminishing Returns）</strong>。</p>\n\n<p><strong>【題解第四部分：1024 核心宣稱之真偽判定與極限證明】</strong></p>\n<p>該工程師的說法<strong>完全錯誤</strong>。數學證明如下：</p>\n<p>當處理器核心數趨近於無窮大時（$N \\to \\infty$）：</p>\n<p>$$\\lim_{N \\to \\infty} \\text{Speedup} = \\lim_{N \\to \\infty} \\frac{1}{S + \\frac{1 - S}{N}} = \\frac{1}{S + 0} = \\frac{1}{S}$$</p>\n<p>在本題中 $S = 0.20$：</p>\n<p>$$\\text{最大理論加速比天花板} = \\frac{1}{0.20} = \\mathbf{5.0\\,\\text{倍}}$$</p>\n<p>代入 $N = 1024$ 實際計算：</p>\n<p>$$\\text{Speedup} = \\frac{1}{0.20 + \\frac{0.80}{1024}} = \\frac{1}{0.20 + 0.00078125} \\approx \\mathbf{4.98\\,\\text{倍}}$$</p>\n<p style=\"color: var(--accent-rose); font-weight: 700;\">結論：無論投入多少處理器核心，該程式加速比絕對不可能超過 5 倍，因此宣稱達到 20 倍在物理與數學上均為謬誤。循序部分（Serial Portion）是多核心平行擴充之根本瓶頸。</p>",
      "rubric": [
        "阿姆達爾公式與各項參數定義完整（3 分）",
        "4 核心與 16 核心加速比計算精確（5 分）",
        "邊際效益遞減分析深入合理（3 分）",
        "無窮極限公式推導嚴謹且成功反駁 20 倍宣稱（4 分）"
      ]
    },
    {
      "id": "essay-4",
      "chapter": "ch2",
      "category": "calc",
      "title": "fork() 系統呼叫行程樹、執行歷程與輸出次數綜合推導",
      "points": "15 分",
      "question": "請仔細分析下列 C 語言程式碼片段，回答各小題：\n<br/>\n<pre class=\"calc-code-box\" style=\"background:#0f172a; padding:1rem; border-radius:6px; color:#e2e8f0; font-family:Consolas, monospace;\">\n#include &lt;stdio.h&gt;\n#include &lt;unistd.h&gt;\n#include &lt;sys/wait.h&gt;\n\nint value = 10;\n\nint main() {\n    pid_t pid;\n    for (int i = 0; i &lt; 3; i++) {\n        pid = fork();\n        if (pid == 0) {\n            value += 5;\n        } else if (pid &gt; 0) {\n            wait(NULL);\n            value -= 2;\n        }\n    }\n    printf(\"PID: %d, value = %d\\n\", getpid(), value);\n    return 0;\n}\n</pre>\n1. 在整個執行歷程中，包含初始父行程在內，系統總共存在多少個行程？<br/>\n2. 請繪製（或以層級文字樹狀圖表示）這 3 次迴圈迭代所產生的完整「行程樹（Process Tree）」，並標明各層次之父子關係。<br/>\n3. 終端機上總共會輸出幾行 <code>PID: ..., value = ...</code> 的訊息？<br/>\n4. 子行程在執行 <code>value += 5</code> 後，父行程印出的 <code>value</code> 是否會受到該累加的影響？為什麼？請從作業系統行程虛擬位址空間與 <code>fork()</code> 複製機制深入闡述其底層原理。",
      "hint": "連續 n 次在迴圈中呼叫 fork()，總共會產生 $2^n$ 個行程。注意 fork() 後子行程獲得的是父行程位址空間的完整獨立副本（Copy），彼此記憶體空間隔離。",
      "answer": "<p><strong>【題解第一部分：總行程數推導】</strong></p>\n<p>在長度為 3 的迴圈中，每次迭代每個現存行程皆會呼叫一次 <code>fork()</code>：</p>\n<ul>\n  <li>$i = 0$: 1 個行程呼叫 <code>fork()</code> $\\to$ 產生 1 個新子行程，系統共有 $2^1 = 2$ 個行程。</li>\n  <li>$i = 1$: 2 個行程各自呼叫 <code>fork()</code> $\\to$ 各產生 1 個新子行程，系統共有 $2^2 = 4$ 個行程。</li>\n  <li>$i = 2$: 4 個行程各自呼叫 <code>fork()</code> $\\to$ 各產生 1 個新子行程，系統共有 $2^3 = 8$ 個行程。</li>\n</ul>\n<p>包含初始父行程在內，總共有 $\\mathbf{2^3 = 8\\,\\text{個行程}}$（其中新建立的子行程數為 $8 - 1 = 7$ 個）。</p>\n\n<p><strong>【題解第二部分：完整行程樹狀圖】</strong></p>\n<pre class=\"calc-code-box\" style=\"background:#0f172a; padding:0.8rem; border-radius:6px; color:#38bdf8; font-family:Consolas, monospace;\">\nP0 (初始行程)\n├── P1 (由 P0 於 i=0 創建)\n│   ├── P3 (由 P1 於 i=1 創建)\n│   │   └── P7 (由 P3 於 i=2 創建)\n│   └── P5 (由 P1 於 i=2 創建)\n├── P2 (由 P0 於 i=1 創建)\n│   └── P6 (由 P2 於 i=2 創建)\n└── P4 (由 P0 於 i=2 創建)\n</pre>\n\n<p><strong>【題解第三部分：輸出印出行數】</strong></p>\n<p>因為每個行程在離開迴圈後皆會執行到 <code>printf</code>，且 8 個行程皆正常執行至結束，因此總共會輸出 $\\mathbf{8\\,\\text{行}}$ 訊息。</p>\n\n<p><strong>【題解第四部分：記憶體隔離機制與 value 值獨立性剖析】</strong></p>\n<p>子行程執行 <code>value += 5</code> <strong>絕對不會</strong>影響父行程的 <code>value</code> 值。底層機制如下：</p>\n<ol style=\"margin-left: 1.5rem; line-height: 1.8;\">\n  <li><strong>位址空間完整獨立性：</strong> 當行程呼叫 <code>fork()</code> 時，作業系統會為子行程配置獨立的行程控制區塊（PCB）與獨立的虛擬記憶體位址空間。子行程的位址空間是父行程位址空間（包含 Text、Data、Heap、Stack）的<strong>完整副本（Duplicate）</strong>。</li>\n  <li><strong>實體記憶體隔離：</strong> 雖然現代作業系統採用<strong>寫入時複製（Copy-On-Write, COW）</strong>技術以最佳化效能，但一旦子行程或父行程嘗試對全域變數 <code>value</code> 進行寫入修改時，硬體記憶體管理單元（MMU）會立即觸發分頁錯誤（Page Fault），OS 會複製該實體頁面並重新映射。</li>\n  <li>因此，父子行程對變數 <code>value</code> 的存取各自位於獨立的實體記憶體分頁中，互不干擾。父行程在 <code>wait(NULL)</code> 喚醒後只會執行自己的 <code>value -= 2</code>，終端機上不同行程輸出的 <code>value</code> 值完全各自獨立。</li>\n</ol>",
      "rubric": [
        "總行程數推導正確（4 分）",
        "行程樹層級結構畫法正確完整（3 分）",
        "輸出總行數正確（3 分）",
        "虛擬記憶體空間複製、實體頁面隔離與 COW 機制解釋透徹（5 分）"
      ]
    },
    {
      "id": "essay-5",
      "chapter": "ch5",
      "category": "calc",
      "title": "死結臨界最少資源數鴿籠原理嚴格推導",
      "points": "15 分",
      "question": "在單一資源類型多實例的作業系統環境中，設系統中有 $n$ 個行程（$P_1, P_2, \\dots, P_n$）共同競爭同種類型的可重複使用資源，每種資源每次僅能分配給一個行程持有。已知每個行程在其執行週期中，最大資源需求量皆為 $m$ 個實例（$m \\ge 1$）。\n<br/>\n1. 請以「最差卡死狀態（Worst-case Deadlock State）」與「鴿籠原理（Pigeonhole Principle）」，嚴格數學推導出保證該系統「絕對不會發生死結」的系統資源總數 $M$ 之臨界充要條件：$M \\ge n(m - 1) + 1$。<br/>\n2. 若某作業系統中有 4 個行程，每個行程最大需要 5 個資源實例，則系統至少需要配備多少個資源實例才保證絕不死結？<br/>\n3. 承上題，若硬體預算受限，該系統目前僅能提供 17 個資源實例，則系統最多能同時允許幾個這樣的行程安全執行而不發生死結？",
      "hint": "思考「最差情況」：所有 n 個行程各自都拿到了 $m - 1$ 個資源，只差 1 個資源就能完成，但此時系統已經沒有任何可用資源！此時只要系統多出 1 個資源，就能打破僵局。",
      "answer": "<p><strong>【題解第一部分：鴿籠原理嚴格數學推導】</strong></p>\n<p>推導的核心邏輯是建構「系統可能出現的最極端卡死狀態（最接近死結但還沒卡死的極限狀態）」：</p>\n<ol style=\"margin-left: 1.5rem; line-height: 1.8;\">\n  <li><strong>最差卡死狀態設定：</strong> 假設系統中所有的 $n$ 個行程都已經獲配了 $m - 1$ 個資源實例。此時每個行程皆「持有一部分資源」，且各自「都在等待最後 1 個資源」以達到最大需求量 $m$：\n    $$\\text{每個行程持有的資源數} = m - 1$$\n  </li>\n  <li><strong>系統被佔用之資源總和：</strong> 此時所有行程累積持有的資源總數為：\n    $$\\text{已分配總數} = n \\times (m - 1)$$\n    若此時系統剩餘可用資源為 0（即系統總資源數剛好為 $n(m - 1)$），則所有 $n$ 個行程都在互相等待對方釋放資源，形成嚴格的循環等待鏈，系統陷入<strong>永久死結</strong>！\n  </li>\n  <li><strong>打破死結的臨界充要條件：</strong>\n    依據<strong>鴿籠原理（Pigeonhole Principle）</strong>，只要系統的資源總數 $M$ 比最差卡死狀態「至少多出 1 個資源」：\n    $$M \\ge n(m - 1) + 1$$\n    則在最差情況下，系統中必然至少存在一個行程能夠額外獲得這 1 個關鍵資源，使其持有總數達到 $(m - 1) + 1 = m$。\n  </li>\n  <li>該行程達到最大需求量 $m$ 後，便具備足夠資源執行完畢；執行完畢後會將其持有的全部 $m$ 個資源全數釋放歸還給系統。此時系統擁有充裕的可用資源，足以滿足其餘行程，骨牌效應下所有行程皆能依序執行完畢，<strong>保證絕不發生死結</strong>！</li>\n</ol>\n<p>得證臨界條件為：$\\mathbf{M \\ge n(m - 1) + 1}$。</p>\n\n<p><strong>【題解第二部分：4 行程需 5 資源之最少資源數計算】</strong></p>\n<p>已知 $n = 4$，$m = 5$：</p>\n<p>$$M \\ge 4 \\times (5 - 1) + 1 = 4 \\times 4 + 1 = \\mathbf{17\\,\\text{個資源實例}}$$</p>\n<p>系統至少需要 17 個資源實例才能保證絕不死結。</p>\n\n<p><strong>【題解第三部分：17 個資源反向推算最大行程數】</strong></p>\n<p>若系統總資源數固定為 $M = 17$，$m = 5$，設最多能容納 $n$ 個行程：</p>\n<p>$$M \\ge n(m - 1) + 1 \\implies 17 \\ge n(5 - 1) + 1 \\implies 17 \\ge 4n + 1$$</p>\n<p>$$4n \\le 16 \\implies n \\le 4$$</p>\n<p>因此系統最多能同時允許 $\\mathbf{4\\,\\text{個行程}}$ 安全執行而不發生死結。</p>",
      "rubric": [
        "最差卡死狀態設定邏輯清晰（3 分）",
        "鴿籠原理應用與最後 +1 釋放骨牌效應證明嚴謹（5 分）",
        "第二小題數值計算精確（3 分）",
        "第三小題不等式反向求解最大行程數正確（4 分）"
      ]
    },
    {
      "id": "essay-6",
      "chapter": "ch1",
      "category": "calc",
      "title": "記憶體階層有效存取時間（Effective Access Time, EAT）與快取效能推導",
      "points": "15 分",
      "question": "某現代伺服器之記憶體子系統由快取記憶體（Cache）與主記憶體（Main Memory）構成。快取的平均存取時間為 $2\\,\\text{ns}$，主記憶體的存取時間為 $80\\,\\text{ns}$。\n<br/>\n1. 請寫出兩階層記憶體架構下「有效存取時間（Effective Access Time, EAT）」的理論計算公式（設快取命中率為 $h$）。<br/>\n2. 若該系統目前的快取命中率為 $95\\%$（$h = 0.95$），計算其有效存取時間 EAT 為多少 $\\text{ns}$？<br/>\n3. 若系統設計規範要求有效存取時間 EAT 不得超過 $4\\,\\text{ns}$，則快取命中率 $h$ 最低必須達到多少百分比？<br/>\n4. 由上述計算結果，請深入評析「快取命中率（Cache Hit Ratio）」對整體電腦運算效能的敏感度。",
      "hint": "EAT 公式：命中時只需存取快取（$t_c$）；未命中時需先存取快取確認未命中，再加上存取主記憶體的時間（$t_c + t_m$）。",
      "answer": "<p><strong>【題解第一部分：EAT 理論計算公式】</strong></p>\n<p>當 CPU 發出記憶體存取請求時：</p>\n<ul>\n  <li>有 $h$ 的機率快取命中（Cache Hit），所需時間為快取存取時間 $t_c$。</li>\n  <li>有 $1 - h$ 的機率快取未命中（Cache Miss），所需時間為檢查快取加上存取主記憶體的時間 $t_c + t_m$（部分教科書亦簡化表示為 $t_m$ 或將缺失懲罰表記為 $t_c + t_{\\text{penalty}}$）。</li>\n</ul>\n<p>標準有效存取時間公式：</p>\n<p>$$\\text{EAT} = h \\times t_c + (1 - h) \\times (t_c + t_m) = t_c + (1 - h) \\times t_m$$</p>\n\n<p><strong>【題解第二部分：95% 命中率之 EAT 計算】</strong></p>\n<p>已知 $t_c = 2\\,\\text{ns}$，$t_m = 80\\,\\text{ns}$，$h = 0.95$：</p>\n<p>$$\\text{EAT} = 2 + (1 - 0.95) \\times 80 = 2 + 0.05 \\times 80 = 2 + 4 = \\mathbf{6\\,\\text{ns}}$$</p>\n\n<p><strong>【題解第三部分：要求 EAT $\\le 4\\,\\text{ns}$ 之最低命中率推導】</strong></p>\n<p>依據不等式：</p>\n<p>$$t_c + (1 - h) \\times t_m \\le 4$$</p>\n<p>$$2 + (1 - h) \\times 80 \\le 4 \\implies (1 - h) \\times 80 \\le 2$$</p>\n<p>$$1 - h \\le \\frac{2}{80} = 0.025 \\implies h \\ge 1 - 0.025 = 0.975$$</p>\n<p>因此快取命中率最低必須達到 $\\mathbf{97.5\\%}$。</p>\n\n<p><strong>【題解第四部分：快取效能敏感度深度評析】</strong></p>\n<ol style=\"margin-left: 1.5rem; line-height: 1.8;\">\n  <li><strong>微小命中率變動引發巨大效能落差：</strong> 當命中率由 $97.5\\%$ 微幅下降至 $95\\%$（僅僅下降 $2.5\\%$），EAT 便由 $4\\,\\text{ns}$ 飆升至 $6\\,\\text{ns}$（效能衰退幅度高達 $50\\%$）！</li>\n  <li><strong>存取速度鴻溝（Speed Gap）：</strong> 主記憶體存取速度比快取慢 40 倍（$80\\,\\text{ns}$ vs. $2\\,\\text{ns}$）。一旦發生未命中，巨大的「缺失懲罰（Miss Penalty）」會直接抵消數十個時脈週期的努力。</li>\n  <li>因此，現代作業系統與 CPU 硬體架構極度依賴多層快取（L1/L2/L3）與精密的替換策略（如 LRU），以確保命中率維持在 $98\\% \\sim 99\\%$ 以上的高水平。</li>\n</ol>",
      "rubric": [
        "EAT 理論公式推導正確（4 分）",
        "95% 命中率數值計算精確（3 分）",
        "4 ns 門檻不等式求解正確（4 分）",
        "記憶體速度鴻溝與命中率敏感度分析深刻（4 分）"
      ]
    },
    {
      "id": "essay-7",
      "chapter": "ch3",
      "category": "calc",
      "title": "即時排程速率單調（RMS）充分條件公式驗證與 EDF 排程對比",
      "points": "15 分",
      "question": "考慮兩個週期性即時行程 $T_1$ 與 $T_2$，其週期（Period $p$）與執行時間（Burst $c$）如下：\n<br/>\n- 行程 $T_1$：週期 $p_1 = 50\\,\\text{ms}$，執行時間 $c_1 = 20\\,\\text{ms}$<br/>\n- 行程 $T_2$：週期 $p_2 = 100\\,\\text{ms}$，執行時間 $c_2 = 35\\,\\text{ms}$<br/>\n<br/>\n1. 計算各行程的 CPU 利用率與整體系統總利用率 $U$。<br/>\n2. 寫出速率單調排程（Rate Monotonic Scheduling, RMS）之充分條件利用率上限公式 $U \\le N(2^{1/N} - 1)$。將 $N=2$ 代入公式驗證，判斷 RMS 演算法是否「保證」能排程這兩個行程？<br/>\n3. 請繪製時間 $0 \\sim 100\\,\\text{ms}$ 區間內，採用 RMS（$T_1$ 優先權高於 $T_2$）排程時的甘特圖，確認所有截止時間（Deadlines）是否均能順利滿足？<br/>\n4. 若將 $T_2$ 的執行時間增加為 $c_2 = 40\\,\\text{ms}$，請計算此時總利用率，並比較 RMS 與 EDF（最早截止時間優先）在此情境下的排程能力。",
      "hint": "RMS 依週期倒數指派靜態優先權（週期短優先權高）。RMS 的充分條件是保證線，即使總利用率超過界限，仍可能可排程，但若超過 100% 則任何演算法都無法排程。EDF 為動態優先權，理論上限可達 100%。",
      "answer": "<p><strong>【題解第一部分：各行程與系統總利用率計算】</strong></p>\n<ul>\n  <li>行程 $T_1$ 利用率：$U_1 = \\frac{c_1}{p_1} = \\frac{20}{50} = 0.40$（即 $40\\%$）</li>\n  <li>行程 $T_2$ 利用率：$U_2 = \\frac{c_2}{p_2} = \\frac{35}{100} = 0.35$（即 $35\\%$）</li>\n  <li>系統總利用率：$U = U_1 + U_2 = 0.40 + 0.35 = \\mathbf{0.75}$（即 $\\mathbf{75\\%}$）</li>\n</ul>\n\n<p><strong>【題解第二部分：RMS 充分條件公式驗證】</strong></p>\n<p>RMS 針對 $N$ 個即時週期行程的充分條件利用率上限為：</p>\n<p>$$U_{\\text{bound}} = N(2^{1/N} - 1)$$</p>\n<p>代入 $N = 2$：</p>\n<p>$$U_{\\text{bound}} = 2(2^{1/2} - 1) = 2(\\sqrt{2} - 1) \\approx 2(1.4142 - 1) = \\mathbf{0.8284\\; (82.84\\%)}$$</p>\n<p>驗證：$U = 0.75 \\le 0.8284$ 成立！因此 RMS 演算法<strong>絕對保證</strong>能夠成功排程這兩個行程，絕不會錯過任何截止時間。</p>\n\n<p><strong>【題解第三部分：0 ~ 100 ms RMS 甘特圖與截止時間驗證】</strong></p>\n<p>優先權判定：$p_1 = 50 < p_2 = 100$，因此 $\\mathbf{T_1 \\text{ 優先權高於 } T_2}$。</p>\n<ul>\n  <li>$[0 \\sim 20\\,\\text{ms}]$: $T_1$ 執行（完成第 1 週期，截止時間為 50）。</li>\n  <li>$[20 \\sim 50\\,\\text{ms}]$: $T_1$ 閒置，$T_2$ 執行 30 ms（剩 5 ms）。</li>\n  <li>$[50 \\sim 70\\,\\text{ms}]$: 時間 50 時 $T_1$ 第 2 週期到達，搶占 CPU 執行 20 ms 完成（截止時間 100）。</li>\n  <li>$[70 \\sim 75\\,\\text{ms}]$: $T_2$ 恢復執行剩餘的 5 ms，於時間 75 完成（截止時間 100）。</li>\n  <li>$[75 \\sim 100\\,\\text{ms}]$: CPU 閒置（Idle）。</li>\n</ul>\n<p>甘特圖：$[T_1: 0 \\to 20] \\; [T_2: 20 \\to 50] \\; [T_1: 50 \\to 70] \\; [T_2: 70 \\to 75] \\; [\\text{IDLE}: 75 \\to 100]$</p>\n<p>驗證結果：$T_1$ 在 20 與 70 完成（均小於各自截止時間 50 與 100）；$T_2$ 在 75 完成（小於截止時間 100）。所有截止時間全部準時滿足！</p>\n\n<p><strong>【題解第四部分：$c_2 = 40\\,\\text{ms}$ 時之 RMS vs. EDF 對比】</strong></p>\n<p>此時總利用率：$U = \\frac{20}{50} + \\frac{40}{100} = 0.40 + 0.40 = \\mathbf{0.80}$（即 $80\\%$）。</p>\n<ul>\n  <li>$U = 0.80 \\le 0.8284$ 依然成立，因此 RMS 仍可排程。</li>\n  <li>若進一步將 $c_2$ 增加至 $45\\,\\text{ms}$，則 $U = 0.40 + 0.45 = 0.85 > 0.8284$。此時 RMS 可能無法保證排程；但 <strong>EDF（最早截止時間優先）</strong> 是動態優先權演算法，理論證明只要 $U \\le 1.0$（$100\\%$），EDF 絕對能保證排程成功！</li>\n</ul>",
      "rubric": [
        "利用率計算正確（3 分）",
        "RMS 充分條件公式與 82.8% 上限驗證正確（4 分）",
        "甘特圖區間繪製與搶占點刻度推導精準（5 分）",
        "EDF 與 RMS 在高利用率下之能力對照深刻（3 分）"
      ]
    },
    {
      "id": "essay-8",
      "chapter": "ch1",
      "category": "concept",
      "title": "雙模式運作（Dual-Mode Operation）、特權指令與軟體中斷（Trap）",
      "points": "15 分",
      "question": "在現代作業系統硬體架構中，雙模式運作是保護核心不被惡意或錯誤使用者程式破壞的基石。請回答下列問題：\n<br/>\n1. 作業系統設計「雙模式運作（Dual-Mode Operation）」的根本目的為何？<br/>\n2. 硬體層級如何實體區分使用者模式（User Mode）與核心模式（Kernel Mode）？<br/>\n3. 什麼是「特權指令（Privileged Instructions）」？特權指令在何種模式下才能合法執行？若在使用者模式下嘗試執行特權指令，硬體會引發何種反應？請列舉兩項特權指令的典型範例。<br/>\n4. 當一個執行於使用者模式的文書處理程式欲將資料寫入硬碟時，說明其如何透過系統呼叫（System Call）觸發軟體中斷（Trap）並完成雙模式切換的完整硬體時序步驟。",
      "hint": "注意 Mode Bit 的數值（0 為核心模式，1 為使用者模式）。特權指令包含清空記憶體、設定計時器、關閉中斷、直接存取 I/O 等。",
      "answer": "<p><strong>【題解第一部分：雙模式運作之根本目的】</strong></p>\n<p>根本目的在於<strong>保護系統安全與穩定性</strong>。防止錯誤或惡意的使用者程式直接存取硬體設備、篡改作業系統核心代碼或干擾其他正常使用者的程式執行，確保多工環境下的系統隔離性。</p>\n\n<p><strong>【題解第二部分：硬體 Mode Bit 區分機制】</strong></p>\n<p>CPU 硬體提供一個專屬的狀態位元，稱為<strong>模式位元（Mode Bit）</strong>：</p>\n<ul>\n  <li>$\\text{Mode Bit} = 0$：代表<strong>核心模式（Kernel Mode / Supervisor Mode / System Mode）</strong>，CPU 具備最高權限，可存取所有記憶體與硬體。</li>\n  <li>$\\text{Mode Bit} = 1$：代表<strong>使用者模式（User Mode）</strong>，CPU 執行權限受到硬體電路嚴格受限。</li>\n</ul>\n\n<p><strong>【題解第三部分：特權指令定義、違規反應與範例】</strong></p>\n<ul>\n  <li><strong>定義：</strong> 凡是可能破壞系統正常運轉或直接存取硬體資源的關鍵指令，皆被作業系統與 CPU 定義為<strong>特權指令（Privileged Instructions）</strong>。</li>\n  <li><strong>合法執行模式：</strong> 僅能在核心模式（$\\text{Mode Bit} = 0$）下執行。</li>\n  <li><strong>違規反應：</strong> 若 CPU 處於使用者模式（$\\text{Mode Bit} = 1$）嘗試執行特權指令，CPU 硬體會直接拒絕執行，並引發一項硬體異常陷阱（Illegal Instruction Trap / Exception），控制權瞬間被強制轉交給作業系統核心，核心通常會直接終止（Abort）該違規程式。</li>\n  <li><strong>典型範例：</strong>\n    <ol>\n      <li>直接執行 I/O 操作指令（如讀寫特定 I/O Port）。</li>\n      <li>修改定時器計數值（Timer 設定）。</li>\n      <li>關閉/啟用硬體中斷（Disable/Enable Interrupts）。</li>\n      <li>修改分頁表指標（如 x86 的 CR3 暫存器）或 Base/Limit 記憶體保護暫存器。</li>\n    </ol>\n  </li>\n</ul>\n\n<p><strong>【題解第四部分：系統呼叫觸發 Trap 雙模式切換完整時序】</strong></p>\n<ol style=\"margin-left: 1.5rem; line-height: 1.8;\">\n  <li><strong>發起呼叫：</strong> 使用者應用程式呼叫 C 函式庫封裝的 <code>write()</code>，底層將系統呼叫號碼及參數填入 CPU 暫存器，隨後執行特殊機器指令（如 x86 的 <code>syscall</code> 或 <code>int 0x80</code>）。</li>\n  <li><strong>硬體觸發 Trap：</strong> CPU 硬體接收到該指令，引發軟體中斷（Trap / Exception）。</li>\n  <li><strong>模式位元切換：</strong> CPU 硬體自動將暫存器、程式計數器（PC）壓入核心堆疊保存狀態，並<strong>將 Mode Bit 自動由 1 切換為 0（進入核心模式）</strong>。</li>\n  <li><strong>跳轉 ISR：</strong> CPU 依據系統呼叫中斷向量表（Interrupt Vector Table），跳轉至對應的核心系統呼叫分派處理常式。</li>\n  <li><strong>核心特權執行：</strong> 核心檢查參數合法性，以特權權限驅動硬碟控制器執行實體寫入操作。</li>\n  <li><strong>返回使用者模式：</strong> 寫入完成後，核心將執行結果寫入暫存器，執行特權返回指令（如 <code>sysret</code> 或 <code>iret</code>）。硬體還原使用者暫存器與 PC，並<strong>將 Mode Bit 由 0 切換回 1（恢復使用者模式）</strong>，應用程式繼續執行。</li>\n</ol>",
      "rubric": [
        "雙模式目標與保護理念闡述清晰（3 分）",
        "Mode Bit 0/1 定義正確（3 分）",
        "特權指令定義、異常處置與兩個有效範例（4 分）",
        "Trap 觸發與硬體模式切換六大時序推導嚴謹（5 分）"
      ]
    },
    {
      "id": "essay-9",
      "chapter": "ch1",
      "category": "design",
      "title": "直接記憶體存取（DMA）機制 vs. 輪詢（Polling）與傳統中斷驅動",
      "points": "15 分",
      "question": "I/O 系統是作業系統中最關鍵的子系統之一。請從硬體架構與作業系統控制的角度，回答下列問題：\n<br/>\n1. 比較「輪詢（Polling）」、「傳統中斷驅動 I/O（Interrupt-Driven I/O）」與「直接記憶體存取（Direct Memory Access, DMA）」三者在 CPU 介入程度、硬體需求與適用裝置傳輸速度上的差異（以清晰表格或對照列點回答）。<br/>\n2. 為什麼在面對超高速 I/O 裝置（如 Gigabit 乙太網路、NVMe SSD）時，傳統中斷驅動機制會造成嚴重的 CPU 效能瓶頸（甚至引發中斷風暴）？<br/>\n3. 請詳細繪製或說明 DMA 控制器在主記憶體與磁碟緩衝區之間傳輸一整個資料區塊（Block）的完整步驟流程。<br/>\n4. 解釋為什麼 DMA 能將系統中斷頻率由「每傳輸 1 個 Byte 中斷一次」巨幅降低為「每傳輸 1 個 Block 中斷一次」，這對提升整體系統計算吞吐量有何重大貢獻？",
      "hint": "傳統中斷是由 CPU 親自透過暫存器一個 Byte 一個 Byte 搬移資料；DMA 則是 CPU 發出傳輸指令後，由 DMA 控制器直接接管匯流排搬移整個 Block。",
      "answer": "<p><strong>【題解第一部分：三種 I/O 機制全維度對照】</strong></p>\n<table class=\"comparison-table\" style=\"margin: 0.75rem 0; width: 100%;\">\n  <thead>\n    <tr>\n      <th>比較維度</th>\n      <th>輪詢（Polling）</th>\n      <th>中斷驅動（Interrupt-Driven）</th>\n      <th>直接記憶體存取（DMA）</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td><strong>CPU 介入程度</strong></td>\n      <td>極高。CPU 處於忙碌等待（Busy-waiting），不斷在迴圈中檢查狀態位元。</td>\n      <td>中等。CPU 在 I/O 期間可執行其他行程，但資料搬移仍由 CPU 逐位元組執行。</td>\n      <td><strong>極低</strong>。CPU 僅負責傳輸開始前的設定與傳輸完成後的中斷處理。</td>\n    </tr>\n    <tr>\n      <td><strong>硬體需求</strong></td>\n      <td>最低。僅需簡易的裝置暫存器與狀態旗標。</td>\n      <td>中等。需具備中斷控制器（PIC/APIC）與中斷請求線（IRQ）。</td>\n      <td>較高。需配備專屬的 <strong>DMA 控制器（DMAC）</strong>，具備匯流排主控（Bus Master）能力。</td>\n    </tr>\n    <tr>\n      <td><strong>適用裝置速度</strong></td>\n      <td>極慢速或極高速且保證短時間完成的專屬裝置。</td>\n      <td>中低速裝置（如鍵盤、滑鼠、序列埠）。</td>\n      <td><strong>高速傳輸裝置</strong>（如 NVMe SSD、千兆網路卡、顯示卡）。</td>\n    </tr>\n  </tbody>\n</table>\n\n<p><strong>【題解第二部分：高速裝置採用中斷驅動之瓶頸剖析】</strong></p>\n<p>在高速 I/O 裝置（如 10 Gbps 網路或 NVMe SSD）傳輸時，每秒鐘流入的資料量高達數百 MB 甚至數 GB：</p>\n<ul>\n  <li>若採用傳統中斷驅動方式，裝置每接收/傳輸一個 Byte（或一個 Word）就向 CPU 發出一次硬體中斷請求。</li>\n  <li>每一次中斷發生時，CPU 都必須暫停當前指令、執行完整的<strong>上下文切換（Context Switch）</strong>、儲存暫存器、查詢中斷向量表、跳轉執行中斷服務常式（ISR）、手動透過暫存器搬移一個 Byte、還原暫存器並返回。</li>\n  <li>在高頻傳輸下，CPU 將陷入嚴重的<strong>「中斷風暴（Interrupt Storm）」</strong>，所有的 CPU 運算時間全部被淹沒在處理中斷上下文切換的系統開銷（Overhead）中，完全無法執行任何有效的使用者計算程式。</li>\n</ul>\n\n<p><strong>【題解第三部分：DMA 控制器搬移資料之完整步驟】</strong></p>\n<ol style=\"margin-left: 1.5rem; line-height: 1.8;\">\n  <li><strong>裝置驅動程式發起設定：</strong> CPU 寫入 DMA 控制器的暫存器，告知：\n    <ul>\n      <li>傳輸方向（讀取或寫入）。</li>\n      <li>來源裝置位址。</li>\n      <li>目標主記憶體實體位址指標（Buffer Address）。</li>\n      <li>要傳輸的資料位元組總數（Byte Count / Block Size）。</li>\n    </ul>\n  </li>\n  <li><strong>CPU 釋放控制權：</strong> CPU 發出啟動訊號後，立即切換去執行其他使用者行程，完全不管傳輸過程。</li>\n  <li><strong>DMA 控制器接管傳輸：</strong> DMA 控制器向匯流排仲裁器請求匯流排主控權（Bus Master），透過<strong>週期竊取（Cycle Stealing）</strong>或區塊突發模式（Burst Mode），直接將資料在裝置區域緩衝區與主記憶體之間高速搬移。</li>\n  <li><strong>傳輸完成觸發中斷：</strong> 當整個資料區塊（如 4 KB）完全傳輸完畢且計數器歸零時，DMA 控制器才向 CPU 發出<strong>單一一次中斷訊號</strong>。</li>\n  <li><strong>核心收尾：</strong> CPU 響應中斷，通知驅動程式資料已就緒，更新緩衝區狀態並喚醒等待中的行程。</li>\n</ol>\n\n<p><strong>【題解第四部分：中斷頻率降低與系統吞吐量貢獻】</strong></p>\n<ul>\n  <li><strong>百倍至千倍的頻率驟降：</strong> 一個標準硬碟/SSD 區塊大小通常為 $4096\\,\\text{Bytes}$（4 KB）。傳統方式需觸發 4096 次中斷並切換上下文 4096 次；採用 DMA 後，整個區塊傳輸僅產生<strong>「1 次」中斷</strong>，中斷次數直接銳減為原本的 $\\frac{1}{4096}$！</li>\n  <li><strong>吞吐量實質飛躍：</strong> CPU 被徹底從繁瑣低階的資料搬移工作中解放出來，得以將 $99\\%$ 以上的週期投入於真正的高效能邏輯計算，最大化了多道程式設計環境下的 CPU 利用率與整體系統吞吐量。</li>\n</ul>",
      "rubric": [
        "三種 I/O 機制橫向對比準確（4 分）",
        "高速裝置中斷風暴瓶頸分析深刻（3 分）",
        "DMA 控制器五大傳輸步驟說明完整（5 分）",
        "中斷次數銳減與吞吐量優化理論論證充分（3 分）"
      ]
    },
    {
      "id": "essay-10",
      "chapter": "ch2",
      "category": "concept",
      "title": "三大排程器（Long-term, Medium-term, Short-term Schedulers）深度對照",
      "points": "15 分",
      "question": "排程器是作業系統協調資源、維護多工效率的核心引擎。請回答下列問題：\n<br/>\n1. 請針對「長期排程器（Long-term / Job Scheduler）」、「中期排程器（Medium-term Scheduler）」與「短期排程器（Short-term / CPU Scheduler）」繪製完整三維度橫向對照表，深入比較其：\n  - 執行頻率（Frequency）\n  - 核心職責與操作的排程佇列（Queues）\n  - 主控的系統指標與機制（如 Degree of Multiprogramming、Swapping）\n<br/>\n2. 什麼是「I/O-bound 行程」與「CPU-bound 行程」？請各給予一項生活化程式範例。<br/>\n3. 長期排程器在挑選行程載入主記憶體時，為什麼必須維持 I/O-bound 與 CPU-bound 行程的良好平衡？若系統中全部都是 CPU-bound 行程或全部都是 I/O-bound 行程，會引發何種系統資源失衡現象？",
      "hint": "長期排程器控制「多道程式設計程度」，中期排程器負責「Swapping（調換）」，短期排程器負責「毫秒級分配 CPU」。注意 I/O 與 CPU 平衡對消除資源閒置的決定性影響。",
      "answer": "<p><strong>【題解第一部分：三大排程器完整對照表】</strong></p>\n<table class=\"comparison-table\" style=\"margin: 0.75rem 0; width: 100%;\">\n  <thead>\n    <tr>\n      <th>比較維度</th>\n      <th>長期排程器（Long-term / Job Scheduler）</th>\n      <th>中期排程器（Medium-term Scheduler）</th>\n      <th>短期排程器（Short-term / CPU Scheduler）</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td><strong>執行頻率</strong></td>\n      <td><strong>低頻</strong>（數秒至數分鐘執行一次）。</td>\n      <td><strong>中頻</strong>（動態負載調節時觸發）。</td>\n      <td><strong>極高頻</strong>（毫秒級，每 10 ~ 100 ms 切換一次）。</td>\n    </tr>\n    <tr>\n      <td><strong>核心職責與操作佇列</strong></td>\n      <td>從磁碟集區（Job Pool）挑選批次作業，載入主記憶體的 <strong>Ready Queue</strong>。</td>\n      <td>當記憶體不足時將行程移出至次級儲存，後續再移回主記憶體。</td>\n      <td>從主記憶體的 <strong>Ready Queue</strong> 挑選下一個配置 CPU 運行的行程。</td>\n    </tr>\n    <tr>\n      <td><strong>主控指標與機制</strong></td>\n      <td>直接控制<strong>多道程式設計程度（Degree of Multiprogramming）</strong>，維持系統行程總容量。</td>\n      <td>實作<strong>調換（Swapping）機制</strong>，暫時降低多道程式設計程度以緩解記憶體爭奪。</td>\n      <td>直接決定系統<strong>回應時間（Response Time）</strong>與 CPU 運算利用率。</td>\n    </tr>\n    <tr>\n      <td><strong>所在系統型態</strong></td>\n      <td>傳統批次處理系統或大型主機；現代通用桌面 OS 較少限制。</td>\n      <td>支援分時系統與虛擬記憶體之現代作業系統（UNIX、Linux、Windows）。</td>\n      <td><strong>所有多工作業系統之必備核心模組</strong>。</td>\n    </tr>\n  </tbody>\n</table>\n\n<p><strong>【題解第二部分：I/O-bound vs. CPU-bound 行程定義與範例】</strong></p>\n<ul>\n  <li><strong>I/O-bound 行程：</strong>\n    <ul>\n      <li><strong>特徵：</strong> 花費在執行 I/O 操作的時間遠多於花費在 CPU 計算的時間；其 CPU burst 通常極短且頻率極高。</li>\n      <li><strong>範例：</strong> 網路爬蟲、文字編輯器、資料庫查詢介面（大部分時間等待使用者鍵盤輸入或磁碟讀寫）。</li>\n    </ul>\n  </li>\n  <li><strong>CPU-bound 行程：</strong>\n    <ul>\n      <li><strong>特徵：</strong> 花費絕大部分時間進行大量的 CPU 算術與邏輯計算，極少發起 I/O 請求；具備少數但極為冗長的 CPU burst。</li>\n      <li><strong>範例：</strong> 科學計算模擬、3D 動畫渲染、視訊編碼轉檔、密碼雜湊破解。</li>\n    </ul>\n  </li>\n</ul>\n\n<p><strong>【題解第三部分：維持兩者平衡之必要性與極端失衡後果】</strong></p>\n<p>長期排程器的最佳目標是維持良好的 <strong>I/O-bound 與 CPU-bound 行程組合（Mix）</strong>，以確保 CPU 與所有的 I/O 裝置同時保持忙碌：</p>\n<ol style=\"margin-left: 1.5rem; line-height: 1.8;\">\n  <li><strong>若系統全為 CPU-bound 行程：</strong>\n    <ul>\n      <li>多個長計算行程排隊搶奪 CPU，Ready Queue 嚴重擁堵。</li>\n      <li>所有的 I/O 裝置（硬碟、網路卡）長期處於<strong>完全閒置</strong>狀態，系統周邊設備投資極度浪費。</li>\n      <li>互動式回應時間急遽惡化。</li>\n    </ul>\n  </li>\n  <li><strong>若系統全為 I/O-bound 行程：</strong>\n    <ul>\n      <li>所有行程稍微執行幾個指令便發起 I/O 進入 Waiting 狀態，Device Queues 爆滿。</li>\n      <li>主記憶體中的 Ready Queue 頻繁變空，導致 <strong>CPU 大量處於閒置狀態（IDLE）</strong>，系統整體運算吞吐量嚴重低落。</li>\n    </ul>\n  </li>\n</ol>\n<p style=\"color: var(--accent-emerald); font-weight: 700;\">結論：只有兼顧兩者，才能讓 CPU 與週邊裝置併行運轉，達成多道程式設計的最大化利用率。</p>",
      "rubric": [
        "三大排程器對照表精準完整（5 分）",
        "I/O-bound 與 CPU-bound 定義與生活化範例（4 分）",
        "平衡必要性與兩大極端失衡後果剖析深刻（6 分）"
      ]
    },
    {
      "id": "essay-11",
      "chapter": "ch2",
      "category": "calc",
      "title": "行程間通訊（IPC）共享記憶體 vs. 訊息傳遞、有界限緩衝區空間條件",
      "points": "15 分",
      "question": "行程間通訊（IPC）是多工協作的基石。請回答下列問題：\n<br/>\n1. 建立橫向對照表，深度比較「共享記憶體（Shared Memory）」與「訊息傳遞（Message Passing）」在通訊速度、快取/硬體介入、同步責任、網路分散式支援上的核心差異。<br/>\n2. 在生產者-消費者問題之「有界限緩衝區（Bounded-Buffer）」環狀陣列演算法中：\n  - 宣告：<code>item buffer[BUFFER_SIZE]</code>，寫入索引 <code>int in = 0;</code>，讀取索引 <code>int out = 0;</code>。\n  - (a) 請分別寫出判定緩衝區「完全為空（Empty）」與「已經全滿（Full）」的 C 語言判斷表示式。\n  - (b) 解釋為什麼在容量為 <code>BUFFER_SIZE</code> 的陣列中，此演算法最多只能存放 <code>BUFFER_SIZE - 1</code> 個元素？\n<br/>\n3. 在訊息傳遞機制中，什麼是「會合（Rendezvous）」？其成立的充分必要條件為何？",
      "hint": "記住 Bounded-buffer 的 (in + 1) % BUFFER_SIZE == out 條件式；Rendezvous 是當 send 與 receive 兩端均設定為 Blocking 同步時的嚴格交會現象。",
      "answer": "<p><strong>【題解第一部分：IPC 兩大模型全維度對照】</strong></p>\n<table class=\"comparison-table\" style=\"margin: 0.75rem 0; width: 100%;\">\n  <thead>\n    <tr>\n      <th>比較面向</th>\n      <th>共享記憶體（Shared Memory）</th>\n      <th>訊息傳遞（Message Passing）</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td><strong>通訊速度</strong></td>\n      <td><strong>極快</strong>（僅建立時發起系統呼叫，後續直接以記憶體速度讀寫）。</td>\n      <td>較慢（每次訊息傳遞均需經由核心 System Call，涉及資料複製）。</td>\n    </tr>\n    <tr>\n      <td><strong>核心介入程度</strong></td>\n      <td>低（僅在建立共用記憶體區段時由核心介入）。</td>\n      <td>高（訊息由核心維護佇列並負責轉發）。</td>\n    </tr>\n    <tr>\n      <td><strong>同步與衝突責任</strong></td>\n      <td><strong>完全由應用程式設計師承擔</strong>（需自行實作信號量或互斥鎖防範 Race Condition）。</td>\n      <td>由作業系統核心負責佇列同步與緩衝管理。</td>\n    </tr>\n    <tr>\n      <td><strong>網路分散式支援</strong></td>\n      <td>僅限於同一台實體主機內部共用記憶體匯流排。</td>\n      <td><strong>天生支援跨網路不同主機之通訊</strong>（如 Client-Server、RPC、Socket）。</td>\n    </tr>\n  </tbody>\n</table>\n\n<p><strong>【題解第二部分：有界限緩衝區判定式與空間限制】</strong></p>\n<ol style=\"margin-left: 1.5rem; line-height: 1.8;\">\n  <li><strong>判定表示式：</strong>\n    <ul>\n      <li>緩衝區完全為空：<code>in == out</code></li>\n      <li>緩衝區已經全滿：<code>(in + 1) % BUFFER_SIZE == out</code></li>\n    </ul>\n  </li>\n  <li><strong>空間限制原因剖析：</strong>\n    <ul>\n      <li>在此指標演算法中，若允許填滿全部 <code>BUFFER_SIZE</code> 個空間，則當生產者寫入最後一個元素後，<code>in</code> 指標會推進一格：<code>(in + 1) % BUFFER_SIZE</code>，結果恰好會等於 <code>out</code>（即 <code>in == out</code>）。</li>\n      <li>這將導致<strong>「全空」與「全滿」的判斷條件完全相同（皆為 in == out）</strong>，演算法將無法區分緩衝區究竟是完全沒有資料還是全部塞滿！</li>\n      <li>因此，演算法必須<strong>刻意保留一個空位</strong>作為哨兵間隔，限制最多只能同時存放 <code>BUFFER_SIZE - 1</code> 個元素，使「全滿條件（下一格撞上 out）」與「全空條件（當前重疊 out）」精確區隔開來。</li>\n    </ul>\n  </li>\n</ol>\n\n<p><strong>【題解第三部分：會合（Rendezvous）機制精確定義】</strong></p>\n<ul>\n  <li><strong>定義：</strong> 在訊息傳遞（Message Passing）機制中，當傳送端（Sender）與接收端（Receiver）在通訊連結處達成高度同步的交會現象，稱為<strong>會合（Rendezvous）</strong>。</li>\n  <li><strong>成立的充分必要條件：</strong> <strong>傳送端的 <code>send()</code> 與接收端的 <code>receive()</code> 兩者同時設定為「阻塞型（Blocking / Synchronous）」</strong>。\n    <ul>\n      <li>若傳送端先發送，必須暫停等待直到接收端到達並接收；</li>\n      <li>若接收端先到達，必須暫停等待直到傳送端發出訊息；</li>\n      <li>雙方在訊息成功交換的瞬間同步解鎖繼續前進。</li>\n    </ul>\n  </li>\n</ul>",
      "rubric": [
        "IPC 兩大模型對照準確（4 分）",
        "緩衝區為空與已滿判定式寫法精準（4 分）",
        "保留一格空位避免條件混淆原因解釋清晰（4 分）",
        "會合 Rendezvous 定義與雙端 Blocking 條件闡述正確（3 分）"
      ]
    },
    {
      "id": "essay-12",
      "chapter": "ch4",
      "category": "concept",
      "title": "行程（Process）vs. 執行緒（Thread）記憶體配置、開銷與資源共享",
      "points": "15 分",
      "question": "多執行緒是現代應用程式提升效能的關鍵技術。請回答下列問題：\n<br/>\n1. 當一個行程內部創建了多個執行緒時，請詳細列出：\n  - (a) 哪些系統與記憶體資源是同行程內所有執行緒「共同共享」的？\n  - (b) 哪些資源是各個執行緒「各自私有獨立擁有」的？\n<br/>\n2. 為什麼在多執行緒架構中，作業系統必須為每個執行緒分配各自獨立的「堆疊區段（Stack Section）」？若執行緒之間共用堆疊會引發何種災難性後果？<br/>\n3. 從作業系統虛擬記憶體管理（分頁表 Page Table）與 CPU 快取（TLB 快取）的角度，深入分析為什麼「執行緒上下文切換（Thread Context Switch）」的系統開銷遠遠低於「行程上下文切換（Process Context Switch）」？",
      "hint": "執行緒共享 Text, Data, Heap, Files；私有 TID, PC, Registers, Stack。行程切換需要更換頁表指標（CR3）並刷新 TLB；執行緒切換虛擬位址空間完全不變！",
      "answer": "<p><strong>【題解第一部分：執行緒共享 vs. 私有資源清單】</strong></p>\n<ol style=\"margin-left: 1.5rem; line-height: 1.8;\">\n  <li><strong>同行程執行緒「完全共享」之資源：</strong>\n    <ul>\n      <li><strong>程式碼區段（Code / Text Section）：</strong> 所有執行緒執行同一份編譯好的機器指令。</li>\n      <li><strong>資料區段（Data Section）：</strong> 全域變數（Global Variables）與靜態變數（Static Variables）。</li>\n      <li><strong>堆積區段（Heap Section）：</strong> 動態配置記憶體（<code>malloc</code> / <code>new</code> 分配之空間）。</li>\n      <li><strong>作業系統資源：</strong> 開啟的檔案描述符清單（Open Files）、信號處置註冊常式（Signal Handlers）、網路 Socket 與通訊端點。</li>\n    </ul>\n  </li>\n  <li><strong>各執行緒「各自私有獨立」之資源：</strong>\n    <ul>\n      <li><strong>執行緒識別碼（Thread ID, TID）：</strong> 核心或函式庫中的唯一標識。</li>\n      <li><strong>程式計數器（Program Counter, PC）：</strong> 記錄各執行緒目前各自正在執行的指令記憶體位址。</li>\n      <li><strong>CPU 暫存器集合（Register Set）：</strong> 儲存各自運算時的整數暫存器、浮點暫存器與狀態旗標。</li>\n      <li><strong>堆疊區段（Stack Section）：</strong> 儲存各自的函式呼叫框架（Call Frames）、區域變數（Local Variables）與返回位址。</li>\n    </ul>\n  </li>\n</ol>\n\n<p><strong>【題解第二部分：獨立堆疊之必要性與共用堆疊之後果】</strong></p>\n<ul>\n  <li><strong>必要性：</strong> 在多執行緒環境中，各執行緒通常並行執行完全不同的函式，或者以不同的參數遞迴呼叫相同函式。每個執行緒必須擁有各自獨立的呼叫軌跡（Call Trace）與區域變數空間。</li>\n  <li><strong>共用堆疊的災難性後果：</strong> 若共用同一個堆疊，當執行緒 A 呼叫函式並壓入參數時，若執行緒 B 也同時呼叫函式壓棧，兩者的堆疊框架將<strong>交錯混雜（Interleaved）</strong>。當函式返回執行 <code>pop</code> 時，執行緒 A 將讀取到執行緒 B 的返回位址，導致程式邏輯徹底錯亂、記憶體損壞（Stack Corruption）並立即引發區段錯誤（Segmentation Fault）崩潰！</li>\n</ul>\n\n<p><strong>【題解第三部分：上下文切換開銷差異之底層硬體剖析】</strong></p>\n<ol style=\"margin-left: 1.5rem; line-height: 1.8;\">\n  <li><strong>行程上下文切換（開銷極大）：</strong>\n    <ul>\n      <li>行程擁有完全獨立的虛擬記憶體位址空間。切換行程時，CPU 必須將<strong>分頁目錄基底暫存器（如 x86 的 CR3 暫存器）重載</strong>為新行程的分頁表實體位址。</li>\n      <li>重載頁表會導致 CPU 內部的<strong>轉譯後備緩衝區（TLB, Translation Lookaside Buffer）全面失效（TLB Flush）</strong>。新行程開始執行時，每次存取記憶體皆會發生 TLB Miss，必須耗費數十至數百個時脈週期走訪多層分頁表，效能劇烈下降。</li>\n    </ul>\n  </li>\n  <li><strong>執行緒上下文切換（開銷極小）：</strong>\n    <ul>\n      <li>同一行程內部之所有執行緒<strong>共用相同的虛擬記憶體位址空間與分頁表</strong>。</li>\n      <li>切換執行緒時，<strong>完全不需要更換分頁表暫存器，TLB 快取內容維持完好無損</strong>。</li>\n      <li>CPU 僅需花費幾個時脈週期保存與切換少量的硬體暫存器值（Registers）、程式計數器（PC）與堆疊指標（SP），切換極為輕量迅速。</li>\n    </ul>\n  </li>\n</ol>",
      "rubric": [
        "共享與私有資源列舉精確完整（5 分）",
        "獨立堆疊必要性與共用崩潰後果解釋到位（4 分）",
        "分頁表切換、TLB 刷新與快取失效底層開銷深度剖析（6 分）"
      ]
    },
    {
      "id": "essay-13",
      "chapter": "ch4",
      "category": "design",
      "title": "三大多執行緒模型（Many-to-One, One-to-One, Many-to-Many）與現代 OS 實作選型",
      "points": "15 分",
      "question": "多執行緒模型定義了使用者層級執行緒與作業系統核心層級執行緒之間的映射方式。請回答下列問題：\n<br/>\n1. 請分別解釋「多對一（Many-to-One）」、「一對一（One-to-One）」與「多對多（Many-to-Many / Two-Level）」三種多執行緒模型的映射關係。<br/>\n2. 多對一模型在使用者空間進行管理，其建立與切換開銷極低，但為何主流通用作業系統幾乎不再採用此模型？請明確指出其面臨的兩大致命缺陷。<br/>\n3. 為什麼主流現代通用作業系統（如 Linux、Windows 10/11、macOS、Solaris 9+）一致選擇「一對一模型」？一對一模型最主要的缺點是什麼？作業系統通常採用何種機制控制該缺點的負面影響？",
      "hint": "多對一的兩大致命傷：單一執行緒 Blocking 導致整行程凍結；多核心系統無法真正平行。一對一的缺點是核心開銷大，因此 OS 通常對執行緒數量設定上限，或搭配執行緒池（Thread Pools）。",
      "answer": "<p><strong>【題解第一部分：三大多執行緒模型映射關係】</strong></p>\n<ol style=\"margin-left: 1.5rem; line-height: 1.8;\">\n  <li><strong>多對一模型（Many-to-One）：</strong> 將許多使用者層級執行緒（User Threads）映射至<strong>單一核心執行緒（Kernel Thread）</strong>。執行緒管理全由使用者空間函式庫負責，核心完全無感（Kernel-unaware）。</li>\n  <li><strong>一對一模型（One-to-One）：</strong> 每個使用者層級執行緒皆映射至<strong>一個專屬獨立的核心執行緒</strong>。建立使用者執行緒時同步由 OS 核心建立核心執行緒。</li>\n  <li><strong>多對多模型（Many-to-Many）：</strong> 將許多使用者執行緒多工映射至<strong>相同或較少數量的核心執行緒</strong>。允許 OS 核心根據硬體核心數動態建立合適數量的核心執行緒；其變形「雙層模型（Two-Level Model）」更允許將特定關鍵使用者執行緒綁定至專屬核心執行緒。</li>\n</ol>\n\n<p><strong>【題解第二部分：多對一模型之兩大致命缺陷】</strong></p>\n<ol style=\"margin-left: 1.5rem; line-height: 1.8;\">\n  <li><strong>單一阻塞導致全體凍結（One Blocked, All Blocked）：</strong> 由於作業系統核心只看得到單一核心執行緒，一旦某個使用者執行緒發起阻塞式系統呼叫（如 <code>read()</code> 磁碟或網路等待），核心會直接將該唯一的核心執行緒掛起，導致該行程內部<strong>所有其他原本準備好運行的使用者執行緒全部被迫停頓凍結</strong>！</li>\n  <li><strong>完全無法實現多核心硬體真平行（No Multicore Parallelism）：</strong> 核心在任何一個瞬間只能將該唯一的核心執行緒排程至一個 CPU 核心上執行。即使硬體配備了 16 核或 64 核 CPU，該行程內部的大量執行緒也<strong>絕對無法在多核心上同時平行運轉</strong>，多核心硬體優勢完全被浪費。</li>\n</ol>\n\n<p><strong>【題解第三部分：現代 OS 選擇一對一模型之原因與缺點控制】</strong></p>\n<ul>\n  <li><strong>主流選擇原因：</strong>\n    <ol>\n      <li><strong>絕佳的併行性（Concurrency）：</strong> 一個執行緒因 I/O 阻塞時，核心可獨立調度其他核心執行緒繼續執行，不會拖垮整個應用程式。</li>\n      <li><strong>充分發揮多核心真平行能力（Parallelism）：</strong> 核心可將不同執行緒分派至不同實體 CPU 核心上同時運算，完美契合現代多核心硬體架構普及的趨勢。</li>\n    </ol>\n  </li>\n  <li><strong>主要缺點：</strong> 每次建立使用者執行緒都必須發起系統呼叫建立核心執行緒，消耗核心堆疊與 PCB 記憶體空間，開銷相對較重。若應用程式無節制建立數萬個執行緒，會嚴重拖垮核心調度效能。</li>\n  <li><strong>作業系統控制機制：</strong>\n    <ol>\n      <li><strong>系統級上限防護：</strong> 作業系統設定每個行程能建立之執行緒總數配額上限（如 Linux 的 <code>max_user_watches</code> 或 <code>ulimit -u</code>）。</li>\n      <li><strong>隱式執行緒與執行緒池架構（Thread Pools）：</strong> 現代應用程式與框架廣泛採用執行緒池，預先建立固定數量的執行緒重複循環使用，將並行任務與底層核心執行緒數量有效解耦。</li>\n    </ol>\n  </li>\n</ul>",
      "rubric": [
        "三種模型映射定義精確（4 分）",
        "多對一模型兩大致命傷（阻塞與多核失效）論證充分（5 分）",
        "現代 OS 選型原因、缺點與控制機制闡述深刻（6 分）"
      ]
    },
    {
      "id": "essay-14",
      "chapter": "ch5",
      "category": "concept",
      "title": "死結四大必要條件、破壞預防策略與全域遞增編號排序證明",
      "points": "15 分",
      "question": "死結預防（Deadlock Prevention）是從源頭根除死結的重要理論。請回答下列問題：\n<br/>\n1. 寫出死結發生的「四個必要條件」，並分別給予精確的定義。<br/>\n2. 說明死結預防中破壞「持有並等待（Hold and Wait）」條件的兩種具體實作協定，並說明其所伴隨的代價。<br/>\n3. 詳述破壞「循環等待（Circular Wait）」之「全域資源遞增編號排序（Total Ordering of Resources）」協定規則。並請以<strong>反證法（Proof by Contradiction）</strong>嚴格證明：凡遵守該協定規則之系統，絕對不會產生循環等待環路。",
      "hint": "反證法步驟：假設存在循環等待環路 $P_0 \\to P_1 \\to \\dots \\to P_n \\to P_0$，依協定列出資源編號不等式 $F(R_{i_0}) < F(R_{i_1}) < \\dots < F(R_{i_0})$，導出矛盾！",
      "answer": "<p><strong>【題解第一部分：死結發生的四個必要條件】</strong></p>\n<ol style=\"margin-left: 1.5rem; line-height: 1.8;\">\n  <li><strong>互斥（Mutual Exclusion）：</strong> 至少有一項資源必須處於非共用模式，一次只能由一個行程持有；若其他行程請求該資源，必須等待直到其被釋放。</li>\n  <li><strong>持有並等待（Hold and Wait）：</strong> 一個行程至少持有一項資源的實例，同時又在等待取得其他已被其他行程佔用的資源。</li>\n  <li><strong>不可搶佔（No Preemption）：</strong> 資源不能被系統強制剝奪，只能由持有該資源的行程在完成任務後自願釋放。</li>\n  <li><strong>循環等待（Circular Wait）：</strong> 存在一個等待行程集合 $\\{P_0, P_1, \\dots, P_n\\}$，其中 $P_0$ 正等待 $P_1$ 持有的資源，$P_1$ 正等待 $P_2$ 持有的資源，...，$P_n$ 正等待 $P_0$ 持有的資源，形成閉合的環狀等待鏈。</li>\n</ol>\n\n<p><strong>【題解第二部分：破壞「持有並等待」之協定與代價】</strong></p>\n<ul>\n  <li><strong>協定一（一次性分配）：</strong> 規定行程在開始執行前，必須一次性向系統申請並全數獲配其生命週期所需的所有資源；若有任一項資源無法滿足，則一概不分配並等待。</li>\n  <li><strong>協定二（空手才能請求）：</strong> 規定行程僅在完全未持有任何資源的狀態下，才能提出新的資源請求。若已持有資源欲申請新資源，必須先將目前持有的資源全數釋放，再一併重新申請。</li>\n  <li><strong>系統代價：</strong>\n    <ol>\n      <li><strong>資源利用率極度低落：</strong> 許多資源可能只在程式執行的最後幾秒才需要使用，但在程式一開始就被長期鎖定佔用，導致大量硬體閒置。</li>\n      <li><strong>嚴重飢餓現象（Starvation）：</strong> 需要同時使用多種熱門資源的大型行程，極難一次湊齊所有資源，可能會遭遇無限期等待飢餓。</li>\n    </ol>\n  </li>\n</ul>\n\n<p><strong>【題解第三部分：全域遞增編號排序協定與反證法數學證明】</strong></p>\n<p><strong>協定規則：</strong></p>\n<ul>\n  <li>定義一個一對一的映射函數 $F: R \\to \\mathbb{N}$，將系統中所有的資源類型賦予全域唯一的自然數編號（例如：印表機 $F(R_1) = 1$，磁碟 $F(R_2) = 5$，記憶體 $F(R_3) = 12$）。</li>\n  <li><strong>強制請求協定：</strong> 規定所有行程必須嚴格按照資源編號的<strong>遞增順序（Increasing Order）</strong>提出請求。若某行程目前已持有資源 $R_i$，則該行程後續僅允許提出編號嚴格大於 $R_i$ 的資源請求（即必須滿足 $F(R_j) > F(R_i)$）。</li>\n</ul>\n\n<p><strong>反證法證明（Proof by Contradiction）：</strong></p>\n<ol style=\"margin-left: 1.5rem; line-height: 1.8;\">\n  <li>假設系統中所有行程皆嚴格遵守此遞增請求協定，但系統中卻<strong>依然存在一個循環等待環路</strong> $\\{P_0, P_1, \\dots, P_n\\}$。</li>\n  <li>在該循環等待鏈中：\n    <ul>\n      <li>行程 $P_0$ 持有資源 $R_{a_0}$，正在等待行程 $P_1$ 持有的資源 $R_{a_1}$。依據遞增協定必有：$$F(R_{a_0}) < F(R_{a_1})$$</li>\n      <li>行程 $P_1$ 持有資源 $R_{a_1}$，正在等待行程 $P_2$ 持有的資源 $R_{a_2}$。必有：$$F(R_{a_1}) < F(R_{a_2})$$</li>\n      <li>依此類推，行程 $P_i$ 持有 $R_{a_i}$ 等待 $P_{i+1}$ 持有的 $R_{a_{i+1}}$，必有：$$F(R_{a_i}) < F(R_{a_{i+1}})$$</li>\n      <li>最後，行程 $P_n$ 持有資源 $R_{a_n}$，正在等待行程 $P_0$ 持有的資源 $R_{a_0}$。依協定必有：$$F(R_{a_n}) < F(R_{a_0})$$</li>\n    </ul>\n  </li>\n  <li>將上述不等式鏈連續串聯：\n    $$F(R_{a_0}) < F(R_{a_1}) < F(R_{a_2}) < \\dots < F(R_{a_n}) < F(R_{a_0})$$\n  </li>\n  <li>由傳遞律（Transitivity）可推導出：\n    $$F(R_{a_0}) < F(R_{a_0})$$\n  </li>\n  <li>一個實數不可能嚴格小於自身，此結論在數學邏輯上<strong>顯然矛盾！</strong></li>\n</ol>\n<p style=\"color: var(--accent-emerald); font-weight: 700;\">結論：原假設不成立。遵守全域遞增請求協定的系統絕對不可能形成任何循環等待鏈，死結被徹底消除！</p>",
      "rubric": [
        "死結四個必要條件定義精確（4 分）",
        "破壞持有並等待兩大協定與代價說明完整（4 分）",
        "全域遞增編號排序協定說明準確（3 分）",
        "反證法數學鏈推導嚴謹且導出矛盾（4 分）"
      ]
    },
    {
      "id": "essay-15",
      "chapter": "ch5",
      "category": "calc",
      "title": "資源配置圖（RAG）宣告邊演算法與等待圖（Wait-for Graph）死結判定",
      "points": "15 分",
      "question": "資源配置圖與等待圖是分析死結的重要圖論工具。請回答下列問題：\n<br/>\n1. 在死結避免（Deadlock Avoidance）之資源配置圖演算法中：\n  - 什麼是「宣告邊（Claim Edge）」？圖中如何表示？\n  - 說明宣告邊、請求邊（Request Edge）與分配邊（Assignment Edge）三者之間的動態轉換生命週期。\n  - 當行程提出請求時，系統批准分配並將請求邊轉為分配邊的「安全判斷準則」為何？\n<br/>\n2. 為什麼在一般的資源配置圖中，「圖中存在環路（Cycle）」並不等同於「系統必然發生死結」？請以文字清晰構造出一個「包含環路但系統絕不死結」的具體多實例反例。<br/>\n3. 什麼是「等待圖（Wait-for Graph）」？等待圖適用於何種系統資源限制情境？在等待圖中判斷死結發生的充分必要條件為何？",
      "hint": "注意：單一實例時環路等價於死結；多實例時環路不一定死結（若環路外的行程能釋放實例打破環路）。等待圖僅適用於單一實例資源系統。",
      "answer": "<p><strong>【題解第一部分：宣告邊演算法與狀態轉換】</strong></p>\n<ol style=\"margin-left: 1.5rem; line-height: 1.8;\">\n  <li><strong>宣告邊定義與符號表示：</strong> 宣告邊記為 $P_i \\to R_j$，在資源配置圖中以<strong>虛線箭頭（Dashed Line）</strong>表示。代表行程 $P_i$ 在未來的執行歷程中「可能會申請」資源 $R_j$。所有未來的宣告邊必須在行程開始執行前宣告完畢。</li>\n  <li><strong>三種邊的動態轉換生命週期：</strong>\n    <ul>\n      <li>當行程 $P_i$ 真正發起資源申請時，虛線的<strong>宣告邊轉為實線的請求邊（Request Edge, $P_i \\to R_j$）</strong>。</li>\n      <li>當作業系統評估批准分配時，實線的<strong>請求邊轉為反向的分配邊（Assignment Edge, $R_j \\to P_i$）</strong>。</li>\n      <li>當行程 $P_i$ 使用完畢釋放該資源時，實線的<strong>分配邊重新轉回虛線的宣告邊（$P_i \\to R_j$）</strong>。</li>\n    </ul>\n  </li>\n  <li><strong>安全批准判斷準則：</strong> 當行程提出請求時，系統會先「假裝」將請求邊轉為分配邊；只有在轉換後<strong>整張圖（包含實線邊與所有虛線宣告邊）中「絕不包含任何有向環路（Cycle）」</strong>時，系統才正式批准分配；否則該請求必須等待。</li>\n</ol>\n\n<p><strong>【題解第二部分：環路不等於死結之多實例反例構造】</strong></p>\n<p>在資源具備多重實例（Multiple Instances）的系統中，環路只是死結的<strong>必要非充分條件</strong>。具體反例如下：</p>\n<ul>\n  <li><strong>系統配置：</strong> 行程集合 $\\{P_1, P_2, P_3\\}$；資源 $R_1$ 擁有 2 個實例，$R_2$ 擁有 1 個實例。</li>\n  <li><strong>分配狀態：</strong>\n    <ul>\n      <li>$R_1$ 的 2 個實例分別分配給 $P_1$ 與 $P_2$。</li>\n      <li>$R_2$ 的 1 個實例分配給 $P_3$。</li>\n    </ul>\n  </li>\n  <li><strong>請求狀態：</strong>\n    <ul>\n      <li>$P_1$ 正在請求 $R_2$。</li>\n      <li>$P_3$ 正在請求 $R_1$。</li>\n    </ul>\n  </li>\n  <li><strong>環路形成：</strong> 圖中存在封閉環路：$P_1 \\to R_2 \\to P_3 \\to R_1 \\to P_1$。</li>\n  <li><strong>為何絕不死結？</strong> 行程 $P_2$ 雖然持有 $R_1$ 的 1 個實例，但 $P_2$ <strong>完全沒有請求任何其他資源</strong>！因此 $P_2$ 會順利執行完畢並釋放其持有的 $R_1$ 實例。一旦釋放，$P_3$ 的請求立即得到滿足，打破了等待鏈，$P_3$ 執行完成後釋放 $R_2$ 給 $P_1$，所有行程依序完成，系統完全沒有死結！</li>\n</ul>\n\n<p><strong>【題解第三部分：等待圖（Wait-for Graph）機制】</strong></p>\n<ol style=\"margin-left: 1.5rem; line-height: 1.8;\">\n  <li><strong>定義：</strong> 等待圖是自資源配置圖中將所有「資源節點（矩形）」移除折疊後，僅由「行程節點（圓形）」構成的有向圖。有向邊 $P_i \\to P_j$ 代表行程 $P_i$ 目前正在等待行程 $P_j$ 釋放特定資源。</li>\n  <li><strong>適用情境：</strong> <strong>僅適用於系統中「所有資源類型皆為單一實例（Single Instance）」的情境</strong>。若有多重實例，無法單純由等待圖判定。</li>\n  <li><strong>充分必要判定定理：</strong> 在單一實例系統的等待圖中，<strong>死結發生的充分必要條件為「等待圖中存在有向環路（Cycle）」</strong>！作業系統定期執行環路搜尋演算法（時間複雜度為 $O(n^2)$），發現環路即可斷定死結。</li>\n</ol>",
      "rubric": [
        "宣告邊虛線定義與三邊動態生命週期正確（5 分）",
        "多實例環路不死結之反例構造清晰具說服力（5 分）",
        "等待圖定義、單一實例限制與充要條件說明完整（5 分）"
      ]
    },
    {
      "id": "essay-16",
      "chapter": "ch3",
      "category": "design",
      "title": "經典系統架構剖析：Chrome 瀏覽器多行程架構與 CPU 護衛效應（Convoy Effect）",
      "points": "15 分",
      "question": "系統架構設計必須在穩定性、安全性與排程效率之間取得權衡。請回答下列兩大經典問題：\n<br/>\n1. <strong>Google Chrome 多行程架構與沙盒機制：</strong><br/>\n  - (a) 傳統單行程（Single-Process）Web 瀏覽器面臨哪兩大核心痛點？<br/>\n  - (b) Google Chrome 如何劃分「Browser Process」、「Renderer Process」與「Plug-in Process」三大核心行程的角色與職責？<br/>\n  - (c) 為什麼 Chrome 堅持將 Renderer 行程運行在受限的「沙盒（Sandbox）」環境中？其防範了何種重大安全威脅？\n<br/>\n2. <strong>CPU 排程中的護衛效應（Convoy Effect）：</strong><br/>\n  - (a) 什麼是「護衛效應（Convoy Effect）」？它最容易在哪種排程演算法中發生？<br/>\n  - (b) 請給定一個包含 1 個長 CPU-bound 行程（Burst = 24 ms）與 2 個短 I/O-bound 行程（Burst 各為 3 ms）的具體範例，計算並對比不同排程順序下的平均等待時間，展示護衛效應造成的巨大效能落差。<br/>\n  - (c) 為什麼 Round Robin（輪轉排程）或 SJF（最短工作優先）能有效根治護衛效應？",
      "hint": "Chrome 沙盒限制 Renderer 行程直接存取磁碟與網路以防惡意 JS 代碼穿透；護衛效應範例中 P1(24), P2(3), P3(3) 在 FCFS 下若 P1 先到平均等待時間高達 17 ms，反之僅 3 ms。",
      "answer": "<p><strong>【題解第一部分：Google Chrome 多行程架構與沙盒】</strong></p>\n<ol style=\"margin-left: 1.5rem; line-height: 1.8;\">\n  <li><strong>傳統單行程瀏覽器痛點：</strong>\n    <ul>\n      <li><strong>單點崩潰連鎖反應（Poor Reliability）：</strong> 所有分頁、JavaScript 引擎與第三方外掛全部擠在同一行程中。只要任一網頁發生記憶體洩漏或死當，整個瀏覽器立即崩潰關閉，所有未儲存內容全部丟失。</li>\n      <li><strong>安全性威脅（Security Vulnerabilities）：</strong> 惡意網頁可利用 HTML/JS 渲染引擎的漏洞直接存取作業系統資源或竊取其他分頁的 Cookie/密碼資料。</li>\n    </ul>\n  </li>\n  <li><strong>Chrome 三大行程職責劃分：</strong>\n    <ul>\n      <li><strong>Browser Process（瀏覽器主行程）：</strong> 僅此一個。管理使用者介面（網址列、書籤）、磁碟 I/O、網路通訊與分頁生命週期調度。</li>\n      <li><strong>Renderer Process（渲染行程）：</strong> 負責解析與繪製 HTML、CSS 與執行 JavaScript。通常<strong>每個新分頁（Tab）或站點（Site Isolation）獨立啟動一個專屬的 Renderer 行程</strong>。</li>\n      <li><strong>Plug-in Process（外掛行程）：</strong> 針對 Flash、PDF 檢視器等第三方外掛獨立運行，避免外掛崩潰拖垮網頁渲染。</li>\n    </ul>\n  </li>\n  <li><strong>沙盒（Sandbox）安全隔離機制：</strong>\n    <ul>\n      <li>Renderer 行程直接面對不可信的外部網頁代碼。Chrome 透過作業系統權限限制，將 Renderer 嚴格鎖定於<strong>沙盒（Sandbox）</strong>中。</li>\n      <li>沙盒內的行程<strong>被剝奪直接讀寫硬碟檔案、發起系統呼叫或存取硬體的權限</strong>。任何檔案讀取或網路請求必須經由 IPC 向外傳遞給 Browser 主行程進行安全檢查後代理執行。</li>\n      <li>徹底杜絕了惡意網頁代碼利用渲染漏洞穿透至實體作業系統植入病毒的風險。</li>\n    </ul>\n  </li>\n</ol>\n\n<p><strong>【題解第二部分：CPU 排程護衛效應（Convoy Effect）深入剖析】</strong></p>\n<ol style=\"margin-left: 1.5rem; line-height: 1.8;\">\n  <li><strong>護衛效應定義：</strong> 在<strong>先來先服務（FCFS）</strong>排程中，當一個執行時間極長的 CPU-bound 行程排在隊伍最前方霸佔 CPU 時，後方許多僅需極短 CPU 時間便能進入 I/O 狀態的 I/O-bound 行程被迫在 Ready Queue 中漫長排隊等待（宛如大卡車後方跟隨一長列動彈不得的小轎車）。導致 CPU 利用率低下且 I/O 裝置長期閒置的現象。</li>\n  <li><strong>數值對比範例：</strong> 設 $P_1(24\\,\\text{ms}), P_2(3\\,\\text{ms}), P_3(3\\,\\text{ms})$ 皆在時間 0 到達：\n    <ul>\n      <li><strong>順序一（發生護衛效應，長行程在前）：$P_1 \\to P_2 \\to P_3$</strong>\n        <br/>等待時間：$P_1 = 0$，$P_2 = 24$，$P_3 = 24 + 3 = 27\\,\\text{ms}$。\n        <br/><strong>平均等待時間：</strong> $(0 + 24 + 27) / 3 = \\mathbf{17.0\\,\\text{ms}}$！\n      </li>\n      <li><strong>順序二（消除護衛效應，短行程在前）：$P_2 \\to P_3 \\to P_1$</strong>\n        <br/>等待時間：$P_2 = 0$，$P_3 = 3$，$P_1 = 3 + 3 = 6\\,\\text{ms}$。\n        <br/><strong>平均等待時間：</strong> $(0 + 3 + 6) / 3 = \\mathbf{3.0\\,\\text{ms}}$！\n      </li>\n      <li>平均等待時間由 17.0 ms 劇降至 3.0 ms，差距高達 5.6 倍！</li>\n    </ul>\n  </li>\n  <li><strong>Round Robin 與 SJF 根治原因：</strong>\n    <ul>\n      <li><strong>SJF：</strong> 優先挑選最短者執行，讓 $P_2, P_3$ 迅速執行並前往 I/O，根本杜絕長行程卡住佇列頭部。</li>\n      <li><strong>Round Robin（搶占式）：</strong> 設定極小時間量子（如 $q=4\\,\\text{ms}$），$P_1$ 執行 4 ms 後便被強行中斷奪回 CPU 並移至隊尾，後方的 $P_2, P_3$ 僅需等待極短時間便能獲得 CPU 並完成，大幅提升系統回應速度並維持 I/O 裝置忙碌。</li>\n    </ul>\n  </li>\n</ol>",
      "rubric": [
        "Chrome 單行程缺陷與三大行程架構職責說明正確（4 分）",
        "Renderer 沙盒機制與惡意代碼防護原理清晰（3 分）",
        "護衛效應定義精準（3 分）",
        "數值範例（17 ms vs. 3 ms）計算對比完整（3 分）",
        "RR 與 SJF 消除護衛效應機制解釋透徹（2 分）"
      ]
    }
  ]
};
