/**
 * OS Scheduler Simulator Engine (CPU 排程與甘特圖計算引擎)
 * 支援演算法：FCFS、SJF (非搶占)、SRTF (搶占式 SJF)、Priority (非搶占/搶占)、Round Robin
 */

class OSScheduler {
  /**
   * 執行模擬
   * @param {Array} processes [{ id: 'P1', arrival: 0, burst: 10, priority: 1 }]
   * @param {string} algorithm 'FCFS' | 'SJF' | 'SRTF' | 'RR' | 'Priority' | 'Priority_Preempt'
   * @param {number} quantum Round Robin 時間量子
   * @returns {Object} 包含甘特圖區間、各行程明細與平均指標
   */
  static simulate(processes, algorithm, quantum = 2) {
    if (!processes || processes.length === 0) {
      return { timeline: [], processStats: [], avgWaiting: 0, avgTurnaround: 0, avgResponse: 0, cpuUtilization: 0 };
    }

    // 複製資料防止副作用，並依到達時間排序
    const procs = processes.map(p => ({
      id: String(p.id),
      arrival: Number(p.arrival),
      burst: Number(p.burst),
      priority: Number(p.priority || 1),
      remaining: Number(p.burst),
      firstStart: -1,
      completion: 0,
      turnaround: 0,
      waiting: 0,
      response: 0
    }));

    switch (algorithm) {
      case 'FCFS':
        return this._simulateFCFS(procs);
      case 'SJF':
        return this._simulateSJF(procs);
      case 'SRTF':
        return this._simulateSRTF(procs);
      case 'Priority':
        return this._simulatePriority(procs, false);
      case 'Priority_Preempt':
        return this._simulatePriority(procs, true);
      case 'RR':
      default:
        return this._simulateRR(procs, Number(quantum) || 2);
    }
  }

  // 1. FCFS 先來先服務
  static _simulateFCFS(procs) {
    procs.sort((a, b) => a.arrival - b.arrival);
    const timeline = [];
    let currentTime = 0;

    for (const p of procs) {
      if (currentTime < p.arrival) {
        timeline.push({ id: 'IDLE', start: currentTime, end: p.arrival });
        currentTime = p.arrival;
      }
      p.firstStart = currentTime;
      const start = currentTime;
      currentTime += p.burst;
      p.completion = currentTime;
      p.turnaround = p.completion - p.arrival;
      p.waiting = p.turnaround - p.burst;
      p.response = p.firstStart - p.arrival;
      timeline.push({ id: p.id, start, end: currentTime });
    }

    return this._calculateSummary(procs, timeline);
  }

  // 2. SJF (非搶占式)
  static _simulateSJF(procs) {
    const timeline = [];
    let currentTime = 0;
    let completed = 0;
    const n = procs.length;
    const isCompleted = new Array(n).fill(false);

    while (completed < n) {
      // 找出所有已到達且未完成的行程中，burst 最小者
      let minIdx = -1;
      let minBurst = Infinity;

      for (let i = 0; i < n; i++) {
        if (!isCompleted[i] && procs[i].arrival <= currentTime) {
          if (procs[i].burst < minBurst) {
            minBurst = procs[i].burst;
            minIdx = i;
          } else if (procs[i].burst === minBurst && procs[i].arrival < procs[minIdx].arrival) {
            minIdx = i;
          }
        }
      }

      if (minIdx === -1) {
        // CPU 閒置，跳到下一個行程到達時間
        let nextArrival = Infinity;
        for (let i = 0; i < n; i++) {
          if (!isCompleted[i] && procs[i].arrival > currentTime) {
            nextArrival = Math.min(nextArrival, procs[i].arrival);
          }
        }
        timeline.push({ id: 'IDLE', start: currentTime, end: nextArrival });
        currentTime = nextArrival;
        continue;
      }

      const p = procs[minIdx];
      p.firstStart = currentTime;
      const start = currentTime;
      currentTime += p.burst;
      p.completion = currentTime;
      p.turnaround = p.completion - p.arrival;
      p.waiting = p.turnaround - p.burst;
      p.response = p.firstStart - p.arrival;
      isCompleted[minIdx] = true;
      completed++;
      timeline.push({ id: p.id, start, end: currentTime });
    }

    return this._calculateSummary(procs, timeline);
  }

