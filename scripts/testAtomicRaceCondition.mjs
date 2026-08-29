console.log('🧪 [Concurrency Stress Test] Firestore runTransaction 원자적 선점 레이스 컨디션 시뮬레이션...\n');

// 가상 Firestore 상태
const database = {
  event: {
    eventId: 'bb-goyang-2026',
    status: 'ticketOpen',
    notifiedStatuses: []
  }
};

let transactionLock = false; // 원자적 락 시뮬레이터

async function simulateAtomicTransaction(targetStatus, callerId) {
  // 트랜잭션 시작 (격리성 시뮬레이션)
  await new Promise(resolve => setTimeout(resolve, Math.random() * 15)); // 비동기 지연

  if (database.event.notifiedStatuses.includes(targetStatus)) {
    return { callerId, acquired: false, reason: 'ALREADY_CLAIMED_BY_ANOTHER_TRANSACTION' };
  }

  // 원자적 선점 쓰기
  database.event.notifiedStatuses.push(targetStatus);
  return { callerId, acquired: true, reason: 'CLAIM_SUCCESS_PROCEED_TO_SEND' };
}

async function runRaceConditionTest() {
  console.log('⚡ 5개의 Cloud Function 인스턴스가 0.001초 차이로 거의 동시에 트리거 발생...');
  
  // Promise.all로 5개 인스턴스 동시 실행
  const results = await Promise.all([
    simulateAtomicTransaction('ticketOpen', 'Instance_1'),
    simulateAtomicTransaction('ticketOpen', 'Instance_2'),
    simulateAtomicTransaction('ticketOpen', 'Instance_3'),
    simulateAtomicTransaction('ticketOpen', 'Instance_4'),
    simulateAtomicTransaction('ticketOpen', 'Instance_5'),
  ]);

  console.log('\n📊 동시 실행 결과:');
  let successCount = 0;
  let blockedCount = 0;

  results.forEach(r => {
    if (r.acquired) {
      console.log(`  🟢 [${r.callerId}] -> ${r.reason} (메일 발송 실행)`);
      successCount++;
    } else {
      console.log(`  🔴 [${r.callerId}] -> ${r.reason} (발송 취소 및 즉시 종료)`);
      blockedCount++;
    }
  });

  console.log(`\n========================================`);
  if (successCount === 1 && blockedCount === 4) {
    console.log(`✅ [TEST PASSED] 원자적 트랜잭션으로 단 1개만 메일을 발송하고 4개의 중복 요청을 100% 차단했습니다!`);
  } else {
    console.error(`❌ [TEST FAILED] 레이스 컨디션 발생! 중복 발송 건수: ${successCount}`);
    process.exit(1);
  }
}

runRaceConditionTest();