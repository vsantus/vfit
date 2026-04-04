function toDayKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getCompletedDayKey(date: Date | null) {
  if (!date) {
    return null;
  }

  return toDayKey(date);
}

export function calculateCurrentStreak(dayKeys: string[]) {
  if (dayKeys.length === 0) {
    return 0;
  }

  const uniqueDayKeys = [...new Set(dayKeys)].sort((left, right) =>
    left > right ? -1 : left < right ? 1 : 0,
  );

  const today = new Date();
  let expectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let streak = 0;

  const todayKey = toDayKey(expectedDate);
  const yesterdayDate = new Date(expectedDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayKey = toDayKey(yesterdayDate);

  if (uniqueDayKeys[0] !== todayKey && uniqueDayKeys[0] !== yesterdayKey) {
    return 0;
  }

  if (uniqueDayKeys[0] === yesterdayKey) {
    expectedDate = yesterdayDate;
  }

  for (const dayKey of uniqueDayKeys) {
    if (dayKey !== toDayKey(expectedDate)) {
      break;
    }

    streak += 1;
    expectedDate.setDate(expectedDate.getDate() - 1);
  }

  return streak;
}