  // 3. SRTF (搶占式 SJF)
  static _simulateSRTF(procs) {
    const timeline = [];
    let currentTime = 0;
    let completed = 0;
    const n = procs.length;
    let lastRunningId = null;
    let segmentStart = 0;

    // 總 burst 或防無窮迴圈上限
    const totalBurst = procs.reduce((acc, p) => acc + p.burst, 0);
    const maxTime = Math.max(...procs.map(p => p.arrival)) + totalBurst + 100;

    while (completed < n && currentTime <= maxTime) {
      // 找出當前已到達且 remaining > 0 中 remaining 最小者
      let minIdx = -1;
      let minRemaining = Infinity;

      for (let i = 0; i < n; i++) {
        if (procs[i].arrival <= currentTime && procs[i].remaining > 0) {
          if (procs[i].remaining < minRemaining) {
            minRemaining = procs[i].remaining;
            minIdx = i;
          } else if (procs[i].remaining === minRemaining && procs[i].arrival < procs[minIdx].arrival) {
            minIdx = i;
          }
        }
      }

      if (minIdx === -1) {
        if (lastRunningId !== 'IDLE') {
          if (lastRunningId !== null) {
            timeline.push({ id: lastRunningId, start: segmentStart, end: currentTime });
          }
          lastRunningId = 'IDLE';
          segmentStart = currentTime;
        }
        currentTime++;
        continue;
      }

      const p = procs[minIdx];
      if (p.firstStart === -1) {
        p.firstStart = currentTime;
        p.response = p.firstStart - p.arrival;
      }

      const currentId = p.id;
      if (currentId !== lastRunningId) {
        if (lastRunningId !== null) {
          timeline.push({ id: lastRunningId, start: segmentStart, end: currentTime });
        }
        lastRunningId = currentId;
        segmentStart = currentTime;
      }

      p.remaining--;
      currentTime++;

      if (p.remaining === 0) {
        p.completion = currentTime;
        p.turnaround = p.completion - p.arrival;
        p.waiting = p.turnaround - p.burst;
        completed++;
      }
    }

    if (lastRunningId !== null && segmentStart < currentTime) {
      timeline.push({ id: lastRunningId, start: segmentStart, end: currentTime });
    }

    return this._calculateSummary(procs, timeline);
  }

  // 4. Priority 排程 (支援非搶占與搶占)
  static _simulatePriority(procs, isPreemptive = false) {
    if (!isPreemptive) {
      const timeline = [];
      let currentTime = 0;
      let completed = 0;
      const n = procs.length;
      const isCompleted = new Array(n).fill(false);

      while (completed < n) {
        let bestIdx = -1;
        let minPriority = Infinity; // 數字越小優先權越高

        for (let i = 0; i < n; i++) {
          if (!isCompleted[i] && procs[i].arrival <= currentTime) {
            if (procs[i].priority < minPriority) {
              minPriority = procs[i].priority;
              bestIdx = i;
            } else if (procs[i].priority === minPriority && procs[i].arrival < procs[bestIdx].arrival) {
              bestIdx = i;
            }
          }
        }

        if (bestIdx === -1) {
          let nextArrival = Infinity;
          for (let i = 0; i < n; i++) {
            if (!isCompleted[i] && procs[i].arrival > currentTime) {
              nextArrival = Math.min(nextArrival, procs[i].arrival);
            }
          }
          timeline.push({ id: 'IDLE', start: currentTime, end: nextArrival });
          currentTime = nextArrival;
          continue;
        }

        const p = procs[bestIdx];
        p.firstStart = currentTime;
        const start = currentTime;
        currentTime += p.burst;
        p.completion = currentTime;
        p.turnaround = p.completion - p.arrival;
        p.waiting = p.turnaround - p.burst;
        p.response = p.firstStart - p.arrival;
        isCompleted[bestIdx] = true;
        completed++;
        timeline.push({ id: p.id, start, end: currentTime });
      }

      return this._calculateSummary(procs, timeline);
    } else {
      // 搶占式 Priority
      const timeline = [];
      let currentTime = 0;
      let completed = 0;
      const n = procs.length;
      let lastRunningId = null;
      let segmentStart = 0;

      const totalBurst = procs.reduce((acc, p) => acc + p.burst, 0);
      const maxTime = Math.max(...procs.map(p => p.arrival)) + totalBurst + 100;

      while (completed < n && currentTime <= maxTime) {
        let bestIdx = -1;
        let minPriority = Infinity;

        for (let i = 0; i < n; i++) {
          if (procs[i].arrival <= currentTime && procs[i].remaining > 0) {
            if (procs[i].priority < minPriority) {
              minPriority = procs[i].priority;
              bestIdx = i;
            } else if (procs[i].priority === minPriority && procs[i].arrival < procs[bestIdx].arrival) {
              bestIdx = i;
            }
          }
        }

        if (bestIdx === -1) {
          if (lastRunningId !== 'IDLE') {
            if (lastRunningId !== null) {
              timeline.push({ id: lastRunningId, start: segmentStart, end: currentTime });
            }
            lastRunningId = 'IDLE';
            segmentStart = currentTime;
          }
          currentTime++;
          continue;
        }

        const p = procs[bestIdx];
        if (p.firstStart === -1) {
          p.firstStart = currentTime;
          p.response = p.firstStart - p.arrival;
        }

        const currentId = p.id;
        if (currentId !== lastRunningId) {
          if (lastRunningId !== null) {
            timeline.push({ id: lastRunningId, start: segmentStart, end: currentTime });
          }
          lastRunningId = currentId;
          segmentStart = currentTime;
        }

        p.remaining--;
        currentTime++;

        if (p.remaining === 0) {
          p.completion = currentTime;
          p.turnaround = p.completion - p.arrival;
          p.waiting = p.turnaround - p.burst;
          completed++;
        }
      }

      if (lastRunningId !== null && segmentStart < currentTime) {
        timeline.push({ id: lastRunningId, start: segmentStart, end: currentTime });
      }

      return this._calculateSummary(procs, timeline);
    }
  }

