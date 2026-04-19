import {
  CommonModule,
  isPlatformServer
} from "./chunk-ZCFLHKHG.js";
import "./chunk-6K3G6HT2.js";
import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  Inject,
  Input,
  NgModule,
  Optional,
  Output,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵclassProp,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵloadQuery,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵqueryRefresh,
  ɵɵviewQuery
} from "./chunk-4WJBNJBW.js";
import {
  EventEmitter,
  NgZone,
  ɵɵdefineInjector
} from "./chunk-EKIGH2ML.js";
import "./chunk-JRFR6BLO.js";
import "./chunk-HWYXSU2G.js";
import "./chunk-MARUHEWW.js";
import "./chunk-TXDUYLVM.js";

// node_modules/@tweenjs/tween.js/dist/tween.esm.js
var Easing = Object.freeze({
  Linear: Object.freeze({
    None: function(amount) {
      return amount;
    },
    In: function(amount) {
      return amount;
    },
    Out: function(amount) {
      return amount;
    },
    InOut: function(amount) {
      return amount;
    }
  }),
  Quadratic: Object.freeze({
    In: function(amount) {
      return amount * amount;
    },
    Out: function(amount) {
      return amount * (2 - amount);
    },
    InOut: function(amount) {
      if ((amount *= 2) < 1) {
        return 0.5 * amount * amount;
      }
      return -0.5 * (--amount * (amount - 2) - 1);
    }
  }),
  Cubic: Object.freeze({
    In: function(amount) {
      return amount * amount * amount;
    },
    Out: function(amount) {
      return --amount * amount * amount + 1;
    },
    InOut: function(amount) {
      if ((amount *= 2) < 1) {
        return 0.5 * amount * amount * amount;
      }
      return 0.5 * ((amount -= 2) * amount * amount + 2);
    }
  }),
  Quartic: Object.freeze({
    In: function(amount) {
      return amount * amount * amount * amount;
    },
    Out: function(amount) {
      return 1 - --amount * amount * amount * amount;
    },
    InOut: function(amount) {
      if ((amount *= 2) < 1) {
        return 0.5 * amount * amount * amount * amount;
      }
      return -0.5 * ((amount -= 2) * amount * amount * amount - 2);
    }
  }),
  Quintic: Object.freeze({
    In: function(amount) {
      return amount * amount * amount * amount * amount;
    },
    Out: function(amount) {
      return --amount * amount * amount * amount * amount + 1;
    },
    InOut: function(amount) {
      if ((amount *= 2) < 1) {
        return 0.5 * amount * amount * amount * amount * amount;
      }
      return 0.5 * ((amount -= 2) * amount * amount * amount * amount + 2);
    }
  }),
  Sinusoidal: Object.freeze({
    In: function(amount) {
      return 1 - Math.sin((1 - amount) * Math.PI / 2);
    },
    Out: function(amount) {
      return Math.sin(amount * Math.PI / 2);
    },
    InOut: function(amount) {
      return 0.5 * (1 - Math.sin(Math.PI * (0.5 - amount)));
    }
  }),
  Exponential: Object.freeze({
    In: function(amount) {
      return amount === 0 ? 0 : Math.pow(1024, amount - 1);
    },
    Out: function(amount) {
      return amount === 1 ? 1 : 1 - Math.pow(2, -10 * amount);
    },
    InOut: function(amount) {
      if (amount === 0) {
        return 0;
      }
      if (amount === 1) {
        return 1;
      }
      if ((amount *= 2) < 1) {
        return 0.5 * Math.pow(1024, amount - 1);
      }
      return 0.5 * (-Math.pow(2, -10 * (amount - 1)) + 2);
    }
  }),
  Circular: Object.freeze({
    In: function(amount) {
      return 1 - Math.sqrt(1 - amount * amount);
    },
    Out: function(amount) {
      return Math.sqrt(1 - --amount * amount);
    },
    InOut: function(amount) {
      if ((amount *= 2) < 1) {
        return -0.5 * (Math.sqrt(1 - amount * amount) - 1);
      }
      return 0.5 * (Math.sqrt(1 - (amount -= 2) * amount) + 1);
    }
  }),
  Elastic: Object.freeze({
    In: function(amount) {
      if (amount === 0) {
        return 0;
      }
      if (amount === 1) {
        return 1;
      }
      return -Math.pow(2, 10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI);
    },
    Out: function(amount) {
      if (amount === 0) {
        return 0;
      }
      if (amount === 1) {
        return 1;
      }
      return Math.pow(2, -10 * amount) * Math.sin((amount - 0.1) * 5 * Math.PI) + 1;
    },
    InOut: function(amount) {
      if (amount === 0) {
        return 0;
      }
      if (amount === 1) {
        return 1;
      }
      amount *= 2;
      if (amount < 1) {
        return -0.5 * Math.pow(2, 10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI);
      }
      return 0.5 * Math.pow(2, -10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI) + 1;
    }
  }),
  Back: Object.freeze({
    In: function(amount) {
      var s = 1.70158;
      return amount === 1 ? 1 : amount * amount * ((s + 1) * amount - s);
    },
    Out: function(amount) {
      var s = 1.70158;
      return amount === 0 ? 0 : --amount * amount * ((s + 1) * amount + s) + 1;
    },
    InOut: function(amount) {
      var s = 1.70158 * 1.525;
      if ((amount *= 2) < 1) {
        return 0.5 * (amount * amount * ((s + 1) * amount - s));
      }
      return 0.5 * ((amount -= 2) * amount * ((s + 1) * amount + s) + 2);
    }
  }),
  Bounce: Object.freeze({
    In: function(amount) {
      return 1 - Easing.Bounce.Out(1 - amount);
    },
    Out: function(amount) {
      if (amount < 1 / 2.75) {
        return 7.5625 * amount * amount;
      } else if (amount < 2 / 2.75) {
        return 7.5625 * (amount -= 1.5 / 2.75) * amount + 0.75;
      } else if (amount < 2.5 / 2.75) {
        return 7.5625 * (amount -= 2.25 / 2.75) * amount + 0.9375;
      } else {
        return 7.5625 * (amount -= 2.625 / 2.75) * amount + 0.984375;
      }
    },
    InOut: function(amount) {
      if (amount < 0.5) {
        return Easing.Bounce.In(amount * 2) * 0.5;
      }
      return Easing.Bounce.Out(amount * 2 - 1) * 0.5 + 0.5;
    }
  }),
  generatePow: function(power) {
    if (power === void 0) {
      power = 4;
    }
    power = power < Number.EPSILON ? Number.EPSILON : power;
    power = power > 1e4 ? 1e4 : power;
    return {
      In: function(amount) {
        return Math.pow(amount, power);
      },
      Out: function(amount) {
        return 1 - Math.pow(1 - amount, power);
      },
      InOut: function(amount) {
        if (amount < 0.5) {
          return Math.pow(amount * 2, power) / 2;
        }
        return (1 - Math.pow(2 - amount * 2, power)) / 2 + 0.5;
      }
    };
  }
});
var now = function() {
  return performance.now();
};
var Group = (
  /** @class */
  (function() {
    function Group2() {
      var tweens = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        tweens[_i] = arguments[_i];
      }
      this._tweens = {};
      this._tweensAddedDuringUpdate = {};
      this.add.apply(this, tweens);
    }
    Group2.prototype.getAll = function() {
      var _this = this;
      return Object.keys(this._tweens).map(function(tweenId) {
        return _this._tweens[tweenId];
      });
    };
    Group2.prototype.removeAll = function() {
      this._tweens = {};
    };
    Group2.prototype.add = function() {
      var _a;
      var tweens = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        tweens[_i] = arguments[_i];
      }
      for (var _b = 0, tweens_1 = tweens; _b < tweens_1.length; _b++) {
        var tween = tweens_1[_b];
        (_a = tween._group) === null || _a === void 0 ? void 0 : _a.remove(tween);
        tween._group = this;
        this._tweens[tween.getId()] = tween;
        this._tweensAddedDuringUpdate[tween.getId()] = tween;
      }
    };
    Group2.prototype.remove = function() {
      var tweens = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        tweens[_i] = arguments[_i];
      }
      for (var _a = 0, tweens_2 = tweens; _a < tweens_2.length; _a++) {
        var tween = tweens_2[_a];
        tween._group = void 0;
        delete this._tweens[tween.getId()];
        delete this._tweensAddedDuringUpdate[tween.getId()];
      }
    };
    Group2.prototype.allStopped = function() {
      return this.getAll().every(function(tween) {
        return !tween.isPlaying();
      });
    };
    Group2.prototype.update = function(time, preserve) {
      if (time === void 0) {
        time = now();
      }
      if (preserve === void 0) {
        preserve = true;
      }
      var tweenIds = Object.keys(this._tweens);
      if (tweenIds.length === 0)
        return;
      while (tweenIds.length > 0) {
        this._tweensAddedDuringUpdate = {};
        for (var i = 0; i < tweenIds.length; i++) {
          var tween = this._tweens[tweenIds[i]];
          var autoStart = !preserve;
          if (tween && tween.update(time, autoStart) === false && !preserve)
            this.remove(tween);
        }
        tweenIds = Object.keys(this._tweensAddedDuringUpdate);
      }
    };
    return Group2;
  })()
);
var Interpolation = {
  Linear: function(v, k) {
    var m = v.length - 1;
    var f = m * k;
    var i = Math.floor(f);
    var fn = Interpolation.Utils.Linear;
    if (k < 0) {
      return fn(v[0], v[1], f);
    }
    if (k > 1) {
      return fn(v[m], v[m - 1], m - f);
    }
    return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
  },
  Bezier: function(v, k) {
    var b = 0;
    var n = v.length - 1;
    var pw = Math.pow;
    var bn = Interpolation.Utils.Bernstein;
    for (var i = 0; i <= n; i++) {
      b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
    }
    return b;
  },
  CatmullRom: function(v, k) {
    var m = v.length - 1;
    var f = m * k;
    var i = Math.floor(f);
    var fn = Interpolation.Utils.CatmullRom;
    if (v[0] === v[m]) {
      if (k < 0) {
        i = Math.floor(f = m * (1 + k));
      }
      return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
    } else {
      if (k < 0) {
        return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
      }
      if (k > 1) {
        return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
      }
      return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
    }
  },
  Utils: {
    Linear: function(p0, p1, t) {
      return (p1 - p0) * t + p0;
    },
    Bernstein: function(n, i) {
      var fc = Interpolation.Utils.Factorial;
      return fc(n) / fc(i) / fc(n - i);
    },
    Factorial: /* @__PURE__ */ (function() {
      var a = [1];
      return function(n) {
        var s = 1;
        if (a[n]) {
          return a[n];
        }
        for (var i = n; i > 1; i--) {
          s *= i;
        }
        a[n] = s;
        return s;
      };
    })(),
    CatmullRom: function(p0, p1, p2, p3, t) {
      var v0 = (p2 - p0) * 0.5;
      var v1 = (p3 - p1) * 0.5;
      var t2 = t * t;
      var t3 = t * t2;
      return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
    }
  }
};
var Sequence = (
  /** @class */
  (function() {
    function Sequence2() {
    }
    Sequence2.nextId = function() {
      return Sequence2._nextId++;
    };
    Sequence2._nextId = 0;
    return Sequence2;
  })()
);
var mainGroup = new Group();
var Tween = (
  /** @class */
  (function() {
    function Tween2(object, group) {
      this._isPaused = false;
      this._pauseStart = 0;
      this._valuesStart = {};
      this._valuesEnd = {};
      this._valuesStartRepeat = {};
      this._duration = 1e3;
      this._isDynamic = false;
      this._initialRepeat = 0;
      this._repeat = 0;
      this._yoyo = false;
      this._isPlaying = false;
      this._reversed = false;
      this._delayTime = 0;
      this._startTime = 0;
      this._easingFunction = Easing.Linear.None;
      this._interpolationFunction = Interpolation.Linear;
      this._chainedTweens = [];
      this._onStartCallbackFired = false;
      this._onEveryStartCallbackFired = false;
      this._id = Sequence.nextId();
      this._isChainStopped = false;
      this._propertiesAreSetUp = false;
      this._goToEnd = false;
      this._object = object;
      if (typeof group === "object") {
        this._group = group;
        group.add(this);
      } else if (group === true) {
        this._group = mainGroup;
        mainGroup.add(this);
      }
    }
    Tween2.prototype.getId = function() {
      return this._id;
    };
    Tween2.prototype.isPlaying = function() {
      return this._isPlaying;
    };
    Tween2.prototype.isPaused = function() {
      return this._isPaused;
    };
    Tween2.prototype.getDuration = function() {
      return this._duration;
    };
    Tween2.prototype.to = function(target, duration) {
      if (duration === void 0) {
        duration = 1e3;
      }
      if (this._isPlaying)
        throw new Error("Can not call Tween.to() while Tween is already started or paused. Stop the Tween first.");
      this._valuesEnd = target;
      this._propertiesAreSetUp = false;
      this._duration = duration < 0 ? 0 : duration;
      return this;
    };
    Tween2.prototype.duration = function(duration) {
      if (duration === void 0) {
        duration = 1e3;
      }
      this._duration = duration < 0 ? 0 : duration;
      return this;
    };
    Tween2.prototype.dynamic = function(dynamic) {
      if (dynamic === void 0) {
        dynamic = false;
      }
      this._isDynamic = dynamic;
      return this;
    };
    Tween2.prototype.start = function(time, overrideStartingValues) {
      if (time === void 0) {
        time = now();
      }
      if (overrideStartingValues === void 0) {
        overrideStartingValues = false;
      }
      if (this._isPlaying) {
        return this;
      }
      this._repeat = this._initialRepeat;
      if (this._reversed) {
        this._reversed = false;
        for (var property in this._valuesStartRepeat) {
          this._swapEndStartRepeatValues(property);
          this._valuesStart[property] = this._valuesStartRepeat[property];
        }
      }
      this._isPlaying = true;
      this._isPaused = false;
      this._onStartCallbackFired = false;
      this._onEveryStartCallbackFired = false;
      this._isChainStopped = false;
      this._startTime = time;
      this._startTime += this._delayTime;
      if (!this._propertiesAreSetUp || overrideStartingValues) {
        this._propertiesAreSetUp = true;
        if (!this._isDynamic) {
          var tmp = {};
          for (var prop in this._valuesEnd)
            tmp[prop] = this._valuesEnd[prop];
          this._valuesEnd = tmp;
        }
        this._setupProperties(this._object, this._valuesStart, this._valuesEnd, this._valuesStartRepeat, overrideStartingValues);
      }
      return this;
    };
    Tween2.prototype.startFromCurrentValues = function(time) {
      return this.start(time, true);
    };
    Tween2.prototype._setupProperties = function(_object, _valuesStart, _valuesEnd, _valuesStartRepeat, overrideStartingValues) {
      for (var property in _valuesEnd) {
        var startValue = _object[property];
        var startValueIsArray = Array.isArray(startValue);
        var propType = startValueIsArray ? "array" : typeof startValue;
        var isInterpolationList = !startValueIsArray && Array.isArray(_valuesEnd[property]);
        if (propType === "undefined" || propType === "function") {
          continue;
        }
        if (isInterpolationList) {
          var endValues = _valuesEnd[property];
          if (endValues.length === 0) {
            continue;
          }
          var temp = [startValue];
          for (var i = 0, l = endValues.length; i < l; i += 1) {
            var value = this._handleRelativeValue(startValue, endValues[i]);
            if (isNaN(value)) {
              isInterpolationList = false;
              console.warn("Found invalid interpolation list. Skipping.");
              break;
            }
            temp.push(value);
          }
          if (isInterpolationList) {
            _valuesEnd[property] = temp;
          }
        }
        if ((propType === "object" || startValueIsArray) && startValue && !isInterpolationList) {
          _valuesStart[property] = startValueIsArray ? [] : {};
          var nestedObject = startValue;
          for (var prop in nestedObject) {
            _valuesStart[property][prop] = nestedObject[prop];
          }
          _valuesStartRepeat[property] = startValueIsArray ? [] : {};
          var endValues = _valuesEnd[property];
          if (!this._isDynamic) {
            var tmp = {};
            for (var prop in endValues)
              tmp[prop] = endValues[prop];
            _valuesEnd[property] = endValues = tmp;
          }
          this._setupProperties(nestedObject, _valuesStart[property], endValues, _valuesStartRepeat[property], overrideStartingValues);
        } else {
          if (typeof _valuesStart[property] === "undefined" || overrideStartingValues) {
            _valuesStart[property] = startValue;
          }
          if (!startValueIsArray) {
            _valuesStart[property] *= 1;
          }
          if (isInterpolationList) {
            _valuesStartRepeat[property] = _valuesEnd[property].slice().reverse();
          } else {
            _valuesStartRepeat[property] = _valuesStart[property] || 0;
          }
        }
      }
    };
    Tween2.prototype.stop = function() {
      if (!this._isChainStopped) {
        this._isChainStopped = true;
        this.stopChainedTweens();
      }
      if (!this._isPlaying) {
        return this;
      }
      this._isPlaying = false;
      this._isPaused = false;
      if (this._onStopCallback) {
        this._onStopCallback(this._object);
      }
      return this;
    };
    Tween2.prototype.end = function() {
      this._goToEnd = true;
      this.update(this._startTime + this._duration);
      return this;
    };
    Tween2.prototype.pause = function(time) {
      if (time === void 0) {
        time = now();
      }
      if (this._isPaused || !this._isPlaying) {
        return this;
      }
      this._isPaused = true;
      this._pauseStart = time;
      return this;
    };
    Tween2.prototype.resume = function(time) {
      if (time === void 0) {
        time = now();
      }
      if (!this._isPaused || !this._isPlaying) {
        return this;
      }
      this._isPaused = false;
      this._startTime += time - this._pauseStart;
      this._pauseStart = 0;
      return this;
    };
    Tween2.prototype.stopChainedTweens = function() {
      for (var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
        this._chainedTweens[i].stop();
      }
      return this;
    };
    Tween2.prototype.group = function(group) {
      if (!group) {
        console.warn("tween.group() without args has been removed, use group.add(tween) instead.");
        return this;
      }
      group.add(this);
      return this;
    };
    Tween2.prototype.remove = function() {
      var _a;
      (_a = this._group) === null || _a === void 0 ? void 0 : _a.remove(this);
      return this;
    };
    Tween2.prototype.delay = function(amount) {
      if (amount === void 0) {
        amount = 0;
      }
      this._delayTime = amount;
      return this;
    };
    Tween2.prototype.repeat = function(times) {
      if (times === void 0) {
        times = 0;
      }
      this._initialRepeat = times;
      this._repeat = times;
      return this;
    };
    Tween2.prototype.repeatDelay = function(amount) {
      this._repeatDelayTime = amount;
      return this;
    };
    Tween2.prototype.yoyo = function(yoyo) {
      if (yoyo === void 0) {
        yoyo = false;
      }
      this._yoyo = yoyo;
      return this;
    };
    Tween2.prototype.easing = function(easingFunction) {
      if (easingFunction === void 0) {
        easingFunction = Easing.Linear.None;
      }
      this._easingFunction = easingFunction;
      return this;
    };
    Tween2.prototype.interpolation = function(interpolationFunction) {
      if (interpolationFunction === void 0) {
        interpolationFunction = Interpolation.Linear;
      }
      this._interpolationFunction = interpolationFunction;
      return this;
    };
    Tween2.prototype.chain = function() {
      var tweens = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        tweens[_i] = arguments[_i];
      }
      this._chainedTweens = tweens;
      return this;
    };
    Tween2.prototype.onStart = function(callback) {
      this._onStartCallback = callback;
      return this;
    };
    Tween2.prototype.onEveryStart = function(callback) {
      this._onEveryStartCallback = callback;
      return this;
    };
    Tween2.prototype.onUpdate = function(callback) {
      this._onUpdateCallback = callback;
      return this;
    };
    Tween2.prototype.onRepeat = function(callback) {
      this._onRepeatCallback = callback;
      return this;
    };
    Tween2.prototype.onComplete = function(callback) {
      this._onCompleteCallback = callback;
      return this;
    };
    Tween2.prototype.onStop = function(callback) {
      this._onStopCallback = callback;
      return this;
    };
    Tween2.prototype.update = function(time, autoStart) {
      var _this = this;
      var _a;
      if (time === void 0) {
        time = now();
      }
      if (autoStart === void 0) {
        autoStart = Tween2.autoStartOnUpdate;
      }
      if (this._isPaused)
        return true;
      var property;
      if (!this._goToEnd && !this._isPlaying) {
        if (autoStart)
          this.start(time, true);
        else
          return false;
      }
      this._goToEnd = false;
      if (time < this._startTime) {
        return true;
      }
      if (this._onStartCallbackFired === false) {
        if (this._onStartCallback) {
          this._onStartCallback(this._object);
        }
        this._onStartCallbackFired = true;
      }
      if (this._onEveryStartCallbackFired === false) {
        if (this._onEveryStartCallback) {
          this._onEveryStartCallback(this._object);
        }
        this._onEveryStartCallbackFired = true;
      }
      var elapsedTime = time - this._startTime;
      var durationAndDelay = this._duration + ((_a = this._repeatDelayTime) !== null && _a !== void 0 ? _a : this._delayTime);
      var totalTime = this._duration + this._repeat * durationAndDelay;
      var calculateElapsedPortion = function() {
        if (_this._duration === 0)
          return 1;
        if (elapsedTime > totalTime) {
          return 1;
        }
        var timesRepeated = Math.trunc(elapsedTime / durationAndDelay);
        var timeIntoCurrentRepeat = elapsedTime - timesRepeated * durationAndDelay;
        var portion = Math.min(timeIntoCurrentRepeat / _this._duration, 1);
        if (portion === 0 && elapsedTime === _this._duration) {
          return 1;
        }
        return portion;
      };
      var elapsed = calculateElapsedPortion();
      var value = this._easingFunction(elapsed);
      this._updateProperties(this._object, this._valuesStart, this._valuesEnd, value);
      if (this._onUpdateCallback) {
        this._onUpdateCallback(this._object, elapsed);
      }
      if (this._duration === 0 || elapsedTime >= this._duration) {
        if (this._repeat > 0) {
          var completeCount = Math.min(Math.trunc((elapsedTime - this._duration) / durationAndDelay) + 1, this._repeat);
          if (isFinite(this._repeat)) {
            this._repeat -= completeCount;
          }
          for (property in this._valuesStartRepeat) {
            if (!this._yoyo && typeof this._valuesEnd[property] === "string") {
              this._valuesStartRepeat[property] = // eslint-disable-next-line
              // @ts-ignore FIXME?
              this._valuesStartRepeat[property] + parseFloat(this._valuesEnd[property]);
            }
            if (this._yoyo) {
              this._swapEndStartRepeatValues(property);
            }
            this._valuesStart[property] = this._valuesStartRepeat[property];
          }
          if (this._yoyo) {
            this._reversed = !this._reversed;
          }
          this._startTime += durationAndDelay * completeCount;
          if (this._onRepeatCallback) {
            this._onRepeatCallback(this._object);
          }
          this._onEveryStartCallbackFired = false;
          return true;
        } else {
          if (this._onCompleteCallback) {
            this._onCompleteCallback(this._object);
          }
          for (var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
            this._chainedTweens[i].start(this._startTime + this._duration, false);
          }
          this._isPlaying = false;
          return false;
        }
      }
      return true;
    };
    Tween2.prototype._updateProperties = function(_object, _valuesStart, _valuesEnd, value) {
      for (var property in _valuesEnd) {
        if (_valuesStart[property] === void 0) {
          continue;
        }
        var start = _valuesStart[property] || 0;
        var end = _valuesEnd[property];
        var startIsArray = Array.isArray(_object[property]);
        var endIsArray = Array.isArray(end);
        var isInterpolationList = !startIsArray && endIsArray;
        if (isInterpolationList) {
          _object[property] = this._interpolationFunction(end, value);
        } else if (typeof end === "object" && end) {
          this._updateProperties(_object[property], start, end, value);
        } else {
          end = this._handleRelativeValue(start, end);
          if (typeof end === "number") {
            _object[property] = start + (end - start) * value;
          }
        }
      }
    };
    Tween2.prototype._handleRelativeValue = function(start, end) {
      if (typeof end !== "string") {
        return end;
      }
      if (end.charAt(0) === "+" || end.charAt(0) === "-") {
        return start + parseFloat(end);
      }
      return parseFloat(end);
    };
    Tween2.prototype._swapEndStartRepeatValues = function(property) {
      var tmp = this._valuesStartRepeat[property];
      var endValue = this._valuesEnd[property];
      if (typeof endValue === "string") {
        this._valuesStartRepeat[property] = this._valuesStartRepeat[property] + parseFloat(endValue);
      } else {
        this._valuesStartRepeat[property] = this._valuesEnd[property];
      }
      this._valuesEnd[property] = tmp;
    };
    Tween2.autoStartOnUpdate = false;
    return Tween2;
  })()
);
var nextId = Sequence.nextId;
var TWEEN = mainGroup;
var getAll = TWEEN.getAll.bind(TWEEN);
var removeAll = TWEEN.removeAll.bind(TWEEN);
var add = TWEEN.add.bind(TWEEN);
var remove = TWEEN.remove.bind(TWEEN);
var update = TWEEN.update.bind(TWEEN);

