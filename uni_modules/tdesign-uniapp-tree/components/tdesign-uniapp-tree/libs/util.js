/**
 * 节流函数
 */
export function throttle(fn, delay) {
  var lastTime = 0;

  return function () {
    var args = arguments;
    var now = Date.now();

    if (now - lastTime >= delay) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
}

/**
 * 比较两个 JSON 数组是否相等
 */
export function compareJsonArrays(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return {
      areEqual: false,
      diff: { arr1Only: arr1, arr2Only: arr2 },
    };
  }

  var diff1 = [];
  var diff2 = [];

  arr1.forEach(function (item1) {
    var found = arr2.some(function (item2) {
      return JSON.stringify(item1) === JSON.stringify(item2);
    });
    if (!found) {
      diff1.push(item1);
    }
  });

  arr2.forEach(function (item2) {
    var found = arr1.some(function (item1) {
      return JSON.stringify(item2) === JSON.stringify(item1);
    });
    if (!found) {
      diff2.push(item2);
    }
  });

  if (diff1.length === 0 && diff2.length === 0) {
    return { areEqual: true };
  } else {
    return {
      areEqual: false,
      diff: { arr1Only: diff1, arr2Only: diff2 },
    };
  }
}
