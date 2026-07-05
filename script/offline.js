#!/usr/bin/env node

/**
 * ================================================
 *  uni-app 项目单机化（离线化）脚本 v2
 * ================================================
 *
 * 策略：直接匹配所有 tdesign.gtimg.com 链接，去重下载，全局替换。
 *
 * 用法：
 *   node script/offline.js               # 默认：字体 base64 + 图片下载
 *   node script/offline.js --mode download  # 全部下载到本地 static/offline/
 *   node script/offline.js --dry-run        # 仅扫描，不修改
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");
const crypto = require("crypto");

// ==================== 配置 ====================

const ROOT = path.resolve(__dirname, "..");

// 要扫描的目录（相对于 ROOT）
const SCAN_DIRS = ["uni_modules", "pages", "pages-more", "style", "components"];

// 排除的文件/目录
const EXCLUDE = [
  /[\\/]node_modules[\\/]/,
  /[\\/]unpackage[\\/]/,
  /[\\/]\.git[\\/]/,
  /[\\/]\.github[\\/]/,
  /changelog\.md$/i,
  /readme\.md$/i,
  /\.d\.ts$/, // 类型声明文件跳过
];

// CDN 域名（只处理这些域名下的资源）
const CDN_DOMAINS = ["tdesign.gtimg.com"];

// offline 资源本地目录
const OFFLINE_DIR = "static/offline";

// ==================== 工具函数 ====================

function parseArgs() {
  const args = process.argv.slice(2);
  const modeIdx = args.indexOf("--mode");
  return {
    mode: modeIdx >= 0 ? args[modeIdx + 1] || "base64" : "base64",
    dryRun: args.includes("--dry-run"),
  };
}

function shouldExclude(filepath) {
  return EXCLUDE.some((p) => p.test(filepath));
}

/** 判断 URL 资源类型 */
function classifyUrl(url) {
  const lower = url.toLowerCase().replace(/[?#].*$/, "");
  // 只保留 .woff，其余字体格式全部跳过（减少包体积）：
  // - EOT：现代浏览器完全不支持（仅 IE9- 需要），内嵌 base64 还会报 "OTS parsing error"
  // - WOFF2/TTF/OTF：woff 已能覆盖所有现代浏览器，保留多格式纯属冗余
  // - SVG 字体：已废弃，仅旧版 iOS Safari 需要
  if (/\.(eot|woff2|ttf|otf)$/.test(lower)) return "font-skip";
  if (/\.svg$/.test(lower) && lower.includes("/fonts/")) return "font-skip";
  if (/\.woff$/.test(lower)) return "font";
  if (/\.(png|jpe?g|gif|webp|ico|bmp|svg)$/.test(lower)) return "image";
  if (/\.(mp3|mp4|wav|ogg)$/.test(lower)) return "media";
  // 无扩展名 → CDN 基路径（如 https://tdesign.gtimg.com/mobile/demos）
  if (!/\.[a-z0-9]{2,8}$/i.test(lower)) return "base";
  return "unknown";
}

/** 扫描目录，递归收集所有非排除文件 */
function collectFiles(dirs) {
  const results = [];
  for (const dir of dirs) {
    const absDir = path.resolve(ROOT, dir);
    if (!fs.existsSync(absDir)) continue;
    _walk(absDir, results);
  }
  return results;
}

function _walk(absDir, results) {
  let entries;
  try {
    entries = fs.readdirSync(absDir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(absDir, entry.name);
    const relPath = path.relative(ROOT, fullPath);

    if (shouldExclude(relPath)) continue;

    if (entry.isDirectory()) {
      _walk(fullPath, results);
    } else if (entry.isFile()) {
      results.push({ absPath: fullPath, relPath });
    }
  }
}

/** 从文件内容中提取所有 tdesign.gtimg.com 资源 URL */
function extractUrls(content) {
  const urls = new Set();
  // 匹配 https://tdesign.gtimg.com/... 直到遇到 空格/引号/换行/括号
  const re = /https:\/\/tdesign\.gtimg\.com\/[^\s'"`\n()]+/gi;
  let match;
  while ((match = re.exec(content)) !== null) {
    urls.add(match[0]);
  }
  return urls;
}

/** 下载文件，返回 Buffer */
function downloadFile(url) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith("https") ? https : http;
    const t = setTimeout(() => reject(new Error("timeout")), 15000);

    proto
      .get(url, (res) => {
        clearTimeout(t);
        if (
          [301, 302, 303, 307, 308].includes(res.statusCode) &&
          res.headers.location
        ) {
          return downloadFile(res.headers.location).then(resolve, reject);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      })
      .on("error", (err) => {
        clearTimeout(t);
        reject(err);
      });
  });
}

/** 生成本地路径：static/offline/<cdn-path> */
function makeLocalPath(url) {
  const u = new URL(url);
  // 路径部分去掉开头的 /
  const subPath = u.pathname.replace(/^\//, "");
  return path.posix.join("/", OFFLINE_DIR, subPath);
}

/** 生成 base64 Data URI */
function makeDataUri(buffer, url) {
  const ext = path.extname(new URL(url).pathname).toLowerCase();
  const mimes = {
    ".woff2": "font/woff2",
    ".woff": "font/woff",
    ".ttf": "font/truetype",
    ".otf": "font/opentype",
    ".eot": "application/vnd.ms-fontobject",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
  };
  const mime = mimes[ext] || "application/octet-stream";
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

/** 字符串全局替换（非正则），返回替换次数 */
function replaceAll(str, from, to) {
  let count = 0;
  let result = str;
  let idx = result.indexOf(from);
  while (idx !== -1) {
    result =
      result.substring(0, idx) + to + result.substring(idx + from.length);
    count++;
    idx = result.indexOf(from, idx + to.length);
  }
  return { result, count };
}

// ==================== 主流程 ====================

async function main() {
  const { mode, dryRun } = parseArgs();

  const labels = {
    base64: "字体→base64 + 图片→本地",
    download: "全部下载到本地",
  };
  console.log("=".repeat(50));
  console.log("  uni-app 离线化脚本 v2");
  console.log(`  模式: ${labels[mode] || mode}`);
  if (dryRun) console.log("  [DRY-RUN] 仅扫描，不修改");
  console.log("=".repeat(50) + "\n");

  // ── 1. 扫描所有文件 ──
  console.log("📂 扫描项目中...");
  const allFiles = collectFiles(SCAN_DIRS);
  console.log(`   共 ${allFiles.length} 个文件\n`);

  // ── 2. 提取所有 tdesign.gtimg.com URL（去重） ──
  console.log("🔍 提取远程资源 URL...");
  const urlFiles = new Map(); // url → [{ absPath, relPath }]

  for (const file of allFiles) {
    let content;
    try {
      content = fs.readFileSync(file.absPath, "utf-8");
    } catch {
      continue;
    }

    const urls = extractUrls(content);
    for (const url of urls) {
      if (!urlFiles.has(url)) urlFiles.set(url, []);
      urlFiles.get(url).push(file);
    }
  }

  const uniqueUrls = [...urlFiles.keys()];
  console.log(`   发现 ${uniqueUrls.length} 个唯一资源 URL，分布如下：\n`);

  if (uniqueUrls.length === 0) {
    console.log("✅ 未发现 tdesign.gtimg.com 远程资源。\n");
    return;
  }

  // ── 3. 打印扫描结果 ──
  const fontUrls = [];
  const imageUrls = [];
  const baseUrls = [];
  const eotUrls = []; // EOT 字体：现代浏览器不支持，会从 CSS 中剔除

  for (const url of uniqueUrls) {
    const type = classifyUrl(url);
    const files = urlFiles.get(url);
    const dedup = files.length;
    const label =
      type === "font"
        ? "🔤"
        : type === "font-skip"
          ? "🚫"
          : type === "image"
            ? "🖼️"
            : type === "base"
              ? "🏠"
              : "📦";
    const dupInfo = dedup > 1 ? ` [复用 ${dedup} 次]` : "";
    const skipNote =
      type === "font-skip" ? " [EOT-跳过，从 CSS 中剔除]" : "";
    console.log(`  ${label} ${url}${dupInfo}${skipNote}`);
    for (const f of files) {
      console.log(`     └─ ${f.relPath}`);
    }
    console.log("");
    if (type === "font") fontUrls.push(url);
    else if (type === "font-skip") eotUrls.push(url);
    else if (type === "image") imageUrls.push(url);
    else if (type === "base") baseUrls.push(url);
  }

  console.log(
    `  统计: 字体 ${fontUrls.length} | EOT-跳过 ${eotUrls.length} | 图片 ${imageUrls.length} | 基路径 ${baseUrls.length}\n`,
  );

  if (dryRun) {
    console.log("🔚 DRY-RUN 完成，未修改任何文件。\n");
    return;
  }

  // ── 4. 下载资源（每个 URL 只下一次，base 类型跳过） ──
  console.log("📥 下载资源...\n");
  const urlResult = new Map(); // url → { buffer, localPath, dataUri, eotSkip }

  for (const url of uniqueUrls) {
    const type = classifyUrl(url);
    const localPath = makeLocalPath(url);
    const absLocalPath = path.join(ROOT, localPath);

    // EOT 字体：现代浏览器不支持，跳过下载，并标记为需从 CSS 中清理
    if (type === "font-skip") {
      urlResult.set(url, {
        buffer: null,
        localPath: null,
        dataUri: null,
        type,
        eotSkip: true,
      });
      console.log(`  🚫 ${url} (EOT，跳过下载)`);
      continue;
    }

    // CDN 基路径：不下载，直接替换为本地路径
    if (type === "base") {
      const label = "🏠";
      urlResult.set(url, { buffer: null, localPath, dataUri: null, type });
      console.log(`  ${label} ${url} → ${localPath} (基路径，仅替换)`);
      continue;
    }

    try {
      const buffer = await downloadFile(url);
      const sizeKB = (buffer.length / 1024).toFixed(1);
      const label = type === "font" ? "🔤" : "🖼️";

      if (mode === "base64" && type === "font") {
        // 字体 → base64 data URI
        const dataUri = makeDataUri(buffer, url);
        urlResult.set(url, { buffer, dataUri, localPath: null, type });
        console.log(
          `  ${label} ${path.basename(new URL(url).pathname)} → base64 (${sizeKB}KB)`,
        );
      } else {
        // 图片/普通资源 → 下载到 static/offline/
        const dir = path.dirname(absLocalPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(absLocalPath, buffer);
        urlResult.set(url, { buffer, localPath, dataUri: null, type });
        console.log(
          `  ${label} ${path.basename(new URL(url).pathname)} → ${localPath} (${sizeKB}KB)`,
        );
      }
    } catch (err) {
      console.log(`  ❌ ${url}: ${err.message}`);
    }
  }
  console.log("");

  // ── 5. 全局替换 ──
  console.log("✏️  替换文件中的远程 URL...\n");
  const modified = new Set();
  const allFilesMap = new Map(); // absPath → content (lazy cache)

  for (const [url, result] of urlResult) {
    if (!result) continue;

    // EOT：直接从 CSS 中剔除整段 url(...) [format('...')]?
    // 同时清理其前/后多余的逗号空白，避免 src: , url(...) 这种语法错误。
    if (result.eotSkip) {
      const targetFiles = urlFiles.get(url) || [];
      for (const file of targetFiles) {
        let content = allFilesMap.get(file.absPath);
        if (content === undefined) {
          content = fs.readFileSync(file.absPath, "utf-8");
          allFilesMap.set(file.absPath, content);
        }
        if (!content.includes(url)) continue;

        // 转义 url 用于正则，匹配 url('xxx.eot[?#iefix]') 及其后可选的 format(...)
        const escUrl = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        // 形如：url('xxx.eot') 或 url('xxx.eot?#iefix')，可能后跟 format('...')
        const eotEntryRe = new RegExp(
          `url\\(['\"]?${escUrl}(?:\\?#iefix)?['\"]?\\)(\\s*format\\(['\"][^'\"]+['\"]\\))?`,
          "g",
        );
        let newContent = content.replace(eotEntryRe, "");
        // 清理因移除留下的多余逗号：",   ," → ","； "src:   ," → "src: "；末尾 ", ;" → ";"
        newContent = newContent
          .replace(/,\s*,/g, ",")
          .replace(/(src\s*:)\s*,\s*/gi, "$1 ")
          .replace(/,\s*;/g, ";");

        if (newContent !== content) {
          allFilesMap.set(file.absPath, newContent);
          modified.add(file.relPath);
        }
      }
      continue;
    }

    const replacement = result.dataUri || result.localPath;
    if (!replacement) continue;

    // 需要替换的文件：包含该 URL 的所有文件
    const targetFiles = urlFiles.get(url) || [];
    for (const file of targetFiles) {
      let content = allFilesMap.get(file.absPath);
      if (content === undefined) {
        content = fs.readFileSync(file.absPath, "utf-8");
        allFilesMap.set(file.absPath, content);
      }

      if (!content.includes(url)) continue;

      const { result: newContent, count } = replaceAll(
        content,
        url,
        replacement,
      );
      if (count > 0) {
        allFilesMap.set(file.absPath, newContent);
        modified.add(file.relPath);
      }
    }
  }

  // 写回修改后的文件
  for (const relPath of modified) {
    const absPath = path.resolve(ROOT, relPath);
    const content = allFilesMap.get(absPath);
    if (content !== undefined) {
      fs.writeFileSync(absPath, content, "utf-8");
      console.log(`  📝 ${relPath}`);
    }
  }

  console.log(`\n  共修改 ${modified.size} 个文件\n`);
  console.log("=".repeat(50));
  console.log("  ✅ 离线化完成！");
  console.log("=".repeat(50) + "\n");
}

main().catch((err) => {
  console.error("\n❌ ", err.message);
  process.exit(1);
});
