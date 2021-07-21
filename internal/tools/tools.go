// +build tools

package tools

import (
	_ "github.com.cnpmjs.org/golang/protobuf/protoc-gen-go"
	_ "github.com.cnpmjs.org/goreleaser/goreleaser"
	_ "github.com.cnpmjs.org/goreleaser/nfpm"
	_ "golang.org/x/lint/golint"
	_ "golang.org/x/tools/cmd/stringer"
)
