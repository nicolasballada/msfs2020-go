#!/bin/bash
set -e

[ -x "$(command -v go-bindata)" ] && go generate github.com/nicolasballada/msfs2020-go/simconnect
[ -x "$(command -v go-bindata)" ] && go generate github.com/nicolasballada/msfs2020-go/vfrmap
[ -x "$(command -v go-bindata)" ] && go generate github.com/nicolasballada/msfs2020-go/vfrmap/html/leafletjs
[ -x "$(command -v go-bindata)" ] && go generate github.com/nicolasballada/msfs2020-go/vfrmap/html/css
[ -x "$(command -v go-bindata)" ] && go generate github.com/nicolasballada/msfs2020-go/vfrmap/html/js

build_time=$(date -u +'%Y-%m-%d_%T')
set +e
build_version="1"
set -e

CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build -ldflags "-s -w -X main.buildVersion=$build_version -X main.buildTime=$build_time" -v github.com/nicolasballada/msfs2020-go/vfrmap
