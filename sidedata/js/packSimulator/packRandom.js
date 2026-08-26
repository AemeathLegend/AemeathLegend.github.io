let chancelist = [];


export function setchancelist(
  rewardchancearray,
  idofreward,
) {
  const result = [];

  if (
    !Array.isArray(
      rewardchancearray,
    ) ||
    !Array.isArray(
      idofreward,
    )
  ) {
    return result;
  }

  const amount =
    Math.min(
      rewardchancearray.length,
      idofreward.length,
    );

  for (
    let i = 0;
    i < amount;
    i++
  ) {
    result.push({
      rewardchance:
        rewardchancearray[i],

      rewardid:
        idofreward[i],
    });
  }

  return result;
}


export function calculateChance(
  count,
  chances,
  scalein10,
) {
  const results = [];

  if (
    !Array.isArray(chances) ||
    chances.length === 0
  ) {
    return results;
  }

  const max =
    10 ** scalein10;

  /*
   * Make a copy so we don't unexpectedly modify the
   * caller's array.
   */
  const sortedChances =
    [...chances].sort(
      (a, b) =>
        a.rewardchance -
        b.rewardchance,
    );

  for (
    let i = 0;
    i < count;
    i++
  ) {
    const roll =
      Math.floor(
        Math.random() *
          max,
      );

    for (
      const chanceitem
      of sortedChances
    ) {
      if (
        roll <=
        chanceitem.rewardchance
      ) {
        results.push(
          chanceitem.rewardid,
        );

        break;
      }
    }
  }

  return results;
}