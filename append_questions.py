# -*- coding: utf-8 -*-
"""
擴充題庫至 36 題全方位考點
"""

extra_questions = [
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
    }
]

import json

with open("js/data.js", "r", encoding="utf-8") as f:
    text = f.read()

prefix = "const OS_DEFAULT_DATA = "
if text.startswith(prefix):
    raw_json = text[len(prefix):].rstrip().rstrip(";")
    data = json.loads(raw_json)
    
    # 檢查是否已加入
    existing_ids = set(q["id"] for q in data["quizQuestions"])
    for q in extra_questions:
        if q["id"] not in existing_ids:
            data["quizQuestions"].append(q)
            
    updated_js = prefix + json.dumps(data, ensure_ascii=False, indent=2) + ";\n"
    with open("js/data.js", "w", encoding="utf-8") as f:
        f.write(updated_js)
    print("js/data.js updated with 36 questions! Total questions:", len(data["quizQuestions"]))
