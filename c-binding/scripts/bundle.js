#!/usr/bin/env node
/**
 * TypeScript를 Duktape 호환 JavaScript (ES5)로 번들링
 *
 * 1. esbuild로 TypeScript 번들링
 * 2. Babel로 ES5로 변환
 * 3. Lookbehind 정규식을 대체 함수로 변환
 */
const esbuild = require('esbuild');
const babel = require('@babel/core');
const fs = require('fs');
const path = require('path');

/**
 * Lookbehind 에뮬레이션 헬퍼 함수
 * Duktape에서 실행될 런타임 코드
 */
const LOOKBEHIND_POLYFILL = `
// Lookbehind 에뮬레이션 헬퍼
var __lookbehindMatch = function(text, pattern, negativeLookbehindPatterns, positiveLookbehindPatterns) {
  // Lookbehind 패턴을 제거한 정규식으로 매치
  var matches = [];
  var regex = new RegExp(pattern, 'g');
  var match;
  
  while ((match = regex.exec(text)) !== null) {
    var position = match.index;
    var beforeText = text.substring(0, position);
    var isValid = true;
    
    // Negative lookbehind 검사: 앞에 이 패턴이 없어야 함
    for (var i = 0; i < negativeLookbehindPatterns.length; i++) {
      var nlb = negativeLookbehindPatterns[i];
      if (nlb && new RegExp(nlb + '$').test(beforeText)) {
        isValid = false;
        break;
      }
    }
    
    // Positive lookbehind 검사: 앞에 이 패턴이 있어야 함
    if (isValid && positiveLookbehindPatterns.length > 0) {
      var hasPositive = false;
      for (var j = 0; j < positiveLookbehindPatterns.length; j++) {
        var plb = positiveLookbehindPatterns[j];
        if (plb && new RegExp(plb + '$').test(beforeText)) {
          hasPositive = true;
          break;
        }
      }
      if (!hasPositive && positiveLookbehindPatterns.some(function(p) { return p; })) {
        isValid = false;
      }
    }
    
    if (isValid) {
      matches.push({
        match: match[0],
        index: position,
        groups: match.slice(1)
      });
    }
  }
  
  return matches;
};

// 간단한 lookbehind 제거 정규식 실행 (정확도 낮지만 대부분 동작)
var __safeRegex = function(patternStr) {
  // Lookbehind 패턴 제거
  var cleaned = patternStr
    .replace(/\\(\\?<!([^)]+)\\)/g, '')  // negative lookbehind 제거
    .replace(/\\(\\?<=([^)]+)\\)/g, ''); // positive lookbehind 제거
  
  try {
    return new RegExp(cleaned, 'g');
  } catch (e) {
    // 정규식 생성 실패 시 원본 시도
    try {
      return new RegExp(patternStr, 'g');
    } catch (e2) {
      return null;
    }
  }
};
`;

/**
 * ES2017+ 메서드 폴리필 (Duktape에서 지원하지 않는 메서드들)
 */
const ES_POLYFILLS = `
// String.prototype.padStart 폴리필
if (!String.prototype.padStart) {
  String.prototype.padStart = function(targetLength, padString) {
    targetLength = targetLength >> 0;
    padString = String(typeof padString !== 'undefined' ? padString : ' ');
    if (this.length >= targetLength) {
      return String(this);
    }
    targetLength = targetLength - this.length;
    if (targetLength > padString.length) {
      padString += padString.repeat(Math.ceil(targetLength / padString.length));
    }
    return padString.slice(0, targetLength) + String(this);
  };
}

// String.prototype.padEnd 폴리필
if (!String.prototype.padEnd) {
  String.prototype.padEnd = function(targetLength, padString) {
    targetLength = targetLength >> 0;
    padString = String(typeof padString !== 'undefined' ? padString : ' ');
    if (this.length >= targetLength) {
      return String(this);
    }
    targetLength = targetLength - this.length;
    if (targetLength > padString.length) {
      padString += padString.repeat(Math.ceil(targetLength / padString.length));
    }
    return String(this) + padString.slice(0, targetLength);
  };
}

// String.prototype.repeat 폴리필
if (!String.prototype.repeat) {
  String.prototype.repeat = function(count) {
    if (this == null) throw new TypeError('can\\'t convert ' + this + ' to object');
    var str = '' + this;
    count = +count;
    if (count < 0 || count === Infinity) throw new RangeError('Invalid count value');
    count = Math.floor(count);
    if (str.length === 0 || count === 0) return '';
    var result = '';
    while (count > 0) {
      if (count & 1) result += str;
      count >>>= 1;
      if (count) str += str;
    }
    return result;
  };
}

// Array.prototype.includes 폴리필
if (!Array.prototype.includes) {
  Array.prototype.includes = function(searchElement, fromIndex) {
    if (this == null) throw new TypeError('Array.prototype.includes called on null or undefined');
    var o = Object(this);
    var len = o.length >>> 0;
    if (len === 0) return false;
    var n = fromIndex | 0;
    var k = Math.max(n >= 0 ? n : len + n, 0);
    while (k < len) {
      if (o[k] === searchElement) return true;
      k++;
    }
    return false;
  };
}

// String.prototype.includes 폴리필
if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    if (typeof start !== 'number') start = 0;
    if (start + search.length > this.length) return false;
    return this.indexOf(search, start) !== -1;
  };
}

// Array.prototype.find 폴리필
if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this == null) throw new TypeError('Array.prototype.find called on null or undefined');
    if (typeof predicate !== 'function') throw new TypeError('predicate must be a function');
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    for (var i = 0; i < length; i++) {
      var value = list[i];
      if (predicate.call(thisArg, value, i, list)) return value;
    }
    return undefined;
  };
}

// Array.prototype.findIndex 폴리필
if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
    if (this == null) throw new TypeError('Array.prototype.findIndex called on null or undefined');
    if (typeof predicate !== 'function') throw new TypeError('predicate must be a function');
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    for (var i = 0; i < length; i++) {
      if (predicate.call(thisArg, list[i], i, list)) return i;
    }
    return -1;
  };
}

// Object.entries 폴리필
if (!Object.entries) {
  Object.entries = function(obj) {
    var ownProps = Object.keys(obj);
    var i = ownProps.length;
    var resArray = new Array(i);
    while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]];
    return resArray;
  };
}

// Object.values 폴리필  
if (!Object.values) {
  Object.values = function(obj) {
    var ownProps = Object.keys(obj);
    var i = ownProps.length;
    var resArray = new Array(i);
    while (i--) resArray[i] = obj[ownProps[i]];
    return resArray;
  };
}
`;

