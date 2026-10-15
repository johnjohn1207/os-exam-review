/**
 * 作業系統期中考複習系統 - 核心資料模組 (Data Module)
 * 支援動態擴充：可透過管理介面新增章節、單元、抽認卡與測驗題。
 */
const OS_DEFAULT_DATA = {
  "chapters": [
    {
      "id": "ch1",
      "title": "CH1 作業系統概論與系統架構",
      "examTips": "記憶體階層圖（必考填空）、Multiprogramming 核心精神、三種排程器差別（Long/Medium/Short-term）、DMA 與中斷機制、雙模式與 Trap",
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
              "desc": "專為傳輸速度接近主記憶體的高速 I/O 裝置設計。\n裝置控制器直接將整塊資料（Block）於緩衝區與主記憶體間傳輸，完全不需要 CPU 介入。\n顯著降低中斷頻率：每傳輸一個完整資料區塊才產生一次中斷，而非每個位元組（Byte）中斷一次。"
            },
            {
              "term": "儲存階層與快取（Storage Hierarchy & Caching）",
              "desc": "三大劃分指標：速度（Speed）、成本（Cost）、揮發性（Volatility）。\n金字塔由頂至底（速度最快至最慢、成本最高至最低、容量最小至最大）：\n1. Registers（暫存器）\n2. Cache（快取記憶體）\n3. Main memory（主記憶體）\n4. Solid-state disk（固態硬碟）\n5. Magnetic disk（傳統磁碟）\n6. Optical disk（光碟）\n7. Magnetic tapes（磁帶）\n快取原理：將暫時頻繁使用的資料從慢速區複製至快速區。存取時先檢查快取，命中則直接使用；未命中則載入快取。替換策略（Replacement Policy）是設計核心。"
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
          "title": "六、 行程、記憶體與儲存管理概要",
          "summary": "OS 核心三大管理職責：行程管理、記憶體管理與檔案/次級儲存管理。",
          "items": [
            {
              "term": "程式（Program）vs. 行程（Process）",
              "desc": "程式是被動實體（Passive Entity，儲存於磁碟的檔案）；行程是執行中的程式，屬於主動實體（Active Entity）。\n行程具備程式計數器（PC）、堆疊、堆積等狀態。多執行緒則每個執行緒各有獨立 PC。"
            },
            {
              "term": "記憶體管理核心任務",
              "desc": "追蹤記憶體使用狀態；決定哪些行程移入或移出主記憶體；動態配置與釋放記憶體空間。"
            },
            {
              "term": "檔案系統抽象化與快取一致性",
              "desc": "將物理儲存抽象化為邏輯單位「檔案（File）」，提供目錄與權限存取控制。\n快取一致性（Cache Coherency）：多處理器架構下，確保所有 CPU 快取中的共用資料版本保持最新一致。"
            }
          ]
        }
      ]
    },
    {
      "id": "ch2",
      "title": "CH2 行程概念與處理序間通訊（IPC）",
      "examTips": "三種排程器比較（Long-term 控制 Multiprogramming 程度、Medium-term 負責 Swapping、Short-term 高頻切換 CPU）、PCB 欄位、五大狀態轉換、fork()/exec()/wait()/exit()、IPC 共享記憶體（in/out 滿空公式）vs. 訊息傳遞、Chrome 多行程架構、管道 Pipes",
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
              "desc": "又稱 Task Control Block，記錄單一行程的全部資訊：\n- 行程狀態（Process State）\n- 程式計數器（Program Counter, PC）\n- CPU 暫存器（CPU Registers）\n- CPU 排程資訊（優先權、佇列指標）\n- 記憶體管理資訊（Base/Limit 暫存器或頁表）\n- 會計資訊（CPU 使用時數、時間限制）\n- I/O 狀態資訊（配置的裝置、開啟檔案清單）\n在 Linux 中由 struct task_struct 實作。"
            }
          ]
        },
        {
          "id": "ch2-2",
          "title": "二、 行程排程（Process Scheduling）與三大排程器",
          "summary": "期中高頻考點：長期、中期、短期排程器的週期、目標與差異比較，以及上下文切換（Context Switch）。",
          "items": [
            {
              "term": "三大排程器深度比較（必考重點）",
              "desc": "1. 長期排程器（Long-term scheduler / Job scheduler）：\n   - 頻率：數秒或數分鐘一次（低頻）。\n   - 目標：從磁碟挑選作業載入記憶體，控制「多道程式設計的程度（Degree of Multiprogramming）」。平衡 I/O-bound 與 CPU-bound 行程。\n2. 短期排程器（Short-term scheduler / CPU scheduler）：\n   - 頻率：毫秒級（每 10-100 ms 執行一次，極高頻）。\n   - 目標：從 Ready queue 選擇下一個獲得 CPU 的行程。必須極為迅速。\n3. 中期排程器（Medium-term scheduler）：\n   - 機制：調換（Swapping）。\n   - 目標：當記憶體不足或過度競爭時，將行程從主記憶體移出至磁碟（Swap out），之後再載回（Swap in），藉此調降多道程式設計程度。"
            },
            {
              "term": "排程佇列（Scheduling Queues）",
              "desc": "Job queue：系統中所有行程的集合。\nReady queue：存放在主記憶體中，準備好且等待 CPU 執行的行程集合。\nDevice queues：等待特定 I/O 裝置的行程集合。"
            },
            {
              "term": "上下文切換（Context Switch）",
              "desc": "定義：當 CPU 切換至另一個行程時，系統必須保存舊行程的狀態（存入 PCB）並載入新行程已儲存的狀態。\n開銷：上下文切換期間 CPU 無法執行任何使用者工作，屬於純粹的系統額外負擔（Overhead）。"
            }
          ]
        },
        {
          "id": "ch2-3",
          "title": "三、 行程操作（Operations on Processes）",
          "summary": "行程樹、fork()、exec()、wait() 與 exit() 的生命週期調度。",
          "items": [
            {
              "term": "行程樹與 PID",
              "desc": "行程由父行程建立子行程，形成階層式行程樹（Process Tree），系統使用唯一整數 PID（Process ID）進行管理識別。"
            },
            {
              "term": "UNIX 系統呼叫四部曲",
              "desc": "1. fork()：建立子行程。子行程獲得父行程位址空間的完整獨立複製副本（Duplicate）。\n2. exec()：在 fork() 後呼叫，用新的二進位程式覆蓋當前行程位址空間並開始執行。\n3. wait()：父行程呼叫後暫停執行，進入等待狀態，直到子行程結束並回收其終止狀態碼。\n4. exit()：行程結束執行時呼叫，請求作業系統釋放其資源。"
            }
          ]
        },
        {
          "id": "ch2-4",
          "title": "四、 行程間通訊（Interprocess Communication, IPC）",
          "summary": "共享記憶體（Shared Memory）vs. 訊息傳遞（Message Passing）兩大模型架構與數學判斷式。",
          "items": [
            {
              "term": "IPC 兩大模型核心比較",
              "desc": "1. 共享記憶體（Shared Memory）：\n   - 比喻：同一辦公室的公用白板。\n   - 特點：速度最快，因為直接存取記憶體，無需每次經過 OS 核心。\n   - 缺點：程式設計師需自行處理同步與衝突控制。\n2. 訊息傳遞（Message Passing）：\n   - 比喻：互相傳 LINE 或寄信。\n   - 特點：透過 OS 核心提供的 send() 與 receive() 原語傳遞。安全、模組化，支援分散式網路通訊。\n   - 缺點：每次訊息傳遞都需要透過系統呼叫切換至核心，速度較慢。"
            },
            {
              "term": "有界限緩衝區（Bounded-Buffer）公式判斷（必考）",
              "desc": "宣告：item buffer[BUFFER_SIZE]，使用 in（寫入指標）與 out（讀取指標）。\n- 緩衝區為空條件：in == out\n- 緩衝區已滿條件：(in + 1) % BUFFER_SIZE == out\n- 空間利用限制：此演算法最多僅能使用 BUFFER_SIZE - 1 個元素空間（故意保留一格以區分全滿與全空）。"
            },
            {
              "term": "訊息傳遞的通訊特性",
              "desc": "直接通訊：指名發送接收者，如 send(P, msg)。\n間接通訊：發送至郵箱（Mailbox / Port）。\n同步性：阻塞型（Blocking / 同步，send 等待接收，兩端同時就位稱為 Rendezvous 會合）vs. 非阻塞型（Non-blocking / 非同步）。\n佇列容量：零容量（Zero capacity，強制會合）、有限容量（Bounded capacity）、無限容量（Unbounded capacity）。"
            }
          ]
        },
        {
          "id": "ch2-5",
          "title": "五、 主從式系統通訊與架構實例",
          "summary": "Socket、RPC、Pipes 管道特性，以及 Google Chrome 多行程架構。",
          "items": [
            {
              "term": "管道（Pipes）兩大分類",
              "desc": "普通管道（Ordinary / Anonymous Pipes）：單向通訊（Unidirectional），僅限具備父子親屬關係的行程使用。一端為 Write-end，另一端為 Read-end。\n具名管道（Named Pipes / FIFOs）：支援雙向通訊（Bi-directional），不需親屬血緣關係，多行程可共用，行程結束後仍保留在檔案系統中。"
            },
            {
              "term": "Google Chrome 多行程架構",
              "desc": "避免單一分頁崩潰導致全瀏覽器停止回應：\n1. Browser Process：管理瀏覽器介面、磁碟與網路。\n2. Renderer Process：負責解析與繪製 HTML/CSS/JS，運行於沙盒（Sandbox）中防禦惡意程式，每個 Tab 獨立擁有一個。\n3. Plug-in Process：管理外掛套件獨立執行。"
            },
            {
              "term": "Socket 與 RPC（遠端程序呼叫）",
              "desc": "Socket：由 IP 位址與 Port Number 組成的通訊端點（如 161.25.19.8:80）。\nRPC：將網路遠端呼叫包裝為宛如呼叫本機函式。利用 Client Stub 進行參數編包（Marshalling），Server Stub 進行解包（Unmarshalling）。使用 XDR 統一位元組順序相容性。"
            }
          ]
        }
      ]
    },
    {
      "id": "ch3",
      "title": "CH3 CPU 排程（CPU Scheduling）與甘特圖演練",
      "examTips": "甘特圖繪製與 Waiting Time 計算（100% 必考！）、五大排程評估指標、搶占式（Preemptive）vs. 非搶占式時機、FCFS（護衛效應）、SJF/SRTF（理論最佳、指數平均法）、Priority（飢餓與老化 Aging）、Round Robin（時間量子 q 權衡、80% 規則）、多層回饋佇列（MFQ）",
      "sections": [
        {
          "id": "ch3-1",
          "title": "一、 基本概念、時機與分派器",
          "summary": "CPU–I/O Burst Cycle、排程發起的 4 個時機點、搶占式與分派延遲。",
          "items": [
            {
              "term": "CPU–I/O 爆發週期（CPU–I/O Burst Cycle）",
              "desc": "行程執行由 CPU 計算（CPU burst）與 I/O 等待（I/O burst）交替循環構成。統計上呈現大量「短 CPU burst」與極少數「長 CPU burst」的特徵。"
            },
            {
              "term": "發起排程的 4 個時機點與搶占判定（必考）",
              "desc": "1. 行程從 Running 轉為 Waiting 狀態（例如發起 I/O 或等待子行程）。\n2. 行程從 Running 轉為 Ready 狀態（例如時間切片到期或發生中斷）。\n3. 行程從 Waiting 轉為 Ready 狀態（例如 I/O 操作完成）。\n4. 行程終止（Terminates）。\n非搶占式（Nonpreemptive）：僅在時機 1 與時機 4 進行排程，行程一旦拿到 CPU 就執行到釋放為止。\n搶占式（Preemptive）：包含時機 2 與時機 3，OS 可強行中斷執行中行程奪回 CPU。"
            },
            {
              "term": "分派器（Dispatcher）與分派延遲（Dispatch Latency）",
              "desc": "分派器是將 CPU 控制權交給短期排程器選出的行程之模組。\n三大任務：上下文切換、切換至使用者模式、跳轉至程式對應位址重啟。\n分派延遲：停止目前行程並啟動新行程所花費的時間，為純系統開銷（Overhead）。"
            }
          ]
        },
        {
          "id": "ch3-2",
          "title": "二、 五大核心排程指標（Scheduling Criteria）",
          "summary": "排程演算法的評估與最佳化指標定義及取捨。",
          "items": [
            {
              "term": "五大指標定義與目標",
              "desc": "1. CPU 利用率（CPU Utilization）：保持 CPU 忙碌的時間百分比（目標：最大化 Maximize）。\n2. 吞吐量（Throughput）：單位時間內完成的行程數量（目標：最大化 Maximize）。\n3. 轉向時間／週轉時間（Turnaround Time）：行程從提交（Submission）到執行完成（Completion）的總時間（目標：最小化 Minimize）。公式：Completion Time - Arrival Time。\n4. 等待時間（Waiting Time）：行程在就緒佇列（Ready queue）中等待 CPU 的累積時間（目標：最小化 Minimize）。公式：Turnaround Time - Burst Time。\n5. 回應時間（Response Time）：從提交請求到產生「第一個回應」的時間（分時系統最關注，目標：最小化 Minimize）。"
            }
          ]
        },
        {
          "id": "ch3-3",
          "title": "三、 核心排程演算法深度對決與甘特圖",
          "summary": "FCFS、SJF、SRTF、Priority、Round Robin 與多層回饋佇列全面剖析。",
          "items": [
            {
              "term": "1. 先來先服務（FCFS, First-Come First-Served）",
              "desc": "特性：非搶占式，先到達先分配 CPU。\n核心問題：護衛效應（Convoy Effect）。若一個耗時長的 CPU-bound 行程排在最前，後續所有短行程都要被迫長時間等待，導致平均等待時間大幅暴增。\n例如 P1(24), P2(3), P3(3) 到達時間 0：\n順序 P1->P2->P3 平均等待時間 = (0 + 24 + 27) / 3 = 17 ms；\n順序 P2->P3->P1 平均等待時間 = (0 + 3 + 6) / 3 = 3 ms。"
            },
            {
              "term": "2. 最短工作優先（SJF）與最短剩餘時間（SRTF）",
              "desc": "SJF（非搶占）：挑選下次 CPU burst 最短者。理論上能達到最低平均等待時間（Optimal）。\nSRTF（搶占式 SJF）：新行程到達時，若其 CPU burst 小於目前行程的「剩餘時間」，立即搶占 CPU！\n缺點：未來 CPU burst 無法預知；短行程持續到達會引發長行程「飢餓（Starvation）」。\n預測公式（指數平均法）：τ[n+1] = α * t[n] + (1 - α) * τ[n]，α 常取 1/2。"
            },
            {
              "term": "3. 優先權排程（Priority Scheduling）與老化技術",
              "desc": "規則：優先權數值越小，優先權通常越高。SJF 實質為優先權等於預測 burst 倒數的特例。\n問題：飢餓現象（Starvation / Indefinite Blocking），低優先權行程永遠拿不到 CPU。\n解法：老化技術（Aging）。隨著在佇列中等待時間增加，動態逐步調升行程的優先權。"
            },
            {
              "term": "4. 輪轉排程（Round Robin, RR）",
              "desc": "機制：分時系統專用，搶占式。分配時間量子（Time Quantum q，通常 10-100 ms）。行程用完 q 即被中斷排至 Ready queue 末端。\n等待時間上限：n 個行程時，任何行程等待不超過 (n - 1) * q。\n時間量子 q 的抉擇：\n- q 極大 (q -> ∞)：退化為 FCFS。\n- q 極小 (q -> 0)：造成大量上下文切換，開銷過高。\n- 經驗法則：80% 的 CPU burst 長度應小於 q。"
            },
            {
              "term": "5. 多層回饋佇列排程（Multilevel Feedback Queue, MFQ）",
              "desc": "允許行程在不同優先權子佇列間流動：\n- 降級（Demotion）：使用過多 CPU 時間的行程移至低優先權佇列。\n- 升級（Promotion / Aging）：等待時間過長的行程升至高優先權佇列防止飢餓。\n經典範例：\nQ0 (RR, q=8 ms, 最高) -> 未完降入 Q1 (RR, q=16 ms) -> 未完降入 Q2 (FCFS, 最低)。短行程快速完成，長行程沉降至底層。"
            }
          ]
        },
        {
          "id": "ch3-4",
          "title": "四、 多處理器排程（Multiple-Processor Scheduling）",
          "summary": "AMP vs. SMP、處理器親和性、負載平衡與多核心超執行緒架構。",
          "items": [
            {
              "term": "SMP 與處理器親和性（Processor Affinity）",
              "desc": "處理器親和性：行程傾向留在原 CPU 上執行，避免快取資料無效化（Cache Invalidation）與重新載入的高開銷。\n軟親和性（Soft）：OS 盡力維持；硬親和性（Hard）：允許指定特定 CPU 集合執行。\nNUMA 架構下必須分配至離記憶體最近的 CPU。"
            },
            {
              "term": "負載平衡策略（Load Balancing）",
              "desc": "推式遷移（Push Migration）：特定工作定時檢查負載，將行程由繁忙 CPU 推往閒置 CPU。\n拉式遷移（Pull Migration）：閒置 CPU 主動從繁忙 CPU 佇列拉取行程。\n權衡：負載平衡會破壞處理器親和性並導致快取失效。"
            },
            {
              "term": "記憶體停頓（Memory Stall）與超執行緒",
              "desc": "當快取未命中需存取記憶體時，CPU 產生記憶體停頓等待數百週期。\n超執行緒／硬體多執行緒：單核心具備多組硬體狀態（PC、暫存器），當一執行緒停頓時立即切換至另一執行緒執行，隱藏延遲。"
            }
          ]
        }
      ]
    },
    {
      "id": "ch5",
      "title": "CH5 死結（Deadlocks）",
      "examTips": "死結四大必要條件（必考名詞解釋）、資源配置圖環路判斷（單實例必死結、多實例不一定）、銀行家演算法安全狀態推導（期中計算大題）、死結預防破壞循環等待（資源遞增排序編號）、死結避免要求最大需求量（Max Demand）、現代 OS 鴕鳥策略（忽視死結）",
      "sections": [
        {
          "id": "ch5-1",
          "title": "一、 系統模型（System Model）",
          "summary": "在作業系統中，系統是由有限的資源（Resources）與競爭這些資源的行程（Processes）所組成。",
          "items": [
            {
              "term": "資源類型與實例（Resource Types & Instances）",
              "desc": "1. 系統包含多種不同的資源類型 $R_1, R_2, \\dots, R_m$（例如：CPU 週期、記憶體空間、輸入/輸出設備）。\n2. 每種資源類型 $R_i$ 可以包含 $W_i$ 個相同的實例（Instances）。若系統配置 2 台相同型號的印表機，則印表機資源類型擁有 2 個實例。"
            },
            {
              "term": "行程使用資源的三階段（Three Phases of Resource Utilization）",
              "desc": "行程在使用任何系統資源時，必須嚴格遵循固定的循序流程：\n1. 請求（Request）：行程向系統申請所需資源。若該資源無法立即分配，行程必須進入等待狀態。\n2. 使用（Use）：行程獲得資源後，對資源進行操作（例如：對印表機進行輸出列印、讀寫磁碟檔案）。\n3. 釋放（Release）：行程使用完畢後，將資源歸還給作業系統，以供其他等待中的行程取用。"
            }
          ]
        },
        {
          "id": "ch5-2",
          "title": "二、 死結特徵（Deadlock Characterization）",
          "summary": "定義死結發生的四個必要條件、資源配置圖（Resource-Allocation Graph, RAG）表示法與環路判斷準則。",
          "items": [
            {
              "term": "死結發生的四個必要條件（Four Necessary Conditions）",
              "desc": "當且僅當以下四個條件同時成立時，系統才有可能陷入死結狀態（缺一不可）：\n1. 互斥（Mutual Exclusion）：一次只能有一個行程使用該資源；若有其他行程請求該資源，該行程必須等待直到資源被釋放。\n2. 持有並等待（Hold and Wait）：行程至少持有一項資源的實例，同時又在等待取得其他已被其他行程持有的資源。\n3. 不可搶佔（No Preemption）：資源不能被系統強制剝奪，只能由持有該資源的行程在完成任務後自願釋放。\n4. 循環等待（Circular Wait）：存在一個等待行程集合 $\\{P_0, P_1, \\dots, P_n\\}$，其中 $P_0$ 正等待 $P_1$ 持有的資源，$P_1$ 正等待 $P_2$ 持有的資源，……，$P_n$ 正在等待 $P_0$ 持有的資源，形成一個封閉的環狀等待鏈。"
            },
            {
              "term": "資源配置圖（Resource-Allocation Graph, RAG）",
              "desc": "以有向圖 $G = (V, E)$ 描述系統中行程與資源的配置狀態：\n1. 頂點集合（Vertices, $V$）：\n   - 行程集合（Process Set, $P$）：以圓形節點表示（$P_1, P_2, \\dots, P_n$）。\n   - 資源集合（Resource Set, $R$）：以矩形節點表示（$R_1, R_2, \\dots, R_m$），矩形內的圓點個數代表該資源類型的實例數量。\n2. 有向邊集合（Edges, $E$）：\n   - 請求邊（Request Edge）：由行程指向資源（$P_i \\to R_j$），代表行程 $P_i$ 正向系統申請資源 $R_j$ 的實例（處於等待狀態）。\n   - 分配邊（Assignment Edge）：由資源指向行程（$R_j \\to P_i$），代表資源 $R_j$ 的一個實例已正式分配給行程 $P_i$。"
            },
            {
              "term": "死結與環路的判斷規則（Basic Facts: Cycle vs. Deadlock）",
              "desc": "利用資源配置圖，透過檢查圖中是否存在「環路（Cycle）」來判斷死結狀態：\n1. 無環路（No Cycle）：系統絕對不會發生死結（無環路是系統絕無死結的充分條件）。\n2. 存在環路（Cycle）：\n   - 單一實例（Single Instance）：若環路中的每種資源類型都只有一個實例，則必然發生死結。\n   - 多實例（Several Instances）：若資源類型擁有硬體或軟體的多個實例，則有可能發生死結，但環路並不等於死結（環路外部若有其他行程釋放資源即可打破環路）。"
            }
          ]
        },
        {
          "id": "ch5-3",
          "title": "三、 死結處理方法（Methods for Handling Deadlocks）",
          "summary": "作業系統面對死結的三種基本處理哲學：預防避免、偵測復原、完全忽視。",
          "items": [
            {
              "term": "策略一：確保系統絕不進入死結狀態",
              "desc": "採用嚴格規範或動態檢查，確保系統從源頭不產生死結：\n1. 死結預防（Deadlock Prevention）：透過規範資源請求的方式，強制破壞死結發生的四個必要條件之一（互斥、持有並等待、不可搶佔、循環等待）。\n2. 死結避免（Deadlock Avoidance）：要求行程事先宣告其可能需要的最大資源量（Maximum Demand），系統在動態分配資源時評估是否能讓系統維持在安全狀態（Safe State）；若會進入不安全狀態則暫緩分配。"
            },
            {
              "term": "策略二：允許進入死結，隨後進行偵測與復原",
              "desc": "系統平時不限制行程對資源的請求，而是允許死結發生，並透過事後機制解決：\n1. 死結偵測（Deadlock Detection）：系統定期執行偵測演算法（針對單一實例使用等待圖 Wait-for Graph，針對多實例使用矩陣演算法），檢查系統中是否有行程陷入死結。\n2. 死結復原（Recovery from Deadlock）：當偵測到死結時，系統採取行動，透過終止行程（Process Termination）或搶佔資源（Resource Preemption）以打破死結循環。"
            },
            {
              "term": "策略三：完全忽視死結問題（鴕鳥演算法 Ostrich Algorithm）",
              "desc": "直接假裝死結永遠不會發生。\n1. 主流作業系統（UNIX、Linux 與 Windows）皆採用此策略。\n2. 採用原因：在實際系統中死結發生的頻率通常較低，但死結預防與避免所需的運算開銷與資源利用率限制相當昂貴。因此作業系統選擇將問題留給使用者或系統管理員手動處置（例如透過工作管理員結束未回應的應用程式）。"
            }
          ]
        },
        {
          "id": "ch5-4",
          "title": "四、 死結預防（Deadlock Prevention）",
          "summary": "透過規範資源請求的方式，強制打破死結發生的四個必要條件之一，確保系統絕不陷入死結。",
          "items": [
            {
              "term": "破壞「互斥（Mutual Exclusion）」條件",
              "desc": "對於可共用的資源（例如唯讀檔案），不需要進行互斥存取。\n然而，許多硬體或軟體資源（如印表機、磁帶機）本質上無法同時給多個行程使用，因此實務上極難透過破壞互斥條件來預防死結。"
            },
            {
              "term": "破壞「持有並等待（Hold and Wait）」條件",
              "desc": "系統必須保證：當一個行程請求新資源時，它不能同時持有其他資源。\n1. 實現方式：\n   - 要求行程在開始執行前，必須一次性申請並獲配其所需的所有資源。\n   - 或僅允許行程在未持有任何資源時，才能提出新的資源請求。\n2. 缺點：這種方式會導致資源利用率低下（Low resource utilization），且需要大量資源的行程可能會面臨飢餓（Starvation）問題。"
            },
            {
              "term": "破壞「不可搶佔（No Preemption）」條件",
              "desc": "若一個持有部分資源的行程提出新的資源請求，但該資源無法立即分配給它，則該行程目前持有的所有資源都會被系統強制釋放（搶佔）。\n這些被搶佔的資源會被加回該行程所等待的資源清單中。該行程必須等到能同時重新獲得舊有資源與新請求的資源時，才會重新啟動並繼續執行。"
            },
            {
              "term": "破壞「循環等待（Circular Wait）」條件",
              "desc": "系統對所有資源類型給予一個全域的總排序編號（Total Ordering，例如定義一對一函數 $F: R \\to \\mathbb{N}$）。\n規定所有行程必須嚴格按照資源編號的「遞增順序（Increasing Order）」提出資源請求，從而杜絕環狀等待鏈的形成。"
            }
          ]
        },
        {
          "id": "ch5-5",
          "title": "五、 死結避免（Deadlock Avoidance）",
          "summary": "系統在動態分配資源時，根據事先取得的資源需求先驗資訊，評估分配後的系統狀態，確保系統絕不進入不安全狀態。",
          "items": [
            {
              "term": "基本概念與先驗資訊（A Priori Information）",
              "desc": "1. 先驗資訊需求：死結避免要求系統必須具備額外的先驗資訊，最常見的模型是要求每個行程在開始前，必須事先宣告其可能需要的每種資源之最大需求量（Maximum Demand）。\n2. 動態檢查機制：系統在每次收到資源請求時，動態檢查資源配置狀態，確保系統永遠不會形成循環等待條件。\n3. 資源配置狀態：由目前可用資源（Available）、已分配資源（Allocated）以及行程的最大需求量（Max Demand）共同定義。"
            },
            {
              "term": "安全狀態與不安全狀態（Safe State vs. Unsafe State）",
              "desc": "1. 安全狀態定義：若系統能夠找到一組所有行程的安全序列（Safe Sequence）$\\langle P_1, P_2, \\dots, P_n \\rangle$，則稱系統處於安全狀態。\n2. 安全序列條件：在該序列中，對於每個行程 $P_i$，它未來仍可能請求的資源量，皆可由「目前可用資源 + 所有在其前方行程 $P_j$（$j < i$）目前持有的資源」來滿足。\n3. 集合與邏輯關係：\n   - 安全狀態（Safe State） $\\implies$ 絕對不會發生死結。\n   - 不安全狀態（Unsafe State） $\\implies$ 有可能發生死結（不安全狀態是死結發生的必要非充分條件）。\n   - 死結避免的目標就是確保系統永遠不要脫離安全狀態進入不安全狀態。"
            },
            {
              "term": "單一資源實例：資源配置圖演算法（RAG Algorithm）",
              "desc": "在原本的資源配置圖中引入宣告邊（Claim Edge，$P_i \\to R_j$），以虛線表示行程將來可能會請求該資源：\n1. 當行程真正提出請求時，宣告邊會轉為實線的請求邊（Request Edge）。\n2. 分配判斷規則：只有當將請求邊轉為分配邊（$R_j \\to P_i$）後，圖中「不會形成任何環路（Cycle）」時，系統才會批准該次資源分配。"
            },
            {
              "term": "多重資源實例：銀行家演算法（Banker's Algorithm）",
              "desc": "適用於每種資源類型擁有多個實例之情境，由 Edsger Dijkstra 提出：\n1. 核心資料結構（設 $n$ 為行程數，$m$ 為資源類型數）：\n   - Available（長度 $m$ 的向量）：各資源類型的目前可用實例數。\n   - Max（$n \\times m$ 矩陣）：宣告每個行程對各資源的最大需求量。\n   - Allocation（$n \\times m$ 矩陣）：每個行程目前已獲配的資源量。\n   - Need（$n \\times m$ 矩陣）：每個行程尚需要的資源量，計算公式為 $Need[i][j] = Max[i][j] - Allocation[i][j]$。\n2. 安全演算法（Safety Algorithm）：\n   - 步驟 1：初始化工作向量 $Work = Available$，以及各行程完成狀態 $Finish[i] = false$。\n   - 步驟 2：尋找符合 $Finish[i] == false$ 且 $Need_i \\le Work$ 的行程 $P_i$。若找不到則跳至步驟 4。\n   - 步驟 3：模擬 $P_i$ 獲得資源並執行完畢歸還資源：$Work = Work + Allocation_i$，更新 $Finish[i] = true$，並返回步驟 2。\n   - 步驟 4：若所有行程的 $Finish[i]$ 皆為 $true$，則系統處於安全狀態。\n3. 資源請求演算法（Resource-Request Algorithm）：當行程 $P_i$ 提出資源請求向量 $Request_i$ 時：\n   - 步驟 1：若 $Request_i \\le Need_i$，進入步驟 2；否則報錯（超出原先宣告的最大需求）。\n   - 步驟 2：若 $Request_i \\le Available$，進入步驟 3；否則 $P_i$ 必須等待（系統目前可用資源不足）。\n   - 步驟 3：系統假裝分配資源並更新狀態：$Available = Available - Request_i$, $Allocation_i = Allocation_i + Request_i$, $Need_i = Need_i - Request_i$。\n   - 步驟 4：執行安全演算法測試新狀態。若為安全狀態則正式分配；若為不安全狀態則取消假裝分配，還原舊狀態並讓 $P_i$ 繼續等待。"
            }
          ]
        },
        {
          "id": "ch5-6",
          "title": "六、 死結偵測（Deadlock Detection）",
          "summary": "死結偵測策略允許系統進入死結狀態。系統平時不限制資源請求，而是定期或在特定時機執行演算法檢查系統是否已陷入死結。",
          "items": [
            {
              "term": "單一資源實例：等待圖（Wait-for Graph）",
              "desc": "當每種資源類型都只有一個實例時，系統可以維護一個由資源配置圖簡化而來的等待圖（Wait-for Graph）：\n1. 頂點（Nodes）：僅由系統中的行程組成（去除資源節點）。\n2. 有向邊（Directed Edges）：若存在 $P_i \\to P_j$，代表行程 $P_i$ 正在等待行程 $P_j$ 所持有的資源。\n3. 判斷方法：系統定期調用尋找環路（Cycle）的演算法。當且僅當等待圖中存在環路時，系統中存在死結。\n4. 時間複雜度：在包含 $n$ 個頂點（行程）的圖中，偵測環路的演算法時間複雜度為 $O(n^2)$。"
            },
            {
              "term": "多重資源實例：死結偵測演算法（Detection Algorithm）",
              "desc": "當資源類型包含多個實例時，無法單靠等待圖判斷，需要使用矩陣資料結構進行動態追蹤：\n1. 資料結構（設 $n$ 為行程數，$m$ 為資源類型數）：Available（長度 $m$ 向量）、Allocation（$n \\times m$ 矩陣）、Request（$n \\times m$ 矩陣，表示當前各行程實際提出的請求量）。\n2. 演算法步驟：\n   - 初始化：設定工作向量 $Work = Available$。對每個行程 $i$，若 $Allocation_i \\ne 0$，則設 $Finish[i] = false$；否則（未持有任何資源）設 $Finish[i] = true$。\n   - 尋找可執行的行程：尋找符合 $Finish[i] == false$ 且 $Request_i \\le Work$ 的行程 $i$。若找不到，直接跳至步驟 4。\n   - 模擬資源回收：假設行程 $P_i$ 獲得所需資源並順利執行完畢，釋放其已分配的資源：$Work = Work + Allocation_i$，並更新 $Finish[i] = true$，接著返回步驟 2。\n   - 判斷死結：若存在任何 $Finish[i] == false$，則系統處於死結狀態，且所有 $Finish[i] == false$ 的行程 $P_i$ 皆陷入死結中。\n3. 時間複雜度：多實例死結偵測演算法需要 $O(m \\times n^2)$ 的運算次數。"
            },
            {
              "term": "偵測演算法的執行時機與頻率（Detection-Algorithm Usage）",
              "desc": "主要取決於兩大因素：死結發生的可能性高低，以及死結發生時需要被復原/回滾（Rollback）的行程數量。\n注意事項：若偵測演算法執行的間隔過長或太隨機，圖中可能會累積多個交錯的環路。這會導致系統無法確定究竟是哪一個行程的請求引發了死結，大幅增加事後復原的難度與代價。"
            }
          ]
        },
        {
          "id": "ch5-7",
          "title": "七、 死結復原（Recovery from Deadlock）",
          "summary": "當死結偵測演算法確認系統陷入死結時，透過行程終止或資源搶佔打破死結環路，使系統恢復正常運作。",
          "items": [
            {
              "term": "行程終止（Process Termination）",
              "desc": "透過強制結束死結鏈中的行程以回收其持有的資源：\n1. 終止所有死結行程（Abort all deadlocked processes）：最簡單直接，但代價非常昂貴，因為所有死結行程先前已完成的運算成果都會遺失。\n2. 逐一終止行程（Abort one process at a time until the deadlock cycle is eliminated）：每次只終止一個行程，並隨即重新調用死結偵測演算法；重複此步驟直到死結循環完全消除。此方式開銷較高（需反覆偵測），但能保護其他非必要的行程不被誤殺。\n3. 選擇終止行程的 6 大評估因素（Selection Criteria）：\n   - 行程的優先權（Priority）。\n   - 行程已經計算的時間，以及距離完成還需要多少時間。\n   - 行程目前已使用的資源種類與數量。\n   - 行程要順利完成還需要申請多少資源。\n   - 打破死結循環總共需要被終止的行程數量。\n   - 行程是互動式（Interactive）還是批次（Batch）處理。"
            },
            {
              "term": "資源搶佔（Resource Preemption）",
              "desc": "在不終止行程的前提下，強制剝奪（搶佔）部分行程的資源並轉分配給其他行程，直到死結循環被打破：\n1. 選擇受害者（Selecting a victim）：決定要從哪些行程搶佔資源，並以「最小化總代價/成本（Minimize cost）」為優先原則。\n2. 回滾（Rollback）：被剝奪資源的行程無法直接繼續執行，系統必須將該行程回滾（Rollback）至先前的某個安全狀態（Safe state），並從該狀態重新開始執行。\n3. 避免飢餓（Starvation）：若僅以成本為考量，同一個行程可能會重複被選為受害者（Victim），導致其永遠無法執行完畢（陷入飢餓）。\n   - 解決機制：在計算搶佔成本時，必須將行程被回滾的次數（Number of rollbacks）納入考量，回滾次數越多的行程被選為受害者的機率越低。"
            }
          ]
        }
      ]
    }
  ],
  "memoryHierarchy": [
    {
      "level": 1,
      "name": "Registers",
      "zhName": "暫存器",
      "speed": "最快（< 1 ns）",
      "cost": "最高",
      "capacity": "最小（< 1 KB）",
      "volatile": true,
      "managedBy": "編譯器 / 硬體"
    },
    {
      "level": 2,
      "name": "Cache",
      "zhName": "快取記憶體（L1/L2/L3）",
      "speed": "快（幾 ns）",
      "cost": "高",
      "capacity": "小（數 MB）",
      "volatile": true,
      "managedBy": "硬體"
    },
    {
      "level": 3,
      "name": "Main memory",
      "zhName": "主記憶體（RAM）",
      "speed": "中等（數十 ns）",
      "cost": "中等",
      "capacity": "中等（數十 GB）",
      "volatile": true,
      "managedBy": "作業系統"
    },
    {
      "level": 4,
      "name": "Solid-state disk",
      "zhName": "固態硬碟（SSD）",
      "speed": "較慢（數十 µs）",
      "cost": "較低",
      "capacity": "大（數百 GB 至數 TB）",
      "volatile": false,
      "managedBy": "作業系統"
    },
    {
      "level": 5,
      "name": "Magnetic disk",
      "zhName": "傳統磁碟（HDD）",
      "speed": "慢（數 ms）",
      "cost": "低",
      "capacity": "大（數 TB）",
      "volatile": false,
      "managedBy": "作業系統"
    },
    {
      "level": 6,
      "name": "Optical disk",
      "zhName": "光碟（DVD / BD）",
      "speed": "極慢（數十 ms）",
      "cost": "極低",
      "capacity": "中等（數 GB）",
      "volatile": false,
      "managedBy": "作業系統"
    },
    {
      "level": 7,
      "name": "Magnetic tapes",
      "zhName": "磁帶（Tapes）",
      "speed": "最慢（秒級，循序存取）",
      "cost": "極低",
      "capacity": "極大",
      "volatile": false,
      "managedBy": "作業系統 / 歸檔軟體"
    }
  ],
  "flashcards": [
    {
      "id": "fc-1",
      "chapter": "ch1",
      "front": "作業系統的雙模式運作（Dual-Mode Operation）目的是什麼？如何進行模式切換？",
      "back": "目的：保護作業系統與系統元件不受錯誤的使用者程式干擾與破壞。\n切換方式：硬體提供 Mode Bit（1 為 User Mode，0 為 Kernel Mode）。當使用者行程需要系統服務時呼叫 System Call，引發 Trap/Exception，將 Mode Bit 設為 0 切換至 Kernel Mode；核心處理完畢後將 Mode Bit 設回 1 並返回 User Mode。"
    },
    {
      "id": "fc-2",
      "chapter": "ch1",
      "front": "什麼是直接記憶體存取（DMA）？它為何能大幅降低 CPU 負擔？",
      "back": "專為高速 I/O 裝置設計的機制。裝置控制器可以直接將整塊資料區塊（Block）於緩衝區與主記憶體之間搬移，完全無需 CPU 介入。\n優勢：原本每傳輸 1 個 Byte 就必須中斷一次 CPU，改為整塊傳輸完成後才引發一次中斷，中斷頻率大幅降低。"
    },
    {
      "id": "fc-3",
      "chapter": "ch1",
      "front": "多道程式設計（Multiprogramming）的核心精神與達成目的為何？",
      "back": "核心精神：單一程式無法讓 CPU 與 I/O 同時忙碌。因此系統將多個程式同時載入主記憶體，當正在執行的程式需要等待 I/O 時，OS 立即切換 CPU 去執行另一個程式。\n目的：最大化 CPU 利用率（CPU Utilization）。"
    },
    {
      "id": "fc-4",
      "chapter": "ch1",
      "front": "記憶體階層架構由頂端至底端的變化趨勢為何？（三大指標）",
      "back": "由頂端（Registers）到底端（Magnetic tapes）：\n1. 存取速度：由快到慢\n2. 單位成本：由高到低\n3. 儲存容量：由小到大\n（前三層 Registers、Cache、Main memory 屬於揮發性 Volatile，其餘為非揮發性 Nonvolatile）。"
    },
    {
      "id": "fc-5",
      "chapter": "ch2",
      "front": "比較三種排程器：長期、中期、短期排程器（頻率、目標）。",
      "back": "1. 長期排程器（Job Scheduler）：低頻（數秒/分鐘），從磁碟挑選行程進記憶體，控制「多道程式設計的程度（Degree of Multiprogramming）」。\n2. 短期排程器（CPU Scheduler）：極高頻（毫秒級），從 Ready queue 選擇行程分配 CPU。\n3. 中期排程器（Medium-term Scheduler）：透過調換（Swapping）將行程移入移出記憶體，暫時降低多道程式設計程度以減輕負載。"
    },
    {
      "id": "fc-6",
      "chapter": "ch2",
      "front": "行程控制區塊（PCB）包含哪些關鍵資訊？",
      "back": "行程狀態（State）、程式計數器（PC）、CPU 暫存器內容、CPU 排程資訊（優先權、佇列指標）、記憶體管理資訊（基底/邊界暫存器或頁表）、會計資訊（CPU 使用時間）、I/O 狀態資訊（配置裝置與開啟檔案）。"
    },
    {
      "id": "fc-7",
      "chapter": "ch2",
      "front": "有界限緩衝區（Bounded-Buffer）中判定「空」與「滿」的數學公式？空間利用率為何？",
      "back": "以陣列長度 BUFFER_SIZE 為例：\n- 緩衝區為空：in == out\n- 緩衝區已滿：(in + 1) % BUFFER_SIZE == out\n- 空間利用：最多僅能存入 BUFFER_SIZE - 1 個項目（必須保留一格空位以區分全滿與全空）。"
    },
    {
      "id": "fc-8",
      "chapter": "ch2",
      "front": "普通管道（Ordinary Pipes）與具名管道（Named Pipes）的兩大主要區別？",
      "back": "1. 方向性：普通管道為單向通訊（Unidirectional）；具名管道為雙向通訊（Bi-directional）。\n2. 血緣限制：普通管道必須具備父子親屬關係；具名管道無需親屬關係，且行程結束後具名管道仍留存於檔案系統中。"
    },
    {
      "id": "fc-9",
      "chapter": "ch3",
      "front": "非搶占式（Nonpreemptive）排程僅在發起排程的哪兩種時機點發生？",
      "back": "1. 行程從 Running 狀態轉為 Waiting 狀態（例如發起 I/O 或等待子行程）。\n2. 行程終止（Terminates）。\n（若包含 Running -> Ready 或 Waiting -> Ready 則屬於搶占式 Preemptive）。"
    },
    {
      "id": "fc-10",
      "chapter": "ch3",
      "front": "什麼是 FCFS 的「護衛效應（Convoy Effect）」？會帶來什麼後果？",
      "back": "當一個長時間佔用 CPU 的 CPU-bound 行程排在最前面時，後方許多只需要短暫 CPU 時間的 I/O-bound 行程被卡在 Ready queue 中等待。\n後果：導致全系統的平均等待時間（Average Waiting Time）急劇暴增，I/O 裝置利用率低下。"
    },
    {
      "id": "fc-11",
      "chapter": "ch3",
      "front": "SJF 與優先權排程共同面臨的缺點是什麼？如何解決？",
      "back": "缺點：飢餓現象（Starvation / Indefinite Blocking），當短行程或高優先權行程源源不絕到達時，長行程或低優先權行程永遠無法取得 CPU。\n解決方案：老化技術（Aging），隨著行程在 Ready queue 中等待時間拉長，系統動態調高其優先權。"
    },
    {
      "id": "fc-12",
      "chapter": "ch3",
      "front": "Round Robin 排程演算法中，時間量子（Time Quantum q）設為極大與極小時的後果？",
      "back": "q 極大（q -> ∞）：每個行程都能一次執行完，RR 退化為 FCFS 演算法。\nq 極小（q -> 0）：行程頻繁切換，造成龐大的上下文切換開銷（Context Switch Overhead），CPU 效率崩潰。\n經驗法則：80% 的 CPU burst 應小於 q。"
    },
    {
      "id": "fc-13",
      "chapter": "ch3",
      "front": "多層回饋佇列排程（MFQ）為什麼能兼顧互動式行程與計算型行程？",
      "back": "新行程先進入最高優先權的短時間切片佇列（Q0），短行程（如互動式）可立刻迅速完成離開；\n若行程在該時間片內未完成，代表需要大量運算，會被降級至時間量子較長或 FCFS 的低層佇列，避免長期霸占高優先權佇列。"
    },
    {
      "id": "fc14",
      "chapter": "ch5",
      "front": "作業系統發生死結（Deadlock）的四個必要條件為何？",
      "back": "1. 互斥（Mutual Exclusion）：資源一次只能被一個行程使用。\n2. 持有並等待（Hold and Wait）：持有一項資源且等待另一項資源。\n3. 不可搶佔（No Preemption）：資源只能由持有者自願釋放。\n4. 循環等待（Circular Wait）：形成環狀等待鏈 {P0 等 P1, P1 等 P2... Pn 等 P0}。\n（記憶口訣：互、持、不、循；四者同時成立才可能發生死結）"
    },
    {
      "id": "fc15",
      "chapter": "ch5",
      "front": "資源配置圖（RAG）中若存在「環路（Cycle）」，是否必然會發生死結？",
      "back": "不一定！需視資源實例數量而定：\n- 單一實例（Single Instance）：存在環路 ⟺ 必然發生死結。\n- 多重實例（Several Instances）：存在環路 ⟹ 僅代表「可能」發生死結，不等於死結。\n若圖中「無環路（No Cycle）」，則系統絕對不會發生死結。"
    },
    {
      "id": "fc16",
      "chapter": "ch5",
      "front": "現代主流作業系統（如 UNIX、Linux、Windows）為何普遍採取「忽視死結（鴕鳥策略）」？",
      "back": "因為在通用個人電腦與伺服器中，死結發生的頻率通常較低，但實施死結預防（降低資源利用率）或死結避免（昂貴的即時運算開銷）成本極高。\n因此現代 OS 選擇假裝死結永遠不會發生，將處置責任留給使用者或系統管理員（如手動強制結束未回應行程）。"
    },
    {
      "id": "fc17",
      "chapter": "ch5",
      "front": "在死結預防（Deadlock Prevention）中，如何破壞「循環等待（Circular Wait）」條件？",
      "back": "對系統中所有資源類型給予全域的總排序編號（Total Ordering，如 F: R → N），並強制規定所有行程必須嚴格按照資源編號的「遞增順序（Increasing Order）」提出申請，從而徹底杜絕環狀等待鏈的形成。"
    },
    {
      "id": "fc18",
      "chapter": "ch5",
      "front": "系統狀態模型中，「安全狀態（Safe State）」、「不安全狀態（Unsafe State）」與「死結（Deadlock）」的集合關係為何？",
      "back": "1. 安全狀態（Safe State）：存在至少一組安全序列，保證「絕對不會發生死結」。\n2. 不安全狀態（Unsafe State）：不保證所有行程能順利完成，「有可能發生死結」。\n3. 死結（Deadlock）是不安全狀態的真子集（Deadlock ⊂ Unsafe State）。死結必然是不安全狀態，但不安全狀態不一定立刻死結。"
    },
    {
      "id": "fc19",
      "chapter": "ch5",
      "front": "在銀行家演算法（Banker's Algorithm）中，尚需資源矩陣（Need）的計算公式為何？",
      "back": "Need[i][j] = Max[i][j] - Allocation[i][j]\n即行程 Pi 尚需資源 Rj 的數量 = 該行程宣告之最大需求量 (Max) 減去 目前已獲配資源量 (Allocation)。"
    },
    {
      "id": "fc20",
      "chapter": "ch5",
      "front": "在單一資源實例的資源配置圖演算法中，什麼是「宣告邊（Claim Edge）」？",
      "back": "宣告邊由行程指向資源（Pi → Rj），在圖中以「虛線（Dashed Line）」表示。\n代表行程 Pi 在未來執行過程中「可能會申請」資源 Rj。當行程真正發出請求時，宣告邊轉為實線的請求邊；僅在轉為分配邊不會導致圖中產生環路時，系統才會批准分配。"
    },
    {
      "id": "fc21",
      "chapter": "ch5",
      "front": "單一資源實例死結偵測中，「等待圖（Wait-for Graph）」的節點組成與環路偵測時間複雜度為何？",
      "back": "等待圖是將資源配置圖中的「資源節點」隱去，僅保留「行程節點（Processes）」所構成的有向圖。\n邊 Pi → Pj 代表行程 Pi 正在等待 Pj 所持有的資源。\n在 n 個行程的圖中，週期性尋找環路的演算法時間複雜度為 O(n²)。"
    },
    {
      "id": "fc22",
      "chapter": "ch5",
      "front": "採用「資源搶佔（Resource Preemption）」復原死結時，如何避免同一個行程陷入「飢餓（Starvation）」？",
      "back": "在挑選受害行程（Victim）的成本函數中，必須將「該行程過去被回滾的次數（Number of rollbacks）」納入考量加權。\n回滾次數越多的行程，其被搶佔的成本代價會被調高，從而降低其再次被選為受害者的機率，避免永遠無法執行完畢。"
    },
    {
      "id": "fc23",
      "chapter": "ch5",
      "front": "透過「逐一終止行程」打破死結時，挑選受害行程（Victim）的評估因素有哪些？（至少列出 4 項）",
      "back": "1. 行程的優先權（Priority）。\n2. 行程已計算的時間與距離完成尚需的時間。\n3. 行程目前已佔用的資源數量與類型。\n4. 行程順利完成還需要申請多少資源。\n5. 打破死結循環總共需要被終止的行程數量。\n6. 行程屬於互動式（Interactive）還是批次（Batch）處理。"
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
      "explanation": "多道程式設計（Multiprogramming）的核心目的是最大化 CPU 利用率（CPU Utilization）。當前作業等待 I/O 時，OS 切換執行另一作業。選項 A 是分時系統（Timesharing）的特徵；多道程式設計在單一 CPU 上即可實施。"
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
      "explanation": "標準階層順序由頂至底：Registers（暫存器）-> Cache（快取）-> Main memory（主記憶體）-> Solid-state disk（固態硬碟）-> Magnetic disk（傳統磁碟）-> Optical disk -> Magnetic tapes。"
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
      "explanation": "DMA 專為高速 I/O 設計，控制器直接於緩衝區與主記憶體間傳遞資料區塊，每傳輸完整個 Block 才引發一次中斷，大幅減少 CPU 中斷次數。"
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
      "explanation": "特權指令僅能在核心模式下執行。在使用者模式下嘗試執行特權指令會被硬體阻擋，並引發陷阱（Trap/Exception），OS 會接管並通常終止該違規程式。"
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
      "explanation": "當系統中部分處理器故障，剩餘處理器仍能支撐系統繼續運轉，此能力即為可靠性（Reliability）與優雅降級。"
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
      "explanation": "長期排程器（Job scheduler）執行頻率較低，負責從磁碟決定挑選多少作業載入主記憶體，因此直接控制多道程式設計的程度。"
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
      "explanation": "有界限緩衝區滿的條件為 ((in + 1) % BUFFER_SIZE) == out。此時保留一格空位以避免與 in == out（緩衝區為空）混淆。"
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
      "explanation": "fork() 建立的子行程擁有父行程位址空間的完整副本。fork() 在父行程中傳回子行程的 PID，在子行程中傳回 0。"
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
      "explanation": "選項 C 錯誤。具名管道（Named Pipes / FIFOs）在行程終止後仍會留存在檔案系統中，直到被顯式刪除。"
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
      "explanation": "Chrome 的多行程架構讓渲染引擎獨立於沙盒中運行，即使某分頁崩潰或含有惡意程式碼，也不會導致主瀏覽器崩潰或侵害主機系統。"
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
      "explanation": "當行程由 Running 轉為 Ready（如時間片到期或高優先權中斷）屬於搶占式（Preemptive）排程。非搶占式只在 Running -> Waiting 或 Terminate 時才進行排程。"
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
      "explanation": "各行程等待時間：P1 = 0 ms；P2 等待 P1 完成 = 24 ms；P3 等待 P1+P2 完成 = 24 + 3 = 27 ms。平均等待時間 = (0 + 24 + 27) / 3 = 51 / 3 = 17 ms（典型護衛效應）。"
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
      "explanation": "順序 P2 -> P3 -> P1。等待時間：P2 = 0 ms；P3 等待 P2 = 3 ms；P1 等待 P2+P3 = 3 + 3 = 6 ms。平均等待時間 = (0 + 3 + 6) / 3 = 9 / 3 = 3 ms。大幅優於 FCFS 的 17 ms！"
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
      "explanation": "在包含 n 個行程的環狀佇列中，每個行程最多執行 q 時間單位，因此任一行程至多等待其餘 (n - 1) 個行程各執行完一次，即等待上限為 (n - 1) * q。"
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
      "explanation": "多層回饋佇列透過老化技術（Aging / Promotion），讓低層佇列中長時間等待的行程逐步升級至高優先權佇列，徹底防止飢餓。"
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
      "explanation": "分派延遲（Dispatch Latency）是分派器停止當前行程、保存其上下文、載入新行程上下文並跳轉至該行程執行的時間開銷。"
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
      "explanation": "Bootstrap 程式必須在斷電後仍能保存，因此存放於非揮發性的 ROM 或 EPROM（韌體 Firmware / BIOS / UEFI）。"
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
      "explanation": "當 α = 1 時，τ[n+1] = 1 * t[n] + 0 = t[n]，代表完全採計最近一次的實際執行時間 t[n] 作為下一次預測。"
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
      "explanation": "電腦觀點下，OS 是資源分配者（在衝突請求中做出高效公平決定）以及控制程式（控制程式執行以防錯誤與不當使用）。"
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
      "explanation": "非對稱叢集中有一台機器處於熱備援（Hot-Standby）模式，僅監控主伺服器；對稱叢集則是多個節點同時執行任務。"
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
      "explanation": "一般二元樹在最糟情況搜尋為 O(n)，而平衡二元搜尋樹（Balanced BST，如 Linux rbtree）保證樹高平衡，搜尋效能提升為 O(log n)。"
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
      "explanation": "Heap（堆積）負責動態記憶體配置；Stack 負責區域變數與函式呼叫暫存；Data 存放全域變數；Text 存放程式碼。"
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
      "explanation": "當行程等待特定事件發生（如 I/O 操作完成或接收信號）時，會進入 Waiting 狀態；等到 I/O 完成後才轉入 Ready 狀態。"
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
      "explanation": "中期排程器的核心機制是 Swapping（調換），在記憶體吃緊時將行程移出至磁碟（Swap out），之後再載入（Swap in）。"
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
      "explanation": "fork() 用於複製建立子行程，而 exec() 則用新二進位程式碼覆蓋當前行程空間開始執行新任務。"
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
      "explanation": "零容量（Zero capacity）代表佇列長度為 0，傳送端與接收端必須同時就位完成交遞，此機制稱為會合（Rendezvous）。"
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
      "explanation": "Windows ALPC 小訊息直接在佇列中複製，大訊息則透過共享記憶體區段（Section Object）避免大規模複製的高昂負擔。"
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
      "explanation": "RPC 使用外部資料表示法（XDR）統一位元組編碼格式，確保不同架構機器相互通訊時資料能正確解譯。"
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
      "explanation": "最佳化目標：最大化 CPU 利用率與吞吐量；最小化轉向時間、等待時間與回應時間。"
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
      "explanation": "老化技術（Aging）是解決飢餓的標準做法，系統隨著行程在就緒佇列等待時間增加，動態逐步調高其優先權，保證最終一定會被執行。"
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
      "explanation": "當行程在某 CPU 上運作時快取會填入其資料。若遷移至其他 CPU，原快取失效且需重新暖機載入，帶來沉重負擔。親和性即儘量讓行程維持在同 CPU。"
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
      "explanation": "推式遷移（Push Migration）由系統定期排程任務檢查，發現不均衡時將任務從繁忙 CPU 推往閒置 CPU；拉式遷移（Pull Migration）則是閒置 CPU 主動去拉取。"
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
      "explanation": "當存取記憶體需耗費數百個 CPU 週期等待時稱為 Memory Stall。現代晶片利用硬體多執行緒（如超執行緒）切換執行緒來隱藏此延遲。"
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
      "explanation": "固定多層佇列（Multilevel Queue）中行程被永久指派於特定佇列；MFQ 則允許行程依執行時間長短動態在佇列間降級或透過老化升級。"
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
      "explanation": "當 α = 0 時，τ[n+1] = 0 + 1 * τ[n] = τ[n]，代表完全無視最近一次的實際時間 t[n]，預測值維持原狀。"
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
      "explanation": "教材經典準則：時間量子相較於 Context switch 必須足夠大，且約 80% 的 CPU burst 應該小於 q，如此能讓多數短行程一次完成，減少切換開銷。"
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
      "explanation": "依據銀行家演算法公式 Need = Max - Allocation：\nNeed1 = (3, 2, 2) - (2, 0, 0) = (1, 2, 2)\nNeed3 = (2, 2, 2) - (2, 1, 1) = (0, 1, 1)。"
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
      "explanation": "Work=(3,3,2)。\n1. Need1(1,2,2) ≤ (3,3,2) ⇒ P1 執行後釋放 Allocation1(2,0,0)，Work變為 (5,3,2)；\n2. Need3(0,1,1) ≤ (5,3,2) ⇒ P3 釋放 Allocation3(2,1,1)，Work變為 (7,4,3)；\n3. Need4(4,3,1) ≤ (7,4,3) ⇒ P4 釋放 Allocation4(0,0,2)，Work變為 (7,4,5)；\n4. Need2(6,0,0) ≤ (7,4,5) ⇒ P2 釋放 Allocation2(3,0,2)，Work變為 (10,4,7)；\n5. Need0(7,4,3) ≤ (10,4,7) ⇒ P0 執行完畢。\n合法安全序列為 <P1, P3, P4, P2, P0>。"
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
      "explanation": "依資源請求演算法：\n1. Request1(1,0,2) ≤ Need1(1,2,2)（符合）\n2. Request1(1,0,2) ≤ Available(3,3,2)（符合）\n3. 假裝分配後新 Available = (3,3,2) - (1,0,2) = (2,3,0)，Allocation1 變 (3,0,2)，Need1 變 (0,2,0)。\n執行安全演算法可推導出安全序列 <P1, P3, P4, P0, P2>，系統仍處於安全狀態，故可立即批准。"
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
      "explanation": "此時 Available = (2, 3, 0)，Request4 = (3, 3, 0)。檢查條件 Request4 ≤ Available 時，資源 A 需要 3 個但目前僅剩 2 個（3 > 2），不符合分配條件，故 P4 必須進入等待狀態。"
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
      "explanation": "依講義與經典考題解析：Request0(0,2,0) ≤ Need0(7,4,3) 且 Request0(0,2,0) ≤ Available(2,3,0)，經安全演算法測試判定可維持系統安全狀態，故可以批准分配。"
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
      "explanation": "Work 初始為 (0,0,0)：\n1. P0 之 Request0=(0,0,0) ≤ Work ⇒ P0 完成釋放 (0,1,0)，Work=(0,1,0)；\n2. P2 之 Request2=(0,0,0) ≤ Work ⇒ P2 完成釋放 (3,0,3)，Work=(3,1,3)；\n3. P3 之 Request3=(1,0,0) ≤ Work ⇒ P3 完成釋放 (2,1,1)，Work=(5,2,4)；\n4. P1 之 Request1=(2,0,2) ≤ Work ⇒ P1 完成釋放 (2,0,0)，Work=(7,2,4)；\n5. P4 之 Request4=(0,0,2) ≤ Work ⇒ P4 完成釋放 (0,0,2)，Work=(7,2,6)。\n所有行程 Finish[i]=true，系統未發生死結，序列為 <P0, P2, P3, P1, P4>。"
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
      "explanation": "當 P2 提出 (0,0,1) 後，P2 的請求不再為 (0,0,0)。此時系統中唯一 Request ≤ Work(0,0,0) 的行程僅剩 P0。\nP0 完成後釋放資源使 Work 變為 (0,1,0)。\n但 Work=(0,1,0) 無法滿足任何其餘行程之請求（P1需要A=2,C=2；P2需要C=1；P3需要A=1；P4需要C=2）。\n因此演算法終止，Finish 為 false 的行程為 P1, P2, P3, P4，系統陷入死結，陷入集合為 {P1, P2, P3, P4}。"
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
      "explanation": "無環路（No Cycle）是系統絕不死結的充分條件。若有環路，在單一實例下必然死結；在多實例下僅代表可能死結，需透過演算法進一步判定。"
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
      "explanation": "規定一次性獲配全部資源，或無資源時才能提出申請，是破壞「持有並等待」條件。其主要代價是資源被閒置佔用導致利用率極低，且需求多項資源的行程容易長時間等待而陷入飢餓。"
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
      "explanation": "破壞循環等待的標準方式是對所有資源進行全域總排序（Total Ordering），並要求行程嚴格按照遞增順序提出申請，數學上可證明此規則下無法形成環狀等待鏈。"
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
      "explanation": "死結避免（如銀行家演算法）的核心在於動態判斷分配後是否能維持在安全狀態，這必須以各行程事先宣告的最大需求量（Max Demand）作為先驗資訊。"
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
      "explanation": "評估終止行程的 6 大因素為：優先權、已計算與剩餘時間、已佔用資源量、剩餘所需資源量、需終止行程數、互動式或批次。行程名稱的字母排序與系統代價完全無關。"
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
      "explanation": "為避免飢餓，成本函數必須計入回滾次數（Number of rollbacks）。一個行程若已被回滾多次，其代價大幅提高，使系統轉而選擇其他行程作為受害者。"
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
      "explanation": "現代主流作業系統普遍採用「忽視死結（鴕鳥策略）」，因為死結機率較低，但預防與避免的開銷與對資源利用率的限制過於沉重，因此選擇交由人工排解。"
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
      "explanation": "在包含 n 個頂點的有向圖中，使用深度優先搜尋（DFS）等演算法尋找環路的時間複雜度為 O(n²)。"
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
      "explanation": "宣告邊（Claim Edge）以虛線箭頭 Pi → Rj 表示未來可能請求。當真正請求時轉為實線請求邊；只有將其轉為分配邊 Rj → Pi 且整個圖中不產生環路時，系統才可批准分配。"
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
  ]
};