  // 5. Round Robin (輪轉排程)
  static _simulateRR(procs, quantum) {
    const timeline = [];
    let currentTime = 0;
    const readyQueue = [];
    const n = procs.length;
    const arrived = new Array(n).fill(false);
    let completed = 0;

    // 依到達時間排序以利檢查加入
    const checkArrivals = (time) => {
      for (let i = 0; i < n; i++) {
        if (!arrived[i] && procs[i].arrival <= time) {
          readyQueue.push(procs[i]);
          arrived[i] = true;
        }
      }
    };

    checkArrivals(currentTime);

    while (completed < n) {
      if (readyQueue.length === 0) {
        // 若就緒佇列為空，推進至下一個未到達行程
        let nextArrival = Infinity;
        for (let i = 0; i < n; i++) {
          if (!arrived[i] && procs[i].arrival > currentTime) {
            nextArrival = Math.min(nextArrival, procs[i].arrival);
          }
        }
        if (nextArrival !== Infinity) {
          timeline.push({ id: 'IDLE', start: currentTime, end: nextArrival });
          currentTime = nextArrival;
          checkArrivals(currentTime);
        } else {
          break;
        }
        continue;
      }

      const p = readyQueue.shift();
      if (p.firstStart === -1) {
        p.firstStart = currentTime;
        p.response = p.firstStart - p.arrival;
      }

      const start = currentTime;
      const runTime = Math.min(p.remaining, quantum);
      currentTime += runTime;
      p.remaining -= runTime;

      timeline.push({ id: p.id, start, end: currentTime });

      // 在執行這段時間中，新到達的行程必須先加入 Ready Queue
      checkArrivals(currentTime);

      if (p.remaining > 0) {
        readyQueue.push(p);
      } else {
        p.completion = currentTime;
        p.turnaround = p.completion - p.arrival;
        p.waiting = p.turnaround - p.burst;
        completed++;
      }
    }

    return this._calculateSummary(procs, timeline);
  }

  // 計算匯總數據
  static _calculateSummary(procs, timeline) {
    // 合併連續相同 ID 的 timeline 片段
    const mergedTimeline = [];
    for (const segment of timeline) {
      if (segment.start === segment.end) continue;
      if (mergedTimeline.length > 0 && mergedTimeline[mergedTimeline.length - 1].id === segment.id) {
        mergedTimeline[mergedTimeline.length - 1].end = segment.end;
      } else {
        mergedTimeline.push({ ...segment });
      }
    }

    const n = procs.length;
    const totalWaiting = procs.reduce((acc, p) => acc + p.waiting, 0);
    const totalTurnaround = procs.reduce((acc, p) => acc + p.turnaround, 0);
    const totalResponse = procs.reduce((acc, p) => acc + p.response, 0);

    const totalTime = mergedTimeline.length > 0 ? mergedTimeline[mergedTimeline.length - 1].end : 0;
    const idleTime = mergedTimeline
      .filter(s => s.id === 'IDLE')
      .reduce((acc, s) => acc + (s.end - s.start), 0);
    const busyTime = totalTime - idleTime;
    const cpuUtilization = totalTime > 0 ? ((busyTime / totalTime) * 100).toFixed(1) : 0;

    return {
      timeline: mergedTimeline,
      processStats: procs.map(p => ({
        id: p.id,
        arrival: p.arrival,
        burst: p.burst,
        priority: p.priority,
        firstStart: p.firstStart,
        completion: p.completion,
        turnaround: p.turnaround,
        waiting: p.waiting,
        response: p.response
      })),
      avgWaiting: (totalWaiting / n).toFixed(2),
      avgTurnaround: (totalTurnaround / n).toFixed(2),
      avgResponse: (totalResponse / n).toFixed(2),
      totalTime,
      cpuUtilization
    };
  }
}

// 支援瀏覽器與 Node 測試環境
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OSScheduler;
}