// node_modules/@iharbeck/ngx-virtual-scroller/fesm2022/iharbeck-ngx-virtual-scroller.mjs
var _c0 = ["container"];
var _c1 = ["content"];
var _c2 = ["invisiblePadding"];
var _c3 = [[["", "tab-header", ""]], "*", [["", "tab-footer", ""]]];
var _c4 = ["[tab-header]", "*", "[tab-footer]"];
function VIRTUAL_SCROLLER_DEFAULT_OPTIONS_FACTORY() {
  return {
    checkResizeInterval: 1e3,
    modifyOverflowStyleOfParentScroll: true,
    resizeBypassRefreshThreshold: 5,
    scrollAnimationTime: 750,
    scrollDebounceTime: 0,
    scrollThrottlingTime: 0,
    stripedTable: false
  };
}
var VirtualScrollerComponent = class _VirtualScrollerComponent {
  element;
  renderer;
  zone;
  changeDetectorRef;
  viewPortItems;
  window = window;
  get viewPortInfo() {
    let pageInfo = this.previousViewPort || {};
    return {
      startIndex: pageInfo.startIndex || 0,
      endIndex: pageInfo.endIndex || 0,
      scrollStartPosition: pageInfo.scrollStartPosition || 0,
      scrollEndPosition: pageInfo.scrollEndPosition || 0,
      maxScrollPosition: pageInfo.maxScrollPosition || 0,
      startIndexWithBuffer: pageInfo.startIndexWithBuffer || 0,
      endIndexWithBuffer: pageInfo.endIndexWithBuffer || 0
    };
  }
  executeRefreshOutsideAngularZone = false;
  _enableUnequalChildrenSizes = false;
  get enableUnequalChildrenSizes() {
    return this._enableUnequalChildrenSizes;
  }
  set enableUnequalChildrenSizes(value) {
    if (this._enableUnequalChildrenSizes === value) {
      return;
    }
    this._enableUnequalChildrenSizes = value;
    this.minMeasuredChildWidth = void 0;
    this.minMeasuredChildHeight = void 0;
  }
  RTL = false;
  useMarginInsteadOfTranslate = false;
  modifyOverflowStyleOfParentScroll;
  stripedTable;
  scrollbarWidth;
  scrollbarHeight;
  childWidth;
  childHeight;
  ssrChildWidth;
  ssrChildHeight;
  ssrViewportWidth = 1920;
  ssrViewportHeight = 1080;
  _bufferAmount;
  get bufferAmount() {
    if (typeof this._bufferAmount === "number" && this._bufferAmount >= 0) {
      return this._bufferAmount;
    } else {
      return this.enableUnequalChildrenSizes ? 5 : 0;
    }
  }
  set bufferAmount(value) {
    this._bufferAmount = value;
  }
  scrollAnimationTime;
  resizeBypassRefreshThreshold;
  _scrollThrottlingTime;
  get scrollThrottlingTime() {
    return this._scrollThrottlingTime;
  }
  set scrollThrottlingTime(value) {
    this._scrollThrottlingTime = value;
    this.updateOnScrollFunction();
  }
  _scrollDebounceTime;
  get scrollDebounceTime() {
    return this._scrollDebounceTime;
  }
  set scrollDebounceTime(value) {
    this._scrollDebounceTime = value;
    this.updateOnScrollFunction();
  }
  onScroll;
  updateOnScrollFunction() {
    if (this.scrollDebounceTime) {
      this.onScroll = this.debounce(() => {
        this.refresh_internal(false);
      }, this.scrollDebounceTime);
    } else if (this.scrollThrottlingTime) {
      this.onScroll = this.throttleTrailing(() => {
        this.refresh_internal(false);
      }, this.scrollThrottlingTime);
    } else {
      this.onScroll = () => {
        this.refresh_internal(false);
      };
    }
  }
  checkScrollElementResizedTimer;
  _checkResizeInterval;
  get checkResizeInterval() {
    return this._checkResizeInterval;
  }
  set checkResizeInterval(value) {
    if (this._checkResizeInterval === value) {
      return;
    }
    this._checkResizeInterval = value;
    this.addScrollEventHandlers();
  }
  _items = [];
  get items() {
    return this._items;
  }
  set items(value) {
    if (value === this._items) {
      return;
    }
    this._items = value || [];
    this.refresh_internal(true);
  }
  compareItems = (item1, item2) => item1 === item2;
  _horizontal;
  get horizontal() {
    return this._horizontal;
  }
  set horizontal(value) {
    this._horizontal = value;
    this.updateDirection();
  }
  revertParentOverscroll() {
    const scrollElement = this.getScrollElement();
    if (scrollElement && this.oldParentScrollOverflow) {
      scrollElement.style["overflow-y"] = this.oldParentScrollOverflow.y;
      scrollElement.style["overflow-x"] = this.oldParentScrollOverflow.x;
    }
    this.oldParentScrollOverflow = void 0;
  }
  oldParentScrollOverflow;
  _parentScroll;
  get parentScroll() {
    return this._parentScroll;
  }
  set parentScroll(value) {
    if (this._parentScroll === value) {
      return;
    }
    this.revertParentOverscroll();
    this._parentScroll = value;
    this.addScrollEventHandlers();
    const scrollElement = this.getScrollElement();
    if (this.modifyOverflowStyleOfParentScroll && scrollElement !== this.element.nativeElement) {
      this.oldParentScrollOverflow = {
        x: scrollElement.style["overflow-x"],
        y: scrollElement.style["overflow-y"]
      };
      scrollElement.style["overflow-y"] = this.horizontal ? "visible" : "auto";
      scrollElement.style["overflow-x"] = this.horizontal ? "auto" : "visible";
    }
  }
  vsUpdate = new EventEmitter();
  vsChange = new EventEmitter();
  vsStart = new EventEmitter();
  vsEnd = new EventEmitter();
  contentElementRef;
  invisiblePaddingElementRef;
  containerElementRef;
  ngOnInit() {
    this.addScrollEventHandlers();
  }
  ngOnDestroy() {
    this.removeScrollEventHandlers();
    this.revertParentOverscroll();
  }
  ngOnChanges(changes) {
    let indexLengthChanged = this.cachedItemsLength !== this.items.length;
    this.cachedItemsLength = this.items.length;
    const firstRun = !changes.items || !changes.items.previousValue || changes.items.previousValue.length === 0;
    this.refresh_internal(indexLengthChanged || firstRun);
  }
  ngDoCheck() {
    if (this.cachedItemsLength !== this.items.length) {
      this.cachedItemsLength = this.items.length;
      this.refresh_internal(true);
      return;
    }
    if (this.previousViewPort && this.viewPortItems && this.viewPortItems.length > 0) {
      let itemsArrayChanged = false;
      for (let i = 0; i < this.viewPortItems.length; ++i) {
        if (!this.compareItems(this.items[this.previousViewPort.startIndexWithBuffer + i], this.viewPortItems[i])) {
          itemsArrayChanged = true;
          break;
        }
      }
      if (itemsArrayChanged) {
        this.refresh_internal(true);
      }
    }
  }
  refresh() {
    this.refresh_internal(true);
  }
  invalidateAllCachedMeasurements() {
    this.wrapGroupDimensions = {
      maxChildSizePerWrapGroup: [],
      numberOfKnownWrapGroupChildSizes: 0,
      sumOfKnownWrapGroupChildWidths: 0,
      sumOfKnownWrapGroupChildHeights: 0
    };
    this.minMeasuredChildWidth = void 0;
    this.minMeasuredChildHeight = void 0;
    this.refresh_internal(false);
  }
  invalidateCachedMeasurementForItem(item) {
    if (this.enableUnequalChildrenSizes) {
      let index = this.items && this.items.indexOf(item);
      if (index >= 0) {
        this.invalidateCachedMeasurementAtIndex(index);
      }
    } else {
      this.minMeasuredChildWidth = void 0;
      this.minMeasuredChildHeight = void 0;
    }
    this.refresh_internal(false);
  }
  invalidateCachedMeasurementAtIndex(index) {
    if (this.enableUnequalChildrenSizes) {
      let cachedMeasurement = this.wrapGroupDimensions.maxChildSizePerWrapGroup[index];
      if (cachedMeasurement) {
        this.wrapGroupDimensions.maxChildSizePerWrapGroup[index] = void 0;
        --this.wrapGroupDimensions.numberOfKnownWrapGroupChildSizes;
        this.wrapGroupDimensions.sumOfKnownWrapGroupChildWidths -= cachedMeasurement.childWidth || 0;
        this.wrapGroupDimensions.sumOfKnownWrapGroupChildHeights -= cachedMeasurement.childHeight || 0;
      }
    } else {
      this.minMeasuredChildWidth = void 0;
      this.minMeasuredChildHeight = void 0;
    }
    this.refresh_internal(false);
  }
  scrollInto(item, alignToBeginning = true, additionalOffset = 0, animationMilliseconds = void 0, animationCompletedCallback = void 0) {
    let index = this.items.indexOf(item);
    if (index === -1) {
      return;
    }
    this.scrollToIndex(index, alignToBeginning, additionalOffset, animationMilliseconds, animationCompletedCallback);
  }
  scrollToIndex(index, alignToBeginning = true, additionalOffset = 0, animationMilliseconds = void 0, animationCompletedCallback = void 0) {
    let maxRetries = 5;
    let retryIfNeeded = () => {
      --maxRetries;
      if (maxRetries <= 0) {
        if (animationCompletedCallback) {
          animationCompletedCallback();
        }
        return;
      }
      let dimensions = this.calculateDimensions();
      let desiredStartIndex = Math.min(Math.max(index, 0), dimensions.itemCount - 1);
      if (this.previousViewPort.startIndex === desiredStartIndex) {
        if (animationCompletedCallback) {
          animationCompletedCallback();
        }
        return;
      }
      this.scrollToIndex_internal(index, alignToBeginning, additionalOffset, 0, retryIfNeeded);
    };
    this.scrollToIndex_internal(index, alignToBeginning, additionalOffset, animationMilliseconds, retryIfNeeded);
  }
  scrollToIndex_internal(index, alignToBeginning = true, additionalOffset = 0, animationMilliseconds = void 0, animationCompletedCallback = void 0) {
    animationMilliseconds = animationMilliseconds === void 0 ? this.scrollAnimationTime : animationMilliseconds;
    let dimensions = this.calculateDimensions();
    let scroll = this.calculatePadding(index, dimensions) + additionalOffset;
    if (!alignToBeginning) {
      scroll -= dimensions.wrapGroupsPerPage * dimensions[this._childScrollDim];
    }
    this.scrollToPosition(scroll, animationMilliseconds, animationCompletedCallback);
  }
  scrollToPosition(scrollPosition, animationMilliseconds = void 0, animationCompletedCallback = void 0) {
    scrollPosition += this.getElementsOffset();
    animationMilliseconds = animationMilliseconds === void 0 ? this.scrollAnimationTime : animationMilliseconds;
    let scrollElement = this.getScrollElement();
    let animationRequest;
    if (this.currentTween) {
      this.currentTween.stop();
      this.currentTween = void 0;
    }
    if (!animationMilliseconds) {
      this.renderer.setProperty(scrollElement, this._scrollType, scrollPosition);
      this.refresh_internal(false, animationCompletedCallback);
      return;
    }
    const tweenConfigObj = {
      scrollPosition: scrollElement[this._scrollType]
    };
    let newTween = new Tween(tweenConfigObj).to({
      scrollPosition
    }, animationMilliseconds).easing(Easing.Quadratic.Out).onUpdate((data) => {
      if (isNaN(data.scrollPosition)) {
        return;
      }
      this.renderer.setProperty(scrollElement, this._scrollType, data.scrollPosition);
      this.refresh_internal(false);
    }).onStop(() => {
      cancelAnimationFrame(animationRequest);
    }).start();
    const animate = (time) => {
      if (!newTween["isPlaying"]()) {
        return;
      }
      newTween.update(time);
      if (tweenConfigObj.scrollPosition === scrollPosition) {
        this.refresh_internal(false, animationCompletedCallback);
        return;
      }
      this.zone.runOutsideAngular(() => {
        animationRequest = requestAnimationFrame(animate);
      });
    };
    animate();
    this.currentTween = newTween;
  }
  isAngularUniversalSSR;
  constructor(element, renderer, zone, changeDetectorRef, platformId, options) {
    this.element = element;
    this.renderer = renderer;
    this.zone = zone;
    this.changeDetectorRef = changeDetectorRef;
    this.isAngularUniversalSSR = isPlatformServer(platformId);
    this.checkResizeInterval = options.checkResizeInterval;
    this.modifyOverflowStyleOfParentScroll = options.modifyOverflowStyleOfParentScroll;
    this.resizeBypassRefreshThreshold = options.resizeBypassRefreshThreshold;
    this.scrollAnimationTime = options.scrollAnimationTime;
    this.scrollDebounceTime = options.scrollDebounceTime;
    this.scrollThrottlingTime = options.scrollThrottlingTime;
    this.scrollbarHeight = options.scrollbarHeight;
    this.scrollbarWidth = options.scrollbarWidth;
    this.stripedTable = options.stripedTable;
    this.horizontal = false;
    this.resetWrapGroupDimensions();
  }
  getElementSize(element) {
    let result = element.getBoundingClientRect();
    let styles = getComputedStyle(element);
    let marginTop = parseInt(styles["margin-top"], 10) || 0;
    let marginBottom = parseInt(styles["margin-bottom"], 10) || 0;
    let marginLeft = parseInt(styles["margin-left"], 10) || 0;
    let marginRight = parseInt(styles["margin-right"], 10) || 0;
    return {
      top: result.top + marginTop,
      bottom: result.bottom + marginBottom,
      left: result.left + marginLeft,
      right: result.right + marginRight,
      width: result.width + marginLeft + marginRight,
      height: result.height + marginTop + marginBottom
    };
  }
  previousScrollBoundingRect;
  checkScrollElementResized() {
    let boundingRect = this.getElementSize(this.getScrollElement());
    let sizeChanged;
    if (!this.previousScrollBoundingRect) {
      sizeChanged = true;
    } else {
      let widthChange = Math.abs(boundingRect.width - this.previousScrollBoundingRect.width);
      let heightChange = Math.abs(boundingRect.height - this.previousScrollBoundingRect.height);
      sizeChanged = widthChange > this.resizeBypassRefreshThreshold || heightChange > this.resizeBypassRefreshThreshold;
    }
    if (sizeChanged) {
      this.previousScrollBoundingRect = boundingRect;
      if (boundingRect.width > 0 && boundingRect.height > 0) {
        this.refresh_internal(false);
      }
    }
  }
  _invisiblePaddingProperty;
  _offsetType;
  _scrollType;
  _pageOffsetType;
  _childScrollDim;
  _translateDir;
  _marginDir;
  updateDirection() {
    if (this.horizontal) {
      this._childScrollDim = "childWidth";
      this._invisiblePaddingProperty = "width";
      this._marginDir = "margin-left";
      this._offsetType = "offsetLeft";
      this._pageOffsetType = "pageXOffset";
      this._scrollType = "scrollLeft";
      this._translateDir = "translateX";
    } else {
      this._childScrollDim = "childHeight";
      this._invisiblePaddingProperty = "height";
      this._marginDir = "margin-top";
      this._offsetType = "offsetTop";
      this._pageOffsetType = "pageYOffset";
      this._scrollType = "scrollTop";
      this._translateDir = "translateY";
    }
  }
  debounce(func, wait) {
    const throttled = this.throttleTrailing(func, wait);
    const result = function() {
      throttled["cancel"]();
      throttled.apply(this, arguments);
    };
    result["cancel"] = function() {
      throttled["cancel"]();
    };
    return result;
  }
  throttleTrailing(func, wait) {
    let timeout = void 0;
    let _arguments = arguments;
    const result = function() {
      const _this = this;
      _arguments = arguments;
      if (timeout) {
        return;
      }
      if (wait <= 0) {
        func.apply(_this, _arguments);
      } else {
        timeout = setTimeout(function() {
          timeout = void 0;
          func.apply(_this, _arguments);
        }, wait);
      }
    };
    result["cancel"] = function() {
      if (timeout) {
        clearTimeout(timeout);
        timeout = void 0;
      }
    };
    return result;
  }
  calculatedScrollbarWidth = 0;
  calculatedScrollbarHeight = 0;
  padding = 0;
  previousViewPort = {};
  currentTween;
  cachedItemsLength;
  disposeScrollHandler;
  disposeResizeHandler;
  refresh_internal(itemsArrayModified, refreshCompletedCallback = void 0, maxRunTimes = 2) {
    if (itemsArrayModified && this.previousViewPort && this.previousViewPort.scrollStartPosition > 0) {
      let oldViewPort = this.previousViewPort;
      let oldViewPortItems = this.viewPortItems;
      let oldRefreshCompletedCallback = refreshCompletedCallback;
      refreshCompletedCallback = () => {
        let scrollLengthDelta = this.previousViewPort.scrollLength - oldViewPort.scrollLength;
        if (scrollLengthDelta > 0 && this.viewPortItems) {
          let oldStartItem = oldViewPortItems[0];
          let oldStartItemIndex = this.items.findIndex((x) => this.compareItems(oldStartItem, x));
          if (oldStartItemIndex > this.previousViewPort.startIndexWithBuffer) {
            let itemOrderChanged = false;
            for (let i = 1; i < this.viewPortItems.length; ++i) {
              if (!this.compareItems(this.items[oldStartItemIndex + i], oldViewPortItems[i])) {
                itemOrderChanged = true;
                break;
              }
            }
            if (!itemOrderChanged) {
              this.scrollToPosition(this.previousViewPort.scrollStartPosition + scrollLengthDelta, 0, oldRefreshCompletedCallback);
              return;
            }
          }
        }
        if (oldRefreshCompletedCallback) {
          oldRefreshCompletedCallback();
        }
      };
    }
    this.zone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        if (itemsArrayModified) {
          this.resetWrapGroupDimensions();
        }
        let viewport = this.calculateViewport();
        let startChanged = itemsArrayModified || viewport.startIndex !== this.previousViewPort.startIndex;
        let endChanged = itemsArrayModified || viewport.endIndex !== this.previousViewPort.endIndex;
        let scrollbarLengthChanged = viewport.scrollbarLength !== this.previousViewPort.scrollbarLength;
        let paddingChanged = viewport.padding !== this.previousViewPort.padding;
        let scrollPositionChanged = viewport.scrollStartPosition !== this.previousViewPort.scrollStartPosition || viewport.scrollEndPosition !== this.previousViewPort.scrollEndPosition || viewport.maxScrollPosition !== this.previousViewPort.maxScrollPosition;
        this.previousViewPort = viewport;
        if (scrollbarLengthChanged) {
          this.renderer.setStyle(this.invisiblePaddingElementRef.nativeElement, this._invisiblePaddingProperty, `${viewport.scrollLength}px`);
        }
        if (paddingChanged) {
          if (this.useMarginInsteadOfTranslate) {
            this.renderer.setStyle(this.contentElementRef.nativeElement, this._marginDir, `${viewport.padding}px`);
          } else {
            this.renderer.setStyle(this.contentElementRef.nativeElement, "transform", `${this._translateDir}(${viewport.padding}px)`);
            this.renderer.setStyle(this.contentElementRef.nativeElement, "webkitTransform", `${this._translateDir}(${viewport.padding}px)`);
          }
        }
        const changeEventArg = startChanged || endChanged ? {
          startIndex: viewport.startIndex,
          endIndex: viewport.endIndex,
          scrollStartPosition: viewport.scrollStartPosition,
          scrollEndPosition: viewport.scrollEndPosition,
          startIndexWithBuffer: viewport.startIndexWithBuffer,
          endIndexWithBuffer: viewport.endIndexWithBuffer,
          maxScrollPosition: viewport.maxScrollPosition
        } : void 0;
        if (startChanged || endChanged || scrollPositionChanged) {
          const handleChanged = () => {
            this.viewPortItems = viewport.startIndexWithBuffer >= 0 && viewport.endIndexWithBuffer >= 0 ? this.items.slice(viewport.startIndexWithBuffer, viewport.endIndexWithBuffer + 1) : [];
            this.vsUpdate.emit(this.viewPortItems);
            if (startChanged) {
              this.vsStart.emit(changeEventArg);
            }
            if (endChanged) {
              this.vsEnd.emit(changeEventArg);
            }
            if (startChanged || endChanged) {
              this.changeDetectorRef.markForCheck();
              this.vsChange.emit(changeEventArg);
            }
            if (maxRunTimes > 0) {
              this.refresh_internal(false, refreshCompletedCallback, maxRunTimes - 1);
              return;
            }
            if (refreshCompletedCallback) {
              refreshCompletedCallback();
            }
          };
          if (this.executeRefreshOutsideAngularZone) {
            handleChanged();
          } else {
            this.zone.run(handleChanged);
          }
        } else {
          if (maxRunTimes > 0 && (scrollbarLengthChanged || paddingChanged)) {
            this.refresh_internal(false, refreshCompletedCallback, maxRunTimes - 1);
            return;
          }
          if (refreshCompletedCallback) {
            refreshCompletedCallback();
          }
        }
      });
    });
  }
  getScrollElement() {
    return this.parentScroll instanceof Window ? document.scrollingElement || document.documentElement || document.body : this.parentScroll || this.element.nativeElement;
  }
  addScrollEventHandlers() {
    if (this.isAngularUniversalSSR) {
      return;
    }
    let scrollElement = this.getScrollElement();
    this.removeScrollEventHandlers();
    this.zone.runOutsideAngular(() => {
      if (this.parentScroll instanceof Window) {
        this.disposeScrollHandler = this.renderer.listen("window", "scroll", this.onScroll);
        this.disposeResizeHandler = this.renderer.listen("window", "resize", this.onScroll);
      } else {
        this.disposeScrollHandler = this.renderer.listen(scrollElement, "scroll", this.onScroll);
        if (this._checkResizeInterval > 0) {
          this.checkScrollElementResizedTimer = setInterval(() => {
            this.checkScrollElementResized();
          }, this._checkResizeInterval);
        }
      }
    });
  }
  removeScrollEventHandlers() {
    if (this.checkScrollElementResizedTimer) {
      clearInterval(this.checkScrollElementResizedTimer);
    }
    if (this.disposeScrollHandler) {
      this.disposeScrollHandler();
      this.disposeScrollHandler = void 0;
    }
    if (this.disposeResizeHandler) {
      this.disposeResizeHandler();
      this.disposeResizeHandler = void 0;
    }
  }
  getElementsOffset() {
    if (this.isAngularUniversalSSR) {
      return 0;
    }
    let offset = 0;
    if (this.containerElementRef && this.containerElementRef.nativeElement) {
      offset += this.containerElementRef.nativeElement[this._offsetType];
    }
    if (this.parentScroll) {
      let scrollElement = this.getScrollElement();
      let elementClientRect = this.getElementSize(this.element.nativeElement);
      let scrollClientRect = this.getElementSize(scrollElement);
      if (this.horizontal) {
        offset += elementClientRect.left - scrollClientRect.left;
      } else {
        offset += elementClientRect.top - scrollClientRect.top;
      }
      if (!(this.parentScroll instanceof Window)) {
        offset += scrollElement[this._scrollType];
      }
    }
    return offset;
  }
  countItemsPerWrapGroup() {
    if (this.isAngularUniversalSSR) {
      return Math.round(this.horizontal ? this.ssrViewportHeight / this.ssrChildHeight : this.ssrViewportWidth / this.ssrChildWidth);
    }
    let propertyName = this.horizontal ? "offsetLeft" : "offsetTop";
    let children = (this.containerElementRef && this.containerElementRef.nativeElement || this.contentElementRef.nativeElement).children;
    let childrenLength = children ? children.length : 0;
    if (childrenLength === 0) {
      return 1;
    }
    let firstOffset = children[0][propertyName];
    let result = 1;
    while (result < childrenLength && firstOffset === children[result][propertyName]) {
      ++result;
    }
    return result;
  }
  getScrollStartPosition() {
    let windowScrollValue = void 0;
    if (this.parentScroll instanceof Window) {
      windowScrollValue = window[this._pageOffsetType];
    }
    return windowScrollValue || this.getScrollElement()[this._scrollType] || 0;
  }
  minMeasuredChildWidth;
  minMeasuredChildHeight;
  wrapGroupDimensions;
  resetWrapGroupDimensions() {
    const oldWrapGroupDimensions = this.wrapGroupDimensions;
    this.invalidateAllCachedMeasurements();
    if (!this.enableUnequalChildrenSizes || !oldWrapGroupDimensions || oldWrapGroupDimensions.numberOfKnownWrapGroupChildSizes === 0) {
      return;
    }
    const itemsPerWrapGroup = this.countItemsPerWrapGroup();
    for (let wrapGroupIndex = 0; wrapGroupIndex < oldWrapGroupDimensions.maxChildSizePerWrapGroup.length; ++wrapGroupIndex) {
      const oldWrapGroupDimension = oldWrapGroupDimensions.maxChildSizePerWrapGroup[wrapGroupIndex];
      if (!oldWrapGroupDimension || !oldWrapGroupDimension.items || !oldWrapGroupDimension.items.length) {
        continue;
      }
      if (oldWrapGroupDimension.items.length !== itemsPerWrapGroup) {
        return;
      }
      let itemsChanged = false;
      let arrayStartIndex = itemsPerWrapGroup * wrapGroupIndex;
      for (let i = 0; i < itemsPerWrapGroup; ++i) {
        if (!this.compareItems(oldWrapGroupDimension.items[i], this.items[arrayStartIndex + i])) {
          itemsChanged = true;
          break;
        }
      }
      if (!itemsChanged) {
        ++this.wrapGroupDimensions.numberOfKnownWrapGroupChildSizes;
        this.wrapGroupDimensions.sumOfKnownWrapGroupChildWidths += oldWrapGroupDimension.childWidth || 0;
        this.wrapGroupDimensions.sumOfKnownWrapGroupChildHeights += oldWrapGroupDimension.childHeight || 0;
        this.wrapGroupDimensions.maxChildSizePerWrapGroup[wrapGroupIndex] = oldWrapGroupDimension;
      }
    }
  }
  calculateDimensions() {
    let scrollElement = this.getScrollElement();
    const maxCalculatedScrollBarSize = 25;
    this.calculatedScrollbarHeight = Math.max(Math.min(scrollElement.offsetHeight - scrollElement.clientHeight, maxCalculatedScrollBarSize), this.calculatedScrollbarHeight);
    this.calculatedScrollbarWidth = Math.max(Math.min(scrollElement.offsetWidth - scrollElement.clientWidth, maxCalculatedScrollBarSize), this.calculatedScrollbarWidth);
    let viewportWidth = scrollElement.offsetWidth - (this.scrollbarWidth || this.calculatedScrollbarWidth || (this.horizontal ? 0 : maxCalculatedScrollBarSize));
    let viewportHeight = scrollElement.offsetHeight - (this.scrollbarHeight || this.calculatedScrollbarHeight || (this.horizontal ? maxCalculatedScrollBarSize : 0));
    let content = this.containerElementRef && this.containerElementRef.nativeElement || this.contentElementRef.nativeElement;
    let itemsPerWrapGroup = this.countItemsPerWrapGroup();
    let wrapGroupsPerPage;
    let defaultChildWidth;
    let defaultChildHeight;
    if (this.isAngularUniversalSSR) {
      viewportWidth = this.ssrViewportWidth;
      viewportHeight = this.ssrViewportHeight;
      defaultChildWidth = this.ssrChildWidth;
      defaultChildHeight = this.ssrChildHeight;
      let itemsPerRow = Math.max(Math.ceil(viewportWidth / defaultChildWidth), 1);
      let itemsPerCol = Math.max(Math.ceil(viewportHeight / defaultChildHeight), 1);
      wrapGroupsPerPage = this.horizontal ? itemsPerRow : itemsPerCol;
    } else if (!this.enableUnequalChildrenSizes) {
      if (content.children.length > 0) {
        if (!this.childWidth || !this.childHeight) {
          if (!this.minMeasuredChildWidth && viewportWidth > 0) {
            this.minMeasuredChildWidth = viewportWidth;
          }
          if (!this.minMeasuredChildHeight && viewportHeight > 0) {
            this.minMeasuredChildHeight = viewportHeight;
          }
        }
        let child = content.children[0];
        let clientRect = this.getElementSize(child);
        this.minMeasuredChildWidth = Math.min(this.minMeasuredChildWidth, clientRect.width);
        this.minMeasuredChildHeight = Math.min(this.minMeasuredChildHeight, clientRect.height);
      }
      defaultChildWidth = this.childWidth || this.minMeasuredChildWidth || viewportWidth;
      defaultChildHeight = this.childHeight || this.minMeasuredChildHeight || viewportHeight;
      let itemsPerRow = Math.max(Math.ceil(viewportWidth / defaultChildWidth), 1);
      let itemsPerCol = Math.max(Math.ceil(viewportHeight / defaultChildHeight), 1);
      wrapGroupsPerPage = this.horizontal ? itemsPerRow : itemsPerCol;
    } else {
      let scrollOffset = scrollElement[this._scrollType] - (this.previousViewPort ? this.previousViewPort.padding : 0);
      let arrayStartIndex = this.previousViewPort.startIndexWithBuffer || 0;
      let wrapGroupIndex = Math.ceil(arrayStartIndex / itemsPerWrapGroup);
      let maxWidthForWrapGroup = 0;
      let maxHeightForWrapGroup = 0;
      let sumOfVisibleMaxWidths = 0;
      let sumOfVisibleMaxHeights = 0;
      wrapGroupsPerPage = 0;
      for (let i = 0; i < content.children.length; ++i) {
        ++arrayStartIndex;
        let child = content.children[i];
        let clientRect = this.getElementSize(child);
        maxWidthForWrapGroup = Math.max(maxWidthForWrapGroup, clientRect.width);
        maxHeightForWrapGroup = Math.max(maxHeightForWrapGroup, clientRect.height);
        if (arrayStartIndex % itemsPerWrapGroup === 0) {
          let oldValue = this.wrapGroupDimensions.maxChildSizePerWrapGroup[wrapGroupIndex];
          if (oldValue) {
            --this.wrapGroupDimensions.numberOfKnownWrapGroupChildSizes;
            this.wrapGroupDimensions.sumOfKnownWrapGroupChildWidths -= oldValue.childWidth || 0;
            this.wrapGroupDimensions.sumOfKnownWrapGroupChildHeights -= oldValue.childHeight || 0;
          }
          ++this.wrapGroupDimensions.numberOfKnownWrapGroupChildSizes;
          const items = this.items.slice(arrayStartIndex - itemsPerWrapGroup, arrayStartIndex);
          this.wrapGroupDimensions.maxChildSizePerWrapGroup[wrapGroupIndex] = {
            childWidth: maxWidthForWrapGroup,
            childHeight: maxHeightForWrapGroup,
            items
          };
          this.wrapGroupDimensions.sumOfKnownWrapGroupChildWidths += maxWidthForWrapGroup;
          this.wrapGroupDimensions.sumOfKnownWrapGroupChildHeights += maxHeightForWrapGroup;
          if (this.horizontal) {
            let maxVisibleWidthForWrapGroup = Math.min(maxWidthForWrapGroup, Math.max(viewportWidth - sumOfVisibleMaxWidths, 0));
            if (scrollOffset > 0) {
              let scrollOffsetToRemove = Math.min(scrollOffset, maxVisibleWidthForWrapGroup);
              maxVisibleWidthForWrapGroup -= scrollOffsetToRemove;
              scrollOffset -= scrollOffsetToRemove;
            }
            sumOfVisibleMaxWidths += maxVisibleWidthForWrapGroup;
            if (maxVisibleWidthForWrapGroup > 0 && viewportWidth >= sumOfVisibleMaxWidths) {
              ++wrapGroupsPerPage;
            }
          } else {
            let maxVisibleHeightForWrapGroup = Math.min(maxHeightForWrapGroup, Math.max(viewportHeight - sumOfVisibleMaxHeights, 0));
            if (scrollOffset > 0) {
              let scrollOffsetToRemove = Math.min(scrollOffset, maxVisibleHeightForWrapGroup);
              maxVisibleHeightForWrapGroup -= scrollOffsetToRemove;
              scrollOffset -= scrollOffsetToRemove;
            }
            sumOfVisibleMaxHeights += maxVisibleHeightForWrapGroup;
            if (maxVisibleHeightForWrapGroup > 0 && viewportHeight >= sumOfVisibleMaxHeights) {
              ++wrapGroupsPerPage;
            }
          }
          ++wrapGroupIndex;
          maxWidthForWrapGroup = 0;
          maxHeightForWrapGroup = 0;
        }
      }
      let averageChildWidth = this.wrapGroupDimensions.sumOfKnownWrapGroupChildWidths / this.wrapGroupDimensions.numberOfKnownWrapGroupChildSizes;
      let averageChildHeight = this.wrapGroupDimensions.sumOfKnownWrapGroupChildHeights / this.wrapGroupDimensions.numberOfKnownWrapGroupChildSizes;
      defaultChildWidth = this.childWidth || averageChildWidth || viewportWidth;
      defaultChildHeight = this.childHeight || averageChildHeight || viewportHeight;
      if (this.horizontal) {
        if (viewportWidth > sumOfVisibleMaxWidths) {
          wrapGroupsPerPage += Math.ceil((viewportWidth - sumOfVisibleMaxWidths) / defaultChildWidth);
        }
      } else {
        if (viewportHeight > sumOfVisibleMaxHeights) {
          wrapGroupsPerPage += Math.ceil((viewportHeight - sumOfVisibleMaxHeights) / defaultChildHeight);
        }
      }
    }
    let itemCount = this.items.length;
    let itemsPerPage = itemsPerWrapGroup * wrapGroupsPerPage;
    let pageCount_fractional = itemCount / itemsPerPage;
    let numberOfWrapGroups = Math.ceil(itemCount / itemsPerWrapGroup);
    let scrollLength = 0;
    let defaultScrollLengthPerWrapGroup = this.horizontal ? defaultChildWidth : defaultChildHeight;
    if (this.enableUnequalChildrenSizes) {
      let numUnknownChildSizes = 0;
      for (let i = 0; i < numberOfWrapGroups; ++i) {
        let childSize = this.wrapGroupDimensions.maxChildSizePerWrapGroup[i] && this.wrapGroupDimensions.maxChildSizePerWrapGroup[i][this._childScrollDim];
        if (childSize) {
          scrollLength += childSize;
        } else {
          ++numUnknownChildSizes;
        }
      }
      scrollLength += Math.round(numUnknownChildSizes * defaultScrollLengthPerWrapGroup);
    } else {
      scrollLength = numberOfWrapGroups * defaultScrollLengthPerWrapGroup;
    }
    let viewportLength = this.horizontal ? viewportWidth : viewportHeight;
    let maxScrollPosition = Math.max(scrollLength - viewportLength, 0);
    return {
      childHeight: defaultChildHeight,
      childWidth: defaultChildWidth,
      itemCount,
      itemsPerPage,
      itemsPerWrapGroup,
      maxScrollPosition,
      pageCount_fractional,
      scrollLength,
      viewportLength,
      wrapGroupsPerPage
    };
  }
  cachedPageSize = 0;
  previousScrollNumberElements = 0;
  calculatePadding(arrayStartIndexWithBuffer, dimensions) {
    if (dimensions.itemCount === 0) {
      return 0;
    }
    let defaultScrollLengthPerWrapGroup = dimensions[this._childScrollDim];
    let startingWrapGroupIndex = Math.floor(arrayStartIndexWithBuffer / dimensions.itemsPerWrapGroup) || 0;
    if (!this.enableUnequalChildrenSizes) {
      return defaultScrollLengthPerWrapGroup * startingWrapGroupIndex;
    }
    let numUnknownChildSizes = 0;
    let result = 0;
    for (let i = 0; i < startingWrapGroupIndex; ++i) {
      let childSize = this.wrapGroupDimensions.maxChildSizePerWrapGroup[i] && this.wrapGroupDimensions.maxChildSizePerWrapGroup[i][this._childScrollDim];
      if (childSize) {
        result += childSize;
      } else {
        ++numUnknownChildSizes;
      }
    }
    result += Math.round(numUnknownChildSizes * defaultScrollLengthPerWrapGroup);
    return result;
  }
  calculatePageInfo(scrollPosition, dimensions) {
    let scrollPercentage = 0;
    let scrollBottomPercentage = 1;
    let arrayStartIndex = 0;
    let arrayEndIndex = 0;
    if (this.enableUnequalChildrenSizes) {
      const numberOfWrapGroups = Math.ceil(dimensions.itemCount / dimensions.itemsPerWrapGroup);
      let totalScrolledLength = 0;
      let defaultScrollLengthPerWrapGroup = dimensions[this._childScrollDim];
      let i = 0;
      for (; i < numberOfWrapGroups; ++i) {
        let childSize = this.wrapGroupDimensions.maxChildSizePerWrapGroup[i] && this.wrapGroupDimensions.maxChildSizePerWrapGroup[i][this._childScrollDim];
        if (childSize) {
          totalScrolledLength += childSize;
        } else {
          totalScrolledLength += defaultScrollLengthPerWrapGroup;
        }
        if (scrollPosition < totalScrolledLength) {
          scrollPercentage = i / numberOfWrapGroups;
          break;
        }
      }
      let j = i + 1;
      for (; j < numberOfWrapGroups; ++j) {
        let childSize = this.wrapGroupDimensions.maxChildSizePerWrapGroup[j] && this.wrapGroupDimensions.maxChildSizePerWrapGroup[j][this._childScrollDim];
        if (childSize) {
          totalScrolledLength += childSize;
        } else {
          totalScrolledLength += defaultScrollLengthPerWrapGroup;
        }
        if (scrollPosition + dimensions.viewportLength < totalScrolledLength) {
          scrollBottomPercentage = j / numberOfWrapGroups;
          break;
        }
      }
      arrayStartIndex = i * dimensions.itemsPerWrapGroup;
      arrayEndIndex = j * dimensions.itemsPerWrapGroup;
    } else {
      scrollPercentage = scrollPosition / dimensions.scrollLength;
      let startingArrayIndex_fractional = Math.min(Math.max(scrollPercentage * dimensions.pageCount_fractional, 0), dimensions.pageCount_fractional) * dimensions.itemsPerPage;
      let maxStart = dimensions.itemCount - dimensions.itemsPerPage - 1;
      arrayStartIndex = Math.min(Math.floor(startingArrayIndex_fractional), maxStart);
      arrayEndIndex = Math.ceil(startingArrayIndex_fractional) + dimensions.itemsPerPage - 1;
    }
    arrayStartIndex -= arrayStartIndex % dimensions.itemsPerWrapGroup;
    if (this.stripedTable) {
      let bufferBoundary = 2 * dimensions.itemsPerWrapGroup;
      if (arrayStartIndex % bufferBoundary !== 0) {
        arrayStartIndex = Math.max(arrayStartIndex - arrayStartIndex % bufferBoundary, 0);
      }
    }
    let endIndexWithinWrapGroup = (arrayEndIndex + 1) % dimensions.itemsPerWrapGroup;
    if (endIndexWithinWrapGroup > 0) {
      arrayEndIndex += dimensions.itemsPerWrapGroup - endIndexWithinWrapGroup;
    }
    if (isNaN(arrayStartIndex)) {
      arrayStartIndex = 0;
    }
    if (isNaN(arrayEndIndex)) {
      arrayEndIndex = 0;
    }
    arrayStartIndex = Math.min(Math.max(arrayStartIndex, 0), dimensions.itemCount - 1);
    arrayEndIndex = Math.min(Math.max(arrayEndIndex, 0), dimensions.itemCount - 1);
    let bufferSize = this.bufferAmount * dimensions.itemsPerWrapGroup;
    let startIndexWithBuffer = Math.min(Math.max(arrayStartIndex - bufferSize, 0), dimensions.itemCount - 1);
    let endIndexWithBuffer = Math.min(Math.max(arrayEndIndex + bufferSize, 0), dimensions.itemCount - 1);
    return {
      startIndex: arrayStartIndex,
      endIndex: arrayEndIndex,
      startIndexWithBuffer,
      endIndexWithBuffer,
      scrollStartPosition: scrollPosition,
      scrollEndPosition: scrollPosition + dimensions.viewportLength,
      maxScrollPosition: dimensions.maxScrollPosition
    };
  }
  calculateViewport() {
    let dimensions = this.calculateDimensions();
    let offset = this.getElementsOffset();
    let scrollStartPosition = this.getScrollStartPosition();
    if (scrollStartPosition > dimensions.scrollLength + offset && !(this.parentScroll instanceof Window)) {
      scrollStartPosition = dimensions.scrollLength;
    } else {
      scrollStartPosition -= offset;
    }
    scrollStartPosition = Math.max(0, scrollStartPosition);
    let pageInfo = this.calculatePageInfo(scrollStartPosition, dimensions);
    let newPadding = this.calculatePadding(pageInfo.startIndexWithBuffer, dimensions);
    let newScrollLength = Math.round(dimensions.scrollLength);
    return {
      startIndex: pageInfo.startIndex,
      endIndex: pageInfo.endIndex,
      startIndexWithBuffer: pageInfo.startIndexWithBuffer,
      endIndexWithBuffer: pageInfo.endIndexWithBuffer,
      padding: Math.round(newPadding),
      scrollLength: newScrollLength,
      scrollbarLength: newScrollLength + offset,
      scrollStartPosition: pageInfo.scrollStartPosition,
      scrollEndPosition: pageInfo.scrollEndPosition,
      maxScrollPosition: pageInfo.maxScrollPosition
    };
  }
  static ɵfac = function VirtualScrollerComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VirtualScrollerComponent)(ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(NgZone), ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(PLATFORM_ID), ɵɵdirectiveInject("virtual-scroller-default-options", 8));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _VirtualScrollerComponent,
    selectors: [["virtual-scroller"], ["", "virtualScroller", ""]],
    contentQueries: function VirtualScrollerComponent_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuery(dirIndex, _c0, 5, ElementRef);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.containerElementRef = _t.first);
      }
    },
    viewQuery: function VirtualScrollerComponent_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(_c1, 7, ElementRef)(_c2, 7, ElementRef);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.contentElementRef = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.invisiblePaddingElementRef = _t.first);
      }
    },
    hostVars: 8,
    hostBindings: function VirtualScrollerComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassProp("horizontal", ctx.horizontal)("vertical", !ctx.horizontal)("selfScroll", !ctx.parentScroll)("rtl", ctx.RTL);
      }
    },
    inputs: {
      executeRefreshOutsideAngularZone: "executeRefreshOutsideAngularZone",
      enableUnequalChildrenSizes: "enableUnequalChildrenSizes",
      RTL: "RTL",
      useMarginInsteadOfTranslate: "useMarginInsteadOfTranslate",
      modifyOverflowStyleOfParentScroll: "modifyOverflowStyleOfParentScroll",
      stripedTable: "stripedTable",
      scrollbarWidth: "scrollbarWidth",
      scrollbarHeight: "scrollbarHeight",
      childWidth: "childWidth",
      childHeight: "childHeight",
      ssrChildWidth: "ssrChildWidth",
      ssrChildHeight: "ssrChildHeight",
      ssrViewportWidth: "ssrViewportWidth",
      ssrViewportHeight: "ssrViewportHeight",
      bufferAmount: "bufferAmount",
      scrollAnimationTime: "scrollAnimationTime",
      resizeBypassRefreshThreshold: "resizeBypassRefreshThreshold",
      scrollThrottlingTime: "scrollThrottlingTime",
      scrollDebounceTime: "scrollDebounceTime",
      checkResizeInterval: "checkResizeInterval",
      items: "items",
      compareItems: "compareItems",
      horizontal: "horizontal",
      parentScroll: "parentScroll"
    },
    outputs: {
      vsUpdate: "vsUpdate",
      vsChange: "vsChange",
      vsStart: "vsStart",
      vsEnd: "vsEnd"
    },
    exportAs: ["virtualScroller"],
    standalone: false,
    features: [ɵɵNgOnChangesFeature],
    ngContentSelectors: _c4,
    decls: 7,
    vars: 0,
    consts: [["invisiblePadding", ""], ["content", ""], [1, "total-padding"], [1, "scrollable-content"]],
    template: function VirtualScrollerComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef(_c3);
        ɵɵprojection(0);
        ɵɵelement(1, "div", 2, 0);
        ɵɵelementStart(3, "div", 3, 1);
        ɵɵprojection(5, 1);
        ɵɵelementEnd();
        ɵɵprojection(6, 2);
      }
    },
    styles: ["[_nghost-%COMP%]{position:relative;display:block;-webkit-overflow-scrolling:touch}.horizontal.selfScroll[_nghost-%COMP%]{overflow-y:visible;overflow-x:auto}.horizontal.selfScroll.rtl[_nghost-%COMP%]{transform:scaleX(-1)}.vertical.selfScroll[_nghost-%COMP%]{overflow-y:auto;overflow-x:visible}.scrollable-content[_ngcontent-%COMP%]{top:0;left:0;width:100%;height:100%;max-width:100vw;max-height:100vh;position:absolute}.scrollable-content[_ngcontent-%COMP%]    >*{box-sizing:border-box}.horizontal[_nghost-%COMP%]{white-space:nowrap}.horizontal[_nghost-%COMP%]   .scrollable-content[_ngcontent-%COMP%]{display:flex}.horizontal[_nghost-%COMP%]   .scrollable-content[_ngcontent-%COMP%]    >*{flex-shrink:0;flex-grow:0;white-space:initial}.horizontal.rtl[_nghost-%COMP%]   .scrollable-content[_ngcontent-%COMP%]    >*{transform:scaleX(-1)}.total-padding[_ngcontent-%COMP%]{width:1px;opacity:0}.horizontal[_nghost-%COMP%]   .total-padding[_ngcontent-%COMP%]{height:100%}"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VirtualScrollerComponent, [{
    type: Component,
    args: [{
      selector: "virtual-scroller,[virtualScroller]",
      exportAs: "virtualScroller",
      template: `
        <ng-content select="[tab-header]"></ng-content>
        <div class="total-padding" #invisiblePadding></div>
        <div class="scrollable-content" #content>
            <ng-content></ng-content>
        </div>
        <ng-content select="[tab-footer]"></ng-content>
    `,
      host: {
        "[class.horizontal]": "horizontal",
        "[class.vertical]": "!horizontal",
        "[class.selfScroll]": "!parentScroll",
        "[class.rtl]": "RTL"
      },
      standalone: false,
      styles: [":host{position:relative;display:block;-webkit-overflow-scrolling:touch}:host.horizontal.selfScroll{overflow-y:visible;overflow-x:auto}:host.horizontal.selfScroll.rtl{transform:scaleX(-1)}:host.vertical.selfScroll{overflow-y:auto;overflow-x:visible}.scrollable-content{top:0;left:0;width:100%;height:100%;max-width:100vw;max-height:100vh;position:absolute}.scrollable-content ::ng-deep>*{box-sizing:border-box}:host.horizontal{white-space:nowrap}:host.horizontal .scrollable-content{display:flex}:host.horizontal .scrollable-content ::ng-deep>*{flex-shrink:0;flex-grow:0;white-space:initial}:host.horizontal.rtl .scrollable-content ::ng-deep>*{transform:scaleX(-1)}.total-padding{width:1px;opacity:0}:host.horizontal .total-padding{height:100%}\n"]
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: Renderer2
  }, {
    type: NgZone
  }, {
    type: ChangeDetectorRef
  }, {
    type: Object,
    decorators: [{
      type: Inject,
      args: [PLATFORM_ID]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: ["virtual-scroller-default-options"]
    }]
  }], {
    executeRefreshOutsideAngularZone: [{
      type: Input
    }],
    enableUnequalChildrenSizes: [{
      type: Input
    }],
    RTL: [{
      type: Input
    }],
    useMarginInsteadOfTranslate: [{
      type: Input
    }],
    modifyOverflowStyleOfParentScroll: [{
      type: Input
    }],
    stripedTable: [{
      type: Input
    }],
    scrollbarWidth: [{
      type: Input
    }],
    scrollbarHeight: [{
      type: Input
    }],
    childWidth: [{
      type: Input
    }],
    childHeight: [{
      type: Input
    }],
    ssrChildWidth: [{
      type: Input
    }],
    ssrChildHeight: [{
      type: Input
    }],
    ssrViewportWidth: [{
      type: Input
    }],
    ssrViewportHeight: [{
      type: Input
    }],
    bufferAmount: [{
      type: Input
    }],
    scrollAnimationTime: [{
      type: Input
    }],
    resizeBypassRefreshThreshold: [{
      type: Input
    }],
    scrollThrottlingTime: [{
      type: Input
    }],
    scrollDebounceTime: [{
      type: Input
    }],
    checkResizeInterval: [{
      type: Input
    }],
    items: [{
      type: Input
    }],
    compareItems: [{
      type: Input
    }],
    horizontal: [{
      type: Input
    }],
    parentScroll: [{
      type: Input
    }],
    vsUpdate: [{
      type: Output
    }],
    vsChange: [{
      type: Output
    }],
    vsStart: [{
      type: Output
    }],
    vsEnd: [{
      type: Output
    }],
    contentElementRef: [{
      type: ViewChild,
      args: ["content", {
        read: ElementRef,
        static: true
      }]
    }],
    invisiblePaddingElementRef: [{
      type: ViewChild,
      args: ["invisiblePadding", {
        read: ElementRef,
        static: true
      }]
    }],
    containerElementRef: [{
      type: ContentChild,
      args: ["container", {
        read: ElementRef,
        static: false
      }]
    }]
  });
})();
var VirtualScrollerModule = class _VirtualScrollerModule {
  static ɵfac = function VirtualScrollerModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VirtualScrollerModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _VirtualScrollerModule,
    declarations: [VirtualScrollerComponent],
    imports: [CommonModule],
    exports: [VirtualScrollerComponent]
  });
  static ɵinj = ɵɵdefineInjector({
    providers: [{
      provide: "virtual-scroller-default-options",
      useFactory: VIRTUAL_SCROLLER_DEFAULT_OPTIONS_FACTORY
    }],
    imports: [CommonModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VirtualScrollerModule, [{
    type: NgModule,
    args: [{
      exports: [VirtualScrollerComponent],
      declarations: [VirtualScrollerComponent],
      imports: [CommonModule],
      providers: [{
        provide: "virtual-scroller-default-options",
        useFactory: VIRTUAL_SCROLLER_DEFAULT_OPTIONS_FACTORY
      }]
    }]
  }], null, null);
})();
export {
  VIRTUAL_SCROLLER_DEFAULT_OPTIONS_FACTORY,
  VirtualScrollerComponent,
  VirtualScrollerModule
};
//# sourceMappingURL=@iharbeck_ngx-virtual-scroller.js.map