/**
 * Lookbehind 정규식을 안전한 버전으로 변환
 */
function transformLookbehindRegex(code) {
  // 정규식 리터럴에서 lookbehind 패턴 찾기 및 제거
  // /(?<!pattern)/ 와 /(?<=pattern)/ 를 제거

  // new RegExp("...") 형태의 lookbehind 제거
  let transformed = code.replace(/new RegExp\("([^"]*\(\?<[!=][^"]+)"/g, (match, pattern) => {
    // lookbehind 패턴 제거
    const cleaned = pattern
      .replace(/\(\?<![^)]+\)/g, '') // negative lookbehind
      .replace(/\(\?<=[^)]+\)/g, ''); // positive lookbehind
    return `new RegExp("${cleaned}"`;
  });

  // 정규식 리터럴 형태도 처리: /(?<!...)pattern/g
  transformed = transformed.replace(/\/(\(\?<[!=][^/]+)\/([gimsuy]*)/g, (match, pattern, flags) => {
    const cleaned = pattern.replace(/\(\?<![^)]+\)/g, '').replace(/\(\?<=[^)]+\)/g, '');
    return `/${cleaned}/${flags}`;
  });

  return transformed;
}

async function bundle() {
  const outfile = path.join(__dirname, '../src/autotag_bundle.js');

  try {
    // Step 1: esbuild로 TypeScript 번들링
    await esbuild.build({
      entryPoints: [path.join(__dirname, '../src/bundle-entry.ts')],
      bundle: true,
      outfile,
      format: 'iife',
      target: 'es2015',
      minify: false,
      platform: 'neutral',
      charset: 'utf8',
    });

    console.log(`Bundle created: ${outfile}`);

    // Step 2: 번들 파일 읽기
    let bundle = fs.readFileSync(outfile, 'utf8');

    // Step 3: Babel로 ES5로 변환
    const result = babel.transformSync(bundle, {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: { ie: '11' },
            modules: false,
          },
        ],
      ],
      compact: false,
    });

    if (result && result.code) {
      bundle = result.code;
      console.log(`Bundle transformed to ES5 with Babel`);
    }

    // Step 4: Lookbehind 정규식 제거/변환
    bundle = transformLookbehindRegex(bundle);
    console.log(`Lookbehind patterns removed from regex`);

    // Step 5: ES 폴리필 추가
    bundle = ES_POLYFILLS + '\n' + bundle;
    console.log(`ES polyfills added`);

    // 후처리된 번들 저장
    fs.writeFileSync(outfile, bundle);

    // 번들 파일을 C 문자열로 변환 (헤더 포함용)
    const escaped = bundle
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n"\n"')
      .replace(/\r/g, '');

    const headerContent = `// Auto-generated file - do not edit
// Generated by: node scripts/bundle.js

#ifndef AUTOTAG_BUNDLE_H
#define AUTOTAG_BUNDLE_H

static const char* AUTOTAG_JS_BUNDLE = 
"${escaped}";

#endif // AUTOTAG_BUNDLE_H
`;

    const headerFile = path.join(__dirname, '../src/autotag_bundle.h');
    fs.writeFileSync(headerFile, headerContent);
    console.log(`Header created: ${headerFile}`);
  } catch (error) {
    console.error('Bundle failed:', error);
    process.exit(1);
  }
}

bundle();
