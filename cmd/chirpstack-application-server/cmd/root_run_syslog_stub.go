// +build windows

package cmd

import (
	log "github.com.cnpmjs.org/sirupsen/logrus"

	"github.com.cnpmjs.org/brocaar/chirpstack-application-server/internal/config"
)

func setSyslog() error {
	if config.C.General.LogToSyslog {
		log.Fatal("syslog logging is not supported on Windows")
	}

	return nil
}
