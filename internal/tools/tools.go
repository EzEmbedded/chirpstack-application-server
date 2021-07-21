// +build tools

package tools

import (
	_ "hub.fastgit.org/golang/protobuf/protoc-gen-go"
	_ "hub.fastgit.org/goreleaser/goreleaser"
	_ "hub.fastgit.org/goreleaser/nfpm"
	_ "golang.org/x/lint/golint"
	_ "golang.org/x/tools/cmd/stringer"
)
