# 概要
Gitの練習をするためのプロジェクト。
## 小言
見ているよ❤

> 地球は青かった

ガガーリン

1. あいうえお
2. かきくけこ

## フォーマット用コマンド

### 1. 余分なスペースの除去

以下のコマンドで実行可能です
```bash
./scripts/clean-spaces
```

内部で実行しているコマンドの概要:

1. インデントのみ存在する行から、インデントをなくす  
```bash
cd git-practice
grep -lIREZ --exclude=".*" --exclude-dir=".*" "^ +$" | xargs -0 sed -Ei "s/^ +$//g"
```

2. 行末のスペースをなくす(mdファイルでは意味のある情報のため除外)  
```bash
cd git-practice
grep -lIREZ --exclude=".*" --exclude="*.md" --exclude-dir=".*" "^(.*[^ ]) +$" | xargs -0 sed -Ei "s/^(.*[^ ]) +$/\1/g"
```