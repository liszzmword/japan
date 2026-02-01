#!/bin/bash
# 변경사항을 GitHub에 푸시
cd "$(dirname "$0")"
git add -A
if [ -n "$1" ]; then
  git commit -m "$1"
else
  echo -n "커밋 메시지 (기본: 업데이트): "
  read msg
  git commit -m "${msg:-업데이트}"
fi
git push origin main
